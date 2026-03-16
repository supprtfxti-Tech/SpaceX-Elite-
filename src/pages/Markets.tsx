import { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TrendingUp, TrendingDown, Search, Filter, 
  ArrowUpRight, ArrowDownRight, Star, Activity,
  Clock, DollarSign, BarChart2, CheckCircle2
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer 
} from 'recharts';

// Mock data for the market chart
const generateChartData = (baseValue: number, volatility: number) => {
  let currentValue = baseValue;
  return Array.from({ length: 24 }).map((_, i) => {
    const change = (Math.random() - 0.5) * volatility;
    currentValue = currentValue + change;
    return {
      time: `${i}:00`,
      price: currentValue
    };
  });
};

const marketAssets = [
  { id: 'BTC', name: 'Bitcoin', symbol: 'BTC', type: 'Crypto', price: 64230.50, change24h: 2.45, volume: '32.4B', chartData: generateChartData(62000, 1000) },
  { id: 'ETH', name: 'Ethereum', symbol: 'ETH', type: 'Crypto', price: 3450.20, change24h: -1.20, volume: '15.2B', chartData: generateChartData(3500, 50) },
  { id: 'SOL', name: 'Solana', symbol: 'SOL', type: 'Crypto', price: 145.80, change24h: 5.60, volume: '4.1B', chartData: generateChartData(135, 5) },
  { id: 'SPY', name: 'S&P 500 ETF', symbol: 'SPY', type: 'Equity', price: 512.30, change24h: 0.85, volume: '85.2M', chartData: generateChartData(508, 2) },
  { id: 'GLD', name: 'Gold Trust', symbol: 'GLD', type: 'Commodity', price: 215.40, change24h: 0.15, volume: '12.4M', chartData: generateChartData(214, 1) },
  { id: 'AAPL', name: 'Apple Inc.', symbol: 'AAPL', type: 'Equity', price: 178.25, change24h: -0.45, volume: '52.1M', chartData: generateChartData(179, 2) },
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

export default function Markets() {
  const [selectedAsset, setSelectedAsset] = useState(marketAssets[0]);
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [isTrading, setIsTrading] = useState(false);
  const [tradeSuccess, setTradeSuccess] = useState(false);

  const filteredAssets = activeTab === 'All' 
    ? marketAssets 
    : marketAssets.filter(a => a.type === activeTab);

  const estimatedTotal = amount ? (parseFloat(amount) * selectedAsset.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00';

  const handleTrade = () => {
    if (!amount) return;
    setIsTrading(true);
    setTimeout(() => {
      setIsTrading(false);
      setTradeSuccess(true);
      setTimeout(() => {
        setTradeSuccess(false);
        setAmount('');
      }, 3000);
    }, 1500);
  };

  return (
    <DashboardLayout>
      <motion.div 
        className="max-w-7xl mx-auto w-full space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Global Markets</h1>
            <p className="text-sm text-silver-400">Trade institutional-grade digital assets and equities</p>
          </div>
          <div className="flex items-center gap-2 bg-graphite-800/50 p-1 rounded-lg border border-white/5">
            {['All', 'Crypto', 'Equity', 'Commodity'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${
                  activeTab === tab 
                    ? 'bg-white/10 text-white shadow-sm' 
                    : 'text-silver-400 hover:text-silver-200 hover:bg-white/5'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chart & Asset Details */}
          <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
            <div className="glass-panel p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <Activity className="w-6 h-6 text-accent-500" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-2xl font-bold text-white">{selectedAsset.name}</h2>
                      <span className="px-2 py-0.5 rounded text-xs font-medium bg-white/10 text-silver-300">{selectedAsset.symbol}</span>
                    </div>
                    <p className="text-sm text-silver-400">{selectedAsset.type}</p>
                  </div>
                </div>
                <div className="text-left sm:text-right">
                  <h3 className="text-3xl font-mono font-light text-white tracking-tight">
                    ${selectedAsset.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </h3>
                  <div className={`flex items-center sm:justify-end gap-1 text-sm font-medium mt-1 ${
                    selectedAsset.change24h >= 0 ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {selectedAsset.change24h >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    {Math.abs(selectedAsset.change24h)}% (24h)
                  </div>
                </div>
              </div>

              <div className="h-[350px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={selectedAsset.chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={selectedAsset.change24h >= 0 ? '#10b981' : '#ef4444'} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={selectedAsset.change24h >= 0 ? '#10b981' : '#ef4444'} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff" strokeOpacity={0.05} vertical={false} />
                    <XAxis dataKey="time" stroke="#a3a3a3" fontSize={12} tickLine={false} axisLine={false} minTickGap={30} />
                    <YAxis 
                      stroke="#a3a3a3" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false} 
                      tickFormatter={(value) => `$${value.toLocaleString()}`}
                      domain={['auto', 'auto']}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#111111', borderColor: '#333333', borderRadius: '8px', color: '#fff' }}
                      itemStyle={{ color: selectedAsset.change24h >= 0 ? '#10b981' : '#ef4444' }}
                      formatter={(value: number) => [`$${value.toLocaleString('en-US', {minimumFractionDigits: 2})}`, 'Price']}
                      labelStyle={{ color: '#a3a3a3' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="price" 
                      stroke={selectedAsset.change24h >= 0 ? '#10b981' : '#ef4444'} 
                      strokeWidth={2} 
                      fillOpacity={1} 
                      fill="url(#colorPrice)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/5">
                <div>
                  <p className="text-xs text-silver-500 uppercase tracking-wider mb-1">24h Volume</p>
                  <p className="text-sm font-medium text-white">${selectedAsset.volume}</p>
                </div>
                <div>
                  <p className="text-xs text-silver-500 uppercase tracking-wider mb-1">Market Cap</p>
                  <p className="text-sm font-medium text-white">--</p>
                </div>
                <div>
                  <p className="text-xs text-silver-500 uppercase tracking-wider mb-1">Circulating Supply</p>
                  <p className="text-sm font-medium text-white">--</p>
                </div>
                <div>
                  <p className="text-xs text-silver-500 uppercase tracking-wider mb-1">Popularity</p>
                  <p className="text-sm font-medium text-white">#1 on Platform</p>
                </div>
              </div>
            </div>

            {/* Asset List */}
            <div className="glass-panel overflow-hidden">
              <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                <h3 className="text-sm font-medium text-white">Market Movers</h3>
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-silver-500" />
                  <input 
                    type="text" 
                    placeholder="Search assets..." 
                    className="bg-graphite-900/50 border border-white/10 rounded-lg py-1.5 pl-8 pr-3 text-xs text-white focus:outline-none focus:border-accent-500 w-48 transition-colors"
                  />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-[10px] text-silver-500 uppercase tracking-wider bg-graphite-900/30">
                    <tr>
                      <th className="px-6 py-3 font-medium">Asset</th>
                      <th className="px-6 py-3 font-medium text-right">Price</th>
                      <th className="px-6 py-3 font-medium text-right">24h Change</th>
                      <th className="px-6 py-3 font-medium text-right">Volume</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredAssets.map((asset) => (
                      <tr 
                        key={asset.id} 
                        onClick={() => setSelectedAsset(asset)}
                        className={`cursor-pointer transition-colors ${
                          selectedAsset.id === asset.id ? 'bg-white/10' : 'hover:bg-white/5'
                        }`}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <button className="text-silver-600 hover:text-amber-400 transition-colors">
                              <Star className="w-4 h-4" />
                            </button>
                            <div>
                              <p className="font-medium text-white">{asset.name}</p>
                              <p className="text-[10px] text-silver-400">{asset.symbol}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right font-mono text-silver-200">
                          ${asset.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className={`inline-flex items-center gap-1 font-medium text-xs ${
                            asset.change24h >= 0 ? 'text-emerald-400' : 'text-red-400'
                          }`}>
                            {asset.change24h >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                            {Math.abs(asset.change24h)}%
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right text-silver-400 text-xs">
                          ${asset.volume}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>

          {/* Trading Panel */}
          <motion.div variants={itemVariants} className="lg:col-span-1">
            <div className="glass-panel p-6 sticky top-24">
              <h3 className="text-lg font-medium text-white mb-6 flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-accent-500" />
                Execute Trade
              </h3>
              
              <div className="flex p-1 bg-graphite-900/50 rounded-xl border border-white/5 mb-6">
                <button 
                  onClick={() => setTradeType('buy')}
                  className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                    tradeType === 'buy' 
                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                      : 'text-silver-400 hover:text-white'
                  }`}
                >
                  Buy
                </button>
                <button 
                  onClick={() => setTradeType('sell')}
                  className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                    tradeType === 'sell' 
                      ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' 
                      : 'text-silver-400 hover:text-white'
                  }`}
                >
                  Sell
                </button>
              </div>

              <div className="space-y-5">
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <label className="font-medium text-silver-400 uppercase tracking-wider">Order Type</label>
                  </div>
                  <select className="w-full bg-graphite-900/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-accent-500 transition-colors appearance-none cursor-pointer">
                    <option value="market">Market Order</option>
                    <option value="limit">Limit Order</option>
                    <option value="stop">Stop Loss</option>
                  </select>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <label className="font-medium text-silver-400 uppercase tracking-wider">Amount ({selectedAsset.symbol})</label>
                    <span className="text-silver-500">Available: 0.00</span>
                  </div>
                  <div className="relative">
                    <input 
                      type="number" 
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-graphite-900/50 border border-white/10 rounded-xl py-3 pl-4 pr-16 text-white font-mono focus:outline-none focus:border-accent-500 transition-colors"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                      <button className="text-[10px] font-bold text-accent-500 hover:text-accent-400 uppercase tracking-wider bg-accent-500/10 px-2 py-1 rounded">Max</button>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-silver-400">Current Price</span>
                    <span className="text-white font-mono">${selectedAsset.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-silver-400">Est. Fee (0.1%)</span>
                    <span className="text-white font-mono">${amount ? (parseFloat(amount) * selectedAsset.price * 0.001).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}</span>
                  </div>
                  <div className="pt-3 border-t border-white/10 flex justify-between items-center">
                    <span className="font-medium text-silver-200">Total Value</span>
                    <span className="text-lg font-bold text-white font-mono">${estimatedTotal}</span>
                  </div>
                </div>

                <button 
                  onClick={handleTrade}
                  disabled={isTrading || !amount || tradeSuccess}
                  className={`w-full py-4 rounded-xl font-bold text-white transition-all shadow-lg flex items-center justify-center gap-2 ${
                    isTrading || !amount || tradeSuccess ? 'opacity-50 cursor-not-allowed' : ''
                  } ${
                    tradeSuccess ? 'bg-emerald-500 shadow-emerald-500/20' :
                    tradeType === 'buy' 
                      ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20' 
                      : 'bg-red-600 hover:bg-red-500 shadow-red-500/20'
                  }`}
                >
                  {isTrading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : tradeSuccess ? (
                    <>
                      <CheckCircle2 className="w-5 h-5" /> Order Filled
                    </>
                  ) : (
                    tradeType === 'buy' ? 'Place Buy Order' : 'Place Sell Order'
                  )}
                </button>
                
                <p className="text-center text-[10px] text-silver-500 uppercase tracking-wider mt-4 flex items-center justify-center gap-1.5">
                  <Clock className="w-3 h-3" /> Execution time: ~0.2s
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
