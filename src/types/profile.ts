// MARGAM — Advanced Matrimonial Profile System Types
// Implements complete biodata, Margams, Life Map, Horoscope, Privacy Architecture,
// Access Requests, and Granular Progressive Disclosure.

export type FieldVisibilityLevel = 
  | 'private'             // Only Me
  | 'ai_matching_only'    // Used for AI algorithms, never visible in UI
  | 'matches'             // Visible to matched / compatible profiles
  | 'mutual_interest'     // Visible once mutual interest is expressed
  | 'connections'         // Visible after accepted introduction
  | 'request_access'      // Locked until viewer requests and owner approves
  | 'public';             // Visible during discovery (only for non-sensitive fields)

export type PrivacyPreset = 'maximum_privacy' | 'balanced' | 'open';

export type ProfileCompletionStatus = 'complete' | 'partially_complete' | 'not_added' | 'private';

export type ProfileDiscoverabilityMode = 'discoverable' | 'limited_discovery' | 'hidden';

export type ActivityStatusMode = 'online' | 'active_recently' | 'hidden';

export type ProfileCreatedFor = 'self' | 'parent' | 'sibling' | 'guardian' | 'relative';

export type DobDisplayMode = 'age_only' | 'birth_year' | 'full_date';

export type HeightDisplayMode = 'cm' | 'feet_inches' | 'approximate_range';

export type IncomeVisibilityMode = 'private' | 'request_only' | 'connections' | 'visible_as_range';

export type MargamIntentType = 
  | 'enjoy'                  // I enjoy this
  | 'regular'                // I regularly do this
  | 'want_to_try'            // I want to try this
  | 'partner_enjoys'         // I want a partner who enjoys this
  | 'want_to_build'          // I want to build this together
  | 'experience_together'    // I want to experience this together
  | 'life_goal';             // This is one of my core life goals

export type PreferenceImportance = 
  | 'deal_breaker' 
  | 'high_priority' 
  | 'preference' 
  | 'nice_to_have' 
  | 'open';

export type PreferenceFlexibility = 
  | 'required' 
  | 'preferred' 
  | 'open' 
  | 'not_important';

export type AccessRequestStatus = 
  | 'pending' 
  | 'allowed' 
  | 'declined' 
  | 'allowed_once' 
  | 'allowed_until_connection_ends';

export type AccessRequestSection = 
  | 'family' 
  | 'horoscope' 
  | 'income' 
  | 'contact' 
  | 'religion' 
  | 'full_bio' 
  | 'photos';

// -------------------------------------------------------------
// 1. Core Profile Sub-Models
// -------------------------------------------------------------

export interface AboutMeData {
  bio: string;
  draftBio?: string;
  isAiGenerated?: boolean;
  aiPromptAnswers?: {
    whatYouEnjoy?: string;
    whatPassionateAbout?: string;
    lifeYouWant?: string;
    importantValues?: string;
    partnerLookingFor?: string;
  };
  visibility: FieldVisibilityLevel;
}

export interface BasicDetailsData {
  fullName: string;
  displayName: string;
  birthDate: string;           // Internal exact YYYY-MM-DD
  age: number;                 // Derived or stored
  birthYear: number;
  dobDisplayMode: DobDisplayMode;
  gender: 'Female' | 'Male' | 'Other';
  heightCm: number;            // Stored exact internally
  heightDisplayMode: HeightDisplayMode;
  bodyType?: 'Slim' | 'Athletic' | 'Average' | 'Heavy';
  weightKg?: number;
  physicalStatus: 'Normal' | 'Physically Challenged';
  maritalStatus: 'Never Married' | 'Divorced' | 'Widowed' | 'Awaiting Divorce';
  motherTongue: string;
  languagesSpoken: string[];
  bloodGroup?: string;
  profileCreatedFor: ProfileCreatedFor;
  visibility: {
    fullName: FieldVisibilityLevel;
    age: FieldVisibilityLevel;
    dateOfBirth: FieldVisibilityLevel;
    height: FieldVisibilityLevel;
    maritalStatus: FieldVisibilityLevel;
    languages: FieldVisibilityLevel;
    bloodGroup: FieldVisibilityLevel;
    profileCreatedFor: FieldVisibilityLevel;
  };
}

export interface ReligionCultureData {
  religion: string;
  denomination?: string;
  communityCaste?: string;
  subCommunity?: string;
  castePreference?: 'Same Caste' | 'Caste No Bar' | 'Open';
  casteAcceptance?: boolean;
  religiousPractice: 'Very Religious' | 'Practicing' | 'Spiritual but not Religious' | 'Non-practicing';
  dietaryPreference?: 'Vegetarian' | 'Non-Vegetarian' | 'Eggetarian' | 'Vegan' | 'Jain';
  culturalBackground?: string;
  preferNotToDisclose?: boolean;
  visibility: {
    religion: FieldVisibilityLevel;
    communityCaste: FieldVisibilityLevel;
    subCommunity: FieldVisibilityLevel;
    religiousPractice: FieldVisibilityLevel;
    dietaryPreference: FieldVisibilityLevel;
  };
}

export interface LocationData {
  country: string;
  state: string;
  district: string;
  city: string;
  area: string;
  nativePlace?: string;
  workLocation?: string;
  preferredLocationAfterMarriage?: string;
  openToRelocation: boolean;
  countriesWillingToRelocate: string[];
  // Anti-triangulation generalized safe area (NEVER raw GPS/address)
  safeDisplayArea: string; // e.g. "Kochi area", "Thrissur district"
  // Internal actual coords strictly for geospatial query engine
  internalLat?: number;
  internalLng?: number;
  visibility: {
    cityArea: FieldVisibilityLevel;
    nativePlace: FieldVisibilityLevel;
    workLocation: FieldVisibilityLevel;
    relocationPreferences: FieldVisibilityLevel;
  };
}

export interface BusinessProfileData {
  isBusinessOwner: boolean;
  businessType?: string;
  industry?: string;
  businessStage?: 'Startup' | 'Established' | 'Family Business';
  futureBusinessGoals?: string;
  businessInterests?: string[];
  investmentInterests?: string[];
  startupInterests?: string[];
  visibility: FieldVisibilityLevel;
}

export interface EducationCareerData {
  highestEducation: string;
  degree: string;
  fieldOfStudy: string;
  institution?: string;
  university?: string;
  certifications?: string[];
  employmentStatus: 'Employed' | 'Self-employed' | 'Business owner' | 'Student' | 'Unemployed' | 'Retired';
  company?: string;
  jobTitle: string;
  industry: string;
  workLocation?: string;
  yearsOfExperience?: number;
  incomeRange: '₹5–10 LPA' | '₹10–15 LPA' | '₹15–25 LPA' | '₹25–50 LPA' | '₹50LPA+' | 'Undisclosed';
  incomeVisibility: IncomeVisibilityMode;
  workModel?: 'Office' | 'Hybrid' | 'Remote';
  careerDescription?: string;
  futureCareerPlans?: string;
  businessProfile?: BusinessProfileData;
  visibility: {
    education: FieldVisibilityLevel;
    institution: FieldVisibilityLevel;
    profession: FieldVisibilityLevel;
    company: FieldVisibilityLevel;
    income: FieldVisibilityLevel;
  };
}

export interface SiblingItem {
  relation: 'Brother' | 'Sister';
  maritalStatus: 'Married' | 'Unmarried';
  profession?: string;
  location?: string;
}

export interface FamilyDetailsData {
  fatherStatus: 'Employed' | 'Business' | 'Retired' | 'Passed Away' | 'Homemaker';
  fatherProfession?: string;
  motherStatus: 'Homemaker' | 'Employed' | 'Business' | 'Retired' | 'Passed Away';
  motherProfession?: string;
  familyType: 'Nuclear' | 'Joint' | 'Extended';
  familyValues: 'Traditional' | 'Moderate' | 'Liberal';
  familyBackground?: string;
  familyLocation?: string;
  financialBackground?: 'Middle Class' | 'Upper Middle Class' | 'Affluent';
  familyExpectations?: string;
  brothersCount: number;
  marriedBrothersCount: number;
  sistersCount: number;
  marriedSistersCount: number;
  siblingSummaryOnly: boolean; // Show "1 brother, married" vs detailed cards
  siblings?: SiblingItem[];
  visibility: {
    parents: FieldVisibilityLevel;
    siblings: FieldVisibilityLevel;
    familyBackground: FieldVisibilityLevel;
    familyValues: FieldVisibilityLevel;
  };
}

export interface LifestyleData {
  smoking: 'Non-Smoker' | 'Light Smoker' | 'Regular Smoker' | 'Prefer not to say';
  alcohol: 'Non-Drinker' | 'Occasional Drinker' | 'Regular Drinker' | 'Prefer not to say';
  foodPreference: 'Vegetarian' | 'Non-Vegetarian' | 'Eggetarian' | 'Vegan';
  fitnessLevel: 'High' | 'Moderate' | 'Occasional' | 'Relaxed';
  exerciseFrequency: 'Daily' | '3-4 times a week' | 'Weekends' | 'Rarely';
  sleepPattern: 'Early Riser' | 'Night Owl' | 'Flexible';
  travelFrequency: 'Frequently' | 'Couple times a year' | 'Rarely';
  socialLifestyle: 'Extrovert' | 'Ambivert' | 'Introvert' | 'Homebody';
  pets: 'Love Pets' | 'Have Dogs' | 'Have Cats' | 'No Pets' | 'Allergic';
  weekendLifestyle?: string;
  personalHabits?: string[];
  visibility: FieldVisibilityLevel;
}

export interface MargamProfileItem {
  id: string;
  name: string;
  emoji: string;
  category: 'Business' | 'Travel' | 'Lifestyle' | 'Adventure' | 'Creativity' | 'Tech' | 'Social Impact' | 'Learning';
  intent: MargamIntentType;
  intentDescription: string;
  isCoreMargam: boolean; // Top 3 Core Margams
  customLifeGoal?: string;
  visibility: FieldVisibilityLevel;
}

export interface LifeMapTimeline {
  now: string[];            // Where I am now (e.g. "Senior Engineer + Exploring Coffee Roasting")
  next: string[];           // Next steps (e.g. "Build Specialty Cafe Business")
  threeToFiveYears: string[]; // 3-5 Years (e.g. "Travel to Japan & Europe with Partner")
  future: string[];         // Long-term Vision (e.g. "Balanced Family Life & Established Business")
  visibility: FieldVisibilityLevel;
}

export interface HoroscopeData {
  placeOfBirth: string;
  dateOfBirth: string;
  birthTime: string;
  birthMinute?: string;
  nakshatra: string;
  rasi: string;
  jathakamType?: string;
  janmaSistaDasa?: string;
  allowCompatibilityCalculation: boolean; // Compute compatibility score without showing raw birth time/chart
  visibility: FieldVisibilityLevel;
}

export interface PreferenceCriterion<T> {
  value: T;
  importance: PreferenceImportance;
  flexibility: PreferenceFlexibility;
}

export interface PartnerPreferencesData {
  ageRange: PreferenceCriterion<{ min: number; max: number }>;
  heightRangeCm: PreferenceCriterion<{ min: number; max: number }>;
  locations: PreferenceCriterion<string[]>;
  religions: PreferenceCriterion<string[]>;
  communities: PreferenceCriterion<string[]>;
  educationLevels: PreferenceCriterion<string[]>;
  professions: PreferenceCriterion<string[]>;
  dietaryPreferences: PreferenceCriterion<string[]>;
  smoking: PreferenceCriterion<string>;
  alcohol: PreferenceCriterion<string>;
  familyTypes: PreferenceCriterion<string[]>;
  relocationAcceptance: PreferenceCriterion<boolean>;
  coreMargamsWanted: PreferenceCriterion<string[]>;
  lifeGoalsAlignment: PreferenceCriterion<string[]>;
  visibility: FieldVisibilityLevel;
}

export interface ProfilePhoto {
  id: string;
  url: string;
  caption?: string;
  isPrimary: boolean;
  visibility: FieldVisibilityLevel;
  uploadedAt: string;
}

export interface VerificationData {
  phoneVerified: boolean;
  emailVerified: boolean;
  idVerified: boolean;
  photoSelfieVerified: boolean;
  educationVerified: boolean;
  employmentVerified: boolean;
  isOverallVerified: boolean;
  verifiedBadgeText: string;
}

// -------------------------------------------------------------
// 2. Master Matrimonial Profile Entity (Stored In Backend)
// -------------------------------------------------------------

export interface AdvancedMatrimonialProfile {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  profileCreatedFor: ProfileCreatedFor;
  discoverability: ProfileDiscoverabilityMode;
  activityStatus: ActivityStatusMode;
  viewHistoryEnabled: boolean;
  privacyPreset: PrivacyPreset;

  // 17 Structured Profile Sections
  aboutMe: AboutMeData;
  basicDetails: BasicDetailsData;
  religionCulture: ReligionCultureData;
  location: LocationData;
  educationCareer: EducationCareerData;
  family: FamilyDetailsData;
  lifestyle: LifestyleData;
  hobbiesInterests: {
    selectedHobbies: string[];
    visibility: FieldVisibilityLevel;
  };
  margams: MargamProfileItem[];
  lifeMap: LifeMapTimeline;
  horoscope: HoroscopeData;
  partnerPreferences: PartnerPreferencesData;
  photos: ProfilePhoto[];
  futureGoals: {
    marriageTimeline: string;
    familyPlanningPreference?: string;
    longTermDreams: string[];
    visibility: FieldVisibilityLevel;
  };
  verification: VerificationData;

  // Custom Field Visibility Matrix Overrides
  fieldPermissions: Record<string, FieldVisibilityLevel>;
}

// -------------------------------------------------------------
// 3. Privacy-Filtered Display Profile (Sent to Viewers by API)
// -------------------------------------------------------------

export interface LockedSectionState {
  isLocked: boolean;
  reason: 'private' | 'requires_access_request' | 'requires_mutual_interest' | 'requires_connection';
  message: string;
  canRequestAccess: boolean;
  hasPendingRequest?: boolean;
}

export interface FilteredDisplayProfile {
  id: string;
  displayName: string;
  isVerified: boolean;
  verifiedBadgeText: string;
  avatarUrl?: string;
  photos: ProfilePhoto[];
  approximateLocation: string; // e.g. "Kochi area"
  professionSummary?: string;
  profileCompletionPercentage: number;
  relationshipWithViewer: 'stranger' | 'match' | 'mutual_interest' | 'request_sent' | 'connection';

  // Section contents (or locked sentinel state)
  aboutMe?: {
    bio: string;
    isAiAssisted?: boolean;
  } | LockedSectionState;

  basicDetails?: {
    gender: string;
    ageDisplay: string;
    heightDisplay: string;
    maritalStatus: string;
    motherTongue: string;
    languages: string[];
    profileCreatedFor: string;
  } | LockedSectionState;

  religionCulture?: {
    religion?: string;
    denomination?: string;
    communityCaste?: string;
    religiousPractice?: string;
    dietaryPreference?: string;
  } | LockedSectionState;

  location?: {
    approximateArea: string;
    nativePlace?: string;
    openToRelocation: boolean;
  } | LockedSectionState;

  educationCareer?: {
    highestEducation: string;
    degree?: string;
    fieldOfStudy?: string;
    jobTitle: string;
    industry?: string;
    employmentStatus: string;
    incomeDisplay?: string; // Range or "Undisclosed"
    businessOwner?: {
      businessType?: string;
      businessStage?: string;
    };
  } | LockedSectionState;

  family?: {
    familyType?: string;
    familyValues?: string;
    siblingSummary?: string;
    fatherSummary?: string;
    motherSummary?: string;
  } | LockedSectionState;

  lifestyle?: {
    foodPreference?: string;
    smoking?: string;
    alcohol?: string;
    fitnessLevel?: string;
    sleepPattern?: string;
    socialLifestyle?: string;
    pets?: string;
  } | LockedSectionState;

  hobbies?: string[] | LockedSectionState;

  margams?: {
    coreMargams: MargamProfileItem[];
    allMargams: MargamProfileItem[];
  } | LockedSectionState;

  lifeMap?: LifeMapTimeline | LockedSectionState;

  horoscope?: {
    isCalculated: boolean;
    compatibilityAvailable: boolean;
    nakshatra?: string;
    rasi?: string;
  } | LockedSectionState;

  partnerPreferencesSummary?: {
    ageRangeDisplay: string;
    locationSummary: string;
    dealBreakersSummary: string[];
  } | LockedSectionState;

  // AI Compatibility Snapshot
  compatibility?: {
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
  };
}

// -------------------------------------------------------------
// 4. Access Requests & Information Sharing Request Types
// -------------------------------------------------------------

export interface SectionAccessRequest {
  id: string;
  requesterId: string;
  requesterName: string;
  requesterAvatarUrl?: string;
  targetUserId: string;
  section: AccessRequestSection;
  note?: string;
  status: AccessRequestStatus;
  createdAt: string;
  respondedAt?: string;
}

export interface GranularIntroductionShareSelection {
  // Level 1: Basics
  firstName: boolean;
  age: boolean;
  profilePhoto: boolean;
  profession: boolean;
  coreMargams: boolean;

  // Level 2: Deeper Attributes (Optional at request time)
  fullBio: boolean;
  educationDetails: boolean;
  lifestyleDetails: boolean;
  lifeMap: boolean;

  // Level 3: Sensitive Sections (Explicit opt-in)
  familyDetails: boolean;
  religionCommunity: boolean;
  horoscopeDetails: boolean;
  contactInformation: boolean; // Phone/email (Default FALSE)
}
