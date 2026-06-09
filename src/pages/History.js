import React, { useEffect, useState } from "react";
import API from "../api";

const LANG_COLORS = {
  python: "#3b9ddd",
  javascript: "#f7df1e",
  java: "#f89820",
  cpp: "#9c4fe4",
  c: "#5c9ecf",
};

const LANG_ICONS = {
  python: "🐍",
  javascript: "⚡",
  java: "☕",
  cpp: "⚙️",
  c: "🔩",
};

function History() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = () => {
    API.get("history/")
      .then((res) => { setData(res.data); setLoading(false); })
      .catch(() => { console.log("Error"); setLoading(false); });
  };

  useEffect(() => { fetchHistory(); }, []);

  const deleteItem = (id) => {
    API.delete(`history/${id}/delete/`)
      .then(() => setData(prev => prev.filter(item => item.id !== id)))
      .catch(() => console.log("Delete error"));
  };

  const clearAll = () => {
    Promise.all(data.map(item => API.delete(`history/${item.id}/delete/`)))
      .then(() => setData([]));
  };

  return (
    <div style={{
      padding: "24px",
      background: "#0d0d0f",
      minHeight: "100vh",
      color: "#c9d1d9",
      fontFamily: "'JetBrains Mono', monospace",
    }}>
      {/* Header */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "24px",
        borderBottom: "1px solid #1e1e26",
        paddingBottom: "16px",
      }}>
        <div>
          <h2 style={{ margin: 0, fontSize: "20px", color: "#fff", letterSpacing: "-0.5px" }}>
            📜 Execution History
          </h2>
          <span style={{ fontSize: "11px", color: "#444", marginTop: "4px", display: "block" }}>
            {data.length} record{data.length !== 1 ? "s" : ""}
          </span>
        </div>

        {data.length > 0 && (
          <button
            onClick={clearAll}
            style={{
              background: "none",
              border: "1px solid #2a2a35",
              color: "#f47067",
              cursor: "pointer",
              borderRadius: "6px",
              padding: "6px 14px",
              fontFamily: "inherit",
              fontSize: "12px",
              transition: "all 0.15s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "#1a0e0e"}
            onMouseLeave={e => e.currentTarget.style.background = "none"}
          >
            🗑 Clear All
          </button>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: "center", color: "#444", padding: "40px" }}>
          Loading...
        </div>
      )}

      {/* Empty */}
      {!loading && data.length === 0 && (
        <div style={{
          padding: "50px 30px",
          textAlign: "center",
          color: "#2a2a35",
          border: "1px dashed #1e1e26",
          borderRadius: "12px",
        }}>
          <div style={{ fontSize: "40px", marginBottom: "12px" }}>⌨</div>
          <div style={{ fontSize: "14px" }}>No history yet</div>
          <div style={{ fontSize: "12px", marginTop: "6px", color: "#222" }}>
            Run some code to see results here
          </div>
        </div>
      )}

      {/* History items */}
      {data.map((item) => {
        const accent = LANG_COLORS[item.language] || "#00ff9d";
        return (
          <div
            key={item.id}
            style={{
              background: "#111115",
              border: "1px solid #1e1e26",
              borderLeft: `3px solid ${accent}`,
              borderRadius: "10px",
              marginBottom: "16px",
              overflow: "hidden",
            }}
          >
            {/* Item header */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px 14px",
              borderBottom: "1px solid #1a1a22",
              background: "#0d0d0f",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{
                  width: "7px", height: "7px", borderRadius: "50%",
                  background: accent, boxShadow: `0 0 5px ${accent}`,
                  display: "inline-block",
                }} />
                <span style={{ fontSize: "12px", color: accent }}>
                  {LANG_ICONS[item.language]} {item.language}
                </span>
                <span style={{ fontSize: "11px", color: "#333" }}>
                  {new Date(item.created_at).toLocaleString()}
                </span>
              </div>

              <button
                onClick={() => deleteItem(item.id)}
                style={{
                  background: "none", border: "none",
                  color: "#333", cursor: "pointer",
                  fontSize: "13px", transition: "color 0.15s",
                }}
                onMouseEnter={e => e.target.style.color = "#f47067"}
                onMouseLeave={e => e.target.style.color = "#333"}
              >✕</button>
            </div>

            <div style={{ padding: "14px" }}>
              {/* Code */}
              <div style={{ fontSize: "10px", color: "#38bdf8", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "6px" }}>
                Code
              </div>
              <pre style={{
                background: "#0a0a0c",
                padding: "12px",
                borderRadius: "6px",
                overflowX: "auto",
                color: "#c9d1d9",
                fontSize: "12.5px",
                lineHeight: "1.6",
                margin: "0 0 14px",
                border: "1px solid #1a1a22",
              }}>
                {item.code}
              </pre>

              {/* Output */}
              <div style={{ fontSize: "10px", color: "#57c77e", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "6px" }}>
                Output
              </div>
              <pre style={{
                background: "#0a0a0c",
                padding: "12px",
                borderRadius: "6px",
                overflowX: "auto",
                fontSize: "12.5px",
                lineHeight: "1.6",
                margin: 0,
                border: "1px solid #1a1a22",
                color: item.output?.includes("Error") ? "#f47067" : "#c9d1d9",
              }}>
                {item.output || "No output"}
              </pre>
            </div>
          </div>
        );
      })}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap');
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #2a2a35; border-radius: 2px; }
      `}</style>
    </div>
  );
}

export default History;