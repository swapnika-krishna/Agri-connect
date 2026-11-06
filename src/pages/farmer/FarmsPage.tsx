import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Tractor,
  Plus,
  Edit2,
  Trash2,
  MapPin,
  Layers,
  Droplets,
  Sprout,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { farmService, CreateFarmData } from '../../services/farmService';
import { Farm, SoilType, WaterSource } from '../../types';
import { PageHeader } from '../../components/common/PageHeader';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Badge } from '../../components/common/Badge';
import { EmptyState } from '../../components/common/EmptyState';

const SOIL_TYPES: SoilType[] = [
  'Alluvial',
  'Black',
  'Red',
  'Laterite',
  'Sandy',
  'Clay',
  'Loamy',
];

const WATER_SOURCES: WaterSource[] = [
  'Rainfed',
  'Borewell',
  'Canal',
  'River',
  'Tank',
];

export const FarmsPage: React.FC = () => {
  const [farms, setFarms] = useState<Farm[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFarm, setEditingFarm] = useState<Farm | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState<CreateFarmData>({
    name: '',
    state: 'Punjab',
    district: 'Ludhiana',
    latitude: 30.901,
    longitude: 75.8573,
    sizeInAcres: 5.0,
    soilType: 'Alluvial',
    waterSource: 'Borewell',
    currentCrops: ['Wheat'],
  });
  const [cropsInput, setCropsInput] = useState('Wheat');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    loadFarms();
  }, []);

  const loadFarms = async () => {
    setIsLoading(true);
    try {
      const data = await farmService.getFarms();
      setFarms(data);
    } catch (err) {
      console.error('Failed to load farms', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingFarm(null);
    setFormData({
      name: '',
      state: 'Punjab',
      district: 'Ludhiana',
      latitude: 30.901,
      longitude: 75.8573,
      sizeInAcres: 5.0,
      soilType: 'Alluvial',
      waterSource: 'Borewell',
      currentCrops: ['Wheat'],
    });
    setCropsInput('Wheat, Mustard');
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (farm: Farm, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingFarm(farm);
    setFormData({
      name: farm.name,
      state: farm.state,
      district: farm.district,
      latitude: farm.latitude,
      longitude: farm.longitude,
      sizeInAcres: farm.sizeInAcres,
      soilType: farm.soilType,
      waterSource: farm.waterSource,
      currentCrops: farm.currentCrops,
    });
    setCropsInput(farm.currentCrops.join(', '));
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setFormError('Farm name is required');
      return;
    }

    const currentCrops = cropsInput
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);

    try {
      if (editingFarm) {
        await farmService.updateFarm(editingFarm._id || editingFarm.id || '', {
          ...formData,
          currentCrops,
        });
      } else {
        await farmService.createFarm({
          ...formData,
          currentCrops,
        });
      }
      setIsModalOpen(false);
      loadFarms();
    } catch (err: any) {
      setFormError(err.message || 'Failed to save farm');
    }
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await farmService.deleteFarm(deleteTargetId);
      setDeleteTargetId(null);
      loadFarms();
    } catch (err) {
      console.error('Failed to delete farm', err);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Agricultural Farms"
        description="Manage your cultivated land parcels, soil profiles, water access, and crop cycles."
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'My Farms' },
        ]}
        action={
          <Button size="sm" onClick={handleOpenAdd} leftIcon={<Plus className="w-4 h-4" />}>
            Add New Farm
          </Button>
        }
      />

      {/* Farms Grid */}
      {farms.length === 0 && !isLoading ? (
        <EmptyState
          icon={<Tractor className="w-8 h-8" />}
          title="No farms registered yet"
          description="Add your agricultural plots to unlock hyper-local weather alerts, crop recommendations, and activity tracking."
          actionText="Register First Farm"
          onAction={handleOpenAdd}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {farms.map((farm) => (
            <div
              key={farm._id || farm.id}
              onClick={() => navigate(`/farms/${farm._id || farm.id}`)}
              className="group bg-white rounded-xl border border-slate-200/90 shadow-xs hover:shadow-md hover:border-emerald-500/50 transition-all cursor-pointer p-5 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5">
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                      {farm.name}
                    </h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{farm.district}, {farm.state}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => handleOpenEdit(farm, e)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
                      title="Edit farm details"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteTargetId(farm._id || farm.id || '');
                      }}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      title="Delete farm"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Specs strip */}
                <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                      Size
                    </span>
                    <span className="font-bold text-slate-800 tabular-nums">
                      {farm.sizeInAcres} Acres
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                      Soil
                    </span>
                    <span className="font-bold text-slate-800">{farm.soilType}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                      Water
                    </span>
                    <span className="font-bold text-slate-800">{farm.waterSource}</span>
                  </div>
                </div>

                {/* Crops */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-semibold text-slate-500">Current Crops:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {farm.currentCrops.map((c, i) => (
                      <span
                        key={i}
                        className="text-xs px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200/50 font-medium"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* View Activity Timeline footer link */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-emerald-700 font-semibold">
                <span>View Activities & Weather</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Farm Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingFarm ? 'Edit Farm Parcel' : 'Register New Farm Parcel'}
        description="Enter agricultural specifications and GPS location for precision advisories."
        maxWidth="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {formError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
              {formError}
            </div>
          )}

          <Input
            label="Farm Parcel Name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Satluj Organic Plot"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="State"
              value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
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
              label="District / Block"
              required
              value={formData.district}
              onChange={(e) => setFormData({ ...formData, district: e.target.value })}
              placeholder="e.g. Ludhiana"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Size (in Acres)"
              type="number"
              step="0.1"
              min="0.1"
              required
              value={formData.sizeInAcres}
              onChange={(e) =>
                setFormData({ ...formData, sizeInAcres: parseFloat(e.target.value) || 0 })
              }
            />
            <Select
              label="Soil Type"
              value={formData.soilType}
              onChange={(e) =>
                setFormData({ ...formData, soilType: e.target.value as SoilType })
              }
              options={SOIL_TYPES}
            />
            <Select
              label="Water Source"
              value={formData.waterSource}
              onChange={(e) =>
                setFormData({ ...formData, waterSource: e.target.value as WaterSource })
              }
              options={WATER_SOURCES}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Latitude"
              type="number"
              step="0.0001"
              required
              value={formData.latitude}
              onChange={(e) =>
                setFormData({ ...formData, latitude: parseFloat(e.target.value) || 0 })
              }
              helperText="For precise micro-climate calculations"
            />
            <Input
              label="Longitude"
              type="number"
              step="0.0001"
              required
              value={formData.longitude}
              onChange={(e) =>
                setFormData({ ...formData, longitude: parseFloat(e.target.value) || 0 })
              }
              helperText="For Open-Meteo weather radar"
            />
          </div>

          <Input
            label="Current Crops (comma separated)"
            value={cropsInput}
            onChange={(e) => setCropsInput(e.target.value)}
            placeholder="e.g. Wheat, Mustard, Potato"
            helperText="Used to curate market commodity prices and farming alerts"
          />

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {editingFarm ? 'Save Changes' : 'Create Farm'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleDelete}
        title="Delete Farm Parcel"
        message="Are you sure you want to delete this farm parcel? All logged activities and spray histories for this plot will also be removed."
        confirmText="Delete Farm"
      />
    </div>
  );
};
