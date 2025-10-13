// ./pages/Restaurants.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './css/Restaurants.css'
import './index.css'

export default function Restaurants() {
  const navigate = useNavigate(); // <-- hook
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line no-unused-vars
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [menu, setMenu] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [menuLoading, setMenuLoading] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [searchTerm, setSearchTerm] = useState(""); // <-- add this at the top


  useEffect(() => {
    async function fetchRestaurants() {
      try {
        const res = await axios.get("https://flaskapiformealmonkey.onrender.com/restaurants");
        setRestaurants(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchRestaurants(); // call the async function
  }, []);

  
const filteredRestaurants = restaurants.filter(r =>
  r.name.toLowerCase().includes(searchTerm.toLowerCase())
);
 const goToRestaurant = (restaurant) => {
    navigate(`/restaurant/${restaurant.restaurant_id}`);
  };
  

  return (
    <div className="restaurants_page">
      <h1 className="page_title">Restaurants</h1>
      <div style={{ margin: "20px 0" }}>
        <input
          type="text"
          placeholder="Search Restaurants..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search_bar"
        />
        
      </div>

      {loading ? (
        <p className="replace_data">Loading...</p>
      ) : (
        <div className="restaurants_grp">
            {filteredRestaurants.map((r) => (
              <div
                key={r.restaurant_id}
                className="restaurant_card"
                onClick={() => goToRestaurant(r)}
              >
                <div className="image_container">
                  <img
                    src={r.image_url}
                    alt={r.name}
                    className="rest_image"
                  />
                </div>
                <h2 className="restaurant_name_in_page">{r.name}</h2>
                <p className="rest_status">Status: {r.shop_status ? "Open" : "Closed"}</p>
              </div>
            ))}

        </div>
        
      )}
    </div>
  );
}
