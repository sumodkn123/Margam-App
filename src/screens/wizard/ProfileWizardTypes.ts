// MARGAM — Profile Creation Wizard Types & Data Models
// Defines the 8-step progressive data model matching the reference design.

export interface WizardFormData {
  // Step 1: Basic Information
  firstName: string;
  age: number;
  gender: 'Female' | 'Male' | 'Non-binary';
  lookingFor: 'Male' | 'Female' | 'Open';
  location: string;
  willingToRelocate: boolean;
  relocationPreference: 'Within India' | 'Abroad' | 'Not Sure';

  // Step 2: Photos
  photos: string[];

  // Step 3: About You
  bio: string;
  personalityTraits: string[];
  languages: string[];

  // Step 4: Education & Career
  educationLevel: string;
  fieldOfStudy: string;
  profession: string;
  workMode: 'Work from Office' | 'Hybrid' | 'Remote';
  annualIncomeRange: string;

  // Step 5: Family & Personal Details
  maritalStatus: 'Single' | 'Divorced' | 'Widowed';
  familyType: 'Nuclear' | 'Joint' | 'Not Sure';
  hasSiblings: boolean;
  showFamilyToOthers: boolean;

  // Step 6: Religion & Horoscope
  religion: string;
  community: string;
  hasHoroscope: 'Yes' | 'No' | 'Not sure';
  showReligionToOthers: boolean;

  // Step 7: Your Margams (Interests)
  selectedMargams: string[];

  // Step 8: Life Map & Partner Preferences
  activeLifeMapTab: 'life_map' | 'preferences';
  lifeMapNow: string;
  lifeMapNext: string;
  lifeMapFuture: string;
  partnerMinAge: number;
  partnerMaxAge: number;
  partnerLocation: string;
}

export const INITIAL_WIZARD_DATA: WizardFormData = {
  // Step 1: Basic Information
  firstName: 'Ananya',
  age: 27,
  gender: 'Female',
  lookingFor: 'Male',
  location: 'Kochi, Kerala',
  willingToRelocate: true,
  relocationPreference: 'Within India',

  // Step 2: Photos
  photos: [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
  ],

  // Step 3: About You
  bio: "I love good food, meaningful conversations and exploring new places. I'm looking for a partner who shares similar interests and life goals.",
  personalityTraits: ['Kind', 'Ambitious', 'Family-oriented'],
  languages: ['Malayalam', 'English'],

  // Step 4: Education & Career
  educationLevel: 'Masters',
  fieldOfStudy: 'Marketing',
  profession: 'Marketing Professional',
  workMode: 'Hybrid',
  annualIncomeRange: '₹15 - ₹25 Lakhs',

  // Step 5: Family & Personal Details
  maritalStatus: 'Single',
  familyType: 'Joint',
  hasSiblings: true,
  showFamilyToOthers: true,

  // Step 6: Religion & Horoscope
  religion: 'Hindu',
  community: 'Ezhava',
  hasHoroscope: 'Yes',
  showReligionToOthers: false,

  // Step 7: Your Margams (Interests)
  selectedMargams: ['Café Business', 'Travel', 'Photography'],

  // Step 8: Life Map & Partner Preferences
  activeLifeMapTab: 'life_map',
  lifeMapNow: 'Focus on career growth, travel and build a café business.',
  lifeMapNext: 'Settle down, start a business, explore new places together.',
  lifeMapFuture: 'A happy family, meaningful work, and a life full of travel and good food.',
  partnerMinAge: 26,
  partnerMaxAge: 32,
  partnerLocation: 'Kerala or Open',
};
