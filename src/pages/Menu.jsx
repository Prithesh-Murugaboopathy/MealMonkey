import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import "./css/Menu.css";
import API from "../api/api";
const PremiumSelect = ({ value, options, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className="custom_select_container" ref={dropdownRef}>
      <div className={`select_trigger ${isOpen ? 'active' : ''}`} onClick={() => setIsOpen(!isOpen)}>
        <span>{selectedOption ? selectedOption.label : placeholder}</span>
        <KeyboardArrowDownRoundedIcon className={`arrow_icon ${isOpen ? 'rotate' : ''}`} />
      </div>

      {isOpen && (
        <div className="options_list">
          {options.map((opt) => (
            <div 
              key={opt.value} 
              className={`option_item ${value === opt.value ? 'selected' : ''}`}
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function Menu() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [vegFilter, setVegFilter] = useState("");
  const [priceOrder, setPriceOrder] = useState("asc");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await API.get("/menu/all");
        let data = res.data;

        if (vegFilter) data = data.filter(item => item.veg_nonveg === vegFilter);
        if (search) data = data.filter(item => item.name.toLowerCase().includes(search.toLowerCase()));
        
        data.sort((a, b) => (priceOrder === "asc" ? a.price - b.price : b.price - a.price));
        setItems(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, [search, vegFilter, priceOrder]);

  const goToRestaurant = (restaurantId) => {
    navigate(`/restaurant/${restaurantId}`);
  };

  if (loading) return (
    <div className="menu_loading">
      <div className="spinner"></div>
      <p>Curating the best dishes for you...</p>
    </div>
  );

  return (
    <div className="menu_page_wrapper">
      <div className="menu_container">
        <header className="menu_header">
          <h1 className="page_title_premium">Our Menu</h1>
          <p className="subtitle">Discover delicious meals from top-rated restaurants</p>
        </header>

        <div className="filter_container_pill">
          <div className="search_wrapper">
            <SearchRoundedIcon className="search_icon" />
            <input
              type="text"
              placeholder="Search for dishes or cravings..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="premium_search_input"
            />
          </div>
          
          <div className="filter_group">
            <PremiumSelect 
              value={vegFilter} 
              onChange={setVegFilter}
              placeholder="All Cuisines"
              options={[
                { label: "All Cuisines", value: "" },
                { label: "Pure Veg", value: "veg" },
                { label: "Non-Veg", value: "non-veg" }
              ]}
            />
            <PremiumSelect 
              value={priceOrder} 
              onChange={setPriceOrder}
              placeholder="Sort By"
              options={[
                { label: "Price: Low to High", value: "asc" },
                { label: "Price: High to Low", value: "desc" }
              ]}
            />
          </div>
        </div>

        <div className="menu_grid">
          {items.map((item) => (
            <div key={item.food_id} className="food_card_premium" onClick={() => goToRestaurant(item.restaurant_id)}>
              <div className="image_container">
                <img src={item.image_url} alt={item.name} className="food_image_main" />
                <div className={`diet_indicator ${item.veg_nonveg}`}>
                   <div className="dot"></div>
                </div>
              </div>
              <div className="food_card_content">
                <h2 className="res_name_small">{item.restaurant_name}</h2>
                <div className="food_meta">
                  <h3 className="food_name_small">{item.name}</h3>
                  <p className="food_price_tag">₹{item.price}</p>
                </div>
                <div className="view_menu_hint">View Restaurant →</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}