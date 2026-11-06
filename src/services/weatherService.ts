import { USE_MOCK } from './config';
import { api } from './api';
import { WeatherData } from '../types';
import { generateFarmingAdvice, getWeatherDescription } from '../utils/weatherRules';

export interface GeocodeResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string; // State
}

export const weatherService = {
  async getWeather(lat: number, lon: number, locationName?: string): Promise<WeatherData> {
    if (!USE_MOCK) {
      return api.get(`/weather?lat=${lat}&lon=${lon}`);
    }

    // Direct call to weather API (OpenWeatherMap when key configured + Open-Meteo for 7-day forecast)
    try {
      const weatherApiKey = import.meta.env.VITE_WEATHER_API_KEY;
      let current: any = null;
      let resolvedLocName = locationName || 'Agricultural Field Area';

      if (weatherApiKey) {
        try {
          const owmUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weatherApiKey}&units=metric`;
          const owmRes = await fetch(owmUrl);
          if (owmRes.ok) {
            const d = await owmRes.json();
            if (d.name) {
              resolvedLocName = `${d.name}, ${d.sys?.country || 'IN'}`;
            }
            current = {
              time: new Date().toISOString(),
              temperature: Math.round(d.main.temp * 10) / 10,
              relativeHumidity: d.main.humidity,
              apparentTemperature: Math.round(d.main.feels_like * 10) / 10,
              precipitation: d.rain ? d.rain['1h'] || d.rain['3h'] || 0 : 0,
              weatherCode: d.weather?.[0]?.id || 800,
              windSpeed: Math.round((d.wind.speed * 3.6) * 10) / 10, // m/s to km/h
              weatherDescription: d.weather?.[0]?.description
                ? d.weather[0].description.charAt(0).toUpperCase() + d.weather[0].description.slice(1)
                : 'Clear Sky',
            };
          }
        } catch (owmErr) {
          console.warn('OWM fetch failed, falling back to Open-Meteo', owmErr);
        }
      }

      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max&timezone=auto`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Open-Meteo request failed');
      const data = await res.json();

      if (!current) {
        current = {
          time: data.current.time,
          temperature: Math.round(data.current.temperature_2m * 10) / 10,
          relativeHumidity: data.current.relative_humidity_2m,
          apparentTemperature: Math.round(data.current.apparent_temperature * 10) / 10,
          precipitation: data.current.precipitation,
          weatherCode: data.current.weather_code,
          windSpeed: Math.round(data.current.wind_speed_10m * 10) / 10,
          weatherDescription: getWeatherDescription(data.current.weather_code),
        };
      }

      const daily = {
        time: data.daily.time,
        weatherCode: data.daily.weather_code,
        temperatureMax: data.daily.temperature_2m_max,
        temperatureMin: data.daily.temperature_2m_min,
        precipitationSum: data.daily.precipitation_sum,
        precipitationProbabilityMax: data.daily.precipitation_probability_max,
        windSpeedMax: data.daily.wind_speed_10m_max,
      };

      const rainNext3Days = (daily.precipitationSum.slice(0, 3) || []).reduce(
        (acc: number, v: number) => acc + (v || 0),
        0
      );
      const maxWind = Math.max(...(daily.windSpeedMax.slice(0, 3) || [current.windSpeed]));
      const maxTemp = Math.max(...(daily.temperatureMax.slice(0, 3) || [current.temperature]));
      const minTemp = Math.min(...(daily.temperatureMin.slice(0, 3) || [current.temperature]));

      const farmingAdvice = generateFarmingAdvice({
        currentTemp: current.temperature,
        currentHumidity: current.relativeHumidity,
        currentWindSpeed: current.windSpeed,
        currentPrecip: current.precipitation,
        maxTemp,
        minTemp,
        totalRainNext3Days: rainNext3Days,
        maxWindSpeed: maxWind,
      });

      return {
        latitude: lat,
        longitude: lon,
        timezone: data.timezone || 'Asia/Kolkata',
        current,
        daily,
        farmingAdvice,
        locationName: resolvedLocName,
      };
    } catch {
      // Robust offline fallback data for India
      return getOfflineWeatherData(lat, lon, locationName);
    }
  },

  async geocode(query: string): Promise<GeocodeResult[]> {
    if (!USE_MOCK) {
      return api.get(`/weather/geocode?q=${encodeURIComponent(query)}`);
    }

    try {
      const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
        query
      )}&count=6&language=en&format=json`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Geocoding request failed');
      const data = await res.json();
      if (!data.results || !data.results.length) {
        return getCommonIndianLocations(query);
      }
      return data.results.map((r: any) => ({
        id: r.id,
        name: r.name,
        latitude: r.latitude,
        longitude: r.longitude,
        country: r.country,
        admin1: r.admin1,
      }));
    } catch {
      return getCommonIndianLocations(query);
    }
  },
};

function getCommonIndianLocations(query: string): GeocodeResult[] {
  const common: GeocodeResult[] = [
    { id: 1, name: 'Ludhiana', latitude: 30.901, longitude: 75.8573, country: 'India', admin1: 'Punjab' },
    { id: 2, name: 'Nashik', latitude: 19.9975, longitude: 73.7898, country: 'India', admin1: 'Maharashtra' },
    { id: 3, name: 'Patna', latitude: 25.5941, longitude: 85.1376, country: 'India', admin1: 'Bihar' },
    { id: 4, name: 'Indore', latitude: 22.7196, longitude: 75.8577, country: 'India', admin1: 'Madhya Pradesh' },
    { id: 5, name: 'Guntur', latitude: 16.3067, longitude: 80.4365, country: 'India', admin1: 'Andhra Pradesh' },
    { id: 6, name: 'Karnal', latitude: 29.6857, longitude: 76.9905, country: 'India', admin1: 'Haryana' },
    { id: 7, name: 'Rajkot', latitude: 22.3039, longitude: 70.8022, country: 'India', admin1: 'Gujarat' },
    { id: 8, name: 'Agra', latitude: 27.1767, longitude: 78.0081, country: 'India', admin1: 'Uttar Pradesh' },
  ];

  if (!query) return common;
  const filtered = common.filter(
    (c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      (c.admin1 && c.admin1.toLowerCase().includes(query.toLowerCase()))
  );
  return filtered.length > 0 ? filtered : common;
}

function getOfflineWeatherData(lat: number, lon: number, locationName?: string): WeatherData {
  const today = new Date();
  const times: string[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    times.push(d.toISOString().split('T')[0]);
  }

  const current = {
    time: today.toISOString(),
    temperature: 24.5,
    relativeHumidity: 65,
    apparentTemperature: 25.2,
    precipitation: 0.0,
    weatherCode: 1,
    windSpeed: 8.5,
    weatherDescription: 'Mainly Clear',
  };

  const daily = {
    time: times,
    weatherCode: [1, 2, 0, 1, 3, 61, 2],
    temperatureMax: [28.2, 29.0, 27.5, 28.8, 26.4, 25.0, 27.2],
    temperatureMin: [14.5, 15.0, 14.2, 16.1, 15.8, 14.0, 13.5],
    precipitationSum: [0.0, 0.0, 0.0, 1.2, 8.5, 12.0, 2.0],
    precipitationProbabilityMax: [5, 10, 0, 25, 65, 80, 30],
    windSpeedMax: [10.2, 12.0, 9.5, 14.8, 18.2, 22.0, 11.5],
  };

  const farmingAdvice = generateFarmingAdvice({
    currentTemp: current.temperature,
    currentHumidity: current.relativeHumidity,
    currentWindSpeed: current.windSpeed,
    currentPrecip: current.precipitation,
    maxTemp: 29.0,
    minTemp: 13.5,
    totalRainNext3Days: 1.2,
    maxWindSpeed: 14.8,
  });

  return {
    latitude: lat,
    longitude: lon,
    timezone: 'Asia/Kolkata',
    current,
    daily,
    farmingAdvice,
    locationName: locationName || 'District Agronomy Station',
  };
}
