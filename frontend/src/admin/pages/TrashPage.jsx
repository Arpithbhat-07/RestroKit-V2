import React, { useEffect, useState } from "react";
import { adminApi } from "@/services/api";
import { Card, Btn, EmptyState } from "@/admin/components/UI";
import { toast } from "sonner";
import { RotateCcw, Trash2 } from "lucide-react";

const modules = [
  { key: "menu", label: "Menu", get: adminApi.getMenuTrash, restore: adminApi.restoreMenuItem, remove: adminApi.permanentDeleteMenuItem },
  { key: "gallery", label: "Gallery", get: adminApi.getGalleryTrash, restore: adminApi.restoreGalleryItem, remove: adminApi.permanentDeleteGalleryItem },
  { key: "offers", label: "Offers", get: adminApi.getOffersTrash, restore: adminApi.restoreOffer, remove: adminApi.permanentDeleteOffer },
  { key: "reviews", label: "Reviews", get: adminApi.getReviewsTrash, restore: adminApi.restoreReview, remove: adminApi.permanentDeleteReview },
  { key: "reservations", label: "Reservations", get: adminApi.getReservationsTrash, restore: adminApi.restoreReservation, remove: adminApi.permanentDeleteReservation },
  { key: "contacts", label: "Contacts", get: adminApi.getContactsTrash, restore: adminApi.restoreContact, remove: adminApi.permanentDeleteContact },
  { key: "newsletter", label: "Newsletter", get: adminApi.getNewsletterTrash, restore: adminApi.restoreSubscriber, remove: adminApi.permanentDeleteSubscriber },
];

export default function TrashPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const all = await Promise.all(modules.map((m) => m.get().then((r) => ({ key: m.key, label: m.label, items: r.data || [] }))));
      setItems(all.filter((entry) => entry.items.length));
    } catch {
      toast.error("Unable to load trash data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const restore = async (module, id) => {
    try {
      await module.restore(id);
      toast.success("Restored");
      load();
    } catch {
      toast.error("Restore failed");
    }
  };

  const remove = async (module, id) => {
    if (!window.confirm("This action permanently deletes the item from the database.")) return;
    try {
      await module.remove(id);
      toast.success("Permanently deleted");
      load();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="space-y-5">
      <div className="text-white/60 text-sm">Deleted items stay in the trash until you restore or permanently remove them.</div>
      {loading ? <div className="text-white/40 text-sm">Loading trash...</div> : items.length === 0 ? <EmptyState message="Trash is empty" /> : (
        <div className="space-y-4">
          {items.map((group) => (
            <Card key={group.key} className="p-0 overflow-hidden">
              <div className="px-5 py-3 border-b border-white/5 text-white font-medium">{group.label}</div>
              <div className="divide-y divide-white/5">
                {group.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between px-5 py-3">
                    <div className="min-w-0">
                      <div className="text-white text-sm truncate">{item.name || item.title || item.email || item.message || item.id}</div>
                      <div className="text-white/40 text-xs">{item.deletedAt || item.deleted_at || "Deleted"}</div>
                    </div>
                    <div className="flex gap-2">
                      <Btn variant="secondary" onClick={() => restore(modules.find((m) => m.key === group.key), item.id)} className="py-1 px-2"><RotateCcw size={13} /></Btn>
                      <Btn variant="danger" onClick={() => remove(modules.find((m) => m.key === group.key), item.id)} className="py-1 px-2"><Trash2 size={13} /></Btn>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
