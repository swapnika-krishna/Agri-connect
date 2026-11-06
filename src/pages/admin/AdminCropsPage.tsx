import React, { useState, useEffect } from 'react';
import {
  Database,
  Plus,
  Edit2,
  Trash2,
  Search,
  Sprout,
  CheckCircle2,
  Layers,
} from 'lucide-react';
import { cropService } from '../../services/cropService';
import { Crop, SoilType, CropSeason } from '../../types';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable, Column } from '../../components/common/DataTable';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Textarea } from '../../components/common/Textarea';
import { Badge } from '../../components/common/Badge';

const ALL_SOILS: SoilType[] = [
  'Alluvial',
  'Black',
  'Red',
  'Laterite',
  'Sandy',
  'Clay',
  'Loamy',
];

const ALL_SEASONS: CropSeason[] = ['Kharif', 'Rabi', 'Zaid'];

export const AdminCropsPage: React.FC = () => {
  const [crops, setCrops] = useState<Crop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCrop, setEditingCrop] = useState<Crop | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [selectedSoils, setSelectedSoils] = useState<SoilType[]>(['Alluvial']);
  const [selectedSeasons, setSelectedSeasons] = useState<CropSeason[]>(['Rabi']);
  const [minRainfall, setMinRainfall] = useState(400);
  const [maxRainfall, setMaxRainfall] = useState(850);
  const [minTemp, setMinTemp] = useState(12);
  const [maxTemp, setMaxTemp] = useState(28);
  const [minPh, setMinPh] = useState(6.0);
  const [maxPh, setMaxPh] = useState(7.5);
  const [durationDays, setDurationDays] = useState(120);
  const [description, setDescription] = useState('');
  const [tips, setTips] = useState('');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    loadCrops();
  }, []);

  const loadCrops = async () => {
    setIsLoading(true);
    try {
      const data = await cropService.getCrops();
      setCrops(data);
    } catch (err) {
      console.error('Failed to load crops', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingCrop(null);
    setName('');
    setSelectedSoils(['Alluvial', 'Loamy']);
    setSelectedSeasons(['Rabi']);
    setMinRainfall(400);
    setMaxRainfall(800);
    setMinTemp(12);
    setMaxTemp(26);
    setMinPh(6.0);
    setMaxPh(7.5);
    setDurationDays(120);
    setDescription('');
    setTips('');
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (crop: Crop) => {
    setEditingCrop(crop);
    setName(crop.name);
    setSelectedSoils(crop.soilTypes);
    setSelectedSeasons(crop.seasons);
    setMinRainfall(crop.minRainfall);
    setMaxRainfall(crop.maxRainfall);
    setMinTemp(crop.minTemp);
    setMaxTemp(crop.maxTemp);
    setMinPh(crop.minPh);
    setMaxPh(crop.maxPh);
    setDurationDays(crop.durationDays);
    setDescription(crop.description);
    setTips(crop.tips);
    setFormError('');
    setIsModalOpen(true);
  };

  const toggleSoil = (s: SoilType) => {
    if (selectedSoils.includes(s)) {
      if (selectedSoils.length > 1) {
        setSelectedSoils(selectedSoils.filter((item) => item !== s));
      }
    } else {
      setSelectedSoils([...selectedSoils, s]);
    }
  };

  const toggleSeason = (sn: CropSeason) => {
    if (selectedSeasons.includes(sn)) {
      if (selectedSeasons.length > 1) {
        setSelectedSeasons(selectedSeasons.filter((item) => item !== sn));
      }
    } else {
      setSelectedSeasons([...selectedSeasons, sn]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setFormError('Crop name is required');
      return;
    }

    try {
      const cropPayload = {
        name,
        soilTypes: selectedSoils,
        seasons: selectedSeasons,
        minRainfall: Number(minRainfall),
        maxRainfall: Number(maxRainfall),
        minTemp: Number(minTemp),
        maxTemp: Number(maxTemp),
        minPh: Number(minPh),
        maxPh: Number(maxPh),
        durationDays: Number(durationDays),
        description,
        tips,
      };

      if (editingCrop) {
        await cropService.updateCrop(editingCrop._id || editingCrop.id || '', cropPayload);
      } else {
        await cropService.createCrop(cropPayload);
      }

      setIsModalOpen(false);
      loadCrops();
    } catch (err: any) {
      setFormError(err.message || 'Failed to save crop');
    }
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await cropService.deleteCrop(deleteTargetId);
      setDeleteTargetId(null);
      loadCrops();
    } catch (err) {
      console.error('Failed to delete crop', err);
    }
  };

  const filteredCrops = crops.filter((c) => {
    if (!searchTerm.trim()) return true;
    const s = searchTerm.toLowerCase();
    return (
      c.name.toLowerCase().includes(s) ||
      c.description.toLowerCase().includes(s) ||
      c.soilTypes.some((st) => st.toLowerCase().includes(s))
    );
  });

  const columns: Column<Crop>[] = [
    {
      header: 'Crop Name',
      accessorKey: 'name',
      sortable: true,
      cell: (c) => (
        <div>
          <span className="font-bold text-slate-900 block">{c.name}</span>
          <span className="text-[11px] text-slate-400 tabular-nums">{c.durationDays} Days duration</span>
        </div>
      ),
    },
    {
      header: 'Permitted Soils',
      cell: (c) => (
        <span className="text-xs text-slate-600 truncate max-w-[140px] block">
          {c.soilTypes.join(', ')}
        </span>
      ),
    },
    {
      header: 'Seasons',
      cell: (c) => (
        <div className="flex flex-wrap gap-1">
          {c.seasons.map((sn, i) => (
            <Badge key={i} size="sm" variant="neutral">
              {sn}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      header: 'Rainfall Band',
      align: 'right',
      cell: (c) => (
        <span className="text-xs tabular-nums text-slate-700">
          {c.minRainfall}-{c.maxRainfall} mm
        </span>
      ),
    },
    {
      header: 'Temp Band',
      align: 'right',
      cell: (c) => (
        <span className="text-xs tabular-nums text-slate-700">
          {c.minTemp}-{c.maxTemp} °C
        </span>
      ),
    },
    {
      header: 'pH Range',
      align: 'right',
      cell: (c) => (
        <span className="text-xs tabular-nums text-slate-700">
          {c.minPh}-{c.maxPh}
        </span>
      ),
    },
    {
      header: 'Actions',
      align: 'right',
      cell: (c) => (
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => handleOpenEdit(c)}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
            title="Edit crop entry"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setDeleteTargetId(c._id || c.id || '')}
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
            title="Delete crop entry"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Crops Knowledge Base Catalog"
        description="Configure agronomic constraints, thermal bands, and cultivation tips for AI recommendation."
        breadcrumbs={[
          { label: 'Admin Portal', href: '/admin' },
          { label: 'Manage Crops' },
        ]}
        action={
          <Button size="sm" onClick={handleOpenAdd} leftIcon={<Plus className="w-4 h-4" />}>
            Add New Crop Variety
          </Button>
        }
      />

      {/* Filter and search */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search crop name or soil type..."
            className="w-full text-xs rounded-lg border border-slate-300 py-2 pl-8 pr-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
        </div>

        <div className="text-xs text-slate-500">
          Catalog Varieties: <strong className="text-slate-900">{filteredCrops.length}</strong>
        </div>
      </div>

      {/* Crops Table */}
      <DataTable
        columns={columns}
        data={filteredCrops}
        keyExtractor={(c) => c._id || c.id || ''}
        isLoading={isLoading}
        emptyMessage="No crop varieties found."
      />

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCrop ? 'Edit Crop Definition' : 'Add New Crop to Knowledge Base'}
        description="Define agronomic thresholds utilized by the 5-parameter matching model."
        maxWidth="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {formError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
              {formError}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Crop Variety Name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Barley (Jau)"
            />
            <Input
              label="Life Cycle Duration (Days)"
              type="number"
              required
              value={durationDays}
              onChange={(e) => setDurationDays(parseInt(e.target.value) || 90)}
            />
          </div>

          {/* Soil selection pills */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Suitable Soil Profiles (Click to toggle)
            </label>
            <div className="flex flex-wrap gap-1.5">
              {ALL_SOILS.map((s) => {
                const isSelected = selectedSoils.includes(s);
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggleSoil(s)}
                    className={`text-xs px-2.5 py-1 rounded-md border transition-colors ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-semibold'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Season selection */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Cropping Seasons
            </label>
            <div className="flex gap-2">
              {ALL_SEASONS.map((sn) => {
                const isSelected = selectedSeasons.includes(sn);
                return (
                  <button
                    key={sn}
                    type="button"
                    onClick={() => toggleSeason(sn)}
                    className={`text-xs px-3 py-1 rounded-md border transition-colors ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-semibold'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {sn}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Thresholds */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <Input
              label="Min Rain (mm)"
              type="number"
              value={minRainfall}
              onChange={(e) => setMinRainfall(parseFloat(e.target.value) || 0)}
            />
            <Input
              label="Max Rain (mm)"
              type="number"
              value={maxRainfall}
              onChange={(e) => setMaxRainfall(parseFloat(e.target.value) || 0)}
            />
            <Input
              label="Min Temp (°C)"
              type="number"
              value={minTemp}
              onChange={(e) => setMinTemp(parseFloat(e.target.value) || 0)}
            />
            <Input
              label="Max Temp (°C)"
              type="number"
              value={maxTemp}
              onChange={(e) => setMaxTemp(parseFloat(e.target.value) || 0)}
            />
            <Input
              label="Min pH"
              type="number"
              step="0.1"
              value={minPh}
              onChange={(e) => setMinPh(parseFloat(e.target.value) || 0)}
            />
            <Input
              label="Max pH"
              type="number"
              step="0.1"
              value={maxPh}
              onChange={(e) => setMaxPh(parseFloat(e.target.value) || 0)}
            />
          </div>

          <Textarea
            label="General Description"
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Agronomic traits, water requirement, yield potential..."
          />

          <Textarea
            label="Cultivation & Pest Management Tips"
            rows={2}
            value={tips}
            onChange={(e) => setTips(e.target.value)}
            placeholder="Critical irrigation stages, spacing, fertilizer recommendations..."
          />

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {editingCrop ? 'Save Changes' : 'Create Crop Entry'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleDelete}
        title="Delete Crop Variety"
        message="Are you sure you want to remove this crop from the AI knowledge base? It will no longer be scored for recommendations."
        confirmText="Delete Crop"
      />
    </div>
  );
};
