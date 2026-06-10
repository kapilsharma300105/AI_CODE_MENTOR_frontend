import React, { useEffect, useState } from "react";
// import axios from "axios";
import API from "../api";
import Editor from "@monaco-editor/react";

const TOPIC_COLORS = {
  Arrays:       { bg: "#0f2a1a", border: "#22c55e", text: "#22c55e" },
  Strings:      { bg: "#1a1a0f", border: "#eab308", text: "#eab308" },
  Dictionary:   { bg: "#0f1a2a", border: "#38bdf8", text: "#38bdf8" },
  Stack:        { bg: "#2a0f1a", border: "#f43f5e", text: "#f43f5e" },
  "Linked List":{ bg: "#1a0f2a", border: "#a78bfa", text: "#a78bfa" },
};

const DIFF_COLORS = {
  Easy:   { color: "#22c55e", bg: "rgba(34,197,94,0.1)"   },
  Medium: { color: "#f59e0b", bg: "rgba(245,158,11,0.1)"  },
  Hard:   { color: "#ef4444", bg: "rgba(239,68,68,0.1)"   },
};

const TOPICS = ["All", "Arrays", "Strings", "Dictionary", "Stack", "Linked List"];
const DIFFS  = ["All", "Easy", "Medium", "Hard"];

export default function Practice() {
  const [questions, setQuestions]   = useState([]);
  const [selected,  setSelected]    = useState(null);
  const [code,      setCode]        = useState("# Write your solution here\n");
  const [result,    setResult]      = useState(null);
  const [loading,   setLoading]     = useState(false);
  const [runType,   setRunType]     = useState(""); // "run" | "submit"
  const [topicFilter, setTopicFilter] = useState("All");
  const [diffFilter,  setDiffFilter]  = useState("All");
  const [search,    setSearch]      = useState("");
  const [tab,       setTab]         = useState("desc"); // "desc" | "output"
  const [solved,    setSolved]      = useState(new Set());

  useEffect(() => {
    API.get("practice/")

      .then(res => {
        setQuestions(res.data.questions);
        pick(res.data.questions[0]);
      })
      .catch(console.error);
  }, []);

  const pick = (q) => {
    setSelected(q);
    setCode(q.starter_code || "# Write your solution here\n");
    setResult(null);
    setTab("desc");
  };

  const filtered = questions.filter(q => {
    const matchTopic = topicFilter === "All" || q.topic === topicFilter;
    const matchDiff  = diffFilter  === "All" || q.difficulty === diffFilter;
    const matchSearch = q.title.toLowerCase().includes(search.toLowerCase());
    return matchTopic && matchDiff && matchSearch;
  });

  const runCode = async () => {
    if (!code.trim()) return;
    setLoading(true); setRunType("run"); setTab("output"); setResult(null);
    try {
      const res = await API.post("test/", { code });
      setResult({ type: "run", output: res.data.result });
    } catch {
      setResult({ type: "error", output: "Server error. Check backend." });
    } finally { setLoading(false); }
  };

  const submitCode = async () => {
  if (!code.trim() || !selected) return;

  setLoading(true);
  setRunType("submit");
  setResult(null);

  try {
    const res = await API.post("evaluate/", {

      question: selected.title,
      answer: code,
    });

    console.log("SUBMIT RESPONSE:", res.data);

    setResult({
      type: "submit",
      output: res.data.result || res.data
    });

    setTab("output");

  } catch (err) {
    setResult({
      type: "error",
      output: "Server error during submit",
    });
  } finally {
    setLoading(false);
  }
};

  const tc = selected ? (TOPIC_COLORS[selected.topic] || TOPIC_COLORS.Arrays) : TOPIC_COLORS.Arrays;

  return (
    <div style={s.root}>

      {/* ══════════ LEFT — QUESTION LIST ══════════ */}
      <div style={s.sidebar}>

        {/* Header */}
        <div style={s.sidebarHead}>
          <div style={s.logo}>⚡ DSA Practice</div>
          <div style={s.stats}>
            <span style={s.statBadge}>{solved.size}/{questions.length}</span>
            <span style={s.statLabel}>solved</span>
          </div>
        </div>

        {/* Search */}
        <div style={s.searchWrap}>
          <span style={s.searchIcon}>🔍</span>
          <input
            style={s.searchInput}
            placeholder="Search problems..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Topic Filter */}
        <div style={s.filterRow}>
          {TOPICS.map(t => (
            <button
              key={t}
              style={{ ...s.filterBtn, ...(topicFilter === t ? s.filterActive : {}) }}
              onClick={() => setTopicFilter(t)}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Difficulty Filter */}
        <div style={s.filterRow}>
          {DIFFS.map(d => (
            <button
              key={d}
              style={{
                ...s.filterBtn,
                ...(diffFilter === d ? {
                  background: d === "All" ? "#334155" : DIFF_COLORS[d]?.bg,
                  color: d === "All" ? "#fff" : DIFF_COLORS[d]?.color,
                  border: `1px solid ${d === "All" ? "#475569" : DIFF_COLORS[d]?.color}`,
                } : {})
              }}
              onClick={() => setDiffFilter(d)}
            >
              {d}
            </button>
          ))}
        </div>

        {/* Question List */}
        <div style={s.qList}>
          {filtered.length === 0 && (
            <div style={s.empty}>No problems found</div>
          )}
          {filtered.map((q, i) => {
            const dc = DIFF_COLORS[q.difficulty];
            const isActive = selected?.id === q.id;
            const isSolved = solved.has(q.id);
            return (
              <div
                key={q.id}
                style={{
                  ...s.qItem,
                  ...(isActive ? { background: "rgba(56,189,248,0.08)", borderLeft: "3px solid #38bdf8" } : {}),
                }}
                onClick={() => pick(q)}
              >
                <div style={s.qLeft}>
                  <span style={s.qNum}>{i + 1}</span>
                  <div>
                    <div style={s.qTitle}>
                      {isSolved && <span style={{ color: "#22c55e", marginRight: 4 }}>✓</span>}
                      {q.title}
                    </div>
                    <span style={{
                      ...s.topicTag,
                      background: (TOPIC_COLORS[q.topic]?.bg || "#1e293b"),
                      color: (TOPIC_COLORS[q.topic]?.text || "#94a3b8"),
                      border: `1px solid ${TOPIC_COLORS[q.topic]?.border || "#334155"}`,
                    }}>
                      {q.topic}
                    </span>
                  </div>
                </div>
                <span style={{ ...s.diffBadge, background: dc.bg, color: dc.color }}>
                  {q.difficulty}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ══════════ CENTER — PROBLEM PANEL ══════════ */}
      <div style={s.center}>

        {/* Tabs */}
        <div style={s.tabBar}>
          <button style={{ ...s.tab, ...(tab === "desc" ? s.tabActive : {}) }} onClick={() => setTab("desc")}>
            📄 Description
          </button>
          <button style={{ ...s.tab, ...(tab === "output" ? s.tabActive : {}) }} onClick={() => setTab("output")}>
            📤 Output
          </button>
          {selected && (
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{
                ...s.diffBadge,
                background: DIFF_COLORS[selected.difficulty]?.bg,
                color: DIFF_COLORS[selected.difficulty]?.color,
                fontSize: 12,
              }}>
                {selected.difficulty}
              </span>
              <span style={{
                ...s.topicTag,
                background: tc.bg, color: tc.text, border: `1px solid ${tc.border}`,
              }}>
                {selected.topic}
              </span>
            </div>
          )}
        </div>

        <div style={s.centerBody}>
          {!selected ? (
            <div style={s.empty}>← Select a problem to begin</div>
          ) : tab === "desc" ? (
            <>
              <h2 style={s.qHeading}>
                <span style={{ color: "#64748b", marginRight: 8 }}>#{selected.id}</span>
                {selected.title}
              </h2>

              <p style={s.desc}>{selected.description}</p>

              <div style={{ marginTop: 20 }}>
                <div style={s.sectionLabel}>Examples</div>
                {selected.examples.map((ex, i) => (
                  <div key={i} style={s.exBox}>
                    <div style={s.exRow}>
                      <span style={s.exLabel}>Input:</span>
                      <code style={s.exCode}>{ex.input}</code>
                    </div>
                    <div style={s.exRow}>
                      <span style={s.exLabel}>Output:</span>
                      <code style={{ ...s.exCode, color: "#22c55e" }}>{ex.output}</code>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 20 }}>
                <div style={s.sectionLabel}>Constraints</div>
                <ul style={s.constraintList}>
                  {selected.constraints.map((c, i) => (
                    <li key={i} style={s.constraintItem}>
                      <span style={{ color: "#38bdf8", marginRight: 6 }}>•</span>{c}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            /* OUTPUT TAB */
            <div style={{ padding: "8px 0" }}>
              {loading ? (
                <div style={s.outputLoading}>
                  <div style={s.spinner} />
                  <span>{runType === "run" ? "Running your code..." : "Evaluating submission..."}</span>
                </div>
              ) : !result ? (
                <div style={s.empty}>Run or submit code to see output here</div>
              ) : result.type === "error" ? (
                <div style={s.outputError}>{result.output}</div>
              ) : result.type === "run" ? (
                <div>
                  <div style={s.outputLabel}>🖥 Execution Output</div>
                  <pre style={s.outputPre}>{typeof result.output === "object" ? result.output.output || JSON.stringify(result.output, null, 2) : result.output}</pre>
                </div>
              ) : (
                <div>
                  {result.output && typeof result.output === "object" ? (
                    <>
                      <div style={{
                        ...s.verdictBox,
                        borderColor: result.output.verdict === "Correct" ? "#22c55e" : "#ef4444",
                        background: result.output.verdict === "Correct" ? "rgba(34,197,94,0.05)" : "rgba(239,68,68,0.05)",
                      }}>
                        <span style={{ fontSize: 24 }}>{result.output.verdict === "Correct" ? "✅" : "❌"}</span>
                        <span style={{
                          fontSize: 18, fontWeight: 700,
                          color: result.output.verdict === "Correct" ? "#22c55e" : "#ef4444",
                        }}>
                          {result.output.verdict}
                        </span>
                      </div>
                      {result.output.errors && result.output.errors !== "No errors found" && (
                        <div style={s.outputSection}>
                          <div style={{ ...s.outputLabel, color: "#ef4444" }}>❌ Errors</div>
                          <pre style={{ ...s.outputPre, color: "#ef4444" }}>{result.output.errors}</pre>
                        </div>
                      )}
                      {result.output.improvements && (
                        <div style={s.outputSection}>
                          <div style={{ ...s.outputLabel, color: "#f59e0b" }}>⚠️ Improvements</div>
                          <pre style={s.outputPre}>{result.output.improvements}</pre>
                        </div>
                      )}
                      {result.output.output && (
                        <div style={s.outputSection}>
                          <div style={s.outputLabel}>📤 Output</div>
                          <pre style={{ ...s.outputPre, color: "#22c55e" }}>{result.output.output}</pre>
                        </div>
                      )}
                    </>
                  ) : (
                    <pre style={s.outputPre}>{String(result.output)}</pre>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ══════════ RIGHT — EDITOR ══════════ */}
      <div style={s.right}>

        {/* Editor Header */}
        <div style={s.editorHead}>
          <div style={s.editorLang}>
            <span style={s.langDot} />
            Python
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              style={s.resetBtn}
              onClick={() => selected && setCode(selected.starter_code || "# Write your solution here\n")}
            >
              ↺ Reset
            </button>
          </div>
        </div>

        {/* Monaco Editor */}
        <div style={s.actionBar}>
  <div style={s.actionLeft}>
    {selected && solved.has(selected.id) && (
      <span style={s.solvedTag}>✓ Solved</span>
    )}
  </div>

  <div style={{ display: "flex", gap: 10 }}>
    
    <button
      style={{ ...s.btn, ...s.runBtn }}
      onClick={runCode}
      disabled={loading}
    >
      ▶ Run Code
    </button>

    <button
      style={{ ...s.btn, ...s.submitBtn }}
      onClick={submitCode}
      disabled={loading}
    >
      🚀 Submit
    </button>

  </div>
</div>
        <div style={{ flex: 1, overflow: "hidden" }}>
          <Editor
            height="100%"
            language="python"
            theme="vs-dark"
            value={code}
            onChange={v => setCode(v || "")}
            options={{
              fontSize: 14,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              automaticLayout: true,
              lineNumbers: "on",
              renderLineHighlight: "line",
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              fontLigatures: true,
              padding: { top: 12 },
            }}
          />
        </div>

        {/* Action Buttons */}
        <div style={s.actionBar}>
          
          <div style={s.actionLeft}>
            {selected && solved.has(selected.id) && (
              <span style={s.solvedTag}>✓ Solved</span>
            )}
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button
              style={{ ...s.btn, ...s.runBtn, opacity: loading ? 0.6 : 1 }}
              onClick={runCode}
              disabled={loading}
            >
              {loading && runType === "run" ? <><span style={s.spinnerSm} /> Running...</> : "▶ Run Code"}
            </button>
            <button
              style={{ ...s.btn, ...s.submitBtn, opacity: loading ? 0.6 : 1 }}
              onClick={submitCode}
              disabled={loading}
            >
              {loading && runType === "submit" ? <><span style={s.spinnerSm} /> Evaluating...</> : "🚀 Submit"}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Syne:wght@400;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { overflow: hidden; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #334155; border-radius: 4px; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

// ══════════════════════════════════════════
// STYLES
// ══════════════════════════════════════════
const s = {
  root: {
    display: "flex",
    height: "100vh",
    width: "100vw",
    overflow: "hidden",
    background: "#020817",
    color: "#e2e8f0",
    fontFamily: "'Syne', sans-serif",
  },

  // ── SIDEBAR ──
  sidebar: {
    width: 280,
    minWidth: 280,
    display: "flex",
    flexDirection: "column",
    borderRight: "1px solid #1e293b",
    background: "#030f1f",
    overflow: "hidden",
  },
  sidebarHead: {
    padding: "16px 16px 12px",
    borderBottom: "1px solid #1e293b",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    fontSize: 16,
    fontWeight: 800,
    color: "#38bdf8",
    letterSpacing: "-0.3px",
  },
  stats: { display: "flex", alignItems: "center", gap: 6 },
  statBadge: {
    background: "rgba(56,189,248,0.15)",
    color: "#38bdf8",
    fontSize: 12,
    fontWeight: 700,
    padding: "2px 8px",
    borderRadius: 20,
    border: "1px solid rgba(56,189,248,0.3)",
  },
  statLabel: { fontSize: 11, color: "#475569" },

  searchWrap: {
    margin: "10px 12px 6px",
    display: "flex",
    alignItems: "center",
    background: "#0f172a",
    border: "1px solid #1e293b",
    borderRadius: 8,
    padding: "6px 10px",
    gap: 6,
  },
  searchIcon: { fontSize: 12, opacity: 0.5 },
  searchInput: {
    background: "transparent",
    border: "none",
    outline: "none",
    color: "#e2e8f0",
    fontSize: 12,
    fontFamily: "'Syne', sans-serif",
    width: "100%",
  },

  filterRow: {
    display: "flex",
    gap: 4,
    padding: "4px 12px",
    flexWrap: "wrap",
  },
  filterBtn: {
    background: "transparent",
    border: "1px solid #1e293b",
    color: "#64748b",
    fontSize: 10,
    fontWeight: 600,
    padding: "3px 8px",
    borderRadius: 20,
    cursor: "pointer",
    fontFamily: "'Syne', sans-serif",
    transition: "all 0.15s",
  },
  filterActive: {
    background: "rgba(56,189,248,0.1)",
    color: "#38bdf8",
    border: "1px solid rgba(56,189,248,0.4)",
  },

  qList: {
    flex: 1,
    overflowY: "auto",
    padding: "6px 0",
  },
  qItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 14px",
    cursor: "pointer",
    borderLeft: "3px solid transparent",
    transition: "all 0.15s",
    gap: 8,
  },
  qLeft: { display: "flex", alignItems: "center", gap: 10, overflow: "hidden" },
  qNum: { fontSize: 10, color: "#334155", minWidth: 18, fontWeight: 700 },
  qTitle: {
    fontSize: 12,
    fontWeight: 600,
    color: "#cbd5e1",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: 155,
  },
  topicTag: {
    display: "inline-block",
    fontSize: 9,
    fontWeight: 700,
    padding: "1px 6px",
    borderRadius: 4,
    marginTop: 3,
    letterSpacing: "0.3px",
  },
  diffBadge: {
    fontSize: 10,
    fontWeight: 700,
    padding: "2px 8px",
    borderRadius: 20,
    whiteSpace: "nowrap",
  },
  empty: {
    textAlign: "center",
    padding: "40px 20px",
    color: "#334155",
    fontSize: 13,
  },

  // ── CENTER ──
  center: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    borderRight: "1px solid #1e293b",
    background: "#040d1a",
    overflow: "hidden",
    minWidth: 0,
  },
  tabBar: {
    display: "flex",
    alignItems: "center",
    padding: "0 16px",
    borderBottom: "1px solid #1e293b",
    background: "#030f1f",
    minHeight: 44,
    gap: 4,
  },
  tab: {
    background: "transparent",
    border: "none",
    borderBottom: "2px solid transparent",
    color: "#475569",
    fontSize: 12,
    fontWeight: 600,
    padding: "12px 12px 10px",
    cursor: "pointer",
    fontFamily: "'Syne', sans-serif",
    transition: "all 0.15s",
  },
  tabActive: {
    color: "#38bdf8",
    borderBottom: "2px solid #38bdf8",
  },
  centerBody: {
    flex: 1,
    overflowY: "auto",
    padding: "20px 24px",
  },
  qHeading: {
    fontSize: 18,
    fontWeight: 800,
    color: "#f1f5f9",
    marginBottom: 14,
    letterSpacing: "-0.3px",
  },
  desc: {
    fontSize: 13,
    color: "#94a3b8",
    lineHeight: 1.7,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: 700,
    color: "#475569",
    textTransform: "uppercase",
    letterSpacing: "1px",
    marginBottom: 10,
  },
  exBox: {
    background: "#0f172a",
    border: "1px solid #1e293b",
    borderRadius: 8,
    padding: "12px 14px",
    marginBottom: 8,
  },
  exRow: { display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 4 },
  exLabel: { fontSize: 11, fontWeight: 700, color: "#475569", minWidth: 50 },
  exCode: {
    fontSize: 12,
    color: "#e2e8f0",
    fontFamily: "'JetBrains Mono', monospace",
    background: "rgba(255,255,255,0.04)",
    padding: "1px 6px",
    borderRadius: 4,
  },
  constraintList: { listStyle: "none", padding: 0 },
  constraintItem: {
    fontSize: 12,
    color: "#64748b",
    padding: "3px 0",
    fontFamily: "'JetBrains Mono', monospace",
  },

  // Output
  outputLoading: {
    display: "flex", alignItems: "center", gap: 12,
    padding: 20, color: "#64748b", fontSize: 13,
  },
  outputError: {
    background: "rgba(239,68,68,0.08)",
    border: "1px solid rgba(239,68,68,0.3)",
    borderRadius: 8, padding: 14,
    color: "#ef4444", fontSize: 13,
    fontFamily: "'JetBrains Mono', monospace",
  },
  outputLabel: {
    fontSize: 11, fontWeight: 700, color: "#475569",
    textTransform: "uppercase", letterSpacing: "1px", marginBottom: 8,
  },
  outputPre: {
    background: "#0f172a",
    border: "1px solid #1e293b",
    borderRadius: 8, padding: 14,
    color: "#e2e8f0", fontSize: 12,
    fontFamily: "'JetBrains Mono', monospace",
    whiteSpace: "pre-wrap", overflowX: "auto",
  },
  outputSection: { marginBottom: 16 },
  verdictBox: {
    display: "flex", alignItems: "center", gap: 12,
    border: "1px solid", borderRadius: 10,
    padding: "14px 18px", marginBottom: 16,
  },

  // ── RIGHT EDITOR ──
  right: {
    width: 480,
    minWidth: 380,
    display: "flex",
    flexDirection: "column",
    background: "#020817",
    overflow: "hidden",
  },
  editorHead: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 14px",
    borderBottom: "1px solid #1e293b",
    background: "#030f1f",
  },
  editorLang: {
    display: "flex", alignItems: "center", gap: 7,
    fontSize: 12, fontWeight: 700, color: "#64748b",
  },
  langDot: {
    width: 8, height: 8, borderRadius: "50%",
    background: "#38bdf8",
    boxShadow: "0 0 6px #38bdf8",
  },
  resetBtn: {
    background: "transparent",
    border: "1px solid #1e293b",
    color: "#475569", fontSize: 11,
    fontWeight: 600, padding: "4px 10px",
    borderRadius: 6, cursor: "pointer",
    fontFamily: "'Syne', sans-serif",
    transition: "all 0.15s",
  },

  actionBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 14px",
    borderTop: "1px solid #1e293b",
    background: "#030f1f",
  },
  actionLeft: { display: "flex", alignItems: "center" },
  solvedTag: {
    fontSize: 11, fontWeight: 700,
    color: "#22c55e",
    background: "rgba(34,197,94,0.1)",
    border: "1px solid rgba(34,197,94,0.3)",
    padding: "3px 10px", borderRadius: 20,
  },
  btn: {
    border: "none", borderRadius: 8,
    padding: "9px 18px", fontSize: 12,
    fontWeight: 700, cursor: "pointer",
    fontFamily: "'Syne', sans-serif",
    display: "flex", alignItems: "center", gap: 6,
    transition: "all 0.15s",
  },
  runBtn: {
    background: "#1e293b",
    color: "#e2e8f0",
  },
  submitBtn: {
    background: "linear-gradient(135deg, #0ea5e9, #6366f1)",
    color: "#fff",
    boxShadow: "0 4px 15px rgba(99,102,241,0.3)",
  },

  spinner: {
    width: 18, height: 18,
    border: "2px solid #1e293b",
    borderTop: "2px solid #38bdf8",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  spinnerSm: {
    display: "inline-block",
    width: 10, height: 10,
    border: "2px solid rgba(255,255,255,0.3)",
    borderTop: "2px solid #fff",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
};