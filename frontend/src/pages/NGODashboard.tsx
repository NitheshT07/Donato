import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import DonationCard from '../components/DonationCard';
import StatsCard from '../components/StatsCard';
import MapView from '../components/MapView';
import { ngoAPI } from '../services/api';
import {
  Shield,
  Truck,
  Package,
  Activity,
  AlertCircle,
  Loader2,
  Map as MapIcon,
  ChevronRight,
  Search,
  LayoutDashboard,
  Navigation
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function NGODashboard() {
  const [activeTab, setActiveTab] = useState<'requests' | 'logistics'>('requests');
  const [requests, setRequests] = useState<any[]>([]);
  const [deliveries, setDeliveries] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState<string>('');

  useEffect(() => {
    fetchNGOData();
  }, []);

  const fetchNGOData = async () => {
    setLoading(true);
    try {
      const [requestsData, deliveriesData, analyticsData] = await Promise.all([
        ngoAPI.getIncomingRequests(),
        ngoAPI.getDeliveryTracking(),
        ngoAPI.getAnalytics(),
      ]);
      setRequests(requestsData.requests || []);
      setDeliveries(deliveriesData.deliveries || []);
      setAnalytics(analyticsData);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Logistics sync failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (donationId: string) => {
    setActionLoading(donationId);
    try {
      await ngoAPI.acceptDonation(donationId);
      await fetchNGOData();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Unable to accept request.');
    } finally {
      setActionLoading('');
    }
  };

  const handleTrack = (location: string) => {
    if (location) {
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`, '_blank');
    }
  };

  if (loading) {
    return (
      <DashboardLayout role="ngo">
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
          <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
          <p className="text-sm font-black text-slate-400 uppercase tracking-widest animate-pulse">Synchronizing logistics hub...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="ngo">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-2">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Logistics Command</h2>
            <p className="text-slate-500 font-bold text-sm">Coordinate hyper-local redistribution and track active delivery vectors.</p>
          </div>

          <div className="flex bg-slate-100/50 p-1.5 rounded-2xl border border-slate-200 backdrop-blur-sm shadow-inner">
            <button
              onClick={() => setActiveTab('requests')}
              className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'requests' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-100' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Intelligence Queue {requests.length > 0 && `(${requests.length})`}
            </button>
            <button
              onClick={() => setActiveTab('logistics')}
              className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'logistics' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-100' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Active Vectors
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <StatsCard
            title="Total Logistics"
            value={analytics?.total_received || 0}
            icon={Package}
            variant="emerald"
            subtitle="Units Successfully Processed"
            trend={{ value: '12%', isUp: true }}
          />
          <StatsCard
            title="Live Shipments"
            value={deliveries.filter(d => d.status !== 'Delivered').length}
            icon={Truck}
            variant="indigo"
            subtitle="Vectors in Active Transit"
          />
          <StatsCard
            title="Efficacy Index"
            value={`${analytics?.success_rate || 98}%`}
            icon={Shield}
            variant="amber"
            subtitle="Operational Success Metric"
            trend={{ value: '2.4%', isUp: true }}
          />
        </div>

        {error && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-6 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-4 text-rose-800 shadow-sm">
            <AlertCircle className="w-6 h-6 text-rose-500" />
            <p className="font-bold">{error}</p>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {activeTab === 'requests' ? (
            <motion.div key="req" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">Available Requests</h3>
                </div>
                <div className="px-4 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  Real-time Feed
                </div>
              </div>

              {requests.length === 0 ? (
                <div className="glass-card p-24 text-center border-dashed border-2 border-slate-200">
                  <LayoutDashboard className="w-16 h-16 text-slate-200 mx-auto mb-6" />
                  <h4 className="text-xl font-black text-slate-900 mb-2">Queue Clear</h4>
                  <p className="text-slate-500 font-bold max-w-xs mx-auto">All redistribution requests in your sector have been successfully synchronized.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {requests.map((r, i) => (
                    <DonationCard
                      key={r._id || i}
                      donation={r}
                      showActions
                      onAccept={handleAccept}
                      onTrack={handleTrack}
                      actionLoading={actionLoading}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div key="track" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-10">
              <div className="glass-card overflow-hidden shadow-2xl shadow-slate-200/50">
                <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-white/50 backdrop-blur-md">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center border border-emerald-100">
                      <MapIcon className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-slate-900 tracking-tight">Master Operations Map</h3>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Global delivery synchronization</p>
                    </div>
                  </div>
                  <div className="flex gap-6">
                    <div className="flex items-center gap-2.5 text-[10px] font-black text-slate-600 uppercase tracking-widest">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" /> Donor Source
                    </div>
                    <div className="flex items-center gap-2.5 text-[10px] font-black text-slate-600 uppercase tracking-widest">
                      <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]" /> Logistics Hub
                    </div>
                  </div>
                </div>
                <div className="h-[500px] relative bg-slate-50">
                  <MapView
                    donorLocation={{ lat: 12.9716, lng: 77.5946, label: "Live Pickup" }}
                    destinationLocation={{ lat: 12.9279, lng: 77.6271, label: "Main Hub" }}
                  />
                </div>
              </div>

              <div className="space-y-8">
                <div className="flex items-center gap-3">
                  <Truck className="w-6 h-6 text-slate-900" />
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">Active Delivery Vectors</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {deliveries.length === 0 ? (
                    <div className="col-span-full glass-card p-16 text-center border-dashed border-2">
                      <Truck className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                      <p className="text-slate-500 font-bold">No active logistics operations in transit.</p>
                    </div>
                  ) : (
                    deliveries.map((d, i) => (
                      <DonationCard
                        key={d._id || i}
                        donation={d}
                        onTrack={handleTrack}
                      />
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
