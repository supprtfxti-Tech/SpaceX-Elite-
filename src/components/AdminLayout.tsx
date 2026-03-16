import { useState, ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { LogOut, Users, Activity, Menu, X, Settings, ArrowLeft, TrendingUp, Building, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import clsx from 'clsx';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, token, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    { path: '/admin', icon: Activity, label: 'Overview' },
    { path: '/admin/users', icon: Users, label: 'User Management' },
    { path: '/admin/investments', icon: TrendingUp, label: 'Investments' },
    { path: '/admin/real-estate', icon: Building, label: 'Real Estate' },
    { path: '/admin/bots', icon: Bot, label: 'Trading Bots' },
    { path: '/admin/settings', icon: Settings, label: 'System Settings' },
  ];

  return (
    <div className="min-h-screen flex bg-graphite-950">
      {/* Desktop Sidebar */}
      <aside className="w-64 border-r border-white/10 flex-col hidden md:flex fixed h-full z-20 bg-graphite-900">
        <div className="p-6 border-b border-white/10">
          <Link to="/admin" className="flex items-center gap-2">
            <Settings className="w-6 h-6 text-accent-500" />
            <span className="font-bold tracking-tight text-white">Admin Portal</span>
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={clsx(
                  "flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 relative group",
                  isActive 
                    ? "text-accent-400 bg-accent-500/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]" 
                    : "text-silver-400 hover:bg-white/5 hover:text-white"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-nav-indicator"
                    className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-accent-500 rounded-r-full"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon className={clsx("w-5 h-5 transition-colors", isActive ? "text-accent-400" : "text-silver-500 group-hover:text-silver-300")} /> 
                {item.label}
              </Link>
            );
          })}

          {user?.role === 'super_admin' && (
            <div className="pt-4 mt-4 border-t border-white/10">
              <Link
                to="/dashboard"
                className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-silver-400 hover:bg-white/5 hover:text-white transition-all duration-200 group"
              >
                <ArrowLeft className="w-5 h-5 text-silver-500 group-hover:text-silver-300 transition-colors" /> Back to App
              </Link>
            </div>
          )}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-graphite-700 border border-white/10 flex items-center justify-center text-sm font-medium text-white shrink-0">
              {user?.fullName?.charAt(0) || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.fullName}</p>
              <p className="text-xs text-accent-400 truncate capitalize">{user?.role}</p>
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
              {navItems.find(item => item.path === location.pathname)?.label || 'Admin Portal'}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-500/10 border border-accent-500/20 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-accent-500"></span>
              <span className="text-accent-400">Admin Mode</span>
            </div>
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
                <Link to="/admin" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                  <Settings className="w-6 h-6 text-accent-500" />
                  <span className="font-bold tracking-tight text-white">Admin Portal</span>
                </Link>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-silver-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={clsx(
                        "flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 relative group",
                        isActive 
                          ? "text-accent-400 bg-accent-500/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]" 
                          : "text-silver-400 hover:bg-white/5 hover:text-white"
                      )}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="active-nav-indicator-mobile"
                          className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-accent-500 rounded-r-full"
                          initial={false}
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                      <Icon className={clsx("w-5 h-5 transition-colors", isActive ? "text-accent-400" : "text-silver-500 group-hover:text-silver-300")} /> 
                      {item.label}
                    </Link>
                  );
                })}

                {user?.role === 'super_admin' && (
                  <div className="pt-4 mt-4 border-t border-white/10">
                    <Link
                      to="/dashboard"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-silver-400 hover:bg-white/5 hover:text-white transition-all duration-200 group"
                    >
                      <ArrowLeft className="w-5 h-5 text-silver-500 group-hover:text-silver-300 transition-colors" /> Back to App
                    </Link>
                  </div>
                )}
              </nav>

              <div className="p-4 border-t border-white/10">
                <div className="flex items-center gap-3 px-4 py-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-graphite-700 border border-white/10 flex items-center justify-center text-sm font-medium text-white shrink-0">
                    {user?.fullName?.charAt(0) || 'A'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{user?.fullName}</p>
                    <p className="text-xs text-accent-400 truncate capitalize">{user?.role}</p>
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
