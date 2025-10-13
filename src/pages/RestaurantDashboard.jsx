// RestaurantDashboard.jsx
import React, { useState, useEffect } from "react";
import EditFoodModal from "../components/EditFoodModal";
import "../components/index.css";
import './css/RestDashboard.css'
import MenuModal from "../components/MenuModal";

export default function RestaurantDashboard({setCartItems}) {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [shopStatus, setShopStatus] = useState(true);

  const [editingItem, setEditingItem] = useState(null);

  const [restaurantImage, setRestaurantImage] = useState(null);
  const [restaurantImagePreview, setRestaurantImagePreview] = useState(null);
  const [restaurant] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null); // new state

  // 🔹 Add states for Add Food form
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [vegNonveg, setVegNonveg] = useState("veg");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // 🔹 Add states for filters
  const [searchTerm, setSearchTerm] = useState("");
  const [vegFilter, setVegFilter] = useState("");
  const [priceOrder, setPriceOrder] = useState("asc");
  

  useEffect(() => {
    const url = new URL("http://localhost:5000/restaurant_menu");
    url.searchParams.append("search", searchTerm);
    url.searchParams.append("veg", vegFilter);
    url.searchParams.append("price_order", priceOrder);

    fetch(url, { credentials: "include" })
      .then(res => res.json())
      .then(data => setMenu(data));
  }, [searchTerm, vegFilter, priceOrder]);

  useEffect(() => {
    fetch("http://localhost:5000/get_restaurant_profile", { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        if (data.image_url) setRestaurantImagePreview(data.image_url);
      });
  }, []);

  const fetchMenu = () => {
    setLoading(true);
    fetch("http://localhost:5000/restaurant_menu", { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized or fetch failed");
        return res.json();
      })
      .then((data) => {
        setMenu(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  useEffect(() => {
    fetch("http://localhost:5000/get_shop_status", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setShopStatus(data.status))
      .catch((err) => console.error(err));
  }, []);

  const handleEdit = (item) => {
    const mappedItem = { ...item, menu_id: item.menu_id || item.food_id };
    setEditingItem(mappedItem);
  };

  const handleDelete = async (menu_id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await fetch(`http://localhost:5000/delete_food/${menu_id}`, {
        method: "DELETE",
        credentials: "include",
      });
      fetchMenu();
    } catch {
      alert("Failed to delete food");
    }
  };

  const toggleAvailability = async (menu_id, currentStatus) => {
    try {
      await fetch(`http://localhost:5000/toggle_availability/${menu_id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ available: !currentStatus }),
      });
      fetchMenu();
    } catch {
      alert("Failed to update availability");
    }
  };

  // 🔹 Handle Add Food
  const handleAddFood = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("veg_nonveg", vegNonveg);
    if (imageFile) formData.append("image", imageFile);

    try {
      await fetch("http://localhost:5000/add_food", {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      setName("");
      setDescription("");
      setPrice("");
      setVegNonveg("veg");
      setImageFile(null);
      setImagePreview(null);
      fetchMenu();
    } catch {
      alert("Failed to add food");
    }
  };

  // 🔹 Handle Image Change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
      if (file) {
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
      }
    };

const handleRestaurantImageChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    setRestaurantImage(file);
    setRestaurantImagePreview(URL.createObjectURL(file));
  }
};

const handleUploadRestaurantImage = async () => {
  if (!restaurantImage) return;
  const formData = new FormData();
  formData.append("image", restaurantImage);

  try {
    const res = await fetch("http://localhost:5000/upload_restaurant_image", {
      method: "POST",
      body: formData,
      credentials: "include",
    });
    const data = await res.json();
    console.log("Response:", data);
    if (data.url) {
      setRestaurantImagePreview(data.url);
      alert("Upload success!");
    } else {
      alert(data.message || "Upload failed");
    }
  } catch (err) {
    console.error("Error uploading:", err);
    alert("Something went wrong");
  }
};


  // 🔹 Handle Logout
  const handleRestaurantLogout = async () => {
    try {
      await fetch("http://localhost:5000/restaurant_logout", {
        method: "POST",
        credentials: "include",
      });
      window.location.href = "/"; // redirect to login/home
    } catch {
      alert("Logout failed");
    }
  };

  if (loading) return <div>Loading menu...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="rest_dashboard">
      <h2 className="page_title">Hey Restaurant Manager,</h2>
      <h3>Restaurant Profile Image</h3>
      <div className="image_div">
        {restaurantImagePreview && (
          <img
            src={restaurantImagePreview}
            alt="Restaurant"
            className="rest_dashboard_image"
          />
        )}
        <div className="sub_div">
          <input type="file" accept="image/*" onChange={handleRestaurantImageChange} />
          <button onClick={handleUploadRestaurantImage}>Upload Image</button>
        </div>
      </div>
      

      <button
        onClick={handleRestaurantLogout}
        style={{ float: "right", marginBottom: "20px" }}
      >
        Logout
      </button>

      <div style={{ marginBottom: "20px" }}>
        <strong>Shop Status: </strong>
        <button
          onClick={async () => {
            try {
              const newStatus = !shopStatus;
              await fetch("http://localhost:5000/toggle_shop_status", {
                method: "PATCH",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
              });
              setShopStatus(newStatus);
            } catch {
              alert("Failed to toggle shop status");
            }
          }}
        >
          {shopStatus ? "Open" : "Closed"}
        </button>
      </div>

      <h3>Add Food</h3>
      <form onSubmit={handleAddFood}>
        <input
          type="text"
          placeholder="Food Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
        <label>Veg / Non-Veg</label>
        <select
          value={vegNonveg}
          onChange={(e) => setVegNonveg(e.target.value)}
          required
        >
          <option value="veg">Veg</option>
          <option value="non-veg">Non-Veg</option>
        </select>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        {imagePreview && (
          <div style={{ marginTop: "10px" }}>
            <p>Preview:</p>
            <img
              src={imagePreview}
              alt="Preview"
              style={{ width: "150px", height: "150px", objectFit: "cover" }}
            />
          </div>
        )}
        <button type="submit">Add Food</button>
      </form>

      <div style={{ margin: "20px 0" }}>
        <input
          type="text"
          placeholder="Search food..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <select
          value={vegFilter}
          onChange={(e) => setVegFilter(e.target.value)}
          style={{ marginRight: "10px" }}
        >
          <option value="">All</option>
          <option value="veg">Veg</option>
          <option value="non-veg">Non-Veg</option>
        </select>
        <select
          value={priceOrder}
          onChange={(e) => setPriceOrder(e.target.value)}
        >
          <option value="asc">Price Low → High</option>
          <option value="desc">Price High → Low</option>
        </select>
      </div>

      <div className="rest_menu_items">
        {menu.map((item) => (
          <div
            key={item.food_id}
            className="rest_menu_item"
            onClick={() => {
              setSelectedFood(item);
              setModalOpen(true);
            }}
          >
            <div className="image_square">
              <img src={item.image_url} alt={item.name} className="image" />
            </div>
            <div className="desc">
              <h2 className="rest_menu_item_name">
                {item.name.length > 17 
                ? item.name.slice(0, 17) + "..." 
                : item.name}
              </h2>
              <p className="rest_menu_item_desc">₹{item.price}</p>
              <button onClick={() => handleEdit(item)}>Edit</button>
              <button onClick={() => handleDelete(item.food_id)}>Delete</button>
              <button
                onClick={() => toggleAvailability(item.food_id, item.available)}
              >
                {item.available ? "Mark Unavailable" : "Mark Available"}
              </button>
            </div>
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

      {editingItem && (
        <EditFoodModal
          item={editingItem}
          onClose={() => setEditingItem(null)}
          onSave={fetchMenu}
        />
      )}
    </div>
  );
}
