import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import NorthWestRoundedIcon from '@mui/icons-material/NorthWestRounded';
import API from "../api/api";
import "./css/SearchBar.css";

const SearchBar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(-1); 
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    async function fetchRestaurants() {
      try {
        const res = await API.get("/restaurants");
        setRestaurants(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchRestaurants();
  }, []);

  const filteredRestaurants = restaurants.filter((r) =>
    r.name?.toLowerCase().includes(searchTerm?.toLowerCase() || "")
  );

  useEffect(() => {
    setSelectedIndex(-1);
  }, [searchTerm]);

  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsExpanded(false);
        setSearchTerm("");
      }
      
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsExpanded(true);
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, []);

  const handleKeyDown = (e) => {
    if (filteredRestaurants.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < filteredRestaurants.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === "Enter") {
      if (selectedIndex >= 0) {
        goToRestaurant(filteredRestaurants[selectedIndex]);
      }
    }
  };

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 100);
    }
  }, [isExpanded]);

  const goToRestaurant = (restaurant) => {
    navigate(`/restaurant/${restaurant.restaurant_id}`);
    setIsExpanded(false);
    setSearchTerm("");
    setSelectedIndex(-1);
  };

  return (
    <>
      <div className="search_trigger_pill" onClick={() => setIsExpanded(true)}>
        <div className="search_pill_inner">
          <SearchRoundedIcon className="pill_icon" />
          <span className="pill_text">Find your next favorite meal...</span>
        </div>
        <div className="pill_shortcut">⌘ K</div>
      </div>

      <div className={`search_overlay_premium ${isExpanded ? "active" : ""}`} onClick={() => setIsExpanded(false)}>
        <div 
          className={`search_modal_premium ${isExpanded ? "show" : ""}`} 
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mobile_drag_handle"></div>

          <div className="search_modal_header">
            <SearchRoundedIcon className="modal_search_icon" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search venues..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              className="premium_modal_input"
            />
            <button className="close_modal_btn" onClick={() => setIsExpanded(false)}>
              <CloseRoundedIcon />
            </button>
          </div>

          <div className="search_results_area">
            {!searchTerm ? (
              <div className="search_suggestions">
                <p className="suggestion_label">Quick Cravings</p>
                <div className="suggestion_tags">
                  <span onClick={() => setSearchTerm("Pizza")}>Pizza</span>
                  <span onClick={() => setSearchTerm("Dum")}>Dum</span>
                </div>
              </div>
            ) : (
              <div className="results_grid_premium">
                {filteredRestaurants.map((r, index) => (
                  <div 
                    key={r.restaurant_id} 
                    className={`result_item_premium ${selectedIndex === index ? "selected" : ""}`} 
                    onClick={() => goToRestaurant(r)}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    <div className="result_img_box">
                      <img src={r.image_url || "/placeholder.png"} alt={r.name} />
                    </div>
                    <div className="result_meta">
                      <h3>{r.name}</h3>
                      <div className="status_row">
                        <span className={`status_dot_small ${r.shop_status ? "open" : "closed"}`}></span>
                        <p>{r.shop_status ? "Open Now" : "Closed"}</p>
                      </div>
                    </div>
                    <NorthWestRoundedIcon className="result_arrow" />
                  </div>
                ))}
                
                {searchTerm && filteredRestaurants.length === 0 && (
                  <div className="no_results_premium">
                    <p>No results found for "{searchTerm}"</p>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="search_modal_footer">
             <div className="footer_hint"><span>ESC</span> to close</div>
             <div className="footer_hint"><span>↵</span> to select</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchBar;