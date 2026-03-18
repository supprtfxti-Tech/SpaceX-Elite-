import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { motion } from 'motion/react';
import { Users, DollarSign, Activity, ShieldAlert, Loader2, XCircle, TrendingUp, Building, Bot, ArrowRight, Clock, CheckCircle2 } from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import clsx from 'clsx';

interface Transaction {
  id: string;
  type: string;
  amount: number;
  status: string;
  created_at: string;
  full_name: string;
  email: string;
}

interface Stats {
  totalUsers: number;
  totalAum: number;
  activeSessions: number;
  activeInvestments: number;
  totalInvestmentAmount: number;
  activeBots: number;
  totalBotAllocation: number;
  totalProperties: number;
  recentTransactions: Transaction[];
}

export default function Admin() {
  const { token, user } = useAuthStore();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const statsRes = await fetch('/api/admin/stats', { headers: { Authorization: `Bearer ${token}` } });

      if (!statsRes.ok) throw new Error('Failed to fetch admin data');

      const statsData = await statsRes.text().then(text => text ? JSON.parse(text) : {});
      setStats(statsData);
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
      <div className="max-w-7xl mx-auto space-y-8 p-4 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1 tracking-tight">Admin Overview</h1>
            <p className="text-silver-400 text-sm">Comprehensive system statistics and recent activities</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-sm font-medium text-silver-300">System Online</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 flex items-center gap-2">
            <XCircle className="w-5 h-5" /> {error}
          </div>
        )}

        {/* Primary Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-6 rounded-2xl relative overflow-hidden group border border-white/5 hover:border-accent-500/30 transition-colors"
          >
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 group-hover:opacity-10 transition-all duration-500">
              <Users className="w-24 h-24 text-accent-500" />
            </div>
            <div className="relative z-10">
              <div className="w-10 h-10 rounded-xl bg-accent-500/10 flex items-center justify-center mb-4">
                <Users className="w-5 h-5 text-accent-500" />
              </div>
              <p className="text-sm font-medium text-silver-400 mb-1 uppercase tracking-wider">Total Users</p>
              <h3 className="text-3xl font-bold text-white">
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : stats?.totalUsers.toLocaleString()}
              </h3>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-panel p-6 rounded-2xl relative overflow-hidden group border border-white/5 hover:border-emerald-500/30 transition-colors"
          >
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 group-hover:opacity-10 transition-all duration-500">
              <DollarSign className="w-24 h-24 text-emerald-500" />
            </div>
            <div className="relative z-10">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4">
                <DollarSign className="w-5 h-5 text-emerald-500" />
              </div>
              <p className="text-sm font-medium text-silver-400 mb-1 uppercase tracking-wider">Total AUM</p>
              <h3 className="text-3xl font-bold text-white">
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : `$${stats?.totalAum.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
              </h3>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-panel p-6 rounded-2xl relative overflow-hidden group border border-white/5 hover:border-blue-500/30 transition-colors"
          >
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 group-hover:opacity-10 transition-all duration-500">
              <TrendingUp className="w-24 h-24 text-blue-500" />
            </div>
            <div className="relative z-10">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4">
                <TrendingUp className="w-5 h-5 text-blue-500" />
              </div>
              <p className="text-sm font-medium text-silver-400 mb-1 uppercase tracking-wider">Active Investments</p>
              <h3 className="text-3xl font-bold text-white">
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : stats?.activeInvestments.toLocaleString()}
              </h3>
              <p className="text-xs text-silver-500 mt-2">
                Vol: ${stats?.totalInvestmentAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-panel p-6 rounded-2xl relative overflow-hidden group border border-white/5 hover:border-purple-500/30 transition-colors"
          >
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 group-hover:opacity-10 transition-all duration-500">
              <Bot className="w-24 h-24 text-purple-500" />
            </div>
            <div className="relative z-10">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4">
                <Bot className="w-5 h-5 text-purple-500" />
              </div>
              <p className="text-sm font-medium text-silver-400 mb-1 uppercase tracking-wider">Active Bots</p>
              <h3 className="text-3xl font-bold text-white">
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : stats?.activeBots.toLocaleString()}
              </h3>
              <p className="text-xs text-silver-500 mt-2">
                Allocated: ${stats?.totalBotAllocation.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Secondary Stats & Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Smaller Stats */}
          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass-panel p-6 rounded-2xl flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center">
                  <Building className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-silver-400">Listed Properties</p>
                  <h4 className="text-2xl font-bold text-white">{stats?.totalProperties || 0}</h4>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="glass-panel p-6 rounded-2xl flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                  <Activity className="w-6 h-6 text-indigo-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-silver-400">Active Sessions</p>
                  <h4 className="text-2xl font-bold text-white">{stats?.activeSessions || 0}</h4>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Recent Transactions */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="glass-panel rounded-2xl lg:col-span-2 overflow-hidden flex flex-col"
          >
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-accent-500" />
                Recent Transactions
              </h3>
            </div>
            <div className="p-0 flex-1 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 text-xs uppercase tracking-wider text-silver-400 bg-white/5">
                    <th className="p-4 font-medium">User</th>
                    <th className="p-4 font-medium">Type</th>
                    <th className="p-4 font-medium">Amount</th>
                    <th className="p-4 font-medium">Status</th>
                    <th className="p-4 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-silver-400">
                        <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                      </td>
                    </tr>
                  ) : stats?.recentTransactions && stats.recentTransactions.length > 0 ? (
                    stats.recentTransactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-4">
                          <p className="text-sm font-medium text-white">{tx.full_name}</p>
                          <p className="text-xs text-silver-400">{tx.email}</p>
                        </td>
                        <td className="p-4">
                          <span className="text-sm capitalize text-silver-300">{tx.type}</span>
                        </td>
                        <td className="p-4">
                          <span className="text-sm font-medium text-white">
                            {tx.amount < 0 ? '-' : ''}${Math.abs(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={clsx(
                            "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium",
                            tx.status === 'completed' ? "bg-emerald-500/10 text-emerald-400" :
                            tx.status === 'pending' ? "bg-amber-500/10 text-amber-400" :
                            "bg-red-500/10 text-red-400"
                          )}>
                            {tx.status}
                          </span>
                        </td>
                        <td className="p-4 text-sm text-silver-400">
                          {new Date(tx.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-silver-400">
                        No recent transactions found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </div>
    </AdminLayout>
  );
}