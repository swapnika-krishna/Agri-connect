import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Sprout, Menu, X, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const PublicLayout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, role } = useAuth();

  const navLinks = [
    { label: 'Overview', href: '/#overview' },
    { label: 'Weather & Advisory', href: '/#weather' },
    { label: 'Mandi Prices', href: '/#market' },
    { label: 'Crop Advisory', href: '/#crops' },
    { label: 'Ask Experts', href: '/#experts' },
  ];

  const getDashboardLink = () => {
    if (role === 'admin') return '/admin';
    if (role === 'expert') return '/expert';
    return '/dashboard';
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Top Bar Contract: Brand Wordmark — 4-5 single-line Nav Links — 1 Primary Action */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xs border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single Brand element */}
          <Link
            to="/"
            className="flex items-center gap-2.5 text-slate-900 hover:opacity-90 transition-opacity whitespace-nowrap shrink-0"
          >
            <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-xs">
              <Sprout className="w-5 h-5" />
            </div>
            <div className="leading-tight">
              <span className="text-lg font-bold tracking-tight text-slate-900 block">
                AgriConnect
              </span>
            </div>
          </Link>

          {/* Zone 2: 4-5 concise single-line text links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="hover:text-emerald-700 transition-colors whitespace-nowrap shrink-0"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Zone 3: 1 Primary Action */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            {user ? (
              <Link
                to={getDashboardLink()}
                className="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors whitespace-nowrap shrink-0"
              >
                Go to Dashboard
              </Link>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link
                  to="/login"
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors whitespace-nowrap shrink-0"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors whitespace-nowrap shrink-0"
                >
                  Register Free
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu hamburger */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              {user ? (
                <Link
                  to={getDashboardLink()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 text-sm font-medium bg-emerald-600 text-white rounded-lg"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2 text-sm font-medium border border-slate-300 text-slate-700 rounded-lg"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2 text-sm font-medium bg-emerald-600 text-white rounded-lg"
                  >
                    Register Free
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Public Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Clean Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-white font-bold text-base">
                <Sprout className="w-5 h-5 text-emerald-400" />
                <span>AgriConnect India</span>
              </div>
              <p className="text-slate-400 leading-relaxed text-xs">
                Democratizing smart agricultural intelligence, hyper-local agro-weather advisories,
                daily mandi prices, and certified agronomist advisory for every Indian farming family.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-3">
                Farmer Services
              </h4>
              <ul className="space-y-2">
                <li><Link to="/weather" className="hover:text-emerald-400 transition-colors">Micro-Weather & Rain Radar</Link></li>
                <li><Link to="/market" className="hover:text-emerald-400 transition-colors">Agmarknet Mandi Commodity Rates</Link></li>
                <li><Link to="/crops/recommend" className="hover:text-emerald-400 transition-colors">AI Crop Recommendation</Link></li>
                <li><Link to="/queries" className="hover:text-emerald-400 transition-colors">Ask Certified Agri Experts</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-3">
                Expert & Administrative
              </h4>
              <ul className="space-y-2">
                <li><Link to="/login" className="hover:text-emerald-400 transition-colors">Agronomist Portal</Link></li>
                <li><Link to="/login" className="hover:text-emerald-400 transition-colors">Admin Governance Console</Link></li>
                <li><Link to="/register" className="hover:text-emerald-400 transition-colors">Apply as Agricultural Scientist</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-3">
                Data Attributions
              </h4>
              <p className="text-slate-400 text-xs leading-relaxed mb-2">
                Weather provided via Open-Meteo API. Mandi prices synthesized with Agmarknet / data.gov.in standards.
              </p>
              <div className="flex items-center gap-1.5 text-emerald-400 text-xs">
                <ShieldCheck className="w-4 h-4" />
                <span>Role-Based Access Protected</span>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500">
            <p>© 2026 AgriConnect. Dedicated to Indian Farmers.</p>
            <p className="text-xs">Built with React, Node.js, Tailwind CSS & Open Agriculture Data</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
