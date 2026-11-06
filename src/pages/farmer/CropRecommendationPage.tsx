import React, { useState, useEffect } from 'react';
import {
  BrainCircuit,
  Sparkles,
  Layers,
  Thermometer,
  CloudRain,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  Tractor,
} from 'lucide-react';
import { cropService } from '../../services/cropService';
import { farmService } from '../../services/farmService';
import { weatherService } from '../../services/weatherService';
import {
  SoilType,
  CropSeason,
  CropRecommendationInput,
  CropRecommendationResult,
  Farm,
} from '../../types';
import { PageHeader } from '../../components/common/PageHeader';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Badge } from '../../components/common/Badge';

const SOIL_TYPES: SoilType[] = [
  'Alluvial',
  'Black',
  'Red',
  'Laterite',
  'Sandy',
  'Clay',
  'Loamy',
];

const SEASONS: CropSeason[] = ['Kharif', 'Rabi', 'Zaid'];

export const CropRecommendationPage: React.FC = () => {
  const [farms, setFarms] = useState<Farm[]>([]);
  const [selectedFarmId, setSelectedFarmId] = useState<string>('');

  // Form State
  const [soilType, setSoilType] = useState<SoilType>('Alluvial');
  const [season, setSeason] = useState<CropSeason>('Rabi');
  const [rainfall, setRainfall] = useState<number>(550);
  const [temperature, setTemperature] = useState<number>(22);
  const [ph, setPh] = useState<number>(6.8);

  const [results, setResults] = useState<CropRecommendationResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasEvaluated, setHasEvaluated] = useState(false);

  useEffect(() => {
    loadFarms();
    // Run an initial recommendation on load with standard Rabi defaults
    handleRecommend();
  }, []);

  const loadFarms = async () => {
    try {
      const data = await farmService.getFarms();
      setFarms(data);
      if (data.length > 0) {
        setSelectedFarmId(data[0]._id || data[0].id || '');
      }
    } catch (err) {
      console.error('Failed to load farms for autofill', err);
    }
  };

  const handleAutofillFromFarm = async () => {
    const farm = farms.find((f) => f._id === selectedFarmId || f.id === selectedFarmId);
    if (!farm) return;

    setSoilType(farm.soilType);

    // Fetch weather for this farm to get actual forecast temp and rain
    try {
      const w = await weatherService.getWeather(farm.latitude, farm.longitude);
      setTemperature(Math.round(w.current.temperature));
      // Estimate seasonal rainfall based on daily rain sum
      const rainEstimate = Math.max(350, Math.round(w.current.relativeHumidity * 8));
      setRainfall(rainEstimate);
    } catch {
      // Keep sensible default
    }

    // Determine current Indian agricultural season based on month (Nov = Rabi)
    const month = new Date().getMonth(); // 0-indexed (Nov is 10)
    if (month >= 5 && month <= 9) {
      setSeason('Kharif'); // June - Oct
    } else if (month >= 10 || month <= 2) {
      setSeason('Rabi'); // Nov - March
    } else {
      setSeason('Zaid'); // April - May
    }
  };

  const handleRecommend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setHasEvaluated(true);
    try {
      const input: CropRecommendationInput = {
        soilType,
        season,
        rainfall: Number(rainfall),
        temperature: Number(temperature),
        ph: Number(ph),
      };
      const ranked = await cropService.recommendCrops(input);
      setResults(ranked);
    } catch (err) {
      console.error('Recommendation failed', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI-Assisted Crop Recommendation Engine"
        description="Scientific 5-parameter matching model analyzing soil texture, season window, rainfall, thermal band, and pH."
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Crop Recommendation' },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Input Form & 1-Click Autofill */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5">
          {/* Farm Autofill Strip */}
          {farms.length > 0 && (
            <div className="p-3 bg-emerald-50/70 border border-emerald-200/60 rounded-lg space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                  <Tractor className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Autofill from Saved Farm</span>
                </span>
                <button
                  type="button"
                  onClick={handleAutofillFromFarm}
                  className="font-semibold text-emerald-700 hover:underline"
                >
                  Apply to Form
                </button>
              </div>
              <select
                value={selectedFarmId}
                onChange={(e) => setSelectedFarmId(e.target.value)}
                className="w-full text-xs rounded border border-emerald-300 py-1.5 px-2 bg-white text-slate-800"
              >
                {farms.map((f) => (
                  <option key={f._id || f.id} value={f._id || f.id}>
                    {f.name} ({f.soilType} Soil, {f.district})
                  </option>
                ))}
              </select>
            </div>
          )}

          <form onSubmit={handleRecommend} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Soil Texture"
                value={soilType}
                onChange={(e) => setSoilType(e.target.value as SoilType)}
                options={SOIL_TYPES}
              />
              <Select
                label="Cropping Season"
                value={season}
                onChange={(e) => setSeason(e.target.value as CropSeason)}
                options={SEASONS}
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold text-slate-700">
                <span>Expected Rainfall:</span>
                <span className="text-emerald-700 tabular-nums">{rainfall} mm</span>
              </div>
              <input
                type="range"
                min="150"
                max="2000"
                step="50"
                value={rainfall}
                onChange={(e) => setRainfall(Number(e.target.value))}
                className="w-full accent-emerald-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>150 mm (Arid)</span>
                <span>1000 mm (Normal)</span>
                <span>2000 mm (Wet)</span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold text-slate-700">
                <span>Average Temperature:</span>
                <span className="text-emerald-700 tabular-nums">{temperature} °C</span>
              </div>
              <input
                type="range"
                min="8"
                max="44"
                step="1"
                value={temperature}
                onChange={(e) => setTemperature(Number(e.target.value))}
                className="w-full accent-emerald-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>8°C (Winter)</span>
                <span>25°C (Mild)</span>
                <span>44°C (Hot Summer)</span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold text-slate-700">
                <span>Soil pH Level:</span>
                <span className="text-emerald-700 tabular-nums">{ph} pH</span>
              </div>
              <input
                type="range"
                min="4.5"
                max="9.0"
                step="0.1"
                value={ph}
                onChange={(e) => setPh(Number(e.target.value))}
                className="w-full accent-emerald-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>4.5 (Acidic)</span>
                <span>7.0 (Neutral)</span>
                <span>9.0 (Alkaline)</span>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full mt-2"
              size="md"
              isLoading={isLoading}
              rightIcon={<BrainCircuit className="w-4 h-4" />}
            >
              Calculate Ranked Recommendations
            </Button>
          </form>
        </div>

        {/* Right Column: Ranked Crop Cards */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">
              Top 5 Recommended Crops for Input Parameters
            </h3>
            <span className="text-xs text-slate-500">Sorted by agronomic suitability %</span>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-32 bg-slate-200 animate-pulse rounded-xl" />
              ))}
            </div>
          ) : results.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500 bg-white rounded-xl border border-slate-200">
              No recommendations available. Please adjust your input parameters.
            </div>
          ) : (
            results.map((res, idx) => {
              const crop = res.crop;
              const isTopPick = idx === 0;

              return (
                <div
                  key={crop._id || crop.id || idx}
                  className={`bg-white rounded-xl border p-5 shadow-xs transition-all space-y-3 ${
                    isTopPick
                      ? 'border-emerald-500/80 ring-1 ring-emerald-500/20'
                      : 'border-slate-200/90'
                  }`}
                >
                  {/* Card Header with Rank & Match Score */}
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-md bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">
                          #{idx + 1}
                        </span>
                        <h4 className="text-base font-bold text-slate-900">{crop.name}</h4>
                        {isTopPick && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-600 text-white uppercase tracking-wider">
                            Best Match
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        {crop.description}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-2xl font-black text-emerald-700 tabular-nums">
                        {res.matchScore}%
                      </div>
                      <span className="text-[10px] uppercase font-semibold text-slate-400">
                        Suitability
                      </span>
                    </div>
                  </div>

                  {/* Duration and Requirements strip */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 py-2.5 px-3 bg-slate-50 rounded-lg text-xs">
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                        Duration
                      </span>
                      <span className="font-bold text-slate-800 tabular-nums">
                        {crop.durationDays} Days
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                        Rainfall
                      </span>
                      <span className="font-bold text-slate-800 tabular-nums">
                        {crop.minRainfall}-{crop.maxRainfall} mm
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                        Temp Band
                      </span>
                      <span className="font-bold text-slate-800 tabular-nums">
                        {crop.minTemp}-{crop.maxTemp} °C
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                        Soil pH
                      </span>
                      <span className="font-bold text-slate-800 tabular-nums">
                        {crop.minPh}-{crop.maxPh}
                      </span>
                    </div>
                  </div>

                  {/* Matched reasons breakdown */}
                  <div className="space-y-1.5 text-xs">
                    <span className="text-[11px] font-semibold text-slate-600">
                      Agronomic Match Factors:
                    </span>
                    <ul className="space-y-1 text-slate-600">
                      {res.matchedReasons.map((reason, rIdx) => (
                        <li key={rIdx} className="flex items-start gap-1.5 text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{reason}</span>
                        </li>
                      ))}
                      {res.unmatchedReasons.map((unreason, uIdx) => (
                        <li key={uIdx} className="flex items-start gap-1.5 text-[11px] text-amber-700">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                          <span>{unreason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Agronomist tip */}
                  {crop.tips && (
                    <div className="p-2.5 bg-amber-50/70 border border-amber-200/60 rounded-lg text-xs text-amber-900 flex items-start gap-2">
                      <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <span className="text-[11px] leading-relaxed">
                        <strong>Cultivation tip:</strong> {crop.tips}
                      </span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
