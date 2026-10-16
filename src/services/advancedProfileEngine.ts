// MARGAM — Advanced Matrimonial Profile & Privacy Engine
// Enforces Server-Side Progressive Disclosure, Multi-Dimensional AI Compatibility,
// Field-Level Access Control, Life Map Journeys, and Granular Sharing.

import {
  AdvancedMatrimonialProfile,
  FilteredDisplayProfile,
  LockedSectionState,
  SectionAccessRequest,
  GranularIntroductionShareSelection,
  PrivacyPreset,
  FieldVisibilityLevel,
  AccessRequestSection,
  AccessRequestStatus,
  MargamProfileItem,
  LifeMapTimeline,
  HoroscopeData,
  AboutMeData,
} from '../types/profile';
import { CURRENT_USER } from '../constants/mockData';
import { MARGAM_CANDIDATES } from './margamService';

// -------------------------------------------------------------
// In-Memory Database Stores (Simulating Production Backend Tables)
// -------------------------------------------------------------

const profilesStore = new Map<string, AdvancedMatrimonialProfile>();
const accessRequestsStore = new Map<string, SectionAccessRequest>();

// Seed sample section access request for Sumod from Ananya
const sampleAccessReq: SectionAccessRequest = {
  id: 'access_req_ananya_horoscope',
  requesterId: 'usr-candidate-ananya',
  requesterName: 'Ananya Sharma',
  requesterAvatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  targetUserId: 'usr-current-sumod',
  section: 'horoscope',
  note: 'Would love to review horoscope alignment for mutual family discussions.',
  status: 'pending',
  createdAt: '2026-03-01T10:30:00Z',
};
accessRequestsStore.set(sampleAccessReq.id, sampleAccessReq);

const connectionStagesStore = new Map<string, 'stranger' | 'match' | 'mutual_interest' | 'request_sent' | 'connection'>();
const grantedAccessStore = new Map<string, Set<string>>(); // `${targetUserId}:${requesterId}` -> Set of granted sections

// -------------------------------------------------------------
// Default Master Profile Initializer (Sumod - Primary Account)
// -------------------------------------------------------------

export function createDefaultSumodProfile(): AdvancedMatrimonialProfile {
  return {
    id: 'usr-current-sumod',
    userId: 'usr-current-sumod',
    createdAt: '2026-01-15T08:00:00Z',
    updatedAt: new Date().toISOString(),
    profileCreatedFor: 'self',
    discoverability: 'discoverable',
    activityStatus: 'online',
    viewHistoryEnabled: true,
    privacyPreset: 'balanced',

    aboutMe: {
      bio: "I enjoy building technology products, travelling across Kerala, exploring quiet cafes with good books, and spending quality time with family. Looking for a thoughtful, authentic partner who values open conversations and wants to build a meaningful, joyful life together.",
      isAiGenerated: false,
      visibility: 'public',
    },

    basicDetails: {
      fullName: 'Sumod Nandan',
      displayName: 'Sumod',
      birthDate: '1993-06-24', // Internal exact: 24 June 1993
      age: 33,
      birthYear: 1993,
      dobDisplayMode: 'age_only', // Publicly displays "33 years" (Never exposes exact birth date)
      gender: 'Male',
      heightCm: 178, // Stored exact: 178 cm
      heightDisplayMode: 'feet_inches', // Displays "5'10\""
      bodyType: 'Athletic',
      weightKg: 74,
      physicalStatus: 'Normal',
      maritalStatus: 'Never Married',
      motherTongue: 'Malayalam',
      languagesSpoken: ['Malayalam', 'English', 'Hindi', 'Tamil'],
      bloodGroup: 'O+',
      profileCreatedFor: 'self',
      visibility: {
        fullName: 'matches',
        age: 'public',
        dateOfBirth: 'private', // Strictly private full date of birth
        height: 'public',
        maritalStatus: 'public',
        languages: 'public',
        bloodGroup: 'matches',
        profileCreatedFor: 'public',
      },
    },

    religionCulture: {
      religion: 'Hindu',
      denomination: 'South Indian',
      communityCaste: 'Nair',
      subCommunity: 'Kiriyath',
      castePreference: 'Caste No Bar',
      casteAcceptance: true,
      religiousPractice: 'Spiritual but not Religious',
      dietaryPreference: 'Vegetarian',
      culturalBackground: 'Progressive traditional Kerala family with rooted cultural values.',
      preferNotToDisclose: false,
      visibility: {
        religion: 'matches',
        communityCaste: 'request_access', // Community requires request access
        subCommunity: 'private',
        religiousPractice: 'matches',
        dietaryPreference: 'public',
      },
    },

    location: {
      country: 'India',
      state: 'Kerala',
      district: 'Ernakulam',
      city: 'Kochi',
      area: 'Kakkanad',
      nativePlace: 'Thrissur',
      workLocation: 'Infopark, Kochi',
      preferredLocationAfterMarriage: 'Kochi or Thrissur',
      openToRelocation: true,
      countriesWillingToRelocate: ['UAE', 'Singapore', 'UK', 'Canada'],
      safeDisplayArea: 'Kochi area', // Anti-triangulation safe buffer
      internalLat: 10.0159,
      internalLng: 76.3419,
      visibility: {
        cityArea: 'public',
        nativePlace: 'matches',
        workLocation: 'connections',
        relocationPreferences: 'public',
      },
    },

    educationCareer: {
      highestEducation: "Bachelor's Degree",
      degree: 'B.Tech in Computer Engineering',
      fieldOfStudy: 'Computer Science & Engineering',
      institution: 'Model Engineering College, Kochi',
      university: 'CUSAT',
      certifications: ['AWS Certified Solutions Architect', 'Product Design Leadership'],
      employmentStatus: 'Business owner',
      company: 'Antigravity Studio Ltd',
      jobTitle: 'Founder & Tech Entrepreneur',
      industry: 'Software & Technology',
      workLocation: 'Kochi & Remote',
      yearsOfExperience: 9,
      incomeRange: '₹25–50 LPA',
      incomeVisibility: 'visible_as_range', // Never exact salary, only privacy range
      workModel: 'Hybrid',
      careerDescription: 'Building innovative mobile products and design systems.',
      futureCareerPlans: 'Scaling independent ventures and building a lifestyle destination café.',
      businessProfile: {
        isBusinessOwner: true,
        businessType: 'Technology Venture & Hospitality Concept',
        industry: 'Digital Media & Specialty Coffee',
        businessStage: 'Established',
        futureBusinessGoals: 'Launch a heritage boutique café in Fort Kochi with a curated library.',
        businessInterests: ['Specialty Coffee', 'SaaS', 'Boutique Hospitality'],
        investmentInterests: ['Local Artisan Businesses', 'Angel Investments'],
        startupInterests: ['Design Tools', 'Ethical Matrimony'],
        visibility: 'public',
      },
      visibility: {
        education: 'public',
        institution: 'matches',
        profession: 'public',
        company: 'matches',
        income: 'private', // Income is strictly Private by default
      },
    },

    family: {
      fatherStatus: 'Retired',
      fatherProfession: 'Retired Banking Official',
      motherStatus: 'Homemaker',
      motherProfession: 'Homemaker',
      familyType: 'Nuclear',
      familyValues: 'Moderate',
      familyBackground: 'Respectable, educated family originally from Thrissur, settled in Kochi.',
      familyLocation: 'Kochi, Kerala',
      financialBackground: 'Upper Middle Class',
      familyExpectations: 'Looking for a warm, grounded individual who values family ties and mutual respect.',
      brothersCount: 0,
      marriedBrothersCount: 0,
      sistersCount: 1,
      marriedSistersCount: 1,
      siblingSummaryOnly: true, // Privacy summary: "1 elder sister, married"
      siblings: [
        {
          relation: 'Sister',
          maritalStatus: 'Married',
          profession: 'Doctor (Pediatrician)',
          location: 'Bangalore',
        },
      ],
      visibility: {
        parents: 'request_access', // Family details require explicit access request
        siblings: 'matches',
        familyBackground: 'request_access',
        familyValues: 'matches',
      },
    },

    lifestyle: {
      smoking: 'Non-Smoker',
      alcohol: 'Non-Drinker',
      foodPreference: 'Vegetarian',
      fitnessLevel: 'High',
      exerciseFrequency: 'Daily',
      sleepPattern: 'Early Riser',
      travelFrequency: 'Frequently',
      socialLifestyle: 'Ambivert',
      pets: 'Love Pets',
      weekendLifestyle: 'Cycling, exploring coffee spots, reading, and weekend drives.',
      personalHabits: ['Fitness Enthusiast', 'Mindful Living', 'Minimalist'],
      visibility: 'public',
    },

    hobbiesInterests: {
      selectedHobbies: [
        'Photography',
        'Travel',
        'Books',
        'Coffee Brewing',
        'Cycling',
        'Technology',
        'Nature Walks',
        'Architecture',
      ],
      visibility: 'public',
    },

    margams: [
      {
        id: 'mg-cafe',
        name: 'Café Business',
        emoji: '☕',
        category: 'Business',
        intent: 'want_to_build',
        intentDescription: 'Want to build a specialty café with a reading corner together',
        isCoreMargam: true,
        customLifeGoal: 'Establish an artisan destination café in Fort Kochi',
        visibility: 'public',
      },
      {
        id: 'mg-travel',
        name: 'International Travel',
        emoji: '✈',
        category: 'Travel',
        intent: 'experience_together',
        intentDescription: 'Annual international travel to explore heritage towns and food cultures',
        isCoreMargam: true,
        customLifeGoal: 'Visit Kyoto, Zurich, and coastal Portugal',
        visibility: 'public',
      },
      {
        id: 'mg-fitness',
        name: 'Mindful Living & Fitness',
        emoji: '🏋',
        category: 'Lifestyle',
        intent: 'regular',
        intentDescription: 'Daily healthy routine, morning workouts, and mindful living',
        isCoreMargam: true,
        customLifeGoal: 'Maintain an active, healthy, and energized everyday lifestyle',
        visibility: 'public',
      },
      {
        id: 'mg-photo',
        name: 'Street Photography',
        emoji: '📷',
        category: 'Creativity',
        intent: 'enjoy',
        intentDescription: 'Capturing candid life moments and cultural landscapes',
        isCoreMargam: false,
        visibility: 'public',
      },
    ],

    lifeMap: {
      now: ['Technology Leadership', 'Weekend Coffee Roasting', 'Active Fitness Routine'],
      next: ['Partner with future spouse on life goals', 'Initiate Boutique Café Blueprint'],
      threeToFiveYears: ['Launch Destination Café', 'Travel across Japan & Scandinavia'],
      future: ['Thriving sustainable businesses', 'Warm family life with children and books'],
      visibility: 'matches',
    },

    horoscope: {
      placeOfBirth: 'Thrissur',
      dateOfBirth: '1993-06-24',
      birthTime: '06:45 AM',
      birthMinute: '45',
      nakshatra: 'Makayiram (Mrigashira)',
      rasi: 'Mithunam (Gemini)',
      jathakamType: 'Kerala Traditional',
      janmaSistaDasa: 'Mars Dasa 3y 4m',
      allowCompatibilityCalculation: true, // Compatibility allowed without exposing chart details
      visibility: 'request_access', // Strictly locked until requested
    },

    partnerPreferences: {
      ageRange: {
        value: { min: 25, max: 32 },
        importance: 'high_priority',
        flexibility: 'preferred',
      },
      heightRangeCm: {
        value: { min: 155, max: 175 },
        importance: 'preference',
        flexibility: 'open',
      },
      locations: {
        value: ['Kochi', 'Thrissur', 'Ernakulam', 'Trivandrum', 'Bangalore', 'Open to Relocation'],
        importance: 'preference',
        flexibility: 'open',
      },
      religions: {
        value: ['Hindu', 'Spiritual', 'Any'],
        importance: 'preference',
        flexibility: 'open',
      },
      communities: {
        value: ['Nair', 'Caste No Bar', 'Open'],
        importance: 'preference',
        flexibility: 'open',
      },
      educationLevels: {
        value: ["Bachelor's Degree", "Master's Degree", 'Professional Degree'],
        importance: 'high_priority',
        flexibility: 'preferred',
      },
      professions: {
        value: ['Software / Tech', 'Creative / Design', 'Marketing', 'Entrepreneur', 'Healthcare', 'Education'],
        importance: 'preference',
        flexibility: 'open',
      },
      dietaryPreferences: {
        value: ['Vegetarian', 'Eggetarian', 'Non-Vegetarian (Flexible)'],
        importance: 'nice_to_have',
        flexibility: 'open',
      },
      smoking: {
        value: 'Non-Smoker',
        importance: 'deal_breaker', // Deal breaker preference
        flexibility: 'required',
      },
      alcohol: {
        value: 'Non-Drinker / Occasional',
        importance: 'preference',
        flexibility: 'preferred',
      },
      familyTypes: {
        value: ['Nuclear', 'Joint', 'Flexible'],
        importance: 'open',
        flexibility: 'not_important',
      },
      relocationAcceptance: {
        value: true,
        importance: 'preference',
        flexibility: 'open',
      },
      coreMargamsWanted: {
        value: ['Café Business', 'Travel', 'Fitness', 'Creativity'],
        importance: 'high_priority',
        flexibility: 'preferred',
      },
      lifeGoalsAlignment: {
        value: ['Entrepreneurship', 'International Travel', 'Family Harmony'],
        importance: 'high_priority',
        flexibility: 'preferred',
      },
      visibility: 'matches',
    },

    photos: [
      {
        id: 'sumod-photo-1',
        url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=85',
        caption: 'Weekend in Kochi',
        isPrimary: true,
        visibility: 'public',
        uploadedAt: '2026-01-20T10:00:00Z',
      },
      {
        id: 'sumod-photo-2',
        url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
        caption: 'Mountain trail trek',
        isPrimary: false,
        visibility: 'public',
        uploadedAt: '2026-01-22T14:30:00Z',
      },
      {
        id: 'sumod-photo-3',
        url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
        caption: 'Reading at artisan roastery',
        isPrimary: false,
        visibility: 'matches',
        uploadedAt: '2026-02-01T09:15:00Z',
      },
    ],

    futureGoals: {
      marriageTimeline: 'Within 1–2 Years',
      familyPlanningPreference: 'Want children in future',
      longTermDreams: [
        'Co-create a welcoming destination café',
        'Travel the world with a curious life partner',
        'Support community social impact projects',
      ],
      visibility: 'matches',
    },

    verification: {
      phoneVerified: true,
      emailVerified: true,
      idVerified: true,
      photoSelfieVerified: true,
      educationVerified: true,
      employmentVerified: true,
      isOverallVerified: true,
      verifiedBadgeText: 'Verified Member',
    },

    fieldPermissions: {},
  };
}

// -------------------------------------------------------------
// Reference Candidate Profile Initializer (Ananya - Reference Match)
// -------------------------------------------------------------

export function createAnanyaMasterProfile(): AdvancedMatrimonialProfile {
  return {
    id: 'margam-cand-1',
    userId: 'margam-cand-1',
    createdAt: '2026-02-10T12:00:00Z',
    updatedAt: new Date().toISOString(),
    profileCreatedFor: 'self',
    discoverability: 'discoverable',
    activityStatus: 'active_recently',
    viewHistoryEnabled: true,
    privacyPreset: 'balanced',

    aboutMe: {
      bio: "I love meaningful conversations, good coffee, and exploring new places. I'm passionate about building a small, cozy café someday and would love a partner who shares a similar dream and enjoys a balanced, active lifestyle.",
      isAiGenerated: true,
      visibility: 'public',
    },

    basicDetails: {
      fullName: 'Ananya Menon',
      displayName: 'Ananya',
      birthDate: '1999-04-12', // 27 years old
      age: 27,
      birthYear: 1999,
      dobDisplayMode: 'age_only',
      gender: 'Female',
      heightCm: 163, // 5'4"
      heightDisplayMode: 'feet_inches',
      bodyType: 'Slim',
      physicalStatus: 'Normal',
      maritalStatus: 'Never Married',
      motherTongue: 'Malayalam',
      languagesSpoken: ['Malayalam', 'English', 'Hindi'],
      profileCreatedFor: 'self',
      visibility: {
        fullName: 'matches',
        age: 'public',
        dateOfBirth: 'private',
        height: 'public',
        maritalStatus: 'public',
        languages: 'public',
        bloodGroup: 'private',
        profileCreatedFor: 'public',
      },
    },

    religionCulture: {
      religion: 'Hindu',
      denomination: 'South Indian',
      communityCaste: 'Nair',
      castePreference: 'Open',
      casteAcceptance: true,
      religiousPractice: 'Practicing',
      dietaryPreference: 'Non-Vegetarian',
      culturalBackground: 'Rooted Kerala family based in Ernakulam with contemporary values.',
      visibility: {
        religion: 'matches',
        communityCaste: 'request_access',
        subCommunity: 'private',
        religiousPractice: 'matches',
        dietaryPreference: 'public',
      },
    },

    location: {
      country: 'India',
      state: 'Kerala',
      district: 'Ernakulam',
      city: 'Kochi',
      area: 'Fort Kochi',
      nativePlace: 'Ernakulam',
      workLocation: 'Panampilly Nagar, Kochi',
      preferredLocationAfterMarriage: 'Kochi / Open to Relocation',
      openToRelocation: true,
      countriesWillingToRelocate: ['UAE', 'UK', 'Australia'],
      safeDisplayArea: 'Kochi area',
      internalLat: 9.9656,
      internalLng: 76.2421,
      visibility: {
        cityArea: 'public',
        nativePlace: 'matches',
        workLocation: 'connections',
        relocationPreferences: 'public',
      },
    },

    educationCareer: {
      highestEducation: "Master's Degree",
      degree: 'MBA in Brand Strategy & Marketing',
      fieldOfStudy: 'Marketing & Digital Communication',
      institution: 'Rajagiri Centre for Business Studies',
      employmentStatus: 'Employed',
      company: 'Omni Media Group',
      jobTitle: 'Marketing Professional',
      industry: 'Brand Marketing & Creative Strategy',
      yearsOfExperience: 5,
      incomeRange: '₹10–15 LPA',
      incomeVisibility: 'visible_as_range',
      workModel: 'Hybrid',
      careerDescription: 'Leading growth marketing for consumer lifestyle brands.',
      futureCareerPlans: 'Transition into independent food & beverage brand consulting while launching a specialty café.',
      businessProfile: {
        isBusinessOwner: false,
        businessType: 'Boutique Café & Bakery',
        industry: 'Food & Beverage / Specialty Hospitality',
        businessStage: 'Startup',
        futureBusinessGoals: 'Co-found a destination café with an artisan bakery and book nook.',
        businessInterests: ['Specialty Coffee', 'Bakery', 'Hospitality'],
        investmentInterests: ['F&B Ventures'],
        startupInterests: ['Artisan Roastery'],
        visibility: 'public',
      },
      visibility: {
        education: 'public',
        institution: 'matches',
        profession: 'public',
        company: 'matches',
        income: 'private', // Income private by default
      },
    },

    family: {
      fatherStatus: 'Business',
      fatherProfession: 'Contractor & Merchant',
      motherStatus: 'Homemaker',
      familyType: 'Nuclear',
      familyValues: 'Moderate',
      familyBackground: 'Warm, educated family residing in Ernakulam with strong ties.',
      familyLocation: 'Kochi',
      financialBackground: 'Upper Middle Class',
      brothersCount: 1,
      marriedBrothersCount: 1,
      sistersCount: 0,
      marriedSistersCount: 0,
      siblingSummaryOnly: true, // "1 brother, married"
      siblings: [
        {
          relation: 'Brother',
          maritalStatus: 'Married',
          profession: 'Civil Engineer',
          location: 'Kochi',
        },
      ],
      visibility: {
        parents: 'request_access',
        siblings: 'matches',
        familyBackground: 'request_access',
        familyValues: 'matches',
      },
    },

    lifestyle: {
      smoking: 'Non-Smoker',
      alcohol: 'Occasional Drinker',
      foodPreference: 'Non-Vegetarian',
      fitnessLevel: 'Moderate',
      exerciseFrequency: '3-4 times a week',
      sleepPattern: 'Early Riser',
      travelFrequency: 'Frequently',
      socialLifestyle: 'Ambivert',
      pets: 'Love Pets',
      weekendLifestyle: 'Baking sourdough, visiting seaside cafes, and coastal cycling.',
      visibility: 'public',
    },

    hobbiesInterests: {
      selectedHobbies: [
        'Photography',
        'Travel',
        'Cooking & Baking',
        'Music',
        'Fitness',
        'Nature',
        'Literature',
      ],
      visibility: 'public',
    },

    margams: [
      {
        id: 'mg-cafe',
        name: 'Café Business',
        emoji: '☕',
        category: 'Business',
        intent: 'want_to_build',
        intentDescription: 'I want to build a destination cafe together with good coffee and reading corners',
        isCoreMargam: true,
        customLifeGoal: 'Open a warm, travel-inspired café in Fort Kochi',
        visibility: 'public',
      },
      {
        id: 'mg-travel',
        name: 'Travel',
        emoji: '✈',
        category: 'Travel',
        intent: 'regular',
        intentDescription: 'Annual international trips to Japan and Europe',
        isCoreMargam: true,
        visibility: 'public',
      },
      {
        id: 'mg-fitness',
        name: 'Fitness',
        emoji: '🏋',
        category: 'Lifestyle',
        intent: 'regular',
        intentDescription: 'Morning workouts & mindful lifestyle',
        isCoreMargam: true,
        visibility: 'public',
      },
      {
        id: 'mg-photo',
        name: 'Photography',
        emoji: '📷',
        category: 'Creativity',
        intent: 'enjoy',
        intentDescription: 'Capturing street moments and landscapes',
        isCoreMargam: false,
        visibility: 'public',
      },
    ],

    lifeMap: {
      now: ['Brand Marketing Lead', 'Baking & Coffee Courses'],
      next: ['Partner with like-minded spouse', 'Build Specialty Café Concept'],
      threeToFiveYears: ['Operate established café', 'Regular European travels'],
      future: ['Balanced family life with shared creative business and joyful home'],
      visibility: 'matches',
    },

    horoscope: {
      placeOfBirth: 'Ernakulam',
      dateOfBirth: '1999-04-12',
      birthTime: '10:15 AM',
      nakshatra: 'Uthirattathi (Uttara Bhadrapada)',
      rasi: 'Meenam (Pisces)',
      jathakamType: 'Kerala Traditional',
      allowCompatibilityCalculation: true,
      visibility: 'request_access',
    },

    partnerPreferences: {
      ageRange: {
        value: { min: 28, max: 35 },
        importance: 'high_priority',
        flexibility: 'preferred',
      },
      heightRangeCm: {
        value: { min: 170, max: 188 },
        importance: 'preference',
        flexibility: 'preferred',
      },
      locations: {
        value: ['Kochi', 'Ernakulam', 'Thrissur', 'Open to Relocation'],
        importance: 'preference',
        flexibility: 'open',
      },
      religions: {
        value: ['Hindu', 'Any'],
        importance: 'preference',
        flexibility: 'open',
      },
      communities: {
        value: ['Nair', 'Caste No Bar', 'Open'],
        importance: 'preference',
        flexibility: 'open',
      },
      educationLevels: {
        value: ["Bachelor's Degree", "Master's Degree"],
        importance: 'high_priority',
        flexibility: 'preferred',
      },
      professions: {
        value: ['Entrepreneur', 'Tech', 'Marketing', 'Professional'],
        importance: 'preference',
        flexibility: 'open',
      },
      dietaryPreferences: {
        value: ['Vegetarian', 'Non-Vegetarian', 'Flexible'],
        importance: 'nice_to_have',
        flexibility: 'open',
      },
      smoking: {
        value: 'Non-Smoker',
        importance: 'deal_breaker',
        flexibility: 'required',
      },
      alcohol: {
        value: 'Non-Drinker / Occasional',
        importance: 'preference',
        flexibility: 'preferred',
      },
      familyTypes: {
        value: ['Nuclear', 'Joint', 'Flexible'],
        importance: 'open',
        flexibility: 'not_important',
      },
      relocationAcceptance: {
        value: true,
        importance: 'preference',
        flexibility: 'open',
      },
      coreMargamsWanted: {
        value: ['Café Business', 'Travel', 'Fitness'],
        importance: 'high_priority',
        flexibility: 'preferred',
      },
      lifeGoalsAlignment: {
        value: ['Café Business', 'Travel', 'Active Lifestyle'],
        importance: 'high_priority',
        flexibility: 'preferred',
      },
      visibility: 'matches',
    },

    photos: [
      {
        id: 'ananya-photo-1',
        url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=900&auto=format&fit=crop&q=85',
        caption: 'Enjoying pour-over coffee at a heritage cafe',
        isPrimary: true,
        visibility: 'public',
        uploadedAt: '2026-02-12T10:00:00Z',
      },
      {
        id: 'ananya-photo-2',
        url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80',
        caption: 'Weekend walks in Fort Kochi',
        isPrimary: false,
        visibility: 'public',
        uploadedAt: '2026-02-15T15:00:00Z',
      },
      {
        id: 'ananya-photo-3',
        url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&auto=format&fit=crop&q=80',
        isPrimary: false,
        visibility: 'connections',
        uploadedAt: '2026-02-16T12:00:00Z',
      },
    ],

    futureGoals: {
      marriageTimeline: 'Within 1–2 Years',
      familyPlanningPreference: 'Interested in building family life',
      longTermDreams: [
        'Open a specialty café together with partner',
        'Travel to Japan during Cherry Blossom season',
        'Cultivate a warm, balanced home life',
      ],
      visibility: 'matches',
    },

    verification: {
      phoneVerified: true,
      emailVerified: true,
      idVerified: true,
      photoSelfieVerified: true,
      educationVerified: true,
      employmentVerified: true,
      isOverallVerified: true,
      verifiedBadgeText: 'Verified Member',
    },

    fieldPermissions: {},
  };
}

// Initialize default store records
profilesStore.set('usr-current-sumod', createDefaultSumodProfile());
profilesStore.set('margam-cand-1', createAnanyaMasterProfile());

// -------------------------------------------------------------
// Profile Read & Write Operations
// -------------------------------------------------------------

// Dynamic Candidate Profile Generator for Multi-User Biodata
export function createDynamicCandidateMasterProfile(userId: string): AdvancedMatrimonialProfile {
  const margamCand = MARGAM_CANDIDATES.find((c) => c.id === userId);
  const name = margamCand?.name || (userId.startsWith('usr-') ? userId.replace('usr-', '') : 'Candidate');
  const city = margamCand?.city || 'Kochi';
  const area = margamCand?.area || `${city} area`;
  const profession = margamCand?.profession || 'Professional';
  const age = margamCand?.age || 27;
  const bio = margamCand?.bio || 'Thoughtful and ambitious professional looking for a meaningful matrimonial connection based on shared values, clear communication, and mutual respect.';
  const photoUrl = margamCand?.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80';

  return {
    id: userId,
    userId,
    createdAt: '2026-02-15T10:00:00Z',
    updatedAt: new Date().toISOString(),
    profileCreatedFor: 'self',
    discoverability: 'discoverable',
    activityStatus: 'active_recently',
    viewHistoryEnabled: true,
    privacyPreset: 'balanced',

    aboutMe: {
      bio,
      isAiGenerated: false,
      visibility: 'public',
    },

    basicDetails: {
      fullName: name,
      displayName: name,
      birthDate: '1998-04-12',
      age,
      birthYear: 2026 - age,
      dobDisplayMode: 'age_only',
      gender: 'Female',
      heightCm: 165,
      heightDisplayMode: 'feet_inches',
      bodyType: 'Average',
      weightKg: 58,
      physicalStatus: 'Normal',
      maritalStatus: 'Never Married',
      motherTongue: 'Malayalam',
      languagesSpoken: ['Malayalam', 'English'],
      bloodGroup: 'B+',
      profileCreatedFor: 'self',
      visibility: {
        fullName: 'matches',
        age: 'public',
        dateOfBirth: 'private',
        height: 'public',
        maritalStatus: 'public',
        languages: 'public',
        bloodGroup: 'matches',
        profileCreatedFor: 'public',
      },
    },

    religionCulture: {
      religion: 'Hindu',
      denomination: 'South Indian',
      communityCaste: 'Nair',
      castePreference: 'Caste No Bar',
      casteAcceptance: true,
      religiousPractice: 'Spiritual but not Religious',
      dietaryPreference: 'Vegetarian',
      culturalBackground: 'Progressive traditional Kerala family with rooted cultural values.',
      preferNotToDisclose: false,
      visibility: {
        religion: 'matches',
        communityCaste: 'request_access',
        subCommunity: 'private',
        religiousPractice: 'matches',
        dietaryPreference: 'public',
      },
    },

    location: {
      country: 'India',
      state: 'Kerala',
      district: 'Ernakulam',
      city,
      area,
      nativePlace: `${city}, Kerala`,
      workLocation: `${city} Central`,
      preferredLocationAfterMarriage: `${city} or nearby`,
      openToRelocation: true,
      countriesWillingToRelocate: ['India', 'UAE'],
      safeDisplayArea: `${area}, ${city}`,
      internalLat: 10.0159,
      internalLng: 76.3419,
      visibility: {
        cityArea: 'public',
        nativePlace: 'matches',
        workLocation: 'connections',
        relocationPreferences: 'public',
      },
    },

    educationCareer: {
      highestEducation: "Master's Degree",
      degree: 'Master of Business Administration',
      fieldOfStudy: 'Management',
      institution: 'University of Kerala',
      employmentStatus: 'Employed',
      company: 'Leading Enterprise',
      jobTitle: profession,
      industry: 'Professional Services',
      yearsOfExperience: 4,
      incomeRange: '₹10–15 LPA',
      incomeVisibility: 'visible_as_range',
      workModel: 'Hybrid',
      careerDescription: `Working as ${profession} with strong focus on leadership and balanced life goals.`,
      visibility: {
        education: 'public',
        institution: 'matches',
        profession: 'public',
        company: 'matches',
        income: 'private',
      },
    },

    family: {
      fatherStatus: 'Employed',
      fatherProfession: 'Retired Professional',
      motherStatus: 'Homemaker',
      familyType: 'Nuclear',
      familyValues: 'Moderate',
      familyBackground: `Respectable family residing in ${city} with progressive values.`,
      familyLocation: city,
      financialBackground: 'Upper Middle Class',
      brothersCount: 1,
      marriedBrothersCount: 0,
      sistersCount: 0,
      marriedSistersCount: 0,
      siblingSummaryOnly: true,
      visibility: {
        parents: 'request_access',
        siblings: 'matches',
        familyBackground: 'request_access',
        familyValues: 'matches',
      },
    },

    lifestyle: {
      smoking: 'Non-Smoker',
      alcohol: 'Non-Drinker',
      foodPreference: 'Vegetarian',
      fitnessLevel: 'Moderate',
      exerciseFrequency: '3-4 times a week',
      sleepPattern: 'Early Riser',
      travelFrequency: 'Frequently',
      socialLifestyle: 'Ambivert',
      pets: 'Love Pets',
      visibility: 'public',
    },

    hobbiesInterests: {
      selectedHobbies: ['Reading', 'Travel', 'Music', 'Photography'],
      visibility: 'public',
    },

    margams: (margamCand?.sharedMargams || []).map((m, idx) => ({
      id: `mg-cand-${idx}`,
      name: m.name,
      emoji: m.emoji,
      category: 'Lifestyle',
      intent: 'experience_together',
      intentDescription: `Explore ${m.name} together with partner`,
      isCoreMargam: idx === 0,
      visibility: 'public',
    })),

    lifeMap: {
      now: [`Building career as ${profession}`, 'Exploring creative interests'],
      next: ['Planning a balanced wedding', 'Setting up a peaceful home in Kerala'],
      threeToFiveYears: ['Travelling abroad together', 'Growing professionally'],
      future: ['Building long-term financial security', 'Nurturing family warmth'],
      visibility: 'matches',
    },

    horoscope: {
      placeOfBirth: city,
      dateOfBirth: `${new Date().getFullYear() - age}-05-15`,
      birthTime: '08:30 AM',
      birthMinute: '30',
      nakshatra: 'Rohini',
      rasi: 'Vrishabha',
      jathakamType: 'Kerala Traditional',
      allowCompatibilityCalculation: true,
      visibility: 'request_access',
    },

    partnerPreferences: {
      ageRange: {
        value: { min: Math.max(21, age - 3), max: age + 5 },
        importance: 'high_priority',
        flexibility: 'preferred',
      },
      heightRangeCm: {
        value: { min: 160, max: 185 },
        importance: 'preference',
        flexibility: 'open',
      },
      locations: {
        value: [city, 'Kochi', 'Bangalore'],
        importance: 'preference',
        flexibility: 'open',
      },
      religions: {
        value: ['Hindu', 'Spiritual', 'Any'],
        importance: 'preference',
        flexibility: 'open',
      },
      communities: {
        value: ['Any', 'Caste No Bar'],
        importance: 'preference',
        flexibility: 'open',
      },
      educationLevels: {
        value: ["Bachelor's Degree", "Master's Degree"],
        importance: 'preference',
        flexibility: 'open',
      },
      professions: {
        value: ['Tech', 'Design', 'Healthcare', 'Finance', 'Entrepreneurship'],
        importance: 'preference',
        flexibility: 'open',
      },
      dietaryPreferences: {
        value: ['Vegetarian', 'Eggetarian', 'Any'],
        importance: 'nice_to_have',
        flexibility: 'open',
      },
      smoking: {
        value: 'Non-Smoker',
        importance: 'deal_breaker',
        flexibility: 'required',
      },
      alcohol: {
        value: 'Non-Drinker / Occasional',
        importance: 'preference',
        flexibility: 'open',
      },
      familyTypes: {
        value: ['Nuclear', 'Joint', 'Any'],
        importance: 'nice_to_have',
        flexibility: 'open',
      },
      relocationAcceptance: {
        value: true,
        importance: 'preference',
        flexibility: 'open',
      },
      coreMargamsWanted: {
        value: ['Travel', 'Specialty Coffee', 'Fitness'],
        importance: 'preference',
        flexibility: 'open',
      },
      lifeGoalsAlignment: {
        value: ['Work-Life Balance', 'Personal Growth'],
        importance: 'preference',
        flexibility: 'open',
      },
      visibility: 'public',
    },

    photos: [
      {
        id: `${userId}-p1`,
        url: photoUrl,
        caption: `${name} portrait`,
        isPrimary: true,
        visibility: 'public',
        uploadedAt: '2026-02-10T12:00:00Z',
      },
    ],

    futureGoals: {
      marriageTimeline: 'Within 1–2 Years',
      familyPlanningPreference: 'Want children in future',
      longTermDreams: ['Explore Kerala and abroad', 'Build a cozy home together'],
      visibility: 'matches',
    },

    verification: {
      phoneVerified: true,
      emailVerified: true,
      idVerified: true,
      photoSelfieVerified: true,
      educationVerified: true,
      employmentVerified: true,
      isOverallVerified: true,
      verifiedBadgeText: 'Verified Member',
    },

    fieldPermissions: {},
  };
}

export function getMasterProfile(userId: string): AdvancedMatrimonialProfile {
  if (!profilesStore.has(userId)) {
    if (userId === 'usr-current-sumod') {
      profilesStore.set(userId, createDefaultSumodProfile());
    } else if (userId === 'margam-cand-1' || userId.includes('ananya')) {
      profilesStore.set(userId, createAnanyaMasterProfile());
    } else {
      profilesStore.set(userId, createDynamicCandidateMasterProfile(userId));
    }
  }
  return profilesStore.get(userId)!;
}

export function updateMasterProfile(
  userId: string,
  updates: Partial<AdvancedMatrimonialProfile>
): AdvancedMatrimonialProfile {
  const current = getMasterProfile(userId);
  const updated: AdvancedMatrimonialProfile = {
    ...current,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  profilesStore.set(userId, updated);
  return updated;
}

export function resetMasterProfile(userId: string): AdvancedMatrimonialProfile {
  let fresh: AdvancedMatrimonialProfile;
  if (userId === 'usr-current-sumod') {
    fresh = createDefaultSumodProfile();
  } else if (userId === 'margam-cand-1' || userId.includes('ananya')) {
    fresh = createAnanyaMasterProfile();
  } else {
    fresh = createDynamicCandidateMasterProfile(userId);
  }
  profilesStore.set(userId, fresh);
  return fresh;
}

// -------------------------------------------------------------
// Privacy Presets Application
// -------------------------------------------------------------

export function setPrivacyPreset(
  userId: string,
  preset: PrivacyPreset
): AdvancedMatrimonialProfile {
  const profile = getMasterProfile(userId);

  if (preset === 'maximum_privacy') {
    profile.privacyPreset = 'maximum_privacy';
    profile.basicDetails.visibility.fullName = 'connections';
    profile.basicDetails.visibility.age = 'matches';
    profile.religionCulture.visibility.religion = 'request_access';
    profile.religionCulture.visibility.communityCaste = 'private';
    profile.family.visibility.parents = 'request_access';
    profile.family.visibility.siblings = 'request_access';
    profile.family.visibility.familyBackground = 'private';
    profile.educationCareer.visibility.company = 'private';
    profile.educationCareer.visibility.income = 'private';
    profile.educationCareer.incomeVisibility = 'private';
    profile.horoscope.visibility = 'private';
    profile.lifeMap.visibility = 'connections';
  } else if (preset === 'balanced') {
    profile.privacyPreset = 'balanced';
    profile.basicDetails.visibility.fullName = 'matches';
    profile.basicDetails.visibility.age = 'public';
    profile.religionCulture.visibility.religion = 'matches';
    profile.religionCulture.visibility.communityCaste = 'request_access';
    profile.family.visibility.parents = 'request_access';
    profile.family.visibility.siblings = 'matches';
    profile.family.visibility.familyBackground = 'request_access';
    profile.educationCareer.visibility.company = 'matches';
    profile.educationCareer.visibility.income = 'matches';
    profile.educationCareer.incomeVisibility = 'visible_as_range';
    profile.horoscope.visibility = 'request_access';
    profile.lifeMap.visibility = 'matches';
  } else if (preset === 'open') {
    profile.privacyPreset = 'open';
    profile.basicDetails.visibility.fullName = 'matches';
    profile.basicDetails.visibility.age = 'public';
    profile.religionCulture.visibility.religion = 'public';
    profile.religionCulture.visibility.communityCaste = 'matches';
    profile.family.visibility.parents = 'matches';
    profile.family.visibility.siblings = 'matches';
    profile.family.visibility.familyBackground = 'matches';
    profile.educationCareer.visibility.company = 'public';
    profile.educationCareer.visibility.income = 'public';
    profile.educationCareer.incomeVisibility = 'visible_as_range';
    profile.horoscope.visibility = 'matches';
    profile.lifeMap.visibility = 'matches';
  }

  profile.updatedAt = new Date().toISOString();
  profilesStore.set(userId, profile);
  return profile;
}

export function updateFieldVisibility(
  userId: string,
  fieldKey: string,
  level: FieldVisibilityLevel
): AdvancedMatrimonialProfile {
  const profile = getMasterProfile(userId);
  profile.fieldPermissions[fieldKey] = level;
  profile.updatedAt = new Date().toISOString();
  profilesStore.set(userId, profile);
  return profile;
}

// -------------------------------------------------------------
// Profile Completeness Engine
// -------------------------------------------------------------

export function calculateProfileCompleteness(profile: AdvancedMatrimonialProfile): {
  percentage: number;
  missingSections: string[];
  recommendations: string[];
} {
  let score = 0;
  const missing: string[] = [];
  const recommendations: string[] = [];

  // 1. Photos (15%)
  if (profile.photos.length >= 2) {
    score += 15;
  } else if (profile.photos.length === 1) {
    score += 8;
    missing.push('Additional photos');
  } else {
    missing.push('Photos');
    recommendations.push('Adding photos increases profile trust significantly');
  }

  // 2. About Me (12%)
  if (profile.aboutMe.bio && profile.aboutMe.bio.length >= 40) {
    score += 12;
  } else {
    missing.push('About Me');
    recommendations.push('Complete About Me using the AI writing assistant');
  }

  // 3. Basic Details (10%)
  if (profile.basicDetails.age && profile.basicDetails.maritalStatus && profile.basicDetails.heightCm) {
    score += 10;
  }

  // 4. Margams (15% - Core Differentiator)
  if (profile.margams.length >= 3 && profile.margams.some((m) => m.isCoreMargam)) {
    score += 15;
  } else if (profile.margams.length > 0) {
    score += 8;
    missing.push('Core Margams');
    recommendations.push('Select your Top 3 Core Margams to find aligned life partners');
  } else {
    missing.push('Margams');
    recommendations.push('Add your Margams (shared life paths, cafes, travel, fitness)');
  }

  // 5. Life Map (12%)
  if (profile.lifeMap.now.length > 0 && profile.lifeMap.threeToFiveYears.length > 0) {
    score += 12;
  } else {
    missing.push('Life Map');
    recommendations.push('Set milestones on your Life Map timeline to discover shared goals');
  }

  // 6. Education & Career (12%)
  if (profile.educationCareer.highestEducation && profile.educationCareer.jobTitle) {
    score += 12;
  } else {
    missing.push('Education & Career');
  }

  // 7. Family Information (8%)
  if (profile.family.familyType && profile.family.familyBackground) {
    score += 8;
  } else {
    missing.push('Family Information');
  }

  // 8. Lifestyle (8%)
  if (profile.lifestyle.foodPreference && profile.lifestyle.smoking && profile.lifestyle.alcohol) {
    score += 8;
  } else {
    missing.push('Lifestyle Preferences');
  }

  // 9. Partner Preferences (8%)
  if (profile.partnerPreferences.ageRange && profile.partnerPreferences.coreMargamsWanted) {
    score += 8;
  } else {
    missing.push('Partner Preferences');
    recommendations.push('Specify flexible partner preferences for better AI match scoring');
  }

  return {
    percentage: Math.min(100, Math.max(10, score)),
    missingSections: missing,
    recommendations,
  };
}

// -------------------------------------------------------------
// AI About-Me Assistant (Questionnaire -> Structured Synthesis)
// -------------------------------------------------------------

export function generateAiAboutMeDraft(
  arg1: string | {
    whatYouEnjoy?: string;
    whatPassionateAbout?: string;
    lifeYouWant?: string;
    importantValues?: string;
    partnerLookingFor?: string;
  },
  arg2?: {
    whatYouEnjoy?: string;
    whatPassionateAbout?: string;
    lifeYouWant?: string;
    importantValues?: string;
    partnerLookingFor?: string;
  }
): string {
  const answers = (typeof arg1 === 'object' ? arg1 : arg2) || {};
  const enjoy = answers.whatYouEnjoy || 'exploring new places, great coffee conversations, and travelling across Kerala';
  const passion = answers.whatPassionateAbout || 'building creative businesses and living mindfully';
  const values = answers.importantValues || 'honesty, mutual respect, family warmth, and continuous growth';
  const partner = answers.partnerLookingFor || 'someone authentic and kind who wants to build an inspiring life together';

  return `I enjoy ${enjoy}. I am deeply passionate about ${passion}, and in my daily life, I value ${values}. Looking for ${partner}. Excited to explore shared life paths and see where the journey leads.`;
}

export function approveAiAboutMeDraft(
  userId: string,
  approvedBio: string
): AdvancedMatrimonialProfile {
  const profile = getMasterProfile(userId);
  profile.aboutMe.bio = approvedBio;
  profile.aboutMe.draftBio = undefined;
  profile.aboutMe.isAiGenerated = true;
  profile.updatedAt = new Date().toISOString();
  profilesStore.set(userId, profile);
  return profile;
}

// -------------------------------------------------------------
// Server-Side Privacy Authorization Evaluator
// -------------------------------------------------------------

function isAuthorized(
  visibility: FieldVisibilityLevel,
  viewerRelationship: 'stranger' | 'match' | 'mutual_interest' | 'request_sent' | 'connection',
  hasGrantedSectionAccess: boolean = false
): boolean {
  if (visibility === 'private' || visibility === 'ai_matching_only') return false;
  if (hasGrantedSectionAccess) return true;

  switch (visibility) {
    case 'public':
      return true;
    case 'matches':
      return viewerRelationship === 'match' || viewerRelationship === 'mutual_interest' || viewerRelationship === 'request_sent' || viewerRelationship === 'connection';
    case 'mutual_interest':
      return viewerRelationship === 'mutual_interest' || viewerRelationship === 'request_sent' || viewerRelationship === 'connection';
    case 'connections':
      return viewerRelationship === 'connection';
    case 'request_access':
      return hasGrantedSectionAccess;
    default:
      return false;
  }
}

// -------------------------------------------------------------
// Server-Side Sanitized Profile Projection (Zero Client-Side Leaks)
// -------------------------------------------------------------

export function getSanitizedProfileForViewer(
  viewerId: string,
  profileOwnerId: string,
  relationshipOverride?: 'stranger' | 'match' | 'mutual_interest' | 'request_sent' | 'connection'
): FilteredDisplayProfile {
  const owner = getMasterProfile(profileOwnerId);
  const relationship = relationshipOverride || connectionStagesStore.get(`${profileOwnerId}:${viewerId}`) || 'match';

  // Check granted section-level access
  const grantedSections = grantedAccessStore.get(`${profileOwnerId}:${viewerId}`) || new Set<string>();

  // Check pending section requests
  const pendingRequests = Array.from(accessRequestsStore.values()).filter(
    (r) => r.requesterId === viewerId && r.targetUserId === profileOwnerId && r.status === 'pending'
  );
  const pendingSections = new Set(pendingRequests.map((r) => r.section));

  const completeness = calculateProfileCompleteness(owner);

  // Helper to create locked sentinel object
  const createLockedState = (
    section: AccessRequestSection,
    visibility: FieldVisibilityLevel,
    defaultMsg: string
  ): LockedSectionState => {
    const hasPending = pendingSections.has(section);
    return {
      isLocked: true,
      reason: visibility === 'request_access' ? 'requires_access_request' : 'private',
      message: hasPending ? 'Access request pending review by profile owner.' : defaultMsg,
      canRequestAccess: visibility === 'request_access' && !hasPending,
      hasPendingRequest: hasPending,
    };
  };

  // 1. Photos
  const visiblePhotos = owner.photos.filter((p) =>
    isAuthorized(p.visibility, relationship, grantedSections.has('photos'))
  );

  // 2. About Me
  const aboutMeAuthorized = isAuthorized(owner.aboutMe.visibility, relationship, grantedSections.has('full_bio'));
  const aboutMeData = aboutMeAuthorized
    ? { bio: owner.aboutMe.bio, isAiAssisted: owner.aboutMe.isAiGenerated }
    : createLockedState('full_bio', owner.aboutMe.visibility, 'About Me is shared with connected profiles.');

  // 3. Basic Details
  const ageAuthorized = isAuthorized(owner.basicDetails.visibility.age, relationship);
  const heightAuthorized = isAuthorized(owner.basicDetails.visibility.height, relationship);
  const basicAuthorized = ageAuthorized || heightAuthorized;

  // Format age according to dobDisplayMode
  let ageDisplay = `${owner.basicDetails.age} years`;
  if (owner.basicDetails.dobDisplayMode === 'birth_year') {
    ageDisplay = `Born in ${owner.basicDetails.birthYear}`;
  }

  // Format height according to heightDisplayMode
  let heightDisplay = `${owner.basicDetails.heightCm} cm`;
  if (owner.basicDetails.heightDisplayMode === 'feet_inches') {
    const totalInches = Math.round(owner.basicDetails.heightCm / 2.54);
    const feet = Math.floor(totalInches / 12);
    const inches = totalInches % 12;
    heightDisplay = `${feet}'${inches}"`;
  } else if (owner.basicDetails.heightDisplayMode === 'approximate_range') {
    heightDisplay = '175–180 cm';
  }

  const basicDetailsData = basicAuthorized
    ? {
        gender: owner.basicDetails.gender,
        ageDisplay,
        heightDisplay,
        maritalStatus: isAuthorized(owner.basicDetails.visibility.maritalStatus, relationship)
          ? owner.basicDetails.maritalStatus
          : 'Protected',
        motherTongue: owner.basicDetails.motherTongue,
        languages: isAuthorized(owner.basicDetails.visibility.languages, relationship)
          ? owner.basicDetails.languagesSpoken
          : [],
        profileCreatedFor: owner.basicDetails.profileCreatedFor === 'self' ? 'Myself' : 'Family Member',
      }
    : createLockedState('full_bio', 'private', 'Basic details protected.');

  // 4. Religion & Culture
  const religionAuthorized = isAuthorized(owner.religionCulture.visibility.religion, relationship, grantedSections.has('religion'));
  const communityAuthorized = isAuthorized(owner.religionCulture.visibility.communityCaste, relationship, grantedSections.has('religion'));
  const religionData = religionAuthorized
    ? {
        religion: owner.religionCulture.religion,
        denomination: owner.religionCulture.denomination,
        communityCaste: communityAuthorized ? owner.religionCulture.communityCaste : 'Available upon request',
        religiousPractice: owner.religionCulture.religiousPractice,
        dietaryPreference: owner.religionCulture.dietaryPreference,
      }
    : createLockedState('religion', owner.religionCulture.visibility.religion, 'Religious details require access authorization.');

  // 5. Location (Zero GPS or Home Address exposed)
  const locationData = {
    approximateArea: owner.location.safeDisplayArea, // Safe generalized region e.g. "Kochi area"
    nativePlace: isAuthorized(owner.location.visibility.nativePlace, relationship)
      ? owner.location.nativePlace
      : undefined,
    openToRelocation: owner.location.openToRelocation,
  };

  // 6. Education & Career
  const eduAuthorized = isAuthorized(owner.educationCareer.visibility.education, relationship);
  const incomeAuthorized = isAuthorized(owner.educationCareer.visibility.income, relationship, grantedSections.has('income'));
  const eduCareerData = eduAuthorized
    ? {
        highestEducation: owner.educationCareer.highestEducation,
        degree: isAuthorized(owner.educationCareer.visibility.institution, relationship)
          ? owner.educationCareer.degree
          : undefined,
        fieldOfStudy: owner.educationCareer.fieldOfStudy,
        jobTitle: owner.educationCareer.jobTitle,
        industry: owner.educationCareer.industry,
        employmentStatus: owner.educationCareer.employmentStatus,
        incomeDisplay: incomeAuthorized
          ? owner.educationCareer.incomeRange
          : owner.educationCareer.incomeVisibility === 'visible_as_range'
          ? owner.educationCareer.incomeRange
          : 'Locked (Request Access)',
        businessOwner: owner.educationCareer.businessProfile?.isBusinessOwner
          ? {
              businessType: owner.educationCareer.businessProfile.businessType,
              businessStage: owner.educationCareer.businessProfile.businessStage,
            }
          : undefined,
      }
    : createLockedState('income', owner.educationCareer.visibility.education, 'Education and career details protected.');

  // 7. Family Details (Requires Request Access)
  const familyAuthorized = isAuthorized(owner.family.visibility.parents, relationship, grantedSections.has('family'));
  const familyData = familyAuthorized
    ? {
        familyType: owner.family.familyType,
        familyValues: owner.family.familyValues,
        siblingSummary: owner.family.siblingSummaryOnly
          ? `${owner.family.brothersCount} brother(s), ${owner.family.sistersCount} sister(s)`
          : undefined,
        fatherSummary: owner.family.fatherStatus,
        motherSummary: owner.family.motherStatus,
      }
    : createLockedState('family', owner.family.visibility.parents, 'Family background is private. Request access to view parents and family history.');

  // 8. Lifestyle
  const lifestyleAuthorized = isAuthorized(owner.lifestyle.visibility, relationship);
  const lifestyleData = lifestyleAuthorized
    ? {
        foodPreference: owner.lifestyle.foodPreference,
        smoking: owner.lifestyle.smoking,
        alcohol: owner.lifestyle.alcohol,
        fitnessLevel: owner.lifestyle.fitnessLevel,
        sleepPattern: owner.lifestyle.sleepPattern,
        socialLifestyle: owner.lifestyle.socialLifestyle,
        pets: owner.lifestyle.pets,
      }
    : createLockedState('full_bio', owner.lifestyle.visibility, 'Lifestyle details protected.');

  // 9. Margams
  const margamsData = {
    coreMargams: owner.margams.filter((m) => m.isCoreMargam && isAuthorized(m.visibility, relationship)),
    allMargams: owner.margams.filter((m) => isAuthorized(m.visibility, relationship)),
  };

  // 10. Life Map
  const lifeMapAuthorized = isAuthorized(owner.lifeMap.visibility, relationship);
  const lifeMapData = lifeMapAuthorized
    ? owner.lifeMap
    : createLockedState('full_bio', owner.lifeMap.visibility, 'Life Map timeline is visible to mutual matches.');

  // 11. Horoscope
  const horoscopeAuthorized = isAuthorized(owner.horoscope.visibility, relationship, grantedSections.has('horoscope'));
  const horoscopeData = horoscopeAuthorized
    ? {
        isCalculated: true,
        compatibilityAvailable: true,
        nakshatra: owner.horoscope.nakshatra,
        rasi: owner.horoscope.rasi,
      }
    : createLockedState('horoscope', owner.horoscope.visibility, 'Horoscope chart is locked. Request access to view astrological details.');

  // 12. Calculate AI Compatibility Breakdown
  const viewerProfile = getMasterProfile(viewerId);
  const compatibility = calculateAdvancedCompatibility(viewerProfile, owner);

  return {
    id: owner.id,
    displayName: owner.basicDetails.displayName,
    isVerified: owner.verification.isOverallVerified,
    verifiedBadgeText: owner.verification.verifiedBadgeText,
    avatarUrl: visiblePhotos[0]?.url,
    photos: visiblePhotos,
    approximateLocation: owner.location.safeDisplayArea,
    professionSummary: `${owner.educationCareer.jobTitle} • ${owner.educationCareer.industry}`,
    profileCompletionPercentage: completeness.percentage,
    relationshipWithViewer: relationship,

    aboutMe: aboutMeData,
    basicDetails: basicDetailsData,
    religionCulture: religionData,
    location: locationData,
    educationCareer: eduCareerData,
    family: familyData,
    lifestyle: lifestyleData,
    hobbies: isAuthorized(owner.hobbiesInterests.visibility, relationship)
      ? owner.hobbiesInterests.selectedHobbies
      : [],
    margams: margamsData,
    lifeMap: lifeMapData,
    horoscope: horoscopeData,
    partnerPreferencesSummary: {
      ageRangeDisplay: `${owner.partnerPreferences.ageRange.value.min}–${owner.partnerPreferences.ageRange.value.max} years`,
      locationSummary: owner.partnerPreferences.locations.value.slice(0, 3).join(', '),
      dealBreakersSummary: [
        owner.partnerPreferences.smoking.importance === 'deal_breaker' ? 'Non-Smoker required' : '',
      ].filter(Boolean),
    },
    compatibility,
  };
}

// -------------------------------------------------------------
// Live Profile Preview ("What Others See" Simulator)
// -------------------------------------------------------------

export function simulateWhatOthersSee(
  userId: string,
  previewMode: 'public' | 'match' | 'mutual_interest' | 'connection' | 'request_access' | 'stranger',
  grantedSections?: string[]
): FilteredDisplayProfile {
  let mappedRelationship: 'stranger' | 'match' | 'mutual_interest' | 'request_sent' | 'connection' = 'match';

  if (previewMode === 'public' || previewMode === 'stranger') mappedRelationship = 'stranger';
  else if (previewMode === 'match') mappedRelationship = 'match';
  else if (previewMode === 'mutual_interest') mappedRelationship = 'mutual_interest';
  else if (previewMode === 'connection') mappedRelationship = 'connection';
  else if (previewMode === 'request_access') mappedRelationship = 'match';

  if (grantedSections && grantedSections.length > 0) {
    const simKey = `simulated-viewer-id:${userId}`;
    const targetKey = `${userId}:simulated-viewer-id`;
    if (!grantedAccessStore.has(targetKey)) {
      grantedAccessStore.set(targetKey, new Set<string>());
    }
    grantedSections.forEach((s) => grantedAccessStore.get(targetKey)!.add(s));
  }

  return getSanitizedProfileForViewer('simulated-viewer-id', userId, mappedRelationship);
}

// -------------------------------------------------------------
// Advanced Multidimensional AI Compatibility Engine
// -------------------------------------------------------------

export interface AdvancedCompatibilityResult {
  overallPercentage: number;
  categoryScores: {
    marriagePreferences: number;
    lifestyle: number;
    margams: number;
    lifeGoals: number;
    location: number;
    communication: number;
  };
  whyYouMatched: string[];
  thingsToDiscuss: { topic: string; yourValue: string; theirValue: string; note: string }[];
  howYouFitTheirPreferences: { criterion: string; status: 'match' | 'partial' | 'difference'; note: string }[];
}

export function calculateAdvancedCompatibility(
  userA: AdvancedMatrimonialProfile,
  userB: AdvancedMatrimonialProfile
): AdvancedCompatibilityResult {
  const whyYouMatched: string[] = [];
  const thingsToDiscuss: { topic: string; yourValue: string; theirValue: string; note: string }[] = [];
  const howYouFit: { criterion: string; status: 'match' | 'partial' | 'difference'; note: string }[] = [];

  // 1. Margams Alignment (High Weight: 25%)
  const sharedMargams = userB.margams.filter((mB) => {
    const nameB = mB.name.toLowerCase();
    const catB = mB.category.toLowerCase();
    return userA.margams.some((mA) => {
      const nameA = mA.name.toLowerCase();
      const catA = mA.category.toLowerCase();
      return (
        nameA === nameB ||
        nameA.includes(nameB) ||
        nameB.includes(nameA) ||
        (catA === catB && (
          (nameA.includes('fitness') && nameB.includes('fitness')) ||
          (nameA.includes('travel') && nameB.includes('travel')) ||
          (nameA.includes('cafe') && nameB.includes('cafe')) ||
          (nameA.includes('photo') && nameB.includes('photo'))
        ))
      );
    });
  });
  const maxPossibleShared = Math.min(userA.margams.length, userB.margams.length);
  const margamScore = Math.min(100, Math.round((sharedMargams.length / Math.max(1, maxPossibleShared)) * 40 + 55));

  for (const m of sharedMargams) {
    whyYouMatched.push(`Shared Margam: ${m.name} (${m.intentDescription})`);
  }

  // 2. Life Goals & Life Map Alignment (20%)
  const userANowAndNext = [...userA.lifeMap.now, ...userA.lifeMap.next, ...userA.lifeMap.threeToFiveYears];
  const userBNowAndNext = [...userB.lifeMap.now, ...userB.lifeMap.next, ...userB.lifeMap.threeToFiveYears];
  let sharedGoals = 0;
  for (const gA of userANowAndNext) {
    for (const gB of userBNowAndNext) {
      if (gA.toLowerCase().includes('cafe') && gB.toLowerCase().includes('cafe')) sharedGoals++;
      else if (gA.toLowerCase().includes('travel') && gB.toLowerCase().includes('travel')) sharedGoals++;
      else if (gA.toLowerCase().includes('business') && gB.toLowerCase().includes('business')) sharedGoals++;
    }
  }
  const lifeGoalsScore = Math.min(100, 60 + sharedGoals * 15);
  if (sharedGoals > 0) {
    whyYouMatched.push(`${sharedGoals} shared life milestones on your Life Map timelines`);
  }

  // 3. Lifestyle Alignment (20%)
  let lifestylePoints = 70;
  if (userA.lifestyle.foodPreference === userB.lifestyle.foodPreference) {
    lifestylePoints += 15;
    whyYouMatched.push(`Same food preference: ${userA.lifestyle.foodPreference}`);
  } else {
    thingsToDiscuss.push({
      topic: 'Dietary Preference',
      yourValue: userA.lifestyle.foodPreference,
      theirValue: userB.lifestyle.foodPreference,
      note: 'You have different dietary preferences; discuss dining habits.',
    });
  }

  if (userA.lifestyle.smoking === userB.lifestyle.smoking) {
    lifestylePoints += 10;
  }
  if (userA.lifestyle.fitnessLevel === userB.lifestyle.fitnessLevel) {
    lifestylePoints += 5;
    whyYouMatched.push('Both share an active and mindful fitness lifestyle');
  }
  const lifestyleScore = Math.min(100, lifestylePoints);

  // 4. Marriage Preferences & Timeline (15%)
  let marriageScore = 80;
  if (userA.futureGoals.marriageTimeline === userB.futureGoals.marriageTimeline) {
    marriageScore = 95;
    whyYouMatched.push(`Similar marriage timeline: ${userA.futureGoals.marriageTimeline}`);
  } else {
    thingsToDiscuss.push({
      topic: 'Marriage Timeline',
      yourValue: userA.futureGoals.marriageTimeline,
      theirValue: userB.futureGoals.marriageTimeline,
      note: 'Timelines differ slightly; discuss expectations.',
    });
  }

  // 5. Location & Relocation (10%)
  let locationScore = 85;
  if (userA.location.city.toLowerCase() === userB.location.city.toLowerCase()) {
    locationScore = 95;
    whyYouMatched.push(`Both based in ${userA.location.city}`);
  } else if (userA.location.openToRelocation && userB.location.openToRelocation) {
    locationScore = 85;
    whyYouMatched.push('Both open to relocation across regions');
  } else {
    thingsToDiscuss.push({
      topic: 'Location & Relocation',
      yourValue: userA.location.safeDisplayArea,
      theirValue: userB.location.safeDisplayArea,
      note: 'Check compatibility regarding living location after marriage.',
    });
  }

  // 6. Communication & Languages (10%)
  const userBLangs = new Set(userB.basicDetails.languagesSpoken);
  const commonLangs = userA.basicDetails.languagesSpoken.filter((l) => userBLangs.has(l));
  const commScore = commonLangs.length > 0 ? 90 : 70;
  if (commonLangs.length > 0) {
    whyYouMatched.push(`Fluent in ${commonLangs.join(', ')}`);
  }

  // Fit against their preferences
  const theirPref = userB.partnerPreferences;
  if (userA.basicDetails.age >= theirPref.ageRange.value.min && userA.basicDetails.age <= theirPref.ageRange.value.max) {
    howYouFit.push({
      criterion: 'Age',
      status: 'match',
      note: `Age ${userA.basicDetails.age} is within their preferred ${theirPref.ageRange.value.min}–${theirPref.ageRange.value.max} range.`,
    });
  } else {
    howYouFit.push({
      criterion: 'Age',
      status: 'difference',
      note: `Age ${userA.basicDetails.age} is outside their ideal range.`,
    });
  }

  if (userA.educationCareer.highestEducation.toLowerCase().includes('bachelor') || userA.educationCareer.highestEducation.toLowerCase().includes('master')) {
    howYouFit.push({
      criterion: 'Education',
      status: 'match',
      note: `${userA.educationCareer.highestEducation} satisfies their education preference.`,
    });
  }

  if (userA.lifestyle.smoking === 'Non-Smoker') {
    howYouFit.push({
      criterion: 'Smoking Habits',
      status: 'match',
      note: 'Meets their non-negotiable deal breaker preference.',
    });
  }

  // Calculate overall weighted score
  const overallPercentage = Math.round(
    margamScore * 0.25 +
    lifeGoalsScore * 0.20 +
    lifestyleScore * 0.20 +
    marriageScore * 0.15 +
    locationScore * 0.10 +
    commScore * 0.10
  );

  return {
    overallPercentage: Math.max(50, Math.min(99, overallPercentage)),
    categoryScores: {
      marriagePreferences: marriageScore,
      lifestyle: lifestyleScore,
      margams: margamScore,
      lifeGoals: lifeGoalsScore,
      location: locationScore,
      communication: commScore,
    },
    whyYouMatched,
    thingsToDiscuss,
    howYouFitTheirPreferences: howYouFit,
  };
}

// -------------------------------------------------------------
// Access Request Workflow (Owner Consent Architecture)
// -------------------------------------------------------------

export function requestSectionAccess(
  requesterId: string,
  targetUserId: string,
  section: AccessRequestSection,
  note?: string
): SectionAccessRequest {
  const requester = getMasterProfile(requesterId);
  const requestId = `access_req_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  const newRequest: SectionAccessRequest = {
    id: requestId,
    requesterId,
    requesterName: requester.basicDetails.displayName,
    requesterAvatarUrl: requester.photos[0]?.url,
    targetUserId,
    section,
    note: note || `Requested access to view your ${section} details.`,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  accessRequestsStore.set(requestId, newRequest);
  return newRequest;
}

export function getSectionAccessRequestsForOwner(ownerUserId: string): SectionAccessRequest[] {
  return Array.from(accessRequestsStore.values()).filter(
    (req) => req.targetUserId === ownerUserId
  );
}

export function respondToSectionAccessRequest(
  requestId: string,
  decision: AccessRequestStatus
): SectionAccessRequest {
  const request = accessRequestsStore.get(requestId);
  if (!request) throw new Error(`Access request ${requestId} not found`);

  request.status = decision;
  request.respondedAt = new Date().toISOString();

  if (decision === 'allowed' || decision === 'allowed_once' || decision === 'allowed_until_connection_ends') {
    const key = `${request.targetUserId}:${request.requesterId}`;
    if (!grantedAccessStore.has(key)) {
      grantedAccessStore.set(key, new Set<string>());
    }
    grantedAccessStore.get(key)!.add(request.section);
  }

  accessRequestsStore.set(requestId, request);
  return request;
}

// -------------------------------------------------------------
// Granular Introduction Sharing Architecture
// -------------------------------------------------------------

export interface ActiveIntroductionRequest {
  id: string;
  requesterId: string;
  recipientId: string;
  message: string;
  sharedFields: GranularIntroductionShareSelection;
  status: 'pending' | 'accepted' | 'declined' | 'accepted_selected' | 'more_info_requested' | 'withdrawn';
  counterSharedFields?: GranularIntroductionShareSelection;
  createdAt: string;
  updatedAt?: string;
  selectedInterestReasons?: string[];
  includeMatchingDetails?: boolean;
}

const introRequestsStore = new Map<string, ActiveIntroductionRequest>();

export function getIntroRequestById(requestId: string): ActiveIntroductionRequest | undefined {
  return introRequestsStore.get(requestId);
}

export function sendGranularIntroduction(
  requesterId: string,
  recipientId: string,
  selection: GranularIntroductionShareSelection,
  message: string,
  selectedInterestReasons?: string[],
  includeMatchingDetails?: boolean
): ActiveIntroductionRequest {
  const requestId = `intro_req_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const newIntro: ActiveIntroductionRequest = {
    id: requestId,
    requesterId,
    recipientId,
    message,
    sharedFields: selection,
    status: 'pending',
    createdAt: new Date().toISOString(),
    selectedInterestReasons: selectedInterestReasons || [],
    includeMatchingDetails: includeMatchingDetails ?? true,
  };

  introRequestsStore.set(requestId, newIntro);
  connectionStagesStore.set(`${recipientId}:${requesterId}`, 'request_sent');
  return newIntro;
}

export function editPendingIntroduction(
  requestId: string,
  updatedMessage: string,
  updatedReasons?: string[],
  updatedSelection?: GranularIntroductionShareSelection,
  includeMatchingDetails?: boolean
): ActiveIntroductionRequest {
  const intro = introRequestsStore.get(requestId);
  if (!intro) throw new Error(`Introduction request ${requestId} not found`);
  if (intro.status !== 'pending') {
    throw new Error(`Cannot edit request ${requestId} because its status is ${intro.status}`);
  }

  intro.message = updatedMessage;
  if (updatedReasons !== undefined) {
    intro.selectedInterestReasons = updatedReasons;
  }
  if (updatedSelection !== undefined) {
    intro.sharedFields = updatedSelection;
  }
  if (includeMatchingDetails !== undefined) {
    intro.includeMatchingDetails = includeMatchingDetails;
  }
  intro.updatedAt = new Date().toISOString();

  introRequestsStore.set(requestId, intro);
  return intro;
}

export function respondToGranularIntroduction(
  requestId: string,
  decision: 'accept' | 'decline' | 'accept_selected',
  counterSelection?: GranularIntroductionShareSelection
): ActiveIntroductionRequest {
  const intro = introRequestsStore.get(requestId);
  if (!intro) throw new Error(`Introduction request ${requestId} not found`);

  intro.status = decision === 'accept' ? 'accepted' : decision === 'decline' ? 'declined' : 'accepted_selected';
  if (decision === 'accept') {
    connectionStagesStore.set(`${intro.recipientId}:${intro.requesterId}`, 'connection');
    connectionStagesStore.set(`${intro.requesterId}:${intro.recipientId}`, 'connection');
  } else if (decision === 'accept_selected') {
    intro.counterSharedFields = counterSelection;
    connectionStagesStore.set(`${intro.recipientId}:${intro.requesterId}`, 'connection');
    connectionStagesStore.set(`${intro.requesterId}:${intro.recipientId}`, 'connection');
  }

  introRequestsStore.set(requestId, intro);
  return intro;
}

export function withdrawIntroduction(requestId: string): ActiveIntroductionRequest {
  const intro = introRequestsStore.get(requestId);
  if (!intro) throw new Error(`Introduction request ${requestId} not found`);
  if (intro.status !== 'pending') {
    throw new Error(`Cannot withdraw request ${requestId} because its status is ${intro.status}`);
  }
  intro.status = 'withdrawn';
  intro.updatedAt = new Date().toISOString();
  introRequestsStore.set(requestId, intro);
  connectionStagesStore.delete(`${intro.recipientId}:${intro.requesterId}`);
  return intro;
}

