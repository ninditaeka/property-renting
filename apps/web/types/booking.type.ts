// Define the booking type
export interface Booking {
  id: string;
  name: string;
  property: string;
  checkIn: string;
  checkOut: string;
}

export type SortDirection = 'asc' | 'desc' | null;

export interface SortState {
  column: keyof Booking | null;
  direction: SortDirection;
}

export interface FilterState {
  name: string | null;
  property: string | null;
}

export interface DateRangeState {
  from: Date | null;
  to: Date | null;
}

// Sample booking data
export const allBookings: Booking[] = [
  {
    id: '#01',
    name: 'Nikitha',
    property: 'Hotel Gala',
    checkIn: '14 March 2025',
    checkOut: '15 March 2025',
  },
  {
    id: '#02',
    name: 'Ani',
    property: 'Resort Spa',
    checkIn: '16 March 2025',
    checkOut: '18 March 2025',
  },
  {
    id: '#03',
    name: 'Nikitha',
    property: 'Beach House',
    checkIn: '20 March 2025',
    checkOut: '25 March 2025',
  },
  {
    id: '#04',
    name: 'Nikitha',
    property: 'Mountain Cabin',
    checkIn: '01 April 2025',
    checkOut: '05 April 2025',
  },
  {
    id: '#05',
    name: 'John',
    property: 'City Apartment',
    checkIn: '10 April 2025',
    checkOut: '15 April 2025',
  },
  {
    id: '#06',
    name: 'Sarah',
    property: 'Lakeside Cottage',
    checkIn: '18 April 2025',
    checkOut: '22 April 2025',
  },
  {
    id: '#07',
    name: 'Michael',
    property: 'Downtown Loft',
    checkIn: '25 April 2025',
    checkOut: '30 April 2025',
  },
  {
    id: '#08',
    name: 'Emma',
    property: 'Seaside Villa',
    checkIn: '05 May 2025',
    checkOut: '12 May 2025',
  },
  {
    id: '#09',
    name: 'David',
    property: 'Mountain Lodge',
    checkIn: '15 May 2025',
    checkOut: '20 May 2025',
  },
  {
    id: '#10',
    name: 'Sophie',
    property: 'Urban Condo',
    checkIn: '25 May 2025',
    checkOut: '30 May 2025',
  },
  {
    id: '#11',
    name: 'James',
    property: 'Beachfront Villa',
    checkIn: '05 June 2025',
    checkOut: '12 June 2025',
  },
  {
    id: '#12',
    name: 'Olivia',
    property: 'Country House',
    checkIn: '15 June 2025',
    checkOut: '22 June 2025',
  },
];
