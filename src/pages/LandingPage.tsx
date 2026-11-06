import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sprout,
  CloudSun,
  TrendingUp,
  BrainCircuit,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  BarChart3,
  MapPin,
  Calendar,
  Layers,
  Award,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { INITIAL_MANDI_PRICES } from '../services/mockData';

export const LandingPage: React.FC = () => {
  const [selectedCropFilter, setSelectedCropFilter] = useState('All');

  const filteredPrices =
    selectedCropFilter === 'All'
      ? INITIAL_MANDI_PRICES.slice(0, 6)
      : INITIAL_MANDI_PRICES.filter((p) => p.commodity === selectedCropFilter).slice(0, 6);

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Value Proposition */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-md border border-emerald-200/50">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Empowering 140M+ Indian Agricultural Households</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15] text-balance">
                Smart agricultural advisory & real-time mandi intelligence for Indian farmers.
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
                AgriConnect unites micro-weather forecasts, live APMC commodity prices, soil-matched
                crop recommendation algorithms, and verified agronomist consultations onto one unified,
                accessible platform.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link to="/register">
                  <Button size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                    Join as a Farmer
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" size="lg">
                    Explore Live Platform
                  </Button>
                </Link>
              </div>

              {/* Trust Metrics Adjacency */}
              <div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-100 text-slate-700">
                <div>
                  <div className="text-2xl font-bold text-slate-900 tabular-nums">2,800+</div>
                  <div className="text-xs text-slate-500 mt-0.5">APMC Mandis Covered</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900 tabular-nums">7-Day</div>
                  <div className="text-xs text-slate-500 mt-0.5">Agro-Weather Radar</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900 tabular-nums">100%</div>
                  <div className="text-xs text-slate-500 mt-0.5">Certified Agronomists</div>
                </div>
              </div>
            </div>

            {/* Right Column: High-Fidelity Hero Image Asset */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-md aspect-16/10 lg:aspect-4/3 bg-slate-100">
                <img
                  src="/src/assets/images/hero_indian_agriculture_1793855342621.jpg"
                  alt="Lush green Indian agricultural farmland with terraced fields at sunrise"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent flex items-end p-6">
                  <div className="text-white space-y-1">
                    <p className="text-xs font-semibold text-emerald-300">Live Field Radar</p>
                    <p className="text-sm font-medium">Precision Irrigation & Mandi Timing</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Core Pillars Section */}
      <section id="overview" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-2">
            Integrated Agricultural Ecosystem
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Bridging the gap between field soil, market prices, and expert science.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Weather */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-xs hover:border-slate-300 transition-all space-y-3">
            <div className="w-10 h-10 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center">
              <CloudSun className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-slate-900">Hyper-Local Weather</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              7-day rainfall, wind velocity, and temperature forecasts mapped directly to automated
              farming rules for spraying and irrigation.
            </p>
            <div className="pt-2 text-xs font-medium text-emerald-700 flex items-center gap-1">
              <span>Rule-based spray advice</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 2: Market Prices */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-xs hover:border-slate-300 transition-all space-y-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-slate-900">Daily Mandi Prices</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Real-time daily modal, min, and max commodity prices from Agmarknet APMC markets
              across India with trends and price comparison.
            </p>
            <div className="pt-2 text-xs font-medium text-emerald-700 flex items-center gap-1">
              <span>Verified modal rates</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 3: Crop Recommendation */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-xs hover:border-slate-300 transition-all space-y-3">
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-slate-900">Crop Recommendation</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Algorithmic scoring of 25+ crops evaluating soil texture, seasonal windows,
              rainfall, thermal bands, and pH for optimal yield.
            </p>
            <div className="pt-2 text-xs font-medium text-emerald-700 flex items-center gap-1">
              <span>5-parameter matching</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 4: Ask Experts */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-xs hover:border-slate-300 transition-all space-y-3">
            <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
              <HelpCircle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-slate-900">Ask Certified Experts</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Direct access to registered agricultural scientists and university agronomists for
              crop disease diagnostics and pest management.
            </p>
            <div className="pt-2 text-xs font-medium text-emerald-700 flex items-center gap-1">
              <span>Verified expert replies</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </section>

      {/* Visual Feature Spotlight (Bento Strip) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-xl overflow-hidden border border-slate-200 bg-white shadow-xs">
            <div className="h-48 overflow-hidden bg-slate-100">
              <img
                src="/src/assets/images/feature_crop_field_1793855343032.jpg"
                alt="Healthy crop field in rural India during golden hour"
                className="w-full h-full object-cover hover:scale-102 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="p-5 space-y-2">
              <h4 className="text-sm font-bold text-slate-900">Farm & Activity Tracking</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Log sowing, fertilizer dosage, irrigation cycles, and weeding costs with complete historical timelines.
              </p>
            </div>
          </div>

          <div className="rounded-xl overflow-hidden border border-slate-200 bg-white shadow-xs">
            <div className="h-48 overflow-hidden bg-slate-100">
              <img
                src="/src/assets/images/feature_mandi_market_1793855343270.jpg"
                alt="Indian APMC Mandi market with sacks of grain"
                className="w-full h-full object-cover hover:scale-102 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="p-5 space-y-2">
              <h4 className="text-sm font-bold text-slate-900">Mandi Price Discovery</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Compare price spreads across nearby mandis before transporting your harvest to maximize farm-gate returns.
              </p>
            </div>
          </div>

          <div className="rounded-xl overflow-hidden border border-slate-200 bg-white shadow-xs">
            <div className="h-48 overflow-hidden bg-slate-100">
              <img
                src="/src/assets/images/feature_agri_expert_1793855343395.jpg"
                alt="Indian agricultural scientist agronomist inspecting plants"
                className="w-full h-full object-cover hover:scale-102 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="p-5 space-y-2">
              <h4 className="text-sm font-bold text-slate-900">Agronomist Knowledge Network</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Get specific dosage guidelines for organic extracts and registered chemicals from certified specialists.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Live Mandi Ticker Preview */}
      <section id="market" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
                <BarChart3 className="w-4 h-4" />
                <span>Live APMC Market Benchmark</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">Today's Mandi Commodity Arrival Rates</h3>
            </div>
            <div className="flex items-center gap-2">
              {['All', 'Wheat', 'Tomato', 'Onion', 'Cotton'].map((crop) => (
                <button
                  key={crop}
                  onClick={() => setSelectedCropFilter(crop)}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                    selectedCropFilter === crop
                      ? 'bg-emerald-600 text-white font-semibold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {crop}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPrices.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-lg border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition-colors space-y-2"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{item.commodity}</h4>
                    <p className="text-xs text-slate-500">{item.variety}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-bold text-emerald-700 tabular-nums">
                      ₹{item.modalPrice.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-slate-400 block">per Quintal</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-200/50">
                  <span className="truncate">{item.market}</span>
                  <span className="shrink-0">{item.state}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center pt-2">
            <Link to="/market">
              <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                View Full Interactive Mandi Directory & Price Charts
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 3-Step Workflow Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-2">
            Simple 3-Step Workflow
          </p>
          <h2 className="text-2xl font-bold text-slate-900">How AgriConnect Works for You</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center mx-auto text-base">
              1
            </div>
            <h4 className="text-base font-semibold text-slate-900">Register Your Farm</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Add your farm acreage, soil type, and location coordinates to receive tailored agro-weather forecasts and crop suitability scores.
            </p>
          </div>

          <div className="text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center mx-auto text-base">
              2
            </div>
            <h4 className="text-base font-semibold text-slate-900">Monitor Conditions & Mandis</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Check daily rain alerts and compare mandi rates in your district before scheduling harvests, fertilizer applications, or sales.
            </p>
          </div>

          <div className="text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center mx-auto text-base">
              3
            </div>
            <h4 className="text-base font-semibold text-slate-900">Consult Verified Agronomists</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Post query photos and descriptions regarding pest infestations or nutrient deficiencies to get solutions within hours.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-emerald-800 text-white rounded-2xl p-8 sm:p-12 text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight max-w-2xl mx-auto">
            Ready to upgrade your farm intelligence and market decision-making?
          </h2>
          <p className="text-emerald-100 text-sm max-w-xl mx-auto leading-relaxed">
            Join thousands of progressive Indian growers and certified agronomists on AgriConnect today. Free registration for farmers.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link to="/register">
              <Button size="lg" variant="secondary">
                Register as Farmer
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" className="bg-emerald-700 hover:bg-emerald-600 text-white border border-emerald-500">
                Log In to Platform
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
