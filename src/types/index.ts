export type UserRole = 'farmer' | 'expert' | 'admin';

export interface User {
  _id: string;
  id?: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  state?: string;
  district?: string;
  isActive: boolean;
  expertise?: string[]; // for experts: e.g. ['Crop Disease', 'Pest Control', 'Soil']
  isApproved?: boolean; // for experts
  createdAt: string;
  updatedAt?: string;
}

export type SoilType = 'Alluvial' | 'Black' | 'Red' | 'Laterite' | 'Sandy' | 'Clay' | 'Loamy';
export type WaterSource = 'Rainfed' | 'Borewell' | 'Canal' | 'River' | 'Tank';

export interface Farm {
  _id: string;
  id?: string;
  owner: string | User;
  name: string;
  state: string;
  district: string;
  latitude: number;
  longitude: number;
  sizeInAcres: number;
  soilType: SoilType;
  waterSource: WaterSource;
  currentCrops: string[];
  createdAt: string;
  updatedAt?: string;
}

export type ActivityType =
  | 'Sowing'
  | 'Irrigation'
  | 'Fertilizer'
  | 'Pesticide'
  | 'Weeding'
  | 'Harvest'
  | 'Other';

export interface Activity {
  _id: string;
  id?: string;
  farm: string | Farm;
  owner: string | User;
  type: ActivityType;
  date: string;
  notes: string;
  cost?: number;
  createdAt: string;
}

export type CropSeason = 'Kharif' | 'Rabi' | 'Zaid';

export interface Crop {
  _id: string;
  id?: string;
  name: string;
  soilTypes: SoilType[];
  seasons: CropSeason[];
  minRainfall: number; // mm
  maxRainfall: number; // mm
  minTemp: number; // °C
  maxTemp: number; // °C
  minPh: number;
  maxPh: number;
  durationDays: number;
  description: string;
  tips: string;
  createdAt?: string;
}

export type QueryCategory =
  | 'Crop Disease'
  | 'Pest Control'
  | 'Soil'
  | 'Irrigation'
  | 'Fertilizer'
  | 'Market'
  | 'Weather'
  | 'General';

export type QueryStatus = 'Open' | 'Answered' | 'Resolved';

export interface Reply {
  _id: string;
  id?: string;
  query: string;
  expert: User;
  message: string;
  createdAt: string;
}

export interface Query {
  _id: string;
  id?: string;
  farmer: User;
  title: string;
  description: string;
  category: QueryCategory;
  status: QueryStatus;
  replies?: Reply[];
  farmId?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Notification {
  _id: string;
  id?: string;
  user: string;
  message: string;
  type: 'query_reply' | 'query_new' | 'weather_alert' | 'market_alert' | 'system';
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export interface MandiPrice {
  id: string;
  state: string;
  district: string;
  market: string;
  commodity: string;
  variety: string;
  arrivalDate: string;
  minPrice: number; // INR per Quintal
  maxPrice: number;
  modalPrice: number;
}

export interface WeatherCurrent {
  time: string;
  temperature: number;
  relativeHumidity: number;
  apparentTemperature: number;
  precipitation: number;
  weatherCode: number;
  windSpeed: number;
  weatherDescription: string;
}

export interface WeatherDaily {
  time: string[];
  weatherCode: number[];
  temperatureMax: number[];
  temperatureMin: number[];
  precipitationSum: number[];
  precipitationProbabilityMax: number[];
  windSpeedMax: number[];
}

export interface WeatherData {
  latitude: number;
  longitude: number;
  timezone: string;
  current: WeatherCurrent;
  daily: WeatherDaily;
  farmingAdvice: string[];
  locationName?: string;
}

export interface CropRecommendationInput {
  soilType: SoilType;
  season: CropSeason;
  rainfall: number;
  temperature: number;
  ph: number;
}

export interface CropRecommendationResult {
  crop: Crop;
  matchScore: number; // percentage 0-100
  matchedReasons: string[];
  unmatchedReasons: string[];
}

export interface AdminStats {
  totalFarmers: number;
  totalExperts: number;
  totalFarms: number;
  totalQueries: number;
  openQueries: number;
  resolvedQueries: number;
  totalActivities: number;
  totalCrops: number;
}
