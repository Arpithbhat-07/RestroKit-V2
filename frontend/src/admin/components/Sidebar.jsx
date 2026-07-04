import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Store, Image, UtensilsCrossed, BookOpen, ChefHat,
  Tag, Star, CalendarCheck, MessageSquare, Mail, Settings, User,
  LogOut, X, Camera, Trash2
} from "lucide-react";
import { useAuth } from "@/admin/context/AuthContext";
import { toast } from "sonner";
import { hasAnyRole } from "@/admin/utils/roleUtils";

const baseNav = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/admin" },
  { label: "Menu", icon: UtensilsCrossed, to: "/admin/menu" },
  { label: "Gallery", icon: Camera, to: "/admin/gallery" },
  { label: "Chef", icon: ChefHat, to: "/admin/chef" },
  { label: "Offers", icon: Tag, to: "/admin/offers" },
  { label: "Reviews", icon: Star, to: "/admin/reviews" },
  { label: "Reservations", icon: CalendarCheck, to: "/admin/reservations" },
  { label: "Contact Messages", icon: MessageSquare, to: "/admin/contacts" },
  { label: "Newsletter", icon: Mail, to: "/admin/newsletter" },
  { label: "Users", icon: User, to: "/admin/users" },
  { label: "Profile", icon: User, to: "/admin/profile" },
  { label: "Trash", icon: Trash2, to: "/admin/trash" },
];

const brandingNav = [
  { label: "Restaurant Info", icon: Store, to: "/admin/restaurant" },
  { label: "Hero Section", icon: Image, to: "/admin/hero" },
  { label: "About", icon: BookOpen, to: "/admin/about" },
  { label: "Website Settings", icon: Settings, to: "/admin/settings" },
];

export default function Sidebar({ open, onClose }) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const canManageBranding = hasAnyRole(user, ["super_admin", "admin"]);
  const canManageUsers = hasAnyRole(user, ["super_admin", "admin"]);
  const nav = [
    ...baseNav.filter((item) => item.to !== "/admin/users" || canManageUsers),
    ...(canManageBranding ? brandingNav : []),
  ];

  const handleLogout = () => {
    logout();
    toast.success("Logged out");
    navigate("/admin/login");
  };

  return (
    <>
      {/* Overlay */}
      {open && (
        <div className="fixed inset-0 z-30 bg-black/60 lg:hidden" onClick={onClose} />
      )}

      <aside className={`fixed top-0 left-0 h-full w-64 z-40 flex flex-col bg-[#0f0f0f] border-r border-white/5 transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>

        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-red-600 grid place-items-center text-white font-bold text-sm">R</div>
            <span className="font-semibold text-white text-sm">RestroKit CMS</span>
          </div>
          <button onClick={onClose} className="lg:hidden text-white/40 hover:text-white">
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
          {nav.map(({ label, icon: Icon, to }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/admin"}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                  isActive
                    ? "bg-red-600/20 text-red-400 font-medium"
                    : "text-white/50 hover:text-white hover:bg-white/5"
                }`
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User + Logout */}
        <div className="border-t border-white/5 p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-8 w-8 rounded-full bg-red-600/20 grid place-items-center text-red-400 text-xs font-bold">
              {user?.name?.[0]?.toUpperCase() || "A"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white text-xs font-medium truncate">{user?.name || "Admin"}</div>
              <div className="text-white/40 text-xs truncate">{user?.email}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-white/50 hover:text-red-400 hover:bg-red-600/10 transition-all"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>
    </>
  );
}
