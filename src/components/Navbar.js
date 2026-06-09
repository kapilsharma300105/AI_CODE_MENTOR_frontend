import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

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
    return "http://127.0.0.1:8000" + url;
  };

  // localStorage se user read karo
  const syncUser = () => {
    try {
      const stored = localStorage.getItem("user");
      setUser(stored ? JSON.parse(stored) : null);
    } catch { setUser(null); }
  };

  useEffect(() => {
    syncUser();

    // Profile.jsx se event aata hai
    window.addEventListener("profileUpdated", syncUser);
    window.addEventListener("localStorageUpdated", syncUser);

    // Jab user dashboard pe aaye tab bhi sync karo
    window.addEventListener("focus", syncUser);

    return () => {
      window.removeEventListener("profileUpdated", syncUser);
      window.removeEventListener("localStorageUpdated", syncUser);
      window.removeEventListener("focus", syncUser);
    };
  }, []);

  const avatarUrl = getAvatarUrl(user?.avatar);
  const avatarLetter = user?.username?.charAt(0).toUpperCase() || "D";

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
            <div style={styles.profileWrap} onClick={() => navigate("/profile")} title={user?.username}>
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="avatar"
                  style={styles.avatarImg}
                  onError={e => {
                    e.target.style.display = "none";
                    e.target.parentNode.querySelector(".fallback").style.display = "flex";
                  }}
                />
              ) : null}
              <div
                className="fallback"
                style={{
                  display: avatarUrl ? "none" : "flex",
                  ...styles.avatarLetter,
                }}
              >
                {avatarLetter}
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
    padding: "14px 28px", background: "rgba(10,15,25,0.78)",
    backdropFilter: "blur(18px)", borderBottom: "1px solid rgba(255,255,255,0.06)",
    position: "sticky", top: 0, zIndex: 999,
  },
  logoSection: { display: "flex", alignItems: "center", gap: "14px", cursor: "pointer" },
  logoIcon: { width: "50px", height: "50px", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", background: "linear-gradient(135deg,#00d4ff,#8b5cf6)" },
  logoText: { margin: 0, fontSize: "24px", fontWeight: 900, background: "linear-gradient(90deg,#00d4ff,#8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  logoSub: { margin: 0, fontSize: "12px", color: "#94a3b8" },
  searchWrapper: { position: "relative" },
  searchBox: { width: "240px", height: "42px", display: "flex", alignItems: "center", gap: "8px", padding: "0 14px", borderRadius: "14px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.06)" },
  searchIcon: { color: "#94a3b8" },
  searchInput: { flex: 1, background: "transparent", border: "none", outline: "none", color: "white", fontSize: "14px" },
  searchResults: { position: "absolute", top: "52px", left: 0, width: "100%", borderRadius: "16px", overflow: "hidden", background: "rgba(15,23,42,0.98)", border: "1px solid rgba(255,255,255,0.06)", boxShadow: "0 15px 40px rgba(0,0,0,0.45)" },
  resultItem: { padding: "14px", display: "flex", alignItems: "center", gap: "10px", color: "white", cursor: "pointer" },
  noResult: { padding: "14px", color: "#94a3b8" },
  rightSection: { display: "flex", alignItems: "center", gap: "14px" },
  actionBtn: { padding: "10px 16px", border: "none", borderRadius: "12px", background: "linear-gradient(135deg,#00d4ff,#8b5cf6)", color: "white", fontWeight: 700, cursor: "pointer" },
  profileWrap: { width: "46px", height: "46px", borderRadius: "50%", overflow: "hidden", cursor: "pointer" },
  avatarImg: { width: "46px", height: "46px", borderRadius: "50%", objectFit: "cover", display: "block" },
  avatarLetter: { width: "46px", height: "46px", borderRadius: "50%", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg,#00d4ff,#8b5cf6)", color: "white", fontWeight: 800, fontSize: "18px" },
  loginBtn: { padding: "10px 18px", borderRadius: "12px", border: "none", background: "linear-gradient(135deg,#00d4ff,#8b5cf6)", color: "white", fontWeight: 700, cursor: "pointer" },
};

export default Navbar;