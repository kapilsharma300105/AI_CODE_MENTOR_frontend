import { useState } from "react";
import axios from "axios";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      alert("Email is required");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "http://127.0.0.1:8000/api/auth/password/reset/",
        {
          email: email.trim(),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      alert("Reset link sent successfully ✔ Check your email");
      setEmail("");

      console.log("Response:", res.data);
    } // AFTER (replace with this temporarily)
catch (err) {
      console.log("Full error:", err);
      console.log("Response data:", err.response?.data);
      console.log("Status:", err.response?.status);
      console.log("Message:", err.message);

      const message =
        err.response?.data?.email?.[0] ||
        err.response?.data?.detail ||
        "Failed to send reset link";

     

      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main">
      <div className="card">
        <h4>Forgot Password</h4>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      </div>
    </div>
  );
  } 

export default ForgotPassword;