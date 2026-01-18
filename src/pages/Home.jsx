import React from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import ElectricBoltRoundedIcon from '@mui/icons-material/ElectricBoltRounded';
import ShieldCheckeredRoundedIcon from '@mui/icons-material/ShieldMoonRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import RestaurantMenuRoundedIcon from '@mui/icons-material/RestaurantMenuRounded';
import CallMadeRoundedIcon from '@mui/icons-material/CallMadeRounded';
import "./css/Home.css";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="bento_home_wrapper">
      <section className="bento_hero">
        <div className="hero_status_bar">
          <span className="live_ping"></span> 
          SYSTEM STATUS: <span className="green_text">OPERATIONAL • 6 VENUES ONLINE</span>
        </div>
        <h1 className="bento_main_title">
          TASTE <br /> 
          <span>WITHOUT</span> <br /> 
          LIMITS.
        </h1>
        <div className="hero_search_full">
          <SearchBar />
        </div>
      </section>
      <section className="bento_grid_section">
        <div className="bento_grid">
          <div className="bento_card tall bg_matte">
            <ElectricBoltRoundedIcon className="bento_icon_large" />
            <h2>30 Min <br/> Threshold</h2>
            <p>Our proprietary routing engine ensures your meal never spends more than 18 minutes in transit.</p>
            <div className="card_footer">HYPER-LOCAL SPEED</div>
          </div>
          <div className="bento_card wide bg_green">
            <div className="stat_unit">
              <h3>6</h3>
              <p>PARTNERED VENUES</p>
            </div>
            <div className="stat_unit">
              <h3>18</h3>
              <p>SIGNATURE DISHES</p>
            </div>
            <div className="stat_unit">
              <h3>24/7</h3>
              <p>HELP DESK</p>
            </div>
          </div>

          <div className="bento_card small bg_white" onClick={() => navigate('/menu')}>
            <RestaurantMenuRoundedIcon className="bento_icon_mid" />
            <h4>Browse Menu</h4>
            <CallMadeRoundedIcon className="arrow_top_right" />
          </div>
          <div className="bento_card small bg_matte" onClick={() => navigate('/restaurants')}>
            <GroupsRoundedIcon className="bento_icon_mid green_text" />
            <h4>Explore Venues</h4>
            <CallMadeRoundedIcon className="arrow_top_right" />
          </div>
          <div className="bento_card wide_alt bg_matte">
            <div className="benefit_header">
              <ShieldCheckeredRoundedIcon className="green_text" />
              <span>INTELLIGENT DESIGN</span>
            </div>
            <h3>More than just an ordering tool—it’s a high-fidelity culinary dashboard designed for the modern connoisseur who values digital precision.</h3>
          </div>

        </div>
      </section>
      <div className="bento_marquee">
        <div className="marquee_content">
          <span>PIZZA BIRIYANI GARLIC BREAD CHICKEN SANDWICH PANEER SAUSAGE </span>
          <span>PIZZA BIRIYANI GARLIC BREAD CHICKEN SANDWICH PANEER SAUSAGE </span>
        </div>
      </div>
      <section className="bento_cta">
        <div className="cta_content">
          <h2>Ready to <span className="green_text">Begin</span>?</h2>
          <button className="bento_btn_primary" onClick={() => navigate('/menu')}>
            Start Exploring
          </button>
        </div>
      </section>
      <footer className="bento_footer">
        <div className="footer_left">MEAL MONKEY<span>.</span></div>
        <div className="footer_right">© Prithesh M & Team | 2025 ALL RIGHTS RESERVED</div>
      </footer>
    </div>
  );
}