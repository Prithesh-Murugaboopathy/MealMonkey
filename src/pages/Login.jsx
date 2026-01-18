import { useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/api";
import './css/Auth.css'
import MailOutlineOutlinedIcon from '@mui/icons-material/MailOutlineOutlined';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import toast, { Toaster } from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    const loginPromise = API.post("/user_login", { email, password });

    toast.promise(loginPromise, {
      loading: 'Authenticating...',
      success: (res) => <b>{res.data.message || "Welcome back!"}</b>,
      error: (err) => <b>{err.response?.data?.message || err.message}</b>,
    });

    try {
      const res = await loginPromise;
      if (res.data.message === "Login successful") {
        setTimeout(() => { window.location.href = "/"; }, 1000);
      }
    } catch (err) { console.error(err); }
  };

  return (
    <div className="auth_page_wrapper">
      <Toaster position="top-right" />
      <div className="auth_card_premium">
        <div className="auth_header">
          <h1 className="auth_title">LOGIN</h1>
          <p className="auth_subtitle">Enter your credentials.</p>
        </div>

        <form onSubmit={handleLogin} className="auth_form">
          <div className="input_group_premium">
            <label>Email Address</label>
            <div className="input_inner">
              <MailOutlineOutlinedIcon className="input_icon" />
              <input 
                type="email" 
                placeholder="name@example.com" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                required 
              />
            </div>
          </div>

          <div className="input_group_premium">
            <label>Password</label>
            <div className="input_inner">
              <LockOpenOutlinedIcon className="input_icon" />
              <input 
                type="password" 
                placeholder="••••••••" 
                style={{letterSpacing:'2px', fontWeight: 'bold'}}
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                required 
              />
            </div>
          </div>

          <button type="submit" className="auth_btn_primary">Login</button>
        </form>

        <div className="auth_footer">
          <p>New to the platform? <Link to="/register">Create Account</Link></p>
        </div>
      </div>
    </div>
  );
}