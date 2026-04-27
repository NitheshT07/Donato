import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  variant?: 'indigo' | 'emerald' | 'amber' | 'rose' | 'slate';
  subtitle?: string;
  trend?: {
    value: string;
    isUp: boolean;
  };
}

export default function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  variant = 'indigo', 
  subtitle,
  trend 
}: StatsCardProps) {
  const variants = {
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    rose: 'bg-rose-50 text-rose-600 border-rose-100',
    slate: 'bg-slate-50 text-slate-600 border-slate-100',
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="pro-card pro-card-hover p-6"
    >
      <div className="flex items-start justify-between">
        <div className="space-y-4 flex-1">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-lg ${variants[variant]} border`}>
              <Icon className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{title}</span>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-bold text-slate-900 tracking-tight">{value}</h3>
              {trend && (
                <span className={`text-xs font-bold ${trend.isUp ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {trend.isUp ? '↑' : '↓'} {trend.value}
                </span>
              )}
            </div>
            {subtitle && (
              <p className="text-xs font-medium text-slate-400">{subtitle}</p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
