import React from "react";
import Editor from "@monaco-editor/react";

function CodeEditor({ code, setCode, language }) {
  return (
    <Editor
      height="500px"
      language={language}
      theme="vs-dark"
      value={code}
      onChange={(value) => setCode(value || "")}
    />
  );
}
export default CodeEditor;






// import React, { useState, useRef, useEffect } from "react";
// import CodeEditor from "./CodeEditor";

// const LANG_ICONS = {
//   python: "🐍",
//   javascript: "⚡",
//   java: "☕",
//   cpp: "⚙️",
//   c: "🔩",
//   plaintext: "📄",
// };

// const LANG_COLORS = {
//   python: "#3b9ddd",
//   javascript: "#f7df1e",
//   java: "#f89820",
//   cpp: "#9c4fe4",
//   c: "#5c9ecf",
//   plaintext: "#888",
// };

// export default function RunCode() {
//   const [files, setFiles] = useState({ "main.py": "print('Hello, World!')" });
//   const [activeFile, setActiveFile] = useState("main.py");
//   const [output, setOutput] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [termLines, setTermLines] = useState([]);
//   const termRef = useRef(null);

//   const getLanguage = (file = activeFile) => {
//     if (file.endsWith(".py")) return "python";
//     if (file.endsWith(".js")) return "javascript";
//     if (file.endsWith(".java")) return "java";
//     if (file.endsWith(".cpp")) return "cpp";
//     if (file.endsWith(".c")) return "c";
//     return "plaintext";
//   };

//   const lang = getLanguage();
//   const accentColor = LANG_COLORS[lang] || "#00ff9d";

//   useEffect(() => {
//     if (termRef.current) termRef.current.scrollTop = termRef.current.scrollHeight;
//   }, [termLines]);

//   const pushLine = (text, type = "out") => {
//     setTermLines(prev => [...prev, { text, type, id: Date.now() + Math.random() }]);
//   };

//   const addFile = () => {
//     const fileName = prompt("New file name (e.g. main.py, app.js):");
//     if (!fileName?.trim()) return;
//     setFiles(prev => ({ ...prev, [fileName.trim()]: "" }));
//     setActiveFile(fileName.trim());
//   };

//   const deleteFile = (fileName, e) => {
//     e.stopPropagation();
//     const temp = { ...files };
//     delete temp[fileName];
//     setFiles(temp);
//     const remaining = Object.keys(temp);
//     if (remaining.length > 0) setActiveFile(remaining[0]);
//   };

//   const runCode = async () => {
//     setLoading(true);
//     setTermLines([]);
//     pushLine(`▶ Executing ${activeFile}...`, "info");

//     try {
//       const res = await fetch("http://127.0.0.1:8000/api/run/", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ code: files[activeFile], language: lang }),
//       });
//       const data = await res.json();
//       const lines = (data.output || "").split("\n");
//       lines.forEach(l => pushLine(l, "out"));
//       pushLine("✔ Process exited with code 0", "success");
//     } catch (err) {
//       pushLine(`✖ Error: ${err.message}`, "error");
//     }

//     setLoading(false);
//   };

//   return (
//     <div style={{
//       display: "flex",
//       height: "100vh",
//       background: "#0d0d0f",
//       color: "#c9d1d9",
//       fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
//       overflow: "hidden",
//     }}>
//       {/* SIDEBAR */}
//       <aside style={{
//         width: "220px",
//         minWidth: "180px",
//         background: "#111115",
//         borderRight: "1px solid #1e1e26",
//         display: "flex",
//         flexDirection: "column",
//         padding: "0",
//       }}>
//         <div style={{
//           padding: "18px 16px 12px",
//           borderBottom: "1px solid #1e1e26",
//           display: "flex",
//           alignItems: "center",
//           gap: "8px",
//         }}>
//           <span style={{ fontSize: "18px", fontWeight: 700, letterSpacing: "-0.5px", color: "#fff" }}>
//             ⌨ RunCode
//           </span>
//         </div>

//         <div style={{
//           padding: "12px 16px 6px",
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//         }}>
//           <span style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "1.5px", color: "#555" }}>
//             Explorer
//           </span>
//           <button
//             onClick={addFile}
//             title="New File"
//             style={{
//               background: "none",
//               border: "1px solid #2a2a35",
//               color: "#888",
//               cursor: "pointer",
//               borderRadius: "4px",
//               width: "22px",
//               height: "22px",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               fontSize: "14px",
//               transition: "all 0.15s",
//             }}
//             onMouseEnter={e => { e.target.style.color = "#fff"; e.target.style.borderColor = "#444"; }}
//             onMouseLeave={e => { e.target.style.color = "#888"; e.target.style.borderColor = "#2a2a35"; }}
//           >+</button>
//         </div>

//         <div style={{ flex: 1, overflowY: "auto", padding: "4px 8px" }}>
//           {Object.keys(files).map(file => {
//             const isActive = file === activeFile;
//             const fileLang = getLanguage(file);
//             return (
//               <div
//                 key={file}
//                 onClick={() => setActiveFile(file)}
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "space-between",
//                   padding: "7px 8px",
//                   borderRadius: "6px",
//                   cursor: "pointer",
//                   background: isActive ? "#1a1a24" : "transparent",
//                   borderLeft: isActive ? `2px solid ${LANG_COLORS[fileLang] || "#00ff9d"}` : "2px solid transparent",
//                   marginBottom: "2px",
//                   transition: "all 0.15s",
//                 }}
//                 onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "#16161e"; }}
//                 onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
//               >
//                 <span style={{ fontSize: "12px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
//                   <span style={{ marginRight: "6px" }}>{LANG_ICONS[fileLang]}</span>
//                   {file}
//                 </span>
//                 <button
//                   onClick={(e) => deleteFile(file, e)}
//                   style={{
//                     background: "none", border: "none", color: "#444",
//                     cursor: "pointer", fontSize: "11px", padding: "0 2px",
//                     borderRadius: "3px", opacity: 0, transition: "opacity 0.15s",
//                   }}
//                   onMouseEnter={e => e.target.style.color = "#e05555"}
//                   onMouseLeave={e => e.target.style.color = "#444"}
//                   className="del-btn"
//                 >✕</button>
//               </div>
//             );
//           })}
//         </div>

//         <div style={{
//           padding: "12px 16px",
//           borderTop: "1px solid #1e1e26",
//           display: "flex",
//           alignItems: "center",
//           gap: "8px",
//         }}>
//           <span style={{
//             width: "8px", height: "8px", borderRadius: "50%",
//             background: accentColor,
//             boxShadow: `0 0 6px ${accentColor}`,
//             display: "inline-block",
//           }} />
//           <span style={{ fontSize: "11px", color: "#666" }}>{lang}</span>
//         </div>
//       </aside>

//       {/* MAIN AREA */}
//       <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
//         <header style={{
//           height: "44px",
//           background: "#111115",
//           borderBottom: "1px solid #1e1e26",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//           padding: "0 16px",
//           flexShrink: 0,
//         }}>
//           <div style={{ display: "flex", height: "100%", alignItems: "flex-end" }}>
//             {Object.keys(files).map(file => (
//               <div
//                 key={file}
//                 onClick={() => setActiveFile(file)}
//                 style={{
//                   padding: "0 16px",
//                   height: "100%",
//                   display: "flex",
//                   alignItems: "center",
//                   fontSize: "12px",
//                   cursor: "pointer",
//                   borderBottom: file === activeFile ? `2px solid ${accentColor}` : "2px solid transparent",
//                   color: file === activeFile ? "#fff" : "#555",
//                   background: file === activeFile ? "#0d0d0f" : "transparent",
//                   transition: "color 0.15s",
//                   gap: "6px",
//                 }}
//               >
//                 <span>{LANG_ICONS[getLanguage(file)]}</span>
//                 {file}
//               </div>
//             ))}
//           </div>

//           <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
//             <button
//               onClick={runCode}
//               disabled={loading}
//               style={{
//                 background: loading ? "#1e1e26" : accentColor,
//                 color: loading ? "#555" : "#000",
//                 border: "none",
//                 borderRadius: "6px",
//                 padding: "6px 16px",
//                 fontFamily: "inherit",
//                 fontSize: "12px",
//                 fontWeight: 700,
//                 cursor: loading ? "not-allowed" : "pointer",
//                 display: "flex",
//                 alignItems: "center",
//                 gap: "6px",
//                 transition: "all 0.2s",
//                 boxShadow: loading ? "none" : `0 0 12px ${accentColor}44`,
//                 letterSpacing: "0.5px",
//               }}
//             >
//               {loading ? (
//                 <><span style={{ animation: "spin 1s linear infinite", display: "inline-block" }}>◌</span> Running</>
//               ) : (
//                 <><span>▶</span> Run</>
//               )}
//             </button>
//           </div>
//         </header>

//         <div style={{ flex: 1, overflow: "hidden", minHeight: 0 }}>
//           <CodeEditor
//             code={files[activeFile]}
//             setCode={(value) => setFiles(prev => ({ ...prev, [activeFile]: value }))}
//             language={lang}
//           />
//         </div>

//         {/* Terminal */}
//         <div style={{
//           height: "200px",
//           background: "#0a0a0c",
//           borderTop: `1px solid ${accentColor}33`,
//           display: "flex",
//           flexDirection: "column",
//           flexShrink: 0,
//         }}>
//           <div style={{
//             padding: "6px 16px",
//             borderBottom: "1px solid #1a1a22",
//             display: "flex",
//             alignItems: "center",
//             gap: "8px",
//           }}>
//             <span style={{ fontSize: "10px", color: "#444", textTransform: "uppercase", letterSpacing: "1.5px" }}>
//               Terminal
//             </span>
//             {termLines.length > 0 && (
//               <button
//                 onClick={() => setTermLines([])}
//                 style={{
//                   background: "none", border: "none", color: "#333",
//                   cursor: "pointer", fontSize: "10px", marginLeft: "auto",
//                 }}
//                 onMouseEnter={e => e.target.style.color = "#888"}
//                 onMouseLeave={e => e.target.style.color = "#333"}
//               >clear</button>
//             )}
//           </div>

//           <div ref={termRef} style={{
//             flex: 1,
//             overflowY: "auto",
//             padding: "10px 16px",
//             fontFamily: "'JetBrains Mono', monospace",
//             fontSize: "12.5px",
//             lineHeight: "1.7",
//           }}>
//             {termLines.length === 0 ? (
//               <span style={{ color: "#2a2a35" }}>Awaiting execution...</span>
//             ) : (
//               termLines.map(line => (
//                 <div key={line.id} style={{
//                   color: line.type === "error" ? "#f47067"
//                     : line.type === "success" ? "#57c77e"
//                     : line.type === "info" ? accentColor
//                     : "#c9d1d9",
//                 }}>
//                   {line.type === "out" && <span style={{ color: "#2a2a35", userSelect: "none" }}>❯ </span>}
//                   {line.text}
//                 </div>
//               ))
//             )}
//           </div>
//         </div>
//       </main>

//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap');
//         * { box-sizing: border-box; }
//         ::-webkit-scrollbar { width: 4px; height: 4px; }
//         ::-webkit-scrollbar-track { background: transparent; }
//         ::-webkit-scrollbar-thumb { background: #2a2a35; border-radius: 2px; }
//         ::-webkit-scrollbar-thumb:hover { background: #3a3a45; }
//         @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
//         aside div:hover .del-btn { opacity: 1 !important; }
//       `}</style>
//     </div>
//   );
// }