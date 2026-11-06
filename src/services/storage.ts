import {
  INITIAL_USERS,
  INITIAL_FARMS,
  INITIAL_ACTIVITIES,
  INITIAL_CROPS,
  INITIAL_MANDI_PRICES,
  INITIAL_QUERIES,
  INITIAL_NOTIFICATIONS,
} from './mockData';
import { User, Farm, Activity, Crop, Query, Notification, MandiPrice } from '../types';

const STORAGE_KEYS = {
  USERS: 'agriconnect_users',
  FARMS: 'agriconnect_farms',
  ACTIVITIES: 'agriconnect_activities',
  CROPS: 'agriconnect_crops',
  MANDI_PRICES: 'agriconnect_mandi_prices',
  QUERIES: 'agriconnect_queries',
  NOTIFICATIONS: 'agriconnect_notifications',
  CURRENT_USER: 'agriconnect_current_user',
  TOKEN: 'agriconnect_token',
};

function getOrInit<T>(key: string, defaultData: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      localStorage.setItem(key, JSON.stringify(defaultData));
      return defaultData;
    }
    return JSON.parse(item) as T;
  } catch {
    return defaultData;
  }
}

function setItem<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Error saving to localStorage key ${key}:`, err);
  }
}

export const mockStorage = {
  getUsers: (): User[] => getOrInit(STORAGE_KEYS.USERS, INITIAL_USERS),
  setUsers: (users: User[]) => setItem(STORAGE_KEYS.USERS, users),

  getFarms: (): Farm[] => getOrInit(STORAGE_KEYS.FARMS, INITIAL_FARMS),
  setFarms: (farms: Farm[]) => setItem(STORAGE_KEYS.FARMS, farms),

  getActivities: (): Activity[] => getOrInit(STORAGE_KEYS.ACTIVITIES, INITIAL_ACTIVITIES),
  setActivities: (acts: Activity[]) => setItem(STORAGE_KEYS.ACTIVITIES, acts),

  getCrops: (): Crop[] => getOrInit(STORAGE_KEYS.CROPS, INITIAL_CROPS),
  setCrops: (crops: Crop[]) => setItem(STORAGE_KEYS.CROPS, crops),

  getMandiPrices: (): MandiPrice[] => getOrInit(STORAGE_KEYS.MANDI_PRICES, INITIAL_MANDI_PRICES),
  setMandiPrices: (prices: MandiPrice[]) => setItem(STORAGE_KEYS.MANDI_PRICES, prices),

  getQueries: (): Query[] => getOrInit(STORAGE_KEYS.QUERIES, INITIAL_QUERIES),
  setQueries: (queries: Query[]) => setItem(STORAGE_KEYS.QUERIES, queries),

  getNotifications: (): Notification[] =>
    getOrInit(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS),
  setNotifications: (notifs: Notification[]) => setItem(STORAGE_KEYS.NOTIFICATIONS, notifs),

  getCurrentUser: (): User | null => {
    try {
      const item = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      return item ? JSON.parse(item) : INITIAL_USERS[4]; // Default to Gurpreet Singh (farmer)
    } catch {
      return INITIAL_USERS[4];
    }
  },
  setCurrentUser: (user: User | null) => {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
      localStorage.setItem(STORAGE_KEYS.TOKEN, `mock_jwt_token_${user._id}`);
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
    }
  },

  getToken: (): string | null => localStorage.getItem(STORAGE_KEYS.TOKEN) || 'mock_jwt_token',

  resetToDefaults: () => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
    localStorage.setItem(STORAGE_KEYS.FARMS, JSON.stringify(INITIAL_FARMS));
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(INITIAL_ACTIVITIES));
    localStorage.setItem(STORAGE_KEYS.CROPS, JSON.stringify(INITIAL_CROPS));
    localStorage.setItem(STORAGE_KEYS.MANDI_PRICES, JSON.stringify(INITIAL_MANDI_PRICES));
    localStorage.setItem(STORAGE_KEYS.QUERIES, JSON.stringify(INITIAL_QUERIES));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(INITIAL_USERS[4]));
  },
};
