import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/admin/context/AuthContext";
import { toast } from "sonner";
import { Loader2, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success("Welcome back!");
      navigate("/admin");
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="h-12 w-12 rounded-2xl bg-red-600 grid place-items-center text-white font-bold text-xl mx-auto mb-4">R</div>
          <h1 className="text-2xl font-bold text-white">RestroKit CMS</h1>
          <p className="text-white/40 text-sm mt-1">Sign in to your admin dashboard</p>
        </div>

        <form onSubmit={submit} className="bg-[#141414] border border-white/5 rounded-2xl p-6 space-y-4">
          <div>
            <label className="text-xs font-medium text-white/60 uppercase tracking-wide block mb-1.5">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              placeholder="admin@restrokit.com"
              required
              className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-red-500/50"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-white/60 uppercase tracking-wide block mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                placeholder="••••••••"
                required
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2.5 pr-10 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-red-500/50"
              />
              <button type="button" onClick={() => setShowPw((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-white/20 text-xs mt-6">
          Default: admin@restrokit.com / admin123
        </p>
      </div>
    </div>
  );
}
