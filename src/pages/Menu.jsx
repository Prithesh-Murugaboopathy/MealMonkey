import React, { useEffect, useState } from "react";
import axios from "axios";
import './index.css'

export default function Menu() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [vegFilter, setVegFilter] = useState(""); // "veg" or "non-veg"
  const [priceOrder, setPriceOrder] = useState("asc");

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await axios.get("http://localhost:5000/menu/all", { withCredentials: true });
        let data = res.data;

        // Filter veg/non-veg
        if (vegFilter) data = data.filter(item => item.veg_nonveg === vegFilter);

        // Filter search
        if (search) data = data.filter(item => item.name.toLowerCase().includes(search.toLowerCase()));

        // Price sort
        data.sort((a, b) => priceOrder === "asc" ? a.price - b.price : b.price - a.price);

        // Random shuffle
        data = data.sort(() => Math.random() - 0.5);

        setItems(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, [search, vegFilter, priceOrder]);

  if (loading) return <p>Loading menu...</p>;

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Menu</h1>

      {/* Filters */}
      <div className="flex space-x-4 mb-4">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border p-2 rounded"
        />
        <select value={vegFilter} onChange={e => setVegFilter(e.target.value)} className="border p-2 rounded">
          <option value="">All</option>
          <option value="veg">Veg</option>
          <option value="non-veg">Non-Veg</option>
        </select>
        <select value={priceOrder} onChange={e => setPriceOrder(e.target.value)} className="border p-2 rounded">
          <option value="asc">Price Low → High</option>
          <option value="desc">Price High → Low</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {items.map(item => (
          <div key={item.food_id} className="border p-4 rounded shadow">
            <div className="image-square">
              <img
                src={item.image_url || "/food-placeholder.png"}
                alt={item.name}
              />
            </div>
            <h2 className="font-semibold">{item.name}</h2>
            <p>₹{item.price}</p>
            <p>{item.veg_nonveg}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
