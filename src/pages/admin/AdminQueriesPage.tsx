import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HelpCircle,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { queryService } from '../../services/queryService';
import { Query, QueryCategory } from '../../types';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable, Column } from '../../components/common/DataTable';
import { Badge } from '../../components/common/Badge';

export const AdminQueriesPage: React.FC = () => {
  const [queries, setQueries] = useState<Query[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
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
      console.error('Failed to load all queries', err);
    } finally {
      setIsLoading(false);
    }
  };

  const filtered = queries.filter((q) => {
    if (statusFilter !== 'All' && q.status !== statusFilter) return false;
    if (searchTerm.trim()) {
      const s = searchTerm.toLowerCase();
      return (
        q.title.toLowerCase().includes(s) ||
        q.category.toLowerCase().includes(s) ||
        (q.farmer?.name && q.farmer.name.toLowerCase().includes(s))
      );
    }
    return true;
  });

  const columns: Column<Query>[] = [
    {
      header: 'Query Title & Category',
      accessorKey: 'title',
      cell: (q) => (
        <div>
          <span className="font-bold text-slate-900 block hover:text-emerald-700">{q.title}</span>
          <span className="text-[11px] text-slate-500">
            {q.category} · {new Date(q.createdAt).toLocaleDateString()}
          </span>
        </div>
      ),
    },
    {
      header: 'Farmer Identity',
      cell: (q) => (
        <span className="text-xs text-slate-700">
          {q.farmer?.name || 'Farmer'} ({q.farmer?.district || 'India'})
        </span>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (q) => (
        <Badge
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
      ),
    },
    {
      header: 'Responses',
      align: 'right',
      cell: (q) => (
        <span className="text-xs font-semibold tabular-nums text-slate-700">
          {q.replies?.length || 0}
        </span>
      ),
    },
    {
      header: 'Actions',
      align: 'right',
      cell: (q) => (
        <button
          onClick={() => navigate(`/queries/${q._id || q.id}`)}
          className="text-xs font-semibold text-emerald-700 hover:underline inline-flex items-center gap-1"
        >
          <span>View Thread</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Platform Inquiries Governance"
        description="Monitor farmer advisory queries, resolution turnarounds, and expert participation."
        breadcrumbs={[
          { label: 'Admin Portal', href: '/admin' },
          { label: 'All Queries' },
        ]}
      />

      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search title, category or farmer..."
              className="w-full text-xs rounded-lg border border-slate-300 py-2 pl-8 pr-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-700">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs rounded-lg border border-slate-300 py-1.5 px-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="All">All Inquiries</option>
              <option value="Open">Open</option>
              <option value="Answered">Answered</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
        </div>

        <div className="text-xs text-slate-500">
          Total Queries: <strong className="text-slate-900">{filtered.length}</strong>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        keyExtractor={(q) => q._id || q.id || ''}
        isLoading={isLoading}
        onRowClick={(q) => navigate(`/queries/${q._id || q.id}`)}
        emptyMessage="No queries found matching the search criteria."
      />
    </div>
  );
};
