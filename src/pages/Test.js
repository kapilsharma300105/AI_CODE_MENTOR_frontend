// import React, { useEffect, useState } from "react";
// import API from "../api";

// const sampleQuestions = [
//   {
//     id: 1,
//     title: "Two Sum",
//     difficulty: "Easy",
//     description: "Return indices of two numbers that add up to target.",
//     input: "nums=[2,7,11,15], target=9",
//     output: "[0,1]"
//   },
//   {
//     id: 2,
//     title: "Binary Search",
//     difficulty: "Medium",
//     description: "Implement binary search algorithm.",
//     input: "nums=[1,2,3,4,5], target=4",
//     output: "3"
//   }
// ];

// export default function Test() {
//   const [questions] = useState(sampleQuestions);
//   const [selected, setSelected] = useState(0);
//   const [code, setCode] = useState("");
//   const [output, setOutput] = useState("");
//   const [time, setTime] = useState(1800); // 30 min
//   const [running, setRunning] = useState(true);
//   const [tab, setTab] = useState("desc");
//   const [solved, setSolved] = useState(new Set());

//   const q = questions[selected];

//   // ================= TIMER =================
//   useEffect(() => {
//     if (!running) return;

//     const timer = setInterval(() => {
//       setTime((t) => (t > 0 ? t - 1 : 0));
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [running]);

//   const formatTime = (t) => {
//     const m = Math.floor(t / 60);
//     const s = t % 60;
//     return `${m}:${s < 10 ? "0" : ""}${s}`;
//   };

//   // ================= LOAD CODE PER QUESTION =================
//   useEffect(() => {
//     const saved = localStorage.getItem(`code_${q.id}`);
//     setCode(saved || "");
//     setOutput("");
//     setTab("desc");
//   }, [selected]);

//   useEffect(() => {
//     localStorage.setItem(`code_${q.id}`, code);
//   }, [code]);

//   // ================= RUN CODE =================
//   const runCode = async () => {
//     if (!code.trim()) return;

//     setOutput("⚡ Running...");

//     try {
//       const res = await API.post("run/", {
//         code,
//         language: "python",
//       });

//       setOutput(res.data.output || "No output");
//       setTab("output");
//     } catch {
//       setOutput("❌ Run failed");
//     }
//   };

//   // ================= SUBMIT =================
//   const submitCode = async () => {
//     if (!code.trim()) return;

//     setOutput("🧠 Evaluating...");

//     try {
//       const res = await API.post("evaluate/", {
//         code,
//         question_id: q.id,
//       });

//       setOutput(res.data.result || "Submitted");
//       setTab("output");

//       if (res.data.result?.verdict === "Correct") {
//         setSolved((prev) => new Set([...prev, q.id]));
//       }
//     } catch {
//       setOutput("❌ Submit failed");
//     }
//   };

//   const resetCode = () => {
//     setCode("");
//     localStorage.removeItem(`code_${q.id}`);
//   };

//   // ================= UI =================
//   return (
//     <div style={{ display: "flex", height: "100vh", background: "#0f172a", color: "white" }}>

//       {/* LEFT */}
//       <div style={{ width: "25%", borderRight: "1px solid #333", padding: 10 }}>
//         <h3>🧪 Problems</h3>

//         <div style={{ marginBottom: 10, color: "#38bdf8" }}>
//           ⏱ {formatTime(time)}
//           <button onClick={() => setRunning(!running)} style={{ marginLeft: 10 }}>
//             {running ? "Pause" : "Start"}
//           </button>
//         </div>

//         {questions.map((q, i) => (
//           <div
//             key={q.id}
//             onClick={() => setSelected(i)}
//             style={{
//               padding: 10,
//               margin: "8px 0",
//               cursor: "pointer",
//               background: selected === i ? "#2563eb" : "#1e293b",
//               borderRadius: 6
//             }}
//           >
//             <b>
//               {solved.has(q.id) ? "✅ " : ""}
//               {q.title}
//             </b>
//             <div style={{ fontSize: 12, color: "#aaa" }}>{q.difficulty}</div>
//           </div>
//         ))}
//       </div>

//       {/* CENTER */}
//       <div style={{ width: "35%", padding: 15, borderRight: "1px solid #333" }}>

//         {/* Tabs */}
//         <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
//           <button onClick={() => setTab("desc")}>Problem</button>
//           <button onClick={() => setTab("output")}>Output</button>
//         </div>

//         {tab === "desc" ? (
//           <>
//             <h2>{q.title}</h2>
//             <p>{q.description}</p>

//             <h4>Input</h4>
//             <pre>{q.input}</pre>

//             <h4>Expected Output</h4>
//             <pre>{q.output}</pre>
//           </>
//         ) : (
//           <div style={{ background: "#111", padding: 10, minHeight: 200 }}>
//             {output || "Run or submit code to see output"}
//           </div>
//         )}
//       </div>

//       {/* RIGHT */}
//       <div style={{ width: "40%", display: "flex", flexDirection: "column" }}>

//         {/* HEADER */}
//         <div style={{ padding: 10, background: "#1e293b", display: "flex", justifyContent: "space-between" }}>
//           <span>main.py</span>
//           <button onClick={resetCode}>Reset</button>
//         </div>

//         {/* EDITOR */}
//         <textarea
//           value={code}
//           onChange={(e) => setCode(e.target.value)}
//           placeholder="Write code..."
//           style={{
//             flex: 1,
//             background: "#0b0f1a",
//             color: "white",
//             padding: 10,
//             border: "none",
//             outline: "none",
//             fontFamily: "monospace"
//           }}
//         />

//         {/* ACTIONS */}
//         <div style={{ display: "flex", gap: 10, padding: 10, background: "#1e293b" }}>
//           <button onClick={runCode}>▶ Run</button>
//           <button onClick={submitCode} style={{ background: "#22c55e" }}>
//             Submit
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }




import React, { useState, useEffect, useRef } from "react";
import API from "../api";

const MCQ_QUESTIONS = [
  {
    type: "mcq",
    title: "Python List Complexity",
    diff: "Easy",
    topic: "Data Structures",
    desc: "What is the time complexity of accessing an element by index in a Python list?",
    options: ["O(n)", "O(log n)", "O(1)", "O(n²)"],
    answer: 2,
    hint: "Python lists are implemented as dynamic arrays — random access is constant time.",
  },
  {
    type: "mcq",
    title: "Stack vs Queue",
    diff: "Easy",
    topic: "Data Structures",
    desc: "Which data structure follows LIFO (Last In First Out) principle?",
    options: ["Queue", "Stack", "Deque", "Heap"],
    answer: 1,
    hint: "Think of a stack of plates — you take from the top, same side you added.",
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
    hint: "Binary search works by eliminating half the search space — only works if data is ordered.",
  },
  {
    type: "mcq",
    title: "HashMap Lookup",
    diff: "Medium",
    topic: "Data Structures",
    desc: "Average time complexity of lookup in a Python dictionary (hash map) is:",
    options: ["O(n)", "O(log n)", "O(1)", "O(n log n)"],
    answer: 2,
    hint: "Hash maps use hashing to compute the index directly — no searching needed on average.",
  },
];

const CODING_QUESTIONS = [
  {
    type: "code",
    title: "Two Sum",
    diff: "Easy",
    topic: "Arrays",
    desc: "Given an array of integers and a target, return indices of the two numbers that add up to the target.",
    example: "Input: nums=[2,7,11,15], target=9\nOutput: [0, 1]",
    starter:
      "def two_sum(nums, target):\n    # Write your solution here\n    pass\n\nprint(two_sum([2,7,11,15], 9))",
    hint: "Use a dictionary to store complement values as you iterate — gives O(n) solution.",
  },
  {
    type: "code",
    title: "Reverse String",
    diff: "Easy",
    topic: "Strings",
    desc: "Write a function that reverses a string and returns the result.",
    example: "Input: s='hello'\nOutput: 'olleh'",
    starter:
      "def reverse_string(s):\n    # Write your solution here\n    pass\n\nprint(reverse_string('hello'))",
    hint: "Python slice syntax s[::-1] reverses a string in one line.",
  },
];

const ALL_QUESTIONS = [...MCQ_QUESTIONS, ...CODING_QUESTIONS];
const TOTAL = ALL_QUESTIONS.length;
const MCQ_COUNT = MCQ_QUESTIONS.length;

const S = {
  app: {
    display: "flex",
    height: "100vh",
    background: "#0f172a",
    color: "#fff",
    fontFamily: "ui-sans-serif, system-ui, sans-serif",
    overflow: "hidden",
  },
  sidebar: {
    width: "240px",
    background: "#0f172a",
    borderRight: "1px solid rgba(148,163,184,0.1)",
    display: "flex",
    flexDirection: "column",
    flexShrink: 0,
  },
  logo: {
    padding: "14px 16px",
    borderBottom: "1px solid rgba(148,163,184,0.1)",
    fontSize: "14px",
    fontWeight: "600",
    color: "#38bdf8",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  timerBox: {
    padding: "14px 16px",
    borderBottom: "1px solid rgba(148,163,184,0.1)",
    textAlign: "center",
    background: "rgba(15,23,42,0.5)",
  },
  timerNum: (urgent) => ({
    fontSize: "28px",
    fontWeight: "700",
    color: urgent ? "#ef4444" : "#38bdf8",
    fontFamily: "monospace",
    letterSpacing: "2px",
  }),
  timerLabel: { fontSize: "11px", color: "#64748b", marginTop: "2px" },
  scoreBox: {
    padding: "12px 16px",
    borderBottom: "1px solid rgba(148,163,184,0.1)",
    display: "flex",
    justifyContent: "space-between",
    fontSize: "12px",
    color: "#94a3b8",
  },
  scoreVal: { fontWeight: "600", color: "#f1f5f9" },
  qList: { flex: 1, overflowY: "auto", padding: "8px" },
  phaseLabel: {
    fontSize: "10px",
    color: "#64748b",
    padding: "8px 6px 4px",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },
  qItem: (active, done) => ({
    padding: "8px 10px",
    borderRadius: "8px",
    cursor: "pointer",
    marginBottom: "4px",
    fontSize: "12px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: active
      ? "rgba(56,189,248,0.15)"
      : done
      ? "rgba(34,197,94,0.08)"
      : "transparent",
    border: active
      ? "1px solid rgba(56,189,248,0.3)"
      : "1px solid transparent",
    color: active ? "#38bdf8" : done ? "#22c55e" : "#94a3b8",
  }),
  dot: (active, done) => ({
    width: "7px",
    height: "7px",
    borderRadius: "50%",
    background: active ? "#38bdf8" : done ? "#22c55e" : "#334155",
    flexShrink: 0,
  }),
  typeBadge: (type) => ({
    fontSize: "10px",
    padding: "1px 6px",
    borderRadius: "10px",
    marginLeft: "auto",
    background:
      type === "mcq"
        ? "rgba(139,92,246,0.2)"
        : "rgba(20,184,166,0.2)",
    color: type === "mcq" ? "#a78bfa" : "#2dd4bf",
  }),
  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    background: "#0f172a",
  },
  topbar: {
    padding: "10px 18px",
    background: "rgba(15,23,42,0.8)",
    borderBottom: "1px solid rgba(148,163,184,0.1)",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  phaseTag: (type) => ({
    fontSize: "11px",
    padding: "3px 10px",
    borderRadius: "12px",
    fontWeight: "600",
    background:
      type === "mcq"
        ? "rgba(139,92,246,0.2)"
        : "rgba(20,184,166,0.2)",
    color: type === "mcq" ? "#a78bfa" : "#2dd4bf",
  }),
  qTitle: { fontSize: "14px", fontWeight: "600", color: "#f1f5f9", flex: 1 },
  diffBadge: (diff) => ({
    fontSize: "11px",
    padding: "2px 10px",
    borderRadius: "10px",
    fontWeight: "500",
    background:
      diff === "Easy"
        ? "rgba(34,197,94,0.15)"
        : diff === "Medium"
        ? "rgba(251,191,36,0.15)"
        : "rgba(239,68,68,0.15)",
    color:
      diff === "Easy"
        ? "#22c55e"
        : diff === "Medium"
        ? "#fbbf24"
        : "#ef4444",
  }),
  progressBar: {
    height: "3px",
    background: "rgba(148,163,184,0.1)",
    overflow: "hidden",
  },
  progressFill: (pct) => ({
    height: "100%",
    width: `${pct}%`,
    background: "linear-gradient(90deg, #38bdf8, #6366f1)",
    transition: "width 0.4s ease",
  }),
  content: { flex: 1, overflowY: "auto", padding: "20px 22px" },
  mcqDesc: {
    fontSize: "14px",
    color: "#cbd5e1",
    lineHeight: "1.7",
    marginBottom: "20px",
  },
  optBtn: (state) => ({
    width: "100%",
    padding: "11px 16px",
    borderRadius: "10px",
    cursor: state === "confirmed" ? "default" : "pointer",
    fontSize: "13px",
    textAlign: "left",
    marginBottom: "8px",
    border:
      state === "correct"
        ? "1px solid #22c55e"
        : state === "wrong"
        ? "1px solid #ef4444"
        : state === "selected"
        ? "1px solid #38bdf8"
        : "1px solid rgba(148,163,184,0.15)",
    background:
      state === "correct"
        ? "rgba(34,197,94,0.12)"
        : state === "wrong"
        ? "rgba(239,68,68,0.12)"
        : state === "selected"
        ? "rgba(56,189,248,0.1)"
        : "rgba(30,41,59,0.6)",
    color:
      state === "correct"
        ? "#22c55e"
        : state === "wrong"
        ? "#ef4444"
        : state === "selected"
        ? "#38bdf8"
        : "#cbd5e1",
  }),
  codeDesc: {
    fontSize: "13px",
    color: "#94a3b8",
    lineHeight: "1.6",
    marginBottom: "12px",
  },
  exBlock: {
    background: "rgba(15,23,42,0.8)",
    borderRadius: "8px",
    padding: "10px 14px",
    fontSize: "12px",
    fontFamily: "monospace",
    color: "#7dd3fc",
    marginBottom: "14px",
    border: "1px solid rgba(56,189,248,0.2)",
    whiteSpace: "pre",
  },
  editor: {
    width: "100%",
    minHeight: "180px",
    background: "#020617",
    color: "#e2e8f0",
    padding: "14px",
    borderRadius: "10px",
    fontFamily: "monospace",
    fontSize: "13px",
    border: "1px solid rgba(148,163,184,0.1)",
    resize: "vertical",
    outline: "none",
    lineHeight: "1.6",
  },
  outputBox: {
    marginTop: "10px",
    background: "rgba(2,6,23,0.9)",
    borderRadius: "8px",
    padding: "10px 14px",
    fontSize: "12px",
    fontFamily: "monospace",
    color: "#94a3b8",
    border: "1px solid rgba(148,163,184,0.08)",
    minHeight: "40px",
    whiteSpace: "pre-wrap",
  },
  hintBox: {
    marginTop: "14px",
    background: "rgba(251,191,36,0.08)",
    border: "1px solid rgba(251,191,36,0.25)",
    borderRadius: "10px",
    padding: "12px 14px",
    fontSize: "12px",
    color: "#fbbf24",
    lineHeight: "1.6",
  },
  actions: {
    padding: "10px 18px",
    background: "rgba(15,23,42,0.9)",
    borderTop: "1px solid rgba(148,163,184,0.1)",
    display: "flex",
    gap: "8px",
    alignItems: "center",
  },
  btn: {
    padding: "7px 14px",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: "600",
    cursor: "pointer",
    border: "1px solid rgba(148,163,184,0.2)",
    background: "rgba(30,41,59,0.8)",
    color: "#94a3b8",
  },
  btnPrimary: {
    padding: "7px 16px",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: "600",
    cursor: "pointer",
    border: "1px solid rgba(56,189,248,0.4)",
    background: "rgba(56,189,248,0.15)",
    color: "#38bdf8",
  },
  btnSuccess: {
    padding: "7px 16px",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: "600",
    cursor: "pointer",
    border: "1px solid rgba(34,197,94,0.4)",
    background: "rgba(34,197,94,0.15)",
    color: "#22c55e",
  },
  btnDanger: {
    padding: "7px 14px",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: "600",
    cursor: "pointer",
    border: "1px solid rgba(239,68,68,0.3)",
    background: "rgba(239,68,68,0.1)",
    color: "#ef4444",
  },
  resultScreen: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "30px",
    gap: "18px",
    overflowY: "auto",
  },
  statCards: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: "12px",
    width: "100%",
    maxWidth: "500px",
  },
  statCard: {
    background: "rgba(15,23,42,0.8)",
    border: "1px solid rgba(148,163,184,0.1)",
    borderRadius: "10px",
    padding: "14px",
    textAlign: "center",
  },
  lbRow: (isYou) => ({
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px 14px",
    borderRadius: "8px",
    background: isYou ? "rgba(56,189,248,0.1)" : "rgba(15,23,42,0.6)",
    border: isYou
      ? "1px solid rgba(56,189,248,0.3)"
      : "1px solid rgba(148,163,184,0.08)",
    fontSize: "13px",
    width: "100%",
    maxWidth: "500px",
  }),
};

export default function Test() {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [answers, setAnswers] = useState(new Array(TOTAL).fill(null));
  const [codeVals, setCodeVals] = useState(() => {
    const vals = new Array(TOTAL).fill("");
    ALL_QUESTIONS.forEach((q, i) => {
      if (q.type === "code") vals[i] = q.starter;
    });
    return vals;
  });
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [optConfirmed, setOptConfirmed] = useState(false);
  const [hintVisible, setHintVisible] = useState(false);
  const [output, setOutput] = useState("");
  const [outputVisible, setOutputVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30 * 60);
  const [testDone, setTestDone] = useState(false);
  const timerRef = useRef(null);

  const q = ALL_QUESTIONS[current];
  const progress = Math.round(
    (answers.filter((a) => a !== null).length / TOTAL) * 100
  );

  useEffect(() => {
    if (testDone) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          setTestDone(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [testDone]);

  const formatTime = (t) => {
    const m = Math.floor(t / 60);
    const s = t % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  useEffect(() => {
    setHintVisible(false);
    setOutput("");
    setOutputVisible(false);
    const q = ALL_QUESTIONS[current];
    if (q.type === "mcq") {
      const prev = answers[current];
      if (prev !== null) {
        setSelectedOpt(prev);
        setOptConfirmed(true);
      } else {
        setSelectedOpt(null);
        setOptConfirmed(false);
      }
    } else {
      if (answers[current] !== null) {
        setOutput(answers[current]);
        setOutputVisible(true);
      }
    }
  }, [current]);

  const confirmMCQ = () => {
    if (selectedOpt === null || optConfirmed) return;
    setOptConfirmed(true);
    const isCorrect = selectedOpt === q.answer;
    const newAnswers = [...answers];
    newAnswers[current] = selectedOpt;
    setAnswers(newAnswers);
    if (isCorrect) {
      setScore((s) => s + 10);
      setCorrect((c) => c + 1);
    }
  };

  const runCode = async () => {
    const code = codeVals[current];
    if (!code.trim()) return;
    setOutput("Running...");
    setOutputVisible(true);
    try {
      const res = await API.post("run/", { code, language: "python" });
      setOutput(res.data.output || "(no output)");
    } catch {
      setOutput("Run failed — check backend connection");
    }
  };

  const submitCode = async () => {
    const code = codeVals[current];
    if (!code.trim()) return;
    setOutput("Evaluating...");
    setOutputVisible(true);
    try {
      const res = await API.post("run/", { code, language: "python" });
      const out = res.data.output || "(no output)";
      setOutput(out);
      if (answers[current] === null) {
        const newAnswers = [...answers];
        newAnswers[current] = out;
        setAnswers(newAnswers);
        setScore((s) => s + 15);
        setCorrect((c) => c + 1);
      }
    } catch {
      setOutput("Submit failed");
    }
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

  if (testDone) {
    const pct = Math.round((correct / TOTAL) * 100);
    const leaderboard = [
      { name: "Arjun S.", pts: score + 35, you: false },
      { name: "Priya K.", pts: score + 20, you: false },
      { name: "You", pts: score, you: true },
      { name: "Rahul M.", pts: Math.max(0, score - 15), you: false },
      { name: "Sneha T.", pts: Math.max(0, score - 30), you: false },
    ].sort((a, b) => b.pts - a.pts);

    return (
      <div style={S.app}>
        <div style={{ ...S.resultScreen, width: "100%" }}>
          <div style={{ fontSize: "12px", color: "#64748b" }}>Test Complete</div>
          <div style={{ fontSize: "52px", fontWeight: "700", color: "#38bdf8", lineHeight: 1 }}>
            {score}
            <span style={{ fontSize: "18px", color: "#64748b" }}> pts</span>
          </div>
          <div style={{ fontSize: "14px", color: "#94a3b8" }}>
            {correct} of {TOTAL} correct &nbsp;·&nbsp; {pct}% accuracy
          </div>
          <div style={S.statCards}>
            {[
              {
                num: `${MCQ_QUESTIONS.filter((_, i) => answers[i] !== null && answers[i] === ALL_QUESTIONS[i].answer).length}/${MCQ_COUNT}`,
                lbl: "MCQ correct",
              },
              {
                num: `${CODING_QUESTIONS.filter((_, i) => answers[i + MCQ_COUNT] !== null).length}/${CODING_QUESTIONS.length}`,
                lbl: "Code solved",
              },
              { num: `${pct}%`, lbl: "Accuracy" },
            ].map((s, i) => (
              <div key={i} style={S.statCard}>
                <div style={{ fontSize: "24px", fontWeight: "700", color: "#f1f5f9" }}>{s.num}</div>
                <div style={{ fontSize: "11px", color: "#64748b", marginTop: "4px" }}>{s.lbl}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: "12px", color: "#64748b", alignSelf: "flex-start", width: "100%", maxWidth: "500px", marginBottom: "4px", fontWeight: "600" }}>
            Leaderboard
          </div>
          {leaderboard.map((p, i) => (
            <div key={i} style={S.lbRow(p.you)}>
              <span style={{ width: "20px", color: "#64748b", fontWeight: "600", fontSize: "12px" }}>{i + 1}</span>
              <span style={{ flex: 1, color: p.you ? "#38bdf8" : "#f1f5f9" }}>{p.name}</span>
              {p.you && (
                <span style={{ fontSize: "10px", padding: "1px 8px", background: "rgba(56,189,248,0.2)", color: "#38bdf8", borderRadius: "10px" }}>you</span>
              )}
              <span style={{ fontWeight: "600", color: "#f1f5f9" }}>{p.pts} pts</span>
            </div>
          ))}
          <button style={S.btnPrimary} onClick={() => window.location.reload()}>
            Retake Test
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={S.app}>
      <div style={S.sidebar}>
        <div style={S.logo}>⚡ CodeTest Pro</div>
        <div style={S.timerBox}>
          <div style={S.timerNum(timeLeft < 120)}>{formatTime(timeLeft)}</div>
          <div style={S.timerLabel}>time remaining</div>
        </div>
        <div style={S.scoreBox}>
          <span>Score</span>
          <span style={S.scoreVal}>{score}</span>
          <span>Correct</span>
          <span style={S.scoreVal}>{correct}/{TOTAL}</span>
        </div>
        <div style={S.qList}>
          <div style={S.phaseLabel}>MCQ Phase</div>
          {MCQ_QUESTIONS.map((item, i) => (
            <div key={i} style={S.qItem(current === i, answers[i] !== null)} onClick={() => setCurrent(i)}>
              <div style={S.dot(current === i, answers[i] !== null)} />
              <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.title}</span>
              <span style={S.typeBadge("mcq")}>MCQ</span>
            </div>
          ))}
          <div style={{ ...S.phaseLabel, marginTop: "8px" }}>Coding Phase</div>
          {CODING_QUESTIONS.map((item, i) => {
            const idx = i + MCQ_COUNT;
            return (
              <div key={idx} style={S.qItem(current === idx, answers[idx] !== null)} onClick={() => setCurrent(idx)}>
                <div style={S.dot(current === idx, answers[idx] !== null)} />
                <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.title}</span>
                <span style={S.typeBadge("code")}>&lt;/&gt;</span>
              </div>
            );
          })}
        </div>
      </div>

      <div style={S.main}>
        <div style={S.topbar}>
          <span style={S.phaseTag(q.type)}>{q.type === "mcq" ? "MCQ" : "Code"}</span>
          <span style={S.qTitle}>{q.title}</span>
          <span style={S.diffBadge(q.diff)}>{q.diff}</span>
          <button style={S.btnDanger} onClick={() => { clearInterval(timerRef.current); setTestDone(true); }}>
            End Test
          </button>
        </div>

        <div style={S.progressBar}>
          <div style={S.progressFill(progress)} />
        </div>

        <div style={S.content}>
          {q.type === "mcq" ? (
            <>
              <p style={S.mcqDesc}>{q.desc}</p>
              <div>
                {q.options.map((opt, i) => (
                  <button key={i} style={S.optBtn(getOptState(i))} onClick={() => { if (optConfirmed) return; setSelectedOpt(i); }}>
                    <strong>{String.fromCharCode(65 + i)}.</strong> {opt}
                    {optConfirmed && i === q.answer && " ✓"}
                    {optConfirmed && i === selectedOpt && i !== q.answer && " ✗"}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              <p style={S.codeDesc}>{q.desc}</p>
              <pre style={S.exBlock}>{q.example}</pre>
              <textarea style={S.editor} value={codeVals[current]} onChange={(e) => updateCode(e.target.value)} spellCheck={false} />
              {outputVisible && (
                <div style={S.outputBox}>
                  <span style={{ color: "#64748b", fontSize: "11px" }}>OUTPUT: </span>
                  {output}
                </div>
              )}
            </>
          )}
          {hintVisible && (
            <div style={S.hintBox}>💡 <strong>AI Hint:</strong> {q.hint}</div>
          )}
        </div>

        <div style={S.actions}>
          <button style={S.btn} onClick={() => setHintVisible((h) => !h)}>
            💡 {hintVisible ? "Hide Hint" : "AI Hint"}
          </button>
          {q.type === "code" && (
            <>
              <button style={S.btn} onClick={runCode}>▶ Run</button>
              <button style={S.btnSuccess} onClick={submitCode}>✓ Submit</button>
            </>
          )}
          {q.type === "mcq" && !optConfirmed && (
            <button style={{ ...S.btnPrimary, opacity: selectedOpt === null ? 0.5 : 1 }} onClick={confirmMCQ} disabled={selectedOpt === null}>
              Confirm Answer
            </button>
          )}
          <div style={{ marginLeft: "auto", display: "flex", gap: "8px" }}>
            {current > 0 && (
              <button style={S.btn} onClick={() => setCurrent((c) => c - 1)}>← Prev</button>
            )}
            {current < TOTAL - 1 ? (
              <button style={S.btnPrimary} onClick={() => setCurrent((c) => c + 1)}>Next →</button>
            ) : (
              <button style={S.btnSuccess} onClick={() => { clearInterval(timerRef.current); setTestDone(true); }}>
                Finish Test ✓
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}