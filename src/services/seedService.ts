import { UserProfile, ProfileFieldPerms } from '../types';

export const DEFAULT_FIELD_PERMS: ProfileFieldPerms = {
  firstName: 'public',
  fullName: 'request_only',
  age: 'public',
  gender: 'public',
  profilePhoto: 'request_only',
  additionalPhotos: 'accepted_only',
  shortIntro: 'public',
  fullBio: 'request_only',
  education: 'public',
  institution: 'request_only',
  profession: 'public',
  company: 'request_only',
  workplaceLocation: 'public',
  city: 'public',
  area: 'public',
  exactLocation: 'private',
  lifestylePreferences: 'public',
  detailedLifestyle: 'request_only',
  familyOverview: 'request_only',
  detailedFamily: 'accepted_only',
  phoneNumber: 'accepted_only',
  email: 'accepted_only',
};

// Realistic geographic hubs across Kerala with tight coordinate dispersion
interface GeoClusterDef {
  city: string;
  area: string;
  lat: number;
  lng: number;
  spread: number; // lat/lng jitter spread
}

const CLUSTERS: GeoClusterDef[] = [
  // Kochi Metro Area
  { city: 'Kochi', area: 'Kakkanad (Infopark)', lat: 10.0159, lng: 76.3419, spread: 0.015 },
  { city: 'Kochi', area: 'Edappally', lat: 10.0245, lng: 76.3079, spread: 0.012 },
  { city: 'Kochi', area: 'Panampilly Nagar', lat: 9.9658, lng: 76.2976, spread: 0.010 },
  { city: 'Kochi', area: 'Vyttila Hub', lat: 9.9678, lng: 76.3214, spread: 0.012 },
  { city: 'Kochi', area: 'Aluva', lat: 10.1076, lng: 76.3516, spread: 0.015 },
  { city: 'Kochi', area: 'Tripunithura', lat: 9.9482, lng: 76.3475, spread: 0.012 },
  { city: 'Kochi', area: 'Fort Kochi', lat: 9.9658, lng: 76.2421, spread: 0.010 },
  { city: 'Kochi', area: 'Kalamassery', lat: 10.0469, lng: 76.3204, spread: 0.014 },
  
  // Thrissur Area (Along NH 544 route)
  { city: 'Thrissur', area: 'Swaraj Round', lat: 10.5276, lng: 76.2144, spread: 0.015 },
  { city: 'Thrissur', area: 'Chalakudy', lat: 10.3070, lng: 76.3335, spread: 0.018 },
  { city: 'Thrissur', area: 'Ollur', lat: 10.4728, lng: 76.2403, spread: 0.012 },
  { city: 'Thrissur', area: 'Guruvayur', lat: 10.5946, lng: 76.0407, spread: 0.015 },
  { city: 'Thrissur', area: 'Kodungallur', lat: 10.2312, lng: 76.1953, spread: 0.014 },

  // Kottayam & Central Travancore
  { city: 'Kottayam', area: 'Kanjikuzhy', lat: 9.5872, lng: 76.5412, spread: 0.015 },
  { city: 'Kottayam', area: 'Pala', lat: 9.7118, lng: 76.6841, spread: 0.016 },

  // Thiruvananthapuram
  { city: 'Thiruvananthapuram', area: 'Kazhakoottam (Technopark)', lat: 8.5581, lng: 76.8812, spread: 0.018 },
  { city: 'Thiruvananthapuram', area: 'Kowdiar', lat: 8.5283, lng: 76.9602, spread: 0.012 },

  // Kozhikode
  { city: 'Kozhikode', area: 'Cyberpark / Palazhi', lat: 11.2393, lng: 75.8344, spread: 0.015 },
  { city: 'Kozhikode', area: 'Beach Road', lat: 11.2612, lng: 75.7705, spread: 0.012 },

  // Palakkad
  { city: 'Palakkad', area: 'Town Center', lat: 10.7867, lng: 76.6548, spread: 0.018 },
];

const FIRST_NAMES_FEMALE = [
  'Ananya', 'Divya', 'Lakshmi', 'Parvathy', 'Sneha', 'Meera', 'Arya', 'Gopika',
  'Aparna', 'Nandana', 'Keerthi', 'Reshma', 'Kavya', 'Deepa', 'Malavika', 'Anjana',
  'Devika', 'Haritha', 'Sandra', 'Swathy', 'Rithika', 'Bhavana', 'Pooja', 'Shruthi',
];

const FIRST_NAMES_MALE = [
  'Arun', 'Vishnu', 'Rahul', 'Naveen', 'Adarsh', 'Siddharth', 'Gokul', 'Ashwin',
  'Vivek', 'Rohan', 'Pranav', 'Hari', 'Manoj', 'Deepak', 'Anoop', 'Sreerag',
  'Akash', 'Kiran', 'Abhijith', 'Sanjay', 'Suraj', 'Vipin', 'Akhil', 'Sujith',
];

const LAST_NAMES = [
  'Nair', 'Menon', 'Kurup', 'Pillai', 'Warrier', 'Nambiar', 'Varma', 'Panicker',
  'Marar', 'Prabhu', 'Bhatt', 'Shenoy', 'Kaimal', 'Nedungadi', 'Unnithan',
];

const PROFESSIONS = [
  { title: 'Senior Software Engineer', category: 'Tech', company: 'UST Global', edu: 'B.Tech Computer Science' },
  { title: 'Product Designer (UI/UX)', category: 'Design', company: 'FinTech Startup', edu: 'M.Des Industrial Design' },
  { title: 'Resident Physician (Internal Med)', category: 'Healthcare', company: 'Aster Medcity', edu: 'MBBS, MD' },
  { title: 'Chartered Accountant', category: 'Finance', company: 'Deloitte India', edu: 'CA, B.Com' },
  { title: 'Assistant Professor', category: 'Education', company: 'CUSAT University', edu: 'M.Sc, Ph.D' },
  { title: 'Architectural Consultant', category: 'Architecture', company: 'Studio Kochi', edu: 'B.Arch' },
  { title: 'Civil Engineer (Infrastructure)', category: 'Engineering', company: 'Kochi Metro Rail Ltd', edu: 'M.Tech Structural' },
  { title: 'Data Scientist', category: 'Tech', company: 'IBS Software', edu: 'MS Data Analytics' },
  { title: 'Marketing Lead', category: 'Marketing', company: 'E-commerce Brand', edu: 'MBA Marketing' },
  { title: 'Dental Surgeon', category: 'Healthcare', company: 'Private Clinic', edu: 'BDS' },
];

const TIMELINES = [
  'Within 6 months',
  'Within 1 year',
  '1 to 2 years',
  'Flexible timeline',
];

const LIFESTYLE_TRAITS = [
  ['Vegetarian', 'Non-Smoker', 'Fitness Enthusiast', 'Early Riser'],
  ['Non-Vegetarian', 'Social Drinker', 'Classical Music Lover', 'Reader'],
  ['Vegetarian', 'Yoga Practitioner', 'Travel Lover', 'Minimalist'],
  ['Eggetarian', 'Non-Smoker', 'Weekend Hiker', 'Pet Lover'],
  ['Non-Vegetarian', 'Teetotaler', 'Badminton Player', 'Art Lover'],
];

/**
 * Deterministic PRNG seeded random for repeatable profile generation
 */
function seededRandom(seed: number): () => number {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/**
 * Generates an array of realistic candidate profiles across Kerala.
 * All profiles conform strictly to the UserProfile contract.
 */
export function generateSeedProfiles(count: number = 75, baseSeed: number = 42): UserProfile[] {
  const rand = seededRandom(baseSeed);
  const profiles: UserProfile[] = [];

  for (let i = 0; i < count; i++) {
    const isFemale = i % 2 === 0; // balanced gender distribution
    const firstNames = isFemale ? FIRST_NAMES_FEMALE : FIRST_NAMES_MALE;
    const firstName = firstNames[Math.floor(rand() * firstNames.length)];
    const lastName = LAST_NAMES[Math.floor(rand() * LAST_NAMES.length)];
    const fullName = `${firstName} ${lastName}`;
    const age = 24 + Math.floor(rand() * 11); // Ages 24 - 34

    // Pick cluster
    const cluster = CLUSTERS[Math.floor(rand() * CLUSTERS.length)];
    // Add jitter within cluster spread
    const latJitter = (rand() - 0.5) * 2 * cluster.spread;
    const lngJitter = (rand() - 0.5) * 2 * cluster.spread;
    const actualLat = cluster.lat + latJitter;
    const actualLng = cluster.lng + lngJitter;

    const prof = PROFESSIONS[Math.floor(rand() * PROFESSIONS.length)];
    const timeline = TIMELINES[Math.floor(rand() * TIMELINES.length)];
    const traits = LIFESTYLE_TRAITS[Math.floor(rand() * LIFESTYLE_TRAITS.length)];

    profiles.push({
      id: `seed-usr-${1000 + i}`,
      firstName,
      fullName,
      age,
      gender: isFemale ? 'Female' : 'Male',
      profilePhotoUrl: `https://images.unsplash.com/photo-${1534528741775 + (i * 13)}?w=300&h=300&fit=crop&crop=faces`,
      additionalPhotoUrls: [],
      shortIntro: `${prof.title} based in ${cluster.area}, ${cluster.city}. Seeking a kind, progressive partner who values mutual growth.`,
      fullBio: `Born and raised in ${cluster.city}. Completed ${prof.edu}. Currently working as ${prof.title} at ${prof.company}. Enjoys weekend road trips, reading, and spending time with family.`,
      education: prof.edu,
      institution: 'Premier Institute',
      profession: prof.title,
      company: prof.company,
      workplaceLocation: `${cluster.area}, ${cluster.city}`,
      city: cluster.city,
      area: cluster.area,
      actualLat,
      actualLng,
      lifestylePreferences: traits,
      detailedLifestyle: `Pragmatic, values health and family time. ${traits.join(', ')}.`,
      familyOverview: 'Close-knit nuclear family residing in Kerala.',
      detailedFamily: 'Father retired government official, Mother teacher, one younger sibling.',
      phoneNumber: `+91 9847${Math.floor(100000 + rand() * 899999)}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@margam.app`,
      marriageTimeline: timeline,
      interests: traits,
      fieldPerms: { ...DEFAULT_FIELD_PERMS },
    });
  }

  return profiles;
}
