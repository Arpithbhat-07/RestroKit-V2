import React, { useEffect, useState } from "react";
import { adminApi } from "@/services/api";
import { Card, Field, Input, Btn, Select } from "@/admin/components/UI";
import { toast } from "sonner";

const emptyForm = { name: "", email: "", password: "", role: "owner" };

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const { data } = await adminApi.getUsers();
      setUsers(data);
    } catch {
      toast.error("Unable to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadUsers(); }, []);

  const setField = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const saveUser = async () => {
    if (!form.email) {
      toast.error("Email is required");
      return;
    }
    setSaving(true);
    try {
      if (editingId) {
        await adminApi.updateUser(editingId, form);
        toast.success("User updated");
      } else {
        await adminApi.createUser(form);
        toast.success("User created");
      }
      setForm(emptyForm);
      setEditingId(null);
      await loadUsers();
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Unable to save user");
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (user) => {
    setEditingId(user.id);
    setForm({ name: user.name || "", email: user.email || "", password: "", role: user.role || "owner" });
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await adminApi.deleteUser(id);
      toast.success("User deleted");
      await loadUsers();
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Delete failed");
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-white">Owner Accounts</h2>
            <p className="text-sm text-white/50">Create, edit, or remove owner users.</p>
          </div>
          <Btn onClick={() => { setEditingId(null); setForm(emptyForm); }} variant="secondary">Reset</Btn>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Name"><Input value={form.name} onChange={(e) => setField("name", e.target.value)} /></Field>
          <Field label="Email"><Input type="email" value={form.email} onChange={(e) => setField("email", e.target.value)} /></Field>
          <Field label="Password"><Input type="password" value={form.password} onChange={(e) => setField("password", e.target.value)} placeholder={editingId ? "Leave blank to keep current" : "welcome123"} /></Field>
          <Field label="Role">
            <Select value={form.role} onChange={(e) => setField("role", e.target.value)}>
              <option value="owner">Owner</option>
              <option value="super_admin">Super Admin</option>
            </Select>
          </Field>
        </div>
        <div className="mt-4">
          <Btn loading={saving} onClick={saveUser}>{editingId ? "Update User" : "Create User"}</Btn>
        </div>
      </Card>

      <Card>
        {loading ? (
          <div className="text-white/50">Loading users…</div>
        ) : (
          <div className="space-y-3">
            {users.map((user) => (
              <div key={user.id} className="flex items-center justify-between rounded-lg border border-white/10 p-3">
                <div>
                  <div className="text-white font-medium">{user.name || user.email}</div>
                  <div className="text-sm text-white/50">{user.email} • {user.role}</div>
                </div>
                <div className="flex gap-2">
                  <Btn variant="secondary" onClick={() => startEdit(user)}>Edit</Btn>
                  <Btn variant="danger" onClick={() => deleteUser(user.id)}>Delete</Btn>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
