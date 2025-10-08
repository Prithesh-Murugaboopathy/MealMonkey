import { useState } from "react";
import API from "../api/api";

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
        <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", width: "300px", margin: "50px auto" }}>
            <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} required style={{ marginBottom: "10px", padding: "8px" }} />
            <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required style={{ marginBottom: "10px", padding: "8px" }} />
            <input placeholder="Phone" value={phone} onChange={e => setPhone(e.target.value)} required style={{ marginBottom: "10px", padding: "8px" }} />
            <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required style={{ marginBottom: "10px", padding: "8px" }} />
            <button type="submit" style={{ padding: "10px", cursor: "pointer" }}>Register</button>
        </form>
    );
}
