import React from 'react';
import { NavLink, Link, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  FileText, 
  Layers, 
  ArrowLeft, 
  ShieldCheck, 
  Users,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AdminLayout() {
  const { user } = useAuth();

  const navLinks = [
    { name: 'Dashboard Overview', path: '/admin', icon: LayoutDashboard, exact: true },
    { name: 'Manage Subjects', path: '/admin/subjects', icon: BookOpen },
    { name: 'Manage Past Papers', path: '/admin/papers', icon: FileText },
    { name: 'Levels & Streams', path: '/admin/metadata', icon: Layers },
    { name: 'Users & Roles', path: '/admin/users', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      
      {/* Top Admin Header */}
      <header className="bg-[#0b1c38] text-white border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Brand Logo & Admin Badge */}
            <div className="flex items-center gap-3">
              <Link to="/" className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-md">
                  <BookOpen className="w-5 h-5" />
                </div>
                <span className="text-xl font-black text-white">
                  PastPapers<span className="text-blue-400">.lk</span>
                </span>
              </Link>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-black uppercase tracking-wider border border-purple-400/30">
                <ShieldCheck className="w-3.5 h-3.5" />
                Admin Panel
              </span>
            </div>

            {/* Right Tools & User Info */}
            <div className="flex items-center gap-3">
              <Link
                to="/"
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Student View</span>
              </Link>

              <div className="flex items-center gap-2 pl-2 border-l border-slate-700">
                <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                  {user?.username ? user.username.charAt(0).toUpperCase() : 'A'}
                </div>
                <div className="hidden lg:block text-left">
                  <span className="text-xs font-bold block text-white leading-tight">
                    {user?.username || 'Administrator'}
                  </span>
                  <span className="text-[10px] text-purple-300 block font-semibold uppercase">
                    👑 System Admin
                  </span>
                </div>
              </div>

            </div>

          </div>
        </div>
      </header>

      {/* Admin Body (Sidebar + Content) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Admin Sidebar (3 cols) */}
        <aside className="lg:col-span-3 space-y-4">
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-1">
            <div className="px-3 py-2 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
              Management Menu
            </div>

            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.exact}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}

            <div className="pt-3 mt-3 border-t border-slate-100 space-y-1">
              <Link
                to="/"
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                <ArrowLeft className="w-4 h-4 text-slate-400" />
                <span>Return to Website</span>
              </Link>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white rounded-2xl p-5 shadow-sm space-y-2 border border-slate-800">
            <h4 className="text-sm font-black flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Role Permissions</span>
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Standard users have read & download access. Only accounts assigned the Admin role can access this portal and manage user privileges.
            </p>
          </div>
        </aside>

        {/* Right Main Content Area (9 cols) */}
        <main className="lg:col-span-9">
          <Outlet />
        </main>

      </div>

    </div>
  );
}
