import React, { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { CalendarCheck, Loader2 } from "lucide-react";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const initial = { name: "", phone: "", email: "", guests: 2, date: "", time: "", message: "" };

export default function Reservation() {
  const [form, setForm] = useState(initial);
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.email || !form.date || !form.time) {
      toast.error("Please fill all required fields.");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API}/reservations`, { ...form, guests: Number(form.guests) });
      toast.success("Reservation received! We'll confirm shortly.");
      setForm(initial);
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="reservation" data-testid="reservation-section" className="py-24 md:py-32 bg-muted/40">
      <div className="max-w-5xl mx-auto px-6 md:px-10">
        <SectionHeading
          overline="Book a Table"
          title="Reserve your evening."
          subtitle="Walk-ins welcome, reservations recommended — especially on weekends."
        />

        <Reveal>
          <form
            onSubmit={submit}
            data-testid="reservation-form"
            className="grid md:grid-cols-2 gap-x-8 gap-y-4 bg-card border border-border rounded-3xl p-8 md:p-12 shadow-xl"
          >
            <FloatField label="Full Name" value={form.name} onChange={(v) => set("name", v)} testid="rf-name" />
            <FloatField label="Phone" value={form.phone} onChange={(v) => set("phone", v)} testid="rf-phone" />
            <FloatField label="Email" value={form.email} onChange={(v) => set("email", v)} type="email" testid="rf-email" />
            <FloatField label="Guests" value={form.guests} onChange={(v) => set("guests", v)} type="number" min={1} max={30} testid="rf-guests" />
            <FloatField label="Date" value={form.date} onChange={(v) => set("date", v)} type="date" testid="rf-date" />
            <FloatField label="Time" value={form.time} onChange={(v) => set("time", v)} type="time" testid="rf-time" />
            <div className="md:col-span-2">
              <FloatField label="Special Requests" value={form.message} onChange={(v) => set("message", v)} textarea testid="rf-message" />
            </div>
            <div className="md:col-span-2 mt-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground">
                By reserving, you agree to our cancellation policy (24hr notice).
              </p>
              <button
                type="submit"
                disabled={loading}
                data-testid="reservation-submit"
                className="ripple inline-flex items-center gap-2 bg-brand-primary hover:bg-brand-primary-dark disabled:opacity-70 text-white px-8 py-4 rounded-full text-sm font-medium tracking-wide uppercase shadow-xl shadow-brand-primary/30 transition-all hover:-translate-y-0.5"
              >
                {loading ? <Loader2 className="animate-spin" size={16} /> : <CalendarCheck size={16} />}
                {loading ? "Reserving..." : "Reserve Now"}
              </button>
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  );
}

function FloatField({ label, value, onChange, type = "text", textarea, testid, min, max }) {
  return (
    <div className="float-field">
      {textarea ? (
        <textarea
          rows={3}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder=" "
          data-testid={testid}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder=" "
          min={min}
          max={max}
          required
          data-testid={testid}
        />
      )}
      <label>{label}</label>
    </div>
  );
}
