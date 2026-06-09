import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { FaCode, FaRobot, FaSearch, FaHistory, FaBars, FaFlask } from "react-icons/fa";

function Sidebar() {
  const [open, setOpen] = useState(true);
  const [online] = useState(true);
  const location = useLocation();

  // XP SYSTEM
  const [xp, setXP] = useState(() => Number(localStorage.getItem("xp")) || 1000);

  useEffect(() => {
    const newXP = xp + 10;
    setXP(newXP);
    localStorage.setItem("xp", newXP);
  }, [location.pathname]);

  // MOBILE AUTO COLLAPSE
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setOpen(false);
      else setOpen(true);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // BACKEND READY PROGRESS (optional)
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await fetch("/api/progress");
        const data = await res.json();
        localStorage.setItem("progress", JSON.stringify(data));
      } catch (err) {
        console.log("Progress API not ready");
      }
    };

    fetchProgress();
  }, []);

  return (
    <div style={{ ...styles.wrapper, width: open ? "280px" : "75px" }}>

      {/* TOP */}
      <div style={styles.top}>
        <div style={styles.brand}>
          {open ? "⚡ AI MENTOR" : "⚡"}
        </div>

        <FaBars style={styles.toggle} onClick={() => setOpen(!open)} />
      </div>
{/* 
      XP BOX
      {open && (
        <div style={styles.xpBox}>
          🚀 XP: {xp} | Level: {xp > 1500 ? "Pro" : "Intermediate"}
        </div>
      )} */}

      {/* AI STATUS */}
      {open && (
        <div style={styles.aiStatus}>
          🤖 AI Mentor:{" "}
          <span style={{ color: online ? "#2CB67D" : "#ff4d4d" }}>
            {online ? "Online" : "Offline"}
          </span>
        </div>
      )}

      {/* LINKS */}
      <NavLink to="/run-code" style={styles.link}>
        <FaCode /> {open && "Code Editor"}
      </NavLink>

      <NavLink to="/analyze" style={styles.link}>
        <FaRobot /> {open && "Analyze Code"}
      </NavLink>

      <NavLink to="/chat" style={styles.link}>
        <FaSearch /> {open && "AI Chat"}
      </NavLink>

      <NavLink to="/practice" style={styles.link}>
        📝 {open && "Practice"}
      </NavLink>

      {/* TEST WITH BADGE */}
      <NavLink to="/test" style={styles.link}>
        <FaFlask /> {open && (
          <span style={styles.badgeWrap}>
            Test
            <span style={styles.badge}>3</span>
          </span>
        )}
      </NavLink>

      <NavLink to="/history" style={styles.link}>
        <FaHistory /> {open && "History"}
      </NavLink>

    </div>
  );
}
const styles = {
  wrapper: {
    height: "100vh",
    transition: "0.3s",
    background: "linear-gradient(180deg, rgba(18,18,28,0.95), rgba(10,10,20,0.95))",
    backdropFilter: "blur(18px)",
    borderRight: "1px solid rgba(255,255,255,0.06)",
    display: "flex",
    flexDirection: "column",
    padding: "14px",
  },

  top: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "15px",
  },

  brand: {
    fontSize: "14px",
    fontWeight: "800",
    color: "#fff",
  },

  toggle: {
    cursor: "pointer",
    color: "#aaa",
  },

  xpBox: {
    fontSize: "12px",
    padding: "10px",
    borderRadius: "10px",
    background: "rgba(127,90,240,0.15)",
    border: "1px solid rgba(127,90,240,0.3)",
    color: "#fff",
    marginBottom: "10px",
  },

  aiStatus: {
    fontSize: "12px",
    padding: "8px",
    marginBottom: "15px",
    borderRadius: "10px",
    background: "rgba(255,255,255,0.05)",
    color: "#ccc",
  },

  link: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px",
    marginBottom: "8px",
    borderRadius: "10px",
    textDecoration: "none",
    color: "#cfcfcf",
    transition: "0.25s",
  },

  badgeWrap: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },

  badge: {
    position: "absolute",
    right: "-18px",
    top: "-6px",
    background: "#ff4d4d",
    color: "#fff",
    fontSize: "10px",
    padding: "2px 6px",
    borderRadius: "10px",
  },
};
export default Sidebar;