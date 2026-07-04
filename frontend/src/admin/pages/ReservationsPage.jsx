import React, { useEffect, useState, useMemo } from "react";
import { adminApi } from "@/services/api";
import { Card, Btn, StatusBadge, SearchInput, ConfirmDialog, EmptyState } from "@/admin/components/UI";
import { toast } from "sonner";
import { Trash2, Download } from "lucide-react";

const STATUSES = ["pending", "confirmed", "completed", "cancelled"];

export default function ReservationsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [deleting, setDeleting] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = () => adminApi.getReservations().then((r) => { setItems(r.data); setLoading(false); });
  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => items.filter((r) => {
    const q = search.toLowerCase();
    const matchSearch = r.name.toLowerCase().includes(q) || r.email.toLowerCase().includes(q) || r.phone.includes(q);
    const matchStatus = filterStatus === "All" || r.status === filterStatus;
    return matchSearch && matchStatus;
  }), [items, search, filterStatus]);

  const updateStatus = async (id, status) => {
    try { await adminApi.updateReservationStatus(id, status); load(); toast.success("Status updated"); }
    catch { toast.error("Update failed"); }
  };

  const del = async () => {
    setSaving(true);
    try { await adminApi.deleteReservation(deleting); toast.success("Deleted"); setDeleting(null); load(); }
    catch { toast.error("Delete failed"); }
    finally { setSaving(false); }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="flex flex-wrap gap-3">
          <SearchInput value={search} onChange={setSearch} placeholder="Search reservations..." />
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-[#1a1a1a] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none">
            <option value="All">All Statuses</option>
            {STATUSES.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
        </div>
        <a href={adminApi.exportReservations()} download className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/10 transition-all">
          <Download size={14} /> Export CSV
        </a>
      </div>

      <Card className="p-0 overflow-hidden">
        {loading ? <div className="p-6 text-white/40 text-sm">Loading...</div> :
         filtered.length === 0 ? <EmptyState message="No reservations found" /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 text-white/40 text-xs uppercase tracking-wide">
                  <th className="text-left px-5 py-3">Customer</th>
                  <th className="text-left px-4 py-3">Date & Time</th>
                  <th className="text-left px-4 py-3">Guests</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-left px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.id} className="border-b border-white/5 hover:bg-white/2">
                    <td className="px-5 py-3">
                      <div className="text-white font-medium">{r.name}</div>
                      <div className="text-white/40 text-xs">{r.email} · {r.phone}</div>
                      {r.message && <div className="text-white/30 text-xs mt-0.5 italic">"{r.message}"</div>}
                    </td>
                    <td className="px-4 py-3 text-white/70">{r.date}<br /><span className="text-white/40">{r.time}</span></td>
                    <td className="px-4 py-3 text-white/70">{r.guests}</td>
                    <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {r.status === "pending" && (
                          <>
                            <button onClick={() => updateStatus(r.id, "confirmed")} className="px-2 py-1 text-xs bg-green-500/10 text-green-400 rounded-lg hover:bg-green-500/20">Confirm</button>
                            <button onClick={() => updateStatus(r.id, "cancelled")} className="px-2 py-1 text-xs bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20">Cancel</button>
                          </>
                        )}
                        {r.status === "confirmed" && (
                          <button onClick={() => updateStatus(r.id, "completed")} className="px-2 py-1 text-xs bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20">Complete</button>
                        )}
                        <button onClick={() => setDeleting(r.id)} className="p-1.5 text-white/30 hover:text-red-400 rounded-lg hover:bg-red-500/5"><Trash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <ConfirmDialog open={!!deleting} onClose={() => setDeleting(null)} onConfirm={del} loading={saving} message="This reservation will be permanently deleted." />
    </div>
  );
}
