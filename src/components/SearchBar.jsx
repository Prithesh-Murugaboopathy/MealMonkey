import React, { useEffect, useState, useRef } from "react";
import "./css/SearchBar.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

const SearchBar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const inputRef = useRef(null);

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

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  const filteredRestaurants = restaurants.filter((r) =>
    r.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const goToRestaurant = (restaurant) => {
    navigate(`/restaurant/${restaurant.restaurant_id}`);
    setIsExpanded(false);
    setSearchTerm("");
  };

  return (
    <>
      {/* Always-visible search button */}
      <div
        className="search-button"
        onClick={() => setIsExpanded(true)}
      >
        <SearchRoundedIcon style={{ marginLeft: "10px" }} />
        <hr style={{ height: "25px", border: "1px solid #045427"}} />
        <span>Find Restaurants</span>
      </div>

      {/* Overlay + Modal */}
      <div className={`overlay ${isExpanded ? "active" : ""}`} onClick={() => setIsExpanded(false)}></div>

      <div className={`search-modal ${isExpanded ? "show" : ""}`}>
        <div className="top">
          <div className="search_fnc">
            <SearchRoundedIcon />
            &nbsp;
            &nbsp;
            &nbsp;
            <input
              ref={inputRef}
              type="text"
              placeholder="Search Restaurants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <button onClick={() => setIsExpanded(false)}><CloseRoundedIcon /></button>
        </div>

        {searchTerm && !loading && (
          <div className={`results-container slide-up ${filteredRestaurants.length ? "show" : ""}`}>
            {filteredRestaurants.length > 0 ? (
              filteredRestaurants.map((r) => (
                <div
                  key={r.restaurant_id}
                  className="result-card"
                  onClick={() => goToRestaurant(r)}
                >
                  <img
                    src={r.image_url || "/placeholder.png"}
                    alt={r.name}
                    className="result-img"
                  />
                  <div className="result-info">
                    <h2>{r.name}</h2>
                    <p>Status: {r.shop_status ? "Open" : "Closed"}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-results">No results found.</p>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default SearchBar;
