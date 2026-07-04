import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Menu, Bell } from "lucide-react";
import Sidebar from "./Sidebar";
import { useAuth } from "@/admin/context/AuthContext";

const titles = {
  "/admin": "Dashboard",
  "/admin/restaurant": "Restaurant Information",
  "/admin/hero": "Hero Section",
  "/admin/about": "About Section",
  "/admin/menu": "Menu Management",
  "/admin/gallery": "Gallery",
  "/admin/chef": "Chef Management",
  "/admin/offers": "Offers",
  "/admin/reviews": "Reviews",
  "/admin/reservations": "Reservations",
  "/admin/contacts": "Contact Messages",
  "/admin/newsletter": "Newsletter",
  "/admin/users": "Users",
  "/admin/settings": "Website Settings",
  "/admin/profile": "Profile",
};

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { pathname } = useLocation();
  const { user } = useAuth();
  const title = titles[pathname] || "Admin";

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="sticky top-0 z-20 bg-[#0a0a0a]/80 backdrop-blur border-b border-white/5 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-white/60 hover:text-white"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-base font-semibold text-white">{title}</h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="h-9 w-9 rounded-full bg-white/5 grid place-items-center text-white/60 hover:text-white hover:bg-white/10 transition-all">
              <Bell size={16} />
            </button>
            <div className="h-8 w-8 rounded-full bg-red-600/20 grid place-items-center text-red-400 text-xs font-bold">
              {user?.name?.[0]?.toUpperCase() || "A"}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
