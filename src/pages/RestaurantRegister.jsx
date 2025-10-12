import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import API from "../api/api";
import './css/Register.css'
import MailOutlineOutlinedIcon from '@mui/icons-material/MailOutlineOutlined';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';

export default function RestaurantRegister() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const invite_code = searchParams.get("invite");

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const res = await API.post("/restaurant_register", 
                { invite_code, name, email, password },
                { headers: { "Content-Type": "application/json" } }
            );


            alert(res.data.message);
            navigate("/restaurant_login");
        } catch (err) {
            alert(err.response?.data?.message || "Registration failed");
        }
    };

    return (
        <form onSubmit={handleRegister} className="register_form">
            <div className="text_input">
                Restaurant Name
                <div className="bottom">
                    <MailOutlineOutlinedIcon />
                    <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
                </div>
            </div>
            <div className="text_input">
                Restaurant Email Address
                <div className="bottom">
                    <MailOutlineOutlinedIcon />
                    <input placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
            </div>
            <div className="password_input">
                Restaurant Password
                <div className="bottom">
                    <LockOpenOutlinedIcon />
                    <input placeholder="●●●●" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                </div>
            </div>
            <button type="submit" className="login_processor">Register</button>
        </form>
    );
}
