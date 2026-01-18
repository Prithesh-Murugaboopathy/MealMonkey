import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import './css/Restaurants.css';

export default function Restaurants() {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchRestaurants() {
      try {
        const res = await axios.get("http://127.0.0.1:5000//restaurants");
        setRestaurants(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchRestaurants();
  }, []);

  const filteredRestaurants = restaurants.filter(r =>
    r.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const goToRestaurant = (restaurantId) => {
    navigate(`/restaurant/${restaurantId}`);
  };

  if (loading) return (
    <div className="menu_loading">
      <div className="spinner"></div>
      <p>Finding the best spots for you...</p>
    </div>
  );

  return (
    <div className="menu_page_wrapper">
      <div className="menu_container">
        
        <header className="menu_header">
          <h1 className="page_title_premium">Restaurants</h1>
          <p className="subtitle">Explore top-rated eateries delivering to your doorstep</p>
        </header>
        <div className="filter_container_pill restaurant_search_pill">
          <div className="search_wrapper">
            <SearchRoundedIcon className="search_icon" />
            <input
              type="text"
              placeholder="Search for a restaurant..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="premium_search_input"
            />
          </div>
          <div className="filter_group">
             <span className="results_count">{filteredRestaurants.length} Places Found</span>
          </div>
        </div>
        <div className="menu_grid">
          {filteredRestaurants.map((r) => (
            <div
              key={r.restaurant_id}
              className="food_card_premium"
              onClick={() => goToRestaurant(r.restaurant_id)}
            >
              <div className="image_container">
                <img
                  src={r.image_url}
                  alt={r.name}
                  className="food_image_main"
                />
                <div className={`status_badge ${r.shop_status ? "open" : "closed"}`}>
                  {r.shop_status ? "Open Now" : "Closed"}
                </div>
              </div>

              <div className="food_card_content">
                <div className="res_header_row">
                  <h3 className="food_name_small">{r.name}</h3>
                  <div className="dot_indicator" style={{background: r.shop_status ? '#22c55e' : '#ff4d4f'}}></div>
                </div>
                <p className="view_menu_hint">View Full Menu →</p>
              </div>
            </div>
          ))}
        </div>

        {filteredRestaurants.length === 0 && (
          <div className="no_results">
            <h3>No restaurants match your search</h3>
            <p>Try searching for a different name or browse the list.</p>
          </div>
        )}
      </div>
    </div>
  );
}