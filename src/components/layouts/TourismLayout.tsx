import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Header } from '../tourism/Header';
import { Hero } from '../tourism/Hero';
import { FeaturedDestinations } from '../tourism/FeaturedDestinations';
import { AllDestinations } from '../tourism/AllDestinations';
import { About } from '../tourism/About';
import { Contact } from '../tourism/Contact';
import { Footer } from '../tourism/Footer';
import { AuthModal } from '../tourism/AuthModal';
import { BookingModal } from '../tourism/BookingModal';
import { KYCModal } from '../tourism/KYCModal';
import { AdminDashboard } from '../admin/AdminDashboard';
import { UserDashboard } from '../tourism/UserDashboard';
import type { Destination } from '../../contexts/BookingContext';

export function TourismLayout() {
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showKYCModal, setShowKYCModal] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [currentView, setCurrentView] = useState<'home' | 'admin' | 'dashboard'>('home');
  const [searchData, setSearchData] = useState<{ destination: string; date: string; guests: number } | undefined>();

  const handleBookNow = (destination: Destination) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    setSelectedDestination(destination);
    setShowBookingModal(true);
  };

  const isAdmin = user?.email === 'admin@wanderlust.com';

  if (currentView === 'admin' && isAdmin) {
    return <AdminDashboard onBack={() => setCurrentView('home')} />;
  }

  if (currentView === 'dashboard' && user) {
    return <UserDashboard onBack={() => setCurrentView('home')} />;
  }

  return (
    <div className="min-h-screen bg-white">
      <Header 
        onAuthClick={() => setShowAuthModal(true)}
        onAdminClick={() => setCurrentView('admin')}
        onDashboardClick={() => setCurrentView('dashboard')}
        onKYCClick={() => setShowKYCModal(true)}
        isAdmin={isAdmin}
      />
      <Hero onSearch={setSearchData} />
      <FeaturedDestinations onBookNow={handleBookNow} />
      <AllDestinations onBookNow={handleBookNow} searchData={searchData} />
      <About />
      <Contact />
      <Footer />
      
      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}
      
      {showBookingModal && selectedDestination && (
        <BookingModal 
          destination={selectedDestination}
          onClose={() => {
            setShowBookingModal(false);
            setSelectedDestination(null);
          }}
        />
      )}
      
      {showKYCModal && (
        <KYCModal onClose={() => setShowKYCModal(false)} />
      )}
    </div>
  );
}