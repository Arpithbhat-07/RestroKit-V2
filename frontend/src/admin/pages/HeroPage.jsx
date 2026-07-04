import React, { useEffect, useState } from "react";
import { adminApi } from "@/services/api";
import { Card, Field, Input, Textarea, Btn, ImageUpload } from "@/admin/components/UI";
import { toast } from "sonner";

export default function HeroPage() {
  const [data, setData] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminApi.getHero().then((r) => setData(r.data || {})).catch(() => setData({}));
  }, []);

  const set = (k, v) => setData((d) => ({ ...d, [k]: v }));

  const save = async () => {
    setSaving(true);
    try {
      await adminApi.updateHero(data);
      toast.success("Hero section saved");
    } catch { toast.error("Save failed"); }
    finally { setSaving(false); }
  };

  if (!data) return <div className="text-white/40 text-sm">Loading...</div>;

  return (
    <div className="space-y-6 max-w-2xl">
      <Card>
        <h2 className="font-semibold text-white mb-5">Hero Content</h2>
        <div className="space-y-4">
          <Field label="Kicker (small text above title)">
            <Input value={data.kicker || ""} onChange={(e) => set("kicker", e.target.value)} placeholder="Est. 2019 — Mangalore" />
          </Field>
          <Field label="Main Title">
            <Input value={data.title || ""} onChange={(e) => set("title", e.target.value)} />
          </Field>
          <Field label="Title Alt (italic line)">
            <Input value={data.title_alt || ""} onChange={(e) => set("title_alt", e.target.value)} />
          </Field>
          <Field label="Subtitle">
            <Textarea rows={2} value={data.subtitle || ""} onChange={(e) => set("subtitle", e.target.value)} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Primary CTA Text">
              <Input value={data.cta_primary || ""} onChange={(e) => set("cta_primary", e.target.value)} placeholder="Reserve Table" />
            </Field>
            <Field label="Secondary CTA Text">
              <Input value={data.cta_secondary || ""} onChange={(e) => set("cta_secondary", e.target.value)} placeholder="View Menu" />
            </Field>
          </div>
          <ImageUpload label="Hero Background Image" value={data.image || ""} onChange={(v) => set("image", v)} />
        </div>
      </Card>
      <Btn loading={saving} onClick={save} className="w-full justify-center py-3">Save Changes</Btn>
    </div>
  );
}
