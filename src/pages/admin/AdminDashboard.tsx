import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Tractor,
  HelpCircle,
  Database,
  ShieldCheck,
  TrendingUp,
  Activity as ActivityIcon,
  CheckCircle2,
  Clock,
  ArrowRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from 'recharts';
import { adminService } from '../../services/adminService';
import { AdminStats } from '../../types';
import { PageHeader } from '../../components/common/PageHeader';
import { StatCard } from '../../components/common/StatCard';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setIsLoading(true);
    try {
      const data = await adminService.getStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to load admin stats', err);
    } finally {
      setIsLoading(false);
    }
  };

  const activityDistributionData = [
    { name: 'Farmers', count: stats?.totalFarmers || 0, fill: '#059669' },
    { name: 'Experts', count: stats?.totalExperts || 0, fill: '#0284c7' },
    { name: 'Farms Registered', count: stats?.totalFarms || 0, fill: '#d97706' },
    { name: 'All Queries', count: stats?.totalQueries || 0, fill: '#7c3aed' },
    { name: 'Crops Catalog', count: stats?.totalCrops || 0, fill: '#10b981' },
    { name: 'Logged Operations', count: stats?.totalActivities || 0, fill: '#f59e0b' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Platform Administration Console"
        description="AgriConnect operational metrics, user accounts governance, and crops database catalog."
        breadcrumbs={[
          { label: 'Admin Portal', href: '/admin' },
          { label: 'Overview' },
        ]}
        action={
          <div className="flex items-center gap-2">
            <Link to="/admin/users">
              <Button size="sm" variant="outline" leftIcon={<Users className="w-4 h-4" />}>
                Manage Users
              </Button>
            </Link>
            <Link to="/admin/crops">
              <Button size="sm" leftIcon={<Database className="w-4 h-4" />}>
                Manage Crops
              </Button>
            </Link>
          </div>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Registered Farmers"
          value={stats?.totalFarmers || 0}
          subtitle="Active landholders on platform"
          icon={<Users className="w-5 h-5 text-emerald-600" />}
        />
        <StatCard
          title="Certified Specialists"
          value={stats?.totalExperts || 0}
          subtitle="University agronomists & ICAR scientists"
          icon={<ShieldCheck className="w-5 h-5 text-sky-600" />}
        />
        <StatCard
          title="Open Farmer Queries"
          value={stats?.openQueries || 0}
          subtitle={`${stats?.resolvedQueries || 0} resolved to date`}
          icon={<Clock className="w-5 h-5 text-amber-600" />}
        />
        <StatCard
          title="Crops in AI Catalog"
          value={stats?.totalCrops || 0}
          subtitle="Varieties with agronomy rules"
          icon={<Database className="w-5 h-5 text-emerald-600" />}
        />
      </div>

      {/* Platform Activity Distribution Chart */}
      <Card
        header={
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900">
              Platform Entity Metrics Distribution
            </span>
            <span className="text-[11px] text-slate-500">Live system records</span>
          </div>
        }
      >
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={activityDistributionData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{ fontSize: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {activityDistributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Quick Navigation Panels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/admin/users"
          className="p-5 rounded-xl border border-slate-200 bg-white hover:border-emerald-500 hover:shadow-sm transition-all space-y-2"
        >
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-slate-900">Manage Users & Approvals</h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Activate or deactivate accounts, review agronomist credentials, and approve pending specialists.
          </p>
        </Link>

        <Link
          to="/admin/crops"
          className="p-5 rounded-xl border border-slate-200 bg-white hover:border-emerald-500 hover:shadow-sm transition-all space-y-2"
        >
          <div className="w-9 h-9 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center">
            <Database className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-slate-900">Curate Crops Database</h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Add new crops, adjust thermal and rainfall thresholds, and update cultivation agronomy tips.
          </p>
        </Link>

        <Link
          to="/admin/queries"
          className="p-5 rounded-xl border border-slate-200 bg-white hover:border-emerald-500 hover:shadow-sm transition-all space-y-2"
        >
          <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
            <HelpCircle className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-slate-900">Platform-Wide Inquiries</h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Monitor response latencies, inspect open disease outbreaks, and review advisory replies.
          </p>
        </Link>
      </div>
    </div>
  );
};
