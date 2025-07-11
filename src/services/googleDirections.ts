import type { ItineraryItem } from '../types/itinerary';

export interface GoogleRouteInfo {
  distance: number; // meters
  duration: number; // seconds
  polyline: google.maps.LatLngLiteral[];
  mode: google.maps.TravelMode;
  transitDetails?: {
    departureTime?: string;
    arrivalTime?: string;
    line?: string;
    steps?: any[];
  };
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

export async function getGoogleRoute(
  directionsService: google.maps.DirectionsService,
  start: { lat: number; lng: number },
  end: { lat: number; lng: number },
  mode: google.maps.TravelMode = google.maps.TravelMode.WALKING
): Promise<GoogleRouteInfo | null> {
  try {
    const result = await directionsService.route({
      origin: start,
      destination: end,
      travelMode: mode,
      transitOptions: mode === google.maps.TravelMode.TRANSIT ? {
        departureTime: new Date(),
        modes: [
          google.maps.TransitMode.SUBWAY,
          google.maps.TransitMode.TRAIN,
          google.maps.TransitMode.BUS
        ],
        routingPreference: google.maps.TransitRoutePreference.FEWER_TRANSFERS
      } : undefined
    });

    if (result.routes && result.routes.length > 0) {
      const route = result.routes[0];
      const leg = route.legs[0];
      
      // Extract polyline points
      const polyline: google.maps.LatLngLiteral[] = [];
      leg.steps.forEach(step => {
        step.path.forEach(point => {
          polyline.push({ lat: point.lat(), lng: point.lng() });
        });
      });

      // Extract transit details if available
      let transitDetails;
      if (mode === google.maps.TravelMode.TRANSIT) {
        transitDetails = {
          departureTime: leg.departure_time?.text,
          arrivalTime: leg.arrival_time?.text,
          steps: leg.steps.filter(step => step.travel_mode === 'TRANSIT').map(step => ({
            line: step.transit?.line?.short_name || step.transit?.line?.name,
            headsign: step.transit?.headsign,
            numStops: step.transit?.num_stops
          }))
        };
      }

      return {
        distance: leg.distance?.value || 0,
        duration: leg.duration?.value || 0,
        polyline,
        mode,
        transitDetails
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching Google route:', error);
    return null;
  }
}

// Get all routes between itinerary items
export async function getAllGoogleRoutes(
  directionsService: google.maps.DirectionsService,
  items: ItineraryItem[]
): Promise<GoogleRouteInfo[]> {
  const routes: GoogleRouteInfo[] = [];
  
  for (let i = 0; i < items.length - 1; i++) {
    const start = items[i].location;
    const end = items[i + 1].location;
    const isTransit = items[i + 1].transport === 'train';
    
    const mode = isTransit 
      ? google.maps.TravelMode.TRANSIT 
      : google.maps.TravelMode.WALKING;
    
    const route = await getGoogleRoute(directionsService, start, end, mode);
    
    if (route) {
      routes.push(route);
    }
  }
  
  return routes;
}