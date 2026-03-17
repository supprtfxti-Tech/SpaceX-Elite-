import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, TrendingUp, Lock, ArrowRight, Globe, Activity, 
  ChevronRight, BarChart3, Building2, CheckCircle2, Wallet, 
  LineChart, Users, HelpCircle, AlertTriangle, FileText,
  Menu, X, TrendingDown, Home, Cpu
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.6, ease: "easeOut" }
};

const staggerContainer = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true, margin: "-50px" },
  transition: { staggerChildren: 0.1 }
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

export default function Landing() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, user } = useAuthStore();
  const dashboardPath = user?.role === 'admin' || user?.role === 'super_admin' ? '/admin' : '/dashboard';

  return (
    <div className="min-h-screen flex flex-col bg-graphite-900 overflow-x-hidden font-sans text-silver-100 selection:bg-accent-500/30">
      
      {/* Risk Disclosure Banner - Hidden */}
      <div className="hidden bg-graphite-800 border-b border-white/5 py-2 px-4 text-center z-50 relative">
        <p className="text-[10px] md:text-xs text-silver-400 font-mono uppercase tracking-wider flex items-center justify-center gap-2">
          <AlertTriangle className="w-3 h-3 text-amber-500" />
          Capital at risk. Institutional and accredited investors only. Past performance does not guarantee future results.
        </p>
      </div>

      {/* Navigation */}
      <header className="sticky top-0 z-40 bg-graphite-900/90 backdrop-blur-md border-b border-white/10 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-500 to-blue-600 flex items-center justify-center shadow-lg shadow-accent-500/20 group-hover:shadow-accent-500/40 transition-shadow">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">SpaceX Elite</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-8">
            <a href="#products" className="text-sm font-medium text-silver-300 hover:text-white transition-colors">Products</a>
            <a href="#platform" className="text-sm font-medium text-silver-300 hover:text-white transition-colors">Platform</a>
            <a href="#security" className="text-sm font-medium text-silver-300 hover:text-white transition-colors">Security</a>
            <a href="#faq" className="text-sm font-medium text-silver-300 hover:text-white transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <Link to={dashboardPath} className="px-5 py-2.5 bg-white text-graphite-900 hover:bg-silver-200 text-sm font-semibold rounded-lg transition-colors shadow-lg shadow-white/10 hidden sm:block">
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-silver-300 hover:text-white transition-colors hidden sm:block">
                  Client Login
                </Link>
                <Link to="/register" className="px-5 py-2.5 bg-white text-graphite-900 hover:bg-silver-200 text-sm font-semibold rounded-lg transition-colors shadow-lg shadow-white/10 hidden sm:block">
                  Open Account
                </Link>
              </>
            )}
            
            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden p-2 text-silver-300 hover:text-white transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-graphite-900 border-b border-white/10 overflow-hidden"
            >
              <div className="px-6 py-6 flex flex-col gap-4">
                <a href="#products" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-medium text-silver-300 hover:text-white transition-colors">Products</a>
                <a href="#platform" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-medium text-silver-300 hover:text-white transition-colors">Platform</a>
                <a href="#security" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-medium text-silver-300 hover:text-white transition-colors">Security</a>
                <a href="#faq" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-medium text-silver-300 hover:text-white transition-colors">FAQ</a>
                <div className="h-px bg-white/10 my-2"></div>
                {isAuthenticated ? (
                  <Link to={dashboardPath} className="text-center px-5 py-2.5 bg-white text-graphite-900 hover:bg-silver-200 text-sm font-semibold rounded-lg transition-colors">Go to Dashboard</Link>
                ) : (
                  <>
                    <Link to="/login" className="text-sm font-medium text-silver-300 hover:text-white transition-colors">Client Login</Link>
                    <Link to="/register" className="text-center px-5 py-2.5 bg-white text-graphite-900 hover:bg-silver-200 text-sm font-semibold rounded-lg transition-colors">Open Account</Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-24 pb-20 lg:pt-32 lg:pb-24 px-6">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-accent-500/10 rounded-full blur-[120px] opacity-50"></div>
          </div>
          
          <div className="max-w-7xl mx-auto relative z-10 grid lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-left"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-silver-300 mb-8 backdrop-blur-md shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="tracking-wide uppercase">Regulated Institutional Infrastructure</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 leading-[1.05]">
                Precision Engineering for <br />
                <span className="text-white drop-shadow-sm">
                  Digital Capital
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-silver-400 mb-10 leading-relaxed max-w-xl font-light">
                A production-grade fintech platform engineered for secure digital investing, 
                wallet operations, and portfolio management with strict ledger integrity.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-4">
                {isAuthenticated ? (
                  <Link to={dashboardPath} className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-silver-200 text-graphite-900 font-semibold rounded-xl transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)] flex items-center justify-center gap-2 group">
                    Go to Dashboard <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                ) : (
                  <Link to="/register" className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-silver-200 text-graphite-900 font-semibold rounded-xl transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)] flex items-center justify-center gap-2 group">
                    Access Platform <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                )}
                <a href="#how-it-works" className="w-full sm:w-auto px-8 py-4 bg-transparent border border-white/20 hover:bg-white/5 font-medium text-white rounded-xl transition-colors flex items-center justify-center">
                  How it Works
                </a>
              </div>
            </motion.div>

            {/* Animated Trust Cards */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative h-[500px] hidden lg:block"
            >
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-10 right-10 w-72 glass-panel p-6 z-20 bg-graphite-900/80 backdrop-blur-xl border-white/10"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-emerald-400" />
                  </div>
                  <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">VERIFIED</span>
                </div>
                <p className="text-sm text-silver-400 mb-1">Ledger Integrity</p>
                <p className="text-xl font-bold text-white font-mono">100% Auditable</p>
              </motion.div>

              <motion.div 
                animate={{ y: [0, 15, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-20 left-0 w-80 glass-panel p-6 z-30 bg-graphite-900/90 border-accent-500/30 shadow-2xl shadow-accent-500/10"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-full bg-accent-500/20 flex items-center justify-center">
                    <LineChart className="w-5 h-5 text-accent-400" />
                  </div>
                  <span className="text-xs font-mono text-silver-400 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-accent-500 animate-pulse"></span> LIVE
                  </span>
                </div>
                <p className="text-sm text-silver-400 mb-1">Total Trading Volume</p>
                <p className="text-3xl font-bold text-white font-mono">$12.4B+</p>
                <div className="mt-4 h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "75%" }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                    className="h-full bg-accent-500"
                  ></motion.div>
                </div>
              </motion.div>

              <motion.div 
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                className="absolute top-1/2 right-0 w-64 glass-panel p-5 z-10 bg-graphite-900/60 backdrop-blur-xl border-white/10"
              >
                <div className="flex items-center gap-3 mb-3">
                  <Lock className="w-5 h-5 text-purple-400" />
                  <span className="text-sm font-medium text-white">Cold Storage</span>
                </div>
                <p className="text-xs text-silver-400">Multi-signature institutional custody protocols active.</p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Live Market Marquee */}
        <section className="w-full border-y border-white/5 bg-graphite-900/50 overflow-hidden py-3">
          <div className="flex whitespace-nowrap animate-marquee">
            {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, idx) => {
              const isPositive = item.change.startsWith('+');
              return (
                <div key={idx} className="flex items-center gap-3 px-8 border-r border-white/5 last:border-r-0">
                  <span className="text-sm font-bold text-white tracking-wider">{item.symbol}</span>
                  <span className="text-sm font-mono text-silver-300">${item.price}</span>
                  <span className={`flex items-center text-xs font-medium ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                    {isPositive ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                    {item.change}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Hero Metrics */}
        <section className="border-y border-white/5 bg-graphite-900/50">
          <div className="max-w-7xl mx-auto px-6 py-16">
            <motion.div 
              variants={staggerContainer}
              initial="initial"
              whileInView="whileInView"
              className="grid grid-cols-2 md:grid-cols-4 gap-8 md:divide-x divide-white/10"
            >
              {[
                { value: '$2.4B+', label: 'Assets Under Management' },
                { value: '99.99%', label: 'Platform Uptime' },
                { value: '150+', label: 'Supported Countries' },
                { value: '<50ms', label: 'Execution Latency' }
              ].map((stat, i) => (
                <motion.div key={i} variants={fadeIn} className="text-left md:px-8">
                  <p className="text-4xl md:text-5xl font-light text-white mb-3 font-mono tracking-tight">{stat.value}</p>
                  <p className="text-[11px] text-silver-500 font-medium uppercase tracking-widest">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Investment Highlights */}
        <section id="products" className="py-24 px-6 bg-graphite-900 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none"></div>
          <div className="max-w-7xl mx-auto relative z-10">
            <motion.div 
              variants={fadeIn}
              initial="initial"
              whileInView="whileInView"
              className="mb-16 text-center md:text-left md:flex justify-between items-end"
            >
              <div className="max-w-2xl">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">Institutional Asset Classes</h2>
                <p className="text-lg text-silver-400">Access a curated selection of premium investment vehicles, managed through our proprietary ledger system.</p>
              </div>
              <Link to="/register" className="hidden md:flex items-center gap-2 text-accent-500 hover:text-blue-400 font-medium transition-colors group">
                View All Products <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            <motion.div 
              variants={staggerContainer}
              initial="initial"
              whileInView="whileInView"
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {[
                { title: 'Digital Assets', desc: 'Direct market access to top-tier cryptocurrencies with institutional cold-storage custody.', apy: 'Dynamic', risk: 'High', icon: Activity },
                { title: 'Private Equity', desc: 'Exclusive access to pre-IPO companies and private market funds previously restricted to institutions.', apy: '12-18%', risk: 'Medium-High', icon: Building2 },
                { title: 'Fixed Income', desc: 'Stable yield generation through tokenized treasury bills and corporate bonds.', apy: '4.5-6%', risk: 'Low', icon: LineChart },
                { title: 'Real Estate', desc: 'Fractionalized ownership of premium commercial and residential properties worldwide.', apy: '8-12%', risk: 'Medium', icon: Home }
              ].map((asset, i) => (
                <motion.div key={i} variants={fadeIn} className="glass-panel p-8 hover:border-white/20 transition-colors flex flex-col h-full group">
                  <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center mb-4 border border-white/10 group-hover:bg-white/10 transition-colors">
                    <asset.icon className="w-5 h-5 text-silver-300 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-accent-400 transition-colors">{asset.title}</h3>
                  <p className="text-silver-400 mb-8 flex-1 text-sm">{asset.desc}</p>
                  <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/10">
                    <div>
                      <p className="text-xs text-silver-500 uppercase tracking-wider mb-1">Target Yield</p>
                      <p className="text-lg font-mono text-emerald-400">{asset.apy}</p>
                    </div>
                    <div>
                      <p className="text-xs text-silver-500 uppercase tracking-wider mb-1">Risk Profile</p>
                      <p className="text-lg font-medium text-white">{asset.risk}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Panther AI Section */}
        <section className="py-24 px-6 bg-graphite-900 border-y border-white/5 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent-500/5 rounded-full blur-[150px] pointer-events-none"></div>
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <motion.div 
                variants={fadeIn}
                initial="initial"
                whileInView="whileInView"
                className="lg:w-1/2"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-silver-400 mb-6 uppercase tracking-widest">
                  <Cpu className="w-3 h-3 text-accent-500" />
                  Powered by xAI
                </div>
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">Meet Panther. <br/><span className="text-silver-500">Your Elite AI Advisor.</span></h2>
                <p className="text-lg text-silver-400 mb-8 leading-relaxed">
                  Panther leverages the advanced reasoning capabilities of xAI to analyze global markets, identify real estate opportunities, and optimize your portfolio in real-time.
                </p>
                <ul className="space-y-4 mb-8">
                  {[
                    'Predictive market modeling and risk assessment',
                    'Automated real estate valuation and yield forecasting',
                    '24/7 portfolio monitoring and rebalancing alerts'
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-accent-500 shrink-0 mt-0.5" />
                      <span className="text-silver-300">{item}</span>
                    </li>
                  ))}
                </ul>
                <button className="flex items-center gap-2 bg-white text-graphite-900 px-6 py-3 rounded-xl font-medium hover:bg-silver-200 transition-colors">
                  Explore Panther AI <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
              
              <motion.div 
                variants={fadeIn}
                initial="initial"
                whileInView="whileInView"
                className="lg:w-1/2 w-full"
              >
                <div className="glass-panel p-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-accent-500/10 rounded-full blur-[80px]"></div>
                  <div className="flex items-center gap-4 mb-8 border-b border-white/10 pb-6">
                    <div className="w-12 h-12 rounded-full bg-graphite-800 border border-white/20 flex items-center justify-center">
                      <Cpu className="w-6 h-6 text-accent-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">Panther Analysis</h3>
                      <p className="text-xs text-silver-400 font-mono">xAI Engine Active</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-graphite-800/50 p-4 rounded-xl border border-white/5">
                      <p className="text-sm text-silver-300 mb-2">"Analyzing commercial real estate trends in emerging tech hubs. High probability of 12% yield increase in Austin, TX sector."</p>
                      <div className="flex items-center gap-2 text-[10px] font-mono text-emerald-400">
                        <Activity className="w-3 h-3" /> Confidence: 94.2%
                      </div>
                    </div>
                    <div className="bg-graphite-800/50 p-4 rounded-xl border border-white/5">
                      <p className="text-sm text-silver-300 mb-2">"Portfolio rebalancing recommended. Shifting 5% from Fixed Income to Digital Assets based on recent macro indicators."</p>
                      <div className="flex items-center gap-2 text-[10px] font-mono text-accent-400">
                        <Activity className="w-3 h-3" /> Action Required
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Panther Sponsors */}
        <section className="py-12 px-6 bg-graphite-900 border-b border-white/5 relative overflow-hidden">
          <div className="max-w-7xl mx-auto relative z-10">
            <p className="text-center text-[10px] font-mono text-silver-500 uppercase tracking-widest mb-8">
              Strategic Partners & Ecosystem Sponsors
            </p>
            <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-white tracking-tighter">xAI</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-white tracking-widest uppercase">SpaceX</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-white tracking-widest uppercase">Tesla</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-white tracking-tight">Neuralink</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold text-white">𝕏</span>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-24 px-6 bg-graphite-800/50 border-y border-white/5 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>
          <div className="max-w-7xl mx-auto relative z-10">
            <motion.div 
              variants={fadeIn}
              initial="initial"
              whileInView="whileInView"
              className="text-center mb-20"
            >
              <div className="inline-block mb-4">
                <span className="text-[10px] font-mono text-accent-400 tracking-[0.2em] uppercase border border-accent-500/30 px-3 py-1 rounded-full bg-accent-500/10">Process</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-medium text-white mb-6 tracking-tight">Streamlined Onboarding</h2>
              <p className="text-lg text-silver-400 max-w-2xl mx-auto font-light">From registration to your first investment in under 24 hours, backed by automated compliance routing.</p>
            </motion.div>

            <motion.div 
              variants={staggerContainer}
              initial="initial"
              whileInView="whileInView"
              className="grid md:grid-cols-4 gap-6 relative"
            >
              <div className="hidden md:block absolute top-1/2 left-[10%] right-[10%] h-px bg-gradient-to-r from-white/0 via-white/20 to-white/0 z-0 -translate-y-1/2"></div>
              
              {[
                { icon: Users, title: 'Register', desc: 'Create your secure identity profile.' },
                { icon: FileText, title: 'Verify', desc: 'Complete automated KYC/AML checks.' },
                { icon: Wallet, title: 'Fund', desc: 'Deposit via wire, ACH, or crypto.' },
                { icon: LineChart, title: 'Invest', desc: 'Allocate capital across assets.' }
              ].map((step, i) => (
                <motion.div key={i} variants={fadeIn} className="relative z-10 flex flex-col items-center text-center group bg-graphite-900/80 p-6 rounded-2xl border border-white/5 backdrop-blur-sm hover:border-white/10 transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:bg-white/10 transition-colors">
                    <step.icon className="w-5 h-5 text-silver-300 group-hover:text-white transition-colors" />
                  </div>
                  <div className="text-[10px] font-mono text-silver-500 mb-2">STEP 0{i + 1}</div>
                  <h3 className="text-lg font-medium text-white mb-2">{step.title}</h3>
                  <p className="text-sm text-silver-400 leading-relaxed">{step.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Platform Features Grid */}
        <section id="platform" className="py-24 px-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-accent-500/5 via-transparent to-transparent pointer-events-none"></div>
          <div className="max-w-7xl mx-auto relative z-10">
            <motion.div 
              variants={fadeIn}
              initial="initial"
              whileInView="whileInView"
              className="mb-16 md:w-2/3"
            >
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">Engineered for Scale and Security</h2>
              <p className="text-lg text-silver-400">Our platform is built on a foundation of strict financial ledger integrity, ensuring every transaction is auditable, secure, and instantaneous.</p>
            </motion.div>

            <motion.div 
              variants={staggerContainer}
              initial="initial"
              whileInView="whileInView"
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {[
                { icon: Activity, color: 'accent', title: 'Ledger-First Architecture', desc: 'Every balance movement passes through a controlled accounting layer, ensuring absolute financial integrity and traceability.' },
                { icon: Shield, color: 'emerald', title: 'Bank-Grade Security', desc: 'Multi-factor authentication, end-to-end encryption, and continuous monitoring protect your assets and personal data.' },
                { icon: BarChart3, color: 'purple', title: 'Real-Time Analytics', desc: 'Monitor your portfolio performance with advanced charting, allocation heatmaps, and instant valuation updates.' },
                { icon: Building2, color: 'amber', title: 'Admin Governance', desc: 'Strict role-based access controls. Only authorized admins may configure rules affecting financial operations and fees.' },
                { icon: Lock, color: 'rose', title: 'Strict Compliance', desc: 'Automated KYC/AML workflows and regulatory reporting ensure full compliance across all supported jurisdictions.' },
                { icon: Globe, color: 'cyan', title: 'Global Operations', desc: 'Seamlessly deposit, invest, and withdraw funds globally with our optimized payment routing infrastructure.' }
              ].map((feat, i) => (
                <motion.div key={i} variants={fadeIn} className="bg-graphite-900/50 p-8 border border-white/5 rounded-2xl hover:bg-white/[0.02] hover:border-white/10 transition-all group relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center mb-6 border border-white/10 group-hover:bg-white/10 transition-colors">
                    <feat.icon className="w-5 h-5 text-silver-300 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-lg font-medium text-white mb-3">{feat.title}</h3>
                  <p className="text-sm text-silver-400 leading-relaxed font-light">{feat.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Security Statement */}
        <section id="security" className="py-24 px-6 bg-graphite-800/30 border-y border-white/5">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
            <motion.div 
              variants={fadeIn}
              initial="initial"
              whileInView="whileInView"
              className="lg:w-1/2"
            >
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">Security by Default</h2>
              <p className="text-lg text-silver-400 mb-8">We employ a defense-in-depth approach to protect your capital and identity. Our infrastructure is audited regularly by top-tier security firms.</p>
              <ul className="space-y-4">
                {[
                  'AES-256 Encryption at rest and TLS 1.3 in transit',
                  'Mandatory Multi-Factor Authentication (MFA)',
                  'Hardware Security Modules (HSM) for key management',
                  'Continuous penetration testing and bug bounties'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                    <span className="text-silver-300">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="lg:w-1/2 w-full"
            >
              <div className="glass-panel p-8 bg-graphite-900/80 backdrop-blur-xl border-emerald-500/30 shadow-[0_0_50px_rgba(16,185,129,0.15)] relative overflow-hidden rounded-2xl ring-1 ring-white/5">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500/0 via-emerald-400 to-emerald-500/0 opacity-80 shadow-[0_0_15px_rgba(52,211,153,0.8)]"></div>
                <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                  <span className="text-sm font-mono text-silver-400">SYSTEM.AUDIT_LOG</span>
                  <span className="text-xs font-mono text-emerald-400 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> SECURE</span>
                </div>
                <div className="space-y-3 font-mono text-xs text-silver-500">
                  <p>[10:42:01] <span className="text-accent-400">AUTH</span>: MFA verified for User_ID_8492</p>
                  <p>[10:42:05] <span className="text-emerald-400">LEDGER</span>: Transaction batch #9921 validated</p>
                  <p>[10:42:06] <span className="text-purple-400">CRYPTO</span>: Cold storage signature required</p>
                  <p>[10:42:10] <span className="text-emerald-400">LEDGER</span>: Double-entry posting confirmed</p>
                  <p>[10:42:15] <span className="text-silver-300">SYSTEM</span>: Routine compliance check passed</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-24 px-6 border-t border-white/5 bg-graphite-900/30">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              variants={fadeIn}
              initial="initial"
              whileInView="whileInView"
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-5xl font-medium text-white tracking-tight">Trusted by Institutional Partners</h2>
            </motion.div>
            <motion.div 
              variants={staggerContainer}
              initial="initial"
              whileInView="whileInView"
              className="grid md:grid-cols-2 gap-8"
            >
              <motion.div variants={fadeIn} className="bg-graphite-900/80 p-10 rounded-2xl border border-white/5 relative">
                <div className="absolute top-8 right-8 text-6xl text-white/5 font-serif leading-none">"</div>
                <p className="text-xl md:text-2xl text-silver-300 font-light leading-relaxed mb-8 relative z-10">"SpaceX Elite's ledger-first approach provides the exact auditability and reporting standards our compliance team requires for digital asset exposure."</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-silver-400 font-medium">MD</div>
                  <div>
                    <p className="font-medium text-white text-sm uppercase tracking-wider">Managing Director</p>
                    <p className="text-xs text-silver-500">Global Wealth Management Firm</p>
                  </div>
                </div>
              </motion.div>
              <motion.div variants={fadeIn} className="bg-graphite-900/80 p-10 rounded-2xl border border-white/5 relative">
                <div className="absolute top-8 right-8 text-6xl text-white/5 font-serif leading-none">"</div>
                <p className="text-xl md:text-2xl text-silver-300 font-light leading-relaxed mb-8 relative z-10">"The API integration and real-time settlement capabilities have completely transformed how we manage our alternative investment portfolio."</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-silver-400 font-medium">CO</div>
                  <div>
                    <p className="font-medium text-white text-sm uppercase tracking-wider">Chief Investment Officer</p>
                    <p className="text-xs text-silver-500">Multi-Family Office</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="py-24 px-6 bg-graphite-800/30 border-t border-white/5">
          <div className="max-w-3xl mx-auto">
            <motion.div 
              variants={fadeIn}
              initial="initial"
              whileInView="whileInView"
              className="text-center mb-16"
            >
              <HelpCircle className="w-12 h-12 text-accent-500 mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Frequently Asked Questions</h2>
            </motion.div>
            <motion.div 
              variants={staggerContainer}
              initial="initial"
              whileInView="whileInView"
              className="space-y-6"
            >
              {[
                { q: 'What are the minimum investment requirements?', a: 'Minimums vary by asset class. Digital assets typically require $10,000, while Private Equity funds may require $100,000+ depending on the specific vehicle.' },
                { q: 'How is my capital protected?', a: 'Fiat deposits are held in segregated accounts at Tier-1 banking partners. Digital assets are secured using multi-signature cold storage solutions provided by regulated custodians.' },
                { q: 'What is the fee structure?', a: 'We operate on a transparent, admin-controlled fee model. Fees are clearly displayed prior to any transaction execution. Management fees range from 0.5% to 2% depending on the product.' },
                { q: 'How long does KYC verification take?', a: 'Our automated compliance routing typically processes individual KYC within 2 hours. Corporate onboarding may take 24-48 hours depending on entity complexity.' }
              ].map((faq, i) => (
                <motion.div key={i} variants={fadeIn} className="glass-panel p-6 hover:border-white/20 transition-colors">
                  <h4 className="text-lg font-bold text-white mb-2">{faq.q}</h4>
                  <p className="text-silver-400">{faq.a}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 px-6 relative overflow-hidden bg-graphite-900 border-t border-white/5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent pointer-events-none"></div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center relative z-10"
          >
            <h2 className="text-5xl md:text-6xl font-medium text-white mb-6 tracking-tight">Ready to elevate your portfolio?</h2>
            <p className="text-xl text-silver-400 mb-12 font-light">Join the next generation of digital capital management.</p>
            <Link to="/register" className="inline-flex items-center gap-2 px-10 py-5 bg-white text-graphite-900 hover:bg-silver-200 font-semibold rounded-full transition-all hover:scale-105 shadow-[0_0_40px_rgba(255,255,255,0.1)]">
              Open Institutional Account <ChevronRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-graphite-900 pt-16 pb-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <Link to="/" className="flex items-center gap-2 mb-6 group">
                <TrendingUp className="w-6 h-6 text-accent-500 group-hover:text-accent-400 transition-colors" />
                <span className="font-bold text-white group-hover:text-silver-200 transition-colors">SpaceX Elite</span>
              </Link>
              <p className="text-sm text-silver-400 leading-relaxed">
                A production-grade fintech platform engineered for secure digital investing, wallet operations, and portfolio management.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Platform</h4>
              <ul className="space-y-3 text-sm text-silver-400">
                <li><a href="#products" className="hover:text-white transition-colors">Investments</a></li>
                <li><a href="#platform" className="hover:text-white transition-colors">Architecture</a></li>
                <li><a href="#security" className="hover:text-white transition-colors">Security</a></li>
                <li><Link to="/login" className="hover:text-white transition-colors">Client Login</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-3 text-sm text-silver-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Support</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Legal & Compliance</h4>
              <ul className="space-y-3 text-sm text-silver-400">
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Risk Disclosure</a></li>
                <li><a href="#" className="hover:text-white transition-colors">AML & KYC Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/10 flex flex-col gap-4">
            <div className="p-5 rounded-xl bg-graphite-900/50 border border-white/10 text-[11px] text-silver-500 leading-relaxed shadow-inner backdrop-blur-sm">
              <strong className="text-silver-300">Compliance Notice:</strong> SpaceX Elite Investment operates under strict regulatory frameworks. All accounts are subject to mandatory Know Your Customer (KYC) and Anti-Money Laundering (AML) verification before any financial operations can be executed. Digital assets and private equity investments are highly speculative and involve a high degree of risk. You should carefully consider your investment objectives, level of experience, and risk appetite.
            </div>
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-4">
              <p className="text-xs text-silver-500">
                © {new Date().getFullYear()} SpaceX Elite Investment. All rights reserved.
              </p>
              <p className="text-xs text-silver-500">
                System Status: <span className="text-emerald-500 font-medium flex items-center gap-1.5 inline-flex"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> All Systems Operational</span>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
