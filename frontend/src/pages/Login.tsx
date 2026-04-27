import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import {
  Loader2,
  Mail,
  Lock,
  User,
  Layers,
  Zap,
  ArrowRight,
  Soup,
  ShieldCheck,
  Globe2,
  ChevronRight,
  CircleDot
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('donor');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const response = await authAPI.login(email, password);
        navigateByRole(response.role);
      } else {
        await authAPI.register(email, password, fullName, role);
        setIsLogin(true);
        setError('success:Account created! Sign in to continue.');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const navigateByRole = (userRole: string) => {
    switch (userRole) {
      case 'donor': navigate('/donor'); break;
      case 'ngo': navigate('/ngo'); break;
      case 'farm': navigate('/farm'); break;
      default: setError('Unrecognized role.');
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Branding Side - Hidden on small screens */}
      <div className="hidden lg:flex w-1/2 bg-orange-600 relative overflow-hidden flex-col justify-between p-16">
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 mb-20"
          >
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
              <Soup className="w-6 h-6 text-orange-100" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight uppercase">Donato</span>
          </motion.div>

          <div className="max-w-md">
            <motion.h1
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-6xl font-extrabold text-white leading-tight mb-8"
            >
              Efficiency in <br />
              <span className="text-orange-200">Redistribution.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-orange-100/80 text-lg font-medium leading-relaxed"
            >
              AI-powered logistics connecting food surplus with communities in need, in real-time.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-12 flex flex-col gap-4"
            >
              <div className="flex items-center gap-3 text-orange-100/90 font-bold text-sm">
                <ShieldCheck className="w-5 h-5 text-orange-300" />
                <span>Enterprise-Grade Security Protocol</span>
              </div>
              <div className="flex items-center gap-3 text-orange-100/90 font-bold text-sm">
                <Globe2 className="w-5 h-5 text-orange-300" />
                <span>Global Resilience Network</span>
              </div>
              <div className="flex items-center gap-3 text-orange-100/90 font-bold text-sm">
                <CircleDot className="w-5 h-5 text-orange-300" />
                <span>Real-time Predictive Routing</span>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="text-orange-300/50 text-xs font-bold uppercase tracking-widest relative z-10">
          © 2026 Donato Platform • Professional Series
        </div>

        {/* Abstract Background Gradients */}
        <div className="absolute top-0 right-0 w-full h-full pointer-events-none">
          <div className="absolute -right-1/4 -top-1/4 w-full h-full bg-orange-500 rounded-full blur-[120px] opacity-50" />
          <div className="absolute -left-1/4 -bottom-1/4 w-full h-full bg-orange-700 rounded-full blur-[120px] opacity-50" />
        </div>
      </div>

      {/* Form Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="mb-10">
            <h2 className="text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-slate-500 font-medium">
              {isLogin ? 'Access your dashboard and manage operations.' : 'Join our network to optimize resource efficiency.'}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={isLogin ? 'login' : 'register'}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {!isLogin && (
                  <>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-wider">Full Name</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          required
                          className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all text-sm font-medium"
                          placeholder="Organization or Individual Name"
                        />
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-wider">Operational Role</label>
                      <div className="relative">
                        <select
                          value={role}
                          onChange={(e) => setRole(e.target.value)}
                          className="w-full h-12 pl-12 pr-10 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-orange-500 outline-none transition-all text-sm font-bold text-slate-700 appearance-none"
                        >
                          <option value="donor">Donor (Restaurant/F&B)</option>
                          <option value="ngo">NGO (Charity/Hub)</option>
                          <option value="farm">Farm (Recycling/Soil)</option>
                        </select>
                        <Layers className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                        <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 rotate-90 pointer-events-none" />
                      </div>
                    </div>
                  </>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-wider">Email Address</label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all text-sm font-medium"
                      placeholder="name@organization.com"
                    />
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-wider">Secure Password</label>
                  <div className="relative">
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all text-sm font-medium"
                      placeholder="••••••••••••"
                    />
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`p-4 rounded-xl text-xs font-bold ${error.includes('success:') ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'}`}
              >
                {error.replace('success:', '')}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-orange-600 hover:bg-orange-700 text-white rounded-xl shadow-lg shadow-orange-100 font-bold transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 text-center pt-6 border-t border-slate-100">
            <p className="text-slate-500 font-bold text-sm">
              {isLogin ? "New to the platform? " : "Already registered? "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-orange-600 font-extrabold hover:text-orange-700 transition-colors ml-1"
              >
                {isLogin ? 'Get Started' : 'Sign In'}
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}