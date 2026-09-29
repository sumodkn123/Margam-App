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
