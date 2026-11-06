import { USE_MOCK } from './config';
import { api } from './api';
import { mockStorage } from './storage';
import { Farm, SoilType, WaterSource } from '../types';

export interface CreateFarmData {
  name: string;
  state: string;
  district: string;
  latitude: number;
  longitude: number;
  sizeInAcres: number;
  soilType: SoilType;
  waterSource: WaterSource;
  currentCrops: string[];
}

export const farmService = {
  async getFarms(): Promise<Farm[]> {
    if (!USE_MOCK) {
      return api.get('/farms');
    }
    const user = mockStorage.getCurrentUser();
    if (!user) return [];
    const farms = mockStorage.getFarms();
    // Return farms owned by this user
    return farms.filter((f) => (typeof f.owner === 'string' ? f.owner === user._id : f.owner._id === user._id));
  },

  async getFarmById(id: string): Promise<Farm> {
    if (!USE_MOCK) {
      return api.get(`/farms/${id}`);
    }
    const farm = mockStorage.getFarms().find((f) => f._id === id || f.id === id);
    if (!farm) throw new Error('Farm not found');
    return farm;
  },

  async createFarm(data: CreateFarmData): Promise<Farm> {
    if (!USE_MOCK) {
      return api.post('/farms', data);
    }
    const user = mockStorage.getCurrentUser();
    if (!user) throw new Error('Not authenticated');

    const newFarm: Farm = {
      _id: `farm_${Date.now()}`,
      id: `farm_${Date.now()}`,
      owner: user._id,
      ...data,
      createdAt: new Date().toISOString(),
    };

    const farms = mockStorage.getFarms();
    farms.unshift(newFarm);
    mockStorage.setFarms(farms);
    return newFarm;
  },

  async updateFarm(id: string, updates: Partial<CreateFarmData>): Promise<Farm> {
    if (!USE_MOCK) {
      return api.put(`/farms/${id}`, updates);
    }
    const farms = mockStorage.getFarms();
    const idx = farms.findIndex((f) => f._id === id || f.id === id);
    if (idx === -1) throw new Error('Farm not found');

    const updated = { ...farms[idx], ...updates, updatedAt: new Date().toISOString() };
    farms[idx] = updated;
    mockStorage.setFarms(farms);
    return updated;
  },

  async deleteFarm(id: string): Promise<{ success: boolean }> {
    if (!USE_MOCK) {
      return api.delete(`/farms/${id}`);
    }
    let farms = mockStorage.getFarms();
    farms = farms.filter((f) => f._id !== id && f.id !== id);
    mockStorage.setFarms(farms);

    // Also remove activities associated with this farm
    let activities = mockStorage.getActivities();
    activities = activities.filter((a) => (typeof a.farm === 'string' ? a.farm !== id : a.farm._id !== id));
    mockStorage.setActivities(activities);

    return { success: true };
  },
};
