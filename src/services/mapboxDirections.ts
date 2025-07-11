import type { ItineraryItem } from '../types/itinerary';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

export interface RouteInfo {
  distance: number; // meters
  duration: number; // seconds
  geometry: {
    coordinates: [number, number][];
  };
}

export async function getMapboxRoute(
  start: { lat: number; lng: number },
  end: { lat: number; lng: number },
  profile: 'walking' | 'driving' | 'cycling' = 'walking'
): Promise<RouteInfo | null> {
  try {
    const url = `https://api.mapbox.com/directions/v5/mapbox/${profile}/${start.lng},${start.lat};${end.lng},${end.lat}?geometries=geojson&access_token=${MAPBOX_TOKEN}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.routes && data.routes.length > 0) {
      const route = data.routes[0];
      return {
        distance: route.distance,
        duration: route.duration,
        geometry: route.geometry
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching Mapbox route:', error);
    return null;
  }
}

export function formatDuration(seconds: number): string {
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}min` : `${hours}h`;
}

export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }
  return `${(meters / 1000).toFixed(1)} km`;
}

// Get all routes between itinerary items
export async function getAllRoutes(items: ItineraryItem[]): Promise<RouteInfo[]> {
  const routes: RouteInfo[] = [];
  
  for (let i = 0; i < items.length - 1; i++) {
    const start = items[i].location;
    const end = items[i + 1].location;
    const isTransit = items[i + 1].transport === 'train';
    
    // Use cycling as a proxy for transit (faster than walking)
    // since Mapbox doesn't have transit in the free tier
    const profile = isTransit ? 'cycling' : 'walking';
    const route = await getMapboxRoute(start, end, profile);
    
    if (route && isTransit) {
      // Adjust cycling time to be more realistic for transit
      // Transit is usually 1.5x cycling time in urban areas
      route.duration = Math.round(route.duration * 1.5);
    }
    
    if (route) {
      routes.push(route);
    }
  }
  
  return routes;
}