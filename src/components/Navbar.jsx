import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./css/Navbar.css";
import API from "../api/api";

export default function Navbar() {
  const [user, setUser] = useState({ name: "", avatar_url: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get("/get_user_name",);


        // extract only first name
        const firstName = res.data.user_name
          ? res.data.user_name.split(" ")[0]
          : "";

        setUser({
          name: firstName,
          avatar_url: res.data.avatar_url,
        });
      } catch (err) {
        setUser(null); // user not logged in
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await API.post("/logout");
      setUser(null);
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <div className="navbar">
      <div className="logo">
        Meal Monkey<span style={{ color: "#f75326" }}>.</span>
      </div>

      <div className="nav_links">
        <Link to="/menu">Menu</Link>
        <Link to="/orders">Orders</Link>
        <Link to="/restaurants">Restaurants</Link>
        <Link to="/cart">Cart</Link>
      </div>

      <div className="creds">
        {!loading && (
          <div className="user_section">
            {user ? (
              <button onClick={handleLogout} className="login_creds">
                <img
                  src={user.avatar_url || "/placeholder.png"}
                  className="avatar_image"
                  style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                />
                <span className="userName">{user.name}</span>
              </button>
            ) : (
              <div className="login_btn">
                <Link to="/login">
                  <button className="login">Login</button>
                </Link>
                <Link to="/register">
                  <button className="signup">Register</button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
