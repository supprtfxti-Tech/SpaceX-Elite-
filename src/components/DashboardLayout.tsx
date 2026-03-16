import { useState, useEffect, ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { LogOut, Wallet, TrendingUp, Activity, Bell, User, Shield, Menu, X, Settings, Bot, Building } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import clsx from 'clsx';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, token, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (user?.role === 'admin') {
      navigate('/admin');
    }
  }, [user, navigate]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (e) {
      console.error('Logout failed', e);
    } finally {
      logout();
      navigate('/login');
    }
  };

  const navItems = [
    { path: '/dashboard', icon: Activity, label: 'Overview' },
    { path: '/dashboard/wallets', icon: Wallet, label: 'Wallets' },
    { path: '/dashboard/markets', icon: TrendingUp, label: 'Markets' },
    { path: '/dashboard/bot', icon: Bot, label: 'Trading Bot' },
    { path: '/dashboard/real-estate', icon: Building, label: 'Real Estate' },
    { path: '/dashboard/profile', icon: User, label: 'Profile' },
    { path: '/dashboard/security', icon: Shield, label: 'Security' },
  ];

  if (user?.role === 'super_admin') {
    navItems.push({ path: '/admin', icon: Settings, label: 'Admin Panel' });
  }

  return (
    <div className="min-h-screen flex bg-graphite-900">
      {/* Desktop Sidebar */}
      <aside className="w-64 border-r border-white/10 flex-col hidden md:flex fixed h-full z-20 bg-graphite-900">
        <div className="p-6 border-b border-white/10">
          <Link to="/dashboard" className="flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-accent-500" />
            <span className="font-bold tracking-tight text-white">SpaceX Elite</span>
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={clsx(
                  "flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors",
                  isActive 
                    ? "bg-white/10 text-white" 
                    : "text-silver-400 hover:bg-white/5 hover:text-white"
                )}
              >
                <Icon className="w-5 h-5" /> {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-graphite-700 border border-white/10 flex items-center justify-center text-sm font-medium text-white shrink-0">
              {user?.fullName?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.fullName}</p>
              <p className="text-xs text-silver-400 truncate capitalize">{user?.role}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors font-medium"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 md:ml-64 relative">
        <header className="h-16 border-b border-white/10 flex items-center justify-between px-4 sm:px-8 bg-graphite-900/80 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button 
              className="md:hidden p-2 -ml-2 text-silver-300 hover:text-white transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-medium text-white">
              {navItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="text-silver-300">System Operational</span>
            </div>
            <button className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-silver-300 transition-colors relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent-500 border-2 border-graphite-900"></span>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </main>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
              className="fixed inset-y-0 left-0 w-72 bg-graphite-900 border-r border-white/10 z-50 flex flex-col md:hidden"
            >
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <Link to="/dashboard" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                  <TrendingUp className="w-6 h-6 text-accent-500" />
                  <span className="font-bold tracking-tight text-white">SpaceX Elite</span>
                </Link>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-silver-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={clsx(
                        "flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors",
                        isActive 
                          ? "bg-white/10 text-white" 
                          : "text-silver-400 hover:bg-white/5 hover:text-white"
                      )}
                    >
                      <Icon className="w-5 h-5" /> {item.label}
                    </Link>
                  );
                })}
              </nav>

              <div className="p-4 border-t border-white/10">
                <div className="flex items-center gap-3 px-4 py-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-graphite-700 border border-white/10 flex items-center justify-center text-sm font-medium text-white shrink-0">
                    {user?.fullName?.charAt(0) || 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{user?.fullName}</p>
                    <p className="text-xs text-silver-400 truncate capitalize">{user?.role}</p>
                  </div>
                </div>
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors font-medium"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
