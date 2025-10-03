import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { dummyAuthService, type DummyUser } from '../lib/dummyAuth';
import type { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: DummyUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: any) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<DummyUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial user and listen for auth changes
    const { unsubscribe } = dummyAuthService.onAuthStateChange((user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    await dummyAuthService.signIn(email, password);
  };

  const signUp = async (email: string, password: string, userData: any) => {
    await dummyAuthService.signUp(email, password, userData);
  };

  const signOut = async () => {
    await dummyAuthService.signOut();
  };

  const resetPassword = async (email: string) => {
    await dummyAuthService.resetPassword(email);
  };

  const updatePassword = async (newPassword: string) => {
    await dummyAuthService.updatePassword(newPassword);
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export { AuthContext }