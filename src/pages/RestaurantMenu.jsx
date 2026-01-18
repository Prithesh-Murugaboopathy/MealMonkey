import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import MenuModal from "../components/MenuModal";
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';
import './css/RestaurantMenu.css';

export default function RestaurantMenu({ setCartItems }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [menu, setMenu] = useState([]);
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);

  useEffect(() => {
    async function fetchMenu() {
      try {
        const menuRes = await axios.get("http://127.0.0.1:5000//menu", {
          params: { restaurant_id: id, available: true },
        });
        setMenu(menuRes.data);

        const restRes = await axios.get(`http://127.0.0.1:5000//restaurants/${id}`);
        setRestaurant(restRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchMenu();
  }, [id]);

  const handleItemClick = (item) => {
    if (restaurant && !restaurant.shop_status) {
      toast.error(`${restaurant.name} is currently closed.`, {
        style: {
          borderRadius: '12px',
          background: '#18181b',
          color: '#fff',
          border: '1px solid #ff4d4f'
        },
        icon: '🛑',
        duration: 4000,
      });
      return;
    }
    setSelectedFood(item);
    setModalOpen(true);
  };

  if (loading) return (
    <div className="menu_loading">
      <div className="spinner"></div>
      <p>Opening the menu...</p>
    </div>
  );

  return (
    <div className="menu_page_wrapper">
      <Toaster position="bottom-center" reverseOrder={false} />
      
      <div className="menu_container">
        <header className="restaurant_hero">
          <div className="top_nav_bar">
            <button className="back_button_premium" onClick={() => navigate("/restaurants")}>
              <ArrowBackIosNewRoundedIcon fontSize="small" /> Back
            </button>
          </div>

          <div className="hero_content">
            <h1 className="page_title_premium">
              {restaurant?.name}
            </h1>

            <div className="restaurant_info_pill">
              <span className={`status_indicator ${restaurant?.shop_status ? 'is_open' : 'is_closed'}`}>
                {restaurant?.shop_status ? "Open Now" : "Closed"}
              </span>
              <span className="divider">•</span>
              <span className="info_item">{menu.length} Items Available</span>
            </div>
          </div>
        </header>
        <div className={`menu_grid ${!restaurant?.shop_status ? 'shop_offline' : ''}`}>
          {menu.map((item) => (
            <div
              key={item.food_id}
              className="food_card_premium"
              onClick={() => handleItemClick(item)}
            >
              <div className="image_container">
                <img 
                  src={item.image_url || "/placeholder.png"} 
                  alt={item.name} 
                  className="food_image_main" 
                />
                {item.veg_nonveg && (
                  <div className={`diet_indicator ${item.veg_nonveg}`}>
                    <div className="dot"></div>
                  </div>
                )}
              </div>

              <div className="food_card_content">
                <div className="food_meta">
                  <h3 className="food_name_small">
                    {item.name.length > 20 ? item.name.slice(0, 18) + "..." : item.name}
                  </h3>
                  <p className="food_price_tag">₹{item.price}</p>
                </div>
                <p className="view_menu_hint">
                    {restaurant?.shop_status ? "Customize & Add +" : "Unavailable"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {modalOpen && selectedFood && (
        <MenuModal
          restaurant={restaurant}
          food={selectedFood}
          onClose={() => setModalOpen(false)}
          setCartItems={setCartItems}
        />
      )}
    </div>
  );
}