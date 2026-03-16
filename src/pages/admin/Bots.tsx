import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, Search, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import clsx from 'clsx';

interface Bot {
  id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  bot_type: string;
  status: string;
  strategy: string;
  pair: string;
  allocated_amount: number;
  profit_loss: number;
  created_at: string;
}

export default function AdminBots() {
  const { token } = useAuthStore();
  const [bots, setBots] = useState<Bot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [selectedBot, setSelectedBot] = useState<Bot | null>(null);
  const [actionType, setActionType] = useState<'status' | 'delete' | null>(null);
  const [actionValue, setActionValue] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchBots = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/bots', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch trading bots');
      const data = await res.json();
      setBots(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBots();
  }, [token]);

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBot || !actionType) return;

    setActionLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      let url = `/api/admin/bots/${selectedBot.id}`;
      let method = 'PUT';
      let body: any = {};

      if (actionType === 'status') {
        url += '/status';
        body = { status: actionValue };
      } else if (actionType === 'delete') {
        method = 'DELETE';
      }

      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: method !== 'DELETE' ? JSON.stringify(body) : undefined
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Action failed');

      setSuccessMsg(`Successfully updated trading bot.`);
      setActionType(null);
      setSelectedBot(null);
      fetchBots();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Trading Bots Management</h1>
          <p className="text-silver-400 text-sm">Monitor and manage user trading bots</p>
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
            <h2 className="text-lg font-bold text-white">Active Bots</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-silver-500" />
              <input 
                type="text" 
                placeholder="Search bots..." 
                className="bg-graphite-900/50 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-accent-500 w-full md:w-64"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  <th className="px-6 py-4 text-xs font-medium text-silver-400 uppercase tracking-wider">User</th>
                  <th className="px-6 py-4 text-xs font-medium text-silver-400 uppercase tracking-wider">Bot Type</th>
                  <th className="px-6 py-4 text-xs font-medium text-silver-400 uppercase tracking-wider">Pair & Strategy</th>
                  <th className="px-6 py-4 text-xs font-medium text-silver-400 uppercase tracking-wider">Allocated</th>
                  <th className="px-6 py-4 text-xs font-medium text-silver-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-medium text-silver-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-silver-400">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                      Loading bots...
                    </td>
                  </tr>
                ) : bots.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-silver-400">
                      No trading bots found.
                    </td>
                  </tr>
                ) : (
                  bots.map((bot) => (
                    <tr key={bot.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-white">{bot.user_name}</p>
                          <p className="text-xs text-silver-400">{bot.user_email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border text-blue-400 bg-blue-400/10 border-blue-400/20 capitalize">
                          {bot.bot_type.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-white">{bot.pair}</p>
                        <p className="text-xs text-silver-400 capitalize">{bot.strategy}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-white">${bot.allocated_amount.toLocaleString()}</p>
                        <p className={clsx("text-xs", bot.profit_loss >= 0 ? "text-emerald-400" : "text-red-400")}>
                          {bot.profit_loss >= 0 ? '+' : ''}${bot.profit_loss.toLocaleString()} P/L
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={clsx(
                          "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border",
                          bot.status === 'active' ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" : 
                          "text-silver-400 bg-silver-400/10 border-silver-400/20"
                        )}>
                          {bot.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => { setSelectedBot(bot); setActionType('status'); setActionValue(bot.status); }}
                            className="p-2 hover:bg-blue-500/10 rounded-lg transition-colors text-silver-400 hover:text-blue-400"
                            title="Change Status"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => { setSelectedBot(bot); setActionType('delete'); }}
                            className="p-2 hover:bg-red-500/10 rounded-lg transition-colors text-silver-400 hover:text-red-400"
                            title="Delete Bot"
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
          {actionType && selectedBot && (
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-graphite-900 border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl"
              >
                <h3 className="text-xl font-bold text-white mb-4 capitalize">
                  {actionType === 'delete' ? 'Confirm Deletion' : `Update ${actionType}`}
                </h3>
                <p className="text-silver-400 mb-6 text-sm">
                  Target: <span className="text-white font-medium">{selectedBot.bot_type.replace('_', ' ')} ({selectedBot.user_email})</span>
                </p>

                <form onSubmit={handleAction} className="space-y-4">
                  {actionType === 'status' && (
                    <div>
                      <label className="block text-sm font-medium text-silver-300 mb-2">Select Status</label>
                      <select 
                        value={actionValue}
                        onChange={(e) => setActionValue(e.target.value)}
                        className="w-full bg-graphite-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-500"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  )}

                  {actionType === 'delete' && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                      Warning: This action is irreversible. The trading bot record will be permanently deleted.
                    </div>
                  )}

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => { setActionType(null); setSelectedBot(null); }}
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
                      {actionType === 'delete' ? 'Delete' : 'Confirm'}
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
