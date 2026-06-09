import { useParams } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

function ResetPassword() {
  const { uid, token } = useParams();
  const [password, setPassword] = useState("");

  const handleReset = async () => {
    await axios.post("http://127.0.0.1:8000/api/auth/password/reset/confirm/", {
      uid,
      token,
      new_password1: password,
      new_password2: password,
    });

    alert("Password reset successful ✔");
  };

  return (
    <div>
      <h2>Reset Password</h2>
      <input
        type="password"
        placeholder="New Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleReset}>Reset</button>
    </div>
  );
}

export default ResetPassword;