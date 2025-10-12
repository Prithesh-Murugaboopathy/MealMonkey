import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import './css/Login.css'
import MailOutlineOutlinedIcon from '@mui/icons-material/MailOutlineOutlined';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';

export default function RestaurantLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await API.post("/restaurant_login", { email, password }, { withCredentials: true });
      navigate("/restaurant_dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
      <form onSubmit={handleLogin} className="login_form">
        <div className="email_input">
          Restaurant Email Address
          <div className="bottom">
            <MailOutlineOutlinedIcon />  
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="password_input">
        Restaurant Password
        <div className="bottom">
          <LockOpenOutlinedIcon />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        </div>
        </div>
        <button type="submit" className="login_processor">Login</button>
      </form>
  );
}
