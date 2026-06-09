import React, { useState, useEffect, useRef } from "react";
import API from "../api";
import CodeEditor from "../pages/CodeEditor";

function Analyzer() {
  const [code, setCode] = useState("print('Hello')");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const controllerRef = useRef(null);
  const outputRef = useRef(null);

  // =========================
  // AUTO SCROLL
  // =========================
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [data]);

  // =========================
  // ANALYZE
  // =========================
  const analyze = async () => {
    if (!code.trim()) return;

    setLoading(true);
    setData(null);

    controllerRef.current = new AbortController();

    try {
      const res = await API.post(
        "analyze/",
        { code, language: "python" },
        { signal: controllerRef.current.signal }
      );

      const result = res.data.result;

      // Guard: ensure result is an object
      if (typeof result === "object" && result !== null) {
        setData(result);
      } else {
        setData({
          code_understanding: "Unexpected response from server",
          errors: "Invalid response format",
          improvements: "Check backend logs",
          fixed_code: code,
          output: "",
          verdict: "Incorrect",
        });
      }
    } catch (err) {
      if (err.name === "CanceledError" || err.code === "ERR_CANCELED") {
        // User stopped — do nothing
        return;
      }
      setData({
        code_understanding: "Server error occurred",
        errors: err.message || "Request failed",
        improvements: "Check if backend is running",
        fixed_code: code,
        output: "",
        verdict: "Incorrect",
      });
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // STOP
  // =========================
  const stopAnalysis = () => {
    controllerRef.current?.abort();
    setLoading(false);
  };

  // =========================
  // SECTION CARD
  // =========================
  const Section = ({ title, color, children, isCode, isError }) => (
    <div style={{
      background: "rgba(15, 23, 42, 0.7)",
      border: `1px solid rgba(148, 163, 184, 0.15)`,
      borderLeft: `4px solid ${color}`,
      borderRadius: "14px",
      padding: "14px",
      marginBottom: "12px",
      backdropFilter: "blur(10px)",
      boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
    }}>
      <div style={{
        fontSize: "13px",
        fontWeight: "600",
        color,
        marginBottom: "8px"
      }}>
        {title}
      </div>

      {isCode ? (
        <pre style={{
          margin: 0,
          color: "#22c55e",
          fontSize: "13px",
          overflowX: "auto",
          whiteSpace: "pre-wrap",
        }}>
          {children || "(empty)"}
        </pre>
      ) : (
        <div style={{
          color: isError
            ? (children === "No errors" ? "#22c55e" : "#ef4444")
            : "#cbd5e1",
          fontSize: "14px",
          lineHeight: "1.6",
          fontWeight: isError && children !== "No errors" ? "600" : "400",
        }}>
          {children || "(none)"}
        </div>
      )}
    </div>
  );

  // =========================
  // STYLES
  // =========================
  const styles = {
    container: {
      display: "flex",
      height: "100vh",
      background: "radial-gradient(circle at top, #0f172a, #020617)",
      color: "#fff",
      fontFamily: "ui-sans-serif",
    },
    left: {
      width: "60%",
      display: "flex",
      flexDirection: "column",
      borderRight: "1px solid rgba(148,163,184,0.1)",
    },
    right: {
      width: "40%",
      display: "flex",
      flexDirection: "column",
      background: "rgba(2,6,23,0.9)",
    },
    header: {
      padding: "12px 16px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      background: "rgba(15,23,42,0.7)",
      backdropFilter: "blur(12px)",
      borderBottom: "1px solid rgba(148,163,184,0.1)",
    },
    title: {
      fontSize: "13px",
      color: "#38bdf8",
      fontWeight: "600",
    },
    buttonGroup: {
      display: "flex",
      gap: "8px",
    },
    btn: {
      border: "none",
      padding: "8px 12px",
      borderRadius: "10px",
      cursor: "pointer",
      fontWeight: "600",
      fontSize: "12px",
      transition: "0.2s",
    },
    analyzeBtn: {
      background: "linear-gradient(135deg,#38bdf8,#6366f1)",
      color: "#fff",
    },
    stopBtn: {
      background: "linear-gradient(135deg,#ef4444,#dc2626)",
      color: "#fff",
    },
    body: {
      flex: 1,
      padding: "14px",
      overflowY: "auto",
    },
    badge: {
      fontSize: "11px",
      padding: "4px 10px",
      borderRadius: "20px",
      background: loading ? "#ef4444" : "#22c55e",
      color: "#fff",
    },
    empty: {
      textAlign: "center",
      marginTop: "30px",
      color: "#64748b",
      fontSize: "14px",
    },
    spinner: {
      width: "14px",
      height: "14px",
      border: "2px solid #fff",
      borderTop: "2px solid transparent",
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
      display: "inline-block",
      marginRight: "6px",
      verticalAlign: "middle",
    },
  };

  // =========================
  // RENDER
  // =========================
  return (
    <div style={styles.container}>

      {/* LEFT — Code Editor */}
      <div style={styles.left}>
        <div style={styles.header}>
          <div style={styles.title}>📄 main.py</div>

          <div style={styles.buttonGroup}>
            <button
              style={{
                ...styles.btn,
                ...styles.stopBtn,
                opacity: loading ? 1 : 0.5,
                cursor: loading ? "pointer" : "not-allowed",
              }}
              onClick={stopAnalysis}
              disabled={!loading}
            >
              🛑 Stop
            </button>

            <button
              style={{
                ...styles.btn,
                ...styles.analyzeBtn,
                opacity: loading ? 0.7 : 1,
                cursor: loading ? "not-allowed" : "pointer",
              }}
              onClick={analyze}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span style={styles.spinner}></span>
                  Analyzing...
                </>
              ) : (
                "🧠 Analyze"
              )}
            </button>
          </div>
        </div>

        <CodeEditor
          code={code}
          setCode={setCode}
          language="python"
        />
      </div>

      {/* RIGHT — AI Result */}
      <div style={styles.right}>
        <div style={styles.header}>
          <div style={styles.title}>⚡ AI Result</div>
          <div style={styles.badge}>
            {loading ? "⏳ Running" : "✅ Idle"}
          </div>
        </div>

        <div style={styles.body} ref={outputRef}>

          {!loading && !data && (
            <div style={styles.empty}>
              ✨ Write code and click <b>Analyze</b> to get AI review
            </div>
          )}

          {loading && (
            <div style={styles.empty}>
              🤖 AI is analyzing your code...
            </div>
          )}

          {!loading && data && (
            <>
              <Section title="🧠 Code Understanding" color="#38bdf8">
                {data.code_understanding}
              </Section>

              <Section title="❌ Errors" color="#ef4444" isError>
                {data.errors}
              </Section>

              <Section title="⚠️ Improvements" color="#f59e0b">
                {data.improvements}
              </Section>

              <Section title="✅ Fixed Code" color="#22c55e" isCode>
                {data.fixed_code}
              </Section>

              <Section title="📤 Output" color="#a78bfa" isCode>
                {data.output}
              </Section>

              <Section title="🎯 Verdict" color="#06b6d4">
                <span style={{
                  color: data.verdict === "Correct" ? "#22c55e" : "#ef4444",
                  fontWeight: "700",
                  fontSize: "15px",
                }}>
                  {data.verdict === "Correct" ? "✅ " : "❌ "}
                  {data.verdict}
                </span>
              </Section>
            </>
          )}
        </div>
      </div>

      {/* SPINNER ANIMATION */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

    </div>
  );
}

export default Analyzer;