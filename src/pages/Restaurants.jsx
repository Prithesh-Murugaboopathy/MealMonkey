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
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [menu, setMenu] = useState([]);
  const [menuLoading, setMenuLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // <-- add this at the top
  const [vegFilter, setVegFilter] = useState("");   // optional if you want veg/non-veg filter
  const [priceOrder, setPriceOrder] = useState("asc"); // optional if you want price sort


  useEffect(() => {
    async function fetchRestaurants() {
      try {
        const res = await axios.get("http://localhost:5000/restaurants");
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


const openRestaurantMenu = async (restaurant) => {
  setSelectedRestaurant(restaurant);
  setMenuLoading(true);
  try {
    const res = await axios.get("http://localhost:5000/restaurant_menu", {
      params: { 
        restaurant_id: restaurant.restaurant_id,
        available: true, // only show available items
        veg: "veg", // optional filter
        search: searchTerm, // optional
        price_order: "asc"
      }
    });
    setMenu(res.data);
  } catch (err) {
    console.error(err);
  } finally {
    setMenuLoading(false);
  }
};
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
