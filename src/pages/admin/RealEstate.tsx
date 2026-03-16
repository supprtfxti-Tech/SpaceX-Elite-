import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, Search, Edit, Trash2, CheckCircle, XCircle, Plus } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import clsx from 'clsx';

interface RealEstateProperty {
  id: string;
  title: string;
  location: string;
  description: string;
  price: number;
  roi_percentage: number;
  status: string;
  image_url: string;
  created_at: string;
}

export default function AdminRealEstate() {
  const { token } = useAuthStore();
  const [properties, setProperties] = useState<RealEstateProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<RealEstateProperty | null>(null);
  const [actionType, setActionType] = useState<'create' | 'edit' | 'delete' | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    description: '',
    price: '',
    roi_percentage: '',
    status: 'available',
    image_url: ''
  });

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/real-estate', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch properties');
      const data = await res.json();
      setProperties(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [token]);

  const openModal = (type: 'create' | 'edit' | 'delete', property?: RealEstateProperty) => {
    setActionType(type);
    setSelectedProperty(property || null);
    if (type === 'edit' && property) {
      setFormData({
        title: property.title,
        location: property.location,
        description: property.description || '',
        price: property.price.toString(),
        roi_percentage: property.roi_percentage.toString(),
        status: property.status,
        image_url: property.image_url || ''
      });
    } else {
      setFormData({
        title: '',
        location: '',
        description: '',
        price: '',
        roi_percentage: '',
        status: 'available',
        image_url: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actionType) return;

    setActionLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      let url = '/api/admin/real-estate';
      let method = 'POST';
      let body: any = {
        ...formData,
        price: parseFloat(formData.price),
        roi_percentage: parseFloat(formData.roi_percentage)
      };

      if (actionType === 'edit' && selectedProperty) {
        url += `/${selectedProperty.id}`;
        method = 'PUT';
      } else if (actionType === 'delete' && selectedProperty) {
        url += `/${selectedProperty.id}`;
        method = 'DELETE';
        body = undefined;
      }

      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: body ? JSON.stringify(body) : undefined
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Action failed');

      setSuccessMsg(`Successfully ${actionType === 'create' ? 'created' : actionType === 'edit' ? 'updated' : 'deleted'} property.`);
      setIsModalOpen(false);
      fetchProperties();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Real Estate Management</h1>
            <p className="text-silver-400 text-sm">Manage properties and real estate investments</p>
          </div>
          <button 
            onClick={() => openModal('create')}
            className="flex items-center gap-2 px-4 py-2 bg-accent-600 hover:bg-accent-700 text-white rounded-lg font-medium transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Property
          </button>
        </div>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 flex items-center gap-2">
            <XCircle className="w-5 h-5" /> {error}
          </div>
        )}

        {successMsg && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 flex items-center gap-2">
            <CheckCircle className="w-5 h-5" /> {successMsg}
          </div>
        )}

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel rounded-2xl overflow-hidden"
        >
          <div className="p-6 border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-lg font-bold text-white">Properties</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-silver-500" />
              <input 
                type="text" 
                placeholder="Search properties..." 
                className="bg-graphite-900/50 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-accent-500 w-full md:w-64"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  <th className="px-6 py-4 text-xs font-medium text-silver-400 uppercase tracking-wider">Property</th>
                  <th className="px-6 py-4 text-xs font-medium text-silver-400 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-4 text-xs font-medium text-silver-400 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-4 text-xs font-medium text-silver-400 uppercase tracking-wider">ROI</th>
                  <th className="px-6 py-4 text-xs font-medium text-silver-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-medium text-silver-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-silver-400">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                      Loading properties...
                    </td>
                  </tr>
                ) : properties.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-silver-400">
                      No properties found.
                    </td>
                  </tr>
                ) : (
                  properties.map((prop) => (
                    <tr key={prop.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {prop.image_url ? (
                            <img src={prop.image_url} alt={prop.title} className="w-10 h-10 rounded-lg object-cover" />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-graphite-800 flex items-center justify-center border border-white/5 text-silver-400">
                              N/A
                            </div>
                          )}
                          <p className="text-sm font-medium text-white">{prop.title}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-silver-300">{prop.location}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-white">${prop.price.toLocaleString()}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-emerald-400">{prop.roi_percentage}%</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={clsx(
                          "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border",
                          prop.status === 'available' ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" : 
                          "text-red-400 bg-red-400/10 border-red-400/20"
                        )}>
                          {prop.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => openModal('edit', prop)}
                            className="p-2 hover:bg-blue-500/10 rounded-lg transition-colors text-silver-400 hover:text-blue-400"
                            title="Edit Property"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => openModal('delete', prop)}
                            className="p-2 hover:bg-red-500/10 rounded-lg transition-colors text-silver-400 hover:text-red-400"
                            title="Delete Property"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Action Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-graphite-900 border border-white/10 rounded-2xl p-6 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto"
              >
                <h3 className="text-xl font-bold text-white mb-6 capitalize">
                  {actionType === 'delete' ? 'Confirm Deletion' : `${actionType} Property`}
                </h3>

                <form onSubmit={handleAction} className="space-y-4">
                  {(actionType === 'create' || actionType === 'edit') && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-silver-300 mb-2">Title</label>
                        <input 
                          type="text"
                          value={formData.title}
                          onChange={(e) => setFormData({...formData, title: e.target.value})}
                          required
                          className="w-full bg-graphite-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-silver-300 mb-2">Location</label>
                        <input 
                          type="text"
                          value={formData.location}
                          onChange={(e) => setFormData({...formData, location: e.target.value})}
                          required
                          className="w-full bg-graphite-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-500"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-silver-300 mb-2">Price (USD)</label>
                          <input 
                            type="number"
                            value={formData.price}
                            onChange={(e) => setFormData({...formData, price: e.target.value})}
                            min="0"
                            step="0.01"
                            required
                            className="w-full bg-graphite-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-silver-300 mb-2">ROI (%)</label>
                          <input 
                            type="number"
                            value={formData.roi_percentage}
                            onChange={(e) => setFormData({...formData, roi_percentage: e.target.value})}
                            min="0"
                            step="0.01"
                            required
                            className="w-full bg-graphite-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-500"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-silver-300 mb-2">Status</label>
                        <select 
                          value={formData.status}
                          onChange={(e) => setFormData({...formData, status: e.target.value})}
                          className="w-full bg-graphite-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-500"
                        >
                          <option value="available">Available</option>
                          <option value="sold_out">Sold Out</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-silver-300 mb-2">Image URL</label>
                        <input 
                          type="url"
                          value={formData.image_url}
                          onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                          className="w-full bg-graphite-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-silver-300 mb-2">Description</label>
                        <textarea 
                          value={formData.description}
                          onChange={(e) => setFormData({...formData, description: e.target.value})}
                          rows={3}
                          className="w-full bg-graphite-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-500"
                        />
                      </div>
                    </>
                  )}

                  {actionType === 'delete' && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                      Warning: This action is irreversible. The property will be permanently deleted. Ensure there are no active investments linked to this property.
                    </div>
                  )}

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-medium transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={actionLoading}
                      className={clsx(
                        "flex-1 px-4 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2",
                        actionType === 'delete' 
                          ? "bg-red-600 hover:bg-red-500 text-white" 
                          : "bg-accent-600 hover:bg-accent-500 text-white",
                        actionLoading && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      {actionLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                      {actionType === 'delete' ? 'Delete' : 'Save'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </AdminLayout>
  );
}
