import { useState } from "react";
import API from "../api/api";
import './css/Login.css'
import MailOutlineOutlinedIcon from '@mui/icons-material/MailOutlineOutlined';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import CircleRoundedIcon from '@mui/icons-material/CircleRounded';

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
    <form onSubmit={handleLogin} className="login_form">
      <div className="email_input">
        Email Address
        <div className="bottom">
          <MailOutlineOutlinedIcon />  
          <input placeholder="example@gmail.com" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
      </div>
      <div className="password_input">
        Password
        <div className="bottom">
          <LockOpenOutlinedIcon />
          <input placeholder="●●●●" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
      </div>
      <button type="submit" className="login_processor">Login</button>
    </form>
  );
}