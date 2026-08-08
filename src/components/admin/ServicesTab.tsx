'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  useGetServicesQuery,
  useCreateServiceAdminMutation,
  useUpdateServiceAdminMutation,
  useDeleteServiceAdminMutation,
} from '@/store/api/servicesApi';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  X,
  Search,
  Loader2,
} from 'lucide-react';

// Helper: auto-generate slug from title
const toSlug = (title: string) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');

export function ServicesTab() {
  const { data: servicesData, isLoading, refetch } = useGetServicesQuery(undefined);
  const [createService, { isLoading: isCreating }] = useCreateServiceAdminMutation();
  const [updateService, { isLoading: isUpdating }] = useUpdateServiceAdminMutation();
  const [deleteService, { isLoading: isDeleting }] = useDeleteServiceAdminMutation();

  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => { setMounted(true); }, []);

  // ── Match exact backend DTO field names ──────────────────────────
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    summary: '',
    description: '',
    priceStarting: 1500,
    iconName: '',
    imageUrl: '',
    isActive: true,
  });

  const services = Array.isArray(servicesData)
    ? servicesData
    : Array.isArray((servicesData as any)?.data)
    ? (servicesData as any).data
    : [];

  const filteredServices = services.filter((s: any) =>
    s.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const emptyForm = {
    title: '',
    slug: '',
    summary: '',
    description: '',
    priceStarting: 1500,
    iconName: '',
    imageUrl: '',
    isActive: true,
  };

  const handleOpenCreate = () => {
    setEditingService(null);
    setFormData(emptyForm);
    setSubmitError(null);
    setShowModal(true);
  };

  const handleOpenEdit = (service: any) => {
    setEditingService(service);
    setFormData({
      title: service.title || '',
      slug: service.slug || '',
      summary: service.summary || '',
      description: service.description || '',
      priceStarting: service.priceStarting || 1500,
      iconName: service.iconName || '',
      imageUrl: service.imageUrl || '',
      isActive: service.isActive ?? true,
    });
    setSubmitError(null);
    setShowModal(true);
  };

  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({
      ...prev,
      title,
      // Auto-fill slug only when creating (not editing existing slugs)
      ...(!editingService && { slug: toSlug(title) }),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    try {
      if (editingService) {
        await updateService({ id: editingService.id, data: formData }).unwrap();
        setSuccessMsg(`"${formData.title}" updated successfully!`);
      } else {
        await createService(formData).unwrap();
        setSuccessMsg(`"${formData.title}" created successfully!`);
      }
      setShowModal(false);
      refetch();
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      const msg = err?.data?.message || err?.data || 'Failed to save service. Please try again.';
      setSubmitError(Array.isArray(msg) ? msg.join(', ') : String(msg));
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await deleteService(deleteTarget.id).unwrap();
      setSuccessMsg(`"${deleteTarget.title}" deleted.`);
      setDeleteTarget(null);
      refetch();
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      setDeleteTarget(null);
      setSubmitError('Failed to delete service.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/80 p-4 rounded-2xl border border-slate-800 backdrop-blur-md">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-400" />
            <span>Pest Control Services ({services.length})</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Manage active service offerings, pricing, and feature highlights.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold rounded-xl flex items-center gap-2 text-sm transition shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Service</span>
        </button>
      </div>

      {/* Success Banner */}
      {successMsg && (
        <div className="p-4 bg-emerald-950/60 border border-emerald-800/80 rounded-2xl text-emerald-400 text-xs flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Search Filter */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search services by title or description..."
          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-11 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
        />
      </div>

      {/* Services Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center gap-2 py-12 text-slate-400">
          <Loader2 className="w-5 h-5 animate-spin text-amber-500" />
          <span>Loading services...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service: any) => (
            <div key={service.id} className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-4 hover:border-slate-700 transition flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    service.isActive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}>
                    {service.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <span className="text-amber-400 font-extrabold text-sm">
                    Rs. {service.priceStarting || 1500}+
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-1">{service.title}</h3>
                <p className="text-xs text-slate-500 italic mb-2">{service.summary}</p>
                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">{service.description}</p>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  onClick={() => handleOpenEdit(service)}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1 transition"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => setDeleteTarget(service)}
                  disabled={isDeleting}
                  className="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg text-xs font-semibold flex items-center gap-1 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Service"
        message={<>Are you sure you want to permanently delete <strong className="text-amber-400">{deleteTarget?.title}</strong>? This cannot be undone.</>}
        confirmLabel="Delete Service"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
        isLoading={isDeleting}
      />

      {/* Modal: Create / Edit Service — portal renders outside sidebar stacking context */}
      {showModal && mounted && createPortal(
        <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl p-6 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-400" />
              {editingService ? 'Edit Service' : 'Add New Service'}
            </h3>

            {/* Error Banner inside modal */}
            {submitError && (
              <div className="p-3 bg-rose-950/60 border border-rose-800/60 rounded-xl text-rose-400 text-xs">
                {submitError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Service Title <span className="text-rose-400">*</span></label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. Termite Extermination"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">URL Slug <span className="text-rose-400">*</span></label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="e.g. termite-extermination"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Summary (short) */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Short Summary <span className="text-rose-400">*</span></label>
                <input
                  type="text"
                  required
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  placeholder="One-line summary for cards and listings"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Description <span className="text-rose-400">*</span></label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed description of the service..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Starting Price (NPR)</label>
                <input
                  type="number"
                  value={formData.priceStarting}
                  onChange={(e) => setFormData({ ...formData, priceStarting: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Service Image URL</label>
                <input
                  type="text"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Active Toggle */}
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 accent-amber-500"
                />
                <span className="text-sm font-semibold text-slate-300">Service is Active</span>
              </label>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-slate-400 hover:text-white">Cancel</button>
                <button
                  type="submit"
                  disabled={isCreating || isUpdating}
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm transition flex items-center gap-2"
                >
                  {(isCreating || isUpdating) && <Loader2 className="w-4 h-4 animate-spin" />}
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      , document.body)}
    </div>
  );
}
