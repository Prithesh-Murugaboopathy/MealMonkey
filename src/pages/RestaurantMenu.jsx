import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import MenuModal from "../components/MenuModal";
import "./index.css";
import './css/RestaurantMenu.css'

export default function RestaurantMenu({setCartItems}) {
  const { id } = useParams();
  const [menu, setMenu] = useState([]);
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null); // new state

  useEffect(() => {
    async function fetchMenu() {
      try {
        const menuRes = await axios.get("https://flaskapiformealmonkey.onrender.com/menu", {
          params: { restaurant_id: id, available: true },
        });
        setMenu(menuRes.data);

        const restRes = await axios.get(`https://flaskapiformealmonkey.onrender.com/restaurants/${id}`);
        setRestaurant(restRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchMenu();
  }, [id]);

  if (loading) return <p className="replace_data">Loading...</p>;

  return (
    <div className="rest_menu">
      <h1 className="rest_name">{restaurant?.name}</h1>

      <div className="rest_menu_items">
        {menu.map((item) => {
          const itemName = item.name || "Unnamed";
          const itemImage = item.image_url || "/placeholder.png";

          return (
            <div
              key={item.food_id}
              className="rest_menu_item"
              onClick={() => {
                setSelectedFood(item);
                setModalOpen(true);
              }}
            >
      <div className="image_square">
        <img src={itemImage} alt={itemName} className="image" />
      </div>
      <div className="desc">
        <h2 className="rest_menu_item_name">
          {itemName.length > 17 ? itemName.slice(0, 17) + "..." : itemName}
        </h2>
        <p className="rest_menu_item_desc">₹{item.price || "0"}</p>
      </div>
    </div>
  );
})}

      </div>

      {/* Modal */}
      {modalOpen && selectedFood && (
        <MenuModal
          restaurant={restaurant}
          food={selectedFood}      // pass only the clicked item
          onClose={() => setModalOpen(false)}
          setCartItems={setCartItems}
        />
      )}
      
    </div>
  );
}
