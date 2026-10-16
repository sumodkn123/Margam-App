import {
  DetailedOtherUserProfile,
  ProfileRelationshipState,
  ProfilePhotoItem,
  ProfileMargamDisplayItem,
  AnonymousCandidate,
  MargamProfileCandidate,
} from '../types';
import { MARGAM_CANDIDATES } from './margamService';
import { getRegisteredProfilePool } from './discoveryEngine';

// Local storage sets for safety and relationship lifecycle state
const savedProfileIds = new Set<string>();
const blockedProfileIds = new Set<string>();
const hiddenProfileIds = new Set<string>();
const notInterestedProfileIds = new Set<string>();
const reportedProfiles: { profileId: string; reason: string; details?: string; timestamp: string }[] = [];
const connectedProfileIds = new Set<string>();
const requestedPhotoAccessIds = new Set<string>();

// -------------------------------------------------------------
// Master Profiles Database (Detailed & Privacy-Aware)
// -------------------------------------------------------------

export const DETAILED_PROFILES: Record<string, DetailedOtherUserProfile> = {
  // Ananya (Primary reference match for media_1790937528991.png)
  'margam-cand-1': {
    id: 'margam-cand-1',
    name: 'Ananya',
    age: 27,
    isVerified: true,
    verificationDetails: {
      idVerified: true,
      selfieVerified: true,
      employmentVerified: true,
      verifiedAt: 'Verified 2 weeks ago',
    },
    availability: 'Open to Introductions',
    profession: 'Marketing Professional',
    city: 'Kochi',
    area: 'Kochi area',
    education: "Master's Degree",
    religion: 'Hindu',
    height: "5'4\"",
    relocationIntent: 'Open to relocate',
    marriageTimeline: '1–2 Years',
    compatibilityPercentage: 92,
    compatibilitySummary: 'Strong alignment in interests, lifestyle and future goals.',
    photos: [
      {
        id: 'ananya-photo-1',
        url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=900&auto=format&fit=crop&q=85',
        visibility: 'public',
        isPrimary: true,
        caption: 'Enjoying pour-over coffee at a heritage cafe',
      },
      {
        id: 'ananya-photo-2',
        url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80',
        visibility: 'public',
        isPrimary: false,
        caption: 'Weekend walks in Fort Kochi',
      },
      {
        id: 'ananya-photo-3',
        url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&auto=format&fit=crop&q=80',
        visibility: 'connections_only',
        isPrimary: false,
      },
      {
        id: 'ananya-photo-4',
        url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&auto=format&fit=crop&q=80',
        visibility: 'connections_only',
        isPrimary: false,
      },
      {
        id: 'ananya-photo-5',
        url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=80',
        visibility: 'connections_only',
        isPrimary: false,
      },
    ],
    margams: [
      {
        id: 'mg-cafe',
        name: 'Café Business',
        emoji: '☕',
        intent: 'I want to build a destination cafe together',
        intentCategory: 'Future Goal',
        bgColor: '#FFF1F2',
        textColor: '#C2410C',
        isShared: true,
        userIntent: 'Future Goal',
        description: 'Dreaming of starting, owning, or managing a specialty coffee shop with reading corners.',
      },
      {
        id: 'mg-travel',
        name: 'Travel',
        emoji: '✈',
        intent: 'Annual trips to Japan and Europe',
        intentCategory: 'Regular',
        bgColor: '#EFF6FF',
        textColor: '#2563EB',
        isShared: true,
        userIntent: 'Regular',
        description: 'Loves discovering authentic culture, train journeys, and historical streets.',
      },
      {
        id: 'mg-fitness',
        name: 'Fitness',
        emoji: '🏋',
        intent: 'Morning workouts & mindful lifestyle',
        intentCategory: 'Lifestyle',
        bgColor: '#DCFCE7',
        textColor: '#16A34A',
        isShared: true,
        userIntent: 'Lifestyle',
        description: 'Believes physical movement and healthy eating foster mental peace.',
      },
      {
        id: 'mg-photo',
        name: 'Photography',
        emoji: '📷',
        intent: 'Capturing street moments and landscapes',
        intentCategory: 'Interest',
        bgColor: '#F3E8FF',
        textColor: '#7E22CE',
        isShared: true,
        userIntent: 'Interest',
        description: 'Weekend photography walks with a film camera.',
      },
      {
        id: 'mg-food',
        name: 'Food & Cooking',
        emoji: '📖',
        intent: 'Baking sourdough & artisan breakfast',
        intentCategory: 'Regular',
        bgColor: '#FEF3C7',
        textColor: '#B45309',
        isShared: false,
        description: 'Enjoys trying international recipes and hosting warm dinners with friends.',
      },
      {
        id: 'mg-nature',
        name: 'Nature',
        emoji: '🍃',
        intent: 'Weekend plantation retreats',
        intentCategory: 'Interest',
        bgColor: '#D1FAE5',
        textColor: '#059669',
        isShared: false,
        description: 'Recharges amidst mountain mists and quiet green corridors.',
      },
      {
        id: 'mg-adv',
        name: 'Adventure',
        emoji: '🏔',
        intent: 'High altitude Himalayan trekking',
        intentCategory: 'Future Plan',
        bgColor: '#EDE9FE',
        textColor: '#6D28D9',
        isShared: false,
        description: 'Planning a scenic trek in Himachal Pradesh or Leh.',
      },
      {
        id: 'mg-music',
        name: 'Music',
        emoji: '🎵',
        intent: 'Acoustic melodies and indie folk',
        intentCategory: 'Hobby',
        bgColor: '#FCE7F3',
        textColor: '#BE185D',
        isShared: false,
        description: 'Enjoys intimate live acoustics and relaxing vinyl sessions.',
      },
    ],
    aboutText:
      "I love meaningful conversations, good coffee, and exploring new places. I'm passionate about building a small, cozy café someday and would love a partner who shares a similar dream and enjoys a balanced, active lifestyle.",
    lookingForText:
      "A kind, open-minded partner who values travel, good food, meaningful experiences and is supportive of my dream of starting a café.",
    partnerPreferences: {
      locationPreference: 'Kerala / Open to Abroad',
      marriageTimeline: '1–2 Years',
      familyPreference: 'Open & Flexible',
    },
    relationshipState: 'UNKNOWN',
    discoverySource: 'Discovered through Café Business Margam',
    sharedPathsCount: 3,
    sharedPaths: [
      {
        type: 'shared',
        title: 'Café Business',
        subtitle: 'Both of you chose this as a future entrepreneurial goal.',
        emoji: '☕',
      },
      {
        type: 'shared',
        title: 'Travel',
        subtitle: 'Both enjoy regular explorations and discovering local cultures.',
        emoji: '✈',
      },
      {
        type: 'shared',
        title: 'Fitness',
        subtitle: 'Both value active habits and mindful health.',
        emoji: '🏋',
      },
      {
        type: 'complementary',
        title: 'Creativity & Food',
        subtitle: 'Your Photography complements her passion for Artisan Food & Cooking.',
        emoji: '🎨',
      },
      {
        type: 'different',
        title: 'Living Preference',
        subtitle: 'You prefer urban convenience; she enjoys green coastal outskirts.',
        emoji: '🏡',
      },
    ],
    plannedTrip: {
      destination: 'Fort Kochi Heritage Area',
      dates: '24–26 Dec',
      availability: 'Open to introductions',
    },
  },

  // Rohan (Thrissur software architect)
  'margam-cand-2': {
    id: 'margam-cand-2',
    name: 'Rohan',
    age: 29,
    isVerified: true,
    verificationDetails: {
      idVerified: true,
      selfieVerified: true,
      employmentVerified: true,
      verifiedAt: 'Verified 1 month ago',
    },
    availability: 'Open to Introductions',
    profession: 'Software Architect',
    city: 'Thrissur',
    area: 'Thrissur central',
    education: 'B.Tech in Computer Science',
    religion: 'Hindu',
    height: "5'11\"",
    relocationIntent: 'Open to Kochi or Bangalore',
    marriageTimeline: 'Within 1 year',
    compatibilityPercentage: 88,
    compatibilitySummary: 'Aligned on international travel, adventurous outlook, and tech careers.',
    photos: [
      {
        id: 'rohan-photo-1',
        url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=900&auto=format&fit=crop&q=85',
        visibility: 'public',
        isPrimary: true,
      },
      {
        id: 'rohan-photo-2',
        url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80',
        visibility: 'public',
        isPrimary: false,
      },
      {
        id: 'rohan-photo-3',
        url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&auto=format&fit=crop&q=80',
        visibility: 'connections_only',
        isPrimary: false,
      },
    ],
    margams: [
      {
        id: 'mg-int-travel',
        name: 'International Travel',
        emoji: '✈',
        intent: 'Backpacking across Nordic countries',
        intentCategory: 'Regular',
        bgColor: '#EFF6FF',
        textColor: '#2563EB',
        isShared: true,
        userIntent: 'Regular',
      },
      {
        id: 'mg-wildlife',
        name: 'Wildlife',
        emoji: '🌿',
        intent: 'Endemic birdwatching & safari trails',
        intentCategory: 'Interest',
        bgColor: '#DCFCE7',
        textColor: '#16A34A',
        isShared: true,
        userIntent: 'Interest',
      },
      {
        id: 'mg-road',
        name: 'Road Trips',
        emoji: '🚗',
        intent: 'Monsoon drives along the Western Ghats',
        intentCategory: 'Hobby',
        bgColor: '#FEF3C7',
        textColor: '#B45309',
        isShared: false,
      },
    ],
    aboutText:
      'Passionate about international wildlife photography, monsoon road trips, and building mindful family routines. Love building high-scale tech by day and retreating to nature by weekend.',
    lookingForText:
      'An authentic, humorous life partner who enjoys weekend expeditions, road trips, and building a secure, peaceful home together.',
    partnerPreferences: {
      locationPreference: 'Kerala or Bangalore',
      marriageTimeline: 'Within 1 year',
      familyPreference: 'Nuclear / Close-knit',
    },
    relationshipState: 'UNKNOWN',
    discoverySource: 'Near your route (NH 544)',
    sharedPathsCount: 2,
    sharedPaths: [
      {
        type: 'shared',
        title: 'International Travel',
        subtitle: 'Both of you plan annual global backpacking trips.',
        emoji: '✈',
      },
    ],
  },

  // Meera (Architect in Kochi)
  'margam-cand-3': {
    id: 'margam-cand-3',
    name: 'Meera',
    age: 26,
    isVerified: true,
    verificationDetails: {
      idVerified: true,
      selfieVerified: true,
      employmentVerified: true,
      verifiedAt: 'Verified 3 weeks ago',
    },
    availability: 'Open to Introductions',
    profession: 'Architect & Designer',
    city: 'Kochi',
    area: 'Panampilly Nagar',
    education: 'B.Arch',
    religion: 'Hindu',
    height: "5'5\"",
    relocationIntent: 'Flexible across Kerala',
    marriageTimeline: '1–2 Years',
    compatibilityPercentage: 89,
    compatibilitySummary: 'High lifestyle synergy: morning wellness habits, design aesthetics, and mutual vegetarian diet.',
    photos: [
      {
        id: 'meera-photo-1',
        url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=900&auto=format&fit=crop&q=85',
        visibility: 'public',
        isPrimary: true,
      },
      {
        id: 'meera-photo-2',
        url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&auto=format&fit=crop&q=80',
        visibility: 'public',
        isPrimary: false,
      },
      {
        id: 'meera-photo-3',
        url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
        visibility: 'connections_only',
        isPrimary: false,
      },
    ],
    margams: [
      {
        id: 'mg-sustainable',
        name: 'Sustainable Living',
        emoji: '🌱',
        intent: 'Designing eco-friendly homes with solar & rain harvesting',
        intentCategory: 'Lifestyle',
        bgColor: '#DCFCE7',
        textColor: '#16A34A',
        isShared: true,
        userIntent: 'Lifestyle',
      },
      {
        id: 'mg-bakery',
        name: 'Café & Bakery',
        emoji: '☕',
        intent: 'Visiting artisan sourdough bakeries',
        intentCategory: 'Regular',
        bgColor: '#FFEDD5',
        textColor: '#C2410C',
        isShared: true,
        userIntent: 'Future Goal',
      },
    ],
    aboutText:
      'Advocate of sustainable architecture, minimalist home design, morning yoga, and weekend artisan bakery visits. Believes in slow living, good literature, and warm courtyards.',
    lookingForText:
      'A partner who appreciates art, sustainable living, quiet mornings, and mutual encouragement toward our dreams.',
    partnerPreferences: {
      locationPreference: 'Kochi / Central Kerala',
      marriageTimeline: '1–2 Years',
      familyPreference: 'Open & Warm',
    },
    relationshipState: 'UNKNOWN',
    discoverySource: 'Discovered around your selected area',
  },
};

// -------------------------------------------------------------
// Helper to construct profile dynamically for any AnonymousCandidate
// -------------------------------------------------------------

export function getVisibleProfile(
  viewerId: string,
  candidateOrId: string | AnonymousCandidate | MargamProfileCandidate,
  context?: { source?: string; sourceMargam?: string }
): DetailedOtherUserProfile {
  const rawId = typeof candidateOrId === 'string' ? candidateOrId : candidateOrId.id;
  let profileId = rawId;
  if (rawId.includes('ananya')) {
    profileId = 'margam-cand-1';
  } else if (rawId.includes('meera')) {
    profileId = 'margam-cand-2';
  } else if (rawId.includes('rahul') || rawId.includes('rohit')) {
    profileId = 'margam-cand-3';
  } else if (rawId.startsWith('thread-')) {
    profileId = rawId.replace('thread-', '');
  }

  // 1. Direct match in detailed profiles
  if (DETAILED_PROFILES[profileId]) {
    const base = { ...DETAILED_PROFILES[profileId] };
    base.relationshipState = determineRelationshipState(profileId);
    if (context?.source) {
      base.discoverySource = context.source;
    }
    return base;
  }

  // 2. Match in MARGAM_CANDIDATES
  const margamCand = MARGAM_CANDIDATES.find((c) => c.id === profileId);
  if (margamCand) {
    const generated: DetailedOtherUserProfile = {
      id: margamCand.id,
      name: margamCand.name,
      age: margamCand.age,
      isVerified: margamCand.isVerified,
      verificationDetails: {
        idVerified: true,
        selfieVerified: true,
        employmentVerified: true,
        verifiedAt: 'Verified recently',
      },
      availability: 'Open to Introductions',
      profession: margamCand.profession,
      city: margamCand.city,
      area: margamCand.area,
      education: "Master's Degree",
      religion: 'Hindu',
      height: "5'6\"",
      relocationIntent: margamCand.openToRelocate,
      marriageTimeline: margamCand.marriageTimeline,
      compatibilityPercentage: margamCand.compatibilityPercentage,
      compatibilitySummary: margamCand.whyThisMatchExplanation,
      photos: [
        { id: `${margamCand.id}-1`, url: margamCand.photoUrl, visibility: 'public', isPrimary: true },
        { id: `${margamCand.id}-2`, url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600', visibility: 'public', isPrimary: false },
        { id: `${margamCand.id}-3`, url: '', visibility: 'connections_only', isPrimary: false },
        { id: `${margamCand.id}-4`, url: '', visibility: 'connections_only', isPrimary: false },
      ],
      margams: margamCand.sharedMargams.map((m) => ({
        id: `mg-${m.name.toLowerCase().replace(/\s+/g, '-')}`,
        name: m.name,
        emoji: m.emoji,
        intent: margamCand.lookingToBuild,
        intentCategory: 'Future Goal',
        bgColor: m.tagColor,
        textColor: m.textColor,
        isShared: true,
      })),
      aboutText: margamCand.bio,
      lookingForText: `Looking for a partner supportive of building ${margamCand.lookingToBuild.toLowerCase()}.`,
      partnerPreferences: {
        locationPreference: margamCand.openToRelocate,
        marriageTimeline: margamCand.marriageTimeline,
        familyPreference: 'Open & Flexible',
      },
      relationshipState: determineRelationshipState(profileId),
      discoverySource: context?.source || `Discovered via ${context?.sourceMargam || 'Margams'}`,
    };
    return generated;
  }

  // 3. Fallback to Registered User Profile Pool
  const allProfiles = getRegisteredProfilePool();
  const poolCand = allProfiles.find((p) => p.id === profileId) || allProfiles[0];

  const fallbackProfile: DetailedOtherUserProfile = {
    id: poolCand.id,
    name: poolCand.firstName,
    age: poolCand.age,
    isVerified: true,
    verificationDetails: {
      idVerified: true,
      selfieVerified: true,
      employmentVerified: true,
      verifiedAt: 'Verified',
    },
    availability: 'Open to Introductions',
    profession: poolCand.profession,
    city: poolCand.city,
    area: poolCand.area,
    education: poolCand.education,
    religion: 'Hindu',
    height: "5'5\"",
    relocationIntent: 'Open to discussions',
    marriageTimeline: poolCand.marriageTimeline,
    compatibilityPercentage: typeof candidateOrId !== 'string' ? candidateOrId.compatibilityPercentage : 90,
    compatibilitySummary: 'Strong alignment across core values and family goals.',
    photos: [
      { id: `${poolCand.id}-p1`, url: poolCand.profilePhotoUrl, visibility: 'public', isPrimary: true },
      { id: `${poolCand.id}-p2`, url: poolCand.additionalPhotoUrls[0] || poolCand.profilePhotoUrl, visibility: 'public', isPrimary: false },
      { id: `${poolCand.id}-p3`, url: '', visibility: 'connections_only', isPrimary: false },
    ],
    margams: [
      {
        id: 'mg-cafe',
        name: 'Café Business',
        emoji: '☕',
        intent: 'Destination Cafe',
        intentCategory: 'Future Goal',
        bgColor: '#FFF1F2',
        textColor: '#C2410C',
        isShared: true,
      },
      {
        id: 'mg-travel',
        name: 'Travel',
        emoji: '✈',
        intent: 'Scenic exploring',
        intentCategory: 'Regular',
        bgColor: '#EFF6FF',
        textColor: '#2563EB',
        isShared: true,
      },
    ],
    aboutText: poolCand.fullBio || poolCand.shortIntro,
    lookingForText: 'Looking for someone genuine, family-oriented, and open-minded.',
    partnerPreferences: {
      locationPreference: poolCand.city,
      marriageTimeline: poolCand.marriageTimeline,
      familyPreference: 'Open & Warm',
    },
    relationshipState: determineRelationshipState(profileId),
    discoverySource: context?.source || 'Compatible match in your area',
  };

  return fallbackProfile;
}

function determineRelationshipState(profileId: string): ProfileRelationshipState {
  if (blockedProfileIds.has(profileId)) return 'BLOCKED';
  if (hiddenProfileIds.has(profileId)) return 'HIDDEN';
  if (connectedProfileIds.has(profileId)) return 'CONNECTED';
  if (savedProfileIds.has(profileId)) return 'SAVED';
  return 'UNKNOWN';
}

// -------------------------------------------------------------
// Interactive State Mutators
// -------------------------------------------------------------

export function toggleSaveProfile(profileId: string): boolean {
  if (savedProfileIds.has(profileId)) {
    savedProfileIds.delete(profileId);
    return false;
  } else {
    savedProfileIds.add(profileId);
    return true;
  }
}

export function isProfileSaved(profileId: string): boolean {
  return savedProfileIds.has(profileId);
}

export function blockProfile(profileId: string): void {
  blockedProfileIds.add(profileId);
  savedProfileIds.delete(profileId);
}

export function isProfileBlocked(profileId: string): boolean {
  return blockedProfileIds.has(profileId);
}

export function hideProfile(profileId: string): void {
  hiddenProfileIds.add(profileId);
}

export function isProfileHidden(profileId: string): boolean {
  return hiddenProfileIds.has(profileId);
}

export function setNotInterested(profileId: string): void {
  notInterestedProfileIds.add(profileId);
}

export function reportProfile(profileId: string, reason: string, details?: string): void {
  reportedProfiles.push({
    profileId,
    reason,
    details,
    timestamp: new Date().toISOString(),
  });
}

export function getReportedProfiles(): typeof reportedProfiles {
  return [...reportedProfiles];
}

export function markAsConnected(profileId: string): void {
  connectedProfileIds.add(profileId);
}

export function requestPhotoAccess(profileId: string, photoId: string): boolean {
  requestedPhotoAccessIds.add(`${profileId}:${photoId}`);
  return true;
}
