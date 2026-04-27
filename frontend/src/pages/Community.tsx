import DashboardLayout from '../components/DashboardLayout';
import { Users, ShieldCheck, MapPin, Search, BellRing, CheckCircle2, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Community() {
  const role = window.location.pathname.split('/')[1];

  const stakeholders = [
    { name: "Kongu Charity NGO", type: "NGO", location: "Tiruchengode-Main", verified: true },
    { name: "Santhosa Child Home", type: "Orphanage", location: "Kailasampalayam, Tiruchengode", verified: true },
    { name: "Tiruchengode Food Bank", type: "NGO", location: "Salem Road, Tiruchengode", verified: true },
    { name: "Vivekananda Ashram", type: "Orphanage", location: "CHB Colony, Tiruchengode", verified: true },
    { name: "Namakkal Bio-Recyclers", type: "Farm", location: "Namakkal-Tiruchengode Belt", verified: true },
    { name: "Arulmigu Child Care", type: "Orphanage", location: "Velur Road, Tiruchengode", verified: true },
  ];

  const notifications = [
    { id: 1, message: "Santhosa Child Home received 20kg Meals via Kongu Charity. Verified with OTP.", time: "2h ago", donor: "Hotel Residency" },
    { id: 2, message: "Vivekananda Ashram received idli/dosa packets. Quality scan: 98%.", time: "5h ago", donor: "Saravana Bhavan" },
    { id: 3, message: "Arulmigu Child Care confirmed handoff from Tiruchengode Food Bank.", time: "1d ago", donor: "Local Donor Group" },
  ];

  return (
    <DashboardLayout role={role}>
      <div className="max-w-7xl mx-auto py-10 space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 text-left border-b border-slate-100 pb-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Live Network: Tiruchengode Sector</span>
            </div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight uppercase">Strategic Community Hub</h2>
            <p className="text-slate-500 font-bold max-w-lg">Collaborate with verified operational partners and orphanages in Tiruchengode, Tamil Nadu.</p>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search Tiruchengode Network..."
              className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 outline-none transition-all text-sm font-bold"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Network List */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-8">
              <Users className="w-6 h-6 text-slate-900" />
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Verified Entities</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {stakeholders.map((s, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.02 }}
                  className="glass-card p-6 bg-white shadow-xl shadow-slate-100 group cursor-pointer border border-transparent hover:border-indigo-100 transition-all"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${s.type === 'NGO' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                        s.type === 'Orphanage' ? 'bg-rose-50 text-rose-600 border border-rose-100' :
                          'bg-amber-50 text-amber-600 border border-amber-100'
                      }`}>
                      {s.type}
                    </div>
                    {s.verified && <ShieldCheck className="w-5 h-5 text-indigo-500" />}
                  </div>
                  <h3 className="text-lg font-black text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors uppercase tracking-tight leading-tight">{s.name}</h3>
                  <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{s.location}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Activity Feed */}
          <div className="space-y-8">
            <div className="flex items-center gap-3 mb-8">
              <BellRing className="w-6 h-6 text-slate-900" />
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Delivery Newsfeed</h3>
            </div>
            <div className="space-y-6">
              {notifications.map((n) => (
                <motion.div
                  key={n.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="glass-card p-6 bg-slate-900 text-white border-none shadow-2xl relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-20" />
                  <div className="flex gap-4 relative z-10">
                    <div className="shrink-0 w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                      <Heart className="w-5 h-5 text-rose-400 fill-current" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs font-bold text-slate-300 leading-relaxed italic">"{n.message}"</p>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{n.donor}</span>
                        <div className="w-1 h-1 rounded-full bg-slate-600" />
                        <span className="text-[10px] font-bold text-slate-500 uppercase">{n.time}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}

              <div className="p-8 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-center space-y-4">
                <CheckCircle2 className="w-8 h-8 text-slate-200" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">End of Daily Logs</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
