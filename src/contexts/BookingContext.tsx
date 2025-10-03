import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Destination {
  id: string;
  name: string;
  country: string;
  description: string;
  price: number;
  duration: string;
  image: string;
  rating: number;
  category: 'beach' | 'mountain' | 'city' | 'adventure' | 'cultural';
  featured: boolean;
}

export interface Booking {
  id: string;
  userId: string;
  destinationId: string;
  destination: Destination;
  startDate: string;
  endDate: string;
  guests: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}

interface BookingContextType {
  destinations: Destination[];
  bookings: Booking[];
  addDestination: (destination: Omit<Destination, 'id'>) => void;
  updateDestination: (id: string, destination: Partial<Destination>) => void;
  deleteDestination: (id: string) => void;
  createBooking: (booking: Omit<Booking, 'id' | 'createdAt'>) => void;
  updateBookingStatus: (id: string, status: Booking['status']) => void;
  getUserBookings: (userId: string) => Booking[];
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

// Sample destinations data
const initialDestinations: Destination[] = [
  {
    id: '1',
    name: 'Santorini',
    country: 'Greece',
    description: 'Experience the breathtaking sunsets and white-washed buildings of this iconic Greek island.',
    price: 1299,
    duration: '7 days',
    image: 'https://images.pexels.com/photos/161815/santorini-travel-greece-island-161815.jpeg?auto=compress&cs=tinysrgb&w=800',
    rating: 4.9,
    category: 'beach',
    featured: true
  },
  {
    id: '2',
    name: 'Swiss Alps',
    country: 'Switzerland',
    description: 'Adventure through pristine mountain landscapes and charming alpine villages.',
    price: 1899,
    duration: '10 days',
    image: 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=800',
    rating: 4.8,
    category: 'mountain',
    featured: true
  },
  {
    id: '3',
    name: 'Tokyo',
    country: 'Japan',
    description: 'Immerse yourself in the perfect blend of traditional culture and modern innovation.',
    price: 1599,
    duration: '8 days',
    image: 'https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=800',
    rating: 4.7,
    category: 'city',
    featured: true
  },
  {
    id: '4',
    name: 'Bali',
    country: 'Indonesia',
    description: 'Relax on pristine beaches and explore ancient temples in this tropical paradise.',
    price: 999,
    duration: '6 days',
    image: 'https://images.pexels.com/photos/2474690/pexels-photo-2474690.jpeg?auto=compress&cs=tinysrgb&w=800',
    rating: 4.6,
    category: 'beach',
    featured: false
  },
  {
    id: '5',
    name: 'Machu Picchu',
    country: 'Peru',
    description: 'Trek to the ancient Incan citadel and discover one of the world\'s greatest archaeological sites.',
    price: 1799,
    duration: '9 days',
    image: 'https://images.pexels.com/photos/259967/pexels-photo-259967.jpeg?auto=compress&cs=tinysrgb&w=800',
    rating: 4.9,
    category: 'adventure',
    featured: false
  },
  {
    id: '6',
    name: 'Rome',
    country: 'Italy',
    description: 'Walk through history in the Eternal City, from the Colosseum to Vatican City.',
    price: 1199,
    duration: '5 days',
    image: 'https://images.pexels.com/photos/2064827/pexels-photo-2064827.jpeg?auto=compress&cs=tinysrgb&w=800',
    rating: 4.5,
    category: 'cultural',
    featured: false
  }
];

export function BookingProvider({ children }: { children: ReactNode }) {
  const [destinations, setDestinations] = useState<Destination[]>(initialDestinations);
  const [bookings, setBookings] = useState<Booking[]>([]);

  const addDestination = (destination: Omit<Destination, 'id'>) => {
    const newDestination: Destination = {
      ...destination,
      id: Date.now().toString()
    };
    setDestinations(prev => [...prev, newDestination]);
  };

  const updateDestination = (id: string, updates: Partial<Destination>) => {
    setDestinations(prev => prev.map(dest => 
      dest.id === id ? { ...dest, ...updates } : dest
    ));
  };

  const deleteDestination = (id: string) => {
    setDestinations(prev => prev.filter(dest => dest.id !== id));
  };

  const createBooking = (bookingData: Omit<Booking, 'id' | 'createdAt'>) => {
    const newBooking: Booking = {
      ...bookingData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setBookings(prev => [...prev, newBooking]);
  };

  const updateBookingStatus = (id: string, status: Booking['status']) => {
    setBookings(prev => prev.map(booking => 
      booking.id === id ? { ...booking, status } : booking
    ));
  };

  const getUserBookings = (userId: string) => {
    return bookings.filter(booking => booking.userId === userId);
  };

  const value = {
    destinations,
    bookings,
    addDestination,
    updateDestination,
    deleteDestination,
    createBooking,
    updateBookingStatus,
    getUserBookings
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}