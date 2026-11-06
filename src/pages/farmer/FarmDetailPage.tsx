import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Tractor,
  Calendar,
  Clock,
  Plus,
  Trash2,
  Edit2,
  Droplets,
  CloudSun,
  MapPin,
  DollarSign,
  AlertCircle,
  ArrowLeft,
} from 'lucide-react';
import { farmService } from '../../services/farmService';
import { activityService, CreateActivityData } from '../../services/activityService';
import { Farm, Activity, ActivityType } from '../../types';
import { PageHeader } from '../../components/common/PageHeader';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Textarea } from '../../components/common/Textarea';
import { EmptyState } from '../../components/common/EmptyState';

const ACTIVITY_TYPES: ActivityType[] = [
  'Sowing',
  'Irrigation',
  'Fertilizer',
  'Pesticide',
  'Weeding',
  'Harvest',
  'Other',
];

export const FarmDetailPage: React.FC = () => {
  const { farmId } = useParams<{ farmId: string }>();
  const navigate = useNavigate();

  const [farm, setFarm] = useState<Farm | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [deleteActivityId, setDeleteActivityId] = useState<string | null>(null);

  // Activity Form State
  const [actType, setActType] = useState<ActivityType>('Irrigation');
  const [actDate, setActDate] = useState(new Date().toISOString().split('T')[0]);
  const [actNotes, setActNotes] = useState('');
  const [actCost, setActCost] = useState<number | ''>('');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (farmId) {
      loadFarmAndActivities(farmId);
    }
  }, [farmId]);

  const loadFarmAndActivities = async (id: string) => {
    setIsLoading(true);
    try {
      const f = await farmService.getFarmById(id);
      setFarm(f);
      const acts = await activityService.getActivitiesByFarm(id);
      setActivities(acts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    } catch (err) {
      console.error('Failed to load farm details', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenAddActivity = () => {
    setEditingActivity(null);
    setActType('Irrigation');
    setActDate(new Date().toISOString().split('T')[0]);
    setActNotes('');
    setActCost('');
    setFormError('');
    setIsActivityModalOpen(true);
  };

  const handleOpenEditActivity = (act: Activity) => {
    setEditingActivity(act);
    setActType(act.type);
    setActDate(act.date);
    setActNotes(act.notes);
    setActCost(act.cost || '');
    setFormError('');
    setIsActivityModalOpen(true);
  };

  const handleSaveActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!farmId) return;
    if (!actNotes.trim()) {
      setFormError('Please enter notes or description for this activity.');
      return;
    }

    try {
      const payload: CreateActivityData = {
        farm: farmId,
        type: actType,
        date: actDate,
        notes: actNotes,
        cost: actCost !== '' ? Number(actCost) : undefined,
      };

      if (editingActivity) {
        await activityService.updateActivity(
          editingActivity._id || editingActivity.id || '',
          payload
        );
      } else {
        await activityService.createActivity(payload);
      }

      setIsActivityModalOpen(false);
      loadFarmAndActivities(farmId);
    } catch (err: any) {
      setFormError(err.message || 'Failed to save activity');
    }
  };

  const handleDeleteActivity = async () => {
    if (!deleteActivityId || !farmId) return;
    try {
      await activityService.deleteActivity(deleteActivityId);
      setDeleteActivityId(null);
      loadFarmAndActivities(farmId);
    } catch (err) {
      console.error('Failed to delete activity', err);
    }
  };

  if (!farm && !isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-slate-500">Farm parcel not found.</p>
        <Link to="/farms" className="mt-4 inline-block text-emerald-700 font-semibold text-xs">
          Return to My Farms
        </Link>
      </div>
    );
  }

  const totalExpenditure = activities.reduce((sum, a) => sum + (a.cost || 0), 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title={farm?.name || 'Farm Details'}
        description={`Agricultural parcel in ${farm?.district}, ${farm?.state}`}
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'My Farms', href: '/farms' },
          { label: farm?.name || 'Detail' },
        ]}
        action={
          <div className="flex items-center gap-2">
            <Link to="/farms">
              <Button size="sm" variant="outline" leftIcon={<ArrowLeft className="w-4 h-4" />}>
                Back to Farms
              </Button>
            </Link>
            <Button
              size="sm"
              onClick={handleOpenAddActivity}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Log Activity
            </Button>
          </div>
        }
      />

      {/* Farm Overview Card */}
      {farm && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900">{farm.name}</h2>
              <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {farm.district}, {farm.state}
                </span>
                <span>·</span>
                <span>
                  GPS: {farm.latitude.toFixed(4)}°N, {farm.longitude.toFixed(4)}°E
                </span>
              </div>
            </div>

            <Link
              to={`/weather?lat=${farm.latitude}&lon=${farm.longitude}&name=${encodeURIComponent(
                farm.name
              )}`}
            >
              <Button size="sm" variant="outline" leftIcon={<CloudSun className="w-4 h-4" />}>
                View Micro-Weather
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                Total Area
              </span>
              <span className="text-base font-bold text-slate-900 tabular-nums">
                {farm.sizeInAcres} Acres
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                Soil Profile
              </span>
              <span className="text-base font-bold text-slate-900">{farm.soilType} Soil</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                Irrigation Source
              </span>
              <span className="text-base font-bold text-slate-900">{farm.waterSource}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                Logged Expense
              </span>
              <span className="text-base font-bold text-emerald-800 tabular-nums">
                ₹{totalExpenditure.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <div className="pt-2 flex items-center gap-2 text-xs">
            <span className="font-semibold text-slate-600">Active Crops:</span>
            <div className="flex flex-wrap gap-1.5">
              {farm.currentCrops.map((c, i) => (
                <span
                  key={i}
                  className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200/60 font-semibold"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Activity Timeline */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Activity Timeline & Logbook</h3>
            <p className="text-xs text-slate-500">
              Chronological log of sowing, sprays, irrigation runs, and costs
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={handleOpenAddActivity}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            Log Activity
          </Button>
        </div>

        {activities.length === 0 ? (
          <EmptyState
            icon={<Calendar className="w-8 h-8" />}
            title="No activities recorded for this farm"
            description="Log your daily agricultural operations to maintain an auditable track record of inputs, sprays, and expenses."
            actionText="Log First Activity"
            onAction={handleOpenAddActivity}
          />
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 shadow-xs">
            {activities.map((act) => (
              <div
                key={act._id || act.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4 hover:bg-slate-50/50 transition-colors"
              >
                <div className="flex items-start gap-3.5">
                  <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 shrink-0 mt-0.5">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge
                        size="sm"
                        variant={
                          act.type === 'Sowing'
                            ? 'success'
                            : act.type === 'Fertilizer'
                            ? 'warning'
                            : act.type === 'Pesticide'
                            ? 'danger'
                            : act.type === 'Irrigation'
                            ? 'info'
                            : 'neutral'
                        }
                      >
                        {act.type}
                      </Badge>
                      <span className="text-xs text-slate-500 font-medium">{act.date}</span>
                    </div>
                    <p className="text-xs text-slate-800 leading-relaxed max-w-2xl">{act.notes}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 sm:pl-4">
                  {act.cost ? (
                    <div className="text-right">
                      <span className="text-xs font-bold text-slate-900 tabular-nums block">
                        ₹{act.cost.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] text-slate-400">Expense</span>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400 italic">No cost</span>
                  )}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEditActivity(act)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
                      title="Edit activity"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteActivityId(act._id || act.id || '')}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      title="Delete activity"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Activity Modal */}
      <Modal
        isOpen={isActivityModalOpen}
        onClose={() => setIsActivityModalOpen(false)}
        title={editingActivity ? 'Edit Activity Entry' : 'Log Agricultural Activity'}
        description={`Record operational inputs for ${farm?.name}`}
        maxWidth="md"
      >
        <form onSubmit={handleSaveActivity} className="space-y-4">
          {formError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
              {formError}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Activity Type"
              required
              value={actType}
              onChange={(e) => setActType(e.target.value as ActivityType)}
              options={ACTIVITY_TYPES}
            />
            <Input
              label="Date"
              type="date"
              required
              value={actDate}
              onChange={(e) => setActDate(e.target.value)}
            />
          </div>

          <Textarea
            label="Notes & Observations"
            required
            rows={3}
            value={actNotes}
            onChange={(e) => setActNotes(e.target.value)}
            placeholder="e.g. Applied 45kg urea and zinc sulphate prior to irrigation. Checked for leaf yellowing."
            helperText="Include dosage, product names, or seed batch info"
          />

          <Input
            label="Incurred Cost (₹ INR, optional)"
            type="number"
            min="0"
            step="10"
            value={actCost}
            onChange={(e) => setActCost(e.target.value === '' ? '' : parseFloat(e.target.value))}
            placeholder="e.g. 2400"
          />

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsActivityModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {editingActivity ? 'Update Activity' : 'Save Activity Entry'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteActivityId}
        onClose={() => setDeleteActivityId(null)}
        onConfirm={handleDeleteActivity}
        title="Delete Activity Entry"
        message="Are you sure you want to delete this activity log? This cannot be undone."
        confirmText="Delete Entry"
      />
    </div>
  );
};
