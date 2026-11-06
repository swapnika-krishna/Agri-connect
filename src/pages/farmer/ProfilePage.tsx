import React, { useState } from 'react';
import { User as UserIcon, Mail, Phone, MapPin, ShieldCheck, Check, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Badge } from '../../components/common/Badge';

export const ProfilePage: React.FC = () => {
  const { user, role, updateProfile } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [state, setState] = useState(user?.state || 'Punjab');
  const [district, setDistrict] = useState(user?.district || 'Ludhiana');
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setIsSaved(false);
    try {
      await updateProfile({
        name,
        phone,
        state,
        district,
      });
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (err) {
      console.error('Failed to update profile', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <PageHeader
        title="Profile & Account Settings"
        description="Update your contact information, regional state, and farming district."
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Profile' },
        ]}
      />

      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
        {/* User Identity Banner */}
        <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
          <div className="w-14 h-14 rounded-full bg-emerald-600 text-white font-bold text-xl flex items-center justify-center shrink-0">
            {user?.name ? user.name.charAt(0) : 'U'}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">{user?.name}</h2>
              <Badge variant="success" dot>
                {role === 'admin'
                  ? 'Administrator'
                  : role === 'expert'
                  ? 'Agricultural Scientist'
                  : 'Farmer'}
              </Badge>
            </div>
            <p className="text-xs text-slate-500">{user?.email}</p>
          </div>
        </div>

        {isSaved && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 font-semibold flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Profile settings saved successfully.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Email Address"
              disabled
              value={user?.email || ''}
              helperText="Email is permanently bound to your account"
            />
            <Input
              label="Contact Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
            />
          </div>

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
            />
          </div>

          {/* Expert Specializations Display */}
          {role === 'expert' && user?.expertise && (
            <div className="p-3 bg-slate-50 rounded-lg space-y-1">
              <span className="text-xs font-semibold text-slate-700 block">
                Agronomic Specialties:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {user.expertise.map((exp, i) => (
                  <Badge key={i} variant="neutral">
                    {exp}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="pt-4 flex justify-end">
            <Button type="submit" size="md" isLoading={isLoading}>
              Save Profile Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
