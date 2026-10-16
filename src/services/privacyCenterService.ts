// MARGAM — Privacy & Visibility Center Service
// Unified state management and data layer for profile visibility, photo controls,
// granular field disclosures, location permissions, per-request sharing, and granted access.

export type DefaultProfileVisibility = 'private' | 'limited' | 'public';

export type FieldVisibilityOption =
  | 'approved_connections_only'
  | 'matching_people'
  | 'everyone'
  | 'hidden';

export interface PersonalDetailsVisibility {
  nameAge: FieldVisibilityOption;
  location: FieldVisibilityOption;
  profession: FieldVisibilityOption;
  education: FieldVisibilityOption;
  familyDetails: FieldVisibilityOption;
  religion: FieldVisibilityOption;
  horoscope: FieldVisibilityOption;
  maritalStatus: FieldVisibilityOption;
}

export interface PhotosMediaPrivacy {
  isPrivate: boolean;
  blurPhotosNonApproved: boolean;
  hidePhotosInDiscovery: boolean;
  allowPhotoDownload: boolean;
  photos: Array<{
    id: string;
    url: string;
    isMain: boolean;
  }>;
}

export interface LocationDiscoveryPrivacy {
  useLocationForMatches: boolean;
  locationVisibility: 'exact' | 'city_area' | 'hidden';
  showOnMap: boolean;
  showWhenTravelling: boolean;
  showAtDestinations: boolean;
}

export interface RequestSharingPrivacy {
  defaultSharingLevel: 'basic' | 'extended' | 'custom';
  additionalSections: {
    photos: boolean;
    educationCareer: boolean;
    locationCityArea: boolean;
    familyDetails: boolean;
    religionHoroscope: boolean;
    lifeMapGoals: boolean;
  };
}

export interface GrantedAccessUser {
  id: string;
  name: string;
  age: number;
  avatar: string;
  status: 'approved' | 'pending' | 'revoked';
  dateLabel: string;
  accessLevel: 'full' | 'partial';
  profession?: string;
  area?: string;
}

export type PrivacyTemplateKey = 'standard' | 'open_to_new_people' | 'maximum_privacy';

export interface PrivacyCenterState {
  profileVisibility: DefaultProfileVisibility;
  personalDetails: PersonalDetailsVisibility;
  photosMedia: PhotosMediaPrivacy;
  locationDiscovery: LocationDiscoveryPrivacy;
  requestSharing: RequestSharingPrivacy;
  grantedAccess: GrantedAccessUser[];
  activeTemplate: PrivacyTemplateKey;
}

const INITIAL_PHOTOS = [
  {
    id: 'p-1',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
    isMain: true,
  },
  {
    id: 'p-2',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    isMain: false,
  },
  {
    id: 'p-3',
    url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&auto=format&fit=crop&q=80',
    isMain: false,
  },
  {
    id: 'p-4',
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
    isMain: false,
  },
];

const INITIAL_GRANTED_ACCESS: GrantedAccessUser[] = [
  {
    id: 'usr-grant-rahul',
    name: 'Rahul',
    age: 29,
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=300&fit=crop&crop=faces',
    status: 'approved',
    dateLabel: 'Approved on 12 Jan 2025',
    accessLevel: 'full',
    profession: 'Software Architect',
    area: 'Kochi',
  },
  {
    id: 'usr-grant-meera',
    name: 'Meera',
    age: 26,
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop&crop=faces',
    status: 'approved',
    dateLabel: 'Approved on 10 Jan 2025',
    accessLevel: 'partial',
    profession: 'Architectural Consultant',
    area: 'Ernakulam',
  },
  {
    id: 'usr-grant-arjun',
    name: 'Arjun',
    age: 31,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=faces',
    status: 'approved',
    dateLabel: 'Approved on 5 Jan 2025',
    accessLevel: 'partial',
    profession: 'Senior Consultant',
    area: 'Kochi',
  },
  {
    id: 'usr-grant-sneha',
    name: 'Sneha',
    age: 28,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop&crop=faces',
    status: 'approved',
    dateLabel: 'Approved on 2 Jan 2025',
    accessLevel: 'full',
    profession: 'Chartered Accountant',
    area: 'Kochi',
  },
  {
    id: 'usr-grant-karthik',
    name: 'Karthik',
    age: 30,
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&h=300&fit=crop&crop=faces',
    status: 'pending',
    dateLabel: 'Requested on 14 Jan 2025',
    accessLevel: 'partial',
    profession: 'Product Lead',
    area: 'Bangalore',
  },
  {
    id: 'usr-grant-devika',
    name: 'Devika',
    age: 27,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop&crop=faces',
    status: 'pending',
    dateLabel: 'Requested on 13 Jan 2025',
    accessLevel: 'partial',
    profession: 'Doctor',
    area: 'Thrissur',
  },
  {
    id: 'usr-grant-vishnu',
    name: 'Vishnu',
    age: 30,
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=300&h=300&fit=crop&crop=faces',
    status: 'revoked',
    dateLabel: 'Access removed on 15 Dec 2024',
    accessLevel: 'partial',
    profession: 'Civil Engineer',
    area: 'Trivandrum',
  },
  {
    id: 'usr-grant-priya',
    name: 'Priya',
    age: 27,
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&h=300&fit=crop&crop=faces',
    status: 'revoked',
    dateLabel: 'Access removed on 10 Dec 2024',
    accessLevel: 'partial',
    profession: 'Assistant Professor',
    area: 'Calicut',
  },
  {
    id: 'usr-grant-anand',
    name: 'Anand',
    age: 32,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=faces',
    status: 'revoked',
    dateLabel: 'Access removed on 1 Dec 2024',
    accessLevel: 'full',
    profession: 'Financial Analyst',
    area: 'Kochi',
  },
];

class PrivacyCenterService {
  private state: PrivacyCenterState = {
    profileVisibility: 'private',
    personalDetails: {
      nameAge: 'approved_connections_only',
      location: 'matching_people',
      profession: 'matching_people',
      education: 'matching_people',
      familyDetails: 'hidden',
      religion: 'approved_connections_only',
      horoscope: 'hidden',
      maritalStatus: 'matching_people',
    },
    photosMedia: {
      isPrivate: true,
      blurPhotosNonApproved: true,
      hidePhotosInDiscovery: false,
      allowPhotoDownload: false,
      photos: [...INITIAL_PHOTOS],
    },
    locationDiscovery: {
      useLocationForMatches: true,
      locationVisibility: 'city_area',
      showOnMap: true,
      showWhenTravelling: true,
      showAtDestinations: false,
    },
    requestSharing: {
      defaultSharingLevel: 'basic',
      additionalSections: {
        photos: true,
        educationCareer: true,
        locationCityArea: true,
        familyDetails: false,
        religionHoroscope: false,
        lifeMapGoals: true,
      },
    },
    grantedAccess: [...INITIAL_GRANTED_ACCESS],
    activeTemplate: 'standard',
  };

  private listeners: Set<(state: PrivacyCenterState) => void> = new Set();

  public getState(): PrivacyCenterState {
    return JSON.parse(JSON.stringify(this.state));
  }

  public subscribe(listener: (state: PrivacyCenterState) => void): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    const snap = this.getState();
    this.listeners.forEach((listener) => {
      try {
        listener(snap);
      } catch (e) {
        console.error('Error in privacy center listener:', e);
      }
    });
  }

  // --- Profile Visibility ---
  public setProfileVisibility(visibility: DefaultProfileVisibility) {
    this.state.profileVisibility = visibility;
    this.notify();
  }

  // --- Personal Details ---
  public updatePersonalDetailField(
    field: keyof PersonalDetailsVisibility,
    option: FieldVisibilityOption
  ) {
    this.state.personalDetails[field] = option;
    this.notify();
  }

  // --- Photos & Media ---
  public updatePhotosMediaSettings(partial: Partial<PhotosMediaPrivacy>) {
    this.state.photosMedia = {
      ...this.state.photosMedia,
      ...partial,
    };
    this.notify();
  }

  public removePhoto(photoId: string) {
    if (this.state.photosMedia.photos.length <= 1) return;
    this.state.photosMedia.photos = this.state.photosMedia.photos.filter((p) => p.id !== photoId);
    if (!this.state.photosMedia.photos.some((p) => p.isMain)) {
      this.state.photosMedia.photos[0].isMain = true;
    }
    this.notify();
  }

  public addPhoto(url: string) {
    const newPhoto = {
      id: `p-${Date.now()}`,
      url,
      isMain: this.state.photosMedia.photos.length === 0,
    };
    this.state.photosMedia.photos.push(newPhoto);
    this.notify();
  }

  // --- Location & Discovery ---
  public updateLocationDiscoverySettings(partial: Partial<LocationDiscoveryPrivacy>) {
    this.state.locationDiscovery = {
      ...this.state.locationDiscovery,
      ...partial,
    };
    this.notify();
  }

  // --- Request Sharing Settings ---
  public updateRequestSharingSettings(partial: Partial<RequestSharingPrivacy>) {
    this.state.requestSharing = {
      ...this.state.requestSharing,
      ...partial,
      additionalSections: {
        ...this.state.requestSharing.additionalSections,
        ...(partial.additionalSections || {}),
      },
    };
    this.notify();
  }

  // --- Granted Access ---
  public revokeUserAccess(userId: string) {
    const user = this.state.grantedAccess.find((u) => u.id === userId);
    if (user) {
      user.status = 'revoked';
      user.dateLabel = `Access removed on ${new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })}`;
      this.notify();
    }
  }

  public restoreUserAccess(userId: string, level: 'full' | 'partial' = 'partial') {
    const user = this.state.grantedAccess.find((u) => u.id === userId);
    if (user) {
      user.status = 'approved';
      user.accessLevel = level;
      user.dateLabel = `Approved on ${new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })}`;
      this.notify();
    }
  }

  public updateUserAccessLevel(userId: string, level: 'full' | 'partial') {
    const user = this.state.grantedAccess.find((u) => u.id === userId);
    if (user) {
      user.accessLevel = level;
      this.notify();
    }
  }

  // --- Privacy Templates ---
  public applyTemplate(template: PrivacyTemplateKey) {
    this.state.activeTemplate = template;

    if (template === 'standard') {
      this.state.profileVisibility = 'private';
      this.state.photosMedia = {
        ...this.state.photosMedia,
        isPrivate: true,
        blurPhotosNonApproved: true,
        hidePhotosInDiscovery: false,
        allowPhotoDownload: false,
      };
      this.state.personalDetails = {
        nameAge: 'approved_connections_only',
        location: 'matching_people',
        profession: 'matching_people',
        education: 'matching_people',
        familyDetails: 'hidden',
        religion: 'approved_connections_only',
        horoscope: 'hidden',
        maritalStatus: 'matching_people',
      };
      this.state.locationDiscovery = {
        useLocationForMatches: true,
        locationVisibility: 'city_area',
        showOnMap: true,
        showWhenTravelling: true,
        showAtDestinations: false,
      };
      this.state.requestSharing.defaultSharingLevel = 'basic';
    } else if (template === 'open_to_new_people') {
      this.state.profileVisibility = 'limited';
      this.state.photosMedia = {
        ...this.state.photosMedia,
        isPrivate: false,
        blurPhotosNonApproved: true,
        hidePhotosInDiscovery: false,
        allowPhotoDownload: false,
      };
      this.state.personalDetails = {
        nameAge: 'matching_people',
        location: 'matching_people',
        profession: 'matching_people',
        education: 'matching_people',
        familyDetails: 'matching_people',
        religion: 'matching_people',
        horoscope: 'matching_people',
        maritalStatus: 'matching_people',
      };
      this.state.locationDiscovery = {
        useLocationForMatches: true,
        locationVisibility: 'city_area',
        showOnMap: true,
        showWhenTravelling: true,
        showAtDestinations: true,
      };
      this.state.requestSharing.defaultSharingLevel = 'extended';
    } else if (template === 'maximum_privacy') {
      this.state.profileVisibility = 'private';
      this.state.photosMedia = {
        ...this.state.photosMedia,
        isPrivate: true,
        blurPhotosNonApproved: true,
        hidePhotosInDiscovery: true,
        allowPhotoDownload: false,
      };
      this.state.personalDetails = {
        nameAge: 'approved_connections_only',
        location: 'hidden',
        profession: 'approved_connections_only',
        education: 'approved_connections_only',
        familyDetails: 'hidden',
        religion: 'hidden',
        horoscope: 'hidden',
        maritalStatus: 'approved_connections_only',
      };
      this.state.locationDiscovery = {
        useLocationForMatches: false,
        locationVisibility: 'hidden',
        showOnMap: false,
        showWhenTravelling: false,
        showAtDestinations: false,
      };
      this.state.requestSharing.defaultSharingLevel = 'custom';
    }

    this.notify();
  }

  // --- Preview Generator ---
  public getPreviewData(viewMode: 'approved' | 'others') {
    const isApproved = viewMode === 'approved';
    const state = this.state;

    return {
      name: isApproved || state.personalDetails.nameAge !== 'hidden' ? 'Ananya' : 'Member',
      age: isApproved || state.personalDetails.nameAge !== 'hidden' ? 27 : undefined,
      verified: true,
      profession:
        isApproved || state.personalDetails.profession !== 'hidden'
          ? 'Marketing Professional'
          : 'Professional',
      location:
        isApproved || state.locationDiscovery.locationVisibility !== 'hidden'
          ? 'Kochi area (5 km)'
          : 'Kerala',
      bio: 'Love travel, good food, meaningful conversations and building a café someday ☕',
      margams: [
        { label: 'Café Business', emoji: '☕' },
        { label: 'Travel', emoji: '✈' },
        { label: 'Photography', emoji: '📷' },
        { label: '+3 more', emoji: '✨' },
      ],
      photosCount: state.photosMedia.photos.length,
      primaryPhoto: state.photosMedia.photos[0]?.url || INITIAL_PHOTOS[0].url,
      isPhotoBlurred: !isApproved && state.photosMedia.blurPhotosNonApproved,
      familyVisible: isApproved || state.personalDetails.familyDetails !== 'hidden',
      religionVisible: isApproved || state.personalDetails.religion !== 'hidden',
      horoscopeVisible: isApproved || state.personalDetails.horoscope !== 'hidden',
      educationVisible: isApproved || state.personalDetails.education !== 'hidden',
      noticeText: isApproved
        ? 'This is how your profile appears to approved connections. All permitted sections are visible.'
        : 'This is how your profile appears to non-approved users. Sensitive details and full photos are protected.',
    };
  }
}

export const privacyCenterService = new PrivacyCenterService();
