import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { User, UserRole } from '../types';
import { MOCK_USERS } from '../services/mockData';

export interface RegisteredAccount {
  user: User;
  password: string;
}

// Initial registered credentials pool
const INITIAL_ACCOUNTS: RegisteredAccount[] = [
  {
    user: MOCK_USERS.superadmin,
    password: 'SuperAdmin@2026!'
  },
  {
    user: MOCK_USERS.admin,
    password: 'AdminPass@2026!'
  },
  {
    user: MOCK_USERS.instructor,
    password: 'InstructorPass@2026!'
  },
  {
    user: MOCK_USERS.student,
    password: 'StudentPass@2026!'
  }
];

export interface AuthState {
  user: User | null;
  token: string | null;
  currentRole: UserRole | null;
  isAuthenticated: boolean;
  accounts: RegisteredAccount[];
}

export interface AuthActions {
  login: (
    identifier: string,
    password: string,
    requiredRole?: UserRole
  ) => { success: boolean; error?: string; user?: User };
  registerStudent: (
    name: string,
    email: string,
    password: string
  ) => { success: boolean; error?: string; user?: User };
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}

export type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  subscribeWithSelector((set, get) => ({
    user: null,
    token: null,
    currentRole: null,
    isAuthenticated: false,
    accounts: INITIAL_ACCOUNTS,

    login: (identifier: string, password: string, requiredRole?: UserRole) => {
      const cleanId = identifier.trim().toLowerCase();
      const cleanPass = password.trim();

      if (!cleanId || !cleanPass) {
        return { success: false, error: 'Please enter both username/email and password.' };
      }

      // Search accounts by email or role shortcut
      const match = get().accounts.find((acc) => {
        const emailMatch = acc.user.email.toLowerCase() === cleanId;
        const roleAliasMatch = acc.user.role.toLowerCase() === cleanId;
        const nameAliasMatch = acc.user.name.toLowerCase().replace(/\s+/g, '') === cleanId;
        return emailMatch || roleAliasMatch || nameAliasMatch;
      });

      if (!match) {
        return { success: false, error: 'Account not found with these credentials.' };
      }

      if (match.password !== cleanPass) {
        return { success: false, error: 'Invalid password. Please check your credentials.' };
      }

      // Check role enforcement if required
      if (requiredRole && match.user.role !== requiredRole) {
        return {
          success: false,
          error: `Access Denied: This account has role [${match.user.role}], but the selected portal requires [${requiredRole}].`
        };
      }

      // Successful login
      set({
        user: match.user,
        currentRole: match.user.role,
        token: `jwt-auth-token-${Date.now()}`,
        isAuthenticated: true
      });

      return { success: true, user: match.user };
    },

    registerStudent: (name: string, email: string, password: string) => {
      const cleanName = name.trim();
      const cleanEmail = email.trim().toLowerCase();
      const cleanPass = password.trim();

      if (!cleanName || !cleanEmail || !cleanPass) {
        return { success: false, error: 'All fields (Full Name, Email, Password) are required.' };
      }

      if (cleanPass.length < 6) {
        return { success: false, error: 'Password must be at least 6 characters long.' };
      }

      // Check if email already exists
      const existing = get().accounts.find(
        (acc) => acc.user.email.toLowerCase() === cleanEmail
      );

      if (existing) {
        return { success: false, error: 'An account with this email already exists.' };
      }

      const newStudentUser: User = {
        id: `user-student-${Date.now()}`,
        name: cleanName,
        email: cleanEmail,
        role: 'student',
        avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
        title: 'Platform Student',
        bio: 'Aspiring engineer enrolled in Obsidian Education masterclasses.',
        status: 'active',
        createdAt: new Date().toISOString().split('T')[0]
      };

      const newAccount: RegisteredAccount = {
        user: newStudentUser,
        password: cleanPass
      };

      set((state) => ({
        accounts: [...state.accounts, newAccount],
        user: newStudentUser,
        currentRole: 'student',
        token: `jwt-student-token-${Date.now()}`,
        isAuthenticated: true
      }));

      return { success: true, user: newStudentUser };
    },

    logout: () => {
      set({
        user: null,
        currentRole: null,
        token: null,
        isAuthenticated: false
      });
    },

    updateUser: (data: Partial<User>) => {
      set((state) => ({
        user: state.user ? { ...state.user, ...data } : null
      }));
    }
  }))
);
