import { USE_MOCK } from './config';
import { api } from './api';
import { mockStorage } from './storage';
import { Notification } from '../types';

export const notificationService = {
  async getNotifications(): Promise<Notification[]> {
    if (!USE_MOCK) {
      return api.get('/notifications');
    }
    const user = mockStorage.getCurrentUser();
    if (!user) return [];
    const all = mockStorage.getNotifications();
    return all.filter((n) => n.user === user._id || n.user === user.id);
  },

  async markAsRead(id: string): Promise<{ success: boolean }> {
    if (!USE_MOCK) {
      return api.put(`/notifications/${id}/read`);
    }
    const all = mockStorage.getNotifications();
    const idx = all.findIndex((n) => n._id === id || n.id === id);
    if (idx !== -1) {
      all[idx].isRead = true;
      mockStorage.setNotifications(all);
    }
    return { success: true };
  },

  async markAllAsRead(): Promise<{ success: boolean }> {
    if (!USE_MOCK) {
      return api.put('/notifications/read-all');
    }
    const user = mockStorage.getCurrentUser();
    if (!user) return { success: true };

    const all = mockStorage.getNotifications();
    all.forEach((n) => {
      if (n.user === user._id || n.user === user.id) {
        n.isRead = true;
      }
    });
    mockStorage.setNotifications(all);
    return { success: true };
  },
};
