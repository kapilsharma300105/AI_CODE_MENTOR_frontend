import React, { useEffect, useState } from "react";
import API from "../api";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";

const buildAvatarUrl = (url) => {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  return "http://127.0.0.1:8000" + url;
};

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");
  const [preview, setPreview] = useState(null);
  const [form, setForm] = useState({ username: "", email: "", bio: "", avatar: null });
  const navigate = useNavigate();

  useEffect(() => {
    const cached = JSON.parse(localStorage.getItem("user"));
    if (cached) {
      setUser(cached);
      setForm({ username: cached.username || "", email: cached.email || "", bio: cached.bio || "", avatar: null });
      setPreview(buildAvatarUrl(cached.avatar));
    }

    API.get("profile/")
      .then((res) => {
        const fullAvatar = buildAvatarUrl(res.data.avatar);
        const updated = {
          username: res.data.username,
          email: res.data.email,
          bio: res.data.bio,
          role: res.data.role || "",
          avatar: fullAvatar,
        };
        setUser(updated);
        setForm({ username: updated.username, email: updated.email, bio: updated.bio, avatar: null });
        setPreview(fullAvatar);
        localStorage.setItem("user", JSON.stringify(updated));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const handleUpdate = async () => {
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("username", form.username);
      fd.append("email", form.email);
      fd.append("bio", form.bio);
      if (form.avatar) fd.append("avatar", form.avatar);

      const res = await API.post("profile/update/", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Keep old avatar if API returns null (no new photo uploaded)
      const fullAvatar = buildAvatarUrl(res.data.avatar) || user?.avatar || null;

      const updatedUser = {
        username: res.data.username,
        email: res.data.email,
        bio: res.data.bio,
        role: res.data.role || "",
        avatar: fullAvatar,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      setPreview(fullAvatar);

      window.dispatchEvent(new CustomEvent("profileUpdated", { detail: updatedUser }));
      window.dispatchEvent(new Event("localStorageUpdated"));

      showToast("Profile saved!");
      setTimeout(() => navigate("/dashboard"), 1200);

    } catch (err) {
      console.error("Profile update error:", err);
      showToast("Error saving profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm((f) => ({ ...f, avatar: file }));
    setPreview(URL.createObjectURL(file));
  };

  const handleLogout = () => { localStorage.clear(); navigate("/login", { replace: true }); };

  if (loading) return (
    <div style={S.loadWrap}>
      <div style={S.spinner} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div style={S.page}>
      <Sidebar />
      {toast && <div style={S.toast}>{toast}</div>}

      <div style={S.main}>
        <div style={S.topBar}>
          <div>
            <h1 style={S.title}>My Profile</h1>
            <p style={S.sub}>Manage your account & personal info</p>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <button onClick={() => navigate("/dashboard")} style={S.backBtn}>← Dashboard</button>
            <button onClick={handleLogout} style={S.logoutBtn}>Logout</button>
          </div>
        </div>

        <div style={S.card}>
          <div style={S.left}>
            <div style={S.avatarRing}>
              <img
                src={preview || `https://ui-avatars.com/api/?name=${form.username || "U"}&background=7F5AF0&color=fff&size=140`}
                alt="avatar"
                style={S.avatarImg}
              />
            </div>
            <h2 style={S.nameDisplay}>{user?.username}</h2>
            <p style={S.emailDisplay}>{user?.email}</p>
            <label style={S.uploadLabel}>
              📷 Change Photo
              <input type="file" accept="image/*" style={{ display: "none" }} onChange={handleAvatarChange} />
            </label>
            {user?.bio && <p style={S.bioDisplay}>"{user.bio}"</p>}
            <div style={S.badge}>⚡ AI Developer</div>
          </div>

          <div style={S.right}>
            <h3 style={S.formTitle}>Edit Details</h3>
            <div style={S.field}>
              <label style={S.label}>Username</label>
              <input value={form.username} onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))} style={S.input} placeholder="Your username" />
            </div>
            <div style={S.field}>
              <label style={S.label}>Email</label>
              <input value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} style={S.input} placeholder="Your email" type="email" />
            </div>
            <div style={S.field}>
              <label style={S.label}>Bio</label>
              <textarea value={form.bio} onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))} style={S.textarea} placeholder="Tell something about yourself..." />
            </div>
            <button
              onClick={handleUpdate}
              style={{ ...S.saveBtn, opacity: saving ? 0.6 : 1, cursor: saving ? "not-allowed" : "pointer" }}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save & Go to Dashboard"}
            </button>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

const S = {
  page: { display: "flex", minHeight: "100vh", background: "linear-gradient(135deg,#020617,#0f172a)", color: "white" },
  main: { flex: 1, padding: "32px" },
  loadWrap: { height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#020617" },
  spinner: { width: "36px", height: "36px", border: "3px solid #1e293b", borderTop: "3px solid #7F5AF0", borderRadius: "50%", animation: "spin 0.8s linear infinite" },
  toast: { position: "fixed", top: "20px", right: "20px", zIndex: 999, background: "#22c55e", color: "white", padding: "12px 20px", borderRadius: "12px", fontWeight: 600, fontSize: "14px" },
  topBar: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" },
  title: { margin: 0, fontSize: "28px", fontWeight: 700 },
  sub: { marginTop: "5px", color: "#94a3b8", fontSize: "14px" },
  backBtn: { padding: "9px 18px", border: "1px solid #334155", borderRadius: "10px", cursor: "pointer", background: "transparent", color: "#94a3b8", fontSize: "13px" },
  logoutBtn: { padding: "9px 18px", border: "none", borderRadius: "10px", cursor: "pointer", background: "linear-gradient(135deg,#ff4d4d,#ff6b6b)", color: "white", fontWeight: 700 },
  card: { display: "grid", gridTemplateColumns: "260px 1fr", gap: "24px", padding: "28px", borderRadius: "24px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(12px)" },
  left: { display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", padding: "20px", borderRadius: "20px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" },
  avatarRing: { padding: "4px", borderRadius: "50%", background: "linear-gradient(135deg,#7F5AF0,#2CB67D)" },
  avatarImg: { width: "120px", height: "120px", borderRadius: "50%", objectFit: "cover", border: "4px solid #0f172a", display: "block" },
  nameDisplay: { margin: 0, fontSize: "20px", fontWeight: 600 },
  emailDisplay: { margin: 0, color: "#94a3b8", fontSize: "13px" },
  bioDisplay: { color: "#cbd5e1", fontSize: "12px", fontStyle: "italic", textAlign: "center", lineHeight: 1.5 },
  uploadLabel: { padding: "7px 16px", borderRadius: "10px", cursor: "pointer", fontSize: "13px", background: "rgba(127,90,240,0.15)", border: "1px solid rgba(127,90,240,0.3)", color: "#a78bfa" },
  badge: { padding: "7px 14px", borderRadius: "10px", background: "linear-gradient(135deg,#7F5AF0,#2CB67D)", fontWeight: 700, fontSize: "12px" },
  right: { display: "flex", flexDirection: "column", gap: "16px" },
  formTitle: { margin: 0, fontSize: "15px", fontWeight: 500, color: "#e2e8f0" },
  field: { display: "flex", flexDirection: "column", gap: "7px" },
  label: { color: "#94a3b8", fontSize: "13px" },
  input: { padding: "12px 14px", borderRadius: "12px", fontSize: "14px", border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.04)", color: "white", outline: "none" },
  textarea: { padding: "12px 14px", borderRadius: "12px", fontSize: "14px", border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.04)", color: "white", outline: "none", minHeight: "90px", resize: "none" },
  saveBtn: { padding: "14px", border: "none", borderRadius: "14px", fontWeight: 700, fontSize: "15px", color: "white", background: "linear-gradient(135deg,#7F5AF0,#2CB67D)" },
};