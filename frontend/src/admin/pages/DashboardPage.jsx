import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarCheck, Clock, CheckCircle, Trophy, UtensilsCrossed, Camera, Mail, MessageSquare } from "lucide-react";
import { adminApi } from "@/services/api";
import { StatCard, Card, StatusBadge, Skeleton, Btn } from "@/admin/components/UI";
import { toast } from "sonner";

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState(null);
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    adminApi.getStats().then((r) => setStats(r.data)).catch(() => {});
    adminApi.getRecent().then((r) => setRecent(r.data)).catch(() => {});
  }, []);

  const seed = async () => {
    setSeeding(true);
    try {
      const { data } = await adminApi.seed();
      toast.success(data.message);
      const [s, r] = await Promise.all([adminApi.getStats(), adminApi.getRecent()]);
      setStats(s.data); setRecent(r.data);
    } catch { toast.error("Seed failed"); }
    finally { setSeeding(false); }
  };

  return (
    <div className="space-y-6">
      {/* Quick actions */}
      <div className="flex flex-wrap gap-3">
        <Link to="/admin/menu" className="px-4 py-2 bg-red-600/10 text-red-400 border border-red-600/20 rounded-xl text-sm hover:bg-red-600/20 transition-colors">+ Add Menu Item</Link>
        <Link to="/admin/reservations" className="px-4 py-2 bg-white/5 text-white/60 border border-white/10 rounded-xl text-sm hover:bg-white/10 transition-colors">View Reservations</Link>
        <Link to="/admin/contacts" className="px-4 py-2 bg-white/5 text-white/60 border border-white/10 rounded-xl text-sm hover:bg-white/10 transition-colors">Contact Messages</Link>
        <Btn variant="secondary" loading={seeding} onClick={seed} className="text-xs">Seed Database</Btn>
      </div>

      {/* Stats */}
      {!stats ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array(8).fill(0).map((_, i) => <Skeleton key={i} className="h-24" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Today's Reservations" value={stats.today_reservations} icon={CalendarCheck} color="red" />
          <StatCard label="Pending" value={stats.pending} icon={Clock} color="yellow" />
          <StatCard label="Confirmed" value={stats.confirmed} icon={CheckCircle} color="green" />
          <StatCard label="Completed" value={stats.completed} icon={Trophy} color="blue" />
          <StatCard label="Menu Items" value={stats.total_menu} icon={UtensilsCrossed} color="purple" />
          <StatCard label="Gallery Images" value={stats.gallery_images} icon={Camera} color="blue" />
          <StatCard label="Subscribers" value={stats.newsletter_subscribers} icon={Mail} color="green" />
          <StatCard label="Unread Messages" value={stats.unread_contacts} icon={MessageSquare} color="red" />
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Reservations */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-white text-sm">Recent Reservations</h2>
            <Link to="/admin/reservations" className="text-xs text-red-400 hover:text-red-300">View all</Link>
          </div>
          {!recent ? (
            <div className="space-y-3">{Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-12" />)}</div>
          ) : recent.reservations.length === 0 ? (
            <p className="text-white/30 text-sm py-4 text-center">No reservations yet</p>
          ) : (
            <div className="space-y-3">
              {recent.reservations.map((r) => (
                <div key={r.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                  <div>
                    <div className="text-sm text-white font-medium">{r.name}</div>
                    <div className="text-xs text-white/40">{r.date} at {r.time} · {r.guests} guests</div>
                  </div>
                  <StatusBadge status={r.status} />
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Recent Messages */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-white text-sm">Recent Messages</h2>
            <Link to="/admin/contacts" className="text-xs text-red-400 hover:text-red-300">View all</Link>
          </div>
          {!recent ? (
            <div className="space-y-3">{Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-12" />)}</div>
          ) : recent.contacts.length === 0 ? (
            <p className="text-white/30 text-sm py-4 text-center">No messages yet</p>
          ) : (
            <div className="space-y-3">
              {recent.contacts.map((c) => (
                <div key={c.id} className="flex items-start gap-3 py-2 border-b border-white/5 last:border-0">
                  <div className={`h-2 w-2 rounded-full mt-1.5 shrink-0 ${c.read ? "bg-white/20" : "bg-red-500"}`} />
                  <div>
                    <div className="text-sm text-white font-medium">{c.name}</div>
                    <div className="text-xs text-white/40 line-clamp-1">{c.message}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
