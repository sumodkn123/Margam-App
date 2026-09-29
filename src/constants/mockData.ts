// MARGAM - Realistic Mock Data for Kerala Corridors (Thrissur -> Kochi -> Kozhikode)
import { UserProfile, AnonymousCandidate, PublicVenue, RouteCorridor, IntroductionRequest } from '../types';

export const CURRENT_USER: UserProfile = {
  id: 'user_sumod_01',
  firstName: 'Sumod',
  fullName: 'Sumod K. N.',
  age: 33,
  gender: 'Male',
  profilePhotoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  additionalPhotoUrls: [
    'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80'
  ],
  shortIntro: 'I enjoy building products, travelling, exploring new places and creating things.',
  fullBio: 'Product builder and entrepreneur based in Thrissur. Passionate about software architecture, minimalist lifestyle, morning espresso, weekend road trips along the western ghats, and meaningful conversations about philosophy and technology.',
  education: 'B.Tech in Computer Science',
  institution: 'Govt. Engineering College, Thrissur',
  profession: 'Website Designer / Entrepreneur',
  company: 'Studio Digital Labs',
  workplaceLocation: 'Thrissur & Kochi',
  city: 'Thrissur',
  area: 'Swaraj Round Area',
  actualLat: 10.5276,
  actualLng: 76.2144,
  lifestylePreferences: ['Vegetarian / Eggetarian friendly', 'Non-smoker', 'Active traveler', 'Fitness oriented'],
  detailedLifestyle: 'Early riser, enjoys badminton, clean plant-forward diet, reads non-fiction, values family independence and mutual growth.',
  familyOverview: 'Nuclear family, progressive cultural values, based in Thrissur.',
  detailedFamily: 'Father retired civil engineer, Mother former school teacher, one younger sister happily married in Bengaluru.',
  phoneNumber: '+91 98470 12345',
  email: 'sumod.connect@margam.app',
  marriageTimeline: 'Within 6 to 12 months',
  interests: ['Tech & Startups', 'Road Trips', 'Architectural Design', 'Photography', 'Filter Coffee'],
  fieldPerms: {
    firstName: 'request_only',
    fullName: 'accepted_only',
    age: 'request_only',
    gender: 'request_only',
    profilePhoto: 'request_only',
    additionalPhotos: 'accepted_only',
    shortIntro: 'request_only',
    fullBio: 'accepted_only',
    education: 'request_only',
    institution: 'accepted_only',
    profession: 'request_only',
    company: 'accepted_only',
    workplaceLocation: 'accepted_only',
    city: 'request_only',
    area: 'accepted_only',
    exactLocation: 'private',
    lifestylePreferences: 'request_only',
    detailedLifestyle: 'accepted_only',
    familyOverview: 'private',
    detailedFamily: 'private',
    phoneNumber: 'private',
    email: 'private',
  }
};

export const POPULAR_ROUTES: RouteCorridor[] = [
  {
    id: 'route_thrissur_kochi',
    name: 'Thrissur to Kochi (NH 544)',
    origin: { name: 'Thrissur', lat: 10.5276, lng: 76.2144 },
    destination: { name: 'Kochi', lat: 9.9312, lng: 76.2673 },
    waypoints: [
      { lat: 10.5276, lng: 76.2144 }, // Thrissur
      { lat: 10.3119, lng: 76.3319 }, // Chalakudy
      { lat: 10.2010, lng: 76.3537 }, // Angamaly
      { lat: 10.1076, lng: 76.3516 }, // Aluva
      { lat: 10.0270, lng: 76.3080 }, // Edappally
      { lat: 9.9312, lng: 76.2673 },  // Kochi Marine Drive
    ],
    distanceKm: 78,
    durationLabel: '1h 45m',
  },
  {
    id: 'route_kochi_trivandrum',
    name: 'Kochi to Trivandrum (MC Road / NH 66)',
    origin: { name: 'Kochi', lat: 9.9312, lng: 76.2673 },
    destination: { name: 'Trivandrum', lat: 8.5241, lng: 76.9366 },
    waypoints: [
      { lat: 9.9312, lng: 76.2673 },
      { lat: 9.4981, lng: 76.3388 }, // Alappuzha
      { lat: 8.8932, lng: 76.6141 }, // Kollam
      { lat: 8.5241, lng: 76.9366 }, // Trivandrum
    ],
    distanceKm: 205,
    durationLabel: '4h 15m',
  }
];

export const ANONYMOUS_MATCHES: AnonymousCandidate[] = [
  {
    id: 'candidate_01_aluva',
    compatibilityPercentage: 94,
    availability: 'Open to introductions',
    approximateZone: 'Aluva - Greater Kochi Corridor',
    distanceLabel: 'Near your destination (NH 544)',
    marriageTimelineMatch: true,
    lifestyleMatch: true,
    locationPreferenceMatch: true,
    sharedInterestsCount: 4,
    compatibilityReasons: [
      'Similar marriage timeline (Within 1 year)',
      'Compatible location corridor (Thrissur - Kochi)',
      'Shared lifestyle values (Travel & Creative work)',
      'Complementary professional backgrounds'
    ],
    fuzzedCoordinate: {
      latitude: 10.1120,
      longitude: 76.3450,
      radiusKm: 3.2,
      approximateZoneName: 'Aluva / Periyar Corridor',
      displayDistance: 'Along your NH 544 route'
    },
    isAlongRoute: true,
    routeDetourMinutes: 5,
  },
  {
    id: 'candidate_02_chalakudy',
    compatibilityPercentage: 91,
    availability: 'Open to introductions',
    approximateZone: 'Chalakudy Area',
    distanceLabel: 'Midway on your route',
    marriageTimelineMatch: true,
    lifestyleMatch: true,
    locationPreferenceMatch: true,
    sharedInterestsCount: 3,
    compatibilityReasons: [
      'Similar marriage timeline',
      'Both prefer serene, nature-friendly living',
      'Mutual preference for public weekend meetups',
      'Family values alignment'
    ],
    fuzzedCoordinate: {
      latitude: 10.3050,
      longitude: 76.3280,
      radiusKm: 2.8,
      approximateZoneName: 'Chalakudy Valley',
      displayDistance: 'Midway along travel route'
    },
    isAlongRoute: true,
    routeDetourMinutes: 3,
  },
  {
    id: 'candidate_03_kakkanad',
    compatibilityPercentage: 89,
    availability: 'Open to introductions',
    approximateZone: 'Kakkanad / Infopark Zone',
    distanceLabel: 'Near Kochi IT Corridor',
    marriageTimelineMatch: true,
    lifestyleMatch: false,
    locationPreferenceMatch: true,
    sharedInterestsCount: 5,
    compatibilityReasons: [
      'Mutual tech and design industry background',
      'Active lifestyle & fitness preferences',
      'Similar cultural and city preferences'
    ],
    fuzzedCoordinate: {
      latitude: 10.0150,
      longitude: 76.3620,
      radiusKm: 4.1,
      approximateZoneName: 'Kakkanad Infopark Area',
      displayDistance: '12 mins detour from destination'
    },
    isAlongRoute: true,
    routeDetourMinutes: 12,
  },
  {
    id: 'candidate_04_thrissur_cluster',
    compatibilityPercentage: 88,
    availability: 'Open to introductions',
    approximateZone: 'Thrissur Cultural Belt',
    distanceLabel: 'Within your departure area',
    marriageTimelineMatch: true,
    lifestyleMatch: true,
    locationPreferenceMatch: true,
    sharedInterestsCount: 3,
    compatibilityReasons: [
      'Local district match (Thrissur)',
      'Shared Malayalam cultural alignment',
      'Flexible public meeting availability'
    ],
    fuzzedCoordinate: {
      latitude: 10.5350,
      longitude: 76.2200,
      radiusKm: 3.5,
      approximateZoneName: 'Thrissur Central Zone',
      displayDistance: 'Local area'
    },
    clusterCount: 4, // "4 compatible profiles in this area"
    isAlongRoute: false,
  },
  {
    id: 'candidate_05_kochi_cluster',
    compatibilityPercentage: 92,
    availability: 'Open to introductions',
    approximateZone: 'Marine Drive / Panampilly Nagar',
    distanceLabel: 'Destination City Hub',
    marriageTimelineMatch: true,
    lifestyleMatch: true,
    locationPreferenceMatch: true,
    sharedInterestsCount: 4,
    compatibilityReasons: [
      'Top compatibility tier in destination city',
      'Aligned marriage aspirations',
      'Strong creative and educational harmony'
    ],
    fuzzedCoordinate: {
      latitude: 9.9650,
      longitude: 76.2880,
      radiusKm: 3.0,
      approximateZoneName: 'Central Kochi Hub',
      displayDistance: 'Destination hub'
    },
    clusterCount: 7, // "7 compatible profiles"
    isAlongRoute: true,
    routeDetourMinutes: 0,
  }
];

export const VERIFIED_PUBLIC_VENUES: PublicVenue[] = [
  {
    id: 'venue_lulu_edappally',
    name: 'Lulu Mall Central Courtyard Cafe',
    category: 'mall',
    city: 'Kochi',
    area: 'Edappally',
    address: '34/1000, Old NH 47, Edappally Junction, Kochi',
    rating: 4.8,
    isVerifiedPublic: true,
  },
  {
    id: 'venue_french_toast',
    name: 'French Toast Heritage Artisan Bakery',
    category: 'cafe',
    city: 'Kochi',
    area: 'Panampilly Nagar',
    address: 'Main Avenue, Panampilly Nagar, Kochi',
    rating: 4.7,
    isVerifiedPublic: true,
  },
  {
    id: 'venue_hyatt_bolgatty',
    name: 'Grand Hyatt Waterfront Tea Lounge',
    category: 'hotel_lobby',
    city: 'Kochi',
    area: 'Bolgatty Island',
    address: 'Bolgatty Island, Mulavukad, Kochi',
    rating: 4.9,
    isVerifiedPublic: true,
  },
  {
    id: 'venue_sobha_thrissur',
    name: 'Sobha City Mall Promenade Cafe',
    category: 'mall',
    city: 'Thrissur',
    area: 'Puzhakkal',
    address: 'Puzhakkal Padam, Guruvayoor Road, Thrissur',
    rating: 4.7,
    isVerifiedPublic: true,
  },
  {
    id: 'venue_round_south',
    name: 'Round South Coffee Roasters',
    category: 'cafe',
    city: 'Thrissur',
    area: 'Swaraj Round South',
    address: 'Opp. Kuruppam Road Junction, Thrissur',
    rating: 4.6,
    isVerifiedPublic: true,
  },
  {
    id: 'venue_chalakudy_cafe',
    name: 'Highway Garden Cafe & Bistro',
    category: 'cafe',
    city: 'Chalakudy',
    area: 'Near NH 544 Bypass',
    address: 'NH 544 Highway Bypass, Chalakudy',
    rating: 4.5,
    isVerifiedPublic: true,
  }
];

// Sample Incoming Request for Sumod (Recipient view demonstration)
export const SAMPLE_INCOMING_REQUEST: IntroductionRequest = {
  id: 'req_ananya_to_sumod_01',
  requesterId: 'user_ananya_02',
  recipientId: 'user_sumod_01',
  requestType: 'route_meet',
  customMessage: 'Hi Sumod, Margam noted that you frequently travel the Thrissur-Kochi route. My office is near Edappally and our marriage goals and creative backgrounds align well. Happy to connect if you feel comfortable!',
  compatibilityPercentage: 94,
  sharedFields: {
    firstName: true,
    age: true,
    gender: true,
    fullName: false,
    profilePhoto: true,
    additionalPhotos: false,
    shortIntro: true,
    fullBio: false,
    education: true,
    institution: false,
    profession: true,
    company: false,
    workplaceLocation: false,
    city: true,
    area: true,
    exactLocation: false,
    lifestylePreferences: true,
    detailedLifestyle: false,
    familyOverview: false,
    detailedFamily: false,
    phoneNumber: false,
    email: false,
  },
  routeDetails: {
    originCity: 'Aluva',
    destinationCity: 'Kochi (Edappally)',
    travelDate: 'This Saturday',
    estimatedArrivalTime: '5:30 PM',
    potentialPublicVenue: 'Lulu Mall Central Courtyard Cafe'
  },
  requesterRevealedData: {
    id: 'user_ananya_02',
    firstName: 'Ananya',
    age: 29,
    gender: 'Female',
    profilePhotoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    shortIntro: 'Design lead at a mobility startup. Love specialty coffee, urban sketching, and weekend pottery.',
    city: 'Kochi',
    area: 'Aluva / Edappally',
    profession: 'Design Lead / Product Strategist',
    education: 'B.Des (National Institute of Design)',
    lifestylePreferences: ['Vegetarian', 'Non-smoker', 'Early morning walker'],
    marriageTimeline: 'Within 9 months',
  },
  createdAt: '2 hours ago',
  status: 'pending',
  stage: 2,
};
