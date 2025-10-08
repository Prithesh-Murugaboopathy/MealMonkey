import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import MenuModal from "../components/MenuModal";

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
        const menuRes = await axios.get("http://localhost:5000/menu", {
          params: { restaurant_id: id, available: true },
        });
        setMenu(menuRes.data);

        const restRes = await axios.get(`http://localhost:5000/restaurants/${id}`);
        setRestaurant(restRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchMenu();
  }, [id]);

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{restaurant?.name}</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {menu.map((item) => (
          <div
            key={item.food_id}
            className="border p-2 rounded cursor-pointer hover:shadow-lg"
            onClick={() => {
              setSelectedFood(item);
              setModalOpen(true);
            }}
          >
            <img src={item.image_url} alt={item.name} className="w-full h-32 object-cover rounded" />
            <h2 className="font-semibold mt-2">{item.name}</h2>
            <p>₹{item.price}</p>
          </div>
        ))}
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
