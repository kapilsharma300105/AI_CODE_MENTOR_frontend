import React, { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

function Login() {
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // =========================
  // 🔥 LOGIN HANDLER (FIXED)
  // =========================
  const handleLogin = async () => {
    setError("");

    if (!form.username || !form.password) {
      setError("Username and password required");
      return;
    }

    try {
      setLoading(true);

      const res = await API.post("login/", form);
      

      console.log("LOGIN RESPONSE =", res.data);

      console.log("LOGIN SUCCESS:", res.data);

      // =========================
      // 🔥 SAVE TOKEN
      // =========================
      localStorage.setItem("token", res.data.access);

      // =========================
      // 🔥 SAVE USER (IMPORTANT FOR NAVBAR)
      // =========================
      localStorage.setItem(
        "user",
        JSON.stringify({
          name: form.username,
        })
      );

      // =========================
      // 🔥 SYNC NAVBAR
      // =========================
      window.dispatchEvent(new Event("userLogin"));

      // =========================
      // 🔥 REDIRECT (BETTER THAN window.location)
      // =========================
      navigate("/dashboard");

    } catch (err) {
      console.log("LOGIN ERROR:", err.response?.data);

      setError(
        err.response?.data?.error || "Login failed. Check backend."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        <h2 style={{ color: "#00ffcc" }}>🚀 AI Code Mentor</h2>
        <p style={{ color: "#aaa" }}>Login to continue</p>

        {error && (
          <p style={{ color: "red", fontSize: 13 }}>{error}</p>
        )}

        {/* USERNAME */}
        <input
          placeholder="Username"
          style={styles.input}
          value={form.username}
          onChange={(e) =>
            setForm({ ...form, username: e.target.value })
          }
        />

        {/* PASSWORD */}
        <input
          type="password"
          placeholder="Password"
          style={styles.input}
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        {/* LOGIN BUTTON */}
        <button
          style={{
            ...styles.loginBtn,
            opacity: loading ? 0.6 : 1,
            cursor: loading ? "not-allowed" : "pointer",
          }}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        <p style={{ color: "#aaa", marginTop: "10px" }}>
  Forgot password?{" "}
  <a href="/forgot-password" style={{ color: "#00ffcc" }}>
    Click here
  </a>
</p>

        <div style={styles.divider}>OR</div>

        {/* GOOGLE LOGIN */}
        <button
          style={styles.googleBtn}
          onClick={() =>
            (window.location.href =
              "http://127.0.0.1:8000/accounts/google/login/")
          }
        >
          🔵 Continue with Google
        </button>


        <p style={{ color: "#aaa", marginTop: 10 }}>
          No account? <a href="/signup">Signup</a>
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
    background: "rgba(27, 27, 27, 0.95)",
    boxShadow: "0 0 40px rgba(0,255,200,0.12)",
    textAlign: "center",
    color: "white",
    border: "1px solid rgba(255,255,255,0.06)",
    backdropFilter: "blur(10px)",
  },

  input: {
    width: "100%",
    padding: "12px 14px",
    margin: "10px 0",
    borderRadius: "10px",
    border: "1px solid #2d2d2d",
    outline: "none",
    background: "#1f1f1f",
    color: "white",
    fontSize: "14px",
    transition: "0.2s",
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
    transition: "0.2s",
    boxShadow: "0 0 15px rgba(0,255,200,0.2)",
  },

  googleBtn: {
    width: "100%",
    padding: "12px",
    marginTop: "10px",
    background: "#ffffff",
    color: "#000",
    border: "none",
    borderRadius: "10px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "0.2s",
  },

  divider: {
    margin: "14px 0",
    color: "#888",
    fontSize: "12px",
    letterSpacing: "1px",
  },
};
export default Login;