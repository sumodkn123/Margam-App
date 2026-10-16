export interface RouteCoordinate {
  latitude: number;
  longitude: number;
}

export interface CalculatedRoute {
  id: string;
  origin: RouteCoordinate;
  destination: RouteCoordinate;
  waypoints: RouteCoordinate[];
  distanceKm: number;
  durationMinutes: number;
  durationLabel: string;
  distanceLabel: string;
}

/**
 * Calculates Haversine distance between two coordinates in kilometers.
 */
export function haversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Calculates perpendicular distance from a point to a line segment in kilometers.
 */
function distanceToSegmentKm(
  pLat: number,
  pLng: number,
  aLat: number,
  aLng: number,
  bLat: number,
  bLng: number
): number {
  const dAB = haversineDistanceKm(aLat, aLng, bLat, bLng);
  if (dAB === 0) return haversineDistanceKm(pLat, pLng, aLat, aLng);

  // Approximate flat-earth projection for short distances
  const cosLat = Math.cos(((aLat + bLat + pLat) / 3 / 180) * Math.PI);
  const px = (pLng - aLng) * cosLat;
  const py = pLat - aLat;
  const bx = (bLng - aLng) * cosLat;
  const by = bLat - aLat;

  const dot = px * bx + py * by;
  const lenSq = bx * bx + by * by;
  let param = -1;
  if (lenSq !== 0) param = dot / lenSq;

  let nearestLat: number;
  let nearestLng: number;

  if (param < 0) {
    nearestLat = aLat;
    nearestLng = aLng;
  } else if (param > 1) {
    nearestLat = bLat;
    nearestLng = bLng;
  } else {
    nearestLat = aLat + param * (bLat - aLat);
    nearestLng = aLng + param * (bLng - aLng);
  }

  return haversineDistanceKm(pLat, pLng, nearestLat, nearestLng);
}

/**
 * Determines whether a candidate coordinate lies within a specified corridor (buffer) of a route.
 */
export function isPointWithinRouteCorridor(
  pointLat: number,
  pointLng: number,
  waypoints: RouteCoordinate[],
  corridorKm: number = 10
): { isWithin: boolean; minDistanceKm: number; estimatedDetourMins: number } {
  if (waypoints.length === 0) {
    return { isWithin: false, minDistanceKm: Infinity, estimatedDetourMins: 0 };
  }

  let minDistance = Infinity;

  // Check against downsampled waypoints for high performance
  const step = waypoints.length > 80 ? Math.ceil(waypoints.length / 50) : 1;
  for (let i = 0; i < waypoints.length - 1; i += step) {
    const nextIdx = Math.min(i + step, waypoints.length - 1);
    const d = distanceToSegmentKm(
      pointLat,
      pointLng,
      waypoints[i].latitude,
      waypoints[i].longitude,
      waypoints[nextIdx].latitude,
      waypoints[nextIdx].longitude
    );
    if (d < minDistance) {
      minDistance = d;
    }
  }

  // Approx 1.5 minutes per km of detour in Kerala traffic (round trip + parking)
  const detourMins = Math.round(minDistance * 2.2);

  return {
    isWithin: minDistance <= corridorKm,
    minDistanceKm: Math.round(minDistance * 10) / 10,
    estimatedDetourMins: detourMins,
  };
}

/**
 * Fetches real driving route from the OSRM Driving Engine.
 * With fallback to intermediate road nodes if offline.
 */
export async function calculateDrivingRoute(
  origin: RouteCoordinate,
  destination: RouteCoordinate
): Promise<CalculatedRoute> {
  const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${origin.longitude},${origin.latitude};${destination.longitude},${destination.latitude}?overview=full&geometries=geojson`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(osrmUrl, { signal: controller.signal });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        const coordinates: [number, number][] = route.geometry.coordinates; // [lng, lat]
        const waypoints: RouteCoordinate[] = coordinates.map(([lng, lat]) => ({
          latitude: lat,
          longitude: lng,
        }));

        const distKm = Math.round((route.distance / 1000) * 10) / 10;
        const durMins = Math.round(route.duration / 60);

        let durLabel = `${durMins} mins`;
        if (durMins >= 60) {
          const hrs = Math.floor(durMins / 60);
          const rem = durMins % 60;
          durLabel = rem > 0 ? `${hrs}h ${rem}m` : `${hrs}h`;
        }

        return {
          id: `osrm-${Date.now()}`,
          origin,
          destination,
          waypoints,
          distanceKm: distKm,
          durationMinutes: durMins,
          durationLabel: durLabel,
          distanceLabel: `${distKm} km`,
        };
      }
    }
  } catch (err) {
    console.warn('[RoutingService] OSRM routing request failed, computing interpolated highway path:', err);
  }

  // Fallback: Generate an interpolated 10-point path between origin and destination
  const straightDist = haversineDistanceKm(
    origin.latitude,
    origin.longitude,
    destination.latitude,
    destination.longitude
  );
  const roadDist = Math.round(straightDist * 1.25 * 10) / 10; // Roads have ~25% curve overhead
  const durMins = Math.round((roadDist / 42) * 60); // Average speed ~42 km/h

  const interpolatedWaypoints: RouteCoordinate[] = [];
  const segments = 12;
  for (let i = 0; i <= segments; i++) {
    const ratio = i / segments;
    // Slight curve to simulate real highway
    const curveOffset = Math.sin(ratio * Math.PI) * 0.015;
    interpolatedWaypoints.push({
      latitude: origin.latitude + (destination.latitude - origin.latitude) * ratio + curveOffset,
      longitude: origin.longitude + (destination.longitude - origin.longitude) * ratio,
    });
  }

  return {
    id: `interp-${Date.now()}`,
    origin,
    destination,
    waypoints: interpolatedWaypoints,
    distanceKm: roadDist,
    durationMinutes: durMins,
    durationLabel: durMins >= 60 ? `${Math.floor(durMins / 60)}h ${durMins % 60}m` : `${durMins} mins`,
    distanceLabel: `${roadDist} km`,
  };
}
