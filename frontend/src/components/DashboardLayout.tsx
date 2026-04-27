import { ReactNode, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authAPI } from '../services/api';
import {
  LogOut,
  LayoutDashboard,
  Package,
  Users,
  BarChart3,
  Settings,
  Bell,
  Menu,
  X,
  User,
  Soup,
  UtensilsCrossed
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DashboardLayoutProps {
  children: ReactNode;
  role: string;
  userName?: string;
}

export default function DashboardLayout({ children, role, userName }: DashboardLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogout = () => {
    authAPI.logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: `/${role}` },
    { label: role === 'donor' ? 'My Donations' : 'Incoming', icon: Package, path: `/${role}/items` },
    { label: 'Analytics', icon: BarChart3, path: `/${role}/analytics` },
    { label: 'Community', icon: Users, path: `/${role}/community` },
    { label: 'Settings', icon: Settings, path: `/${role}/settings` },
  ];

  const roleColors: Record<string, string> = {
    donor: 'text-orange-600 bg-orange-50',
    ngo: 'text-emerald-600 bg-emerald-50',
    farm: 'text-amber-600 bg-amber-50'
  };

  const accentColor = roleColors[role] || 'text-slate-600 bg-slate-50';

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 bg-white border-r border-slate-200 transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'}`}
      >
        <div className="flex flex-col h-full">
          {/* Logo Area */}
          <div className="h-16 flex items-center px-6 border-b border-slate-100 mb-6">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${accentColor}`}>
              <Soup className="w-5 h-5 fill-current" />
            </div>
            {isSidebarOpen && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="ml-3 font-display text-xl font-bold tracking-tight"
              >
                Donato
              </motion.span>
            )}
          </div>

          {/* Nav Links */}
          <nav className="flex-1 px-4 space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path || (item.path === `/${role}` && location.pathname === `/${role}`);
              return (
                <button
                  key={item.label}
                  onClick={() => navigate(item.path)}
                  className={`w-full sidebar-link ${isActive ? 'sidebar-link-active' : ''} ${!isSidebarOpen ? 'justify-center border-none' : ''}`}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? '' : 'text-slate-400'}`} />
                  {isSidebarOpen && <span>{item.label}</span>}
                </button>
              );
            })}
          </nav>

          {/* User Section Bottom */}
          <div className="p-4 border-t border-slate-100">
            <button
              onClick={handleLogout}
              className={`w-full sidebar-link text-rose-600 hover:bg-rose-50 ${!isSidebarOpen ? 'justify-center' : ''}`}
            >
              <LogOut className="w-5 h-5" />
              {isSidebarOpen && <span>Sign Out</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Pane */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Top Header */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 px-8 flex items-center justify-between">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-500"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-6">
            <button className="p-2 text-slate-400 hover:text-slate-600 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full border-2 border-white" />
            </button>
            <div className="h-8 w-px bg-slate-200 mr-2" />
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-slate-900 leading-none">{userName || 'Administrator'}</p>
                <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider mt-1">{role} Access</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 italic font-medium">
                {userName?.charAt(0) || <User className="w-4 h-4" />}
              </div>
            </div>
          </div>
        </header>

        {/* Content View */}
        <main className="flex-1 p-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
