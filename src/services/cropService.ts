import { USE_MOCK } from './config';
import { api } from './api';
import { mockStorage } from './storage';
import { Crop, CropRecommendationInput, CropRecommendationResult } from '../types';
import { scoreCrops } from '../utils/cropScorer';

export const cropService = {
  async getCrops(): Promise<Crop[]> {
    if (!USE_MOCK) {
      return api.get('/crops');
    }
    return mockStorage.getCrops();
  },

  async recommendCrops(input: CropRecommendationInput): Promise<CropRecommendationResult[]> {
    if (!USE_MOCK) {
      return api.post('/crops/recommend', input);
    }
    const crops = mockStorage.getCrops();
    const ranked = scoreCrops(crops, input);
    return ranked.slice(0, 5); // Return top 5 ranked
  },

  async createCrop(data: Omit<Crop, '_id' | 'id'>): Promise<Crop> {
    if (!USE_MOCK) {
      return api.post('/crops', data);
    }
    const crops = mockStorage.getCrops();
    const newCrop: Crop = {
      _id: `crop_${Date.now()}`,
      id: `crop_${Date.now()}`,
      ...data,
      createdAt: new Date().toISOString(),
    };
    crops.unshift(newCrop);
    mockStorage.setCrops(crops);
    return newCrop;
  },

  async updateCrop(id: string, updates: Partial<Crop>): Promise<Crop> {
    if (!USE_MOCK) {
      return api.put(`/crops/${id}`, updates);
    }
    const crops = mockStorage.getCrops();
    const idx = crops.findIndex((c) => c._id === id || c.id === id);
    if (idx === -1) throw new Error('Crop not found');

    const updated = { ...crops[idx], ...updates };
    crops[idx] = updated;
    mockStorage.setCrops(crops);
    return updated;
  },

  async deleteCrop(id: string): Promise<{ success: boolean }> {
    if (!USE_MOCK) {
      return api.delete(`/crops/${id}`);
    }
    let crops = mockStorage.getCrops();
    crops = crops.filter((c) => c._id !== id && c.id !== id);
    mockStorage.setCrops(crops);
    return { success: true };
  },
};
