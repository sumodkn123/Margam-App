import { PlaceSearchResult } from '../types';

// Preset popular Kerala and regional destinations for instant search suggestions before typing
export const POPULAR_DESTINATIONS: PlaceSearchResult[] = [
  {
    id: 'preset-kochi',
    name: 'Kochi',
    subtext: 'Ernakulam, Kerala',
    latitude: 9.9312,
    longitude: 76.2673,
    category: 'city',
  },
  {
    id: 'preset-kakkanad',
    name: 'Kakkanad (Infopark)',
    subtext: 'IT Hub, Kochi, Kerala',
    latitude: 10.0159,
    longitude: 76.3419,
    category: 'area',
  },
  {
    id: 'preset-fortkochi',
    name: 'Fort Kochi',
    subtext: 'Heritage Zone & Cafes, Kochi, Kerala',
    latitude: 9.9658,
    longitude: 76.2421,
    category: 'landmark',
  },
  {
    id: 'preset-lulumall',
    name: 'Lulu Mall (Edappally)',
    subtext: 'Edappally, Kochi, Kerala',
    latitude: 10.0284,
    longitude: 76.3081,
    category: 'mall',
  },
  {
    id: 'preset-marinedrive',
    name: 'Marine Drive Walkway',
    subtext: 'Kochi Waterfront Promenade, Kerala',
    latitude: 9.9788,
    longitude: 76.2758,
    category: 'landmark',
  },
  {
    id: 'preset-aluva',
    name: 'Aluva',
    subtext: 'Periyar Riverside & Metro, Kochi, Kerala',
    latitude: 10.1076,
    longitude: 76.3516,
    category: 'city',
  },
  {
    id: 'preset-angamaly',
    name: 'Angamaly',
    subtext: 'Cochin Airport Hub, Ernakulam, Kerala',
    latitude: 10.196,
    longitude: 76.386,
    category: 'city',
  },
  {
    id: 'preset-vyttila',
    name: 'Vyttila Mobility Hub',
    subtext: 'Central Kochi Transit Hub, Kerala',
    latitude: 9.9667,
    longitude: 76.3197,
    category: 'area',
  },
  {
    id: 'preset-panampilly',
    name: 'Panampilly Nagar',
    subtext: 'Boutique Lifestyle & Cafes, Kochi, Kerala',
    latitude: 9.9625,
    longitude: 76.2995,
    category: 'area',
  },
  {
    id: 'preset-thrissur',
    name: 'Thrissur',
    subtext: 'Cultural Capital of Kerala',
    latitude: 10.5276,
    longitude: 76.2144,
    category: 'city',
  },
  {
    id: 'preset-trivandrum',
    name: 'Thiruvananthapuram (Trivandrum)',
    subtext: 'Technopark & Capital City, Kerala',
    latitude: 8.5241,
    longitude: 76.9366,
    category: 'city',
  },
  {
    id: 'preset-kozhikode',
    name: 'Kozhikode (Calicut)',
    subtext: 'Malabar Coast & Food Capital, Kerala',
    latitude: 11.2588,
    longitude: 75.7804,
    category: 'city',
  },
  {
    id: 'preset-kottayam',
    name: 'Kottayam',
    subtext: 'City of Letters & Lakes, Kerala',
    latitude: 9.5916,
    longitude: 76.5222,
    category: 'city',
  },
  {
    id: 'preset-palakkad',
    name: 'Palakkad',
    subtext: 'Gateway to Kerala & Heritage Granary',
    latitude: 10.7867,
    longitude: 76.6548,
    category: 'city',
  },
  {
    id: 'preset-kollam',
    name: 'Kollam (Quilon)',
    subtext: 'Ashtamudi Lake & Coastal Port, Kerala',
    latitude: 8.8932,
    longitude: 76.6141,
    category: 'city',
  },
  {
    id: 'preset-alappuzha',
    name: 'Alappuzha (Alleppey)',
    subtext: 'Venice of the East & Backwaters, Kerala',
    latitude: 9.4981,
    longitude: 76.3388,
    category: 'city',
  },
  {
    id: 'preset-kannur',
    name: 'Kannur',
    subtext: 'Crown of Malabar & Theyyam Land, Kerala',
    latitude: 11.8745,
    longitude: 75.3704,
    category: 'city',
  },
  {
    id: 'preset-malappuram',
    name: 'Malappuram',
    subtext: 'Cultural Heartland of Malabar, Kerala',
    latitude: 11.0734,
    longitude: 76.074,
    category: 'city',
  },
  {
    id: 'preset-wayanad',
    name: 'Wayanad (Kalpetta)',
    subtext: 'Misty Hill Station & Coffee Plantations, Kerala',
    latitude: 11.605,
    longitude: 76.083,
    category: 'city',
  },
  {
    id: 'preset-munnar',
    name: 'Munnar (Idukki)',
    subtext: 'Tea Highlands & Scenic Valleys, Kerala',
    latitude: 10.0889,
    longitude: 77.0595,
    category: 'landmark',
  },
  {
    id: 'preset-kasaragod',
    name: 'Kasaragod',
    subtext: 'Northern Coastal Forts & Rivers, Kerala',
    latitude: 12.5102,
    longitude: 74.9852,
    category: 'city',
  },
  {
    id: 'preset-pathanamthitta',
    name: 'Pathanamthitta',
    subtext: 'Pilgrim Hub & Sacred Groves, Kerala',
    latitude: 9.2648,
    longitude: 76.787,
    category: 'city',
  },
  {
    id: 'preset-bangalore',
    name: 'Bengaluru (Bangalore)',
    subtext: 'Silicon Valley of India, Karnataka',
    latitude: 12.9716,
    longitude: 77.5946,
    category: 'city',
  },
  {
    id: 'preset-chennai',
    name: 'Chennai',
    subtext: 'Coastal Metro & Cultural Hub, Tamil Nadu',
    latitude: 13.0827,
    longitude: 80.2707,
    category: 'city',
  },
  {
    id: 'preset-coimbatore',
    name: 'Coimbatore',
    subtext: 'Manchester of South India, Tamil Nadu',
    latitude: 11.0168,
    longitude: 76.9558,
    category: 'city',
  },
];

/**
 * Searches real places and coordinates using Photon OpenStreetMap API.
 * With fallback to Nominatim for robust global and local searching.
 */
export async function searchRealPlaces(
  query: string,
  userLocation?: { latitude: number; longitude: number }
): Promise<PlaceSearchResult[]> {
  const clean = query.trim();
  if (!clean || clean.length < 2) {
    return POPULAR_DESTINATIONS.slice(0, 5);
  }

  // First check if query matches preset destinations directly
  const localMatches = POPULAR_DESTINATIONS.filter(
    (p) =>
      p.name.toLowerCase().includes(clean.toLowerCase()) ||
      p.subtext.toLowerCase().includes(clean.toLowerCase())
  );

  try {
    // 1. Query Photon API (Free, high-speed, biased towards user's coordinates if available)
    const biasParam = userLocation
      ? `&lat=${userLocation.latitude}&lon=${userLocation.longitude}`
      : `&lat=9.9312&lon=76.2673`; // Default Kerala center
    const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(clean)}${biasParam}&limit=8`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && data.features && data.features.length > 0) {
        const remoteResults: PlaceSearchResult[] = data.features.map(
          (feat: any, idx: number) => {
            const props = feat.properties || {};
            const [lng, lat] = feat.geometry.coordinates;

            const name = props.name || props.street || clean;
            const subtext = [
              props.district,
              props.city,
              props.state,
              props.country,
            ]
              .filter(Boolean)
              .join(', ');

            let cat: PlaceSearchResult['category'] = 'area';
            if (props.osm_value === 'city' || props.osm_value === 'town') cat = 'city';
            else if (props.osm_value === 'mall' || props.osm_value === 'shop') cat = 'mall';
            else if (props.osm_value === 'cafe' || props.osm_value === 'restaurant') cat = 'cafe';
            else if (props.osm_value === 'station') cat = 'transit';
            else if (props.osm_key === 'tourism' || props.osm_key === 'historic') cat = 'landmark';

            return {
              id: `photon-${props.osm_id || idx}-${lat.toFixed(4)}`,
              name,
              subtext: subtext || 'Kerala, India',
              latitude: lat,
              longitude: lng,
              category: cat,
            };
          }
        );

        // Deduplicate against local matches
        const combined = [...localMatches];
        for (const item of remoteResults) {
          if (!combined.some((c) => Math.abs(c.latitude - item.latitude) < 0.005 && Math.abs(c.longitude - item.longitude) < 0.005)) {
            combined.push(item);
          }
        }
        return combined.slice(0, 8);
      }
    }
  } catch (err) {
    console.warn('[GeocodingService] Photon search failed, attempting Nominatim fallback:', err);
  }

  // 2. Fallback to OpenStreetMap Nominatim
  try {
    const nomUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      clean + ' Kerala India'
    )}&limit=5`;
    const nomRes = await fetch(nomUrl, {
      headers: {
        'User-Agent': 'Margam-Matrimony-iOS/1.0',
      },
    });

    if (nomRes.ok) {
      const nomData = await nomRes.json();
      if (Array.isArray(nomData) && nomData.length > 0) {
        const nomResults: PlaceSearchResult[] = nomData.map((item: any) => ({
          id: `nom-${item.place_id}`,
          name: item.name || item.display_name.split(',')[0],
          subtext: item.display_name.split(',').slice(1, 4).join(', ').trim(),
          latitude: parseFloat(item.lat),
          longitude: parseFloat(item.lon),
          category: 'area',
        }));
        return [...localMatches, ...nomResults].slice(0, 8);
      }
    }
  } catch (nomErr) {
    console.warn('[GeocodingService] Nominatim fallback failed:', nomErr);
  }

  return localMatches.length > 0 ? localMatches : POPULAR_DESTINATIONS.slice(0, 5);
}
