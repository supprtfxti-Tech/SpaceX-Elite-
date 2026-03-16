import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { motion, AnimatePresence } from 'motion/react';
import { Users, DollarSign, Activity, ShieldAlert, Loader2, Search, MoreVertical, Edit, Trash2, Wallet, ShieldCheck, CheckCircle, XCircle } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import clsx from 'clsx';

interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
  kyc_status: string;
  created_at: string;
}

export default function AdminUsers() {
  const { token, user } = useAuthStore();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [actionType, setActionType] = useState<'balance' | 'role' | 'kyc' | 'delete' | null>(null);
  const [actionValue, setActionValue] = useState('');
  const [actionAmount, setActionAmount] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const usersRes = await fetch('/api/admin/users', { headers: { Authorization: `Bearer ${token}` } });
      if (!usersRes.ok) throw new Error('Failed to fetch admin data');
      const usersData = await usersRes.json();
      setUsers(usersData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin' || user?.role === 'super_admin') {
      fetchData();
    } else {
      setError('Forbidden: Admin access required');
      setLoading(false);
    }
  }, [token, user]);

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !actionType) return;

    setActionLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      let url = `/api/admin/users/${selectedUser.id}`;
      let method = 'PUT';
      let body: any = {};

      if (actionType === 'role') {
        url += '/role';
        body = { role: actionValue };
      } else if (actionType === 'kyc') {
        url += '/kyc';
        body = { status: actionValue };
      } else if (actionType === 'balance') {
        url += '/balance';
        method = 'POST';
        body = { amount: parseFloat(actionAmount), type: actionValue };
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

      setSuccessMsg(`Successfully updated user: ${selectedUser.full_name}`);
      setActionType(null);
      setSelectedUser(null);
      fetchData(); // Refresh data
    } catch (err: any) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  if (user?.role !== 'admin' && user?.role !== 'super_admin') {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
          <ShieldAlert className="w-16 h-16 text-red-500 mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-silver-400">You do not have permission to view this page.</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">User Management</h1>
          <p className="text-silver-400 text-sm">Manage user roles, balances, and KYC status</p>
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

        {/* Users Table */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-panel rounded-2xl overflow-hidden"
        >
          <div className="p-6 border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-lg font-bold text-white">All Users</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-silver-500" />
              <input 
                type="text" 
                placeholder="Search users..." 
                className="bg-graphite-900/50 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-accent-500 w-full md:w-64"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  <th className="px-6 py-4 text-xs font-medium text-silver-400 uppercase tracking-wider">User</th>
                  <th className="px-6 py-4 text-xs font-medium text-silver-400 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-4 text-xs font-medium text-silver-400 uppercase tracking-wider">KYC Status</th>
                  <th className="px-6 py-4 text-xs font-medium text-silver-400 uppercase tracking-wider">Joined</th>
                  <th className="px-6 py-4 text-xs font-medium text-silver-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-silver-400">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                      Loading users...
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-silver-400">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-graphite-800 flex items-center justify-center border border-white/5 text-accent-500 font-bold">
                            {u.full_name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">{u.full_name}</p>
                            <p className="text-xs text-silver-400">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={clsx(
                          "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border",
                          (u.role === 'admin' || u.role === 'super_admin') ? "text-accent-400 bg-accent-400/10 border-accent-400/20" : "text-silver-300 bg-silver-400/10 border-silver-400/20"
                        )}>
                          {u.role.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={clsx(
                          "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border",
                          u.kyc_status === 'verified' ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" : 
                          u.kyc_status === 'pending' ? "text-yellow-400 bg-yellow-400/10 border-yellow-400/20" : 
                          "text-red-400 bg-red-400/10 border-red-400/20"
                        )}>
                          {u.kyc_status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-silver-300">{new Date(u.created_at).toLocaleDateString()}</p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {(user?.role === 'super_admin' || user?.role === 'admin') && (
                            <>
                              <button 
                                onClick={() => { setSelectedUser(u); setActionType('balance'); setActionValue('add'); setActionAmount(''); }}
                                className="p-2 hover:bg-emerald-500/10 rounded-lg transition-colors text-silver-400 hover:text-emerald-400"
                                title="Manage Balance"
                              >
                                <Wallet className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => { setSelectedUser(u); setActionType('role'); setActionValue(u.role); }}
                                className="p-2 hover:bg-blue-500/10 rounded-lg transition-colors text-silver-400 hover:text-blue-400"
                                title="Change Role"
                              >
                                <ShieldCheck className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => { setSelectedUser(u); setActionType('kyc'); setActionValue(u.kyc_status); }}
                                className="p-2 hover:bg-yellow-500/10 rounded-lg transition-colors text-silver-400 hover:text-yellow-400"
                                title="Update KYC"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              {u.id !== user.id && (
                                <button 
                                  onClick={() => { setSelectedUser(u); setActionType('delete'); }}
                                  className="p-2 hover:bg-red-500/10 rounded-lg transition-colors text-silver-400 hover:text-red-400"
                                  title="Delete User"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </>
                          )}
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
          {actionType && selectedUser && (
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
                  Target User: <span className="text-white font-medium">{selectedUser.email}</span>
                </p>

                <form onSubmit={handleAction} className="space-y-4">
                  {actionType === 'role' && (
                    <div>
                      <label className="block text-sm font-medium text-silver-300 mb-2">Select Role</label>
                      <select 
                        value={actionValue}
                        onChange={(e) => setActionValue(e.target.value)}
                        className="w-full bg-graphite-800 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-accent-500"
                      >
                        <option value="investor">Investor</option>
                        <option value="admin">Admin</option>
                        <option value="super_admin">Super Admin</option>
                      </select>
                    </div>
                  )}

                  {actionType === 'kyc' && (
                    <div>
                      <label className="block text-sm font-medium text-silver-300 mb-2">Select KYC Status</label>
                      <select 
                        value={actionValue}
                        onChange={(e) => setActionValue(e.target.value)}
                        className="w-full bg-graphite-800 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-accent-500"
                      >
                        <option value="not_started">Not Started</option>
                        <option value="pending">Pending</option>
                        <option value="verified">Verified</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>
                  )}

                  {actionType === 'balance' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-silver-300 mb-2">Action Type</label>
                        <select 
                          value={actionValue}
                          onChange={(e) => setActionValue(e.target.value)}
                          className="w-full bg-graphite-800 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-accent-500"
                        >
                          <option value="add">Add Funds</option>
                          <option value="deduct">Deduct Funds</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-silver-300 mb-2">Amount (USD)</label>
                        <input 
                          type="number"
                          step="0.01"
                          min="0"
                          value={actionAmount}
                          onChange={(e) => setActionAmount(e.target.value)}
                          className="w-full bg-graphite-800 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-accent-500"
                          placeholder="0.00"
                          required
                        />
                      </div>
                    </>
                  )}

                  {actionType === 'delete' && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                      <p className="text-red-400 text-sm">
                        Warning: This action is irreversible. All user data, wallets, and transactions will be permanently deleted.
                      </p>
                    </div>
                  )}

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setActionType(null)}
                      className="flex-1 px-4 py-2 rounded-lg font-medium text-silver-300 hover:bg-white/5 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={actionLoading}
                      className={clsx(
                        "flex-1 px-4 py-2 rounded-lg font-medium text-white transition-colors flex items-center justify-center",
                        actionType === 'delete' ? "bg-red-500 hover:bg-red-600" : "bg-accent-600 hover:bg-accent-700",
                        actionLoading && "opacity-70 cursor-not-allowed"
                      )}
                    >
                      {actionLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirm'}
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
