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
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import API from "../api";
import Sidebar from "../components/Sidebar";

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
  const [copiedId, setCopiedId] = useState(null);
  const chatEndRef = useRef(null);
  const textareaRef = useRef(null);

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
    if (textareaRef.current) textareaRef.current.style.height = "44px";
    setLoading(true);
    try {
      const res = await API.post("chat/", { message: userMessage });
      updateMessages(activeId, msgs => {
        const updated = [...msgs];
        updated[updated.length - 1] = { ...updated[updated.length - 1], bot: res.data.reply };
        return updated;
      });
    } catch {
      updateMessages(activeId, msgs => {
        const updated = [...msgs];
        updated[updated.length - 1] = { ...updated[updated.length - 1], bot: "❌ Server error. Please try again." };
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

  const clearChat = () => updateMessages(activeId, () => []);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const handleInput = (e) => {
    setMsg(e.target.value);
    e.target.style.height = "44px";
    e.target.style.height = Math.min(e.target.scrollHeight, 140) + "px";
  };

  const copyCode = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const d = darkMode;

  return (
    <div style={{
      display: "flex", height: "100vh",
      background: d ? "#0a0f1e" : "#f0f4f8",
      color: d ? "#e2e8f0" : "#1e293b",
      fontFamily: "'Inter', -apple-system, sans-serif",
      transition: "all 0.3s ease"
    }}>
      <Sidebar />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "16px 16px 0", overflow: "hidden" }}>

        {/* TABS */}
        <div style={{ width: "min(760px, 100%)", marginBottom: "10px" }}>
          <div style={{ display: "flex", gap: "6px", overflowX: "auto", alignItems: "center", paddingBottom: "2px" }}>
            {sessions.map(s => (
              <div key={s.id} onClick={() => setActiveId(s.id)} style={{
                display: "flex", alignItems: "center", gap: "6px",
                padding: "6px 14px", borderRadius: "10px", cursor: "pointer",
                whiteSpace: "nowrap", fontSize: "13px", fontWeight: 500,
                transition: "all 0.2s",
                background: s.id === activeId
                  ? (d ? "linear-gradient(135deg,#6366f1,#8b5cf6)" : "linear-gradient(135deg,#6366f1,#8b5cf6)")
                  : (d ? "#131929" : "#e2e8f0"),
                color: s.id === activeId ? "white" : (d ? "#64748b" : "#64748b"),
                border: s.id === activeId ? "none" : `1px solid ${d ? "#1e293b" : "#cbd5e1"}`,
                boxShadow: s.id === activeId ? "0 2px 12px rgba(99,102,241,0.35)" : "none",
              }}>
                <span>💬</span>
                <span>{s.name}</span>
                {sessions.length > 1 && (
                  <button onClick={e => { e.stopPropagation(); deleteSession(s.id); }} style={{
                    background: "transparent", border: "none", color: "inherit",
                    cursor: "pointer", fontSize: "15px", lineHeight: 1, opacity: 0.6,
                    padding: "0 2px", marginLeft: "2px"
                  }}>×</button>
                )}
              </div>
            ))}
            <button onClick={addSession} style={{
              background: "transparent",
              border: `1px dashed ${d ? "#334155" : "#94a3b8"}`,
              color: d ? "#64748b" : "#94a3b8",
              borderRadius: "10px", padding: "6px 14px",
              cursor: "pointer", fontSize: "13px", whiteSpace: "nowrap",
              transition: "all 0.2s"
            }}>+ New</button>
          </div>
        </div>

        {/* CHAT CONTAINER */}
        <div style={{
          width: "min(760px, 100%)", flex: 1, display: "flex", flexDirection: "column",
          background: d ? "#0f172a" : "white",
          borderRadius: "20px 20px 0 0",
          border: `1px solid ${d ? "#1e293b" : "#e2e8f0"}`,
          borderBottom: "none",
          boxShadow: d ? "0 0 60px rgba(0,0,0,0.5)" : "0 4px 30px rgba(0,0,0,0.08)",
          overflow: "hidden"
        }}>

          {/* HEADER */}
          <div style={{
            padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center",
            borderBottom: `1px solid ${d ? "#1e293b" : "#f1f5f9"}`,
            background: d ? "#0f172a" : "white",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{
                width: "34px", height: "34px", borderRadius: "10px",
                background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "16px", boxShadow: "0 2px 10px rgba(99,102,241,0.4)"
              }}>🤖</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: "14px" }}>{activeSession.name}</div>
                <div style={{ fontSize: "11px", color: "#22c55e", display: "flex", alignItems: "center", gap: "4px" }}>
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#22c55e", display: "inline-block" }}></span>
                  AI Mentor Online
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button onClick={() => setDarkMode(d => !d)} style={btnStyle(d)}>
                {d ? "☀ Light" : "☾ Dark"}
              </button>
              <button onClick={clearChat} disabled={chat.length === 0} style={{ ...btnStyle(d), opacity: chat.length === 0 ? 0.4 : 1 }}>
                🗑 Clear
              </button>
            </div>
          </div>

          {/* MESSAGES */}
          <div style={{
            flex: 1, overflowY: "auto", padding: "24px 20px",
            display: "flex", flexDirection: "column", gap: "20px",
            scrollbarWidth: "thin",
            scrollbarColor: d ? "#1e293b transparent" : "#e2e8f0 transparent"
          }}>
            {chat.length === 0 && (
              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "12px", opacity: 0.5, marginTop: "60px" }}>
                <div style={{ fontSize: "48px" }}>💡</div>
                <div style={{ fontSize: "15px", fontWeight: 500 }}>Ask anything about code</div>
                <div style={{ fontSize: "13px", color: d ? "#475569" : "#94a3b8" }}>Errors · Logic · Concepts · DSA · Projects</div>
              </div>
            )}

            {chat.map((c, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>

                {/* USER MESSAGE */}
                <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "flex-end", gap: "8px" }}>
                  <div style={{
                    maxWidth: "70%", padding: "12px 16px",
                    background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                    borderRadius: "18px 18px 4px 18px",
                    fontSize: "14px", lineHeight: "1.6", color: "white",
                    boxShadow: "0 2px 12px rgba(99,102,241,0.3)"
                  }}>{c.user}</div>
                  <div style={{
                    width: "30px", height: "30px", borderRadius: "50%", flexShrink: 0,
                    background: "linear-gradient(135deg,#3b82f6,#6366f1)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "11px", fontWeight: 700, color: "white"
                  }}>U</div>
                </div>

                {/* BOT MESSAGE */}
                <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "flex-end", gap: "8px" }}>
                  <div style={{
                    width: "30px", height: "30px", borderRadius: "50%", flexShrink: 0,
                    background: "linear-gradient(135deg,#10b981,#059669)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "14px"
                  }}>🤖</div>
                  <div style={{
                    maxWidth: "80%", padding: "14px 16px",
                    background: d ? "#1e293b" : "#f8fafc",
                    borderRadius: "4px 18px 18px 18px",
                    fontSize: "14px", lineHeight: "1.7",
                    border: `1px solid ${d ? "#334155" : "#e2e8f0"}`,
                    color: d ? "#e2e8f0" : "#1e293b"
                  }}>
                    {c.bot === "loading" ? <Typing /> : (
                      <ReactMarkdown components={{
                        code({ node, inline, className, children, ...props }) {
                          const match = /language-(\w+)/.exec(className || "");
                          const codeStr = String(children).replace(/\n$/, "");
                          const codeId = `code-${i}-${match?.[1]}`;
                          if (!inline && match) {
                            return (
                              <div style={{ position: "relative", margin: "10px 0" }}>
                                <div style={{
                                  position: "absolute", top: "10px", right: "10px", zIndex: 1,
                                  display: "flex", alignItems: "center", gap: "8px"
                                }}>
                                  <span style={{ fontSize: "11px", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px" }}>{match[1]}</span>
                                  <button onClick={() => copyCode(codeStr, codeId)} style={{
                                    background: copiedId === codeId ? "#22c55e" : "#334155",
                                    color: "white", border: "none", borderRadius: "6px",
                                    padding: "3px 10px", fontSize: "11px", cursor: "pointer",
                                    transition: "background 0.2s"
                                  }}>{copiedId === codeId ? "✓ Copied" : "Copy"}</button>
                                </div>
                                <SyntaxHighlighter
                                  style={d ? oneDark : oneLight}
                                  language={match[1]}
                                  PreTag="div"
                                  customStyle={{ borderRadius: "10px", fontSize: "13px", margin: 0, paddingTop: "36px" }}
                                  {...props}
                                >{codeStr}</SyntaxHighlighter>
                              </div>
                            );
                          }
                          return (
                            <code style={{
                              background: d ? "#0f172a" : "#e2e8f0",
                              color: d ? "#7dd3fc" : "#0369a1",
                              padding: "2px 6px", borderRadius: "5px",
                              fontFamily: "monospace", fontSize: "13px"
                            }} {...props}>{children}</code>
                          );
                        },
                        p: ({ children }) => <p style={{ margin: "6px 0" }}>{children}</p>,
                        h1: ({ children }) => <h1 style={{ fontSize: "17px", margin: "10px 0 6px", fontWeight: 700 }}>{children}</h1>,
                        h2: ({ children }) => <h2 style={{ fontSize: "15px", margin: "10px 0 6px", fontWeight: 600 }}>{children}</h2>,
                        h3: ({ children }) => <h3 style={{ fontSize: "14px", margin: "8px 0 4px", fontWeight: 600 }}>{children}</h3>,
                        ul: ({ children }) => <ul style={{ margin: "6px 0", paddingLeft: "20px" }}>{children}</ul>,
                        ol: ({ children }) => <ol style={{ margin: "6px 0", paddingLeft: "20px" }}>{children}</ol>,
                        li: ({ children }) => <li style={{ margin: "3px 0" }}>{children}</li>,
                        strong: ({ children }) => <strong style={{ color: d ? "#a5b4fc" : "#6366f1" }}>{children}</strong>,
                        blockquote: ({ children }) => (
                          <blockquote style={{
                            borderLeft: "3px solid #6366f1", margin: "8px 0",
                            paddingLeft: "12px", color: d ? "#94a3b8" : "#64748b",
                            fontStyle: "italic"
                          }}>{children}</blockquote>
                        ),
                      }}>{c.bot}</ReactMarkdown>
                    )}
                  </div>
                </div>

              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* FOOTER */}
          <div style={{
            padding: "14px 20px 20px",
            background: d ? "#0f172a" : "white",
            borderTop: `1px solid ${d ? "#1e293b" : "#f1f5f9"}`,
          }}>
            <div style={{
              display: "flex", gap: "10px", alignItems: "flex-end",
              background: d ? "#1e293b" : "#f8fafc",
              border: `1px solid ${loading ? "#6366f1" : (d ? "#334155" : "#e2e8f0")}`,
              borderRadius: "14px", padding: "8px 8px 8px 16px",
              transition: "border-color 0.2s",
              boxShadow: loading ? "0 0 0 3px rgba(99,102,241,0.15)" : "none"
            }}>
              <textarea
                ref={textareaRef}
                value={msg}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                placeholder="Ask about code, errors, DSA... (Enter to send)"
                rows={1}
                style={{
                  flex: 1, background: "transparent", border: "none", outline: "none",
                  color: d ? "#e2e8f0" : "#1e293b", fontSize: "14px",
                  resize: "none", lineHeight: "1.5", minHeight: "44px", maxHeight: "140px",
                  fontFamily: "inherit", paddingTop: "10px"
                }}
              />
              <button
                onClick={sendMessage}
                disabled={loading || !msg.trim()}
                style={{
                  width: "40px", height: "40px", borderRadius: "10px", border: "none",
                  background: loading || !msg.trim()
                    ? (d ? "#1e293b" : "#e2e8f0")
                    : "linear-gradient(135deg,#6366f1,#8b5cf6)",
                  color: loading || !msg.trim() ? (d ? "#334155" : "#94a3b8") : "white",
                  cursor: loading || !msg.trim() ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "18px", flexShrink: 0,
                  transition: "all 0.2s",
                  boxShadow: loading || !msg.trim() ? "none" : "0 2px 10px rgba(99,102,241,0.4)"
                }}
              >{loading ? "⏳" : "➤"}</button>
            </div>
            <div style={{ textAlign: "center", fontSize: "11px", color: d ? "#334155" : "#cbd5e1", marginTop: "8px" }}>
              Shift+Enter for new line · Enter to send
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function btnStyle(dark) {
  return {
    background: "transparent",
    border: `1px solid ${dark ? "#334155" : "#e2e8f0"}`,
    color: dark ? "#94a3b8" : "#64748b",
    borderRadius: "8px", padding: "5px 12px",
    cursor: "pointer", fontSize: "12px", fontWeight: 500,
    transition: "all 0.2s"
  };
}

function Typing() {
  return (
    <div style={{ display: "flex", gap: "5px", alignItems: "center", padding: "4px 0" }}>
      <style>{`
        @keyframes typingBounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-6px); opacity: 1; }
        }
      `}</style>
      {[0, 1, 2].map(i => (
        <span key={i} style={{
          width: "7px", height: "7px", borderRadius: "50%",
          background: "#6366f1", display: "inline-block",
          animation: `typingBounce 1.2s infinite ${i * 0.2}s`
        }} />
      ))}
    </div>
  );
}