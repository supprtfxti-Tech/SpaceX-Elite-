import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import DashboardLayout from '../components/DashboardLayout';
import { User, Mail, Globe, Calendar, ShieldCheck, ArrowUpRight, CreditCard, Building } from 'lucide-react';
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

export default function Profile() {
  const { token } = useAuthStore();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/users/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.text().then(text => text ? JSON.parse(text) : {});
          setProfile(data);
        }
      } catch (err) {
        console.error('Failed to fetch profile', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-8 h-8 border-2 border-accent-500 border-t-transparent rounded-full"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <motion.div 
        className="max-w-4xl mx-auto w-full space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Main Profile Card */}
        <motion.div variants={itemVariants} className="glass-panel p-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-accent-500/20 to-transparent opacity-50 pointer-events-none"></div>
          
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-10 relative z-10 text-center md:text-left">
            <div className="w-24 h-24 rounded-full bg-graphite-800 border-2 border-white/10 flex items-center justify-center text-3xl font-medium text-white shadow-xl shadow-black/50 shrink-0">
              {profile?.full_name?.charAt(0) || 'U'}
            </div>
            <div className="pt-2 flex-1">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                <h2 className="text-3xl font-bold text-white">{profile?.full_name}</h2>
                <button className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-medium text-white transition-colors">
                  Edit Profile
                </button>
              </div>
              <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 text-sm">
                <span className="px-3 py-1 rounded-full bg-white/10 text-silver-300 capitalize font-medium">
                  {profile?.role} Account
                </span>
                <span className={`px-3 py-1 rounded-full border font-medium capitalize flex items-center gap-1.5 ${
                  profile?.kyc_status === 'approved' 
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                    : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                }`}>
                  <ShieldCheck className="w-3.5 h-3.5" />
                  KYC: {profile?.kyc_status?.replace('_', ' ')}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
            <div className="group">
              <label className="block text-xs font-medium text-silver-400 mb-1.5 uppercase tracking-wider">Email Address</label>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-graphite-800/50 border border-white/5 group-hover:bg-graphite-800 transition-colors">
                <div className="p-2 rounded-lg bg-white/5 text-silver-400 group-hover:text-accent-400 transition-colors">
                  <Mail className="w-4 h-4" />
                </div>
                <span className="text-silver-100 font-medium">{profile?.email}</span>
              </div>
            </div>
            
            <div className="group">
              <label className="block text-xs font-medium text-silver-400 mb-1.5 uppercase tracking-wider">Phone Number</label>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-graphite-800/50 border border-white/5 group-hover:bg-graphite-800 transition-colors">
                <div className="p-2 rounded-lg bg-white/5 text-silver-400 group-hover:text-accent-400 transition-colors">
                  <User className="w-4 h-4" />
                </div>
                <span className="text-silver-100 font-medium">{profile?.phone || 'Not provided'}</span>
              </div>
            </div>
            
            <div className="group">
              <label className="block text-xs font-medium text-silver-400 mb-1.5 uppercase tracking-wider">Country of Residence</label>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-graphite-800/50 border border-white/5 group-hover:bg-graphite-800 transition-colors">
                <div className="p-2 rounded-lg bg-white/5 text-silver-400 group-hover:text-accent-400 transition-colors">
                  <Globe className="w-4 h-4" />
                </div>
                <span className="text-silver-100 font-medium">{profile?.country || 'Not provided'}</span>
              </div>
            </div>
            
            <div className="group">
              <label className="block text-xs font-medium text-silver-400 mb-1.5 uppercase tracking-wider">Member Since</label>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-graphite-800/50 border border-white/5 group-hover:bg-graphite-800 transition-colors">
                <div className="p-2 rounded-lg bg-white/5 text-silver-400 group-hover:text-accent-400 transition-colors">
                  <Calendar className="w-4 h-4" />
                </div>
                <span className="text-silver-100 font-medium">
                  {new Date(profile?.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Account Limits */}
          <motion.div variants={itemVariants} className="glass-panel p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <ArrowUpRight className="w-5 h-5 text-accent-500" />
              Account Limits
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-silver-300">Daily Withdrawal Limit</span>
                  <span className="text-white font-medium">$50,000 / $100,000</span>
                </div>
                <div className="w-full bg-graphite-800 rounded-full h-2 overflow-hidden">
                  <div className="bg-accent-500 h-2 rounded-full" style={{ width: '50%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-silver-300">Monthly Deposit Limit</span>
                  <span className="text-white font-medium">$250,000 / $500,000</span>
                </div>
                <div className="w-full bg-graphite-800 rounded-full h-2 overflow-hidden">
                  <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '50%' }}></div>
                </div>
              </div>
              <div className="pt-4 mt-4 border-t border-white/5">
                <button className="text-accent-400 hover:text-accent-300 text-sm font-medium transition-colors flex items-center gap-1">
                  Request Limit Increase <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Connected Accounts */}
          <motion.div variants={itemVariants} className="glass-panel p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Building className="w-5 h-5 text-accent-500" />
              Funding Sources
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-graphite-800/50 border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/5 rounded-lg">
                    <Building className="w-4 h-4 text-silver-300" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">JPMorgan Chase</p>
                    <p className="text-xs text-silver-400">Checking •••• 4092</p>
                  </div>
                </div>
                <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-wider rounded">Verified</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-graphite-800/50 border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/5 rounded-lg">
                    <CreditCard className="w-4 h-4 text-silver-300" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Corporate Card</p>
                    <p className="text-xs text-silver-400">Mastercard •••• 8821</p>
                  </div>
                </div>
                <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-wider rounded">Verified</span>
              </div>
              <button className="w-full py-3 mt-2 border border-dashed border-white/10 hover:border-accent-500/50 hover:bg-accent-500/5 rounded-lg text-sm font-medium text-silver-300 hover:text-white transition-all flex items-center justify-center gap-2">
                + Add Funding Source
              </button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
