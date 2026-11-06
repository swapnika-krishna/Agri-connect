import React, { useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Sprout,
  LayoutDashboard,
  Tractor,
  CloudSun,
  TrendingUp,
  BrainCircuit,
  HelpCircle,
  Bell,
  User as UserIcon,
  LogOut,
  Users,
  Database,
  Menu,
  X,
  CheckCircle2,
  RefreshCw,
  ChevronDown,
  ShieldAlert,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { UserRole } from '../types';

interface NavItem {
  label: string;
  href: string;
  icon: any;
  badge?: number;
}

export const DashboardLayout: React.FC = () => {
  const { user, role, logout, switchDemoRole, resetDemoData } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [roleSwitcherOpen, setRoleSwitcherOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Farmer Navigation
  const farmerNav: NavItem[] = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'My Farms', href: '/farms', icon: Tractor },
    { label: 'Weather & Advisory', href: '/weather', icon: CloudSun },
    { label: 'Mandi Market Prices', href: '/market', icon: TrendingUp },
    { label: 'Crop Recommendation', href: '/crops/recommend', icon: BrainCircuit },
    { label: 'Ask Agri Expert', href: '/queries', icon: HelpCircle },
    { label: 'Notifications', href: '/notifications', icon: Bell, badge: unreadCount },
    { label: 'Profile Settings', href: '/profile', icon: UserIcon },
  ];

  // Expert Navigation
  const expertNav: NavItem[] = [
    { label: 'Expert Dashboard', href: '/expert', icon: LayoutDashboard },
    { label: 'Review Queries', href: '/expert/queries', icon: HelpCircle },
    { label: 'Weather Intel', href: '/weather', icon: CloudSun },
    { label: 'Mandi Prices', href: '/market', icon: TrendingUp },
    { label: 'Notifications', href: '/notifications', icon: Bell, badge: unreadCount },
    { label: 'Profile Settings', href: '/profile', icon: UserIcon },
  ];

  // Admin Navigation
  const adminNav: NavItem[] = [
    { label: 'Admin Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Manage Users', href: '/admin/users', icon: Users },
    { label: 'Manage Crops', href: '/admin/crops', icon: Database },
    { label: 'All Queries', href: '/admin/queries', icon: HelpCircle },
    { label: 'Mandi Prices', href: '/market', icon: TrendingUp },
    { label: 'Profile Settings', href: '/profile', icon: UserIcon },
  ];

  const currentNav = role === 'admin' ? adminNav : role === 'expert' ? expertNav : farmerNav;

  const getRoleDisplayName = (r?: UserRole | null) => {
    if (r === 'admin') return 'Platform Administrator';
    if (r === 'expert') return 'Agricultural Specialist';
    return 'Registered Farmer';
  };

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-800">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-white border-r border-slate-200 shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-slate-100">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-xs">
              <Sprout className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-slate-900 block leading-tight">
                AgriConnect
              </span>
              <span className="text-[10px] text-emerald-700 font-semibold uppercase tracking-wider block">
                {role} console
              </span>
            </div>
          </Link>
        </div>

        {/* User Card Mini */}
        <div className="p-4 mx-3 my-3 bg-slate-50/80 rounded-xl border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-emerald-600/10 text-emerald-800 font-bold flex items-center justify-center text-xs shrink-0">
              {user?.name ? user.name.charAt(0) : 'U'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-900 truncate">{user?.name || 'User'}</p>
              <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
            </div>
          </div>
          <div className="mt-2.5 pt-2 border-t border-slate-200/50 flex items-center justify-between text-[11px] text-slate-500">
            <span className="font-medium text-emerald-700">{getRoleDisplayName(role)}</span>
            {user?.state && <span>{user.state}</span>}
          </div>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {currentNav.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            return (
              <NavLink
                key={item.href}
                to={item.href}
                className={`flex items-center justify-between px-3.5 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-800 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-emerald-700' : 'text-slate-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-600 text-white tabular-nums">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Demo switcher & Logout */}
        <div className="p-3 border-t border-slate-100 space-y-2">
          {/* Quick Demo Switcher helper */}
          <div className="relative">
            <button
              onClick={() => setRoleSwitcherOpen(!roleSwitcherOpen)}
              className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
            >
              <div className="flex items-center gap-2 truncate">
                <RefreshCw className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">Demo Role: <strong className="capitalize">{role}</strong></span>
              </div>
              <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
            </button>
            {roleSwitcherOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-1 bg-white rounded-lg border border-slate-200 shadow-md p-1.5 space-y-1 z-30">
                <button
                  onClick={() => {
                    switchDemoRole('farmer');
                    setRoleSwitcherOpen(false);
                    navigate('/dashboard');
                  }}
                  className={`w-full text-left px-2.5 py-1.5 text-xs rounded transition-colors ${
                    role === 'farmer' ? 'bg-emerald-50 text-emerald-800 font-semibold' : 'hover:bg-slate-50'
                  }`}
                >
                  🌾 Gurpreet Singh (Farmer)
                </button>
                <button
                  onClick={() => {
                    switchDemoRole('expert');
                    setRoleSwitcherOpen(false);
                    navigate('/expert');
                  }}
                  className={`w-full text-left px-2.5 py-1.5 text-xs rounded transition-colors ${
                    role === 'expert' ? 'bg-emerald-50 text-emerald-800 font-semibold' : 'hover:bg-slate-50'
                  }`}
                >
                  🔬 Dr. Ramesh Sharma (Expert)
                </button>
                <button
                  onClick={() => {
                    switchDemoRole('admin');
                    setRoleSwitcherOpen(false);
                    navigate('/admin');
                  }}
                  className={`w-full text-left px-2.5 py-1.5 text-xs rounded transition-colors ${
                    role === 'admin' ? 'bg-emerald-50 text-emerald-800 font-semibold' : 'hover:bg-slate-50'
                  }`}
                >
                  ⚡ Dr. Virendra Kumar (Admin)
                </button>
              </div>
            )}
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Column */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between gap-4 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="text-xs text-slate-500 hidden sm:block">
              <span>AgriConnect</span>
              <span className="mx-1.5">/</span>
              <span className="text-slate-800 font-medium capitalize">{role} Portal</span>
            </div>
          </div>

          {/* Right Header items */}
          <div className="flex items-center gap-2.5">
            {/* Quick Public View Link */}
            <Link
              to="/"
              className="text-xs text-slate-500 hover:text-emerald-700 px-2 py-1.5 rounded-md hover:bg-slate-50 transition-colors hidden sm:block"
            >
              Public Home
            </Link>

            {/* Reset data helper */}
            <button
              onClick={() => {
                if (window.confirm('Reset demo data to initial seeds?')) {
                  resetDemoData();
                  window.location.reload();
                }
              }}
              title="Reset Demo Data"
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            {/* Notification Bell Dropdown */}
            <div className="relative">
              <button
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className="relative p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
                aria-label="View notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-600 ring-2 ring-white" />
                )}
              </button>

              {notifDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-slate-200 p-3 z-40">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                    <span className="text-xs font-semibold text-slate-800">
                      Notifications ({unreadCount} unread)
                    </span>
                    {unreadCount > 0 && (
                      <button
                        onClick={() => markAllAsRead()}
                        className="text-[11px] text-emerald-700 hover:underline"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-64 overflow-y-auto space-y-2">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-slate-400 text-center py-4">No notifications</p>
                    ) : (
                      notifications.slice(0, 5).map((n) => (
                        <div
                          key={n._id || n.id}
                          onClick={() => {
                            markAsRead(n._id || n.id || '');
                            if (n.link) navigate(n.link);
                            setNotifDropdownOpen(false);
                          }}
                          className={`p-2 rounded-lg text-xs cursor-pointer transition-colors ${
                            n.isRead ? 'bg-white hover:bg-slate-50' : 'bg-emerald-50/60 hover:bg-emerald-50'
                          }`}
                        >
                          <p className="text-slate-800 font-medium leading-snug">{n.message}</p>
                          <span className="text-[10px] text-slate-400 block mt-1">
                            {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="pt-2 mt-2 border-t border-slate-100 text-center">
                    <Link
                      to="/notifications"
                      onClick={() => setNotifDropdownOpen(false)}
                      className="text-xs font-medium text-emerald-700 hover:underline block"
                    >
                      View all notifications
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar / Name button */}
            <Link
              to="/profile"
              className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-lg hover:bg-slate-100 transition-colors text-xs text-slate-700 font-medium"
            >
              <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                {user?.name ? user.name.charAt(0) : 'U'}
              </div>
              <span className="hidden md:inline">{user?.name?.split(' ')[0]}</span>
            </Link>
          </div>
        </header>

        {/* Page Content Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative w-72 bg-white flex flex-col z-10">
            <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sprout className="w-5 h-5 text-emerald-600" />
                <span className="font-bold text-slate-900">AgriConnect</span>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
              {currentNav.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <NavLink
                    key={item.href}
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg ${
                      isActive ? 'bg-emerald-50 text-emerald-800' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 text-slate-400" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="text-xs bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </nav>
            <div className="p-4 border-t border-slate-100">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
