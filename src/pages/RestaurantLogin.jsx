import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/api";
import './css/Auth.css' 
import MailOutlineOutlinedIcon from '@mui/icons-material/MailOutlineOutlined';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import toast, { Toaster } from 'react-hot-toast';

export default function RestaurantLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const loginPromise = API.post("/restaurant_login", 
      { email, password }, 
      { withCredentials: true }
    );
    toast.promise(loginPromise, {
      loading: 'Establishing Secure Connection...',
      success: (res) => <b>Welcome back, Chef!</b>,
      error: (err) => <b>{err.response?.data?.message || "Login failed"}</b>,
    });

    try {
      await loginPromise;
      setTimeout(() => {
        navigate("/restaurant_dashboard");
      }, 1000);
    } catch (err) {
      console.error("Restaurant Login failed:", err);
    }
  };

  return (
    <div className="auth_page_wrapper">
      <Toaster position="top-right" />
      
      <div className="auth_card_premium">
        <div className="auth_header">
          <h1 className="auth_title">PARTNER</h1>
          <p className="auth_subtitle">Access your restaurant dashboard & live kitchen stats.</p>
        </div>

        <form onSubmit={handleLogin} className="auth_form">
          <div className="input_group_premium">
            <label>Restaurant Email</label>
            <div className="input_inner">
              <MailOutlineOutlinedIcon className="input_icon" />
              <input 
                type="email" 
                placeholder="chef@restaurant.com" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                required 
              />
            </div>
          </div>

          <div className="input_group_premium">
            <label>Secure Password</label>
            <div className="input_inner">
              <LockOpenOutlinedIcon className="input_icon" />
              <input 
                type="password" 
                placeholder="••••••••" 
                style={{ letterSpacing: '2px', fontWeight: 'bold' }}
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                required 
              />
            </div>
          </div>

          <button type="submit" className="auth_btn_primary">Access Dashboard</button>
        </form>
      </div>
    </div>
  );
}