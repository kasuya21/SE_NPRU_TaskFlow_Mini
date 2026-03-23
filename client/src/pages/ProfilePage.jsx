import { useState } from "react";
import { useNavigate } from "react-router";
import useAuthStore from "../store/authStore";
import Swal from "sweetalert2";

const ProfilePage = () => {
  const { user, updateProfile, loading, error } = useAuthStore();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: user?.username || "",
    email: user?.email || "",
    profilePicture: user?.profilePicture || "",
    currentPassword: "",
    newPassword: "",
  });
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { username: form.username, email: form.email, profilePicture: form.profilePicture };
    if (form.newPassword) { payload.currentPassword = form.currentPassword; payload.newPassword = form.newPassword; }
    try {
      await updateProfile(payload);
      Swal.fire({ icon: "success", title: "PROFILE SAVED! ★", timer: 1500, showConfirmButton: false, background: "#fff", color: "#000" });
      setForm(f => ({ ...f, currentPassword: "", newPassword: "" }));
      navigate("/tasks");
    } catch (_) {}
  };

  return (
    <div style={{ maxWidth: "480px", margin: "0 auto", padding: "32px 16px 100px" }}>
      {/* Title */}
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <div className="pixel-font" style={{ display: "inline-block", background: "var(--mario-dark)", border: "6px solid var(--mario-black)", boxShadow: "6px 6px 0 var(--mario-black)", padding: "16px 28px" }}>
          <span style={{ color: "var(--mario-yellow)", fontSize: "16px", textShadow: "2px 2px 0 var(--mario-black)" }}>♟ MY PROFILE</span>
        </div>
      </div>

      {/* Avatar */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <div style={{ width: "72px", height: "72px", border: "4px solid var(--mario-black)", boxShadow: "4px 4px 0 var(--mario-black)", margin: "0 auto 8px", background: "var(--mario-red)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "32px", overflow: "hidden" }}>
          {user?.profilePicture ? <img src={user.profilePicture} alt="avatar" style={{ width: "100%", objectFit: "cover" }} /> : "🍄"}
        </div>
        <p style={{ fontSize: "8px", color: "white", textShadow: "1px 1px 0 var(--mario-black)" }}>{user?.username?.toUpperCase()}</p>
      </div>

      <div className="pixel-box" style={{ padding: "24px" }}>
        {error && <div className="pixel-alert" style={{ marginBottom: "16px" }}>⚠ {error}</div>}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label className="pixel-label">USERNAME</label>
            <input name="username" className="pixel-input" value={form.username} onChange={handleChange} />
          </div>
          <div>
            <label className="pixel-label">EMAIL</label>
            <input name="email" type="email" className="pixel-input" value={form.email} onChange={handleChange} />
          </div>
          <div>
            <label className="pixel-label">AVATAR URL</label>
            <input name="profilePicture" className="pixel-input" placeholder="https://..." value={form.profilePicture} onChange={handleChange} />
          </div>

          {/* Divider */}
          <div style={{ border: "none", borderTop: "4px solid var(--mario-black)", margin: "4px 0", position: "relative" }}>
            <span style={{ position: "absolute", top: "-10px", left: "50%", transform: "translateX(-50%)", background: "var(--mario-yellow)", border: "2px solid var(--mario-black)", padding: "0 8px", fontSize: "7px", color: "var(--mario-black)" }}>CHANGE PASSWORD</span>
          </div>

          <div style={{ marginTop: "12px" }}>
            <label className="pixel-label">CURRENT PASSWORD</label>
            <input name="currentPassword" type="password" placeholder="••••••••" className="pixel-input" value={form.currentPassword} onChange={handleChange} />
          </div>
          <div>
            <label className="pixel-label">NEW PASSWORD</label>
            <input name="newPassword" type="password" placeholder="••••••••" className="pixel-input" value={form.newPassword} onChange={handleChange} />
          </div>

          <button type="submit" className="pixel-btn pixel-btn-primary" disabled={loading} style={{ width: "100%", marginTop: "8px" }}>
            {loading ? <span className="pixel-loading">SAVING...</span> : "SAVE ★"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
