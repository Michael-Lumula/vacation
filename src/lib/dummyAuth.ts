// Dummy authentication system for demo purposes
export interface DummyUser {
  id: string;
  email: string;
  user_metadata: {
    full_name: string;
  };
  created_at: string;
}

export interface DummyUserProfile {
  id: string;
  email: string;
  full_name: string;
  role: string;
  created_at: string;
  last_login: string | null;
}

// Dummy users for demo
export const dummyUsers: DummyUser[] = [
  {
    id: '1',
    email: 'admin@wanderlust.com',
    user_metadata: { full_name: 'Admin User' },
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    email: 'user@wanderlust.com',
    user_metadata: { full_name: 'Travel User' },
    created_at: '2024-01-02T00:00:00Z'
  }
];

// Dummy user profiles with roles
export const dummyUserProfiles: DummyUserProfile[] = [
  {
    id: '1',
    email: 'admin@wanderlust.com',
    full_name: 'Admin User',
    role: 'admin',
    created_at: '2024-01-01T00:00:00Z',
    last_login: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    email: 'user@wanderlust.com',
    full_name: 'Travel User',
    role: 'user',
    created_at: '2024-01-02T00:00:00Z',
    last_login: '2024-01-13T09:20:00Z'
  }
];

// Dummy passwords (in real app, these would be hashed)
export const dummyPasswords: Record<string, string> = {
  'admin@wanderlust.com': 'admin123',
  'user@wanderlust.com': 'user123'
};

export class DummyAuthService {
  private currentUser: DummyUser | null = null;
  private listeners: ((user: DummyUser | null) => void)[] = [];

  constructor() {
    // Check for stored session
    const storedUser = localStorage.getItem('dummyUser');
    if (storedUser) {
      this.currentUser = JSON.parse(storedUser);
    }
  }

  getCurrentUser(): DummyUser | null {
    return this.currentUser;
  }

  onAuthStateChange(callback: (user: DummyUser | null) => void) {
    this.listeners.push(callback);
    // Call immediately with current state
    callback(this.currentUser);
    
    return {
      unsubscribe: () => {
        const index = this.listeners.indexOf(callback);
        if (index > -1) {
          this.listeners.splice(index, 1);
        }
      }
    };
  }

  async signIn(email: string, password: string): Promise<void> {
    const user = dummyUsers.find(u => u.email === email);
    const correctPassword = dummyPasswords[email];

    if (!user || password !== correctPassword) {
      throw new Error('Invalid email or password');
    }

    this.currentUser = user;
    localStorage.setItem('dummyUser', JSON.stringify(user));
    this.notifyListeners();
  }

  async signUp(email: string, password: string, userData: any): Promise<void> {
    // Check if user already exists
    if (dummyUsers.find(u => u.email === email)) {
      throw new Error('User already exists');
    }

    const newUser: DummyUser = {
      id: Date.now().toString(),
      email,
      user_metadata: { full_name: userData.full_name },
      created_at: new Date().toISOString()
    };

    // Add to dummy users
    dummyUsers.push(newUser);
    dummyPasswords[email] = password;
    
    // Add to profiles
    dummyUserProfiles.push({
      id: newUser.id,
      email: newUser.email,
      full_name: userData.full_name,
      role: 'user',
      created_at: newUser.created_at,
      last_login: null
    });

    this.currentUser = newUser;
    localStorage.setItem('dummyUser', JSON.stringify(newUser));
    this.notifyListeners();
  }

  async signOut(): Promise<void> {
    this.currentUser = null;
    localStorage.removeItem('dummyUser');
    this.notifyListeners();
  }

  async resetPassword(email: string): Promise<void> {
    const user = dummyUsers.find(u => u.email === email);
    if (!user) {
      throw new Error('User not found');
    }
    // In demo mode, just simulate success
    console.log(`Password reset email sent to ${email}`);
  }

  async updatePassword(newPassword: string): Promise<void> {
    if (!this.currentUser) {
      throw new Error('No user logged in');
    }
    dummyPasswords[this.currentUser.email] = newPassword;
    console.log('Password updated successfully');
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.currentUser));
  }
}

export const dummyAuthService = new DummyAuthService();