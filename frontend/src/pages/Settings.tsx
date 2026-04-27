import DashboardLayout from '../components/DashboardLayout';
import { Settings as SettingsIcon, User, Lock, Bell, Shield, Smartphone, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Settings() {
  const role = window.location.pathname.split('/')[1];

  const sections = [
    { title: 'Neural Profile', icon: User, desc: 'Manage your operational identity and sector credentials.' },
    { title: 'Security Protocol', icon: Lock, desc: 'Update encryption keys and access credentials.' },
    { title: 'Redistribution Alerts', icon: Bell, desc: 'Configure real-time push and molecular event notifications.' },
    { title: 'Regional Trust', icon: Shield, desc: 'View and manage your verification status and certifications.' },
    { title: 'Mobile Integration', icon: Smartphone, desc: 'Link operational devices for real-time logistics tracking.' },
    { title: 'Global Protocol', icon: Globe, desc: 'System language and regional compliance standards.' },
  ];

  return (
    <DashboardLayout role={role}>
      <div className="max-w-7xl mx-auto py-10 space-y-12">
        <h2 className="text-4xl font-black text-slate-900 tracking-tight uppercase">System Settings</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <div className="glass-card p-10 bg-white shadow-2xl shadow-slate-200/50">
              <h3 className="text-xl font-black text-slate-900 mb-8 border-b border-slate-100 pb-4 uppercase tracking-tight">Identity & Sector</h3>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Display Name</label>
                    <input type="text" defaultValue="Regional Distribution Hub" className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 outline-none transition-all font-bold text-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Operational Email</label>
                    <input type="email" defaultValue="ops@donato.org" className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 outline-none transition-all font-bold text-sm" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Bio / Operational Focus</label>
                  <textarea rows={3} className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 outline-none transition-all font-bold text-sm resize-none" placeholder="Describe your redistribution goals..." />
                </div>
                <button type="button" className="px-8 py-3 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-black transition-all">
                  Update Identity
                </button>
              </form>
            </div>
          </div>

          <div className="space-y-8">
            {sections.map((s, i) => (
              <motion.div
                key={i}
                whileHover={{ x: 5 }}
                className="flex items-start gap-4 p-6 glass-card border-none shadow-md cursor-pointer hover:bg-indigo-50/30 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center border border-slate-100 shadow-sm text-indigo-600">
                  <s.icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-black text-slate-900 text-sm uppercase tracking-tight">{s.title}</h4>
                  <p className="text-[10px] text-slate-400 font-bold leading-relaxed">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
