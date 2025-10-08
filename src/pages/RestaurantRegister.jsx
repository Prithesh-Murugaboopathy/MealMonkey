import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import API from "../api/api";

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
        <div style={{ maxWidth: "400px", margin: "50px auto" }}>
            <h2>Restaurant Registration</h2>
            <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column" }}>
                <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
                <input placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                <button type="submit">Register</button>
            </form>
        </div>
    );
}
