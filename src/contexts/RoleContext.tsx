import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { dummyUserProfiles, type DummyUserProfile } from '../lib/dummyAuth';
import { useAuth } from './AuthContext';

export type UserProfile = DummyUserProfile;

interface RoleContextType {
  users: UserProfile[];
  loading: boolean;
  currentUserRole: string | null;
  fetchUsers: () => Promise<void>;
  updateUserRole: (userId: string, newRole: string) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchUsers();
      fetchCurrentUserRole();
    }
  }, [user]);

  const fetchCurrentUserRole = async () => {
    if (!user) return;
    const userProfile = dummyUserProfiles.find(profile => profile.id === user.id);
    setCurrentUserRole(userProfile?.role || null);
  };

  const fetchUsers = async () => {
    setUsers([...dummyUserProfiles]);
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    const userIndex = dummyUserProfiles.findIndex(user => user.id === userId);
    if (userIndex === -1) throw new Error('User not found');
    
    dummyUserProfiles[userIndex].role = newRole;
    await fetchUsers();
  };

  const deleteUser = async (userId: string) => {
    const userIndex = dummyUserProfiles.findIndex(user => user.id === userId);
    if (userIndex === -1) throw new Error('User not found');
    
    dummyUserProfiles.splice(userIndex, 1);
    await fetchUsers();
  };

  const value = {
    users,
    loading,
    currentUserRole,
    fetchUsers,
    updateUserRole,
    deleteUser
  };

  return (
    <RoleContext.Provider value={value}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRoles() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRoles must be used within a RoleProvider');
  }
  return context;
}