import React, { useState } from 'react';
import { LoginForm } from '../auth/LoginForm';
import { RegisterForm } from '../auth/RegisterForm';
import { ForgotPasswordForm } from '../auth/ForgotPasswordForm';
import { Users, Shield } from 'lucide-react';

export function AuthLayout() {
  const [currentView, setCurrentView] = useState<'login' | 'register' | 'forgot'>('login');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-100">
      <div className="flex min-h-screen">
        {/* Left side - Branding */}
        <div className="hidden lg:flex lg:flex-1 lg:flex-col lg:justify-center lg:px-12 xl:px-16">
          <div className="max-w-md">
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-blue-600 p-3 rounded-lg">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">UserManage Pro</h1>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Powerful User Management Made Simple
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Manage users, assign roles, and control access with our modern, intuitive platform.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-blue-600" />
                <span className="text-gray-700">Role-based access control</span>
              </div>
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-blue-600" />
                <span className="text-gray-700">User management dashboard</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Auth forms */}
        <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">UserManage Pro</h1>
            </div>

            {currentView === 'login' && (
              <LoginForm 
                onSwitchToRegister={() => setCurrentView('register')}
                onSwitchToForgot={() => setCurrentView('forgot')}
              />
            )}
            
            {currentView === 'register' && (
              <RegisterForm 
                onSwitchToLogin={() => setCurrentView('login')}
              />
            )}
            
            {currentView === 'forgot' && (
              <ForgotPasswordForm 
                onSwitchToLogin={() => setCurrentView('login')}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}