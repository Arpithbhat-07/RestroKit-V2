import React, { useEffect, useState } from "react";
import { adminApi } from "@/services/api";
import { Card, Field, Input, Textarea, Btn, ImageUpload } from "@/admin/components/UI";
import { toast } from "sonner";

export default function ChefPage() {
  const [data, setData] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminApi.getChef().then((r) => setData(r.data || {})).catch(() => setData({}));
  }, []);

  const set = (k, v) => setData((d) => ({ ...d, [k]: v }));

  const save = async () => {
    setSaving(true);
    try { await adminApi.updateChef(data); toast.success("Chef info saved"); }
    catch { toast.error("Save failed"); }
    finally { setSaving(false); }
  };

  if (!data) return <div className="text-white/40 text-sm">Loading...</div>;

  return (
    <div className="space-y-6 max-w-2xl">
      <Card>
        <h2 className="font-semibold text-white mb-5">Chef Information</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Chef Name"><Input value={data.name || ""} onChange={(e) => set("name", e.target.value)} /></Field>
            <Field label="Position"><Input value={data.position || ""} onChange={(e) => set("position", e.target.value)} placeholder="Head Chef" /></Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Experience"><Input value={data.experience || ""} onChange={(e) => set("experience", e.target.value)} placeholder="15 years" /></Field>
            <Field label="Instagram"><Input value={data.instagram || ""} onChange={(e) => set("instagram", e.target.value)} /></Field>
          </div>
          <Field label="Biography"><Textarea rows={4} value={data.biography || ""} onChange={(e) => set("biography", e.target.value)} /></Field>
          <Field label="Awards"><Textarea rows={2} value={data.awards || ""} onChange={(e) => set("awards", e.target.value)} placeholder="One per line" /></Field>
          <Field label="Signature Quote"><Input value={data.quote || ""} onChange={(e) => set("quote", e.target.value)} /></Field>
          <ImageUpload label="Chef Photo" value={data.photo || ""} onChange={(v) => set("photo", v)} />
        </div>
      </Card>
      <Btn loading={saving} onClick={save} className="w-full justify-center py-3">Save Changes</Btn>
    </div>
  );
}
