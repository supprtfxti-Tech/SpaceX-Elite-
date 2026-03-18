import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { motion } from 'motion/react';
import { ArrowUpRight, ArrowDownRight, Loader2, Search, Filter, RefreshCw } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import clsx from 'clsx';

interface Transaction {
  id: string;
  type: string;
  amount: number;
  currency: string;
  status: string;
  description: string;
  created_at: string;
}

export default function Transactions() {
  const { token } = useAuthStore();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTransactions = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/transactions', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch transactions');
      const data = await res.text().then(text => text ? JSON.parse(text) : {});
      setTransactions(data.transactions);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [token]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      case 'pending': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'failed': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-silver-400 bg-silver-400/10 border-silver-400/20';
    }
  };

  const getTypeIcon = (type: string) => {
    if (['deposit', 'profit'].includes(type)) {
      return <ArrowDownRight className="w-5 h-5 text-emerald-400" />;
    }
    return <ArrowUpRight className="w-5 h-5 text-red-400" />;
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Transaction History</h1>
            <p className="text-silver-400 text-sm">View and manage your recent activity</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-silver-500" />
              <input 
                type="text" 
                placeholder="Search transactions..." 
                className="bg-graphite-900/50 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-accent-500 w-full md:w-64"
              />
            </div>
            <button className="p-2 glass-panel rounded-lg hover:bg-white/5 transition-colors text-silver-400 hover:text-white">
              <Filter className="w-4 h-4" />
            </button>
            <button onClick={fetchTransactions} className="p-2 glass-panel rounded-lg hover:bg-white/5 transition-colors text-silver-400 hover:text-white">
              <RefreshCw className={clsx("w-4 h-4", loading && "animate-spin")} />
            </button>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel rounded-2xl overflow-hidden"
        >
          {loading && transactions.length === 0 ? (
            <div className="p-12 flex flex-col items-center justify-center text-silver-400">
              <Loader2 className="w-8 h-8 animate-spin mb-4 text-accent-500" />
              <p>Loading transactions...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-400">
              <p>{error}</p>
              <button onClick={fetchTransactions} className="mt-4 text-accent-500 hover:underline">Try again</button>
            </div>
          ) : transactions.length === 0 ? (
            <div className="p-12 text-center text-silver-400">
              <div className="w-16 h-16 rounded-full bg-graphite-800 flex items-center justify-center mx-auto mb-4">
                <RefreshCw className="w-8 h-8 text-silver-500" />
              </div>
              <h3 className="text-lg font-medium text-white mb-1">No transactions yet</h3>
              <p className="text-sm">Your transaction history will appear here once you start using your account.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.02]">
                    <th className="px-6 py-4 text-xs font-medium text-silver-400 uppercase tracking-wider">Type / Description</th>
                    <th className="px-6 py-4 text-xs font-medium text-silver-400 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-xs font-medium text-silver-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-medium text-silver-400 uppercase tracking-wider text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {transactions.map((tx, index) => (
                    <motion.tr 
                      key={tx.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-graphite-800 flex items-center justify-center border border-white/5">
                            {getTypeIcon(tx.type)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white capitalize">{tx.type}</p>
                            <p className="text-xs text-silver-400">{tx.description || 'System transaction'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-silver-300">{new Date(tx.created_at).toLocaleDateString()}</p>
                        <p className="text-xs text-silver-500">{new Date(tx.created_at).toLocaleTimeString()}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={clsx("inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border", getStatusColor(tx.status))}>
                          {tx.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <p className={clsx(
                          "text-sm font-medium",
                          ['deposit', 'profit'].includes(tx.type) ? 'text-emerald-400' : 'text-white'
                        )}>
                          {['deposit', 'profit'].includes(tx.type) ? '+' : '-'}${Math.abs(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </p>
                        <p className="text-xs text-silver-500">{tx.currency}</p>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
}