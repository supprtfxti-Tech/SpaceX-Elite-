import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Lock, Mail, ArrowRight, Loader2, ArrowLeft } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'motion/react';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional()
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      rememberMe: false
    }
  });
  
  const { login, isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(user.role === 'admin' || user.role === 'super_admin' ? '/admin' : '/dashboard');
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    const savedEmail = localStorage.getItem('spacex_remembered_email');
    if (savedEmail) {
      setValue('email', savedEmail);
      setValue('rememberMe', true);
    }
  }, [setValue]);

  const onSubmit = async (data: LoginForm) => {
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email, password: data.password }),
      });

      const resData = await res.json();

      if (!res.ok) {
        throw new Error(resData.error || 'Login failed');
      }

      if (data.rememberMe) {
        localStorage.setItem('spacex_remembered_email', data.email);
      } else {
        localStorage.removeItem('spacex_remembered_email');
      }

      login(resData.user, resData.token);
      if (resData.user.role === 'admin' || resData.user.role === 'super_admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
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
        className="w-full max-w-md bg-graphite-900/80 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/50 p-10 rounded-3xl relative z-10 overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        <div className="text-center mb-10">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-b from-white/10 to-transparent border border-white/10 mb-6 shadow-[0_0_30px_rgba(255,255,255,0.05)]"
          >
            <Lock className="w-7 h-7 text-white" />
          </motion.div>
          <h1 className="text-3xl font-medium mb-2 text-white tracking-tight">Welcome Back</h1>
          <p className="text-silver-400 text-sm font-light">Sign in to your institutional account</p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-xs font-medium text-silver-400 mb-1.5 uppercase tracking-wider">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-silver-500 group-focus-within:text-accent-500 transition-colors" />
              <input
                type="email"
                {...register('email')}
                className="w-full bg-graphite-900/50 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-accent-500 focus:bg-graphite-800 transition-all"
                placeholder="investor@example.com"
              />
            </div>
            {errors.email && <p className="text-red-400 text-xs mt-1.5">{errors.email.message}</p>}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-medium text-silver-400 uppercase tracking-wider">Password</label>
              <Link to="/forgot-password" className="text-xs text-accent-500 hover:text-accent-400 transition-colors">Forgot password?</Link>
            </div>
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

          <div className="flex items-center">
            <input
              type="checkbox"
              id="rememberMe"
              {...register('rememberMe')}
              className="w-4 h-4 rounded border-white/10 bg-graphite-900/50 text-accent-500 focus:ring-accent-500 focus:ring-offset-graphite-900"
            />
            <label htmlFor="rememberMe" className="ml-2 text-sm text-silver-400">
              Remember my email
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-white hover:bg-silver-200 text-graphite-900 py-3.5 rounded-xl font-semibold transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-4 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
            {!loading && <ArrowRight className="w-5 h-5" />}
          </button>
        </form>

        <p className="text-center text-sm text-silver-400 mt-8 font-light">
          Don't have an account?{' '}
          <Link to="/register" className="text-white hover:text-silver-200 font-medium transition-colors border-b border-white/30 hover:border-white">
            Apply now
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
