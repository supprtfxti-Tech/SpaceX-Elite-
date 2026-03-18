import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import DashboardLayout from '../components/DashboardLayout';
import { Shield, Smartphone, Monitor, Clock } from 'lucide-react';
import { motion } from 'motion/react';

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

export default function Security() {
  const { token } = useAuthStore();
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await fetch('/api/auth/sessions', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.text().then(text => text ? JSON.parse(text) : {});
          setSessions(data);
        }
      } catch (err) {
        console.error('Failed to fetch sessions', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [token]);

  return (
    <DashboardLayout>
      <motion.div 
        className="max-w-4xl mx-auto w-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="glass-panel p-8 mb-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-accent-500/10 rounded-xl border border-accent-500/20">
              <Shield className="w-6 h-6 text-accent-500" />
            </div>
            <h2 className="text-2xl font-bold text-white">Security Settings</h2>
          </div>
          
          <motion.div variants={itemVariants} className="p-5 rounded-xl bg-graphite-800/50 border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4 hover:bg-graphite-800 transition-colors">
            <div>
              <h3 className="text-lg font-medium text-white mb-1">Two-Factor Authentication (2FA)</h3>
              <p className="text-sm text-silver-400">Add an extra layer of security to your account to prevent unauthorized access.</p>
            </div>
            <button className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-lg transition-colors whitespace-nowrap">
              Enable 2FA
            </button>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h3 className="text-lg font-medium text-white mb-2">Active Sessions</h3>
            <p className="text-sm text-silver-400 mb-6">These devices are currently signed in to your account. Revoke any sessions you do not recognize.</p>
            
            {loading ? (
              <div className="flex justify-center p-8">
                <div className="animate-spin w-6 h-6 border-2 border-accent-500 border-t-transparent rounded-full"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {sessions.map((session, idx) => {
                  const isCurrent = idx === 0; // Simplified assumption for prototype
                  const isMobile = session.device_info.toLowerCase().includes('mobile');
                  
                  return (
                    <motion.div 
                      variants={itemVariants}
                      key={session.id} 
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-xl bg-graphite-800/50 border border-white/5 hover:bg-graphite-800 transition-colors gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-graphite-700 border border-white/10 flex items-center justify-center shrink-0">
                          {isMobile ? <Smartphone className="w-5 h-5 text-silver-300" /> : <Monitor className="w-5 h-5 text-silver-300" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <p className="font-medium text-silver-100">{session.device_info}</p>
                            {isCurrent && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
                                Current
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-silver-400">
                            <span className="font-mono bg-white/5 px-1.5 py-0.5 rounded">IP: {session.ip_address}</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(session.created_at).toLocaleString(undefined, { 
                                year: 'numeric', month: 'short', day: 'numeric', 
                                hour: '2-digit', minute: '2-digit' 
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                      {!isCurrent && (
                        <button className="text-sm text-red-400 hover:text-red-300 hover:bg-red-400/10 px-4 py-2 rounded-lg font-medium transition-colors">
                          Revoke
                        </button>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
}
