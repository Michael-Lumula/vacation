import React, { useState } from 'react';
import { Sidebar } from '../dashboard/Sidebar';
import { Header } from '../dashboard/Header';
import { UserManagement } from '../dashboard/UserManagement';
import { PasswordChange } from '../dashboard/PasswordChange';
import { Profile } from '../dashboard/Profile';

export function DashboardLayout() {
  const [currentView, setCurrentView] = useState<'users' | 'profile' | 'password'>('users');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar 
        currentView={currentView}
        setCurrentView={setCurrentView}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      
      <div className="lg:pl-64">
        <Header setSidebarOpen={setSidebarOpen} />
        
        <main className="py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {currentView === 'users' && <UserManagement />}
            {currentView === 'profile' && <Profile />}
            {currentView === 'password' && <PasswordChange />}
          </div>
        </main>
      </div>
    </div>
  );
}