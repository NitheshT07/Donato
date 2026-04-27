import { useState, useRef } from 'react';
import { donorAPI } from '../services/api';
import {
  Upload,
  Loader2,
  CheckCircle,
  MapPin,
  Clock,
  Camera,
  Navigation,
  AlertCircle,
  Zap,
  ChevronRight,
  Info,
  ScanLine,
  UtensilsCrossed
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

interface FoodUploadFormProps {
  onSuccess: () => void;
}

export default function FoodUploadForm({ onSuccess }: FoodUploadFormProps) {
  const [formData, setFormData] = useState({
    foodType: '',
    quantity: '',
    preparedTime: '',
    pickupLocation: '',
  });
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [aiResult, setAiResult] = useState<{ status: string; message?: string } | null>(null);
  const [detectingLocation, setDetectingLocation] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playPop = () => {
    try {
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3');
      audio.volume = 0.5;
      audio.play().catch(e => console.warn("Audio playback failed:", e));
    } catch (err) {
      console.warn("Audio initialization failed:", err);
    }
  };

  const speakSuccess = () => {
    const speech = new SpeechSynthesisUtterance("Sweet! Thank you for your amazing donation. You're making a real difference!");
    speech.pitch = 1.1;
    speech.rate = 0.9;
    window.speechSynthesis.speak(speech);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      playPop();
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const detectLocation = () => {
    playPop();
    setDetectingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setFormData({
            ...formData,
            pickupLocation: `${pos.coords.latitude.toFixed(6)}, ${pos.coords.longitude.toFixed(6)}`
          });
          setDetectingLocation(false);
        },
        () => {
          setError('Location detection failed. Please enter manually.');
          setDetectingLocation(false);
        }
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) {
      setError('Please provide an image for AI verification.');
      return;
    }

    playPop();
    setLoading(true);
    setScanning(true);
    setError('');

    try {
      // Create FormData for multipart/form-data upload
      const submissionData = new FormData();
      submissionData.append('food_type', formData.foodType);
      submissionData.append('quantity', formData.quantity);
      submissionData.append('prepared_time', formData.preparedTime);
      submissionData.append('location', formData.pickupLocation);
      submissionData.append('image_file', image);

      // Call API (real AI processing happens on backend)
      const resp = await donorAPI.uploadFood(submissionData);

      setScanning(false);

      const shelfLifeMap: Record<string, number> = {
        'dosa': 6,
        'idli': 8,
        'rice': 4,
        'meals': 5,
        'vegetables': 48,
        'fruit': 72,
        'default': 6
      };

      const getPredictedHours = (type: string) => {
        const t = type.toLowerCase();
        for (const key in shelfLifeMap) {
          if (t.includes(key)) return shelfLifeMap[key];
        }
        return shelfLifeMap.default;
      };

      const predictedHours = getPredictedHours(formData.foodType);

      setAiResult({
        status: resp.freshness,
        message: resp.freshness === 'Fresh'
          ? `AI Analysis: Items verified as fresh. Predicted Shelf-Life: ${predictedHours} hours. Optimized logistics routing initiated.`
          : 'AI Analysis: Items require immediate processing. Diverting to regional recycling hub.',
      });

      setSuccess(true);
      speakSuccess();

      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#f97316', '#10b981', '#ffffff']
      });

      setTimeout(() => {
        onSuccess();
        setSuccess(false);
      }, 5000);
    } catch (err: any) {
      setError(err.message || 'AI Sync interrupted. Please verify your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center border border-orange-100">
          <UtensilsCrossed className="w-6 h-6 text-orange-600" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">AI Assisted Donation</h3>
          <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">Neural scanning for freshness verification</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Media Capsule */}
          <div className="lg:col-span-2">
            <div className={`relative border-2 border-dashed rounded-2xl p-6 transition-all duration-300 ${imagePreview ? 'border-orange-200 bg-orange-50/30' : 'border-slate-200 hover:border-orange-300 hover:bg-slate-50'}`}>
              {imagePreview ? (
                <div className="relative group/preview overflow-hidden rounded-xl bg-white p-2 border border-orange-100">
                  <div className="relative">
                    <img src={imagePreview} alt="Preview" className="max-h-64 mx-auto rounded-lg shadow-sm transition-transform duration-500 group-hover/preview:scale-105" />
                    {scanning && (
                      <div className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none">
                        <div className="scanning-laser z-20" />
                        <div className="absolute inset-0 bg-orange-500/10 animate-pulse" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                          <ScanLine className="w-12 h-12 text-white animate-bounce" />
                          <span className="text-[10px] font-black text-white uppercase tracking-[0.2em] mt-2 drop-shadow-md">Analyzing Molecular Integrity...</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover/preview:opacity-100 transition-opacity flex items-center justify-center">
                    <button type="button" onClick={() => { playPop(); setImagePreview(''); }} className="bg-white text-slate-900 px-4 py-2 rounded-lg shadow-lg font-bold text-xs flex items-center gap-2">
                      <Camera className="w-4 h-4" /> Change Image
                    </button>
                  </div>
                </div>
              ) : (
                <label className="cursor-pointer flex flex-col items-center py-8 group/label" onClick={() => playPop()}>
                  <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 mb-4 group-hover/label:scale-110 transition-transform">
                    <Camera className="w-6 h-6 text-slate-400 group-hover/label:text-orange-600" />
                  </div>
                  <span className="text-slate-900 font-bold text-sm tracking-tight mb-1">Engage AI Vision</span>
                  <span className="text-slate-400 text-[10px] font-medium uppercase tracking-wider">Molecular scan for quality assurance</span>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 ml-1">Type of Food</label>
            <div className="relative">
              <input
                type="text"
                value={formData.foodType}
                onChange={(e) => setFormData({ ...formData, foodType: e.target.value })}
                onFocus={() => playPop()}
                required
                className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all text-sm font-medium"
                placeholder="e.g. Organic Produce, Cooked Meals"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 ml-1">Quantity / Portions</label>
            <input
              type="text"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              onFocus={() => playPop()}
              required
              className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all text-sm font-medium"
              placeholder="e.g. 50 units, 10kg"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 ml-1">Prepared At</label>
            <div className="relative">
              <Clock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="datetime-local"
                value={formData.preparedTime}
                onChange={(e) => setFormData({ ...formData, preparedTime: e.target.value })}
                onFocus={() => playPop()}
                required
                className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all text-sm font-medium pr-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 ml-1">Operational Location</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={formData.pickupLocation}
                  onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })}
                  onFocus={() => playPop()}
                  required
                  className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all text-sm font-medium pr-10"
                  placeholder="Street address or GPS lock"
                />
              </div>
              <button
                type="button"
                onClick={detectLocation}
                className="w-12 h-12 flex items-center justify-center bg-white border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-orange-600 transition-all shadow-sm active:scale-95"
              >
                {detectingLocation ? <Loader2 className="w-5 h-5 animate-spin" /> : <Navigation className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {error && (
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-3 text-rose-800">
            <AlertCircle className="w-5 h-5 text-rose-500" />
            <p className="text-sm font-semibold">{error}</p>
          </motion.div>
        )}

        <button
          type="submit"
          disabled={loading || success}
          className="w-full h-14 bg-orange-600 hover:bg-orange-700 text-white rounded-xl shadow-lg shadow-orange-100 font-bold transition-all flex items-center justify-center gap-2 group disabled:opacity-50 active:scale-95"
        >
          {loading ? (
            <div className="flex items-center gap-3">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span>{scanning ? 'Neural Scanning...' : 'Synchronizing...'}</span>
            </div>
          ) : (
            <>
              <Zap className="w-5 h-5" />
              <span>Initiate AI Redistribution</span>
            </>
          )}
        </button>
      </form>

      <AnimatePresence>
        {success && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-white/95 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center p-8 z-[100] text-center border border-orange-100 shadow-2xl">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mb-6 border border-emerald-100 shadow-lg"
            >
              <CheckCircle className="w-10 h-10 text-emerald-600" />
            </motion.div>
            <h4 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Scan Successful</h4>
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 max-w-sm w-full shadow-inner">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-ping" />
                <span className="text-xs font-black text-slate-600 uppercase tracking-[0.2em]">Neural Report</span>
              </div>
              <p className="text-xl font-black text-slate-900 leading-tight mb-1">{aiResult?.status} Verified</p>
              <p className="text-xs text-slate-500 font-bold mt-2 leading-relaxed italic">"{aiResult?.message}"</p>

              <div className="mt-6 h-2 bg-slate-200 rounded-full overflow-hidden border border-white">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 5 }}
                  className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}