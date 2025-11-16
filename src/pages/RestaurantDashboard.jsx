// RestaurantDashboard.jsx
import React, { useState, useEffect, useRef } from "react";
import EditFoodModal from "../components/EditFoodModal";
import "../components/index.css";
import './css/RestDashboard.css'
import MenuModal from "../components/MenuModal";

export default function RestaurantDashboard({setCartItems}) {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [shopStatus, setShopStatus] = useState(true);
  const fileInputRef = useRef(null);

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
  setLoading(true);

  const url = new URL("https://flaskapiformealmonkey.onrender.com/restaurant_menu");
  url.searchParams.append("search", searchTerm);
  url.searchParams.append("veg", vegFilter);
  url.searchParams.append("price_order", priceOrder);

  fetch(url, { credentials: "include" })
    .then(res => res.json())
    .then(data => {
      if (!Array.isArray(data.menu)) {
        console.error("Menu NOT array:", data);
        setMenu([]);
      } else {
        setMenu(data.menu);
      }
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setError("Failed to load menu");
      setLoading(false);
    });
}, [searchTerm, vegFilter, priceOrder]);


useEffect(() => {
  fetch("https://flaskapiformealmonkey.onrender.com/get_restaurant_image", {
    credentials: "include",
  })
    .then(res => res.json())
    .then(data => {
      if (data.url) {
        setRestaurantImagePreview(data.url); // show existing image
      }
    })
    .catch(err => console.error("Image fetch failed:", err));
}, []);

const fetchMenu = () => {
  setLoading(true);

  console.log("Fetching menu...");

  fetch("https://flaskapiformealmonkey.onrender.com/restaurant_menu", { credentials: "include" })
    .then((res) => {
      console.log("Response status:", res.status);

      if (!res.ok) {
        return res.text().then(t => {
          console.error("Backend Error Text:", t);
          throw new Error("Fetch failed: " + t);
        });
      }

      return res.json();
    })
    .then((data) => {
      console.log("Menu data received:", data);

      if (!Array.isArray(data.menu)) {
        throw new Error("Menu format invalid");
      }
      setMenu(data.menu);

      setLoading(false);
    })
    .catch((err) => {
      console.error("Fetch error:", err);
      setError(err.message);
      setLoading(false);
    });
};

  useEffect(() => {
    fetch("https://flaskapiformealmonkey.onrender.com/get_shop_status", {
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
      await fetch(`https://flaskapiformealmonkey.onrender.com/delete_food/${menu_id}`, {
        method: "DELETE",
        credentials: "include",
      });
      setMenu(prev => prev.filter(item => item.food_id !== menu_id));
    } catch {
      alert("Failed to delete food");
    }
  };

  const toggleAvailability = async (menu_id, currentStatus) => {
    try {
      await fetch(`https://flaskapiformealmonkey.onrender.com/toggle_availability/${menu_id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ available: !currentStatus }),
      });
      setMenu(prev =>
        prev.map(i =>
          i.food_id === menu_id ? { ...i, available: !currentStatus } : i
        )
      );

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
    const res = await fetch(
      "https://flaskapiformealmonkey.onrender.com/add_food",
      {
        method: "POST",
        credentials: "include",
        body: formData,
      }
    );

    // 🔥 Add to menu instantly
    const newItem = await res.json();
    setMenu(prev => [...prev, newItem]);

    // 🔥 Clear form
    setName("");
    setDescription("");
    setPrice("");
    setVegNonveg("veg");
    setImageFile(null);
    setImagePreview(null);

  } catch (err) {
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
    const res = await fetch("https://flaskapiformealmonkey.onrender.com/upload_restaurant_image", {
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
      await fetch("https://flaskapiformealmonkey.onrender.com/restaurant_logout", {
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

  const refreshMenu = () => {
  fetch("https://flaskapiformealmonkey.onrender.com/restaurant_menu", { credentials: "include" })
    .then(res => res.json())
    .then(data => setMenu(data.menu))
  };


  return (
    <div className="rest_dashboard">
      <div className="left_dashboard">
        <h2 className="page_title">Hey Restaurant Manager,</h2>
        <div className="image_div">
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleRestaurantImageChange}
          />

          <div className="image_container" onClick={() => fileInputRef.current.click()}>
            {restaurantImagePreview && (
              <img
                src={restaurantImagePreview}
                alt="Restaurant"
                className="rest_dashboard_image"
              />
            )}

            <div className="image_overlay">
              Change Restaurant Banner
            </div>
          </div>
          
          <div className="sub_div" style={{display: 'flex', textAlign: 'right', marginTop: '10px', marginBottom: '10px'}}>
            <button onClick={handleUploadRestaurantImage} className="place_order" style={{padding: '10px 10px 10px 10px'}}>Upload Image</button>
          </div>
        </div>     

        <div style={{ marginBottom: "20px", fontFamily: 'calibri, sans-serif'}}>
        <strong>Shop Status: </strong>
        <button
          onClick={async () => {
            try {
              const newStatus = !shopStatus;
              await fetch("https://flaskapiformealmonkey.onrender.com/toggle_shop_status", {
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
          className="place_order"
          style={{padding: '7px', marginLeft: '10px', backgroundColor: '#FF5725'}}
        >
          {shopStatus ? "Open" : "Closed"}
        </button>
        <button
          onClick={handleRestaurantLogout}
          style={{ float: "right", marginBottom: "20px", padding: '10px', backgroundColor: "#FF4041", width: "100px"}}
          className="place_order"
        >
          Logout
        </button>
      </div>
      <form onSubmit={handleAddFood} style={{display: 'flex', flexDirection: 'column'}}>
        
        <input
          type="text"
          placeholder="Food Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="input"
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="input"
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          className="input"
        />
        <select
          value={vegNonveg}
          onChange={(e) => setVegNonveg(e.target.value)}
          required
          className="input"
        >
          <option value="veg">Veg</option>
          <option value="non-veg">Non-Veg</option>
        </select>
        <input type="file" accept="image/*" onChange={handleImageChange} 
          className="input"
         />        
        <div className="add_btn">
          <button type="submit" className="place_order stupid_btn" style={{backgroundColor: "#232229"}}>Add Food</button>
        </div>
      </form>
      
      </div>
      <div className="right_dashboard">
          <div style={{ margin: "20px 0" }}>
        <input
          type="text"
          placeholder="Search food..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginRight: "10px", width: '60%'}}
          className="input"
        />
        <select
          value={vegFilter}
          onChange={(e) => setVegFilter(e.target.value)}
          style={{ marginRight: "10px" }}
          className="input"
        >
          <option value="">All</option>
          <option value="veg">Veg</option>
          <option value="non-veg">Non-Veg</option>
        </select>
        <select
          value={priceOrder}
          onChange={(e) => setPriceOrder(e.target.value)}
          className="input"
        >
          <option value="asc">Price Low → High</option>
          <option value="desc">Price High → Low</option>
        </select>
      </div>
      <div className="rest_menu_items">
        {menu.map((item) => {
          if (!item || !item.name) return null;   // protect against undefined

          return (
            <div
              key={item.food_id}
              className="rest_menu_item"

            >
              <div 
                className="image_square"
                onClick={() => {
                  setSelectedFood(item);
                  setModalOpen(true);
                }}
              >
                <img src={item.image_url} alt={item.name} className="image" />
              </div>
              <div className="desc">
                <h2 className="rest_menu_item_name">
                  {item.name.length > 17 
                    ? item.name.slice(0, 17) + "..." 
                    : item.name}
                </h2>
                <p className="rest_menu_item_desc">₹{item.price}</p>
              </div>
              <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <button style={{padding: '10px', borderRadius: 7, border: 'none', backgroundColor: '#17963dff', color: "#fff", width: 75, height:40, cursor: 'pointer'}} onClick={() => handleEdit(item)}>Edit</button>
                <button style={{padding: '10px', borderRadius: 7, border: 'none', backgroundColor: '#FF4041', color: "#fff", width: 75, height:40, cursor: 'pointer'}} onClick={() => handleDelete(item.food_id)}>Delete</button>
                <button
                  style={{padding: '10px', borderRadius: 7, border: 'none', backgroundColor: '#F75326', color: "#fff", width: 150, height:40, cursor: 'pointer'}}
                  onClick={() => toggleAvailability(item.food_id, item.available)}
                >
                  {item.available ? "Mark Unavailable" : "Mark Available"}
                </button>
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

      {editingItem && (
        <EditFoodModal
          item={editingItem}
          onClose={() => setEditingItem(null)}
          setMenu={setMenu}
          refreshMenu={refreshMenu}
        />
      )}
      </div>
    </div>
  );
}
