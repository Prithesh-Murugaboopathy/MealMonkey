import React, { useState, useEffect, useRef } from "react";
import EditFoodModal from "../components/EditFoodModal";
import MenuModal from "../components/MenuModal";

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import StoreIcon from '@mui/icons-material/Store';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';

import API from "../api/api";
import "./css/RestDashboard.css";
import toast, { Toaster } from "react-hot-toast";

// --- CUSTOM DROPDOWN COMPONENT (Premium Style) ---
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

export default function RestaurantDashboard({ setCartItems }) {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shopStatus, setShopStatus] = useState(true);
  const fileInputRef = useRef(null);

  const [editingItem, setEditingItem] = useState(null);
  const [restaurantImagePreview, setRestaurantImagePreview] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);

  // Form States
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [vegNonveg, setVegNonveg] = useState("veg");
  const [imageFile, setImageFile] = useState(null);

  // Filter States (Integrated from Menu)
  const [searchTerm, setSearchTerm] = useState("");
  const [vegFilter, setVegFilter] = useState("");
  const [priceOrder, setPriceOrder] = useState("asc");

  // Fetch Logic (Syncs with Search & Filters)
  const fetchMenuData = async () => {
    setLoading(true);
    try {
      const res = await API.get("/restaurant_menu", {
        params: { search: searchTerm, veg: vegFilter, price_order: priceOrder }
      });
      setMenu(res.data.menu || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuData();
  }, [searchTerm, vegFilter, priceOrder]);

  useEffect(() => {
    API.get("/get_restaurant_image").then(res => res.data.url && setRestaurantImagePreview(res.data.url));
    API.get("/get_shop_status").then(res => setShopStatus(res.data.status));
  }, []);

  const handleAddFood = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("veg_nonveg", vegNonveg);
    if (imageFile) formData.append("image", imageFile);

    try {
      const res = await API.post("/add_food", formData);
      setMenu(prev => [...prev, res.data]);
      setName(""); setDescription(""); setPrice(""); setImageFile(null);
    } catch { alert("Error adding food"); }
  };

  const toggleAvailability = async (id, currentStatus) => {
    try {
      await API.patch(`/toggle_availability/${id}`, { available: !currentStatus });
      setMenu(prev => prev.map(i => i.food_id === id ? { ...i, available: !currentStatus } : i));
    } catch { alert("Update failed"); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this dish?")) return;
    try {
      await API.delete(`/delete_food/${id}`);
      setMenu(prev => prev.filter(item => item.food_id !== id));
    } catch { alert("Delete failed"); }
  };
  const handleBannerUpload = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  toast.promise(
    API.post("/upload_restaurant_image", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    }),
    {
      loading: 'Uploading new banner...',
      success: (res) => {
        setRestaurantImagePreview(res.data.url);
        return <b>Banner updated!</b>;
      },
      error: (err) => {
        return <b>{err.response?.data?.message || "Upload failed"}</b>;
      },
    }
  );
};

  return (
    <div className="dash_container">
      <Toaster />
      <header className="dash_header">
        <h1 className="serif_title">Restaurant Panel</h1>
        <p className="sub_text">Manage your store status and kitchen menu</p>
      </header>

      <div className="dash_hero_section">
        <div className="banner_wrapper">
          <img src={restaurantImagePreview} alt="Banner" className="hero_banner_img" />

          <button className="change_banner_overlay" onClick={() => fileInputRef.current.click()}>
            <CameraAltIcon /> Update Banner
          </button>

          <input 
            type="file" 
            ref={fileInputRef} 
            hidden 
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                setRestaurantImagePreview(URL.createObjectURL(file));
                handleBannerUpload(file); 
              }
            }} 
          />
        </div>

        <div className="quick_actions_bar">
            <div className="status_pill">
                <StoreIcon />
                <span>Shop is <strong>{shopStatus ? "OPEN" : "CLOSED"}</strong></span>
                <button 
                    className={`toggle_btn_mini ${shopStatus ? 'is_open' : 'is_closed'}`}
                    onClick={async () => {
                        const newStatus = !shopStatus;
                        await API.patch("/toggle_shop_status", { status: newStatus });
                        setShopStatus(newStatus);
                    }}
                >
                    {shopStatus ? "Go Offline" : "Open Shop"}
                </button>
            </div>
            <button className="dash_logout_btn" onClick={() => window.location.href = "/"}>
                <LogoutIcon fontSize="small"/> Logout
            </button>
        </div>
      </div>

      <div className="main_dash_grid">
        <aside className="management_sidebar">
            <div className="management_card">
                <h2 className="card_heading"><AddCircleOutlineIcon /> Add New Dish</h2>
                <form onSubmit={handleAddFood} className="dash_form">
                    <input type="text" placeholder="Dish Name" value={name} onChange={e => setName(e.target.value)} required />
                    <textarea placeholder="Description" style={{resize: "vertical", maxHeight: "147px"}} value={description} onChange={e => setDescription(e.target.value)} />
                    <div className="form_row">
                        <input type="number" placeholder="Price" value={price} onChange={e => setPrice(e.target.value)} required />
                        <select value={vegNonveg} onChange={e => setVegNonveg(e.target.value)}>
                            <option value="veg">Veg</option>
                            <option value="non-veg">Non-Veg</option>
                        </select>
                    </div>
                    <div className="file_input_wrapper">
                        <label>{imageFile ? "Image Ready" : "Select Food Image"}</label>
                        <input type="file" onChange={e => setImageFile(e.target.files[0])} />
                    </div>
                    <button type="submit" className="add_dish_submit">Add to Menu</button>
                </form>
            </div>
        </aside>

        <section className="menu_management_section">
            {/* --- INTEGRATED SEARCH PILL --- */}
            <div className="filter_container_pill dash_pill_style">
                <div className="search_wrapper">
                    <SearchRoundedIcon className="search_icon" />
                    <input
                    type="text"
                    placeholder="Search your menu..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="premium_search_input"
                    />
                </div>
                
                <div className="filter_group_premium">
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

            <div className="food_grid">
                {menu.map((item) => (
                    <div key={item.food_id} className={`food_card_dark ${!item.available ? 'grayed' : ''}`}>
                        <div className="food_card_img" onClick={() => { setSelectedFood(item); setModalOpen(true); }}>
                            <img src={item.image_url} alt={item.name} />
                            <div className={`diet_indicator ${item.veg_nonveg}`}>
                              <div className="dot"></div>
                            </div>
                            {!item.available && <div className="closed_tag">HIDDEN</div>}
                        </div>
                        <div className="food_card_body">
                            <div className="card_header_row">
                                <h3 className="food_name">{item.name}</h3>
                                <span className="food_price">₹{item.price}</span>
                            </div>
                            <div className="admin_actions">
                                <button className="action_pill edit" onClick={() => setEditingItem(item)}>
                                    <EditOutlinedIcon fontSize="inherit" /> Edit
                                </button>
                                <button className="action_pill delete" onClick={() => handleDelete(item.food_id)}>
                                    <DeleteOutlineIcon fontSize="inherit" /> Delete
                                </button>
                                <button 
                                    className={`action_pill toggle ${item.available ? 'active' : ''}`}
                                    onClick={() => toggleAvailability(item.food_id, item.available)}
                                >
                                    {item.available ? "Live" : "Hidden"}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
      </div>

      {modalOpen && selectedFood && (
        <MenuModal food={selectedFood} onClose={() => setModalOpen(false)} />
      )}
      {editingItem && (
        <EditFoodModal item={editingItem} onClose={() => setEditingItem(null)} refreshMenu={fetchMenuData} />
      )}
    </div>
  );
}