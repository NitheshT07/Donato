import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import DonationCard from '../components/DonationCard';
import StatsCard from '../components/StatsCard';
import { farmAPI } from '../services/api';
import {
  Recycle,
  Sprout,
  Leaf,
  Activity,
  Sun,
  AlertCircle,
  Loader2,
  Wind,
  Search,
  History,
  TrendingUp,
  FlaskConical
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FarmDashboard() {
  const [activeTab, setActiveTab] = useState<'recovery' | 'compost'>('recovery');
  const [requests, setRequests] = useState<any[]>([]);
  const [compostItems, setCompostItems] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState<string>('');

  useEffect(() => {
    fetchFarmData();
  }, []);

  const fetchFarmData = async () => {
    setLoading(true);
    try {
      const [requestsData, compostData, analyticsData] = await Promise.all([
        farmAPI.getIncomingRequests(),
        farmAPI.getCompostTracking(),
        farmAPI.getAnalytics(),
      ]);
      setRequests(requestsData.requests || []);
      setCompostItems(compostData.items || []);
      setAnalytics(analyticsData);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Resource protocol sync failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (requestId: string) => {
    setActionLoading(requestId);
    try {
      await farmAPI.acceptRequest(requestId);
      await fetchFarmData();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Unable to synchronize biomass intake request.');
    } finally {
      setActionLoading('');
    }
  };

  if (loading) {
    return (
      <DashboardLayout role="farm">
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
          <Loader2 className="w-10 h-10 text-amber-600 animate-spin" />
          <p className="text-sm font-black text-slate-400 uppercase tracking-widest animate-pulse">Synchronizing Organic Command...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="farm">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Bio-Cycle: Active</span>
            </div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Resource Command</h2>
            <p className="text-slate-500 font-bold text-sm">Manage large-scale biomass intake and track organic transformation lifecycles.</p>
          </div>

          <div className="flex bg-slate-100/50 p-1.5 rounded-2xl border border-slate-200 backdrop-blur-sm shadow-inner">
            <button
              onClick={() => setActiveTab('recovery')}
              className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'recovery' ? 'bg-amber-600 text-white shadow-lg shadow-amber-100' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Queue {requests.length > 0 && `(${requests.length})`}
            </button>
            <button
              onClick={() => setActiveTab('compost')}
              className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'compost' ? 'bg-amber-600 text-white shadow-lg shadow-amber-100' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Bio-Transformation
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <StatsCard
            title="Biomass Recovered"
            value={analytics?.waste_recycled || 0}
            icon={Recycle}
            variant="emerald"
            subtitle="Total Intake Weight (KG)"
            trend={{ value: '22%', isUp: true }}
          />
          <StatsCard
            title="Production Yield"
            value={analytics?.compost_produced || 0}
            icon={Sprout}
            variant="amber"
            subtitle="Organic Output Produced"
            trend={{ value: '18%', isUp: true }}
          />
          <StatsCard
            title="Carbon Mitigation"
            value={`${analytics?.co2_offset || 0}kg`}
            icon={Wind}
            variant="indigo"
            subtitle="Net Greenhouse Offset"
          />
        </div>

        {error && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-6 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-4 text-rose-800 shadow-sm">
            <AlertCircle className="w-6 h-6 text-rose-500" />
            <p className="font-bold">{error}</p>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {activeTab === 'recovery' ? (
            <motion.div key="req" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">Incoming Feedstock</h3>
                </div>
                <div className="px-4 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  Live Resource Stream
                </div>
              </div>

              {requests.length === 0 ? (
                <div className="glass-card p-24 text-center border-dashed border-2">
                  <Leaf className="w-16 h-16 text-slate-200 mx-auto mb-6" />
                  <h4 className="text-xl font-black text-slate-900 mb-2">Queue Optimized</h4>
                  <p className="text-slate-500 font-bold max-w-xs mx-auto">No pending biomass recovery requests detected in your operational sector.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {requests.map((r, i) => (
                    <DonationCard key={r._id || i} donation={r} showActions onAccept={handleAccept} actionLoading={actionLoading} />
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div key="track" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-12">
              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
                    <History className="w-5 h-5 text-slate-400" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">Transformation History</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {compostItems.length === 0 ? (
                    <div className="col-span-full glass-card p-20 text-center border-dashed border-2">
                      <FlaskConical className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                      <p className="text-slate-500 font-bold">No active organic transformation logs on record.</p>
                    </div>
                  ) : (
                    compostItems.map((c, i) => (
                      <DonationCard key={c._id || i} donation={c} />
                    ))
                  )}
                </div>
              </div>

              <div className="glass-card p-10 bg-gradient-to-br from-amber-500 to-amber-600 text-white border-none shadow-2xl shadow-amber-200 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-700" />
                <div className="flex items-center justify-between relative z-10">
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Sustainability Milestone</h4>
                    <p className="text-3xl font-black leading-none">You've diverted <span className="text-slate-900 underline decoration-4 decoration-white/30">2,500kg</span> from Landfills!</p>
                  </div>
                  <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20">
                    <TrendingUp className="w-10 h-10" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
