import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HelpCircle,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { queryService } from '../../services/queryService';
import { Query, QueryCategory } from '../../types';
import { PageHeader } from '../../components/common/PageHeader';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { EmptyState } from '../../components/common/EmptyState';

const CATEGORIES: QueryCategory[] = [
  'Crop Disease',
  'Pest Control',
  'Soil',
  'Irrigation',
  'Fertilizer',
  'Market',
  'Weather',
  'General',
];

export const ExpertQueriesPage: React.FC = () => {
  const [queries, setQueries] = useState<Query[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadQueries();
  }, []);

  const loadQueries = async () => {
    setIsLoading(true);
    try {
      const data = await queryService.getAllQueries();
      setQueries(data);
    } catch (err) {
      console.error('Failed to load queries', err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredQueries = queries.filter((q) => {
    if (categoryFilter !== 'All' && q.category !== categoryFilter) return false;
    if (statusFilter !== 'All' && q.status !== statusFilter) return false;
    if (search.trim()) {
      const s = search.toLowerCase();
      return (
        q.title.toLowerCase().includes(s) ||
        q.description.toLowerCase().includes(s) ||
        (q.farmer?.name && q.farmer.name.toLowerCase().includes(s))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Expert Query Review Desk"
        description="Filter queries by specialization, review symptoms, and submit recommendations."
        breadcrumbs={[
          { label: 'Dashboard', href: '/expert' },
          { label: 'Query Review Panel' },
        ]}
      />

      {/* Filter Controls */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search query keywords or farmer..."
              className="w-full text-xs rounded-lg border border-slate-300 py-2 pl-8 pr-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
          </div>

          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full text-xs rounded-lg border border-slate-300 py-2 px-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="All">All Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full text-xs rounded-lg border border-slate-300 py-2 px-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Open">Open (Pending Reply)</option>
              <option value="Answered">Answered</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
        </div>
      </div>

      {/* Query List */}
      {filteredQueries.length === 0 ? (
        <EmptyState
          icon={<HelpCircle className="w-8 h-8" />}
          title="No queries found"
          description="No agricultural queries match your current search and category filters."
        />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 shadow-xs">
          {filteredQueries.map((q) => {
            const replyCount = q.replies?.length || 0;
            return (
              <div
                key={q._id || q.id}
                onClick={() => navigate(`/queries/${q._id || q.id}`)}
                className="p-5 hover:bg-slate-50/70 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge
                      size="sm"
                      variant={
                        q.status === 'Resolved'
                          ? 'success'
                          : q.status === 'Answered'
                          ? 'info'
                          : 'warning'
                      }
                      dot
                    >
                      {q.status}
                    </Badge>
                    <span className="text-xs font-semibold text-slate-700">{q.category}</span>
                    <span className="text-slate-300">·</span>
                    <span className="text-xs text-slate-500">
                      Farmer: {q.farmer?.name || 'Anonymous'}
                    </span>
                    <span className="text-slate-300">·</span>
                    <span className="text-xs text-slate-400">
                      {new Date(q.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 hover:text-emerald-700 transition-colors">
                    {q.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 max-w-3xl leading-relaxed">
                    {q.description}
                  </p>
                </div>

                <div className="flex items-center gap-4 shrink-0 sm:pl-4">
                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-900 tabular-nums block">
                      {replyCount} {replyCount === 1 ? 'Reply' : 'Replies'}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {q.status === 'Open' ? 'Needs Advice' : 'Review Thread'}
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
