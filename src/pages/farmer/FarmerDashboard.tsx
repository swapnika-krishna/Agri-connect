import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Tractor,
  Layers,
  Activity as ActivityIcon,
  HelpCircle,
  CloudSun,
  TrendingUp,
  Plus,
  ArrowRight,
  Wind,
  Droplets,
  Thermometer,
  ShieldAlert,
  Calendar,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { farmService } from '../../services/farmService';
import { activityService } from '../../services/activityService';
import { queryService } from '../../services/queryService';
import { weatherService } from '../../services/weatherService';
import { marketService } from '../../services/marketService';
import { Farm, Activity, Query, WeatherData, MandiPrice } from '../../types';
import { StatCard } from '../../components/common/StatCard';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';

export const FarmerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [farms, setFarms] = useState<Farm[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [queries, setQueries] = useState<Query[]>([]);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [marketPrices, setMarketPrices] = useState<MandiPrice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [farmsData, activitiesData, queriesData] = await Promise.all([
        farmService.getFarms(),
        activityService.getAllMyActivities(),
        queryService.getMyQueries(),
      ]);

      setFarms(farmsData);
      setActivities(activitiesData);
      setQueries(queriesData);

      // Fetch primary farm weather
      if (farmsData.length > 0) {
        const primary = farmsData[0];
        const wData = await weatherService.getWeather(
          primary.latitude,
          primary.longitude,
          `${primary.name} (${primary.district})`
        );
        setWeather(wData);
      } else {
        // Fallback default Indian weather
        const wData = await weatherService.getWeather(30.901, 75.8573, 'Ludhiana Agricultural Belt');
        setWeather(wData);
      }

      // Fetch market prices for farmer crops
      const cropsOfInterest = farmsData.flatMap((f) => f.currentCrops);
      const mRes = await marketService.getPrices();
      if (cropsOfInterest.length > 0) {
        const matching = mRes.data.filter((p) =>
          cropsOfInterest.some((c) => p.commodity.toLowerCase().includes(c.toLowerCase()))
        );
        setMarketPrices(matching.length > 0 ? matching.slice(0, 4) : mRes.data.slice(0, 4));
      } else {
        setMarketPrices(mRes.data.slice(0, 4));
      }
    } catch (err) {
      console.error('Error loading dashboard data', err);
    } finally {
      setIsLoading(false);
    }
  };

  const totalAcres = farms.reduce((sum, f) => sum + (Number(f.sizeInAcres) || 0), 0);
  const openQueriesCount = queries.filter((q) => q.status === 'Open').length;

  return (
    <div className="space-y-6">
      {/* Top Greeting & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800">
            <span>Kisan Dashboard</span>
            <span>·</span>
            <span>{user?.district || 'India'}, {user?.state || ''}</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-0.5">
            Namaste, {user?.name || 'Farmer'}!
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Here is your daily agricultural overview, weather alerts, and market price movements.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link to="/farms">
            <Button size="sm" variant="outline" leftIcon={<Tractor className="w-3.5 h-3.5" />}>
              Manage Farms
            </Button>
          </Link>
          <Link to="/queries">
            <Button size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />}>
              Ask an Expert
            </Button>
          </Link>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Farms"
          value={farms.length}
          subtitle={`${totalAcres.toFixed(1)} Total Acres Cultivated`}
          icon={<Tractor className="w-5 h-5" />}
        />
        <StatCard
          title="Total Acreage"
          value={`${totalAcres.toFixed(1)} Ac`}
          subtitle="All registered parcels"
          icon={<Layers className="w-5 h-5" />}
        />
        <StatCard
          title="Activities Logged"
          value={activities.length}
          subtitle="Irrigation, sowing, sprays"
          icon={<ActivityIcon className="w-5 h-5" />}
        />
        <StatCard
          title="Pending Queries"
          value={openQueriesCount}
          subtitle={`${queries.length - openQueriesCount} Answered/Resolved`}
          icon={<HelpCircle className="w-5 h-5" />}
        />
      </div>

      {/* Weather Snapshot & Advisory Alert */}
      {weather && (
        <div className="bg-gradient-to-r from-emerald-900 to-teal-900 text-white rounded-xl p-6 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Current Conditions */}
            <div className="lg:col-span-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">
                  Live Farm Weather Radar
                </span>
                <span className="text-xs text-emerald-200 truncate">{weather.locationName}</span>
              </div>
              <div className="flex items-baseline gap-4">
                <span className="text-4xl sm:text-5xl font-extrabold tracking-tight tabular-nums">
                  {weather.current.temperature}°C
                </span>
                <div className="space-y-0.5">
                  <p className="text-sm font-semibold text-emerald-100">
                    {weather.current.weatherDescription}
                  </p>
                  <p className="text-xs text-emerald-300">
                    Feels like {weather.current.apparentTemperature}°C
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-6 pt-2 text-xs text-emerald-100">
                <div className="flex items-center gap-1.5">
                  <Droplets className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Humidity: {weather.current.relativeHumidity}%</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Wind className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Wind: {weather.current.windSpeed} km/h</span>
                </div>
              </div>
            </div>

            {/* Rule-Based Automated Farming Advice */}
            <div className="lg:col-span-7 bg-white/10 rounded-lg p-4 border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-emerald-200">
                <span>Agronomic Advisory for Today</span>
                <Link to="/weather" className="text-emerald-300 hover:underline flex items-center gap-1">
                  <span>Full 7-Day Forecast</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              <ul className="space-y-1.5 text-xs text-emerald-50">
                {weather.farmingAdvice.slice(0, 2).map((adv, i) => (
                  <li key={i} className="flex items-start gap-2 leading-relaxed">
                    <span className="text-emerald-400 font-bold shrink-0">·</span>
                    <span>{adv}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* 2-Column Section: Recent Activities & Market Rates */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Recent Activities */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Recent Field Activities</h3>
            <Link to="/farms" className="text-xs font-semibold text-emerald-700 hover:underline">
              View All Farms
            </Link>
          </div>

          <Card className="divide-y divide-slate-100 p-0">
            {activities.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                No farming activities logged yet.
                <div className="mt-2">
                  <Link to="/farms">
                    <Button size="sm" variant="outline">
                      Log First Farm Activity
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              activities.slice(0, 4).map((act) => (
                <div key={act._id || act.id} className="p-4 flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge
                        size="sm"
                        variant={
                          act.type === 'Sowing'
                            ? 'success'
                            : act.type === 'Fertilizer'
                            ? 'warning'
                            : act.type === 'Pesticide'
                            ? 'danger'
                            : 'info'
                        }
                      >
                        {act.type}
                      </Badge>
                      <span className="text-xs text-slate-400">{act.date}</span>
                    </div>
                    <p className="text-xs text-slate-700 leading-snug">{act.notes}</p>
                  </div>
                  {act.cost ? (
                    <div className="text-right shrink-0">
                      <span className="text-xs font-semibold text-slate-900 tabular-nums">
                        ₹{act.cost.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] text-slate-400 block">Expense</span>
                    </div>
                  ) : null}
                </div>
              ))
            )}
          </Card>
        </div>

        {/* Right: Mandi Commodity Prices */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Today's Mandi Rates</h3>
            <Link to="/market" className="text-xs font-semibold text-emerald-700 hover:underline">
              Mandi Directory
            </Link>
          </div>

          <Card className="space-y-3">
            {marketPrices.map((price) => (
              <div
                key={price.id}
                className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between gap-2"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{price.commodity}</h4>
                  <p className="text-[11px] text-slate-500 truncate max-w-[160px]">
                    {price.market} ({price.state})
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-sm font-bold text-emerald-700 tabular-nums">
                    ₹{price.modalPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-slate-400 block">₹{price.minPrice} - ₹{price.maxPrice}</span>
                </div>
              </div>
            ))}

            <div className="pt-2">
              <Link to="/crops/recommend" className="block">
                <Button size="sm" variant="outline" className="w-full text-xs">
                  Run AI Crop Recommendation
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
