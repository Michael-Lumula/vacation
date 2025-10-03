import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { BookingProvider } from './contexts/BookingContext';
import { TourismLayout } from './components/layouts/TourismLayout';

function App() {
  return (
    <AuthProvider>
      <BookingProvider>
        <TourismLayout />
      </BookingProvider>
    </AuthProvider>
  );
}

export default App;