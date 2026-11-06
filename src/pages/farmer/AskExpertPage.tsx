import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  HelpCircle,
  Plus,
  Send,
  CheckCircle2,
  Clock,
  ArrowRight,
  Filter,
  ShieldCheck,
  Search,
} from 'lucide-react';
import { queryService, CreateQueryData } from '../../services/queryService';
import { farmService } from '../../services/farmService';
import { Query, QueryCategory, QueryStatus, Farm } from '../../types';
import { PageHeader } from '../../components/common/PageHeader';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Textarea } from '../../components/common/Textarea';
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

export const AskExpertPage: React.FC = () => {
  const [queries, setQueries] = useState<Query[]>([]);
  const [farms, setFarms] = useState<Farm[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const navigate = useNavigate();

  // New Query Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<QueryCategory>('Crop Disease');
  const [farmId, setFarmId] = useState<string>('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadQueriesAndFarms();
  }, []);

  const loadQueriesAndFarms = async () => {
    setIsLoading(true);
    try {
      const [queriesData, farmsData] = await Promise.all([
        queryService.getMyQueries(),
        farmService.getFarms(),
      ]);
      setQueries(queriesData);
      setFarms(farmsData);
      if (farmsData.length > 0) {
        setFarmId(farmsData[0]._id || farmsData[0].id || '');
      }
    } catch (err) {
      console.error('Failed to load queries', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenNewQuery = () => {
    setTitle('');
    setDescription('');
    setCategory('Crop Disease');
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSubmitQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setFormError('Please enter both title and detailed description.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: CreateQueryData = {
        title,
        description,
        category,
        farmId: farmId || undefined,
      };
      const created = await queryService.createQuery(payload);
      setIsModalOpen(false);
      loadQueriesAndFarms();
      navigate(`/queries/${created._id || created.id}`);
    } catch (err: any) {
      setFormError(err.message || 'Failed to submit query');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredQueries = queries.filter((q) => {
    if (filterCategory !== 'All' && q.category !== filterCategory) return false;
    if (filterStatus !== 'All' && q.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Consult Agricultural Specialists"
        description="Connect with registered university agronomists, soil scientists, and plant pathologists."
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Ask Expert' },
        ]}
        action={
          <Button size="sm" onClick={handleOpenNewQuery} leftIcon={<Plus className="w-4 h-4" />}>
            Post New Advisory Query
          </Button>
        }
      />

      {/* Filter Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-slate-700">Filter Category:</span>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="text-xs rounded-lg border border-slate-300 py-1.5 px-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <span className="text-xs font-semibold text-slate-700 ml-2">Status:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-xs rounded-lg border border-slate-300 py-1.5 px-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Open">Open</option>
            <option value="Answered">Answered</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>

        <div className="text-xs text-slate-500">
          Showing <strong>{filteredQueries.length}</strong> of {queries.length} queries
        </div>
      </div>

      {/* Queries List */}
      {filteredQueries.length === 0 ? (
        <EmptyState
          icon={<HelpCircle className="w-8 h-8" />}
          title="No advisory queries found"
          description="Have questions about plant disease, pest outbreaks, fertilizer dosage or market timing? Ask an expert agronomist."
          actionText="Ask First Query"
          onAction={handleOpenNewQuery}
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
                      {replyCount} {replyCount === 1 ? 'Expert Reply' : 'Expert Replies'}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {replyCount > 0 ? 'Click to read' : 'Awaiting specialist'}
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Post Query Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Post Agricultural Query to Experts"
        description="Registered university and ICAR specialists will review and diagnose your query."
        maxWidth="lg"
      >
        <form onSubmit={handleSubmitQuery} className="space-y-4">
          {formError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
              {formError}
            </div>
          )}

          <Input
            label="Query Headline"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Yellow rust symptoms on HD-2967 wheat after first irrigation"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Primary Category"
              required
              value={category}
              onChange={(e) => setCategory(e.target.value as QueryCategory)}
              options={CATEGORIES}
            />
            {farms.length > 0 && (
              <Select
                label="Associated Farm Plot (Optional)"
                value={farmId}
                onChange={(e) => setFarmId(e.target.value)}
                options={farms.map((f) => ({
                  value: f._id || f.id || '',
                  label: `${f.name} (${f.soilType})`,
                }))}
              />
            )}
          </div>

          <Textarea
            label="Detailed Description & Field Symptoms"
            required
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the crop stage, visible lesions, leaf discoloration, recent fertilizer or spray history, and prevailing weather in your area..."
            helperText="Providing specific crop variety and days after sowing helps agronomists provide exact dosages."
          />

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting} rightIcon={<Send className="w-3.5 h-3.5" />}>
              Submit Query
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
