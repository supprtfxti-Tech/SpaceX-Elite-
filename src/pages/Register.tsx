import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { User, Mail, Lock, Globe, ArrowRight, Loader2, ShieldCheck, ArrowLeft } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'motion/react';

const registerSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  country: z.string().min(2, 'Country is required')
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function Register() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema)
  });

  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const onSubmit = async (data: RegisterForm) => {
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const resData = await res.json();

      if (!res.ok) {
        throw new Error(resData.error || 'Registration failed');
      }

      login(resData.user, resData.token);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-12 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-accent-500/10 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-500/10 blur-[120px]"></div>
      </div>

      <div className="absolute top-6 left-6 z-20">
        <Link to="/" className="flex items-center gap-2 text-silver-400 hover:text-white transition-colors text-sm font-medium">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-2xl bg-graphite-900/80 backdrop-blur-xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] p-10 md:p-14 rounded-3xl relative z-10 overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        
        <div className="mb-12 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-silver-400 mb-6 uppercase tracking-widest">
            <ShieldCheck className="w-3 h-3 text-emerald-500" />
            Secure 256-bit Encryption
          </div>
          <h1 className="text-3xl md:text-4xl font-medium mb-3 bg-gradient-to-r from-white to-silver-300 bg-clip-text text-transparent tracking-tight">Private Client Application</h1>
          <p className="text-silver-400 text-sm font-light max-w-md leading-relaxed">
            Initiate your institutional onboarding process. All information is securely encrypted and stored in compliance with regulatory standards.
          </p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-xs font-medium text-silver-400 mb-1.5 uppercase tracking-wider">Full Legal Name</label>
              <div className="relative group">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-silver-500 group-focus-within:text-accent-500 transition-colors" />
                <input
                  type="text"
                  {...register('fullName')}
                  className="w-full bg-graphite-900/50 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-accent-500 focus:bg-graphite-800 transition-all"
                  placeholder="As it appears on your ID"
                />
              </div>
              {errors.fullName && <p className="text-red-400 text-xs mt-1.5">{errors.fullName.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-silver-400 mb-1.5 uppercase tracking-wider">Corporate Email</label>
              <div className="relative group">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-silver-500 group-focus-within:text-accent-500 transition-colors" />
                <input
                  type="email"
                  {...register('email')}
                  className="w-full bg-graphite-900/50 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-accent-500 focus:bg-graphite-800 transition-all"
                  placeholder="investor@company.com"
                />
              </div>
              {errors.email && <p className="text-red-400 text-xs mt-1.5">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-silver-400 mb-1.5 uppercase tracking-wider">Primary Residence</label>
              <div className="relative group">
                <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-silver-500 group-focus-within:text-accent-500 transition-colors" />
                <input
                  type="text"
                  {...register('country')}
                  className="w-full bg-graphite-900/50 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-accent-500 focus:bg-graphite-800 transition-all"
                  placeholder="e.g. Switzerland"
                />
              </div>
              {errors.country && <p className="text-red-400 text-xs mt-1.5">{errors.country.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-silver-400 mb-1.5 uppercase tracking-wider">Secure Password</label>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-silver-500 group-focus-within:text-accent-500 transition-colors" />
                <input
                  type="password"
                  {...register('password')}
                  className="w-full bg-graphite-900/50 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-accent-500 focus:bg-graphite-800 transition-all"
                  placeholder="••••••••"
                />
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1.5">{errors.password.message}</p>}
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-white hover:bg-silver-200 text-graphite-900 py-4 rounded-xl font-semibold transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Initiate Onboarding <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-8 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-silver-400 font-light">
            Already a client?{' '}
            <Link to="/login" className="text-white hover:text-silver-200 font-medium transition-colors border-b border-white/30 hover:border-white pb-0.5">
              Sign in
            </Link>
          </p>
          <p className="text-[10px] text-silver-500 font-mono uppercase tracking-wider">
            Protected by Institutional Grade Security
          </p>
        </div>
      </motion.div>
    </div>
  );
}
