import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { donorAPI } from '../services/api';
import { BarChart3, TrendingUp, ShieldCheck, Globe, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Analytics() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const role = window.location.pathname.split('/')[1];

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const resp = await donorAPI.getAnalytics();
      setData(resp);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout role={role}>
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
          <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
          <p className="text-sm font-black text-slate-400 uppercase tracking-widest animate-pulse">Aggregating Neural Data...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role={role}>
      <div className="max-w-7xl mx-auto py-10 space-y-12">
        <div className="flex items-center justify-between">
          <h2 className="text-4xl font-black text-slate-900 tracking-tight uppercase">Operational Intelligence</h2>
          <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-xl border border-indigo-100">
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Live Sync: Active</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { label: 'Total Weight', value: `${(data?.total_donated * 0.5).toFixed(1)}kg`, icon: Globe, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Impact Score', value: '94.2', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Success Rate', value: '98%', icon: ShieldCheck, color: 'text-orange-600', bg: 'bg-orange-50' },
            { label: 'Network Points', value: '2.4k', icon: BarChart3, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          ].map((stat, i) => (
            <motion.div key={i} whileHover={{ y: -5 }} className="glass-card p-6 border-slate-100 shadow-xl shadow-slate-100/50">
              <div className={`${stat.bg} ${stat.color} w-10 h-10 rounded-xl flex items-center justify-center mb-4 border`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</h3>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="glass-card p-10 bg-white shadow-2xl shadow-slate-200/50">
            <h3 className="text-xl font-black text-slate-900 mb-8 border-b border-slate-100 pb-4 uppercase tracking-tight">Redistribution Efficiency</h3>
            <div className="space-y-8">
              {[
                { label: 'NGO Acceptance Speed', val: 85, color: 'bg-indigo-500' },
                { label: 'Logistic Routing Accuracy', val: 92, color: 'bg-emerald-500' },
                { label: 'Carbon Offset Fulfillment', val: 64, color: 'bg-blue-500' },
              ].map((bar, i) => (
                <div key={i} className="space-y-3">
                  <div className="flex justify-between text-xs font-black uppercase tracking-widest text-slate-500">
                    <span>{bar.label}</span>
                    <span>{bar.val}%</span>
                  </div>
                  <div className="h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-white shadow-inner">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${bar.val}%` }}
                      transition={{ duration: 1.5, delay: i * 0.2 }}
                      className={`h-full ${bar.color} rounded-full shadow-[0_0_10px_rgba(0,0,0,0.1)]`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-10 bg-slate-900 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10">
              <h3 className="text-xl font-black mb-8 border-b border-white/10 pb-4 uppercase tracking-tight">Strategic Forecasting</h3>
              <p className="text-slate-400 font-bold mb-8 italic">"Your current redistribution trajectory will prevent 120kg of methane emissions by within the next 30 days based on current patterns."</p>
              <div className="grid grid-cols-2 gap-6">
                <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                  <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Next Milestone</p>
                  <p className="text-2xl font-black">500kg Saved</p>
                </div>
                <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                  <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Global Ranking</p>
                  <p className="text-2xl font-black">#14 Sector</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
