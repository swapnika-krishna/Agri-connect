import { USE_MOCK } from './config';
import { api } from './api';
import { mockStorage } from './storage';
import { User, UserRole } from '../types';

export interface RegisterData {
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  phone?: string;
  state?: string;
  district?: string;
  expertise?: string[];
}

export interface LoginData {
  email: string;
  password?: string;
}

export const authService = {
  async register(data: RegisterData): Promise<{ user: User; token: string }> {
    if (!USE_MOCK) {
      return api.post('/auth/register', data);
    }

    const users = mockStorage.getUsers();
    const existing = users.find((u) => u.email.toLowerCase() === data.email.toLowerCase());
    if (existing) {
      throw new Error('User with this email already exists');
    }

    const newUser: User = {
      _id: `user_${Date.now()}`,
      id: `user_${Date.now()}`,
      name: data.name,
      email: data.email,
      role: data.role,
      phone: data.phone || '',
      state: data.state || '',
      district: data.district || '',
      isActive: true,
      isApproved: data.role === 'expert' ? false : true, // Experts require admin approval
      expertise: data.role === 'expert' ? data.expertise || ['Crop Disease'] : undefined,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    mockStorage.setUsers(users);
    const token = `mock_token_${newUser._id}`;
    mockStorage.setCurrentUser(newUser);

    return { user: newUser, token };
  },

  async login(data: LoginData): Promise<{ user: User; token: string }> {
    if (!USE_MOCK) {
      return api.post('/auth/login', data);
    }

    const users = mockStorage.getUsers();
    const user = users.find((u) => u.email.toLowerCase() === data.email.toLowerCase());
    if (!user) {
      throw new Error('Invalid email or password');
    }

    if (!user.isActive) {
      throw new Error('Account has been deactivated. Please contact support.');
    }

    if (user.role === 'expert' && user.isApproved === false) {
      throw new Error('Your expert account is pending approval by the platform administrator.');
    }

    const token = `mock_token_${user._id}`;
    mockStorage.setCurrentUser(user);
    return { user, token };
  },

  async getMe(): Promise<User> {
    if (!USE_MOCK) {
      return api.get('/auth/me');
    }
    const current = mockStorage.getCurrentUser();
    if (!current) throw new Error('Not authenticated');
    return current;
  },

  async updateProfile(updates: Partial<User>): Promise<User> {
    if (!USE_MOCK) {
      return api.put('/auth/profile', updates);
    }

    const current = mockStorage.getCurrentUser();
    if (!current) throw new Error('Not authenticated');

    const users = mockStorage.getUsers();
    const idx = users.findIndex((u) => u._id === current._id);
    if (idx !== -1) {
      const updatedUser = { ...users[idx], ...updates, updatedAt: new Date().toISOString() };
      users[idx] = updatedUser;
      mockStorage.setUsers(users);
      mockStorage.setCurrentUser(updatedUser);
      return updatedUser;
    }
    throw new Error('User not found');
  },

  logout(): void {
    mockStorage.setCurrentUser(null);
  },
};
