import { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import API from "../api/api";
import './css/Auth.css'
import MailOutlineOutlinedIcon from '@mui/icons-material/MailOutlineOutlined';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import StorefrontRoundedIcon from '@mui/icons-material/StorefrontRounded';
import toast, { Toaster } from "react-hot-toast";

export default function RestaurantRegister() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const invite_code = searchParams.get("invite");

    const handleRegister = async (e) => {
        e.preventDefault();
        const registerPromise = API.post("/restaurant_register", 
            { invite_code, name, email, password },
            { headers: { "Content-Type": "application/json" } }
        );
        toast.promise(registerPromise, {
            loading: 'Validating Invite & Onboarding...',
            success: (res) => <b>Welcome to the Collection!</b>,
            error: (err) => <b>{err.response?.data?.message || "Onboarding failed"}</b>,
        });

        try {
            await registerPromise;
            setTimeout(() => {
                navigate("/restaurant_login");
            }, 1000);
        } catch (err) {
            console.error("Registration failed:", err);
        }
    };

    return (
        <div className="auth_page_wrapper ">
            <Toaster position="top-right" />
            <div className="auth_card_premium width_adjuster">
                <div className="auth_header">
                    <h1 className="auth_title">OPEN SHOP</h1>
                    <p className="auth_subtitle">
                        {invite_code 
                            ? "Invite confirmed. Establish your digital storefront." 
                            : "Join our curated collection of elite venues."}
                    </p>
                </div>

                <form onSubmit={handleRegister} className="auth_form grid_form">
                    <div className="input_group_premium" style={{ gridColumn: 'span 2' }}>
                        <label>Restaurant Name</label>
                        <div className="input_inner">
                            <StorefrontRoundedIcon className="input_icon" />
                            <input 
                                placeholder="What’s your restaurant called?" 
                                value={name} 
                                onChange={e => setName(e.target.value)} 
                                required 
                            />
                        </div>
                    </div>

                    <div className="input_group_premium">
                        <label>Business Email</label>
                        <div className="input_inner">
                            <MailOutlineOutlinedIcon className="input_icon" />
                            <input 
                                type="email" 
                                placeholder="admin@restaurant.com" 
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
                                style={{ letterSpacing: '2px' }}
                                value={password} 
                                onChange={e => setPassword(e.target.value)} 
                                required 
                            />
                        </div>
                    </div>

                    <button type="submit" className="auth_btn_primary">Establish Shop on Network</button>
                </form>

                <div className="auth_footer">
                    <p>Already a partner? <Link to="/restaurant_login">Partner Login</Link></p>
                </div>
            </div>
        </div>
    );
}