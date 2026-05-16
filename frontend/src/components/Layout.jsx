// Layout.jsx

import {
  Outlet,
  NavLink,
  useNavigate
} from 'react-router-dom';

import {
  LayoutDashboard,
  LogOut,
  CheckSquare,
  Sun,
  Moon,
  FolderKanban,
  ClipboardList,
  Sparkles
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Layout() {

  const { user, logout } = useAuth();

  const { dark, toggle } = useTheme();

  const navigate = useNavigate();

  const handleLogout = () => {

    logout();

    navigate('/login');
  };

  const navItems = [
    {
      to: '/',
      label: 'Dashboard',
      icon: LayoutDashboard,
      end: true
    },
    {
      to: '/projects',
      label: 'Projects',
      icon: FolderKanban
    },
    {
      to: '/my-tasks',
      label: 'My Tasks',
      icon: ClipboardList
    }
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-pink-50 via-white to-rose-100 dark:from-[#050816] dark:via-[#07112b] dark:to-[#140014] transition-colors duration-300">

      {/* Sidebar */}
      <aside className="w-72 bg-white/90 dark:bg-[#081120]/90 backdrop-blur-xl border-r border-gray-200 dark:border-white/10 flex flex-col transition-colors duration-300">

        {/* Top */}
        <div className="p-6 border-b border-gray-200 dark:border-white/10">

          {/* Logo + Theme */}
          <div className="flex items-center justify-between mb-5">

            {/* Logo */}
            <div className="flex items-center gap-3">

              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center shadow-lg shadow-pink-500/30">

                <CheckSquare
                  size={22}
                  className="text-white"
                />
              </div>

              <div>

                <h1 className="text-2xl font-black tracking-tight bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
                  TaskVio
                </h1>

                <p className="text-[11px] text-gray-500 dark:text-slate-500">
                  Team Workspace
                </p>
              </div>
            </div>

            {/* Theme */}
            <button
              onClick={toggle}
              className="p-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 transition-all"
            >

              {dark ? (
                <Sun
                  size={17}
                  className="text-yellow-400"
                />
              ) : (
                <Moon
                  size={17}
                  className="text-gray-700"
                />
              )}
            </button>
          </div>

          {/* User */}
          <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 p-4">

            <div className="flex items-center gap-3">

              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-white font-bold shadow-lg shadow-pink-500/20">

                {user?.name?.[0]?.toUpperCase()}
              </div>

              <div>

                <p className="text-sm text-gray-500 dark:text-slate-400">
                  Welcome back
                </p>

                <h3 className="font-bold text-gray-900 dark:text-white">
                  {user?.name}
                </h3>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto">

          {/* Label */}
          <div className="flex items-center gap-2 px-3 mb-4">

            <Sparkles
              size={12}
              className="text-pink-500 dark:text-pink-400"
            />

            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-gray-500 dark:text-slate-500">
              Workspace
            </p>
          </div>

          {/* Nav */}
          <div className="space-y-2">

            {navItems.map((item) => {

              const Icon = item.icon;

              return (
                <NavLink
                  key={item.label}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `group relative flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-500/30'
                        : 'text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-pink-500 dark:hover:text-pink-400'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {/* Glow */}
                      {isActive && (
                        <div className="absolute inset-0 rounded-2xl bg-pink-500/10 blur-xl"></div>
                      )}

                      <div className="relative z-10 flex items-center gap-3">

                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                            isActive
                              ? 'bg-white/20'
                              : 'bg-gray-100 dark:bg-white/5 group-hover:bg-pink-500/10'
                          }`}
                        >

                          <Icon size={18} />
                        </div>

                        <span>
                          {item.label}
                        </span>
                      </div>
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* Bottom */}
        <div className="p-4 border-t border-gray-200 dark:border-white/10">

          {/* User Card */}
          <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 p-4 mb-3">

            <div className="flex items-center gap-3">

              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center font-bold shadow-lg shadow-pink-500/20 text-white">

                {user?.name?.[0]?.toUpperCase()}
              </div>

              <div className="flex-1 overflow-hidden">

                <p className="font-semibold text-gray-900 dark:text-white truncate">
                  {user?.name}
                </p>

                <p className="text-xs text-gray-500 dark:text-slate-500 truncate">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="group flex items-center gap-3 px-4 py-3 w-full rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 hover:bg-red-50 dark:hover:bg-red-500/10 hover:border-red-300 dark:hover:border-red-500/20 transition-all"
          >

            <div className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-white/5 group-hover:bg-red-500/10 flex items-center justify-center transition-all">

              <LogOut
                size={18}
                className="text-gray-500 dark:text-slate-400 group-hover:text-red-500 dark:group-hover:text-red-400"
              />
            </div>

            <span className="text-sm font-semibold text-gray-600 dark:text-slate-400 group-hover:text-red-500 dark:group-hover:text-red-400">
              Logout
            </span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">

        <Outlet />

      </main>
    </div>
  );
}