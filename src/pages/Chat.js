// import React, { useState, useRef, useEffect } from "react";
// import axios from "axios";
// import Sidebar from "../components/Sidebar";

// function Chat() {
//   const [msg, setMsg] = useState("");
//   const [chat, setChat] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const chatEndRef = useRef(null);

//   const sendMessage = async () => {
//     if (!msg.trim() || loading) return;

//     const userMessage = msg;

//     setChat(prev => [
//       ...prev,
//       { user: userMessage, bot: "loading" }
//     ]);

//     setMsg("");
//     setLoading(true);

//     try {
//       const res = await axios.post("http://127.0.0.1:8000/api/chat/", {
//         message: userMessage,
//       });

//       setChat(prev => {
//         const updated = [...prev];
//         updated[updated.length - 1].bot = res.data.reply;
//         return updated;
//       });

//     } catch (err) {
//       setChat(prev => {
//         const updated = [...prev];
//         updated[updated.length - 1].bot = "❌ Server error";
//         return updated;
//       });
//     }

//     setLoading(false);
//   };

//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [chat]);

//   const handleKeyDown = (e) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       sendMessage();
//     }
//   };

//   return (
//     <div style={styles.app}>
//       <Sidebar />

//       <div style={styles.main}>
//         <div style={styles.container}>

//           {/* HEADER */}
//           <div style={styles.header}>
//             <h2>💬 AI Mentor</h2>
//             <span style={styles.status}>● Online</span>
//           </div>

//           {/* BODY */}
//           <div style={styles.body}>

//             {chat.length === 0 && (
//               <p style={styles.empty}>
//                 🚀 Ask coding doubts, errors, logic...
//               </p>
//             )}

//             {chat.map((c, i) => (
//               <div key={i}>

//                 {/* USER */}
//                 <div style={{ ...styles.row, justifyContent: "flex-end" }}>
//                   <div style={{ ...styles.bubble, ...styles.userBubble }}>
//                     {c.user}
//                   </div>
//                   <div style={{ ...styles.avatar, ...styles.userAvatar }}>
//                     U
//                   </div>
//                 </div>

//                 {/* BOT */}
//                 <div style={{ ...styles.row, justifyContent: "flex-start" }}>
//                   <div style={{ ...styles.avatar, ...styles.botAvatar }}>
//                     🤖
//                   </div>

//                   <div style={{ ...styles.bubble, ...styles.botBubble }}>
//                     {c.bot === "loading" ? (
//                       <Typing />
//                     ) : (
//                       c.bot
//                     )}
//                   </div>
//                 </div>

//               </div>
//             ))}

//             <div ref={chatEndRef} />
//           </div>

//           {/* FOOTER */}
//           <div style={styles.footer}>
//             <textarea
//               value={msg}
//               onChange={(e) => setMsg(e.target.value)}
//               onKeyDown={handleKeyDown}
//               placeholder="Ask about code..."
//               rows={1}
//               style={styles.input}
//             />

//             <button
//               style={styles.button}
//               onClick={sendMessage}
//               disabled={loading || !msg.trim()}
//             >
//               {loading ? "..." : "Send"}
//             </button>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// }

// /* 🔥 Typing Animation Component */
// function Typing() {
//   return (
//     <div style={styles.typing}>
//       <span style={styles.dot}></span>
//       <span style={styles.dot}></span>
//       <span style={styles.dot}></span>
//     </div>
//   );
// }

// /* 🔥 STYLES (CSS in JS) */
// const styles = {
//   app: {
//     display: "flex",
//     height: "100vh",
//     background: "#020617",
//     color: "white",
//   },

//   main: {
//     flex: 1,
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//   },

//   container: {
//     width: "70%",
//     height: "90vh",
//     background: "linear-gradient(135deg, #0f172a, #020617)",
//     borderRadius: "16px",
//     display: "flex",
//     flexDirection: "column",
//     boxShadow: "0 0 40px rgba(0,0,0,0.6)",
//   },

//   header: {
//     padding: "15px",
//     display: "flex",
//     justifyContent: "space-between",
//     borderBottom: "1px solid #1e293b",
//   },

//   status: {
//     color: "#22c55e",
//   },

//   body: {
//     flex: 1,
//     padding: "20px",
//     overflowY: "auto",
//     display: "flex",
//     flexDirection: "column",
//     gap: "14px",
//   },

//   empty: {
//     textAlign: "center",
//     color: "#64748b",
//   },

//   row: {
//     display: "flex",
//     alignItems: "flex-end",
//     gap: "8px",
//   },

//   bubble: {
//     maxWidth: "65%",
//     padding: "10px 14px",
//     borderRadius: "14px",
//     fontSize: "14px",
//   },

//   userBubble: {
//     background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
//   },

//   botBubble: {
//     background: "#1e293b",
//   },

//   avatar: {
//     width: "28px",
//     height: "28px",
//     borderRadius: "50%",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     fontSize: "13px",
//   },

//   userAvatar: {
//     background: "#3b82f6",
//   },

//   botAvatar: {
//     background: "#22c55e",
//   },

//   footer: {
//     display: "flex",
//     gap: "10px",
//     padding: "15px",
//     borderTop: "1px solid #1e293b",
//   },

//   input: {
//     flex: 1,
//     padding: "10px",
//     borderRadius: "8px",
//     background: "#020617",
//     color: "white",
//     border: "1px solid #334155",
//     outline: "none",
//   },

//   button: {
//     background: "linear-gradient(135deg, #22c55e, #16a34a)",
//     border: "none",
//     padding: "8px 16px",
//     borderRadius: "8px",
//     color: "white",
//     cursor: "pointer",
//   },

//   typing: {
//     display: "flex",
//     gap: "5px",
//   },

//   dot: {
//     width: "6px",
//     height: "6px",
//     background: "#94a3b8",
//     borderRadius: "50%",
//     animation: "blink 1.4s infinite",
//   },
// };

// export default Chat;





import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import API from "../api";

const STORAGE_KEY = "ai_mentor_sessions";

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function createSession(name) {
  return { id: generateId(), name, messages: [], createdAt: Date.now() };
}

function loadSessions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.length > 0) return parsed;
    }
  } catch {}
  return [createSession("Chat 1")];
}

export default function Chat() {
  const [sessions, setSessions] = useState(loadSessions);
  const [activeId, setActiveId] = useState(() => loadSessions()[0].id);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const chatEndRef = useRef(null);

  const activeSession = sessions.find(s => s.id === activeId) || sessions[0];
  const chat = activeSession?.messages || [];

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [sessions]);

  const updateMessages = (id, updater) => {
    setSessions(prev => prev.map(s => s.id === id ? { ...s, messages: updater(s.messages) } : s));
  };

  const sendMessage = async () => {
    if (!msg.trim() || loading) return;
    const userMessage = msg;
    updateMessages(activeId, msgs => [...msgs, { user: userMessage, bot: "loading" }]);
    setMsg("");
    setLoading(true);
    try {
      // const res = await axios.post("http://127.0.0.1:8000/api/chat/", { message: userMessage });
      // const res = await axios.post("https://ai-code-mentor-backend-0rmn.onrender.com/api/chat/", { message: userMessage });
     const res = await API.post("chat/", { message: userMessage });
      updateMessages(activeId, msgs => {
        const updated = [...msgs];
        updated[updated.length - 1] = { ...updated[updated.length - 1], bot: res.data.reply };
        return updated;
      });
    } catch {
      updateMessages(activeId, msgs => {
        const updated = [...msgs];
        updated[updated.length - 1] = { ...updated[updated.length - 1], bot: "Server error. Please try again." };
        return updated;
      });
    }
    setLoading(false);
  };

  const addSession = () => {
    const newSession = createSession("Chat " + (sessions.length + 1));
    setSessions(prev => [...prev, newSession]);
    setActiveId(newSession.id);
  };

  const deleteSession = (id) => {
    if (sessions.length === 1) return;
    const remaining = sessions.filter(s => s.id !== id);
    setSessions(remaining);
    if (activeId === id) setActiveId(remaining[0].id);
  };

  const clearChat = () => {
    updateMessages(activeId, () => []);
  };

  const exportChat = () => {
    const lines = chat.map(c => "You: " + c.user + "\n\nAI: " + c.bot).join("\n\n---\n\n");
    const blob = new Blob([lines], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = (activeSession.name || "chat") + ".txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const theme = darkMode ? darkStyles : lightStyles;

  return (
    <div style={{ ...baseStyles.app, background: darkMode ? "#020617" : "#f1f5f9", color: darkMode ? "white" : "#0f172a" }}>
      <Sidebar />
      <div style={baseStyles.main}>

        {/* SESSION TABS */}
        <div style={{ ...theme.tabsBar }}>
          <div style={baseStyles.tabsScroll}>
            {sessions.map(s => (
              <div
                key={s.id}
                style={{ ...theme.tab, ...(s.id === activeId ? theme.activeTab : {}) }}
                onClick={() => setActiveId(s.id)}
              >
                <span style={{ fontSize: "13px" }}>{s.name}</span>
                {sessions.length > 1 && (
                  <button
                    style={theme.closeTab}
                    onClick={(e) => { e.stopPropagation(); deleteSession(s.id); }}
                  >×</button>
                )}
              </div>
            ))}
            <button style={theme.newTabBtn} onClick={addSession}>+ New</button>
          </div>
        </div>

        <div style={{ ...theme.container }}>

          {/* HEADER */}
          <div style={theme.header}>
            <h2 style={{ margin: 0, fontSize: "17px", fontWeight: 500 }}>
              {activeSession.name}
            </h2>
            <div style={baseStyles.headerActions}>
              <span style={baseStyles.statusDot}>● Online</span>
              <button style={theme.actionBtn} onClick={() => setDarkMode(d => !d)}>
                {darkMode ? "☀ Light" : "☾ Dark"}
              </button>
              
            
              <button style={theme.actionBtn} onClick={clearChat} disabled={chat.length === 0}>
                Clear
              </button>
            </div>
          </div>

          {/* BODY */}
          <div style={theme.body}>
            {chat.length === 0 && (
              <p style={{ textAlign: "center", color: darkMode ? "#64748b" : "#94a3b8", marginTop: "60px" }}>
                Ask coding doubts, errors, logic...
              </p>
            )}
            {chat.map((c, i) => (
              <div key={i}>
                <div style={{ ...baseStyles.row, justifyContent: "flex-end" }}>
                  <div style={{ ...baseStyles.bubble, ...theme.userBubble }}>{c.user}</div>
                  <div style={{ ...baseStyles.avatar, background: "#3b82f6", color: "white" }}>U</div>
                </div>
                <div style={{ ...baseStyles.row, justifyContent: "flex-start" }}>
                  <div style={{ ...baseStyles.avatar, background: "#22c55e", color: "#052e16" }}>AI</div>
                  <div style={{ ...baseStyles.bubble, ...theme.botBubble }}>
                    {c.bot === "loading" ? <Typing darkMode={darkMode} /> : (
                      <ReactMarkdown
                        components={{
                          code({ node, inline, className, children, ...props }) {
                            const match = /language-(\w+)/.exec(className || "");
                            const codeStr = String(children).replace(/\n$/, "");
                            if (!inline && match) {
                              return (
                                <div style={{ position: "relative" }}>
                                  <button
                                    onClick={() => {
                                      navigator.clipboard.writeText(codeStr);
                                      const btn = document.getElementById("cbtn-" + i + "-" + match[1]);
                                      if (btn) { btn.textContent = "Copied!"; setTimeout(() => { btn.textContent = "Copy"; }, 2000); }
                                    }}
                                    id={"cbtn-" + i + "-" + match[1]}
                                    style={{
                                      position: "absolute", top: "8px", right: "8px", zIndex: 1,
                                      background: "#334155", color: "#cbd5e1", border: "none",
                                      borderRadius: "5px", padding: "3px 9px", fontSize: "11px", cursor: "pointer",
                                    }}
                                  >Copy</button>
                                  <SyntaxHighlighter
                                    style={darkMode ? oneDark : oneLight}
                                    language={match[1]}
                                    PreTag="div"
                                    customStyle={{ borderRadius: "8px", fontSize: "13px", margin: "8px 0", paddingTop: "32px" }}
                                    {...props}
                                  >{codeStr}</SyntaxHighlighter>
                                </div>
                              );
                            }
                            return (
                              <code style={{ background: darkMode ? "#0f172a" : "#e2e8f0", color: darkMode ? "#7dd3fc" : "#0369a1", padding: "1px 5px", borderRadius: "4px", fontFamily: "monospace", fontSize: "13px" }} {...props}>
                                {children}
                              </code>
                            );
                          },
                          p: ({ children }) => <p style={{ margin: "4px 0", lineHeight: "1.65" }}>{children}</p>,
                        }}
                      >{c.bot}</ReactMarkdown>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* FOOTER */}
          <div style={theme.footer}>
            <textarea
              value={msg}
              onChange={e => setMsg(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about code... (Enter to send)"
              rows={1}
              style={theme.input}
            />
            <button
              style={{ ...theme.sendBtn, opacity: loading || !msg.trim() ? 0.5 : 1, cursor: loading || !msg.trim() ? "not-allowed" : "pointer" }}
              onClick={sendMessage}
              disabled={loading || !msg.trim()}
            >{loading ? "..." : "Send"}</button>
          </div>

        </div>
      </div>
    </div>
  );
}

function Typing({ darkMode }) {
  return (
    <div style={{ display: "flex", gap: "5px", alignItems: "center", padding: "2px 0" }}>
      <style>{`
        @keyframes mentorBlink {
          0%, 80%, 100% { opacity: 0.2; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
      {[0, 1, 2].map(i => (
        <span key={i} style={{
          width: "7px", height: "7px", borderRadius: "50%",
          background: darkMode ? "#94a3b8" : "#64748b",
          display: "inline-block",
          animation: `mentorBlink 1.4s infinite ${i * 0.2}s`,
        }} />
      ))}
    </div>
  );
}

const baseStyles = {
  app: { display: "flex", height: "100vh", transition: "background 0.3s" },
  main: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: "12px" },
  tabsScroll: { display: "flex", gap: "6px", overflowX: "auto", padding: "0 4px", alignItems: "center" },
  row: { display: "flex", alignItems: "flex-end", gap: "8px" },
  bubble: { maxWidth: "65%", padding: "10px 14px", borderRadius: "14px", fontSize: "14px", lineHeight: "1.6" },
  avatar: { width: "28px", height: "28px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 600, flexShrink: 0 },
  headerActions: { display: "flex", alignItems: "center", gap: "8px" },
  statusDot: { color: "#22c55e", fontSize: "13px" },
};

const darkStyles = {
  tabsBar: { width: "70%", marginBottom: "6px" },
  tab: { display: "flex", alignItems: "center", gap: "6px", padding: "6px 14px", borderRadius: "8px", cursor: "pointer", background: "#0f172a", border: "1px solid #1e293b", color: "#64748b", whiteSpace: "nowrap" },
  activeTab: { background: "#1e293b", color: "white", borderColor: "#334155" },
  closeTab: { background: "transparent", border: "none", color: "#64748b", cursor: "pointer", fontSize: "16px", lineHeight: 1, padding: "0 2px" },
  newTabBtn: { background: "transparent", border: "1px dashed #334155", color: "#64748b", borderRadius: "8px", padding: "6px 12px", cursor: "pointer", fontSize: "13px", whiteSpace: "nowrap" },
  container: { width: "70%", height: "83vh", background: "linear-gradient(135deg, #0f172a, #020617)", borderRadius: "16px", display: "flex", flexDirection: "column", boxShadow: "0 0 40px rgba(0,0,0,0.6)" },
  header: { padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #1e293b" },
  actionBtn: { background: "transparent", border: "1px solid #334155", color: "#94a3b8", borderRadius: "6px", padding: "4px 10px", cursor: "pointer", fontSize: "12px" },
  body: { flex: 1, padding: "20px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "14px" },
  userBubble: { background: "linear-gradient(135deg, #2563eb, #1d4ed8)", color: "white" },
  botBubble: { background: "#1e293b", color: "white" },
  footer: { display: "flex", gap: "10px", padding: "14px 18px", borderTop: "1px solid #1e293b" },
  input: { flex: 1, padding: "10px 14px", borderRadius: "8px", background: "#020617", color: "white", border: "1px solid #334155", outline: "none", resize: "none", fontSize: "14px" },
  sendBtn: { background: "linear-gradient(135deg, #22c55e, #16a34a)", border: "none", padding: "8px 20px", borderRadius: "8px", color: "white", fontWeight: 500 },
};

const lightStyles = {
  tabsBar: { width: "70%", marginBottom: "6px" },
  tab: { display: "flex", alignItems: "center", gap: "6px", padding: "6px 14px", borderRadius: "8px", cursor: "pointer", background: "#e2e8f0", border: "1px solid #cbd5e1", color: "#64748b", whiteSpace: "nowrap" },
  activeTab: { background: "white", color: "#0f172a", borderColor: "#94a3b8" },
  closeTab: { background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: "16px", lineHeight: 1, padding: "0 2px" },
  newTabBtn: { background: "transparent", border: "1px dashed #94a3b8", color: "#64748b", borderRadius: "8px", padding: "6px 12px", cursor: "pointer", fontSize: "13px", whiteSpace: "nowrap" },
  container: { width: "70%", height: "83vh", background: "white", borderRadius: "16px", display: "flex", flexDirection: "column", boxShadow: "0 4px 24px rgba(0,0,0,0.1)", border: "1px solid #e2e8f0" },
  header: { padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #e2e8f0" },
  actionBtn: { background: "transparent", border: "1px solid #cbd5e1", color: "#475569", borderRadius: "6px", padding: "4px 10px", cursor: "pointer", fontSize: "12px" },
  body: { flex: 1, padding: "20px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "14px" },
  userBubble: { background: "linear-gradient(135deg, #2563eb, #1d4ed8)", color: "white" },
  botBubble: { background: "#f1f5f9", color: "#0f172a" },
  footer: { display: "flex", gap: "10px", padding: "14px 18px", borderTop: "1px solid #e2e8f0" },
  input: { flex: 1, padding: "10px 14px", borderRadius: "8px", background: "#f8fafc", color: "#0f172a", border: "1px solid #cbd5e1", outline: "none", resize: "none", fontSize: "14px" },
  sendBtn: { background: "linear-gradient(135deg, #22c55e, #16a34a)", border: "none", padding: "8px 20px", borderRadius: "8px", color: "white", fontWeight: 500 },
  
};
