import { motion } from 'framer-motion';

interface AnalyticsChartProps {
  data: any[];
  type?: 'bar' | 'line';
  dataKey: string;
  xAxisKey: string;
  title: string;
  color?: string;
}

export default function AnalyticsChart({
  data,
  dataKey,
  xAxisKey,
  title,
  color = '#4f46e5'
}: AnalyticsChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">{title}</p>
        <p className="text-xs font-medium text-slate-500">No analytical data available for this period.</p>
      </div>
    );
  }

  const maxValue = Math.max(...data.map(item => item[dataKey] || 0));
  const chartHeight = 240;

  return (
    <div className="w-full relative group/chart">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">{title}</h3>
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Data Units</div>
      </div>

      <div className="relative" style={{ height: chartHeight + 60 }}>
        {/* Y-Axis Grid */}
        <div className="absolute left-10 top-0 bottom-10 w-[calc(100%-40px)] flex flex-col justify-between pointer-events-none">
          <div className="w-full h-px bg-slate-100" />
          <div className="w-full h-px bg-slate-100" />
          <div className="w-full h-px bg-slate-100" />
          <div className="w-full h-px bg-slate-100" />
        </div>

        {/* Axis Labels */}
        <div className="absolute left-0 top-0 bottom-10 flex flex-col justify-between text-[10px] font-bold text-slate-400 py-1 pr-4 z-10">
          <span>{maxValue}</span>
          <span>{Math.round(maxValue / 2)}</span>
          <span>0</span>
        </div>

        {/* Chart Area */}
        <div className="ml-10 h-[240px] flex items-end justify-around relative">
          {data.map((item, index) => {
            const height = maxValue > 0 ? (item[dataKey] / maxValue) * chartHeight : 4;
            return (
              <div key={index} className="flex flex-col items-center gap-4 w-full group/bar transition-all">
                <div className="relative w-full max-w-[32px] sm:max-w-[48px]">
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: height, opacity: 1 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: index * 0.05 }}
                    className="rounded-t-lg relative overflow-hidden"
                    style={{
                      backgroundColor: color,
                      boxShadow: `0 4px 12px ${color}20`,
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />
                  </motion.div>

                  {/* Tooltip */}
                  <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 transition-all duration-200 pointer-events-none z-[100] scale-90 group-hover/bar:scale-100">
                    <div className="bg-slate-900 shadow-xl px-3 py-1.5 rounded-lg text-[11px] font-bold text-white whitespace-nowrap">
                      {item[dataKey]} units
                    </div>
                    <div className="w-1.5 h-1.5 bg-slate-900 rotate-45 mx-auto -mt-1" />
                  </div>
                </div>

                <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider group-hover/bar:text-slate-900 transition-colors truncate w-full text-center px-1">
                  {item[xAxisKey]}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
