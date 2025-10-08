// ./pages/Restaurants.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Restaurants</h1>
      <div style={{ margin: "20px 0" }}>
        <input
          type="text"
          placeholder="Search Restaurants..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredRestaurants.map((r) => (
              <div
                key={r.restaurant_id}
                className="border rounded shadow p-4 cursor-pointer hover:shadow-lg"
                onClick={() => goToRestaurant(r)}
              >
                <img
                  src={r.image_url || "/placeholder.png"}
                  alt={r.name}
                  className="w-full h-32 object-cover rounded mb-2"
                />
                <h2 className="text-xl font-semibold">{r.name}</h2>
                <p>Status: {r.shop_status ? "Open" : "Closed"}</p>
              </div>
            ))}

        </div>
        
      )}

      {/* Menu Modal
      {selectedRestaurant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start pt-20 z-50">
          <div className="bg-white w-full max-w-3xl p-4 rounded shadow-lg overflow-y-auto max-h-[80vh]">
            <button
              className="mb-4 px-4 py-2 bg-red-500 text-white rounded"
              onClick={() => setSelectedRestaurant(null)}
            >
              Close
            </button>
            <h2 className="text-2xl font-bold mb-4">{selectedRestaurant.name} Menu</h2>
            {menuLoading ? (
              <p>Loading menu...</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {menu.map((item) => (
                  <div key={item.food_id} className="border rounded p-2 flex flex-col">
                    <img src={item.image_url || "/food-placeholder.png"} alt={item.name} className="h-32 object-cover mb-2 rounded"/>
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm">{item.description}</p>
                    <p className="font-bold">₹{item.price}</p>
                    <button className="mt-auto bg-green-500 text-white rounded px-2 py-1">
                      Add to Cart
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )} */}
    </div>
  );
}
