import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // <-- import this
import "./index.css";
import "./css/Menu.css";

export default function Menu() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [vegFilter, setVegFilter] = useState("");
  const [priceOrder, setPriceOrder] = useState("asc");
  const navigate = useNavigate(); // <-- create navigate hook

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await axios.get("http://localhost:5000/menu/all", { withCredentials: true });
        let data = res.data;

        if (vegFilter) data = data.filter(item => item.veg_nonveg === vegFilter);
        if (search) data = data.filter(item => item.name.toLowerCase().includes(search.toLowerCase()));
        data.sort((a, b) => (priceOrder === "asc" ? a.price - b.price : b.price - a.price));
        data = data.sort();

        setItems(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, [search, vegFilter, priceOrder]);

  if (loading) return <p className="replace_data">Loading menu...</p>;

  // 🧭 Function to navigate to restaurant page
  const goToRestaurant = (restaurantId) => {
    navigate(`/restaurant/${restaurantId}`);
  };

  return (
    <div className="menu_page">
      <h1 className="page_title">Menu</h1>

      {/* Filters */}
      <div className="filter_opt">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search_bar"
        />
        <div className="seperate">
          <select value={vegFilter} onChange={(e) => setVegFilter(e.target.value)} className="option">
            <option value="">All</option>
            <option value="veg">Veg</option>
            <option value="non-veg">Non-Veg</option>
          </select>
          &nbsp;
          &nbsp;
          <select value={priceOrder} onChange={(e) => setPriceOrder(e.target.value)} className="option">
            <option value="asc">Price Low → High</option>
            <option value="desc">Price High → Low</option>
          </select>
        </div>
      </div>

      {/* Food Grid */}
      <div className="menu_items">
        {items.map((item) => (
          <div
            key={item.food_id}
            className="menu"
            onClick={() => goToRestaurant(item.restaurant_id)} // 👈 redirect on click
          >
            <div className="image_square">
              <img
                src={item.image_url}
                alt={item.name}
                className="image"
              />
            </div>
            <h2 className="restaurant_name">
              {item.restaurant_name.length > 23 
                ? item.restaurant_name.slice(0, 23) + "..." 
                : item.restaurant_name}
            </h2>
            <div className="bottom_part">
              <h3 className="font-semibold">
                {item.name.length > 35 
                ? item.name.slice(0, 25) + "..." 
                : item.name}
              </h3>
              <p>₹{item.price}</p>
            </div>
          </div>
          
        ))}
      </div>
    </div>
  );
}
