import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const BACKEND = "https://ai-code-mentor-backend-0rmn.onrender.com";

function Navbar() {
  const [user, setUser] = useState(null);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const tools = [
    { name: "AI Mentor", link: "/chat", icon: "🤖" },
    { name: "Code Compiler", link: "/run-code", icon: "💻" },
    { name: "DSA Practice", link: "/practice", icon: "🧠" },
    { name: "Dashboard", link: "/dashboard", icon: "📊" },
    { name: "Profile", link: "/profile", icon: "👤" },
  ];

  const filteredTools = tools.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  const getAvatarUrl = (url) => {
    if (!url) return null;
    if (url.startsWith("http")) return url;
    return BACKEND + url;
  };

  const syncUser = () => {
    try {
      const stored = localStorage.getItem("user");
      setUser(stored ? JSON.parse(stored) : null);
    } catch { setUser(null); }
  };

  useEffect(() => {
    syncUser();

    // Profile update hone pe — direct user set karo
    const onProfileUpdated = (e) => {
      if (e.detail) setUser(e.detail);
      else syncUser();
    };

    window.addEventListener("profileUpdated", onProfileUpdated);
    window.addEventListener("localStorageUpdated", syncUser);
    window.addEventListener("focus", syncUser);

    return () => {
      window.removeEventListener("profileUpdated", onProfileUpdated);
      window.removeEventListener("localStorageUpdated", syncUser);
      window.removeEventListener("focus", syncUser);
    };
  }, []);

  const avatarUrl = getAvatarUrl(user?.avatar);
  const avatarLetter = user?.username?.charAt(0).toUpperCase() || "U";

  return (
    <nav style={styles.nav}>

      {/* LOGO */}
      <div style={styles.logoSection} onClick={() => navigate("/dashboard")}>
        <div style={styles.logoIcon}>⚡</div>
        <div>
          <h1 style={styles.logoText}>AI CODE MENTOR</h1>
          <p style={styles.logoSub}>Smart Developer Workspace</p>
        </div>
      </div>

      {/* SEARCH */}
      <div style={styles.searchWrapper}>
        <div style={styles.searchBox}>
          <span style={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Search tools..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={styles.searchInput}
          />
        </div>
        {search && (
          <div style={styles.searchResults}>
            {filteredTools.length > 0 ? (
              filteredTools.map((tool, i) => (
                <div
                  key={i}
                  style={styles.resultItem}
                  onClick={() => { navigate(tool.link); setSearch(""); }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <span>{tool.icon}</span>{tool.name}
                </div>
              ))
            ) : (
              <div style={styles.noResult}>No tools found</div>
            )}
          </div>
        )}
      </div>

      {/* RIGHT */}
      <div style={styles.rightSection}>
        {user ? (
          <>
            <button style={styles.actionBtn} onClick={() => navigate("/run-code")}>
              🚀 Run Code
            </button>

            {/* Profile info + avatar */}
            <div
              style={styles.profileWrap}
              onClick={() => navigate("/profile")}
              title={user?.username}
            >
              {/* Username + email */}
              <div style={styles.userInfo}>
                <span style={styles.userName}>{user?.username}</span>
                <span style={styles.userEmail}>{user?.email}</span>
              </div>

              {/* Avatar */}
              <div style={styles.avatarBox}>
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="avatar"
                    style={styles.avatarImg}
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                ) : null}
                <div
                  style={{
                    display: avatarUrl ? "none" : "flex",
                    ...styles.avatarLetter,
                  }}
                >
                  {avatarLetter}
                </div>
              </div>
            </div>
          </>
        ) : (
          <button style={styles.loginBtn} onClick={() => navigate("/")}>Login</button>
        )}
      </div>

    </nav>
  );
}

const styles = {
  nav: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "12px 28px",
    background: "rgba(10,15,25,0.85)",
    backdropFilter: "blur(18px)",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    position: "sticky", top: 0, zIndex: 999,
  },
  logoSection: {
    display: "flex", alignItems: "center", gap: "12px", cursor: "pointer",
  },
  logoIcon: {
    width: "44px", height: "44px", borderRadius: "14px",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "22px", background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
    boxShadow: "0 2px 12px rgba(99,102,241,0.35)",
  },
  logoText: {
    margin: 0, fontSize: "20px", fontWeight: 900,
    background: "linear-gradient(90deg,#6366f1,#a78bfa)",
    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
  },
  logoSub: { margin: 0, fontSize: "11px", color: "#64748b" },

  searchWrapper: { position: "relative" },
  searchBox: {
    width: "240px", height: "40px",
    display: "flex", alignItems: "center", gap: "8px",
    padding: "0 14px", borderRadius: "12px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.07)",
  },
  searchIcon: { color: "#64748b", fontSize: "14px" },
  searchInput: {
    flex: 1, background: "transparent", border: "none",
    outline: "none", color: "white", fontSize: "13px",
  },
  searchResults: {
    position: "absolute", top: "50px", left: 0, width: "100%",
    borderRadius: "14px", overflow: "hidden",
    background: "rgba(15,23,42,0.98)",
    border: "1px solid rgba(255,255,255,0.07)",
    boxShadow: "0 15px 40px rgba(0,0,0,0.5)",
  },
  resultItem: {
    padding: "12px 16px", display: "flex", alignItems: "center",
    gap: "10px", color: "white", cursor: "pointer", fontSize: "13px",
  },
  noResult: { padding: "14px", color: "#64748b", fontSize: "13px" },

  rightSection: { display: "flex", alignItems: "center", gap: "12px" },
  actionBtn: {
    padding: "9px 16px", border: "none", borderRadius: "10px",
    background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
    color: "white", fontWeight: 700, cursor: "pointer", fontSize: "13px",
    boxShadow: "0 2px 10px rgba(99,102,241,0.3)",
  },

  // Profile wrap — click pe profile page
  profileWrap: {
    display: "flex", alignItems: "center", gap: "10px",
    padding: "6px 10px", borderRadius: "12px",
    cursor: "pointer",
    border: "1px solid rgba(255,255,255,0.07)",
    background: "rgba(255,255,255,0.04)",
    transition: "all 0.2s",
  },
  userInfo: {
    display: "flex", flexDirection: "column", alignItems: "flex-end",
  },
  userName: {
    fontSize: "13px", fontWeight: 600, color: "#f1f5f9",
  },
  userEmail: {
    fontSize: "11px", color: "#64748b",
  },
  avatarBox: {
    width: "38px", height: "38px", borderRadius: "50%",
    overflow: "hidden", flexShrink: 0,
    border: "2px solid rgba(99,102,241,0.5)",
  },
  avatarImg: {
    width: "38px", height: "38px",
    borderRadius: "50%", objectFit: "cover", display: "block",
  },
  avatarLetter: {
    width: "38px", height: "38px", borderRadius: "50%",
    alignItems: "center", justifyContent: "center",
    background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
    color: "white", fontWeight: 800, fontSize: "16px",
  },
  loginBtn: {
    padding: "9px 18px", borderRadius: "10px", border: "none",
    background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
    color: "white", fontWeight: 700, cursor: "pointer",
  },
};

export default Navbar;