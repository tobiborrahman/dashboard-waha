// components/layout/Topbar.tsx
"use client";
import { Bell, User } from "lucide-react";

export default function Topbar() {
  return (
    <header className="w-full h-16 bg-white shadow-sm flex items-center justify-between px-6">
      <h2 className="font-semibold text-lg">Dashboard</h2>
      <div className="flex items-center gap-4">
        <button className="relative">
          <Bell className="text-gray-600" size={20} />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <div className="flex items-center gap-2">
          <User className="text-gray-600" size={20} />
          <span className="text-sm font-medium">Tobibor</span>
        </div>
      </div>
    </header>
  );
}
