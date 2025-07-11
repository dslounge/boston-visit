/**
 * Directions API Integration Options
 * 
 * For getting actual routes and travel times between itinerary points, you can use:
 * 
 * 1. OpenRouteService (FREE)
 *    - Free tier: 40 requests/minute, 2,000 requests/day
 *    - Supports: walking, cycling, driving
 *    - API: https://openrouteservice.org/
 *    - No API key required for limited use
 * 
 * 2. Mapbox Directions API
 *    - Free tier: 100,000 requests/month
 *    - Supports: walking, cycling, driving, driving-traffic
 *    - Requires API key
 *    - Better for production apps
 * 
 * 3. Geoapify Routing API (FREE)
 *    - Free tier: 3,000 credits/day
 *    - Supports: walking, cycling, driving, PUBLIC TRANSIT
 *    - Best option if you need transit directions
 *    - API: https://www.geoapify.com/routing-api/
 * 
 * 4. Google Maps Directions API
 *    - Free tier: $200 credit/month
 *    - Best transit support
 *    - Requires API key and billing account
 */

import type { ItineraryItem } from '../types/itinerary';

interface RouteSegment {
  distance: number; // meters
  duration: number; // seconds
  polyline: [number, number][];
}

// Example implementation using OpenRouteService (no API key needed for basic use)
export async function getWalkingRoute(
  start: { lat: number; lng: number },
  end: { lat: number; lng: number }
): Promise<RouteSegment | null> {
  try {
    // Note: You'll need to sign up for a free API key at https://openrouteservice.org/sign-up
    // For demo purposes, we're returning mock data
    console.log('To get real directions, sign up for a free API key at https://openrouteservice.org/sign-up');
    
    // Mock response for demo
    return {
      distance: 1000,
      duration: 900,
      polyline: [[start.lat, start.lng], [end.lat, end.lng]]
    };
  } catch (error) {
    console.error('Error fetching route:', error);
    return null;
  }
}

// Example for Geoapify (best for transit)
export async function getTransitRoute(
  start: { lat: number; lng: number },
  end: { lat: number; lng: number }
): Promise<RouteSegment | null> {
  try {
    // Note: Sign up for free at https://www.geoapify.com/
    console.log('To get real transit directions, sign up for a free API key at https://www.geoapify.com/');
    
    // Mock response for demo
    return {
      distance: 2000,
      duration: 600,
      polyline: [[start.lat, start.lng], [end.lat, end.lng]]
    };
  } catch (error) {
    console.error('Error fetching transit route:', error);
    return null;
  }
}

// Helper to calculate estimated times between all itinerary items
export async function calculateItineraryTimes(items: ItineraryItem[]) {
  const segments: RouteSegment[] = [];
  
  for (let i = 0; i < items.length - 1; i++) {
    const start = items[i].location;
    const end = items[i + 1].location;
    const isTransit = items[i + 1].transport === 'train';
    
    const route = isTransit 
      ? await getTransitRoute(start, end)
      : await getWalkingRoute(start, end);
      
    if (route) {
      segments.push(route);
    }
  }
  
  return segments;
}