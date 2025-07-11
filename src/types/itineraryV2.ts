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
  time: string;
  title: string;
  location: Location;
  description?: string;
}

export interface TravelItem {
  id: string;
  type: 'travel';
  from: string;
  to: string;
  transport: TransportType;
  duration?: string;
  description?: string;
}

export type ItineraryItemV2 = PlaceItem | TravelItem;

export const itineraryDataV2: ItineraryItemV2[] = [
  {
    id: '1',
    type: 'place',
    time: '7:00 AM',
    title: 'Land at Boston Logan',
    location: { lat: 42.3656, lng: -71.0096, name: 'Boston Logan Airport' },
    description: 'Arrival at Boston Logan International Airport'
  },
  {
    id: '2',
    type: 'travel',
    from: 'Boston Logan Airport',
    to: 'Tatte Bakery',
    transport: 'bus',
    description: 'Take Back Bay Logan Express bus'
  },
  {
    id: '3',
    type: 'place',
    time: '8:00 AM',
    title: 'Grab a coffee at Tatte',
    location: { lat: 42.3484, lng: -71.0866, name: 'Tatte Bakery - 160 Massachusetts Ave' },
    description: 'Coffee at Tatte Bakery & Cafe'
  },
  {
    id: '4',
    type: 'travel',
    from: 'Tatte Bakery',
    to: '780 Boylston Street',
    transport: 'walk',
    description: 'Walk to meeting point'
  },
  {
    id: '5',
    type: 'place',
    time: '9:00 AM',
    title: 'Meet up',
    location: { lat: 42.3489, lng: -71.0796, name: '780 Boylston Street' },
    description: 'Morning meetup at 780 Boylston St'
  },
  {
    id: '6',
    type: 'travel',
    from: '780 Boylston Street',
    to: 'Boston Public Garden',
    transport: 'walk',
    description: 'Short walk to the Public Garden'
  },
  {
    id: '7',
    type: 'place',
    time: '9:30 AM',
    title: 'Public Garden',
    location: { lat: 42.3541, lng: -71.0704, name: 'Boston Public Garden' },
    description: 'Walk through the beautiful Boston Public Garden'
  },
  {
    id: '8',
    type: 'travel',
    from: 'Boston Public Garden',
    to: 'Faneuil Hall',
    transport: 'walk',
    description: 'Walk through downtown'
  },
  {
    id: '9',
    type: 'place',
    time: '10:30 AM',
    title: 'Faneuil Hall',
    location: { lat: 42.3600, lng: -71.0546, name: 'Faneuil Hall' },
    description: 'Historic marketplace and meeting hall'
  },
  {
    id: '10',
    type: 'travel',
    from: 'Faneuil Hall',
    to: 'North End',
    transport: 'walk',
    description: 'Walk to Little Italy'
  },
  {
    id: '11',
    type: 'place',
    time: '11:30 AM',
    title: 'North End',
    location: { lat: 42.3647, lng: -71.0542, name: 'North End' },
    description: "Boston's Little Italy"
  },
  {
    id: '12',
    type: 'travel',
    from: 'North End',
    to: 'Kendall/MIT Station',
    transport: 'train',
    description: 'Take the T to Kendall/MIT'
  },
  {
    id: '13',
    type: 'place',
    time: '12:30 PM',
    title: 'Kendall/MIT',
    location: { lat: 42.3629, lng: -71.0901, name: 'Kendall/MIT Station' },
    description: 'Arrive at Kendall/MIT Station'
  },
  {
    id: '14',
    type: 'travel',
    from: 'Kendall/MIT Station',
    to: 'MIT Campus',
    transport: 'walk',
    description: 'Walk to MIT campus'
  },
  {
    id: '15',
    type: 'place',
    time: '1:00 PM',
    title: 'Walk around MIT',
    location: { lat: 42.3601, lng: -71.0942, name: 'MIT Campus' },
    description: 'Explore MIT campus'
  },
  {
    id: '16',
    type: 'travel',
    from: 'MIT Campus',
    to: 'Harvard Square',
    transport: 'train',
    description: 'Take the Red Line to Harvard'
  },
  {
    id: '17',
    type: 'place',
    time: '2:30 PM',
    title: 'Harvard',
    location: { lat: 42.3732, lng: -71.1190, name: 'Harvard Square' },
    description: 'Explore Harvard Square'
  },
  {
    id: '18',
    type: 'travel',
    from: 'Harvard Square',
    to: 'Prudential Station',
    transport: 'train',
    description: 'Take the Red Line to Park St, then Green Line E to Prudential'
  },
  {
    id: '19',
    type: 'place',
    time: '3:30 PM',
    title: 'Arrive at Prudential',
    location: { lat: 42.3477, lng: -71.0818, name: 'Prudential Station' },
    description: 'Take the Green Line E to Prudential Station'
  },
  {
    id: '20',
    type: 'travel',
    from: 'Prudential Station',
    to: 'Prudential Center',
    transport: 'walk',
    description: 'Walk to Prudential Center'
  },
  {
    id: '21',
    type: 'place',
    time: '5:00 PM',
    title: 'Prudential Observatory',
    location: { lat: 42.3471, lng: -71.0817, name: 'Prudential Center' },
    description: 'Visit the top of the Prudential Observatory'
  },
  {
    id: '22',
    type: 'travel',
    from: 'Prudential Center',
    to: 'South Station',
    transport: 'train',
    description: 'Take the Orange Line or walk to South Station'
  },
  {
    id: '23',
    type: 'place',
    time: '7:30 PM',
    title: 'Train to NYC',
    location: { lat: 42.3522, lng: -71.0552, name: 'South Station' },
    description: 'Depart for New York City'
  }
];