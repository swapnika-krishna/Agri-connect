import { USE_MOCK } from './config';
import { api } from './api';
import { mockStorage } from './storage';
import { AdminStats, User } from '../types';

export const adminService = {
  async getStats(): Promise<AdminStats> {
    if (!USE_MOCK) {
      return api.get('/admin/stats');
    }

    const users = mockStorage.getUsers();
    const farms = mockStorage.getFarms();
    const queries = mockStorage.getQueries();
    const activities = mockStorage.getActivities();
    const crops = mockStorage.getCrops();

    return {
      totalFarmers: users.filter((u) => u.role === 'farmer').length,
      totalExperts: users.filter((u) => u.role === 'expert').length,
      totalFarms: farms.length,
      totalQueries: queries.length,
      openQueries: queries.filter((q) => q.status === 'Open').length,
      resolvedQueries: queries.filter((q) => q.status === 'Resolved').length,
      totalActivities: activities.length,
      totalCrops: crops.length,
    };
  },

  async getUsers(): Promise<User[]> {
    if (!USE_MOCK) {
      return api.get('/admin/users');
    }
    return mockStorage.getUsers();
  },

  async updateUserStatus(id: string, isActive: boolean): Promise<User> {
    if (!USE_MOCK) {
      return api.put(`/admin/users/${id}/status`, { isActive });
    }
    const users = mockStorage.getUsers();
    const idx = users.findIndex((u) => u._id === id || u.id === id);
    if (idx === -1) throw new Error('User not found');

    users[idx].isActive = isActive;
    mockStorage.setUsers(users);
    return users[idx];
  },

  async approveExpert(id: string): Promise<User> {
    if (!USE_MOCK) {
      return api.put(`/admin/users/${id}/approve`);
    }
    const users = mockStorage.getUsers();
    const idx = users.findIndex((u) => u._id === id || u.id === id);
    if (idx === -1) throw new Error('User not found');

    users[idx].isApproved = true;
    mockStorage.setUsers(users);
    return users[idx];
  },

  async deleteUser(id: string): Promise<{ success: boolean }> {
    if (!USE_MOCK) {
      return api.delete(`/admin/users/${id}`);
    }
    let users = mockStorage.getUsers();
    users = users.filter((u) => u._id !== id && u.id !== id);
    mockStorage.setUsers(users);
    return { success: true };
  },
};
