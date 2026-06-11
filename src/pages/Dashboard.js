import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import API from "../api";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const buildAvatarUrl = (url) => {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  return "http://127.0.0.1:8000" + url;
};

function Dashboard() {

  const [user, setUser] = useState(null);
  const [activity, setActivity] = useState([]);
  const navigate = useNavigate();

  const xp = 420;
  const level = Math.floor(xp / 100);
  const progress = xp % 100;

  
      useEffect(() => {
  // Google OAuth token capture
  const params = new URLSearchParams(window.location.search);
  const access = params.get("access");
  const refresh = params.get("refresh");

  if (access && refresh) {
    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);
    // URL clean karo — history mein token na dikhe
    window.history.replaceState({}, document.title, "/dashboard");
  }

  // Baaki wala purana code same rehne do
  const cached = JSON.parse(localStorage.getItem("user"));
  if (cached) {
    setUser({ ...cached, avatar: buildAvatarUrl(cached.avatar) });
  }
  // ... rest of your useEffect
}, []);

    const saved = JSON.parse(localStorage.getItem("codingActivity")) || [];
    setActivity(saved);

    const handleProfileUpdate = (e) => {
      const u = e.detail;
      const updated = { ...u, avatar: buildAvatarUrl(u.avatar) };
      setUser(updated);
      localStorage.setItem("user", JSON.stringify(updated));
    };
    window.addEventListener("profileUpdated", handleProfileUpdate);
    return () => window.removeEventListener("profileUpdated", handleProfileUpdate);

  }, []);

  const addActivity = () => {
    const today = new Date().toISOString().split("T")[0];
    let updated = [...activity];
    const existing = updated.find((a) => a.date === today);
    if (existing) {
      existing.level = Math.min(existing.level + 1, 3);
    } else {
      updated.push({ date: today, level: 1 });
    }
    setActivity(updated);
    localStorage.setItem("codingActivity", JSON.stringify(updated));
  };

  return (
    <div className="app">

      <Sidebar />

      <div className="center">

        <div className="topbar glass">
          <div>
            <h2 className="title">
              <span className="titleGlow">AI </span>
              <span className="titleWhite">CODE</span>
              <span className="titleAI">MENTOR</span>
            </h2>
            <p className="subtitle">Smart Coding • AI Analysis • Developer Growth</p>
          </div>

          <div className="profileBox">
            <div className="avatar">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt="avatar"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.parentNode.innerText =
                      user?.username?.charAt(0).toUpperCase() || "D";
                  }}
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              ) : (
                user?.username?.charAt(0).toUpperCase() || "D"
              )}
            </div>
            <div>
              <h4>{user?.username || "Developer"}</h4>
            </div>
          </div>
        </div>

        <div className="hero">
          <div className="heroGlow glow1"></div>
          <div className="heroGlow glow2"></div>
          <div className="heroContent">
            <div className="heroBadge">
              <span className="dot"></span>
              AI Analyzer Active
            </div>
            <h1>
              Code Smarter<br />With <span>AI Power</span>
            </h1>
            <p>Analyze code, detect bugs, improve logic, and grow your developer skills faster.</p>
            <div className="heroButtons">
              <button className="primaryBtn" onClick={() => { addActivity(); navigate("/run-code"); }}>
                🚀 Run Code
              </button>
              <button className="secondaryBtn" onClick={() => { addActivity(); navigate("/chat"); }}>
                🤖 Open AI Mentor
              </button>
            </div>
          </div>
        </div>

        <div className="videoBox">
          <video className="videoBg" autoPlay muted loop playsInline>
            <source src="/videos/coding.mp4" type="video/mp4" />
          </video>
          <div className="videoOverlay">
            <div className="videoBadge">⚡ AI Powered Workspace</div>
            <h2>Code.<span> Build.</span><br />Ship Faster.</h2>
            <p>Real-time coding • AI analysis • Smart debugging</p>
            <div className="videoButtons">
              <button className="videoPrimary" onClick={() => { addActivity(); navigate("/run-code"); }}>
                🚀 Start Coding
              </button>
              <button className="videoSecondary" onClick={() => { addActivity(); navigate("/practice"); }}>
                🧠 Practice DSA
              </button>
            </div>
          </div>
        </div>

        <div className="featureGrid">
          {[
            ["💻", "Smart Compiler", "Compile and execute code instantly.", "/run-code"],
            ["🤖", "AI Assistant", "Get intelligent coding suggestions.", "/chat"],
            ["🧠", "DSA Arena", "Practice logic & problem solving.", "/practice"],
            ["📊", "Progress Analytics", "Track streaks and performance.", "/history"],
          ].map((item, i) => (
            <motion.div
              key={i}
              className="featureCard"
              whileHover={{ y: -10, scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => { addActivity(); navigate(item[3]); }}
            >
              <div className="featureGlow"></div>
              <div className="featureIcon">{item[0]}</div>
              <h3>{item[1]}</h3>
              <p>{item[2]}</p>
              <span className="exploreBtn">Explore →</span>
            </motion.div>
          ))}
        </div>

        <div className="statsGrid">
          <div className="glass statBox">
            <h3>🎮 XP Progress</h3>
            <div className="levelRow">
              <span>Level {level}</span>
              <span>{progress}%</span>
            </div>
            <div className="xpBar">
              <div className="xpFill" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
          <div className="glass statBox">
            <h3>🤖 AI Coding Score</h3>
            <div className="circle"><span>78</span></div>
            <p>Excellent consistency 🚀</p>
          </div>
        </div>

        <div className="chatBot" onClick={() => { addActivity(); navigate("/chat"); }}>
          🤖
        </div>

        <div className="insightSection">
          <div className="insightCard">
            <h3>⚡ Developer Rank</h3>
            <div className="rankCircle"><span>#127</span></div>
            <p>Top 8% Developers Worldwide</p>
          </div>
          <div className="insightCard">
            <h3>🧠 AI Skill Analysis</h3>
            <div className="skill">
              <span>Python</span>
              <div className="skillBar"><div style={{ width: "90%" }}></div></div>
            </div>
            <div className="skill">
              <span>DSA</span>
              <div className="skillBar"><div style={{ width: "75%" }}></div></div>
            </div>
            <div className="skill">
              <span>React</span>
              <div className="skillBar"><div style={{ width: "85%" }}></div></div>
            </div>
          </div>
          <div className="insightCard">
            <h3>🎯 Today's Mission</h3>
            <ul className="missionList">
              <li>✅ Solve 2 DSA Problems</li>
              <li>✅ Run 5 Code Executions</li>
              <li>⬜ Learn a New Algorithm</li>
              <li>⬜ Complete AI Challenge</li>
            </ul>
          </div>
        </div>

        <div className="actionGrid">
          <div className="actionCard" onClick={() => navigate("/run-code")}>
            💻<h3>Compiler</h3><p>Run and test code instantly</p>
          </div>
          <div className="actionCard" onClick={() => navigate("/chat")}>
            🤖<h3>AI Mentor</h3><p>Ask coding doubts anytime</p>
          </div>
          <div className="actionCard" onClick={() => navigate("/practice")}>
            🧠<h3>Practice Arena</h3><p>Daily coding challenges</p>
          </div>
          <div className="actionCard" onClick={() => navigate("/history")}>
            📊<h3>Analytics</h3><p>Track your growth</p>
          </div>
        </div>

      </div>

      <style>{`
* { margin:0; padding:0; box-sizing:border-box; }
body { font-family:"Segoe UI",sans-serif; }
.app { display:flex; min-height:100vh; background:radial-gradient(circle at top,#111827,#020617); color:white; }
.center { flex:1; padding:28px; overflow-y:auto; }
.glass { background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.08); backdrop-filter:blur(14px); border-radius:24px; box-shadow:0 10px 30px rgba(0,0,0,0.4); }
.topbar { display:flex; justify-content:space-between; align-items:center; padding:20px 25px; }
.title { display:flex; align-items:center; gap:6px; font-size:2rem; font-weight:900; }
.titleGlow { background:linear-gradient(90deg,#00d4ff,#8b5cf6); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
.titleWhite { color:white; }
.titleAI { color:#00d4ff; }
.subtitle { margin-top:6px; color:#94a3b8; font-size:14px; }
.profileBox { display:flex; align-items:center; gap:12px; }
.avatar { width:52px; height:52px; border-radius:50%; display:flex; align-items:center; justify-content:center; background:linear-gradient(135deg,#00d4ff,#8b5cf6); font-weight:700; overflow:hidden; flex-shrink:0; }
.profileBox h4 { color:white; font-size:15px; font-weight:600; }
.hero { margin-top:24px; padding:70px 40px; border-radius:34px; position:relative; overflow:hidden; background:linear-gradient(135deg,#0f172a,#111827,#1e1b4b); }
.heroGlow { position:absolute; width:320px; height:320px; border-radius:50%; filter:blur(120px); opacity:0.25; }
.glow1 { background:#00d4ff; top:-120px; left:-80px; }
.glow2 { background:#8b5cf6; right:-100px; bottom:-120px; }
.heroContent { position:relative; z-index:2; text-align:center; }
.heroBadge { display:inline-flex; align-items:center; gap:10px; padding:10px 22px; border-radius:999px; background:rgba(255,255,255,0.07); color:#e2e8f0; margin-bottom:28px; }
.dot { width:10px; height:10px; border-radius:50%; background:#22c55e; }
.hero h1 { font-size:4.5rem; line-height:1.05; font-weight:900; margin-bottom:20px; }
.hero h1 span { background:linear-gradient(90deg,#00d4ff,#8b5cf6); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
.hero p { max-width:720px; margin:auto; color:#cbd5e1; line-height:1.8; font-size:1.1rem; }
.heroButtons { display:flex; justify-content:center; gap:18px; margin-top:35px; flex-wrap:wrap; }
.primaryBtn,.secondaryBtn,.videoPrimary,.videoSecondary { padding:15px 28px; border:none; border-radius:16px; cursor:pointer; font-size:1rem; font-weight:600; transition:0.3s; }
.primaryBtn,.videoPrimary { background:linear-gradient(90deg,#00d4ff,#8b5cf6); color:white; }
.secondaryBtn,.videoSecondary { background:rgba(255,255,255,0.08); color:white; }
.primaryBtn:hover,.secondaryBtn:hover,.videoPrimary:hover,.videoSecondary:hover { transform:translateY(-4px) scale(1.03); }
.videoBox { margin:-40px auto 0; width:96%; aspect-ratio:21/8; border-radius:34px; overflow:hidden; position:relative; z-index:10; box-shadow:0 20px 60px rgba(0,0,0,0.7); }
.videoBg { width:100%; height:100%; object-fit:cover; filter:brightness(0.45) saturate(1.3); }
.videoOverlay { position:absolute; inset:0; display:flex; flex-direction:column; justify-content:center; align-items:center; text-align:center; background:linear-gradient(to top,rgba(0,0,0,0.92),rgba(0,0,0,0.4),transparent); }
.videoBadge { padding:10px 22px; border-radius:999px; background:rgba(255,255,255,0.08); margin-bottom:24px; }
.videoOverlay h2 { font-size:4rem; line-height:1.05; font-weight:900; margin-bottom:20px; }
.videoOverlay h2 span { background:linear-gradient(90deg,#00d4ff,#8b5cf6); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
.videoOverlay p { color:#dbeafe; margin-bottom:30px; }
.videoButtons { display:flex; gap:18px; }
.featureGrid { display:grid; grid-template-columns:repeat(auto-fit,minmax(260px,1fr)); gap:28px; margin-top:50px; }
.featureCard { position:relative; overflow:hidden; padding:35px 28px; border-radius:30px; background:linear-gradient(145deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03)); border:1px solid rgba(255,255,255,0.08); transition:0.4s ease; cursor:pointer; }
.featureCard:hover { transform:translateY(-10px); border-color:rgba(0,212,255,0.3); }
.featureGlow { position:absolute; width:180px; height:180px; border-radius:50%; background:radial-gradient(rgba(0,212,255,0.2),transparent); top:-80px; right:-80px; }
.featureIcon { width:75px; height:75px; border-radius:22px; display:flex; align-items:center; justify-content:center; font-size:2rem; margin-bottom:22px; background:linear-gradient(135deg,rgba(0,212,255,0.2),rgba(139,92,246,0.2)); }
.featureCard h3 { font-size:1.4rem; margin-bottom:12px; }
.featureCard p { color:#cbd5e1; line-height:1.8; }
.exploreBtn { display:inline-block; margin-top:22px; color:#00d4ff; font-weight:600; }
.statsGrid { display:grid; grid-template-columns:repeat(auto-fit,minmax(320px,1fr)); gap:24px; margin-top:35px; }
.statBox { padding:28px; }
.levelRow { display:flex; justify-content:space-between; margin:20px 0 10px; }
.xpBar { height:12px; background:#1e293b; border-radius:999px; overflow:hidden; }
.xpFill { height:100%; border-radius:999px; background:linear-gradient(90deg,#00d4ff,#8b5cf6); }
.circle { width:140px; height:140px; border-radius:50%; background:conic-gradient(#8b5cf6 78%,#1e293b 0); display:flex; align-items:center; justify-content:center; margin:25px auto; }
.circle span { font-size:2rem; font-weight:800; }
.chatBot { position:fixed; right:28px; bottom:28px; width:68px; height:68px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:1.8rem; cursor:pointer; background:linear-gradient(135deg,#00d4ff,#8b5cf6); box-shadow:0 10px 25px rgba(0,0,0,0.45); }
.insightSection { display:grid; grid-template-columns:repeat(auto-fit,minmax(320px,1fr)); gap:25px; margin-top:40px; }
.insightCard { background:linear-gradient(145deg,rgba(255,255,255,.08),rgba(255,255,255,.03)); border:1px solid rgba(255,255,255,.08); border-radius:30px; padding:30px; backdrop-filter:blur(20px); transition:.4s; }
.insightCard:hover { transform:translateY(-10px); box-shadow:0 20px 40px rgba(0,212,255,.15); }
.rankCircle { width:170px; height:170px; margin:25px auto; border-radius:50%; display:flex; justify-content:center; align-items:center; font-size:2rem; font-weight:800; background:conic-gradient(#00d4ff 82%,rgba(255,255,255,.08) 0); box-shadow:0 0 35px rgba(0,212,255,.25); }
.skill { margin-top:20px; }
.skillBar { height:12px; background:#1e293b; border-radius:999px; overflow:hidden; margin-top:8px; }
.skillBar div { height:100%; border-radius:999px; background:linear-gradient(90deg,#00d4ff,#8b5cf6); }
.missionList { list-style:none; margin-top:20px; }
.missionList li { margin-bottom:14px; color:#cbd5e1; }
.actionGrid { display:grid; grid-template-columns:repeat(auto-fit,minmax(250px,1fr)); gap:25px; margin-top:40px; margin-bottom:40px; }
.actionCard { padding:35px; border-radius:30px; cursor:pointer; text-align:center; background:linear-gradient(145deg,rgba(255,255,255,.08),rgba(255,255,255,.03)); border:1px solid rgba(255,255,255,.08); transition:.4s; }
.actionCard:hover { transform:translateY(-10px) scale(1.03); box-shadow:0 20px 40px rgba(139,92,246,.18); }
.actionCard h3 { margin-top:15px; margin-bottom:10px; }
.actionCard p { color:#94a3b8; }
@media(max-width:768px){
  .topbar { flex-direction:column; gap:20px; align-items:flex-start; }
  .hero { padding:60px 25px; }
  .hero h1 { font-size:3rem; }
  .videoBox { aspect-ratio:16/10; }
  .videoOverlay h2 { font-size:2.4rem; }
  .featureGrid { grid-template-columns:1fr; }
}
  .dashboard {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

/* MOBILE */
@media (max-width: 768px) {
  .dashboard {
    grid-template-columns: 1fr;
  }
}
      `}</style>

    </div>
  );
}

export default Dashboard;