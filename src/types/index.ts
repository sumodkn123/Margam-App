// MARGAM - Type Definitions

export type VisibilityState = 'private' | 'request_only' | 'accepted_only' | 'public';

export type RequestType = 
  | 'introduction' 
  | 'route_meet' 
  | 'destination' 
  | 'future_trip' 
  | 'conversation';

export type ConnectionStage = 
  | 1 // Stage 1: Discovery (Anonymous)
  | 2 // Stage 2: Introduction Request Sent
  | 3 // Stage 3: Accepted (Mutual Shared Details Unlocked)
  | 4 // Stage 4: Conversation (In-App Safe Chat)
  | 5; // Stage 5: Meeting (Public Meeting Coordination)

export type MapVisibilityOption = 
  | 'all_criteria' 
  | 'highly_compatible_only' 
  | 'opted_interact_only' 
  | 'nobody';

export type LocationDisplayMode = 
  | 'approximate_area' 
  | 'city_only' 
  | 'hidden';

export type AvailabilityStatus = 
  | 'available' 
  | 'temporarily_unavailable' 
  | 'hidden';

export interface ProfileFieldPerms {
  firstName: VisibilityState;
  fullName: VisibilityState;
  age: VisibilityState;
  gender: VisibilityState;
  profilePhoto: VisibilityState;
  additionalPhotos: VisibilityState;
  shortIntro: VisibilityState;
  fullBio: VisibilityState;
  education: VisibilityState;
  institution: VisibilityState;
  profession: VisibilityState;
  company: VisibilityState;
  workplaceLocation: VisibilityState;
  city: VisibilityState;
  area: VisibilityState;
  exactLocation: 'private'; // Hardcoded invariant: NEVER public or requestable
  lifestylePreferences: VisibilityState;
  detailedLifestyle: VisibilityState;
  familyOverview: VisibilityState;
  detailedFamily: VisibilityState;
  phoneNumber: VisibilityState; // Default private
  email: VisibilityState;       // Default private
}

export interface UserShareSelection {
  // Basic
  firstName: boolean;
  age: boolean;
  gender: boolean;
  fullName: boolean;
  // Photo
  profilePhoto: boolean;
  additionalPhotos: boolean;
  // About Me
  shortIntro: boolean;
  fullBio: boolean;
  // Education
  education: boolean;
  institution: boolean;
  // Career
  profession: boolean;
  company: boolean;
  workplaceLocation: boolean;
  // Location
  city: boolean;
  area: boolean;
  exactLocation: false; // Always false
  // Lifestyle
  lifestylePreferences: boolean;
  detailedLifestyle: boolean;
  // Family
  familyOverview: boolean;
  detailedFamily: boolean;
  // Contact
  phoneNumber: boolean;
  email: boolean;
}

export interface RouteShareSelection {
  destinationCity: boolean;
  approximateArrivalArea: boolean;
  approximateArrivalTime: boolean;
  exactRoute: boolean; // default false
  liveLocation: boolean; // default false - NEVER shared automatically
}

export interface UserProfile {
  id: string;
  firstName: string;
  fullName: string;
  age: number;
  gender: 'Female' | 'Male' | 'Other';
  profilePhotoUrl: string;
  additionalPhotoUrls: string[];
  shortIntro: string;
  fullBio: string;
  education: string;
  institution: string;
  profession: string;
  company: string;
  workplaceLocation: string;
  city: string;
  area: string;
  // Actual internal coordinates (fuzzed before sending to client discovery)
  actualLat: number;
  actualLng: number;
  lifestylePreferences: string[];
  detailedLifestyle: string;
  familyOverview: string;
  detailedFamily: string;
  phoneNumber: string;
  email: string;
  marriageTimeline: string;
  interests: string[];
  fieldPerms: ProfileFieldPerms;
}

export interface FuzzedCoordinate {
  latitude: number;
  longitude: number;
  radiusKm: number;
  approximateZoneName: string;
  displayDistance: string;
}

export interface AnonymousCandidate {
  id: string;
  compatibilityPercentage: number;
  availability: 'Open to introductions' | 'Busy this week' | 'Exploring';
  approximateZone: string;
  distanceLabel: string;
  marriageTimelineMatch: boolean;
  lifestyleMatch: boolean;
  locationPreferenceMatch: boolean;
  sharedInterestsCount: number;
  compatibilityReasons: string[];
  fuzzedCoordinate: FuzzedCoordinate;
  isAlongRoute?: boolean;
  routeDetourMinutes?: number;
  clusterCount?: number; // >1 if aggregated cluster marker
  availabilityNote?: string; // e.g. "Available on Saturday", "Open for coffee introduction"
  meetingAvailability?: boolean;
  distanceFromRouteKm?: number;
  suggestedVenue?: PublicVenue;
}

export interface IntroductionRequest {
  id: string;
  requesterId: string;
  recipientId: string;
  requestType: RequestType;
  customMessage: string;
  compatibilityPercentage: number;
  sharedFields: UserShareSelection;
  routeShare?: RouteShareSelection;
  routeDetails?: {
    originCity: string;
    destinationCity: string;
    travelDate: string;
    estimatedArrivalTime: string;
    potentialPublicVenue: string;
  };
  requesterRevealedData: Partial<UserProfile>;
  createdAt: string;
  status: 'pending' | 'accepted' | 'declined' | 'more_info_requested';
  stage: ConnectionStage;
  selectedInterestReasons?: string[];
  includeMatchingDetails?: boolean;
  matchingDetails?: {
    compatibilityPercentage: number;
    commonMargamsCount: number;
    sharedGoalsCount: number;
    locationProximity: string;
  };
}

export interface ChatMessage {
  id: string;
  senderId: string;
  recipientId: string;
  text: string;
  timestamp: string;
  isSystemNotice?: boolean;
}

export interface PublicVenue {
  id: string;
  name: string;
  category: 'cafe' | 'restaurant' | 'mall' | 'park' | 'hotel_lobby' | 'library';
  city: string;
  area: string;
  address: string;
  rating: number;
  isVerifiedPublic: boolean;
}

export interface MeetingProposal {
  id: string;
  connectionId: string;
  proposerId: string;
  date: string;
  time: string;
  venue: PublicVenue;
  detourMinutes: number;
  note: string;
  status: 'proposed' | 'accepted' | 'reschedule_suggested' | 'declined';
  suggestedAlternativeVenue?: PublicVenue;
  suggestedAlternativeTime?: string;
}

export interface RouteCorridor {
  id: string;
  name: string;
  origin: { name: string; lat: number; lng: number };
  destination: { name: string; lat: number; lng: number };
  waypoints: { lat: number; lng: number }[];
  distanceKm: number;
  durationLabel: string;
}

export interface MapBounds {
  northEast: {
    latitude: number;
    longitude: number;
  };
  southWest: {
    latitude: number;
    longitude: number;
  };
}

export type DiscoveryMode = 'around_me' | 'along_route' | 'destination' | 'plan_trip';

export type TransportMode = 'car' | 'train' | 'flight' | 'bus';

export interface TripPlan {
  id: string;
  userId: string;
  origin: string;
  destination: string;
  departureDate: string;
  returnDate: string;
  transportMode: TransportMode;
  discoveryPreferences?: DiscoveryFilterParams;
  visibility: 'active' | 'paused';
  createdAt: string;
}

export interface DiscoveryFilterParams {
  minAge: number;
  maxAge: number;
  maxDistanceKm: number;
  minCompatibility: number; // e.g. 70, 80, 90
  marriageTimeline?: string;
  professionCategory?: string;
  verifiedOnly?: boolean;
  targetGender?: 'Female' | 'Male' | 'All';
  maxDetourMinutes?: number;
  availableOnWeekendOnly?: boolean;
  selectedMargam?: string;
  margamIntent?: string;
  matchType?: string;
  openToIntroductionsOnly?: boolean;
  openToMeetingsOnly?: boolean;
}

export interface MapCluster {
  id: string;
  latitude: number;
  longitude: number;
  count: number;
  approximateZoneName: string;
  averageCompatibility: number;
  candidateIds: string[];
}

export interface AvailabilitySummary {
  within1km: number;
  within3km: number;
  within5km: number;
  fiveToTenKm: number;
  tenToTwentyFiveKm: number;
  alongRoute: number;
  nearDestination: number;
  strongMatches: number;
  availableDuringDates: number;
  potentialMeetingAreas: number;
}

export interface DiscoveryQueryResult {
  totalMatches: number;
  within5km: number;
  fiveToTenKm: number;
  alongRoute: number;
  atDestination: number;
  clusters: MapCluster[];
  candidates: AnonymousCandidate[];
  lastQueriedAt: string;
  mode: DiscoveryMode;
  availabilitySummary?: AvailabilitySummary;
  tripPlan?: TripPlan | null;
}

export interface PlaceSearchResult {
  id: string;
  name: string;
  subtext: string;
  latitude: number;
  longitude: number;
  category?: 'city' | 'mall' | 'cafe' | 'landmark' | 'transit' | 'area';
}

// -------------------------------------------------------------
// Today's Match Insights Types
// -------------------------------------------------------------

export type CandidateState = 
  | 'new' 
  | 'seen' 
  | 'saved' 
  | 'dismissed' 
  | 'requested' 
  | 'accepted' 
  | 'declined' 
  | 'blocked' 
  | 'connected';

export interface MatchInsightsSummary {
  newMatchesCount: number;
  routeMatchesCount: number;
  destinationMatchesCount: number;
  highCompatibilityCount: number;
  destinationName: string;
  routeSummary: string;
  hasActiveRoute: boolean;
  hasActiveDestination: boolean;
  lastUpdatedAt: string;
  highCompatThreshold: number;
  detourFilterMinutes: number;
  destinationRadiusKm: number;
}

export interface CompatibilityCategoryScore {
  category: string;
  rating: 'Exceptional' | 'Very strong' | 'Strong' | 'Moderate' | 'Aligning';
  percentage: number;
  details: string;
  isPositive: boolean;
}

export interface DetailedCompatibilityBreakdown {
  candidateId: string;
  overallPercentage: number;
  categories: {
    marriageGoals: CompatibilityCategoryScore;
    lifestyle: CompatibilityCategoryScore;
    location: CompatibilityCategoryScore;
    educationCareer: CompatibilityCategoryScore;
    familyPreferences: CompatibilityCategoryScore;
    personalityInterests: CompatibilityCategoryScore;
  };
  keyAlignments: string[];
  potentialDifferences: string[];
}

export interface NewMatchesQueryOptions {
  userId?: string;
  currentDate?: string;
  userPreferences?: Partial<DiscoveryFilterParams>;
  discoveryRadius?: number;
  compatibilityThreshold?: number;
  newWithinDays?: number; // default 7
  filterSort?: 'newest' | 'compatibility' | 'nearest' | 'available_now' | 'verified';
}

export interface RouteMatchInsightsOptions {
  userId?: string;
  origin?: { latitude: number; longitude: number; name?: string };
  destination?: { latitude: number; longitude: number; name?: string };
  detourMinutesThreshold?: number; // 5, 10, 20, 30
  userPreferences?: Partial<DiscoveryFilterParams>;
}

export interface DestinationMatchInsightsOptions {
  userId?: string;
  destinationName?: string;
  radiusKm?: number; // 1, 3, 5, 10, 25
  availableDuringVisitOnly?: boolean;
  userPreferences?: Partial<DiscoveryFilterParams>;
}

export interface HighCompatibilityQueryOptions {
  userId?: string;
  threshold?: number; // 80, 85, 90, 95
  userPreferences?: Partial<DiscoveryFilterParams>;
  sortBy?: 'compatibility' | 'recent' | 'distance';
}

// -------------------------------------------------------------
// MARGAM — Interest-Based Life Path Discovery System Types
// -------------------------------------------------------------

export type MargamCategoryId =
  | 'business'
  | 'travel'
  | 'lifestyle'
  | 'fitness'
  | 'food'
  | 'adventure'
  | 'creativity'
  | 'nature'
  | 'technology'
  | 'education'
  | 'finance'
  | 'home_living'
  | 'personal_growth';

export type MargamIntent =
  | 'love_this'
  | 'regularly_do'
  | 'want_to_try'
  | 'want_partner_who_likes'
  | 'want_to_build'
  | 'want_to_learn'
  | 'want_to_travel';

export type MargamPriority = 'core' | 'important' | 'casual' | 'future_goal';

export interface MargamInterestItem {
  id: string;
  name: string;
  emoji: string;
  categoryId: MargamCategoryId;
  description: string;
  popularCount: number;
  subInterests: string[];
}

export interface UserMargamSelection {
  interestId: string;
  interestName: string;
  emoji: string;
  intent: MargamIntent;
  priority: MargamPriority;
  customGoalText?: string;
  visibility: VisibilityState;
}

export interface MargamProfileCandidate {
  id: string;
  name: string;
  age: number;
  isVerified: boolean;
  photoUrl: string;
  photoCount: number;
  profession: string;
  city: string;
  area: string;
  bio: string;
  compatibilityPercentage: number;
  interestAlignmentPercentage: number;
  sharedMargams: {
    name: string;
    emoji: string;
    tagColor: string;
    textColor: string;
  }[];
  lookingToBuild: string;
  openToRelocate: string;
  marriageTimeline: string;
  whyThisMatchExplanation: string;
}

export interface MargamCategoryCardDef {
  id: MargamCategoryId;
  name: string;
  emoji: string;
  bgColor: string;
  iconColor: string;
  interestsCount: number;
}

export interface MargamIdeaPost {
  id: string;
  authorId: string;
  authorName: string;
  authorZone: string;
  authorPhotoUrl: string;
  margamId: string;
  margamName: string;
  emoji: string;
  title: string;
  concept: string;
  createdAt: string;
  likesCount: number;
  isLiked: boolean;
  commentsCount: number;
}

export interface MargamCollaborativePlan {
  id: string;
  type: 'cafe' | 'travel' | 'fitness' | 'creative';
  title: string;
  subtitle: string;
  emoji: string;
  partnerName: string;
  partnerPhotoUrl: string;
  status: 'drafting' | 'shared' | 'completed';
  sections: {
    title: string;
    content: string;
    userNote?: string;
    partnerNote?: string;
  }[];
  aiSuggestions: string[];
  lastUpdatedAt: string;
}

// -------------------------------------------------------------
// Other User Profile Screen Types (Detailed Privacy-Filtered Profile)
// -------------------------------------------------------------

export type ProfileRelationshipState =
  | 'UNKNOWN'
  | 'VIEWED'
  | 'SAVED'
  | 'PASSED'
  | 'INTERESTED'
  | 'REQUEST_PENDING'
  | 'REQUEST_RECEIVED'
  | 'REQUEST_ACCEPTED'
  | 'CONNECTED'
  | 'BLOCKED'
  | 'HIDDEN';

export type PhotoVisibility = 'public' | 'request_only' | 'connections_only' | 'private';

export interface ProfilePhotoItem {
  id: string;
  url: string;
  visibility: PhotoVisibility;
  isPrimary?: boolean;
  caption?: string;
}

export interface ProfileMargamDisplayItem {
  id: string;
  name: string;
  emoji: string;
  intent: string;
  intentCategory: 'Future Goal' | 'Regular' | 'Lifestyle' | 'Interest' | 'Hobby' | 'Future Plan';
  bgColor: string;
  textColor: string;
  isShared: boolean;
  userIntent?: string;
  description?: string;
}

export interface DetailedOtherUserProfile {
  id: string;
  name: string;
  age: number;
  isVerified: boolean;
  verificationDetails?: {
    idVerified: boolean;
    selfieVerified: boolean;
    employmentVerified: boolean;
    verifiedAt: string;
  };
  availability: 'Open to Introductions' | 'Available for Chat' | 'Open to Meeting' | 'Available during planned trip';
  profession: string;
  city: string;
  area: string;
  education: string;
  religion: string;
  community?: string;
  maritalStatus?: string;
  languages?: string[];
  height: string;
  relocationIntent: string;
  marriageTimeline: string;
  compatibilityPercentage: number;
  compatibilitySummary: string;
  photos: ProfilePhotoItem[];
  margams: ProfileMargamDisplayItem[];
  aboutText: string;
  lookingForText: string;
  partnerPreferences: {
    locationPreference: string;
    marriageTimeline: string;
    familyPreference: string;
  };
  relationshipState: ProfileRelationshipState;
  discoverySource?: string;
  sharedPathsCount?: number;
  sharedPaths?: {
    type: 'shared' | 'complementary' | 'different';
    title: string;
    subtitle: string;
    emoji: string;
  }[];
  plannedTrip?: {
    destination: string;
    dates: string;
    availability: string;
  };
}

// -------------------------------------------------------------
// Margam Swipe Discovery & Saved Profiles Types
// -------------------------------------------------------------

export type DiscoveryActionType =
  | 'PASSED'
  | 'INTEREST_SHOWN'
  | 'SAVED'
  | 'UNDO'
  | 'MUTUAL_INTEREST'
  | 'VIEWED'
  | 'PRIORITY_INTEREST';

export type DiscoveryActionSource =
  | 'MARGAMS_SWIPE'
  | 'RECOMMENDED'
  | 'MAP'
  | 'AROUND_ME'
  | 'ALONG_ROUTE'
  | 'AT_DESTINATION'
  | 'PLAN_A_TRIP'
  | 'SEARCH'
  | 'NEW_MATCH'
  | 'HIGH_COMPATIBILITY';

export interface DiscoveryAction {
  id: string;
  viewerId: string;
  profileId: string;
  actionType: DiscoveryActionType;
  source: DiscoveryActionSource;
  margamId?: string;
  sessionId: string;
  createdAt: string;
}

export type SavedProfileCategory =
  | 'Saved Recently'
  | 'High Compatibility'
  | 'Shared Margams'
  | 'Potential Future Matches';

export type SavedProfileLifecycleState =
  | 'Saved'
  | 'Interested'
  | 'Request Sent'
  | 'Connected'
  | 'Passed';

export interface SavedMargamProfile {
  candidate: MargamProfileCandidate;
  savedAt: string;
  category: SavedProfileCategory;
  currentState: SavedProfileLifecycleState;
  notes?: string;
}

export interface MargamSwipeFilterOptions {
  selectedMargam: string;
  matchMode: 'ALL' | 'ANY';
  intentFilters: string[];
  coreOnly: boolean;
  minAge: number;
  maxAge: number;
  minCompatibility: number;
  maxDistanceKm: number;
  marriageTimeline?: string;
  relocation?: string;
  verifiedOnly: boolean;
}

export interface SwipeSessionState {
  sessionId: string;
  currentMargam: string;
  filters: MargamSwipeFilterOptions;
  profilesShown: string[];
  actions: DiscoveryAction[];
  startTime: string;
  endTime?: string;
}export * from './profile';
