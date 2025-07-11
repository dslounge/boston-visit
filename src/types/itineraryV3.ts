export type ItemType = 'place' | 'travel';
export type TransportType = 'walk' | 'train' | 'bus';

export interface Location {
  lat: number;
  lng: number;
  name: string;
}

export interface PlaceItem {
  id: string;
  type: 'place';
  title: string;
  location: Location;
  duration: number; // minutes to spend at this place
  startTime?: string; // optional fixed start time
  description?: string;
}

export interface TravelItem {
  id: string;
  type: 'travel';
  from: string;
  to: string;
  transport: TransportType;
  duration: number; // minutes for travel
  description?: string;
}

export type ItineraryItemV3 = PlaceItem | TravelItem;

// Helper function to calculate times
export function calculateSchedule(items: ItineraryItemV3[]): Array<{
  item: ItineraryItemV3;
  calculatedStartTime: string;
  isFixed: boolean;
}> {
  const schedule: Array<{
    item: ItineraryItemV3;
    calculatedStartTime: string;
    isFixed: boolean;
  }> = [];
  
  let currentTime = new Date('2024-01-01T08:00:00'); // Start at 8 AM
  
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    
    if (item.type === 'place' && item.startTime) {
      // Fixed time - parse it
      const [time, period] = item.startTime.split(' ');
      const [hours, minutes] = time.split(':').map(Number);
      const adjustedHours = period === 'PM' && hours !== 12 ? hours + 12 : hours;
      currentTime = new Date(`2024-01-01T${adjustedHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`);
      
      schedule.push({
        item,
        calculatedStartTime: item.startTime,
        isFixed: true
      });
    } else {
      // Calculate time
      const timeString = currentTime.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
      
      schedule.push({
        item,
        calculatedStartTime: timeString,
        isFixed: false
      });
    }
    
    // Add duration to current time
    if (item.type === 'place') {
      currentTime = new Date(currentTime.getTime() + item.duration * 60000);
    } else {
      currentTime = new Date(currentTime.getTime() + item.duration * 60000);
    }
  }
  
  return schedule;
}

export const itineraryDataV3: ItineraryItemV3[] = [
  {
    id: '1',
    type: 'place',
    title: 'Land at Boston Logan',
    location: { lat: 42.3656, lng: -71.0096, name: 'Boston Logan Airport' },
    duration: 30, // 30 minutes to get through airport
    startTime: '8:00 AM', // FIXED TIME
    description: 'Arrival at Boston Logan International Airport'
  },
  {
    id: '2',
    type: 'travel',
    from: 'Boston Logan Airport',
    to: 'Tatte Bakery',
    transport: 'bus',
    duration: 45, // 45 minutes bus ride
    description: 'Take Back Bay Logan Express bus'
  },
  {
    id: '3',
    type: 'place',
    title: 'Grab a coffee at Tatte',
    location: { lat: 42.3484, lng: -71.0866, name: 'Tatte Bakery - 160 Massachusetts Ave' },
    duration: 60, // 1 hour for breakfast
    description: 'Coffee at Tatte Bakery & Cafe'
  },
  {
    id: '4',
    type: 'travel',
    from: 'Tatte Bakery',
    to: '780 Boylston Street',
    transport: 'walk',
    duration: 15, // 15 minute walk
    description: 'Walk to meeting point'
  },
  {
    id: '5',
    type: 'place',
    title: 'Meet up',
    location: { lat: 42.3489, lng: -71.0796, name: '780 Boylston Street' },
    duration: 30, // 30 minutes
    description: 'Morning meetup at 780 Boylston St'
  },
  {
    id: '6',
    type: 'travel',
    from: '780 Boylston Street',
    to: 'Boston Public Garden',
    transport: 'walk',
    duration: 10, // 10 minute walk
    description: 'Short walk to the Public Garden'
  },
  {
    id: '7',
    type: 'place',
    title: 'Public Garden',
    location: { lat: 42.3541, lng: -71.0704, name: 'Boston Public Garden' },
    duration: 30, // 30 minutes in the garden
    description: 'Walk through the beautiful Boston Public Garden'
  },
  {
    id: '8',
    type: 'travel',
    from: 'Boston Public Garden',
    to: 'Faneuil Hall',
    transport: 'walk',
    duration: 20, // 20 minute walk
    description: 'Walk through downtown'
  },
  {
    id: '9',
    type: 'place',
    title: 'Faneuil Hall',
    location: { lat: 42.3600, lng: -71.0546, name: 'Faneuil Hall' },
    duration: 30, // 30 minutes
    description: 'Historic marketplace and meeting hall'
  },
  {
    id: '10',
    type: 'travel',
    from: 'Faneuil Hall',
    to: 'North End',
    transport: 'walk',
    duration: 10, // 10 minute walk
    description: 'Walk to Little Italy'
  },
  {
    id: '11',
    type: 'place',
    title: 'North End',
    location: { lat: 42.3647, lng: -71.0542, name: 'North End' },
    duration: 60, // 1 hour for lunch and exploration
    description: "Boston's Little Italy - grab lunch here"
  },
  {
    id: '12',
    type: 'travel',
    from: 'North End',
    to: 'Kendall/MIT Station',
    transport: 'train',
    duration: 20, // 20 minutes on T
    description: 'Take the T to Kendall/MIT'
  },
  {
    id: '13',
    type: 'place',
    title: 'Kendall/MIT',
    location: { lat: 42.3629, lng: -71.0901, name: 'Kendall/MIT Station' },
    duration: 5, // Quick stop
    description: 'Arrive at Kendall/MIT Station'
  },
  {
    id: '14',
    type: 'travel',
    from: 'Kendall/MIT Station',
    to: 'MIT Campus',
    transport: 'walk',
    duration: 10, // 10 minute walk
    description: 'Walk to MIT campus'
  },
  {
    id: '15',
    type: 'place',
    title: 'Walk around MIT',
    location: { lat: 42.3601, lng: -71.0942, name: 'MIT Campus' },
    duration: 120, // 2 hours
    description: 'Explore MIT campus'
  },
  {
    id: '16',
    type: 'travel',
    from: 'MIT Campus',
    to: 'Harvard Square',
    transport: 'train',
    duration: 15, // 15 minutes on Red Line
    description: 'Take the Red Line to Harvard'
  },
  {
    id: '17',
    type: 'place',
    title: 'Harvard',
    location: { lat: 42.3732, lng: -71.1190, name: 'Harvard Square' },
    duration: 60, // 1 hour
    description: 'Explore Harvard Square'
  },
  {
    id: '18',
    type: 'travel',
    from: 'Harvard Square',
    to: 'Prudential Station',
    transport: 'train',
    duration: 25, // 25 minutes with transfer
    description: 'Take the Red Line to Park St, then Green Line E to Prudential'
  },
  {
    id: '19',
    type: 'place',
    title: 'Arrive at Prudential',
    location: { lat: 42.3477, lng: -71.0818, name: 'Prudential Station' },
    duration: 5, // Quick stop
    description: 'Take the Green Line E to Prudential Station'
  },
  {
    id: '20',
    type: 'travel',
    from: 'Prudential Station',
    to: 'Prudential Center',
    transport: 'walk',
    duration: 5, // 5 minute walk
    description: 'Walk to Prudential Center'
  },
  {
    id: '21',
    type: 'place',
    title: 'Prudential Observatory',
    location: { lat: 42.3471, lng: -71.0817, name: 'Prudential Center' },
    duration: 60, // 1 hour for views and maybe a drink
    description: 'Visit the top of the Prudential Observatory'
  },
  {
    id: '22',
    type: 'travel',
    from: 'Prudential Center',
    to: 'South Station',
    transport: 'train',
    duration: 20, // 20 minutes to South Station
    description: 'Take the Orange Line or walk to South Station'
  },
  {
    id: '23',
    type: 'place',
    title: 'Train to NYC',
    location: { lat: 42.3522, lng: -71.0552, name: 'South Station' },
    duration: 30, // 30 minutes before departure
    startTime: '7:45 PM', // FIXED TIME
    description: 'Depart for New York City'
  }
];