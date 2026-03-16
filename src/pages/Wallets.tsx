import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import DashboardLayout from '../components/DashboardLayout';
import TransferModal from '../components/TransferModal';
import { motion } from 'motion/react';
import { Wallet, ArrowUpRight, ArrowDownRight, ArrowRightLeft, Plus, RefreshCw, Clock, ShieldCheck, CreditCard, Activity } from 'lucide-react';
import clsx from 'clsx';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

export default function Wallets() {
  const { token } = useAuthStore();
  const [wallets, setWallets] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTxLoading, setIsTxLoading] = useState(true);
  const [modalType, setModalType] = useState<'deposit' | 'withdraw' | 'transfer' | null>(null);

  const fetchWallets = async () => {
    try {
      const res = await fetch('/api/wallets', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setWallets(data);
      }
    } catch (err) {
      console.error('Failed to fetch wallets', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTransactions = async () => {
    setIsTxLoading(true);
    try {
      const res = await fetch('/api/transactions?limit=10', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setTransactions(data.transactions || []);
      }
    } catch (err) {
      console.error('Failed to fetch transactions', err);
    } finally {
      setIsTxLoading(false);
    }
  };

  useEffect(() => {
    fetchWallets();
    fetchTransactions();
  }, [token]);

  const totalBalance = wallets.reduce((acc, w) => acc + w.balance, 0);

  return (
    <DashboardLayout>
      <motion.div 
        className="max-w-7xl mx-auto w-full space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1 tracking-tight">Portfolio Assets</h1>
            <p className="text-sm text-silver-400">Institutional-grade asset management and transfers</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => { fetchWallets(); fetchTransactions(); }}
              className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-silver-300 transition-all hover:scale-105 active:scale-95"
              title="Refresh balances"
            >
              <RefreshCw className={clsx("w-4 h-4", (isLoading || isTxLoading) && "animate-spin")} />
            </button>
            <button 
              onClick={() => setModalType('deposit')}
              className="flex items-center gap-2 px-5 py-3 bg-white hover:bg-silver-200 text-graphite-900 font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_25px_rgba(255,255,255,0.25)] hover:-translate-y-0.5"
            >
              <Plus className="w-4 h-4" /> Add Funds
            </button>
          </div>
        </div>

        {/* Total Balance Overview - Premium Card Style */}
        <motion.div variants={itemVariants} className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-graphite-800 to-graphite-900 border border-white/10 shadow-2xl">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent-500/10 rounded-full blur-[100px] -mr-40 -mt-40 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[80px] -ml-20 -mb-20 pointer-events-none"></div>
          
          <div className="p-8 md:p-10 relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-silver-400">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span className="text-sm font-semibold uppercase tracking-widest">Total Portfolio Value</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-light font-mono text-white tracking-tight flex items-baseline gap-2">
                <span className="text-3xl text-silver-500">$</span>
                {totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                <span className="text-xl text-silver-500 font-sans tracking-normal ml-2">USD</span>
              </h2>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <button 
                onClick={() => setModalType('deposit')}
                className="flex-1 sm:flex-none flex items-center justify-center gap-3 px-8 py-4 bg-accent-600 hover:bg-accent-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-accent-500/20 hover:shadow-accent-500/40 hover:-translate-y-0.5"
              >
                <ArrowDownRight className="w-5 h-5" /> Deposit
              </button>
              <button 
                onClick={() => setModalType('withdraw')}
                className="flex-1 sm:flex-none flex items-center justify-center gap-3 px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl transition-all border border-white/10 hover:border-white/20 hover:-translate-y-0.5"
              >
                <ArrowUpRight className="w-5 h-5" /> Withdraw
              </button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Wallets List */}
          <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-accent-500" /> Asset Balances
              </h3>
            </div>
            
            {isLoading ? (
              <div className="animate-pulse space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-28 bg-white/5 rounded-2xl border border-white/10"></div>
                ))}
              </div>
            ) : wallets.length > 0 ? (
              <div className="grid gap-4">
                {wallets.map((wallet) => (
                  <div key={wallet.id} className="glass-panel p-6 rounded-2xl flex items-center justify-between group hover:border-white/20 hover:bg-white/[0.03] transition-all duration-300">
                    <div className="flex items-center gap-5">
                      <div className={clsx(
                        "w-14 h-14 rounded-2xl flex items-center justify-center border shadow-inner",
                        wallet.type === 'fiat' 
                          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' 
                          : 'bg-accent-500/10 border-accent-500/20 text-accent-500'
                      )}>
                        <Wallet className="w-7 h-7" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-white uppercase tracking-wider">{wallet.currency}</h4>
                        <p className="text-sm text-silver-400 capitalize font-medium">{wallet.type} Account</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-mono font-light text-white tracking-tight">
                        {wallet.type === 'fiat' ? '$' : ''}{wallet.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                      </p>
                      <div className="flex items-center justify-end gap-3 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
                        <button onClick={() => setModalType('deposit')} className="text-xs font-bold text-accent-400 hover:text-accent-300 transition-colors uppercase tracking-wider">Deposit</button>
                        <span className="text-white/20">•</span>
                        <button onClick={() => setModalType('withdraw')} className="text-xs font-bold text-silver-400 hover:text-white transition-colors uppercase tracking-wider">Withdraw</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="glass-panel p-12 text-center rounded-3xl border-dashed border-2 border-white/10">
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
                  <Wallet className="w-10 h-10 text-silver-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No active accounts</h3>
                <p className="text-silver-400 mb-8 max-w-sm mx-auto">You don't have any active wallets yet. Create one to start managing your assets.</p>
                <button className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-colors border border-white/10">
                  Open Account
                </button>
              </div>
            )}
          </motion.div>

          {/* Recent Transactions Sidebar */}
          <motion.div variants={itemVariants} className="glass-panel rounded-3xl flex flex-col h-[600px] border border-white/10 overflow-hidden">
            <div className="p-6 border-b border-white/10 bg-white/[0.02] flex justify-between items-center">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-500" /> Recent Activity
              </h3>
              <button className="text-xs text-accent-500 hover:text-accent-400 font-bold uppercase tracking-wider transition-colors">View All</button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              {isTxLoading ? (
                <div className="animate-pulse space-y-3">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="h-20 bg-white/5 rounded-2xl border border-white/10"></div>
                  ))}
                </div>
              ) : transactions.length > 0 ? (
                transactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-4 rounded-2xl bg-graphite-800/40 border border-white/5 hover:bg-graphite-800/80 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className={clsx(
                        "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border",
                        tx.type === 'deposit' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' :
                        tx.type === 'withdrawal' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' :
                        'bg-accent-500/10 border-accent-500/20 text-accent-500'
                      )}>
                        {tx.type === 'deposit' ? <ArrowDownRight className="w-5 h-5" /> :
                         tx.type === 'withdrawal' ? <ArrowUpRight className="w-5 h-5" /> :
                         <ArrowRightLeft className="w-5 h-5" />}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-white capitalize truncate">{tx.type}</p>
                        <p className="text-xs text-silver-400 flex items-center gap-1.5 mt-1 font-medium">
                          <Clock className="w-3.5 h-3.5" />
                          {new Date(tx.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0 ml-2">
                      <p className={clsx(
                        "text-base font-mono font-bold tracking-tight",
                        tx.amount > 0 ? 'text-emerald-400' : 'text-white'
                      )}>
                        {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                      <p className="text-xs text-silver-500 uppercase font-bold mt-1">{tx.currency}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 flex flex-col items-center">
                  <Activity className="w-12 h-12 text-silver-600 mb-4 opacity-50" />
                  <p className="text-sm font-medium text-silver-400">No recent activity</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {modalType && (
        <TransferModal 
          isOpen={!!modalType} 
          onClose={() => setModalType(null)} 
          type={modalType} 
          wallets={wallets}
          onSuccess={() => {
            fetchWallets();
            fetchTransactions();
          }}
        />
      )}
    </DashboardLayout>
  );
}
