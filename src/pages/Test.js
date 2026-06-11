// 
import React, { useState, useEffect, useRef } from "react";
import API from "../api";

// ===================== MCQ QUESTIONS =====================
const MCQ_QUESTIONS = [
  {
    type: "mcq",
    title: "Python List Complexity",
    diff: "Easy",
    topic: "Data Structures",
    desc: "What is the time complexity of accessing an element by index in a Python list?",
    options: ["O(n)", "O(log n)", "O(1)", "O(n²)"],
    answer: 2,
    hint: "Python lists are dynamic arrays — random access is constant time.",
  },
  {
    type: "mcq",
    title: "Stack vs Queue",
    diff: "Easy",
    topic: "Data Structures",
    desc: "Which data structure follows LIFO (Last In First Out) principle?",
    options: ["Queue", "Stack", "Deque", "Heap"],
    answer: 1,
    hint: "Think of a stack of plates — you take from the top.",
  },
  {
    type: "mcq",
    title: "Binary Search Requirement",
    diff: "Medium",
    topic: "Algorithms",
    desc: "What is a prerequisite for applying Binary Search on an array?",
    options: [
      "Array must be of even length",
      "Array must be sorted",
      "Array must have distinct elements",
      "Array must be in descending order",
    ],
    answer: 1,
    hint: "Binary search eliminates half the search space — only works if data is ordered.",
  },
  {
    type: "mcq",
    title: "HashMap Lookup",
    diff: "Easy",
    topic: "Data Structures",
    desc: "Average time complexity of lookup in a Python dictionary is:",
    options: ["O(n)", "O(log n)", "O(1)", "O(n log n)"],
    answer: 2,
    hint: "Hash maps use hashing to compute the index directly.",
  },
  {
    type: "mcq",
    title: "Recursion Base Case",
    diff: "Easy",
    topic: "Algorithms",
    desc: "What happens if a recursive function has no base case?",
    options: ["It returns None", "It runs once", "Infinite recursion / stack overflow", "It skips execution"],
    answer: 2,
    hint: "Without a stopping condition, the function calls itself forever.",
  },
  {
    type: "mcq",
    title: "Big O of Bubble Sort",
    diff: "Easy",
    topic: "Algorithms",
    desc: "What is the worst-case time complexity of Bubble Sort?",
    options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"],
    answer: 2,
    hint: "Bubble sort compares every pair — nested loops give quadratic time.",
  },
  {
    type: "mcq",
    title: "Linked List vs Array",
    diff: "Medium",
    topic: "Data Structures",
    desc: "Which operation is O(1) in a Linked List but O(n) in an Array?",
    options: ["Random access by index", "Insertion at beginning", "Binary search", "Sorting"],
    answer: 1,
    hint: "Arrays need shifting for insertion at start; linked lists just update a pointer.",
  },
  {
    type: "mcq",
    title: "DFS vs BFS",
    diff: "Medium",
    topic: "Graphs",
    desc: "Which algorithm uses a Queue data structure internally?",
    options: ["DFS", "BFS", "Dijkstra", "Binary Search"],
    answer: 1,
    hint: "BFS explores level by level — queues process in FIFO order.",
  },
  {
    type: "mcq",
    title: "Python set() lookup",
    diff: "Easy",
    topic: "Data Structures",
    desc: "What is the average time complexity of checking membership in a Python set?",
    options: ["O(n)", "O(log n)", "O(1)", "O(n²)"],
    answer: 2,
    hint: "Sets use hash tables internally — same as dictionaries.",
  },
  {
    type: "mcq",
    title: "Merge Sort",
    diff: "Medium",
    topic: "Algorithms",
    desc: "What is the time complexity of Merge Sort in all cases?",
    options: ["O(n)", "O(n²)", "O(n log n)", "O(log n)"],
    answer: 2,
    hint: "Merge sort always divides into halves and merges — consistent O(n log n).",
  },
];

// ===================== STYLES =====================
const S = {
  app: {
    display: "flex",
    height: "100vh",
    background: "#0a0f1e",
    color: "#fff",
    fontFamily: "ui-sans-serif, system-ui, sans-serif",
    overflow: "hidden",
  },
  sidebar: {
    width: "230px",
    background: "#0f172a",
    borderRight: "1px solid rgba(148,163,184,0.08)",
    display: "flex",
    flexDirection: "column",
    flexShrink: 0,
  },
  logo: {
    padding: "14px 16px",
    borderBottom: "1px solid rgba(148,163,184,0.08)",
    fontSize: "14px",
    fontWeight: "700",
    color: "#6366f1",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  timerBox: {
    padding: "14px 16px",
    borderBottom: "1px solid rgba(148,163,184,0.08)",
    textAlign: "center",
  },
  timerNum: (urgent) => ({
    fontSize: "30px",
    fontWeight: "700",
    color: urgent ? "#ef4444" : "#6366f1",
    fontFamily: "monospace",
    letterSpacing: "2px",
  }),
  timerLabel: { fontSize: "10px", color: "#64748b", marginTop: "2px", textTransform: "uppercase", letterSpacing: "0.08em" },
  scoreBox: {
    padding: "10px 16px",
    borderBottom: "1px solid rgba(148,163,184,0.08)",
    display: "flex",
    justifyContent: "space-between",
    fontSize: "12px",
    color: "#64748b",
  },
  scoreVal: { fontWeight: "700", color: "#f1f5f9" },
  qList: { flex: 1, overflowY: "auto", padding: "8px" },
  phaseLabel: {
    fontSize: "10px",
    color: "#475569",
    padding: "8px 6px 4px",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    fontWeight: "600",
  },
  qItem: (active, done) => ({
    padding: "8px 10px",
    borderRadius: "8px",
    cursor: "pointer",
    marginBottom: "3px",
    fontSize: "12px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: active ? "rgba(99,102,241,0.15)" : done ? "rgba(34,197,94,0.06)" : "transparent",
    border: active ? "1px solid rgba(99,102,241,0.35)" : "1px solid transparent",
    color: active ? "#a5b4fc" : done ? "#22c55e" : "#64748b",
    transition: "all 0.15s",
  }),
  dot: (active, done) => ({
    width: "6px", height: "6px", borderRadius: "50%", flexShrink: 0,
    background: active ? "#6366f1" : done ? "#22c55e" : "#334155",
  }),
  typeBadge: (type) => ({
    fontSize: "10px", padding: "1px 6px", borderRadius: "10px", marginLeft: "auto",
    background: type === "mcq" ? "rgba(139,92,246,0.2)" : "rgba(20,184,166,0.2)",
    color: type === "mcq" ? "#a78bfa" : "#2dd4bf",
  }),
  main: { flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" },
  topbar: {
    padding: "10px 20px",
    background: "#0f172a",
    borderBottom: "1px solid rgba(148,163,184,0.08)",
    display: "flex", alignItems: "center", gap: "10px",
  },
  phaseTag: (type) => ({
    fontSize: "11px", padding: "3px 10px", borderRadius: "12px", fontWeight: "600",
    background: type === "mcq" ? "rgba(139,92,246,0.2)" : "rgba(20,184,166,0.2)",
    color: type === "mcq" ? "#a78bfa" : "#2dd4bf",
  }),
  qTitle: { fontSize: "14px", fontWeight: "600", color: "#f1f5f9", flex: 1 },
  diffBadge: (diff) => ({
    fontSize: "11px", padding: "2px 10px", borderRadius: "10px", fontWeight: "500",
    background: diff === "Easy" ? "rgba(34,197,94,0.12)" : diff === "Medium" ? "rgba(251,191,36,0.12)" : "rgba(239,68,68,0.12)",
    color: diff === "Easy" ? "#22c55e" : diff === "Medium" ? "#fbbf24" : "#ef4444",
  }),
  progressBar: { height: "2px", background: "rgba(148,163,184,0.08)", overflow: "hidden" },
  progressFill: (pct) => ({
    height: "100%", width: `${pct}%`,
    background: "linear-gradient(90deg,#6366f1,#8b5cf6)",
    transition: "width 0.4s ease",
  }),
  content: { flex: 1, overflowY: "auto", padding: "22px 24px" },
  mcqDesc: { fontSize: "15px", color: "#cbd5e1", lineHeight: "1.75", marginBottom: "22px" },
  optBtn: (state) => ({
    width: "100%", padding: "12px 16px", borderRadius: "10px",
    cursor: state === "confirmed" ? "default" : "pointer",
    fontSize: "13px", textAlign: "left", marginBottom: "8px",
    border: state === "correct" ? "1px solid #22c55e"
      : state === "wrong" ? "1px solid #ef4444"
      : state === "selected" ? "1px solid #6366f1"
      : "1px solid rgba(148,163,184,0.12)",
    background: state === "correct" ? "rgba(34,197,94,0.1)"
      : state === "wrong" ? "rgba(239,68,68,0.1)"
      : state === "selected" ? "rgba(99,102,241,0.12)"
      : "rgba(15,23,42,0.6)",
    color: state === "correct" ? "#22c55e"
      : state === "wrong" ? "#ef4444"
      : state === "selected" ? "#a5b4fc"
      : "#cbd5e1",
    transition: "all 0.15s",
  }),
  codeDesc: { fontSize: "13px", color: "#94a3b8", lineHeight: "1.65", marginBottom: "12px" },
  exBlock: {
    background: "rgba(2,6,23,0.8)", borderRadius: "8px",
    padding: "12px 16px", fontSize: "12px", fontFamily: "monospace",
    color: "#7dd3fc", marginBottom: "14px",
    border: "1px solid rgba(99,102,241,0.2)", whiteSpace: "pre",
  },
  editor: {
    width: "100%", minHeight: "200px",
    background: "#020617", color: "#e2e8f0",
    padding: "14px", borderRadius: "10px",
    fontFamily: "monospace", fontSize: "13px",
    border: "1px solid rgba(148,163,184,0.1)",
    resize: "vertical", outline: "none", lineHeight: "1.6",
    boxSizing: "border-box",
  },
  outputBox: {
    marginTop: "10px", background: "rgba(2,6,23,0.9)",
    borderRadius: "8px", padding: "12px 14px",
    fontSize: "12px", fontFamily: "monospace",
    color: "#94a3b8", border: "1px solid rgba(148,163,184,0.06)",
    minHeight: "44px", whiteSpace: "pre-wrap",
  },
  hintBox: {
    marginTop: "14px",
    background: "rgba(251,191,36,0.07)",
    border: "1px solid rgba(251,191,36,0.2)",
    borderRadius: "10px", padding: "12px 16px",
    fontSize: "13px", color: "#fbbf24", lineHeight: "1.65",
  },
  actions: {
    padding: "10px 20px",
    background: "#0f172a",
    borderTop: "1px solid rgba(148,163,184,0.08)",
    display: "flex", gap: "8px", alignItems: "center",
  },
  btn: {
    padding: "7px 14px", borderRadius: "8px", fontSize: "12px", fontWeight: "600",
    cursor: "pointer", border: "1px solid rgba(148,163,184,0.15)",
    background: "rgba(30,41,59,0.8)", color: "#94a3b8",
  },
  btnPrimary: {
    padding: "7px 16px", borderRadius: "8px", fontSize: "12px", fontWeight: "600",
    cursor: "pointer", border: "1px solid rgba(99,102,241,0.4)",
    background: "rgba(99,102,241,0.15)", color: "#a5b4fc",
  },
  btnSuccess: {
    padding: "7px 16px", borderRadius: "8px", fontSize: "12px", fontWeight: "600",
    cursor: "pointer", border: "1px solid rgba(34,197,94,0.35)",
    background: "rgba(34,197,94,0.12)", color: "#22c55e",
  },
  btnDanger: {
    padding: "7px 14px", borderRadius: "8px", fontSize: "12px", fontWeight: "600",
    cursor: "pointer", border: "1px solid rgba(239,68,68,0.3)",
    background: "rgba(239,68,68,0.08)", color: "#ef4444",
  },
  statCards: {
    display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
    gap: "12px", width: "100%", maxWidth: "520px",
  },
  statCard: {
    background: "rgba(15,23,42,0.8)",
    border: "1px solid rgba(148,163,184,0.08)",
    borderRadius: "12px", padding: "16px", textAlign: "center",
  },
  lbRow: (isYou) => ({
    display: "flex", alignItems: "center", gap: "10px",
    padding: "10px 16px", borderRadius: "10px",
    background: isYou ? "rgba(99,102,241,0.1)" : "rgba(15,23,42,0.6)",
    border: isYou ? "1px solid rgba(99,102,241,0.3)" : "1px solid rgba(148,163,184,0.06)",
    fontSize: "13px", width: "100%", maxWidth: "520px",
  }),
};

// ===================== MAIN COMPONENT =====================
export default function Test() {
  const [codingQuestions, setCodingQuestions] = useState([]);
  const [loadingQ, setLoadingQ] = useState(true);
  const [allQuestions, setAllQuestions] = useState([]);

  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [codeVals, setCodeVals] = useState([]);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [optConfirmed, setOptConfirmed] = useState(false);
  const [hintVisible, setHintVisible] = useState(false);
  const [output, setOutput] = useState("");
  const [outputVisible, setOutputVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30 * 60);
  const [testDone, setTestDone] = useState(false);
  const timerRef = useRef(null);

  // ---- Fetch questions from backend ----
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await API.get("test/");
        const backendQs = res.data.questions.map(q => ({
          type: "code",
          title: q.title,
          diff: q.difficulty,
          topic: q.topic || "DSA",
          desc: q.description,
          example: q.examples?.[0]
            ? `Input: ${q.examples[0].input}\nOutput: ${q.examples[0].output}`
            : `Input: ${q.input || ""}\nOutput: ${q.output || ""}`,
          starter: q.starter_code || `def solution():\n    # Write your solution here\n    pass\n\nprint(solution())`,
          hint: `Use ${q.topic || "optimal"} approach. Expected output: ${q.output || "check examples"}`,
          expected: q.output,
        }));
        setCodingQuestions(backendQs);
        const all = [...MCQ_QUESTIONS, ...backendQs];
        setAllQuestions(all);
        setAnswers(new Array(all.length).fill(null));
        const vals = new Array(all.length).fill("");
        all.forEach((q, i) => { if (q.type === "code") vals[i] = q.starter; });
        setCodeVals(vals);
      } catch (e) {
        // fallback
        const fallback = [
          {
            type: "code", title: "Two Sum", diff: "Easy", topic: "Arrays",
            desc: "Return indices of two numbers that add up to target.",
            example: "Input: nums=[2,7,11,15], target=9\nOutput: [0, 1]",
            starter: "def two_sum(nums, target):\n    # Write your solution here\n    pass\n\nprint(two_sum([2,7,11,15], 9))",
            hint: "Use a hashmap to store complement values.",
          },
          {
            type: "code", title: "Reverse String", diff: "Easy", topic: "Strings",
            desc: "Reverse a string and return the result.",
            example: "Input: s='hello'\nOutput: 'olleh'",
            starter: "def reverse_string(s):\n    # Write your solution here\n    pass\n\nprint(reverse_string('hello'))",
            hint: "Python slice s[::-1] reverses in one line.",
          },
        ];
        setCodingQuestions(fallback);
        const all = [...MCQ_QUESTIONS, ...fallback];
        setAllQuestions(all);
        setAnswers(new Array(all.length).fill(null));
        const vals = new Array(all.length).fill("");
        all.forEach((q, i) => { if (q.type === "code") vals[i] = q.starter; });
        setCodeVals(vals);
      } finally {
        setLoadingQ(false);
      }
    };
    fetchQuestions();
  }, []);

  const TOTAL = allQuestions.length;
  const MCQ_COUNT = MCQ_QUESTIONS.length;
  const q = allQuestions[current];
  const progress = TOTAL > 0 ? Math.round((answers.filter(a => a !== null).length / TOTAL) * 100) : 0;

  // ---- Timer ----
  useEffect(() => {
    if (testDone || loadingQ) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); setTestDone(true); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [testDone, loadingQ]);

  const formatTime = (t) => {
    const m = Math.floor(t / 60);
    const s = t % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  // ---- Reset state on question change ----
  useEffect(() => {
    if (!q) return;
    setHintVisible(false);
    setOutput("");
    setOutputVisible(false);
    if (q.type === "mcq") {
      const prev = answers[current];
      if (prev !== null) { setSelectedOpt(prev); setOptConfirmed(true); }
      else { setSelectedOpt(null); setOptConfirmed(false); }
    } else {
      if (answers[current] !== null) { setOutput(answers[current]); setOutputVisible(true); }
    }
  }, [current]);

  const confirmMCQ = () => {
    if (selectedOpt === null || optConfirmed) return;
    setOptConfirmed(true);
    const isCorrect = selectedOpt === q.answer;
    const newAnswers = [...answers];
    newAnswers[current] = selectedOpt;
    setAnswers(newAnswers);
    if (isCorrect) { setScore(s => s + 10); setCorrect(c => c + 1); }
  };

  const runCode = async () => {
    const code = codeVals[current];
    if (!code.trim()) return;
    setOutput("⚡ Running...");
    setOutputVisible(true);
    try {
      const res = await API.post("run/", { code, language: "python" });
      setOutput(res.data.output || "(no output)");
    } catch {
      setOutput("❌ Run failed — check backend");
    }
  };

  const submitCode = async () => {
    const code = codeVals[current];
    if (!code.trim()) return;
    setOutput("🧠 Evaluating...");
    setOutputVisible(true);
    try {
      const res = await API.post("run/", { code, language: "python" });
      const out = (res.data.output || "(no output)").trim();
      setOutput(out);
      if (answers[current] === null) {
        const newAnswers = [...answers];
        newAnswers[current] = out;
        setAnswers(newAnswers);
        setScore(s => s + 15);
        setCorrect(c => c + 1);
      }
    } catch { setOutput("❌ Submit failed"); }
  };

  const updateCode = (val) => {
    const newVals = [...codeVals];
    newVals[current] = val;
    setCodeVals(newVals);
  };

  const getOptState = (i) => {
    if (!optConfirmed) return selectedOpt === i ? "selected" : "default";
    if (i === q.answer) return "correct";
    if (i === selectedOpt && i !== q.answer) return "wrong";
    return "default";
  };

  // ---- Loading ----
  if (loadingQ) return (
    <div style={{ ...S.app, alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "14px" }}>
      <div style={{ fontSize: "32px" }}>⚡</div>
      <div style={{ color: "#6366f1", fontSize: "15px", fontWeight: "600" }}>Loading test questions...</div>
      <div style={{ color: "#475569", fontSize: "12px" }}>Fetching from backend</div>
    </div>
  );

  // ---- Result Screen ----
  if (testDone) {
    const pct = TOTAL > 0 ? Math.round((correct / TOTAL) * 100) : 0;
    const leaderboard = [
      { name: "Arjun S.", pts: score + 40, you: false },
      { name: "Priya K.", pts: score + 25, you: false },
      { name: "You", pts: score, you: true },
      { name: "Rahul M.", pts: Math.max(0, score - 20), you: false },
      { name: "Sneha T.", pts: Math.max(0, score - 35), you: false },
    ].sort((a, b) => b.pts - a.pts);

    return (
      <div style={{ ...S.app, alignItems: "center", justifyContent: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "18px", padding: "30px", overflowY: "auto", maxHeight: "100vh", width: "100%" }}>
          <div style={{ fontSize: "11px", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.1em" }}>Test Complete</div>
          <div style={{ fontSize: "56px", fontWeight: "800", color: "#6366f1", lineHeight: 1 }}>
            {score}<span style={{ fontSize: "18px", color: "#64748b" }}> pts</span>
          </div>
          <div style={{ fontSize: "14px", color: "#94a3b8" }}>
            {correct} of {TOTAL} correct &nbsp;·&nbsp; {pct}% accuracy
          </div>
          <div style={S.statCards}>
            {[
              { num: `${answers.slice(0, MCQ_COUNT).filter((a, i) => a === MCQ_QUESTIONS[i]?.answer).length}/${MCQ_COUNT}`, lbl: "MCQ Correct" },
              { num: `${answers.slice(MCQ_COUNT).filter(a => a !== null).length}/${codingQuestions.length}`, lbl: "Code Solved" },
              { num: `${pct}%`, lbl: "Accuracy" },
            ].map((s, i) => (
              <div key={i} style={S.statCard}>
                <div style={{ fontSize: "26px", fontWeight: "700", color: "#f1f5f9" }}>{s.num}</div>
                <div style={{ fontSize: "11px", color: "#64748b", marginTop: "4px" }}>{s.lbl}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: "11px", color: "#475569", alignSelf: "flex-start", width: "100%", maxWidth: "520px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Leaderboard
          </div>
          {leaderboard.map((p, i) => (
            <div key={i} style={S.lbRow(p.you)}>
              <span style={{ width: "20px", color: i === 0 ? "#fbbf24" : "#64748b", fontWeight: "700", fontSize: "13px" }}>
                {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}.`}
              </span>
              <span style={{ flex: 1, color: p.you ? "#a5b4fc" : "#f1f5f9" }}>{p.name}</span>
              {p.you && (
                <span style={{ fontSize: "10px", padding: "1px 8px", background: "rgba(99,102,241,0.2)", color: "#a5b4fc", borderRadius: "10px" }}>you</span>
              )}
              <span style={{ fontWeight: "700", color: "#f1f5f9" }}>{p.pts} pts</span>
            </div>
          ))}
          <button style={{ ...S.btnPrimary, padding: "10px 28px", fontSize: "13px" }} onClick={() => window.location.reload()}>
            🔄 Retake Test
          </button>
        </div>
      </div>
    );
  }

  if (!q) return null;

  // ---- Main Test UI ----
  return (
    <div style={S.app}>

      {/* SIDEBAR */}
      <div style={S.sidebar}>
        <div style={S.logo}>⚡ CodeTest Pro</div>
        <div style={S.timerBox}>
          <div style={S.timerNum(timeLeft < 120)}>{formatTime(timeLeft)}</div>
          <div style={S.timerLabel}>time remaining</div>
        </div>
        <div style={S.scoreBox}>
          <span>Score</span>
          <span style={S.scoreVal}>{score}</span>
          <span>Done</span>
          <span style={S.scoreVal}>{correct}/{TOTAL}</span>
        </div>
        <div style={S.qList}>

          {/* MCQ Section */}
          <div style={S.phaseLabel}>📝 MCQ Phase ({MCQ_COUNT})</div>
          {MCQ_QUESTIONS.map((item, i) => (
            <div key={i} style={S.qItem(current === i, answers[i] !== null)} onClick={() => setCurrent(i)}>
              <div style={S.dot(current === i, answers[i] !== null)} />
              <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: "12px" }}>
                {answers[i] !== null ? "✓ " : ""}{item.title}
              </span>
              <span style={S.typeBadge("mcq")}>MCQ</span>
            </div>
          ))}

          {/* Coding Section */}
          <div style={{ ...S.phaseLabel, marginTop: "8px" }}>💻 Coding Phase ({codingQuestions.length})</div>
          {codingQuestions.map((item, i) => {
            const idx = i + MCQ_COUNT;
            return (
              <div key={idx} style={S.qItem(current === idx, answers[idx] !== null)} onClick={() => setCurrent(idx)}>
                <div style={S.dot(current === idx, answers[idx] !== null)} />
                <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: "12px" }}>
                  {answers[idx] !== null ? "✓ " : ""}{item.title}
                </span>
                <span style={S.typeBadge("code")}>&lt;/&gt;</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* MAIN */}
      <div style={S.main}>

        {/* TOPBAR */}
        <div style={S.topbar}>
          <span style={S.phaseTag(q.type)}>{q.type === "mcq" ? "MCQ" : "Code"}</span>
          <span style={S.qTitle}>{q.title}</span>
          <span style={{ fontSize: "12px", color: "#475569" }}>
            {current + 1} / {TOTAL}
          </span>
          <span style={S.diffBadge(q.diff)}>{q.diff}</span>
          {q.topic && (
            <span style={{ fontSize: "11px", color: "#475569", background: "rgba(148,163,184,0.08)", padding: "2px 8px", borderRadius: "8px" }}>
              {q.topic}
            </span>
          )}
          <button style={S.btnDanger} onClick={() => { clearInterval(timerRef.current); setTestDone(true); }}>
            End Test
          </button>
        </div>

        {/* PROGRESS */}
        <div style={S.progressBar}>
          <div style={S.progressFill(progress)} />
        </div>

        {/* CONTENT */}
        <div style={S.content}>
          {q.type === "mcq" ? (
            <>
              <p style={S.mcqDesc}>{q.desc}</p>
              <div>
                {q.options.map((opt, i) => (
                  <button key={i} style={S.optBtn(getOptState(i))}
                    onClick={() => { if (optConfirmed) return; setSelectedOpt(i); }}>
                    <strong>{String.fromCharCode(65 + i)}.</strong> &nbsp;{opt}
                    {optConfirmed && i === q.answer && " ✓"}
                    {optConfirmed && i === selectedOpt && i !== q.answer && " ✗"}
                  </button>
                ))}
              </div>
              {optConfirmed && (
                <div style={{ marginTop: "14px", padding: "12px 16px", borderRadius: "10px", background: selectedOpt === q.answer ? "rgba(34,197,94,0.08)" : "rgba(239,68,68,0.08)", border: `1px solid ${selectedOpt === q.answer ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}`, fontSize: "13px", color: selectedOpt === q.answer ? "#22c55e" : "#ef4444" }}>
                  {selectedOpt === q.answer ? "✅ Correct! +10 points" : `❌ Wrong. Correct answer: ${q.options[q.answer]}`}
                </div>
              )}
            </>
          ) : (
            <>
              <p style={S.codeDesc}>{q.desc}</p>
              <pre style={S.exBlock}>{q.example}</pre>
              <textarea
                style={S.editor}
                value={codeVals[current] || ""}
                onChange={e => updateCode(e.target.value)}
                spellCheck={false}
              />
              {outputVisible && (
                <div style={S.outputBox}>
                  <span style={{ color: "#475569", fontSize: "11px", fontWeight: "600" }}>OUTPUT › </span>
                  {output}
                </div>
              )}
            </>
          )}

          {hintVisible && (
            <div style={S.hintBox}>
              💡 <strong>AI Hint:</strong> {q.hint}
            </div>
          )}
        </div>

        {/* ACTIONS */}
        <div style={S.actions}>
          <button style={S.btn} onClick={() => setHintVisible(h => !h)}>
            💡 {hintVisible ? "Hide" : "Hint"}
          </button>

          {q.type === "code" && (
            <>
              <button style={S.btn} onClick={runCode}>▶ Run</button>
              <button style={S.btnSuccess} onClick={submitCode}>✓ Submit</button>
            </>
          )}

          {q.type === "mcq" && !optConfirmed && (
            <button
              style={{ ...S.btnPrimary, opacity: selectedOpt === null ? 0.4 : 1 }}
              onClick={confirmMCQ}
              disabled={selectedOpt === null}
            >
              Confirm ✓
            </button>
          )}

          <div style={{ marginLeft: "auto", display: "flex", gap: "8px" }}>
            {current > 0 && (
              <button style={S.btn} onClick={() => setCurrent(c => c - 1)}>← Prev</button>
            )}
            {current < TOTAL - 1 ? (
              <button style={S.btnPrimary} onClick={() => setCurrent(c => c + 1)}>Next →</button>
            ) : (
              <button style={S.btnSuccess} onClick={() => { clearInterval(timerRef.current); setTestDone(true); }}>
                Finish ✓
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}