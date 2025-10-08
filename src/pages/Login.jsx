import { useState } from "react";
import API from "../api/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/user_login", { email, password });
      alert(res.data.message);

      if (res.data.message === "Login successful") {
        // normal users go to home, NOT restaurant dashboard
        window.location.href = "/";
      }
    } catch (err) {
      if (err.response && err.response.data) alert(err.response.data.message);
      else alert(err.message);
    }
  };

  return (
    <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", width: "300px", margin: "50px auto" }}>
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required style={{ marginBottom: "10px", padding: "8px" }} />
      <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required style={{ marginBottom: "10px", padding: "8px" }} />
      <button type="submit" style={{ padding: "10px", cursor: "pointer" }}>Login</button>
    </form>
  );
}
