import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  HelpCircle,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Award,
} from 'lucide-react';
import { queryService } from '../../services/queryService';
import { Query } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { StatCard } from '../../components/common/StatCard';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';

export const ExpertDashboard: React.FC = () => {
  const { user } = useAuth();
  const [queries, setQueries] = useState<Query[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadQueries();
  }, []);

  const loadQueries = async () => {
    setIsLoading(true);
    try {
      const data = await queryService.getAllQueries();
      setQueries(data);
    } catch (err) {
      console.error('Failed to load expert queries', err);
    } finally {
      setIsLoading(false);
    }
  };

  const openQueries = queries.filter((q) => q.status === 'Open');
  const answeredQueries = queries.filter(
    (q) =>
      q.status === 'Answered' ||
      q.replies?.some((r) => r.expert?._id === user?._id || r.expert?.id === user?._id)
  );
  const resolvedQueries = queries.filter((q) => q.status === 'Resolved');

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800">
            <span>Specialist Advisory Portal</span>
            <span>·</span>
            <span>Certified Agronomist</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-0.5">
            Welcome, {user?.name || 'Dr. Specialist'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review incoming farmer queries, diagnose pathology symptoms, and recommend solutions.
          </p>
        </div>

        <Link to="/expert/queries">
          <Button size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
            Open Query Review Desk
          </Button>
        </Link>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Open Queries Awaiting Reply"
          value={openQueries.length}
          subtitle="Farmer questions needing diagnosis"
          icon={<Clock className="w-5 h-5 text-amber-600" />}
        />
        <StatCard
          title="Queries Answered"
          value={answeredQueries.length}
          subtitle="Specialist responses provided"
          icon={<HelpCircle className="w-5 h-5 text-emerald-600" />}
        />
        <StatCard
          title="Resolved Cases"
          value={resolvedQueries.length}
          subtitle="Successfully closed farmer advisories"
          icon={<CheckCircle2 className="w-5 h-5 text-sky-600" />}
        />
      </div>

      {/* Urgent Queries Queue */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">
            Pending Farmer Inquiries Queue ({openQueries.length})
          </h3>
          <Link to="/expert/queries" className="text-xs font-semibold text-emerald-700 hover:underline">
            View All
          </Link>
        </div>

        {openQueries.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-xl border border-slate-200 text-xs text-slate-500">
            Great job! No unresolved open queries in your queue at this moment.
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 shadow-xs">
            {openQueries.map((q) => (
              <div
                key={q._id || q.id}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="warning" dot>
                      Pending Review
                    </Badge>
                    <span className="text-xs font-semibold text-slate-700">{q.category}</span>
                    <span className="text-slate-300">·</span>
                    <span className="text-xs text-slate-500">
                      Farmer: {q.farmer?.name} ({q.farmer?.district}, {q.farmer?.state})
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">{q.title}</h4>
                  <p className="text-xs text-slate-500 line-clamp-2 max-w-2xl">{q.description}</p>
                </div>

                <div className="shrink-0">
                  <Link to={`/queries/${q._id || q.id}`}>
                    <Button size="sm">
                      Diagnose & Reply
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
