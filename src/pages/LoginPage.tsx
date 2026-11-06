import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Sprout, Lock, Mail, ArrowRight, ShieldCheck, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';

export const LoginPage: React.FC = () => {
  const { login, switchDemoRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('gurpreet.singh@agriconnect.org');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login({ email, password });
      const from = (location.state as any)?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Login failed. Please verify your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const setDemoCredentials = (demoEmail: string, role: 'farmer' | 'expert' | 'admin') => {
    setEmail(demoEmail);
    setPassword('password123');
    setError('');
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2 mb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-xs">
            <Sprout className="w-6 h-6" />
          </div>
          <span className="text-xl font-bold text-slate-900">AgriConnect</span>
        </Link>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Sign in to your account
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Access your farm records, weather advisories, and mandi rates
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. farmer@agriconnect.org"
              leftIcon={<Mail className="w-4 h-4" />}
            />

            <Input
              label="Password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              leftIcon={<Lock className="w-4 h-4" />}
            />

            <Button
              type="submit"
              className="w-full mt-2"
              size="md"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Sign In
            </Button>
          </form>

          {/* 1-Click Demo Logins */}
          <div className="pt-4 border-t border-slate-100">
            <p className="text-xs font-semibold text-slate-500 mb-2.5 text-center">
              Quick 1-Click Demo Profiles:
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  switchDemoRole('farmer');
                  navigate('/dashboard');
                }}
                className="p-2 border border-slate-200 rounded-lg text-left hover:border-emerald-500 hover:bg-emerald-50/50 transition-colors"
              >
                <span className="block text-[11px] font-bold text-slate-800">🌾 Farmer</span>
                <span className="block text-[10px] text-slate-500 truncate">Gurpreet Singh</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  switchDemoRole('expert');
                  navigate('/expert');
                }}
                className="p-2 border border-slate-200 rounded-lg text-left hover:border-emerald-500 hover:bg-emerald-50/50 transition-colors"
              >
                <span className="block text-[11px] font-bold text-slate-800">🔬 Expert</span>
                <span className="block text-[10px] text-slate-500 truncate">Dr. Sharma</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  switchDemoRole('admin');
                  navigate('/admin');
                }}
                className="p-2 border border-slate-200 rounded-lg text-left hover:border-emerald-500 hover:bg-emerald-50/50 transition-colors"
              >
                <span className="block text-[11px] font-bold text-slate-800">⚡ Admin</span>
                <span className="block text-[10px] text-slate-500 truncate">Dr. Virendra</span>
              </button>
            </div>
          </div>

          <div className="text-center text-xs text-slate-500 pt-2">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-semibold text-emerald-600 hover:text-emerald-700">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
