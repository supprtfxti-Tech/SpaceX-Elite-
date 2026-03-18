import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import DashboardLayout from '../components/DashboardLayout';
import TransferModal from '../components/TransferModal';
import { motion } from 'motion/react';
import { 
  ArrowUpRight, ArrowDownRight, Wallet, Activity, 
  CreditCard, RefreshCw, Plus, ArrowRightLeft, 
  TrendingUp, Clock, ShieldCheck, TrendingDown, Home, Cpu, Link2, CheckCircle2
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer 
} from 'recharts';

// Mock data for the portfolio chart
const chartData = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 4500 },
  { name: 'Mar', value: 4200 },
  { name: 'Apr', value: 5800 },
  { name: 'May', value: 6100 },
  { name: 'Jun', value: 5900 },
  { name: 'Jul', value: 7500 },
];

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

const marqueeItems = [
  { symbol: 'BTC', price: '64,230.50', change: '+2.45%' },
  { symbol: 'ETH', price: '3,450.20', change: '-1.20%' },
  { symbol: 'SOL', price: '145.80', change: '+5.60%' },
  { symbol: 'SPY', price: '512.30', change: '+0.85%' },
  { symbol: 'GLD', price: '215.40', change: '+0.15%' },
  { symbol: 'AAPL', price: '178.25', change: '-0.45%' },
  { symbol: 'TSLA', price: '202.10', change: '+1.20%' },
  { symbol: 'NVDA', price: '850.40', change: '+3.40%' },
];

export default function Dashboard() {
  const { user, token } = useAuthStore();
  const navigate = useNavigate();
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
        const data = await res.text().then(text => text ? JSON.parse(text) : {});
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
      const res = await fetch('/api/transactions?limit=5', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.text().then(text => text ? JSON.parse(text) : {});
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
  const isKycPending = user?.kycStatus !== 'approved';

  return (
    <DashboardLayout>
      {/* Live Market Marquee */}
      <div className="w-full border border-white/5 bg-graphite-900/50 rounded-xl overflow-hidden py-2 mb-6">
        <div className="flex whitespace-nowrap animate-marquee">
          {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, idx) => {
            const isPositive = item.change.startsWith('+');
            return (
              <div key={idx} className="flex items-center gap-3 px-8 border-r border-white/5 last:border-r-0">
                <span className="text-xs font-bold text-white tracking-wider">{item.symbol}</span>
                <span className="text-xs font-mono text-silver-300">${item.price}</span>
                <span className={`flex items-center text-[10px] font-medium ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                  {isPositive ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                  {item.change}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <motion.div 
        className="max-w-7xl mx-auto w-full space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Top Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div variants={itemVariants} className="glass-panel p-8 relative overflow-hidden group rounded-3xl border border-white/10 shadow-2xl bg-gradient-to-br from-graphite-800 to-graphite-900">
            <div className="absolute top-0 right-0 w-48 h-48 bg-accent-500/10 rounded-full blur-[60px] -mr-20 -mt-20 pointer-events-none transition-opacity duration-500 group-hover:opacity-100 opacity-50"></div>
            <div className="flex justify-between items-start mb-6 relative z-10">
              <p className="text-sm font-semibold uppercase tracking-widest text-silver-400">Total Portfolio Value</p>
              <div className="p-2.5 bg-white/5 rounded-xl border border-white/10 shadow-inner">
                <Wallet className="w-5 h-5 text-accent-500" />
              </div>
            </div>
            <h2 className="text-4xl font-light font-mono text-white relative z-10 mb-3 tracking-tight flex items-baseline gap-1">
              <span className="text-2xl text-silver-500">$</span>
              {totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h2>
            <div className="flex items-center gap-2 text-sm relative z-10">
              <span className="flex items-center text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-md font-bold text-xs tracking-wider">
                <ArrowUpRight className="w-3.5 h-3.5 mr-1" /> +2.4%
              </span>
              <span className="text-silver-500 font-medium">vs last month</span>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="glass-panel p-8 relative overflow-hidden group rounded-3xl border border-white/10 shadow-2xl bg-gradient-to-br from-graphite-800 to-graphite-900">
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-[60px] -mr-20 -mt-20 pointer-events-none transition-opacity duration-500 group-hover:opacity-100 opacity-50"></div>
            <div className="flex justify-between items-start mb-6 relative z-10">
              <p className="text-sm font-semibold uppercase tracking-widest text-silver-400">Active Investments</p>
              <div className="p-2.5 bg-white/5 rounded-xl border border-white/10 shadow-inner">
                <Activity className="w-5 h-5 text-emerald-500" />
              </div>
            </div>
            <h2 className="text-4xl font-light font-mono text-white relative z-10 mb-3 tracking-tight">3</h2>
            <div className="flex items-center gap-2 text-sm relative z-10">
              <span className="text-silver-400 font-medium">Across 2 asset classes</span>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="glass-panel p-8 relative overflow-hidden group rounded-3xl border border-white/10 shadow-2xl bg-gradient-to-br from-graphite-800 to-graphite-900">
            <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-[60px] -mr-20 -mt-20 pointer-events-none transition-opacity duration-500 group-hover:opacity-100 opacity-50"></div>
            <div className="flex justify-between items-start mb-6 relative z-10">
              <p className="text-sm font-semibold uppercase tracking-widest text-silver-400">Account Status</p>
              <div className="p-2.5 bg-white/5 rounded-xl border border-white/10 shadow-inner">
                <ShieldCheck className="w-5 h-5 text-amber-500" />
              </div>
            </div>
            <div className="flex flex-col gap-3 relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500/10 text-amber-500 text-sm font-bold tracking-wider border border-amber-500/20 w-fit">
                {user?.kycStatus?.replace('_', ' ').toUpperCase() || 'PENDING KYC'}
              </div>
              {isKycPending && (
                <p className="text-xs text-silver-400 font-medium">
                  Complete verification to unlock full limits.
                </p>
              )}
            </div>
          </motion.div>
        </div>

        {/* Middle Section: Chart & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chart */}
          <motion.div variants={itemVariants} className="lg:col-span-2 glass-panel p-8 flex flex-col rounded-3xl border border-white/10">
            <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-6">
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight">Performance Overview</h3>
                <p className="text-sm text-silver-400 mt-1 font-medium">Portfolio value over time</p>
              </div>
              <div className="flex gap-2 bg-white/5 p-1 rounded-lg border border-white/10">
                {['1W', '1M', '3M', '1Y', 'ALL'].map((tf) => (
                  <button key={tf} className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${tf === '1M' ? 'bg-white text-graphite-900 shadow-sm' : 'text-silver-400 hover:text-white'}`}>
                    {tf}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex-1 min-h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff" strokeOpacity={0.05} vertical={false} />
                  <XAxis dataKey="name" stroke="#a3a3a3" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                  <YAxis stroke="#a3a3a3" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} dx={-10} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(17, 17, 17, 0.9)', borderColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '12px', color: '#fff', backdropFilter: 'blur(10px)' }}
                    itemStyle={{ color: '#3b82f6', fontWeight: 'bold' }}
                    formatter={(value: number) => [`$${value.toLocaleString()}`, 'Value']}
                  />
                  <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div variants={itemVariants} className="glass-panel p-8 flex flex-col rounded-3xl border border-white/10">
            <h3 className="text-xl font-bold text-white mb-6 tracking-tight border-b border-white/10 pb-6">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4 mb-8">
              <button 
                onClick={() => setModalType('deposit')}
                className="flex flex-col items-center justify-center gap-4 p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-white/20 transition-all duration-300 group shadow-inner"
              >
                <div className="w-12 h-12 rounded-xl bg-accent-500/10 border border-accent-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(59,130,246,0.1)] group-hover:shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                  <ArrowDownRight className="w-6 h-6 text-accent-500" />
                </div>
                <span className="text-sm font-bold text-silver-200 uppercase tracking-wider">Deposit</span>
              </button>
              <button 
                onClick={() => setModalType('withdraw')}
                className="flex flex-col items-center justify-center gap-4 p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-white/20 transition-all duration-300 group shadow-inner"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(16,185,129,0.1)] group-hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                  <ArrowUpRight className="w-6 h-6 text-emerald-500" />
                </div>
                <span className="text-sm font-bold text-silver-200 uppercase tracking-wider">Withdraw</span>
              </button>
              <button 
                onClick={() => navigate('/dashboard/bots')}
                className="flex flex-col items-center justify-center gap-4 p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-white/20 transition-all duration-300 group shadow-inner"
              >
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(168,85,247,0.1)] group-hover:shadow-[0_0_20px_rgba(168,85,247,0.2)]">
                  <Cpu className="w-6 h-6 text-purple-500" />
                </div>
                <span className="text-sm font-bold text-silver-200 uppercase tracking-wider">Bots</span>
              </button>
              <button 
                onClick={() => navigate('/dashboard/markets')}
                className="flex flex-col items-center justify-center gap-4 p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-white/20 transition-all duration-300 group shadow-inner"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(245,158,11,0.1)] group-hover:shadow-[0_0_20px_rgba(245,158,11,0.2)]">
                  <TrendingUp className="w-6 h-6 text-amber-500" />
                </div>
                <span className="text-sm font-bold text-silver-200 uppercase tracking-wider">Trade</span>
              </button>
            </div>
            
            <div className="mt-auto p-5 rounded-2xl bg-gradient-to-r from-accent-500/10 to-transparent border border-accent-500/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent-500/20 rounded-full blur-[40px] -mr-10 -mt-10 pointer-events-none"></div>
              <div className="flex items-start gap-4 relative z-10">
                <ShieldCheck className="w-6 h-6 text-accent-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white mb-1 tracking-wide">Institutional Grade Security</h4>
                  <p className="text-xs text-silver-400 leading-relaxed font-medium">Your assets are protected by multi-signature cold storage and real-time monitoring.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Section: Wallets & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Wallets */}
          <motion.div variants={itemVariants} className="glass-panel p-8 rounded-3xl border border-white/10 flex flex-col h-full">
            <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-6">
              <h3 className="text-xl font-bold text-white tracking-tight">Your Wallets</h3>
              <button 
                onClick={() => navigate('/dashboard/wallets')}
                className="text-xs text-accent-500 hover:text-accent-400 font-bold uppercase tracking-wider transition-colors"
              >
                View All
              </button>
            </div>
            
            <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar pr-2">
              {isLoading ? (
                <div className="animate-pulse space-y-4">
                  {[1, 2].map(i => (
                    <div key={i} className="h-20 bg-white/5 rounded-2xl border border-white/10"></div>
                  ))}
                </div>
              ) : wallets.length > 0 ? (
                wallets.map((wallet) => (
                  <div key={wallet.id} className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-white/20 transition-all duration-300 group shadow-inner">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-graphite-800 border border-white/10 flex items-center justify-center group-hover:border-white/20 transition-colors">
                        <Wallet className="w-6 h-6 text-silver-300" />
                      </div>
                      <div>
                        <p className="text-base font-bold text-white capitalize tracking-wide">{wallet.type} Wallet</p>
                        <p className="text-xs text-silver-400 font-medium mt-0.5">{wallet.currency}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-base font-mono font-bold text-white tracking-tight">
                        ${wallet.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 flex flex-col items-center justify-center h-full">
                  <Wallet className="w-12 h-12 text-silver-600 mb-4 opacity-50" />
                  <p className="text-sm font-medium text-silver-400">No active wallets.</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div variants={itemVariants} className="lg:col-span-2 glass-panel p-8 rounded-3xl border border-white/10 flex flex-col h-full">
            <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-6">
              <h3 className="text-xl font-bold text-white tracking-tight">Recent Activity</h3>
              <button 
                onClick={() => fetchTransactions()}
                className="text-xs text-accent-500 hover:text-accent-400 font-bold uppercase tracking-wider transition-colors flex items-center gap-2"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isTxLoading ? 'animate-spin' : ''}`} /> Refresh
              </button>
            </div>
            
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-silver-400 uppercase tracking-wider bg-white/[0.02] border-y border-white/10">
                  <tr>
                    <th className="px-6 py-4 font-bold rounded-tl-xl">Transaction</th>
                    <th className="px-6 py-4 font-bold">Date</th>
                    <th className="px-6 py-4 font-bold">Status</th>
                    <th className="px-6 py-4 font-bold text-right rounded-tr-xl">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {isTxLoading ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center">
                        <div className="animate-pulse flex flex-col items-center gap-4">
                          <div className="h-4 w-32 bg-white/10 rounded"></div>
                          <div className="h-4 w-48 bg-white/5 rounded"></div>
                        </div>
                      </td>
                    </tr>
                  ) : transactions.length > 0 ? (
                    transactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                              tx.type === 'deposit' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' :
                              tx.type === 'withdrawal' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' :
                              'bg-accent-500/10 border-accent-500/20 text-accent-500'
                            }`}>
                              {tx.type === 'deposit' ? <ArrowDownRight className="w-5 h-5" /> :
                               tx.type === 'withdrawal' ? <ArrowUpRight className="w-5 h-5" /> :
                               <ArrowRightLeft className="w-5 h-5" />}
                            </div>
                            <div>
                              <p className="font-bold text-white capitalize tracking-wide">{tx.type}</p>
                              {tx.description && <p className="text-xs text-silver-400 font-medium mt-0.5">{tx.description}</p>}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-silver-300 font-medium flex items-center gap-2">
                          <Clock className="w-4 h-4 text-silver-500" /> {new Date(tx.created_at).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="px-6 py-5">
                          <span className={`px-3 py-1.5 rounded-lg text-xs font-bold tracking-wider uppercase border ${
                            tx.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                            'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          }`}>
                            {tx.status}
                          </span>
                        </td>
                        <td className={`px-6 py-5 text-right font-mono font-bold text-base tracking-tight ${
                          tx.amount > 0 ? 'text-emerald-400' : 'text-white'
                        }`}>
                          {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-xs text-silver-500 ml-1">{tx.currency}</span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-silver-500 font-medium">
                        <Activity className="w-8 h-8 mx-auto mb-3 opacity-50" />
                        No recent activity found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>

        {/* Real Estate & Panther AI Highlights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-8">
          {/* Real Estate Ads */}
          <motion.div variants={itemVariants} className="glass-panel p-8 relative overflow-hidden group rounded-3xl border border-white/10 shadow-2xl bg-gradient-to-br from-graphite-800 to-graphite-900">
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-[60px] -mr-20 -mt-20 pointer-events-none transition-opacity duration-500 group-hover:opacity-100 opacity-50"></div>
            <div className="flex justify-between items-start mb-8 relative z-10 border-b border-white/10 pb-6">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2 tracking-tight">
                  <Home className="w-5 h-5 text-emerald-500" /> Real Estate Opportunities
                </h3>
                <p className="text-sm text-silver-400 mt-1 font-medium">Exclusive fractional ownership</p>
              </div>
              <span className="px-3 py-1.5 text-xs font-bold tracking-wider uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg">NEW</span>
            </div>
            
            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-white/20 transition-all duration-300 cursor-pointer group/item shadow-inner">
                <div>
                  <p className="text-base font-bold text-white tracking-wide group-hover/item:text-emerald-400 transition-colors">Manhattan Commercial Tower</p>
                  <p className="text-sm text-silver-400 font-medium mt-0.5">Target Yield: <span className="text-emerald-400">8.5% APY</span></p>
                </div>
                <div className="text-right">
                  <p className="text-base font-mono font-bold text-white">Min: $10k</p>
                  <p className="text-xs text-silver-500 uppercase font-bold mt-0.5 tracking-wider">Funded: 85%</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-white/20 transition-all duration-300 cursor-pointer group/item shadow-inner">
                <div>
                  <p className="text-base font-bold text-white tracking-wide group-hover/item:text-emerald-400 transition-colors">London Logistics Hub</p>
                  <p className="text-sm text-silver-400 font-medium mt-0.5">Target Yield: <span className="text-emerald-400">11.2% APY</span></p>
                </div>
                <div className="text-right">
                  <p className="text-base font-mono font-bold text-white">Min: $25k</p>
                  <p className="text-xs text-silver-500 uppercase font-bold mt-0.5 tracking-wider">Funded: 42%</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Panther AI Insights */}
          <motion.div variants={itemVariants} className="glass-panel p-8 relative overflow-hidden group rounded-3xl border border-white/10 shadow-2xl bg-gradient-to-br from-graphite-800 to-graphite-900">
            <div className="absolute top-0 right-0 w-48 h-48 bg-accent-500/10 rounded-full blur-[60px] -mr-20 -mt-20 pointer-events-none transition-opacity duration-500 group-hover:opacity-100 opacity-50"></div>
            <div className="flex justify-between items-start mb-8 relative z-10 border-b border-white/10 pb-6">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2 tracking-tight">
                  <Cpu className="w-5 h-5 text-accent-500" /> Panther AI Insights
                </h3>
                <p className="text-sm text-silver-400 mt-1 font-medium">Powered by xAI Engine</p>
              </div>
              <div className="flex items-center gap-2 bg-accent-500/10 px-3 py-1.5 rounded-lg border border-accent-500/20">
                <span className="w-2 h-2 rounded-full bg-accent-500 animate-pulse"></span>
                <span className="text-xs font-bold tracking-wider text-accent-400 uppercase">Active</span>
              </div>
            </div>
            
            <div className="space-y-4 relative z-10">
              <div className="p-5 rounded-2xl bg-accent-500/5 border border-accent-500/20 shadow-inner">
                <p className="text-sm text-silver-200 leading-relaxed mb-4 font-medium">
                  "Based on recent macroeconomic shifts, reallocating 5% of your portfolio to Real Estate (London Logistics Hub) could optimize your risk-adjusted returns by 1.2% annually."
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-mono font-bold text-silver-500 tracking-wider uppercase">Confidence: 92.4%</span>
                  <button className="text-xs font-bold text-accent-400 hover:text-accent-300 transition-colors uppercase tracking-wider">Apply Strategy &rarr;</button>
                </div>
              </div>
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 shadow-inner">
                <p className="text-sm text-silver-300 leading-relaxed mb-4 font-medium">
                  "Market volatility detected in Digital Assets. Your current cold-storage allocation provides sufficient downside protection."
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-mono font-bold text-silver-500 tracking-wider uppercase">Analysis: Routine</span>
                  <button className="text-xs font-bold text-silver-400 hover:text-white transition-colors uppercase tracking-wider">View Details</button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Connect Panther Sponsors */}
        <div className="grid grid-cols-1 gap-8 pb-8">
          <motion.div variants={itemVariants} className="glass-panel p-8 relative overflow-hidden group rounded-3xl border border-white/10 shadow-2xl bg-gradient-to-br from-graphite-800 to-graphite-900">
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px] -mr-20 -mt-20 pointer-events-none transition-opacity duration-500 group-hover:opacity-100 opacity-50"></div>
            <div className="flex justify-between items-start mb-8 relative z-10 border-b border-white/10 pb-6">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2 tracking-tight">
                  <Link2 className="w-5 h-5 text-purple-500" /> Connect Panther Sponsors
                </h3>
                <p className="text-sm text-silver-400 mt-1 font-medium">Link your accounts with our strategic partners for exclusive benefits and enhanced AI insights</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
              {[
                { name: 'xAI', desc: 'Unlock advanced predictive market modeling and real-time sentiment analysis.', connected: true },
                { name: 'SpaceX', desc: 'Access low-latency satellite data feeds for global market execution.', connected: false },
                { name: 'Tesla', desc: 'Integrate energy market insights and automated fleet financing opportunities.', connected: false }
              ].map((sponsor, i) => (
                <div key={i} className="flex flex-col p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-white/20 transition-all duration-300 shadow-inner">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-lg font-bold text-white tracking-widest uppercase">{sponsor.name}</h4>
                    {sponsor.connected ? (
                      <span className="px-3 py-1.5 text-xs font-bold tracking-wider uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Connected
                      </span>
                    ) : (
                      <span className="px-3 py-1.5 text-xs font-bold tracking-wider uppercase bg-white/5 text-silver-400 border border-white/10 rounded-lg">
                        Not Connected
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-silver-400 mb-8 flex-1 leading-relaxed font-medium">{sponsor.desc}</p>
                  <button className={`w-full py-3 rounded-xl text-sm font-bold tracking-wider uppercase transition-all duration-300 ${
                    sponsor.connected 
                      ? 'bg-white/5 text-silver-300 hover:bg-white/10 hover:text-white border border-white/10' 
                      : 'bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 border border-purple-500/30 hover:border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.1)] hover:shadow-[0_0_20px_rgba(168,85,247,0.2)]'
                  }`}>
                    {sponsor.connected ? 'Manage Connection' : 'Connect Account'}
                  </button>
                </div>
              ))}
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
