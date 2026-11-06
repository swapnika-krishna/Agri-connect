import { USE_MOCK } from './config';
import { api } from './api';
import { mockStorage } from './storage';
import { Activity, ActivityType } from '../types';

export interface CreateActivityData {
  farm: string;
  type: ActivityType;
  date: string;
  notes: string;
  cost?: number;
}

export const activityService = {
  async getActivitiesByFarm(farmId: string): Promise<Activity[]> {
    if (!USE_MOCK) {
      return api.get(`/farms/${farmId}/activities`);
    }
    const all = mockStorage.getActivities();
    return all.filter((a) => (typeof a.farm === 'string' ? a.farm === farmId : a.farm._id === farmId));
  },

  async getAllMyActivities(): Promise<Activity[]> {
    if (!USE_MOCK) {
      return api.get('/activities');
    }
    const user = mockStorage.getCurrentUser();
    if (!user) return [];
    const all = mockStorage.getActivities();
    return all.filter((a) => (typeof a.owner === 'string' ? a.owner === user._id : a.owner._id === user._id));
  },

  async createActivity(data: CreateActivityData): Promise<Activity> {
    if (!USE_MOCK) {
      return api.post('/activities', data);
    }
    const user = mockStorage.getCurrentUser();
    if (!user) throw new Error('Not authenticated');

    const newActivity: Activity = {
      _id: `act_${Date.now()}`,
      id: `act_${Date.now()}`,
      owner: user._id,
      ...data,
      createdAt: new Date().toISOString(),
    };

    const acts = mockStorage.getActivities();
    acts.unshift(newActivity);
    mockStorage.setActivities(acts);
    return newActivity;
  },

  async updateActivity(id: string, updates: Partial<CreateActivityData>): Promise<Activity> {
    if (!USE_MOCK) {
      return api.put(`/activities/${id}`, updates);
    }
    const acts = mockStorage.getActivities();
    const idx = acts.findIndex((a) => a._id === id || a.id === id);
    if (idx === -1) throw new Error('Activity not found');

    const updated = { ...acts[idx], ...updates };
    acts[idx] = updated;
    mockStorage.setActivities(acts);
    return updated;
  },

  async deleteActivity(id: string): Promise<{ success: boolean }> {
    if (!USE_MOCK) {
      return api.delete(`/activities/${id}`);
    }
    let acts = mockStorage.getActivities();
    acts = acts.filter((a) => a._id !== id && a.id !== id);
    mockStorage.setActivities(acts);
    return { success: true };
  },
};
