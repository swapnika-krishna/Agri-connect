import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sprout, Lock, Mail, User as UserIcon, Phone, MapPin, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { Button } from '../components/common/Button';
import { UserRole } from '../types';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState<UserRole>('farmer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [state, setState] = useState('Punjab');
  const [district, setDistrict] = useState('Ludhiana');
  const [expertise, setExpertise] = useState<string[]>(['Crop Disease']);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [registeredPending, setRegisteredPending] = useState(false);

  const expertCategories = [
    'Crop Disease',
    'Pest Control',
    'Soil',
    'Irrigation',
    'Fertilizer',
    'Market',
    'Weather',
  ];

  const handleToggleCategory = (cat: string) => {
    if (expertise.includes(cat)) {
      setExpertise(expertise.filter((c) => c !== cat));
    } else {
      setExpertise([...expertise, cat]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await register({
        name,
        email,
        password,
        role,
        phone,
        state,
        district,
        expertise: role === 'expert' ? expertise : undefined,
      });

      if (role === 'expert') {
        setRegisteredPending(true);
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please check your information.');
    } finally {
      setIsLoading(false);
    }
  };

  if (registeredPending) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-sm space-y-4">
          <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Expert Application Received!</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Thank you, <strong>{name}</strong>. Your expert credentials have been logged in the system.
            An administrator will verify your agronomy credentials. You will be able to log in to the
            expert panel once approved.
          </p>
          <div className="pt-4">
            <Link to="/login">
              <Button size="md" className="w-full">
                Go to Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-lg text-center">
        <Link to="/" className="inline-flex items-center gap-2 mb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-xs">
            <Sprout className="w-6 h-6" />
          </div>
          <span className="text-xl font-bold text-slate-900">AgriConnect</span>
        </Link>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Create an AgriConnect account
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Join India's dedicated agricultural intelligence network
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          {/* Role selector tabs */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Select Your Role
            </label>
            <div className="grid grid-cols-2 gap-3 p-1 bg-slate-100 rounded-lg">
              <button
                type="button"
                onClick={() => setRole('farmer')}
                className={`py-2 px-3 text-xs font-semibold rounded-md transition-all ${
                  role === 'farmer'
                    ? 'bg-white text-emerald-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🌾 I am a Farmer
              </button>
              <button
                type="button"
                onClick={() => setRole('expert')}
                className={`py-2 px-3 text-xs font-semibold rounded-md transition-all ${
                  role === 'expert'
                    ? 'bg-white text-emerald-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🔬 Agricultural Expert
              </button>
            </div>
            {role === 'expert' && (
              <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 p-2 rounded-md mt-2">
                * Note: Agricultural Expert accounts are subject to administrative review before answering queries.
              </p>
            )}
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Gurpreet Singh"
              leftIcon={<UserIcon className="w-4 h-4" />}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Email Address"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                leftIcon={<Mail className="w-4 h-4" />}
              />
              <Input
                label="Phone Number"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                leftIcon={<Phone className="w-4 h-4" />}
              />
            </div>

            <Input
              label="Password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              leftIcon={<Lock className="w-4 h-4" />}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="State"
                value={state}
                onChange={(e) => setState(e.target.value)}
                options={[
                  'Punjab',
                  'Haryana',
                  'Maharashtra',
                  'Madhya Pradesh',
                  'Gujarat',
                  'Uttar Pradesh',
                  'Bihar',
                  'Rajasthan',
                  'Karnataka',
                  'Andhra Pradesh',
                  'Tamil Nadu',
                  'West Bengal',
                ]}
              />
              <Input
                label="District / Tehsil"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                placeholder="e.g. Ludhiana"
                leftIcon={<MapPin className="w-4 h-4" />}
              />
            </div>

            {/* Expert Specialization selection */}
            {role === 'expert' && (
              <div className="space-y-1.5 pt-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Areas of Expertise (Select applicable)
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {expertCategories.map((cat) => {
                    const isSelected = expertise.includes(cat);
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => handleToggleCategory(cat)}
                        className={`text-xs px-2.5 py-1 rounded-md border transition-colors ${
                          isSelected
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-semibold'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <Button
              type="submit"
              className="w-full mt-4"
              size="md"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              {role === 'expert' ? 'Submit Expert Registration' : 'Create Farmer Account'}
            </Button>
          </form>

          <div className="text-center text-xs text-slate-500 pt-2">
            Already registered?{' '}
            <Link to="/login" className="font-semibold text-emerald-600 hover:text-emerald-700">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
