import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import API from "../api/api";
import "./css/Navbar.css";
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

export default function Navbar() {
  const [user, setUser] = useState({ name: "", avatar_url: "" });
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get("/get_user_name");
        const firstName = res.data.user_name ? res.data.user_name.split(" ")[0] : "";
        setUser({ name: firstName, avatar_url: res.data.avatar_url });
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleProfileClick = (e) => {
    if (e) e.stopPropagation();
    if (showLogoutModal) return;

    if (window.innerWidth > 900) {
      if (user) setShowLogoutModal(true);
    } else {
      setIsMenuOpen(!isMenuOpen);
    }
  };

  const handleLogout = async (e) => {
    if (e) e.stopPropagation();
    try {
      await API.post("/logout");
      setUser(null);
      setShowLogoutModal(false);
      setIsMenuOpen(false); 
      window.location.href = "/login";
    } catch (err) {
      console.error("Logout failed", err);
    }
  };
  const openLogoutFromMobile = (e) => {
    e.stopPropagation(); 
    setIsMenuOpen(false);
    setShowLogoutModal(true);
  };
  return (
  <nav className="navbar_container" ref={dropdownRef}>
      {isMenuOpen && (
        <div 
          className="mobile_menu_backdrop" 
          onClick={(e) => {
            e.stopPropagation();
            setIsMenuOpen(false);
          }}
        ></div>
      )}

      <div className="navbar_main">
        <Link to={'/'} className="logo">
          Meal Monkey<span>.</span>
        </Link>
        
        <div className="desktop_links">
          <Link to="/menu">Menu</Link>
          <Link to="/orders">Orders</Link>
          <Link to="/restaurants">Restaurants</Link>
          <Link to="/cart">Cart</Link>
        </div>

        <div className="creds">
          {!loading && (
            <div className="user_section_logic">
              {user ? (
                <div className="user_trigger" onClick={handleProfileClick}>
                  <div className="avatar_wrapper">
                    <img src={user.avatar_url || "/placeholder.png"} alt="avatar" className="avatar_img" />
                    <span className="status_dot"></span>
                  </div>
                  <span className="userName_desktop">{user.name}</span>
                </div>
              ) : (
                <>
                  <div className="desktop_auth_btns">
                    <Link to="/login" className="login_text">Login</Link>
                    <Link to="/register" className="register_btn_pill">Register</Link>
                  </div>
                  <div className="mobile_anon_trigger" onClick={handleProfileClick}>
                    <AccountCircleRoundedIcon className="anon_icon" />
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        <div className={`premium_dropdown ${isMenuOpen ? "active" : ""}`} onClick={(e) => e.stopPropagation()}>
          <div className="dropdown_header">{user ? `Hello, ${user.name}` : "Welcome Guest"}</div>
          <div className="dropdown_links">
            <Link to="/menu">Explore Menu</Link>
            <Link to="/restaurants">Venues</Link>
            <Link to="/orders">Track Orders</Link>
            <Link to="/cart">My Basket</Link>
          </div>
          <div className="dropdown_footer">
            {user ? (
              <button onClick={openLogoutFromMobile} className="logout_btn">
                <LogoutRoundedIcon fontSize="small" /> Logout
              </button>
            ) : (
              <div className="auth_actions_mobile">
                <Link to="/login" className="login_btn_drop">Login</Link>
                <Link to="/register" className="register_btn_drop">Register</Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {showLogoutModal && (
        <div className="modal_overlay fade_in" onClick={() => setShowLogoutModal(false)}>
          <div className="logout_modal_card slide_up" onClick={(e) => e.stopPropagation()}>
              <div className="logout_icon_box"><LogoutRoundedIcon /></div>
              <h2>Sign Out?</h2>
              <p>Are you sure you want to end your session?</p>
              <div className="logout_modal_actions">
                <button className="btn_cancel" onClick={(e) => { e.stopPropagation(); setShowLogoutModal(false); }}>Cancel</button>
                <button className="btn_confirm_logout" onClick={handleLogout}>Logout</button>
              </div>
            </div>
        </div>
      )}
    </nav>
);
}