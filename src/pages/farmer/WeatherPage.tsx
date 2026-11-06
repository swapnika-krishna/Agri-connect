import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  CloudSun,
  Search,
  MapPin,
  Droplets,
  Wind,
  Thermometer,
  ShieldAlert,
  ArrowRight,
  Calendar,
  CloudRain,
  Sun,
  RefreshCw,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { weatherService, GeocodeResult } from '../../services/weatherService';
import { farmService } from '../../services/farmService';
import { WeatherData, Farm } from '../../types';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Skeleton } from '../../components/common/Skeleton';

export const WeatherPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [farms, setFarms] = useState<Farm[]>([]);
  const [selectedFarmId, setSelectedFarmId] = useState<string>('custom');
  const [searchQuery, setSearchQuery] = useState('');
  const [geocodeResults, setGeocodeResults] = useState<GeocodeResult[]>([]);
  const [isSearchingGeocode, setIsSearchingGeocode] = useState(false);

  const [currentLat, setCurrentLat] = useState(30.901);
  const [currentLon, setCurrentLon] = useState(75.8573);
  const [currentLocName, setCurrentLocName] = useState('Ludhiana, Punjab');

  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize from search params or primary farm
  useEffect(() => {
    initWeather();
  }, []);

  const initWeather = async () => {
    setIsLoading(true);
    try {
      const userFarms = await farmService.getFarms();
      setFarms(userFarms);

      const paramLat = searchParams.get('lat');
      const paramLon = searchParams.get('lon');
      const paramName = searchParams.get('name');

      if (paramLat && paramLon) {
        const lat = parseFloat(paramLat);
        const lon = parseFloat(paramLon);
        setCurrentLat(lat);
        setCurrentLon(lon);
        setCurrentLocName(paramName || 'Selected Location');
        await fetchWeather(lat, lon, paramName || 'Selected Location');
      } else if (userFarms.length > 0) {
        const primary = userFarms[0];
        setSelectedFarmId(primary._id || primary.id || '');
        setCurrentLat(primary.latitude);
        setCurrentLon(primary.longitude);
        setCurrentLocName(`${primary.name} (${primary.district})`);
        await fetchWeather(primary.latitude, primary.longitude, `${primary.name} (${primary.district})`);
      } else {
        await fetchWeather(currentLat, currentLon, currentLocName);
      }
    } catch (err) {
      console.error('Error initializing weather page', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchWeather = async (lat: number, lon: number, name: string) => {
    setIsLoading(true);
    try {
      const data = await weatherService.getWeather(lat, lon, name);
      setWeatherData(data);
    } catch (err) {
      console.error('Failed to fetch weather', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectFarm = (farmId: string) => {
    setSelectedFarmId(farmId);
    if (farmId === 'custom') return;
    const farm = farms.find((f) => f._id === farmId || f.id === farmId);
    if (farm) {
      setCurrentLat(farm.latitude);
      setCurrentLon(farm.longitude);
      const name = `${farm.name} (${farm.district})`;
      setCurrentLocName(name);
      fetchWeather(farm.latitude, farm.longitude, name);
    }
  };

  const handleGeocodeSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearchingGeocode(true);
    try {
      const results = await weatherService.geocode(searchQuery);
      setGeocodeResults(results);
    } catch (err) {
      console.error('Geocode search failed', err);
    } finally {
      setIsSearchingGeocode(false);
    }
  };

  const handleSelectLocation = (loc: GeocodeResult) => {
    setSelectedFarmId('custom');
    setCurrentLat(loc.latitude);
    setCurrentLon(loc.longitude);
    const name = `${loc.name}, ${loc.admin1 || loc.country}`;
    setCurrentLocName(name);
    setGeocodeResults([]);
    setSearchQuery('');
    fetchWeather(loc.latitude, loc.longitude, name);
  };

  // Format 7-day data for charts
  const forecastChartData = weatherData?.daily?.time?.map((t, idx) => ({
    date: new Date(t).toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' }),
    maxTemp: weatherData.daily.temperatureMax[idx],
    minTemp: weatherData.daily.temperatureMin[idx],
    rainMm: weatherData.daily.precipitationSum[idx] || 0,
    rainProb: weatherData.daily.precipitationProbabilityMax[idx] || 0,
    windMax: weatherData.daily.windSpeedMax[idx] || 0,
  })) || [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Agro-Weather Radar & Advisories"
        description="Location-accurate 7-day forecasts and rule-based agricultural spraying/irrigation guidance."
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Weather & Advisory' },
        ]}
        action={
          <Button
            size="sm"
            variant="outline"
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            onClick={() => fetchWeather(currentLat, currentLon, currentLocName)}
          >
            Refresh Forecast
          </Button>
        }
      />

      {/* Farm Selector & Location Search Controls */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Farm Parcel Selector */}
          <div className="md:col-span-5 flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-700 whitespace-nowrap">
              Saved Farm:
            </span>
            <select
              value={selectedFarmId}
              onChange={(e) => handleSelectFarm(e.target.value)}
              className="w-full text-xs rounded-lg border border-slate-300 py-2 px-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="custom">-- Select a Saved Farm parcel --</option>
              {farms.map((f) => (
                <option key={f._id || f.id} value={f._id || f.id}>
                  {f.name} ({f.district}, {f.state})
                </option>
              ))}
            </select>
          </div>

          <div className="hidden md:block md:col-span-1 text-center text-xs text-slate-400">
            or
          </div>

          {/* Search any Indian City / Village */}
          <div className="md:col-span-6">
            <form onSubmit={handleGeocodeSearch} className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search city, district or village (e.g. Nashik, Guntur, Karnal)..."
                  className="w-full text-xs rounded-lg border border-slate-300 py-2 pl-8 pr-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
              </div>
              <Button type="submit" size="sm" isLoading={isSearchingGeocode}>
                Search
              </Button>
            </form>
          </div>
        </div>

        {/* Geocode Search Results Dropdown */}
        {geocodeResults.length > 0 && (
          <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap gap-2">
            <span className="text-xs text-slate-500 self-center">Matching locations:</span>
            {geocodeResults.map((loc) => (
              <button
                key={loc.id}
                onClick={() => handleSelectLocation(loc)}
                className="text-xs px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition-colors flex items-center gap-1"
              >
                <MapPin className="w-3 h-3 text-emerald-600" />
                <span>
                  {loc.name}, {loc.admin1 || loc.country}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Weather Overview Card */}
      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <Skeleton className="lg:col-span-5 h-64" />
          <Skeleton className="lg:col-span-7 h-64" />
        </div>
      ) : weatherData ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Current Conditions Card */}
          <div className="lg:col-span-5 bg-gradient-to-br from-emerald-800 to-teal-900 text-white rounded-xl p-6 shadow-sm flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">
                  Current Field Climate
                </span>
                <span className="text-xs text-emerald-200 truncate">{weatherData.locationName}</span>
              </div>
              <div className="flex items-baseline gap-4 mt-3">
                <span className="text-5xl font-extrabold tracking-tight tabular-nums">
                  {weatherData.current.temperature}°C
                </span>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {weatherData.current.weatherDescription}
                  </h3>
                  <p className="text-xs text-emerald-200">
                    Apparent feels like {weatherData.current.apparentTemperature}°C
                  </p>
                </div>
              </div>
            </div>

            {/* Micro stats strip */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-emerald-700/50 text-xs">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1 text-emerald-300 text-[11px]">
                  <Droplets className="w-3.5 h-3.5" />
                  <span>Humidity</span>
                </div>
                <div className="text-base font-bold tabular-nums">
                  {weatherData.current.relativeHumidity}%
                </div>
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-1 text-emerald-300 text-[11px]">
                  <Wind className="w-3.5 h-3.5" />
                  <span>Wind Speed</span>
                </div>
                <div className="text-base font-bold tabular-nums">
                  {weatherData.current.windSpeed} km/h
                </div>
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-1 text-emerald-300 text-[11px]">
                  <CloudRain className="w-3.5 h-3.5" />
                  <span>Current Rain</span>
                </div>
                <div className="text-base font-bold tabular-nums">
                  {weatherData.current.precipitation} mm
                </div>
              </div>
            </div>

            <div className="text-[11px] text-emerald-300/80">
              Station coordinates: {weatherData.latitude.toFixed(3)}°N, {weatherData.longitude.toFixed(3)}°E ·
              Timezone: {weatherData.timezone}
            </div>
          </div>

          {/* Right: Agricultural Rule-Based Advisory Box */}
          <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider">
                <ShieldAlert className="w-4 h-4 text-emerald-600" />
                <span>Automated Agronomic Decision Rules</span>
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Actionable Field Guidance Based on 72-Hour Outlook
              </h3>
            </div>

            <div className="space-y-2.5">
              {weatherData.farmingAdvice.map((advice, i) => (
                <div
                  key={i}
                  className="p-3 bg-slate-50 border border-slate-100 rounded-lg flex items-start gap-3"
                >
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <p className="text-xs text-slate-700 leading-relaxed">{advice}</p>
                </div>
              ))}
            </div>

            <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100">
              * Guidance generated algorithmically from meteorological thresholds for Indian cropping conditions.
            </div>
          </div>
        </div>
      ) : null}

      {/* 7-Day Forecast Cards */}
      {weatherData && (
        <div className="space-y-3">
          <h3 className="text-base font-bold text-slate-900">7-Day Agro-Weather Outlook</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {forecastChartData.map((day, i) => (
              <div
                key={i}
                className={`p-3 rounded-xl border text-center transition-all ${
                  i === 0
                    ? 'bg-emerald-50/70 border-emerald-300 shadow-xs'
                    : 'bg-white border-slate-200/80 hover:border-slate-300'
                }`}
              >
                <span className="text-xs font-bold text-slate-800 block">{day.date}</span>
                <span className="text-[10px] text-slate-400 block mb-2">
                  {i === 0 ? 'Today' : `Day +${i}`}
                </span>

                <div className="py-2">
                  {day.rainMm > 5 ? (
                    <CloudRain className="w-6 h-6 text-sky-600 mx-auto" />
                  ) : day.maxTemp > 32 ? (
                    <Sun className="w-6 h-6 text-amber-500 mx-auto" />
                  ) : (
                    <CloudSun className="w-6 h-6 text-emerald-600 mx-auto" />
                  )}
                </div>

                <div className="text-xs font-bold text-slate-900 tabular-nums">
                  {day.maxTemp}° <span className="text-slate-400 font-normal">/ {day.minTemp}°</span>
                </div>

                <div className="mt-2 pt-2 border-t border-slate-100 space-y-0.5 text-[10px] text-slate-500">
                  <div className="flex items-center justify-between">
                    <span>Rain:</span>
                    <span className="font-semibold text-sky-700 tabular-nums">{day.rainMm}mm</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Wind:</span>
                    <span className="font-semibold text-slate-700 tabular-nums">{day.windMax}km/h</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Charts: Temperature & Rainfall Curves */}
      {weatherData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Temperature Trend */}
          <Card
            header={
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">7-Day Temperature Range (°C)</span>
                <span className="text-xs text-slate-500">Max vs Min</span>
              </div>
            }
          >
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={forecastChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis unit="°" tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ fontSize: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="maxTemp"
                    name="Max Temp (°C)"
                    stroke="#10b981"
                    fill="#d1fae5"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="minTemp"
                    name="Min Temp (°C)"
                    stroke="#0284c7"
                    fill="#e0f2fe"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Rainfall Expectation Bar Chart */}
          <Card
            header={
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">Precipitation Forecast (mm)</span>
                <span className="text-xs text-slate-500">Rainfall depth</span>
              </div>
            }
          >
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={forecastChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis unit="mm" tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ fontSize: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                  />
                  <Bar dataKey="rainMm" name="Rainfall (mm)" fill="#0284c7" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
