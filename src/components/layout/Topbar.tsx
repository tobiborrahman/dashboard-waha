'use client';

import { useEffect, useState } from 'react';
import { Menu, Bell, User, SunMoon, LogOut } from 'lucide-react';

type TopbarProps = {
  collapsed?: boolean;
  onToggle?: (next: boolean) => void;
  notificationsCount?: number;
  userName?: string;
  onSignOut?: () => void;
};

export default function Topbar({
  collapsed = false,
  onToggle,
  notificationsCount = 0,
  userName = 'Tobibor',
  onSignOut,
}: TopbarProps) {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(collapsed);
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    setIsCollapsed(collapsed);
  }, [collapsed]);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  function handleToggle() {
    const next = !isCollapsed;
    setIsCollapsed(next);
    onToggle?.(next);
  }

  return (
    <header className="w-full h-[61] bg-white dark:bg-slate-800 border-b border-l border-gray-200 dark:border-slate-700 flex items-center justify-between px-4 sm:px-6">
      {/* Left: menu + title */}
      <div className="flex items-center gap-3">
      {/* Title: hidden on very small screens */}
        <h2 className="hidden sm:block font-semibold text-lg text-gray-800 dark:text-gray-100">
          Dashboard
        </h2>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-4">
        {/* Theme toggle */}
        <button
          aria-label="Toggle theme"
          onClick={() => setIsDark((s) => !s)}
          className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <SunMoon className="w-5 h-5 text-gray-700 dark:text-gray-200" />
        </button>

        {/* Notifications */}
        <button
          aria-label="Notifications"
          className="relative p-2 rounded-md hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Bell className="w-5 h-5 text-gray-700 dark:text-gray-200" />
          {notificationsCount > 0 && (
            <span
              aria-hidden
              className="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-semibold leading-none text-white bg-red-500 rounded-full min-w-[18px] text-center"
            >
              {notificationsCount > 9 ? '9+' : notificationsCount}
            </span>
          )}
        </button>

        {/* User block */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 p-1 rounded-md hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 dark:bg-slate-600 text-gray-700 dark:text-gray-100">
              <User className="w-5 h-5" />
            </span>

            {/* hide username on smallest screens */}
            <span className="hidden sm:inline-block text-sm font-medium text-gray-800 dark:text-gray-100">
              {userName}
            </span>
          </div>

          {/* Sign out (icon button) */}
          <button
            onClick={() => onSignOut?.()}
            aria-label="Sign out"
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            title="Sign out"
          >
            <LogOut className="w-5 h-5 text-gray-700 dark:text-gray-200" />
          </button>
        </div>
      </div>
    </header>
  );
}
