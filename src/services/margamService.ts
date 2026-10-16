import {
  MargamCategoryId,
  MargamCategoryCardDef,
  MargamInterestItem,
  UserMargamSelection,
  MargamProfileCandidate,
  MargamIdeaPost,
  MargamCollaborativePlan,
} from '../types';

// -------------------------------------------------------------
// 1. Margam Categories Definitions (Visual Cards)
// -------------------------------------------------------------

export const MARGAM_CATEGORIES: MargamCategoryCardDef[] = [
  {
    id: 'business',
    name: 'Business',
    emoji: '💼',
    bgColor: '#FFF1F2',
    iconColor: '#E11D48',
    interestsCount: 12,
  },
  {
    id: 'travel',
    name: 'Travel',
    emoji: '✈',
    bgColor: '#EFF6FF',
    iconColor: '#2563EB',
    interestsCount: 16,
  },
  {
    id: 'lifestyle',
    name: 'Lifestyle',
    emoji: '🍃',
    bgColor: '#DCFCE7',
    iconColor: '#16A34A',
    interestsCount: 14,
  },
  {
    id: 'fitness',
    name: 'Fitness',
    emoji: '🏋',
    bgColor: '#F3E8FF',
    iconColor: '#9333EA',
    interestsCount: 10,
  },
  {
    id: 'food',
    name: 'Food',
    emoji: '🍴',
    bgColor: '#FFEDD5',
    iconColor: '#EA580C',
    interestsCount: 11,
  },
  {
    id: 'adventure',
    name: 'Adventure',
    emoji: '🏔',
    bgColor: '#CCFBF1',
    iconColor: '#0D9488',
    interestsCount: 9,
  },
  {
    id: 'creativity',
    name: 'Creativity',
    emoji: '🎨',
    bgColor: '#FFE4E6',
    iconColor: '#E11D48',
    interestsCount: 8,
  },
  {
    id: 'nature',
    name: 'Nature',
    emoji: '🌳',
    bgColor: '#D1FAE5',
    iconColor: '#059669',
    interestsCount: 7,
  },
];

// -------------------------------------------------------------
// 2. Specific Interests Catalogue
// -------------------------------------------------------------

export const MARGAM_INTERESTS: MargamInterestItem[] = [
  // Business
  {
    id: 'int-cafe',
    name: 'Café Business',
    emoji: '☕',
    categoryId: 'business',
    description: 'Dreaming of starting, owning, or managing a specialty coffee shop or bakery café.',
    popularCount: 142,
    subInterests: ['Specialty Coffee', 'Bakery + Café', 'Destination Café', 'Food Truck', 'Cloud Kitchen'],
  },
  {
    id: 'int-startup',
    name: 'Software Startup',
    emoji: '💻',
    categoryId: 'business',
    description: 'Building digital products, AI ventures, or scalable high-growth tech companies.',
    popularCount: 210,
    subInterests: ['SaaS', 'AI & Machine Learning', 'Mobile Apps', 'B2B Platforms'],
  },
  {
    id: 'int-restaurant',
    name: 'Restaurant & Dining',
    emoji: '🍽',
    categoryId: 'business',
    description: 'Creating memorable dining experiences and innovative culinary concepts.',
    popularCount: 98,
    subInterests: ['Fine Dining', 'Bistro', 'Heritage Kerala Kitchen', 'Theme Restaurant'],
  },
  {
    id: 'int-hospitality',
    name: 'Boutique Hospitality',
    emoji: '🏨',
    categoryId: 'business',
    description: 'Developing eco-resorts, homestays, or wellness retreats across South India.',
    popularCount: 76,
    subInterests: ['Eco Resort', 'Heritage Homestay', 'Backwater Villa', 'Treehouse Glamping'],
  },

  // Travel
  {
    id: 'int-international-travel',
    name: 'International Travel',
    emoji: '✈',
    categoryId: 'travel',
    description: 'Passionate about exploring diverse cultures, international cities, and historic wonders.',
    popularCount: 320,
    subInterests: ['Europe', 'Southeast Asia', 'Japan', 'Middle East', 'Australia', 'Americas'],
  },
  {
    id: 'int-wildlife',
    name: 'Wildlife & Safaris',
    emoji: '🌿',
    categoryId: 'travel',
    description: 'Visiting national parks, tiger reserves, rainforests, and wildlife sanctuaries.',
    popularCount: 115,
    subInterests: ['Jungle Safari', 'Birdwatching', 'Marine Wildlife', 'Conservation'],
  },
  {
    id: 'int-camping',
    name: 'Camping & Outdoors',
    emoji: '⛺',
    categoryId: 'travel',
    description: 'Tent camping under the stars, bonfire conversations, and minimal living.',
    popularCount: 160,
    subInterests: ['Mountain Camping', 'Forest Camping', 'Beach Camping', 'Glamping'],
  },
  {
    id: 'int-road-trips',
    name: 'Road Trips',
    emoji: '🚗',
    categoryId: 'travel',
    description: 'Scenic highway drives, impromptu viewpoint stops, and road trip playlists.',
    popularCount: 245,
    subInterests: ['Ghat Roads', 'Coastal Highway', 'Off-roading', 'Monsoon Drives'],
  },

  // Lifestyle & Fitness
  {
    id: 'int-fitness',
    name: 'Gym & Strength',
    emoji: '🏋',
    categoryId: 'fitness',
    description: 'Regular weight training, body conditioning, and progressive overload.',
    popularCount: 290,
    subInterests: ['Strength Training', 'CrossFit', 'Home Workouts', 'Calisthenics'],
  },
  {
    id: 'int-yoga',
    name: 'Yoga & Mindfulness',
    emoji: '🧘',
    categoryId: 'fitness',
    description: 'Daily asanas, breathwork, and holistic physical & mental balance.',
    popularCount: 180,
    subInterests: ['Hatha Yoga', 'Pranayama', 'Sound Meditation', 'Morning Routines'],
  },
  {
    id: 'int-photography',
    name: 'Photography',
    emoji: '📷',
    categoryId: 'lifestyle',
    description: 'Capturing light, landscapes, street moments, and travel portraits.',
    popularCount: 195,
    subInterests: ['Travel Photography', 'Street Portraiture', 'Astrophotography', 'Film & Analog'],
  },
  {
    id: 'int-sustainable',
    name: 'Sustainable Living',
    emoji: '🌱',
    categoryId: 'lifestyle',
    description: 'Zero-waste habits, conscious consumption, organic farming, and eco-friendly spaces.',
    popularCount: 130,
    subInterests: ['Permaculture', 'Minimalism', 'Solar & Green Architecture', 'Thrifting'],
  },
];

// -------------------------------------------------------------
// 3. User's Personal Active Margams
// -------------------------------------------------------------

let userMargamsStore: UserMargamSelection[] = [
  {
    interestId: 'int-cafe',
    interestName: 'Café Business',
    emoji: '☕',
    intent: 'want_to_build',
    priority: 'core',
    customGoalText: 'Dream of creating a tranquil destination café with specialty coffee and reading corners.',
    visibility: 'public',
  },
  {
    interestId: 'int-international-travel',
    interestName: 'International Travel',
    emoji: '✈',
    intent: 'want_partner_who_likes',
    priority: 'core',
    customGoalText: 'Planning annual travel trips to Japan, Europe, and Southeast Asia.',
    visibility: 'public',
  },
  {
    interestId: 'int-fitness',
    interestName: 'Gym & Fitness',
    emoji: '🏋',
    intent: 'regularly_do',
    priority: 'core',
    customGoalText: 'Morning workouts are a staple part of my mental clarity and energy.',
    visibility: 'public',
  },
  {
    interestId: 'int-photography',
    interestName: 'Photography',
    emoji: '📷',
    intent: 'love_this',
    priority: 'important',
    customGoalText: 'Enjoys capturing street moments and landscapes across Kerala.',
    visibility: 'public',
  },
  {
    interestId: 'int-camping',
    interestName: 'Camping',
    emoji: '⛺',
    intent: 'want_to_try',
    priority: 'future_goal',
    customGoalText: 'Excited to try forest camping in Wayanad or Munnar with my partner.',
    visibility: 'request_only',
  },
];

export function getUserMargams(): UserMargamSelection[] {
  return [...userMargamsStore];
}

export function saveUserMargams(margams: UserMargamSelection[]): void {
  userMargamsStore = margams;
}

// -------------------------------------------------------------
// 4. Margam Candidates (Interactive Swipe Cards)
// -------------------------------------------------------------

export const MARGAM_CANDIDATES: MargamProfileCandidate[] = [
  {
    id: 'margam-cand-1',
    name: 'Ananya',
    age: 27,
    isVerified: true,
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80',
    photoCount: 6,
    profession: 'Marketing Professional',
    city: 'Kochi',
    area: 'Kochi area',
    bio: 'Dreaming of building a cozy café and exploring new places.',
    compatibilityPercentage: 92,
    interestAlignmentPercentage: 95,
    sharedMargams: [
      { name: 'Café Business', emoji: '☕', tagColor: '#FFF7ED', textColor: '#EA580C' },
      { name: 'Travel', emoji: '✈', tagColor: '#EFF6FF', textColor: '#2563EB' },
      { name: 'Photography', emoji: '📷', tagColor: '#FAF5FF', textColor: '#9333EA' },
    ],
    lookingToBuild: 'Build a café',
    openToRelocate: 'Within India / Abroad',
    marriageTimeline: 'Within 1 year',
    whyThisMatchExplanation: 'You both want to build a café and enjoy travel.',
  },
  {
    id: 'margam-cand-2',
    name: 'Rohan',
    age: 29,
    isVerified: true,
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&auto=format&fit=crop&q=80',
    photoCount: 5,
    profession: 'Software Architect',
    city: 'Thrissur',
    area: 'Thrissur central',
    bio: 'Passionate about international wildlife photography, monsoon road trips, and building mindful family routines.',
    compatibilityPercentage: 88,
    interestAlignmentPercentage: 91,
    sharedMargams: [
      { name: 'International Travel', emoji: '✈', tagColor: '#EFF6FF', textColor: '#2563EB' },
      { name: 'Wildlife', emoji: '🌿', tagColor: '#DCFCE7', textColor: '#16A34A' },
      { name: 'Road Trips', emoji: '🚗', tagColor: '#FEF3C7', textColor: '#B45309' },
    ],
    lookingToBuild: 'Annual wildlife expeditions & creative photo documentary',
    openToRelocate: 'Open to Kochi or Bangalore',
    marriageTimeline: 'Within 1 year',
    whyThisMatchExplanation: 'Strong travel synergy: shared wildlife passion, adventurous outlook, and aligned timeline.',
  },
  {
    id: 'margam-cand-3',
    name: 'Meera',
    age: 26,
    isVerified: true,
    photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80',
    photoCount: 4,
    profession: 'Architect & Designer',
    city: 'Kochi',
    area: 'Panampilly Nagar',
    bio: 'Advocate of sustainable living, minimalist home design, morning yoga, and weekend artisan bakery visits.',
    compatibilityPercentage: 89,
    interestAlignmentPercentage: 93,
    sharedMargams: [
      { name: 'Lifestyle & Yoga', emoji: '🧘', tagColor: '#F3E8FF', textColor: '#9333EA' },
      { name: 'Café & Bakery', emoji: '☕', tagColor: '#FFEDD5', textColor: '#C2410C' },
      { name: 'Sustainable Living', emoji: '🌱', tagColor: '#DCFCE7', textColor: '#16A34A' },
    ],
    lookingToBuild: 'A mindful, clutter-free home and sustainable lifestyle',
    openToRelocate: 'Flexible across Kerala',
    marriageTimeline: 'Within 1-2 years',
    whyThisMatchExplanation: 'High lifestyle synergy: morning wellness habits, design aesthetics, and mutual vegetarian diet.',
  },
  {
    id: 'margam-cand-4',
    name: 'Siddharth',
    age: 30,
    isVerified: true,
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&auto=format&fit=crop&q=80',
    photoCount: 5,
    profession: 'Fintech Product Lead',
    city: 'Bangalore',
    area: 'Indiranagar (Kochi roots)',
    bio: 'Looking to build a specialty coffee roastery alongside investing in ethical startups. Keen runner and avid reader.',
    compatibilityPercentage: 86,
    interestAlignmentPercentage: 89,
    sharedMargams: [
      { name: 'Café Business', emoji: '☕', tagColor: '#FFEDD5', textColor: '#C2410C' },
      { name: 'Fitness & Running', emoji: '🏃', tagColor: '#F3E8FF', textColor: '#9333EA' },
      { name: 'Reading', emoji: '📚', tagColor: '#EFF6FF', textColor: '#2563EB' },
    ],
    lookingToBuild: 'A specialty coffee roastery and strong joint ventures',
    openToRelocate: 'Willing to relocate to Kochi',
    marriageTimeline: 'Within 1 year',
    whyThisMatchExplanation: 'Strong business ambition overlap with mutual long-term financial and family goals.',
  },
  {
    id: 'margam-cand-5',
    name: 'Divya',
    age: 28,
    isVerified: true,
    photoUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&auto=format&fit=crop&q=80',
    photoCount: 6,
    profession: 'Environmental Specialist',
    city: 'Kozhikode',
    area: 'Kozhikode beach',
    bio: 'Passionate about marine conservation, high-altitude trekking, farm-to-table food, and documentary films.',
    compatibilityPercentage: 87,
    interestAlignmentPercentage: 90,
    sharedMargams: [
      { name: 'Adventure & Trekking', emoji: '🏔', tagColor: '#CCFBF1', textColor: '#0D9488' },
      { name: 'Nature & Farming', emoji: '🌾', tagColor: '#DCFCE7', textColor: '#16A34A' },
      { name: 'Food Culture', emoji: '🍛', tagColor: '#FFEDD5', textColor: '#C2410C' },
    ],
    lookingToBuild: 'An eco-friendly home and yearly global trekking expeditions',
    openToRelocate: 'Open across South India',
    marriageTimeline: 'Within 1 year',
    whyThisMatchExplanation: 'Shared enthusiasm for outdoor exploration and harmonious environmental values.',
  },
];

export function getMargamCandidates(interestName?: string): MargamProfileCandidate[] {
  if (!interestName || interestName.toLowerCase().includes('all')) {
    return MARGAM_CANDIDATES;
  }
  const filtered = MARGAM_CANDIDATES.filter((c) =>
    c.sharedMargams.some((m) => m.name.toLowerCase().includes(interestName.toLowerCase()) || interestName.toLowerCase().includes(m.name.toLowerCase()))
  );
  return filtered.length > 0 ? filtered : MARGAM_CANDIDATES;
}

// -------------------------------------------------------------
// 5. Shared Collaborative Plans
// -------------------------------------------------------------

export const SAMPLE_SHARED_PLANS: MargamCollaborativePlan[] = [
  {
    id: 'plan-cafe-1',
    type: 'cafe',
    title: 'Artisan Destination Café',
    subtitle: 'Collaborative vision with Ananya',
    emoji: '☕',
    partnerName: 'Ananya',
    partnerPhotoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
    status: 'drafting',
    sections: [
      {
        title: 'Core Concept & Atmosphere',
        content: 'A sunlit, minimalist indoor-outdoor cafe surrounded by greenery, serving specialty Kerala pour-overs and artisanal sourdough.',
        userNote: 'Love the idea of an open courtyard with high ceilings.',
        partnerNote: 'I can curate the specialty coffee beans and local roasteries!',
      },
      {
        title: 'Target Location',
        content: 'Fort Kochi heritage district or hillside corridor near Munnar.',
        userNote: 'Fort Kochi gives steady international footfall year-round.',
      },
      {
        title: 'Interior Style & Reading Corner',
        content: 'Warm teak wood finishes, warm amber lamps, and curated bookshelves.',
      },
    ],
    aiSuggestions: [
      'Both of you highlighted cozy reading corners — consider including quiet acoustic zoning.',
      'Fort Kochi has high tourist seasons in Nov–Feb; a small curated merch corner enhances offseason revenue.',
    ],
    lastUpdatedAt: 'Today, 11:30 AM',
  },
  {
    id: 'plan-travel-1',
    type: 'travel',
    title: 'Northern Kerala & Coorg Wildlife Expedition',
    subtitle: 'Collaborative route with Rohan',
    emoji: '✈',
    partnerName: 'Rohan',
    partnerPhotoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop',
    status: 'drafting',
    sections: [
      {
        title: 'Route & Destinations',
        content: 'Kochi → Wayanad Wildlife Sanctuary → Nagarhole National Park → Coorg Coffee Estates.',
        partnerNote: 'Early morning safari in Nagarhole has high leopard sighting probability.',
      },
      {
        title: 'Stay Preferences',
        content: 'Eco-resorts and plantation bungalows with private verandas for sunrise photography.',
      },
    ],
    aiSuggestions: [
      'Both prefer landscape photography — the Golden Hour at Wayanad viewpoint coincides with early winter.',
    ],
    lastUpdatedAt: 'Yesterday',
  },
];

// -------------------------------------------------------------
// 6. Community Margam Ideas & Discussions
// -------------------------------------------------------------

export const SAMPLE_MARGAM_IDEAS: MargamIdeaPost[] = [
  {
    id: 'idea-1',
    authorId: 'usr-ananya',
    authorName: 'Ananya',
    authorZone: 'Kochi area',
    authorPhotoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
    margamId: 'int-cafe',
    margamName: 'Café Business',
    emoji: '☕',
    title: 'Destination Café with Library Corner in Fort Kochi',
    concept: 'I envision a café where travelers can slow down, read classic literature, and enjoy single-origin pour-overs roasted from Wayanad estates. Looking for someone who shares this passion for hospitality and design.',
    createdAt: '2 hours ago',
    likesCount: 24,
    isLiked: true,
    commentsCount: 7,
  },
  {
    id: 'idea-2',
    authorId: 'usr-rohan',
    authorName: 'Rohan',
    authorZone: 'Thrissur area',
    authorPhotoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop',
    margamId: 'int-wildlife',
    margamName: 'Wildlife & Safaris',
    emoji: '🌿',
    title: 'Rainforest Trek & Nocturnal Wildlife Photography',
    concept: 'Planning a silent night trail in Silent Valley to photograph endemic amphibians and nocturnal birds. Would love to connect with someone who shares genuine reverence for untouched wilderness.',
    createdAt: '5 hours ago',
    likesCount: 18,
    isLiked: false,
    commentsCount: 4,
  },
  {
    id: 'idea-3',
    authorId: 'usr-meera',
    authorName: 'Meera',
    authorZone: 'Panampilly Nagar',
    authorPhotoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop',
    margamId: 'int-sustainable',
    margamName: 'Sustainable Living',
    emoji: '🌱',
    title: 'Courtyard House with Rainwater Harvesting & Native Trees',
    concept: 'Designing a traditional Kerala Nalukettu-inspired home that generates its own solar energy and has a small vegetable garden. Believes true luxury in marriage is clean air, fresh produce, and silence.',
    createdAt: '1 day ago',
    likesCount: 36,
    isLiked: true,
    commentsCount: 12,
  },
];
