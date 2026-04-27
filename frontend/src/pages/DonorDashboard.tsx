import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import FoodUploadForm from '../components/FoodUploadForm';
import DonationCard from '../components/DonationCard';
import StatsCard from '../components/StatsCard';
import { donorAPI } from '../services/api';
import {
  Package,
  Plus,
  Activity,
  Globe,
  Loader2,
  ChevronRight,
  History,
  TrendingUp,
  BarChart2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DonorDashboard() {
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [donations, setDonations] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDonorData();
  }, []);

  const playPop = () => {
    try {
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3');
      audio.volume = 0.5;
      audio.play().catch(e => console.warn("Audio playback failed:", e));
    } catch (err) {
      console.warn("Audio initialization failed:", err);
    }
  };

  const fetchDonorData = async () => {
    setLoading(true);
    try {
      const [donationHistory, analyticsData] = await Promise.all([
        donorAPI.getDonationHistory(),
        donorAPI.getAnalytics(),
      ]);
      setDonations(donationHistory.donations || []);
      setAnalytics(analyticsData);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Unable to synchronise with the neural network.');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSuccess = () => {
    setShowUploadForm(false);
    fetchDonorData();
  };

  if (loading) {
    return (
      <DashboardLayout role="donor">
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
          <Loader2 className="w-10 h-10 text-orange-600 animate-spin" />
          <p className="text-sm font-black text-slate-400 uppercase tracking-widest animate-pulse">Synchronizing Personal Command...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="donor">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Operational Status: Live</span>
            </div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Personal Impact Command</h2>
            <p className="text-slate-500 font-bold text-sm">Monitor your global food redistribution contributions and active AI scans.</p>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { playPop(); setShowUploadForm(!showUploadForm); }}
            className="h-14 bg-orange-600 hover:bg-orange-700 text-white px-8 rounded-2xl shadow-xl shadow-orange-100 font-black flex items-center gap-3 transition-all"
          >
            {showUploadForm ? <ChevronRight className="w-5 h-5 rotate-90" /> : <Plus className="w-5 h-5" />}
            <span className="uppercase tracking-widest text-xs">{showUploadForm ? 'Collapse Interface' : 'Initiate New Donation'}</span>
          </motion.button>
        </div>

        {/* Upload Form - Collapsible */}
        <AnimatePresence>
          {showUploadForm && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="py-4"
            >
              <div className="glass-card p-12 bg-white/50 backdrop-blur-xl border-orange-100 shadow-2xl shadow-orange-100/30 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50" />
                <FoodUploadForm onSuccess={handleUploadSuccess} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tactical Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <StatsCard
            title="Total Contribution"
            value={analytics?.total_donated || 0}
            icon={Package}
            variant="amber"
            subtitle="Lifetime Operational Units"
            trend={{ value: '18%', isUp: true }}
          />
          <StatsCard
            title="Efficacy Index"
            value={`${((analytics?.successful_deliveries / (analytics?.total_donated || 1)) * 100).toFixed(0)}%`}
            icon={Activity}
            variant="emerald"
            subtitle="Verified Delivery Success"
            trend={{ value: '14%', isUp: true }}
          />
          <StatsCard
            title="Eco Footprint"
            value={`${(analytics?.wastage_prevented * 2.5).toFixed(1)}kg`}
            icon={Globe}
            variant="indigo"
            subtitle="Carbon Offset Credit"
          />
        </div>

        {/* Main Content Areas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Active History */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
                  <History className="w-5 h-5 text-slate-400" />
                </div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Recent Redistribution Logs</h3>
              </div>
              <button className="text-[10px] font-black text-orange-600 hover:text-orange-700 uppercase tracking-widest bg-orange-50 px-4 py-2 rounded-lg transition-colors border border-orange-100">Synchronize All</button>
            </div>

            {donations.length === 0 ? (
              <div className="glass-card p-24 text-center border-dashed border-2">
                <Package className="w-16 h-16 text-slate-200 mx-auto mb-6" />
                <p className="text-slate-500 font-bold max-w-xs mx-auto">No operational donations detected in the local neural history.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {donations.map((d, i) => (
                  <DonationCard key={d._id || i} donation={d} />
                ))}
              </div>
            )}
          </div>

          {/* Impact Insights */}
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
                <TrendingUp className="w-5 h-5 text-slate-400" />
              </div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">AI Insights</h3>
            </div>

            <div className="space-y-6">
              <div className="glass-card p-8 space-y-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-3xl translate-x-12 -translate-y-12 opacity-50 group-hover:scale-110 transition-transform duration-700" />
                <div className="flex items-center gap-3 relative z-10">
                  <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-100">
                    <BarChart2 className="w-5 h-5 text-emerald-600" />
                  </div>
                  <span className="text-xs font-black text-slate-600 uppercase tracking-widest">Wastage Prevented</span>
                </div>
                <div className="flex items-baseline gap-3 relative z-10">
                  <span className="text-5xl font-black text-slate-900 tracking-tight">{analytics?.wastage_prevented || 0}</span>
                  <span className="text-slate-400 font-black text-sm uppercase">Metric Tonnes</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-white">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '65%' }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                  />
                </div>
              </div>

              <div className="glass-card p-8 bg-slate-900 text-white border-none shadow-2xl shadow-slate-200 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-transparent" />
                <div className="relative z-10">
                  <h4 className="text-[10px] font-black opacity-60 uppercase tracking-[0.2em] mb-4">Strategic Objective</h4>
                  <p className="text-2xl font-black leading-tight">Achieve <span className="text-orange-400">500kg</span> Cumulative Offset</p>
                  <div className="mt-8 flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm group-hover:bg-white/10 transition-all">
                    <span className="text-xs font-black uppercase tracking-widest opacity-80">65% Progress</span>
                    <ChevronRight className="w-5 h-5 text-orange-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
