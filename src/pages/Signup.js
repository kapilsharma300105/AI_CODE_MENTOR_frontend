import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // =========================
  // 🔥 SIGNUP + AUTO LOGIN
  // =========================
  const handleSignup = async () => {
    setError("");

    if (!username || !password) {
      setError("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      // 1️⃣ CREATE USER
      await axios.post("http://127.0.0.1:8000/api/signup/", {
        username,
        password,
      });

      // 2️⃣ AUTO LOGIN (JWT)
      const loginRes = await axios.post(
        "http://127.0.0.1:8000/api/token/",
        { username, password }
      );

      // 3️⃣ SAVE TOKENS
      localStorage.setItem("token", loginRes.data.access);
      localStorage.setItem("refresh", loginRes.data.refresh);

      // 4️⃣ SAVE USER (NAVBAR FIX IMPORTANT)
      localStorage.setItem(
        "user",
        JSON.stringify({ name: username })
      );

      // 5️⃣ NAVBAR SYNC FIX
      window.dispatchEvent(new Event("userLogin"));

      // 6️⃣ REDIRECT
      navigate("/dashboard");

    } catch (err) {
      console.log(err);
      setError("Signup failed. Try again!");
    } finally {
      setLoading(false);
    }
  };

  // 🔵 GOOGLE LOGIN
  const googleLogin = () => {
    window.location.href =
      "http://127.0.0.1:8000/accounts/google/login/";
  };


  return (
    <div style={styles.container}>
      <div style={styles.card}>

        <h2>📝 Signup</h2>

        {error && <p style={styles.error}>{error}</p>}

        <input
          style={styles.input}
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          style={styles.input}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          style={{
            ...styles.signupBtn,
            opacity: loading ? 0.6 : 1,
          }}
          onClick={handleSignup}
          disabled={loading}
        >
          {loading ? "Creating..." : "Signup"}
        </button>

        <div style={styles.divider}>OR</div>

        <button onClick={googleLogin} style={styles.googleBtn}>
          🔵 Continue with Google
        </button>

      
        <p style={styles.bottomText}>
          Already have account? <a href="/">Login</a>
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
  },

  signupBtn: {
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
    marginTop: "8px",
    background: "#fff",
    color: "#000",
    border: "none",
    borderRadius: "10px",
    fontWeight: "bold",
    cursor: "pointer",
  },

  githubBtn: {
    width: "100%",
    padding: "12px",
    marginTop: "8px",
    background: "#2d2d2d",
    color: "white",
    border: "1px solid #444",
    borderRadius: "10px",
    cursor: "pointer",
  },

  divider: {
    margin: "12px 0",
    color: "#888",
    fontSize: "12px",
  },

  error: {
    color: "red",
    fontSize: "13px",
  },

  bottomText: {
    marginTop: "10px",
    color: "#aaa",
  },
};
export default Signup;