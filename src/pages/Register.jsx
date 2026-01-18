import { useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/api";
import './css/Auth.css'
import MailOutlineOutlinedIcon from '@mui/icons-material/MailOutlineOutlined';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import toast, { Toaster } from "react-hot-toast";

export default function UserRegister() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");

    const handleRegister = async (e) => {
        e.preventDefault();
        const registerPromise = API.post("/register", { name, email, password, phone });
        
        toast.promise(registerPromise, {
            loading: 'Creating Profile...',
            success: (res) => <b>Registration Complete!</b>,
            error: (err) => <b>{err.response?.data?.message || err.message}</b>,
        });

        try {
          const res = await registerPromise;
          if (res.data.message === "User registered successfully") {
            setTimeout(() => { window.location.href = "/"; }, 1000);
          }
        } catch (err) { console.error(err); }
    };

    return (
        <div className="auth_page_wrapper">
            <Toaster position="top-right" />
            <div className="auth_card_premium register_height">
                <div className="auth_header">
                    <h1 className="auth_title">REGISTER</h1>
                    <p className="auth_subtitle">Join us in the gourmet circle.</p>
                </div>

                <form onSubmit={handleRegister} className="auth_form grid_form">
                    <div className="input_group_premium">
                        <label>Full Name</label>
                        <div className="input_inner">
                            <PersonOutlineOutlinedIcon className="input_icon" />
                            <input placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} required />
                        </div>
                    </div>

                    <div className="input_group_premium">
                        <label>Email Address</label>
                        <div className="input_inner">
                            <MailOutlineOutlinedIcon className="input_icon" />
                            <input type="email" placeholder="user@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
                        </div>
                    </div>

                    <div className="input_group_premium">
                        <label>Phone Number</label>
                        <div className="input_inner">
                            <PhoneOutlinedIcon className="input_icon" />
                            <input 
                              placeholder="+91" 
                              type="number"  
                              value={phone} 
                              onChange={e => {
                                if (e.target.value.length <= 10) {
                                  setPhone(e.target.value);
                                }
                              }} 
                              required 
                            />
                        </div>
                    </div>

                    <div className="input_group_premium">
                        <label>Secure Password</label>
                        <div className="input_inner">
                            <LockOpenOutlinedIcon className="input_icon" />
                            <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
                        </div>
                    </div>

                    <button type="submit" className="auth_btn_primary">Register</button>
                </form>

                <div className="auth_footer">
                    <p>Already a member? <Link to="/login">Sign In</Link></p>
                </div>
            </div>
        </div>
    );
}