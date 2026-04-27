import { useState, useEffect } from 'react';
import { Package, MapPin, Clock, CheckCircle, Navigation, Loader2, ThermometerSun, ChevronRight, Zap, ShieldCheck, Globe2, Trash2, CheckCircle2, Waves, Soup, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BASE_API_URL } from '../services/api';

interface DonationCardProps {
  donation: {
    _id?: string;
    id?: string;
    food_type: string;
    quantity: string;
    status: string;
    image_url?: string;
    location?: string;
    assigned_to?: string;
    freshness?: string;
    otp?: string;
    created_at?: string;
    prepared_time?: string;
    expiry_time?: string;
  };
  userRole?: string;
  showActions?: boolean;
  onAccept?: (id: string) => void;
  onReject?: (id: string) => void;
  onDelete?: (id: string) => void;
  onTrack?: (location: string) => void;
  actionLoading?: string;
}

export default function DonationCard({
  donation,
  userRole,
  showActions = false,
  onAccept,
  onReject,
  onDelete,
  onTrack,
  actionLoading
}: DonationCardProps) {
  const donationId = donation._id || donation.id || '';
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [timerPercent, setTimerPercent] = useState(100);

  useEffect(() => {
    // Neural Waste / Spoiled check
    const isSpoiled = donation.freshness && donation.freshness !== 'Fresh';

    if (isSpoiled) {
      setTimeLeft('EXPIRED');
      setTimerPercent(0);
      return;
    }

    if (!donation.expiry_time) return;

    // Use backend-calculated expiry time as the source of truth
    const expiryTime = new Date(donation.expiry_time).getTime();

    // Calculate total duration for progress bar (fallback to 6h if created_at is missing)
    const startTime = new Date(donation.prepared_time || donation.created_at || new Date()).getTime();
    const totalDuration = expiryTime - startTime;

    const updateTimer = () => {
      const now = new Date().getTime();
      const diff = expiryTime - now;

      if (diff <= 0) {
        setTimeLeft('EXPIRED');
        setTimerPercent(0);
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      const fH = hours.toString().padStart(2, '0');
      const fM = minutes.toString().padStart(2, '0');
      const fS = seconds.toString().padStart(2, '0');

      setTimeLeft(`${fH}:${fM}:${fS}`);
      // Progress bar percentage
      setTimerPercent(Math.max(0, Math.min(100, (diff / totalDuration) * 100)));
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [donation.created_at, donation.prepared_time, donation.expiry_time, donation.food_type, donation.freshness]);

  const getStatusConfig = (status: string) => {
    // Neural Waste Override
    if (donation.freshness && donation.freshness !== 'Fresh' && status.toLowerCase() === 'uploaded') {
      return { color: 'text-rose-600 bg-rose-50 border-rose-100 shadow-rose-100/20', label: 'Neural Waste' };
    }

    switch (status.toLowerCase()) {
      case 'uploaded': return { color: 'text-orange-600 bg-orange-50 border-orange-100 shadow-orange-100/20', label: 'Priority Available' };
      case 'accepted': return { color: 'text-emerald-600 bg-emerald-50 border-emerald-100', label: 'Verified Accept' };
      case 'in transit': return { color: 'text-amber-600 bg-amber-50 border-amber-100', label: 'Live Transit' };
      case 'delivered': return { color: 'text-emerald-900 bg-emerald-100 border-emerald-200', label: 'Audit Clear' };
      default: return { color: 'text-slate-500 bg-slate-100 border-slate-200', label: 'Syncing...' };
    }
  };

  const config = getStatusConfig(donation.status);
  const canTrack = donation.status.toLowerCase() === 'accepted' || donation.status.toLowerCase() === 'in transit';

  return (
    <motion.div
      layout
      className="glass-card pro-card-hover overflow-hidden flex flex-col h-full group relative"
      style={{ boxShadow: donation.status === 'uploaded' ? '0 10px 40px -10px rgba(249, 115, 22, 0.15)' : '' }}
    >
      {/* AI Freshness Badge - Overlay */}
      <div className="absolute top-4 left-4 z-20">
        <div className="bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 flex items-center gap-2 shadow-xl">
          <Soup className="w-3.5 h-3.5 text-orange-400 fill-orange-400" />
          <span className="text-[10px] font-black text-white uppercase tracking-widest">AI Scanned</span>
        </div>
      </div>

      {/* Image Header */}
      <div className="relative h-56 bg-slate-100 overflow-hidden">
        {donation.image_url ? (
          <img
            src={donation.image_url.startsWith('http') ? donation.image_url : `${BASE_API_URL}${donation.image_url}`}
            alt={donation.food_type}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-50">
            <Package className="w-14 h-14 text-slate-200" />
          </div>
        )}

        {/* Status Badge */}
        <div className={`absolute top-4 right-4 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border backdrop-blur-md shadow-lg z-20 ${config.color}`}>
          {config.label}
        </div>

        {/* Delete Action for Donors (Only if unaccepted) */}
        {userRole === 'donor' && donation.status.toLowerCase() === 'uploaded' && onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(donationId);
            }}
            className="absolute bottom-4 right-4 w-12 h-12 bg-white/90 backdrop-blur-md border border-rose-100 rounded-xl flex items-center justify-center text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-lg z-30 group active:scale-95"
            title="Delete Donation"
          >
            <Trash2 className="w-5 h-5 group-hover:animate-bounce" />
          </button>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent pointer-events-none" />
      </div>

      {/* Life Timer Bar */}
      <div className="h-1.5 w-full bg-slate-100 overflow-hidden border-b border-slate-100">
        <motion.div
          className={`h-full ${timerPercent > 30 ? 'bg-orange-500' : 'bg-rose-500 shadow-[0_0_10px_#f43f5e]'}`}
          initial={{ width: 0 }}
          animate={{ width: `${timerPercent}%` }}
          transition={{ duration: 1 }}
        />
      </div>

      {/* Content Body */}
      <div className="p-6 flex flex-col flex-1 space-y-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-2">{donation.food_type}</h3>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-rose-600 font-black text-[11px] uppercase tracking-widest bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100">
                <Clock className="w-3.5 h-3.5 animate-pulse" />
                <span>{timeLeft} REMAINING</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-slate-300" />
              <div className="flex items-center gap-1.5 text-slate-400 font-bold text-[10px] uppercase tracking-wider">
                {donation.freshness === 'Fresh' ? (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Quality Assured</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                    <span className="text-rose-500">Quality Failed</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-slate-50/50 rounded-xl border border-slate-100">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Quantity</p>
            <p className="text-sm font-black text-slate-800 flex items-center gap-2">
              <Package className="w-3.5 h-3.5 text-orange-500" />
              {donation.quantity}
            </p>
          </div>
          <div className="p-3 bg-slate-50/50 rounded-xl border border-slate-100 min-w-0">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Location lock</p>
            <p className="text-sm font-black text-slate-800 truncate flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-orange-500" />
              {donation.location || 'N/A'}
            </p>
          </div>
        </div>

        {/* OTP Security Badge */}
        {donation.otp && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-slate-900 rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center shadow-lg shadow-orange-900/20">
                  <ShieldCheck className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-orange-400 uppercase tracking-[0.2em] mb-0.5">Verification Code</p>
                  <p className="text-2xl font-black text-white tracking-widest">{donation.otp}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="px-3 py-1 bg-white/5 rounded-full border border-white/10">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Handoff Required</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {(showActions || canTrack) && (
          <div className="pt-2 flex gap-3">
            {showActions && onAccept && (
              <button
                onClick={() => onAccept?.(donationId)}
                disabled={!!actionLoading}
                className="flex-1 h-14 bg-slate-900 hover:bg-black text-white rounded-2xl shadow-xl shadow-slate-200 font-black flex items-center justify-center gap-3 group transition-all active:scale-95 disabled:opacity-50"
              >
                {actionLoading === donationId ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Navigation className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    <span className="uppercase tracking-[0.1em] text-xs">Accept & Route</span>
                  </>
                )}
              </button>
            )}

            {canTrack && onTrack && (
              <button
                onClick={() => onTrack(donation.location || '')}
                className="flex-1 h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl shadow-xl shadow-emerald-100 font-black flex items-center justify-center gap-3 group transition-all active:scale-95"
              >
                <MapPin className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="uppercase tracking-[0.1em] text-xs">Track Location</span>
              </button>
            )}

            {onReject && (
              <button
                onClick={() => onReject?.(donationId)}
                className="w-14 h-14 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-slate-400 hover:text-rose-600 hover:border-rose-100 hover:bg-rose-50 transition-all active:scale-95"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
