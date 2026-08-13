import { useState, type FormEvent } from "react";
import { Loader2, LogOut, Save, UserCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Seo from "@/components/seo/Seo";
import { useToast } from "../components/Toast";
import { useAdminAuth } from "../auth/AuthContext";
import { requireSupabase } from "@/lib/supabase";

export default function AdminProfile() {
  const { user, signOut } = useAdminAuth();
  const { notify } = useToast();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);

  const onChangePassword = async (e: FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      notify("Password must be at least 8 characters.", "error");
      return;
    }
    if (password !== confirm) {
      notify("Passwords do not match.", "error");
      return;
    }
    setSaving(true);
    try {
      const db = requireSupabase();
      const { error } = await db.auth.updateUser({ password });
      if (error) throw error;
      notify("Password updated successfully.");
      setPassword("");
      setConfirm("");
    } catch (e) {
      notify(e instanceof Error ? e.message : "Could not update password.", "error");
    } finally {
      setSaving(false);
    }
  };

  const onLogout = async () => {
    await signOut();
    navigate("/admin/login");
  };

  return (
    <>
      <Seo title="Admin Profile" description="Mallanna Farms admin profile." path="/admin/profile" />
      <div className="max-w-lg space-y-6">
        <div>
          <h1 className="font-display text-2xl font-semibold text-forest-900">Profile</h1>
          <p className="mt-1 text-sm text-forest-600">Manage your admin account.</p>
        </div>

        <div className="card flex items-center gap-4 p-5">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-forest-100 text-forest-700">
            <UserCircle className="h-7 w-7" />
          </span>
          <div>
            <p className="font-medium text-forest-900">{user?.email}</p>
            <p className="text-xs text-forest-500">Administrator</p>
          </div>
        </div>

        <form onSubmit={onChangePassword} className="card space-y-4 p-5">
          <h2 className="font-display text-base font-semibold text-forest-900">Change Password</h2>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-forest-800">New Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input" minLength={8} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-forest-800">Confirm New Password</label>
            <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className="input" minLength={8} />
          </div>
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving ? "Updating…" : "Update Password"}
          </button>
        </form>

        <button onClick={onLogout} className="btn w-full bg-earth-600 text-cream-50 hover:bg-earth-700">
          <LogOut className="h-4 w-4" />
          Log Out
        </button>
      </div>
    </>
  );
}
