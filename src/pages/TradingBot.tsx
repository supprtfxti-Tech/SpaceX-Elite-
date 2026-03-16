import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { motion } from 'motion/react';
import { Bot, Play, Square, Settings, TrendingUp, Activity, AlertCircle, Loader2, ShoppingCart, CheckCircle2 } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import clsx from 'clsx';

interface BotConfig {
  id: string;
  bot_type: 'basic' | 'arbitrage' | 'ai_quantum' | 'gemini_champ' | 'optimus_prime';
  status: 'active' | 'inactive';
  strategy: 'conservative' | 'moderate' | 'aggressive';
  pair: string;
  allocated_amount: number;
  profit_loss: number;
}

const BOT_TYPES = [
  { 
    id: 'basic', 
    name: 'Elite Basic bot', 
    price: 0, 
    description: 'Standard grid trading algorithm. Good for sideways markets.', 
    features: ['Standard execution', 'Up to 2 pairs', 'Basic analytics'],
    image: 'https://images.unsplash.com/photo-1618044733300-9472054094ee?q=80&w=800&auto=format&fit=crop'
  },
  { 
    id: 'arbitrage', 
    name: 'Arbitrage Bot', 
    price: 99, 
    description: 'Exploits price differences across multiple exchanges.', 
    features: ['High-speed execution', 'Multi-exchange', 'Risk-free profit targeting'],
    image: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?q=80&w=800&auto=format&fit=crop'
  },
  { 
    id: 'gemini_champ', 
    name: 'Gemini Champ Bot', 
    price: 180, 
    description: 'Powered by Panthers AI Studio. Advanced market analysis and pattern recognition.', 
    features: ['Panthers AI Studio integration', 'Pattern recognition', 'High accuracy signals'],
    image: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=800&auto=format&fit=crop'
  },
  { 
    id: 'optimus_prime', 
    name: 'Optimus Prime Bot', 
    price: 320, 
    description: 'Powered by Panthers xAI. Transform your portfolio with heavy-duty algorithmic trading.', 
    features: ['Panthers xAI engine', 'Heavy-duty algorithms', 'Auto-transforming strategies'],
    image: 'https://images.unsplash.com/photo-1535378620166-273708d44e4c?q=80&w=800&auto=format&fit=crop'
  },
  { 
    id: 'ai_quantum', 
    name: 'Ai Quantum Bot', 
    price: 500, 
    description: 'Advanced machine learning model predicting market movements.', 
    features: ['Neural network predictions', 'Unlimited pairs', 'Auto-adjusting strategy'],
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=800&auto=format&fit=crop'
  }
];

export default function TradingBot() {
  const { token } = useAuthStore();
  const [bot, setBot] = useState<BotConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form state
  const [strategy, setStrategy] = useState<'conservative' | 'moderate' | 'aggressive'>('moderate');
  const [pair, setPair] = useState('BTC/USD');
  const [allocatedAmount, setAllocatedAmount] = useState('');

  useEffect(() => {
    fetchBotData();
  }, [token]);

  const fetchBotData = async () => {
    try {
      const res = await fetch('/api/bot', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!res.ok) {
        let errorMessage = 'Failed to fetch bot configuration';
        try {
          const errData = await res.json();
          errorMessage = errData.error || errorMessage;
        } catch (e) {
          // Ignore JSON parse error
        }
        throw new Error(errorMessage);
      }
      
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned an invalid response');
      }
      
      const data = await res.json();
      setBot(data);
      setStrategy(data.strategy);
      setPair(data.pair);
      setAllocatedAmount(data.allocated_amount.toString());
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async () => {
    if (!bot) return;
    setSaving(true);
    setError('');
    setSuccess('');
    
    const newStatus = bot.status === 'active' ? 'inactive' : 'active';
    
    try {
      const res = await fetch('/api/bot/toggle', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (!res.ok) {
        let errorMessage = 'Failed to toggle bot';
        try {
          const errData = await res.json();
          errorMessage = errData.error || errorMessage;
        } catch (e) {
          // Ignore JSON parse error
        }
        throw new Error(errorMessage);
      }
      
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned an invalid response');
      }
      
      const updatedBot = await res.json();
      setBot(updatedBot);
      setSuccess(`Bot successfully ${newStatus === 'active' ? 'started' : 'stopped'}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    
    try {
      const res = await fetch('/api/bot/config', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ 
          strategy, 
          pair, 
          allocated_amount: parseFloat(allocatedAmount) || 0 
        })
      });
      
      if (!res.ok) {
        let errorMessage = 'Failed to update configuration';
        try {
          const errData = await res.json();
          errorMessage = errData.error || errorMessage;
        } catch (e) {
          // Ignore JSON parse error
        }
        throw new Error(errorMessage);
      }
      
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned an invalid response');
      }
      
      const updatedBot = await res.json();
      setBot(updatedBot);
      setSuccess('Configuration saved successfully');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handlePurchase = async (botType: string, price: number) => {
    if (!confirm(`Are you sure you want to purchase the ${botType} bot for $${price}?`)) return;
    
    setSaving(true);
    setError('');
    setSuccess('');
    
    try {
      const res = await fetch('/api/bot/purchase', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ bot_type: botType, price })
      });
      
      if (!res.ok) {
        let errorMessage = 'Failed to purchase bot';
        try {
          const errData = await res.json();
          errorMessage = errData.error || errorMessage;
        } catch (e) {
          // Ignore JSON parse error
        }
        throw new Error(errorMessage);
      }
      
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned an invalid response');
      }
      
      const updatedBot = await res.json();
      setBot(updatedBot);
      setSuccess(`Successfully upgraded to ${BOT_TYPES.find(b => b.id === botType)?.name}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-accent-500" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
            <Bot className="w-6 h-6 text-accent-500" />
            Trading Automated Bot
          </h1>
          <p className="text-silver-400 text-sm">Configure and monitor your automated trading strategies</p>
        </div>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {success && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-start gap-3">
            <Activity className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            <p className="text-sm text-emerald-400">{success}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Status Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={clsx(
              "lg:col-span-1 rounded-2xl p-6 relative overflow-hidden border transition-all duration-500",
              bot?.status === 'active' 
                ? "bg-gradient-to-br from-emerald-500/10 to-graphite-800 border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.1)]" 
                : "bg-white/[0.02] border-white/5"
            )}
          >
            <div className="absolute -top-10 -right-10 p-6 opacity-10 pointer-events-none">
              <Bot className={clsx(
                "w-40 h-40 transition-all duration-500",
                bot?.status === 'active' ? "text-emerald-500 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]" : "text-white"
              )} />
            </div>
            
            <h2 className="text-sm font-bold text-silver-400 uppercase tracking-wider mb-6 relative z-10 flex items-center gap-2">
              <Activity className="w-4 h-4" /> Bot Status
            </h2>
            
            <div className="flex items-center gap-4 mb-4 relative z-10">
              <div className="relative flex items-center justify-center">
                <div className={clsx(
                  "w-4 h-4 rounded-full z-10",
                  bot?.status === 'active' ? "bg-emerald-500" : "bg-silver-500"
                )} />
                {bot?.status === 'active' && (
                  <div className="absolute w-8 h-8 rounded-full bg-emerald-500/30 animate-ping" />
                )}
              </div>
              <span className={clsx(
                "text-3xl font-black capitalize tracking-tight",
                bot?.status === 'active' ? "text-emerald-400" : "text-white"
              )}>
                {bot?.status || 'Inactive'}
              </span>
            </div>

            <div className="mb-8 relative z-10">
              <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold bg-accent-500/10 text-accent-400 border border-accent-500/20 shadow-[0_0_10px_rgba(var(--color-accent-500),0.1)]">
                {BOT_TYPES.find(b => b.id === bot?.bot_type)?.name || 'Elite Basic bot'}
              </span>
            </div>

            <div className="space-y-4 relative z-10">
              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="text-silver-400 text-sm">Total Profit/Loss</span>
                <span className={clsx(
                  "font-medium",
                  (bot?.profit_loss || 0) >= 0 ? "text-emerald-400" : "text-red-400"
                )}>
                  {(bot?.profit_loss || 0) >= 0 ? '+' : ''}${bot?.profit_loss?.toFixed(2) || '0.00'}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="text-silver-400 text-sm">Allocated Funds</span>
                <span className="text-white font-medium">${bot?.allocated_amount?.toFixed(2) || '0.00'}</span>
              </div>
            </div>

            <div className="mt-8 relative z-10">
              <button
                onClick={handleToggle}
                disabled={saving}
                className={clsx(
                  "w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all",
                  bot?.status === 'active' 
                    ? "bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20" 
                    : "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border border-emerald-500/20",
                  saving && "opacity-50 cursor-not-allowed"
                )}
              >
                {saving ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : bot?.status === 'active' ? (
                  <>
                    <Square className="w-5 h-5 fill-current" /> Stop Bot
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 fill-current" /> Start Bot
                  </>
                )}
              </button>
            </div>
          </motion.div>

          {/* Configuration Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 bg-white/[0.02] border border-white/5 rounded-2xl p-6"
          >
            <h2 className="text-lg font-medium text-white mb-6 flex items-center gap-2">
              <Settings className="w-5 h-5 text-silver-400" />
              Configuration
            </h2>

            <form onSubmit={handleSaveConfig} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-silver-300">Trading Pair</label>
                  <select 
                    value={pair}
                    onChange={(e) => setPair(e.target.value)}
                    disabled={bot?.status === 'active'}
                    className="w-full bg-graphite-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500 transition-colors disabled:opacity-50"
                  >
                    <option value="BTC/USD">BTC/USD</option>
                    <option value="ETH/USD">ETH/USD</option>
                    <option value="SOL/USD">SOL/USD</option>
                    <option value="XRP/USD">XRP/USD</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-silver-300">Allocated Amount (USD)</label>
                  <input 
                    type="number"
                    value={allocatedAmount}
                    onChange={(e) => setAllocatedAmount(e.target.value)}
                    disabled={bot?.status === 'active'}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className="w-full bg-graphite-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500 transition-colors disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-silver-300">Trading Strategy</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { id: 'conservative', label: 'Conservative', desc: 'Low risk, steady growth' },
                    { id: 'moderate', label: 'Moderate', desc: 'Balanced risk/reward' },
                    { id: 'aggressive', label: 'Aggressive', desc: 'High risk, high potential' }
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      disabled={bot?.status === 'active'}
                      onClick={() => setStrategy(s.id as any)}
                      className={clsx(
                        "p-4 rounded-xl border text-left transition-all disabled:opacity-50",
                        strategy === s.id 
                          ? "bg-accent-500/10 border-accent-500/50 text-white" 
                          : "bg-graphite-800 border-white/5 text-silver-400 hover:border-white/20"
                      )}
                    >
                      <div className="font-medium mb-1 capitalize">{s.label}</div>
                      <div className="text-xs opacity-70">{s.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 flex justify-end">
                <button
                  type="submit"
                  disabled={saving || bot?.status === 'active'}
                  className="px-6 py-3 bg-accent-600 hover:bg-accent-500 text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  Save Configuration
                </button>
              </div>
              
              {bot?.status === 'active' && (
                <p className="text-xs text-amber-400 text-right mt-2">
                  * Must stop the bot to change configuration
                </p>
              )}
            </form>
          </motion.div>
        </div>

        {/* Bot Marketplace */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="pt-8 border-t border-white/5"
        >
          <div className="mb-8">
            <h2 className="text-3xl font-light text-white flex items-center gap-3 tracking-tight">
              <ShoppingCart className="w-6 h-6 text-accent-500" />
              Bot Marketplace
            </h2>
            <p className="text-silver-400 mt-2">Discover elite algorithmic trading strategies</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {BOT_TYPES.map((type) => {
              const isCurrent = bot?.bot_type === type.id;
              
              return (
                <div 
                  key={type.id}
                  className={clsx(
                    "relative overflow-hidden rounded-3xl flex flex-col transition-all duration-500 group min-h-[420px]",
                    isCurrent 
                      ? "ring-2 ring-accent-500 shadow-[0_0_30px_rgba(16,185,129,0.2)]" 
                      : "ring-1 ring-white/10 hover:ring-white/30"
                  )}
                >
                  {/* Background Image */}
                  <div className="absolute inset-0 z-0 bg-graphite-900">
                    <img 
                      src={type.image} 
                      alt={type.name}
                      className="w-full h-full object-cover opacity-40 group-hover:opacity-60 group-hover:scale-105 transition-all duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-graphite-900 via-graphite-900/80 to-transparent" />
                  </div>

                  {/* Content */}
                  <div className="relative z-10 p-8 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-auto">
                      {isCurrent ? (
                        <span className="bg-accent-500/20 text-accent-400 border border-accent-500/30 text-xs px-3 py-1 rounded-full font-medium flex items-center gap-1 backdrop-blur-md">
                          <CheckCircle2 className="w-3 h-3" /> Active
                        </span>
                      ) : (
                        <span />
                      )}
                    </div>
                    
                    <div className="mt-8">
                      <h3 className="text-2xl font-light text-white mb-2 tracking-tight">{type.name}</h3>
                      <p className="text-3xl font-bold text-accent-400 mb-4">
                        {type.price === 0 ? 'Free' : `$${type.price}`}
                      </p>
                      
                      <p className="text-sm text-silver-300/80 mb-6 leading-relaxed">
                        {type.description}
                      </p>
                      
                      <ul className="space-y-3 mb-8">
                        {type.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center gap-3 text-sm text-silver-200">
                            <div className="w-1.5 h-1.5 rounded-full bg-accent-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      
                      <button
                        onClick={() => handlePurchase(type.id, type.price)}
                        disabled={isCurrent || saving || bot?.status === 'active'}
                        className={clsx(
                          "w-full py-4 rounded-xl font-medium transition-all duration-300 backdrop-blur-md",
                          isCurrent
                            ? "bg-white/5 text-silver-400 cursor-not-allowed border border-white/10"
                            : "bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                        )}
                      >
                        {isCurrent ? 'Current Plan' : 'Upgrade Bot'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Recent Activity Mock */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/[0.02] border border-white/5 rounded-2xl p-6"
        >
          <h2 className="text-lg font-medium text-white mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-silver-400" />
            Recent Bot Activity
          </h2>
          
          <div className="text-center py-12 text-silver-400">
            {bot?.status === 'active' ? (
              <div className="flex flex-col items-center justify-center space-y-4">
                <Activity className="w-8 h-8 text-accent-500 animate-pulse" />
                <p>Bot is actively monitoring the markets...</p>
              </div>
            ) : (
              <p>Bot is currently inactive. Start the bot to see activity.</p>
            )}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
