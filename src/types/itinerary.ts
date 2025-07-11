export type TransportType = 'walk' | 'train';

export interface Location {
  lat: number;
  lng: number;
  name: string;
}

export interface ItineraryItem {
  id: string;
  time: string;
  title: string;
  location: Location;
  transport: TransportType;
  description?: string;
}

export const itineraryData: ItineraryItem[] = [
  {
    id: '1',
    time: '7:00 PM',
    title: 'Land at Boston Logan',
    location: { lat: 42.3656, lng: -71.0096, name: 'Boston Logan Airport' },
    transport: 'walk',
    description: 'Arrival at Boston Logan International Airport'
  },
  {
    id: '2',
    time: '8:00 PM',
    title: 'Grab a coffee at Tatte',
    location: { lat: 42.3484, lng: -71.0866, name: 'Tatte Bakery - 160 Massachusetts Ave' },
    transport: 'train',
    description: 'Take Back Bay Logan Express bus to Tatte Bakery & Cafe'
  },
  {
    id: '3',
    time: '9:00 AM',
    title: 'Meet up',
    location: { lat: 42.3489, lng: -71.0796, name: '780 Boylston Street' },
    transport: 'walk',
    description: 'Morning meetup at 780 Boylston St'
  },
  {
    id: '4',
    time: '9:30 AM',
    title: 'Public Garden',
    location: { lat: 42.3541, lng: -71.0704, name: 'Boston Public Garden' },
    transport: 'walk',
    description: 'Walk through the beautiful Boston Public Garden'
  },
  {
    id: '5',
    time: '10:30 AM',
    title: 'Faneuil Hall',
    location: { lat: 42.3600, lng: -71.0546, name: 'Faneuil Hall' },
    transport: 'walk',
    description: 'Historic marketplace and meeting hall'
  },
  {
    id: '6',
    time: '11:30 AM',
    title: 'North End',
    location: { lat: 42.3647, lng: -71.0542, name: 'North End' },
    transport: 'walk',
    description: "Boston's Little Italy"
  },
  {
    id: '7',
    time: '12:30 PM',
    title: 'Kendall/MIT',
    location: { lat: 42.3629, lng: -71.0901, name: 'Kendall/MIT Station' },
    transport: 'train',
    description: 'Take the T to Kendall/MIT'
  },
  {
    id: '8',
    time: '1:00 PM',
    title: 'Walk around MIT',
    location: { lat: 42.3601, lng: -71.0942, name: 'MIT Campus' },
    transport: 'walk',
    description: 'Explore MIT campus'
  },
  {
    id: '9',
    time: '2:30 PM',
    title: 'Harvard',
    location: { lat: 42.3732, lng: -71.1190, name: 'Harvard Square' },
    transport: 'train',
    description: 'Take the train to Harvard'
  },
  {
    id: '10',
    time: '3:30 PM',
    title: 'Take subway to Prudential',
    location: { lat: 42.3477, lng: -71.0818, name: 'Prudential Station' },
    transport: 'train',
    description: 'Take the Green Line E to Prudential Station'
  },
  {
    id: '11',
    time: '5:00 PM',
    title: 'Prudential Observatory',
    location: { lat: 42.3471, lng: -71.0817, name: 'Prudential Center' },
    transport: 'walk',
    description: 'Visit the top of the Prudential Observatory'
  },
  {
    id: '12',
    time: '7:30 PM',
    title: 'Train to NYC',
    location: { lat: 42.3522, lng: -71.0552, name: 'South Station' },
    transport: 'train',
    description: 'Depart for New York City'
  }
];