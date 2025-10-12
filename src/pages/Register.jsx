import { useState } from "react";
import API from "../api/api";
import './css/Register.css'
import MailOutlineOutlinedIcon from '@mui/icons-material/MailOutlineOutlined';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';

export default function UserRegister() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const res = await API.post("/register", { name, email, password, phone });
            alert(res.data.message);
            if (res.data.message === "User registered successfully") {
                window.location.href = "/login";
            }
        } catch (err) {
            if (err.response && err.response.data) {
                alert(err.response.data.message);
            } else {
                alert(err.message);
            }
        }
    };

    return (
        <form onSubmit={handleRegister} className="register_form">
            <div className="text_input">
                Email Address
                <div className="bottom">
                    <MailOutlineOutlinedIcon />
                    <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
            </div>
            <div className="password_input">
                Password
                <div className="bottom">
                    <LockOpenOutlinedIcon />
                    <input placeholder="●●●●" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                </div>
            </div>
            <div className="text_input">
                Name
                <div className="bottom">
                    <LockOpenOutlinedIcon />
                    <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
                </div>
            </div>
            <div className="text_input">
                Phone Number
                <div className="bottom">
                    <LockOpenOutlinedIcon />
                    <input placeholder="Phone" value={phone} onChange={e => setPhone(e.target.value)} required />
                </div>
            </div>
            <button type="submit" className="login_processor">Register</button>
        </form>
    );
}
