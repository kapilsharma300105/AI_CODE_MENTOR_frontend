import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api";

function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");
    if (!form.username || !form.password) {
      setError("Username and password required");
      return;
    }
    try {
      setLoading(true);
      const res = await API.post("api/token/", {
        username: form.username,
        password: form.password,
      });
      localStorage.setItem("token", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      localStorage.setItem("user", JSON.stringify({ name: form.username }));
      window.dispatchEvent(new Event("userLogin"));
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.detail || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={{ color: "#00ffcc" }}>🚀 AI Code Mentor</h2>
        <p style={{ color: "#aaa" }}>Login to continue</p>

        {error && <p style={{ color: "red", fontSize: 13 }}>{error}</p>}

        <input
          placeholder="Username"
          style={styles.input}
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          style={styles.input}
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button
          style={{ ...styles.loginBtn, opacity: loading ? 0.6 : 1 }}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p style={{ color: "#aaa", marginTop: 10 }}>
          Forgot password?{" "}
          <Link to="/forgot-password" style={{ color: "#00ffcc" }}>Click here</Link>
        </p>

        <div style={styles.divider}>OR</div>

        <button
          style={styles.googleBtn}
          onClick={() => {
            window.location.href =
              "https://ai-code-mentor-backend-0rmn.onrender.com/accounts/google/login/";
          }}
        >
          🔵 Continue with Google
        </button>

        <p style={{ color: "#aaa", marginTop: 10 }}>
          No account?{" "}
          <Link to="/signup" style={{ color: "#00ffcc" }}>Signup</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "radial-gradient(circle at top, #111827, #0d0d0d)",
    fontFamily: "Segoe UI, sans-serif",
  },
  card: {
    width: "380px",
    padding: "32px",
    borderRadius: "18px",
    background: "rgba(27,27,27,0.95)",
    boxShadow: "0 0 40px rgba(0,255,200,0.12)",
    textAlign: "center",
    color: "white",
    border: "1px solid rgba(255,255,255,0.06)",
  },
  input: {
    width: "100%",
    padding: "12px 14px",
    margin: "10px 0",
    borderRadius: "10px",
    border: "1px solid #2d2d2d",
    background: "#1f1f1f",
    color: "white",
    fontSize: "14px",
    outline: "none",
  },
  loginBtn: {
    width: "100%",
    padding: "12px",
    marginTop: "10px",
    background: "linear-gradient(135deg, #00ffcc, #00c2ff)",
    border: "none",
    borderRadius: "10px",
    fontWeight: "bold",
    color: "#000",
    cursor: "pointer",
  },
  googleBtn: {
    width: "100%",
    padding: "12px",
    marginTop: "10px",
    background: "#fff",
    color: "#000",
    border: "none",
    borderRadius: "10px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  divider: { margin: "14px 0", color: "#888", fontSize: "12px" },
};

export default Login;