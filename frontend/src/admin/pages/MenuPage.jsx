import React, { useEffect, useState, useMemo } from "react";
import { adminApi } from "@/services/api";
import { Card, Field, Input, Textarea, Select, Btn, Modal, ConfirmDialog, Toggle, Badge, SearchInput, EmptyState, ImageUpload } from "@/admin/components/UI";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Copy } from "lucide-react";

const CATS = ["Starters", "Seafood", "Thali", "Biryani", "Currys", "Rice & Noodles", "Desserts", "Drinks", "Specials"];
const empty = { name: "", description: "", price: 0, category: "Starters", diet: "veg", core: "", img: "", popular: false, chef_special: false, available: true, spice_level: 0, display_order: 0 };

export default function MenuPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("All");
  const [filterDiet, setFilterDiet] = useState("All");

  const load = () => adminApi.getMenu().then((r) => { setItems(r.data); setLoading(false); });
  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => items.filter((item) => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase()) || item.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === "All" || item.category === filterCat;
    const matchDiet = filterDiet === "All" || item.diet === filterDiet;
    return matchSearch && matchCat && matchDiet;
  }), [items, search, filterCat, filterDiet]);

  const openAdd = () => { setEditing(null); setForm(empty); setModal(true); };
  const openEdit = (item) => { setEditing(item.id); setForm({ ...item }); setModal(true); };

  const save = async () => {
    if (!form.name || !form.price) { toast.error("Name and price required"); return; }
    setSaving(true);
    try {
      if (editing) {
        await adminApi.updateMenuItem(editing, form);
        toast.success("Item updated");
      } else {
        await adminApi.createMenuItem(form);
        toast.success("Item added");
      }
      setModal(false);
      load();
    } catch { toast.error("Save failed"); }
    finally { setSaving(false); }
  };

  const del = async () => {
    setSaving(true);
    try {
      await adminApi.deleteMenuItem(deleting);
      toast.success("Item deleted");
      setDeleting(null);
      load();
    } catch { toast.error("Delete failed"); }
    finally { setSaving(false); }
  };

  const duplicate = async (id) => {
    try {
      await adminApi.duplicateMenuItem(id);
      toast.success("Item duplicated");
      load();
    } catch { toast.error("Duplicate failed"); }
  };

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="flex flex-wrap gap-3">
          <SearchInput value={search} onChange={setSearch} placeholder="Search menu..." />
          <select value={filterCat} onChange={(e) => setFilterCat(e.target.value)}
            className="bg-[#1a1a1a] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none">
            <option value="All">All Categories</option>
            {CATS.map((c) => <option key={c}>{c}</option>)}
          </select>
          <select value={filterDiet} onChange={(e) => setFilterDiet(e.target.value)}
            className="bg-[#1a1a1a] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none">
            <option value="All">All</option>
            <option value="veg">Veg</option>
            <option value="nonveg">Non-Veg</option>
          </select>
        </div>
        <Btn onClick={openAdd}><Plus size={14} /> Add Item</Btn>
      </div>

      <Card className="p-0 overflow-hidden">
        {loading ? (
          <div className="p-6 text-white/40 text-sm">Loading...</div>
        ) : filtered.length === 0 ? (
          <EmptyState message="No menu items found" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 text-white/40 text-xs uppercase tracking-wide">
                  <th className="text-left px-5 py-3">Item</th>
                  <th className="text-left px-4 py-3">Category</th>
                  <th className="text-left px-4 py-3">Diet</th>
                  <th className="text-left px-4 py-3">Price</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        {item.img && <img src={item.img} alt={item.name} className="h-9 w-9 rounded-lg object-cover" />}
                        <div>
                          <div className="text-white font-medium">{item.name}</div>
                          {item.core && <div className="text-white/40 text-xs">{item.core}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-white/60">{item.category}</td>
                    <td className="px-4 py-3">
                      <Badge color={item.diet === "veg" ? "green" : "red"}>{item.diet === "veg" ? "Veg" : "Non-Veg"}</Badge>
                    </td>
                    <td className="px-4 py-3 text-white">₹{item.price}</td>
                    <td className="px-4 py-3">
                      <Badge color={item.available ? "green" : "gray"}>{item.available ? "Available" : "Hidden"}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        <button onClick={() => duplicate(item.id)} className="p-1.5 text-white/30 hover:text-white/70 rounded-lg hover:bg-white/5"><Copy size={14} /></button>
                        <button onClick={() => openEdit(item)} className="p-1.5 text-white/30 hover:text-white/70 rounded-lg hover:bg-white/5"><Pencil size={14} /></button>
                        <button onClick={() => setDeleting(item.id)} className="p-1.5 text-white/30 hover:text-red-400 rounded-lg hover:bg-red-500/5"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? "Edit Menu Item" : "Add Menu Item"} wide>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Name"><Input value={form.name} onChange={(e) => set("name", e.target.value)} /></Field>
            <Field label="Price (₹)"><Input type="number" value={form.price} onChange={(e) => set("price", Number(e.target.value))} /></Field>
          </div>
          <Field label="Core Ingredients"><Input value={form.core} onChange={(e) => set("core", e.target.value)} placeholder="Chicken/Mutton" /></Field>
          <Field label="Description"><Textarea rows={2} value={form.description} onChange={(e) => set("description", e.target.value)} /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Category">
              <Select value={form.category} onChange={(e) => set("category", e.target.value)}>
                {CATS.map((c) => <option key={c}>{c}</option>)}
              </Select>
            </Field>
            <Field label="Diet">
              <Select value={form.diet} onChange={(e) => set("diet", e.target.value)}>
                <option value="veg">Veg</option>
                <option value="nonveg">Non-Veg</option>
              </Select>
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Spice Level (0-5)"><Input type="number" min={0} max={5} value={form.spice_level} onChange={(e) => set("spice_level", Number(e.target.value))} /></Field>
            <Field label="Display Order"><Input type="number" value={form.display_order} onChange={(e) => set("display_order", Number(e.target.value))} /></Field>
          </div>
          <ImageUpload label="Item Image" value={form.img} onChange={(v) => set("img", v)} />
          <div className="flex flex-wrap gap-6 pt-2">
            <Toggle checked={form.available} onChange={(v) => set("available", v)} label="Available" />
            <Toggle checked={form.popular} onChange={(v) => set("popular", v)} label="Popular Badge" />
            <Toggle checked={form.chef_special} onChange={(v) => set("chef_special", v)} label="Chef Special" />
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <Btn variant="secondary" onClick={() => setModal(false)}>Cancel</Btn>
            <Btn loading={saving} onClick={save}>Save Item</Btn>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={del}
        loading={saving}
        message="This menu item will be permanently deleted."
      />
    </div>
  );
}
