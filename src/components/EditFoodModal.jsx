// EditFoodModal.jsx
import React, { useState, useEffect } from "react";
import './css/MenuModal.css'
import API from "../api/api";

export default function EditFoodModal({ item, onClose, setMenu, refreshMenu }) {
  const [name, setName] = useState(item.name);
  const [description, setDescription] = useState(item.description);
  const [price, setPrice] = useState(item.price);
  const [vegNonveg, setVegNonveg] = useState(item.veg_nonveg);
  const [imageFile, setImageFile] = useState(null);

  const [closing, setClosing] = useState(false);
  const [open, setOpen] = useState(false);
  const [dragStartY, setDragStartY] = useState(null);
  const [dragOffset, setDragOffset] = useState(0);

  const isMobile = window.innerWidth < 768;

  useEffect(() => {
    setTimeout(() => setOpen(true), 10);
  }, []);

  const handleClose = () => {
    setClosing(true);
    setOpen(false);
    setTimeout(() => {
      onClose();
      setClosing(false);
      setDragOffset(0);
    }, 300);
  };

  const handleTouchStart = (e) => setDragStartY(e.touches[0].clientY);

  const handleTouchMove = (e) => {
    if (!dragStartY) return;
    const offset = e.touches[0].clientY - dragStartY;
    if (offset > 0) setDragOffset(offset);
  };

  const handleTouchEnd = () => {
    if (dragOffset > 100) handleClose();
    else setDragOffset(0);
    setDragStartY(null);
  };

  const handleSave = async () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("veg_nonveg", vegNonveg);
    if (imageFile) formData.append("image", imageFile);

    try {
      const res = await API.patch(`/edit_food/${item.food_id}`, formData, {
        withCredentials: true,
      });
    
      const updatedItem = {
        ...item,
        ...res.data,
        food_id: item.food_id,
        image_url: res.data.image_url || item.image_url,
      };
    
      setMenu(prev =>
        prev.map(i =>
          i.food_id === item.food_id
            ? updatedItem
            : i
        )
      );
    
      // 🔥 Force reload fresh DB data
      if (typeof refreshMenu === "function") {
        refreshMenu();
      }
    
      handleClose();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to save changes");
    }
  };

  const handleImageChange = (e) => setImageFile(e.target.files[0]);

  const modalStyle = {
    transform: closing
      ? "translateY(100px)"
      : dragOffset
      ? `translateY(${dragOffset}px)`
      : open
      ? "translateY(0)"
      : "translateY(50px)",
    opacity: open ? 1 : 0,
    transition: "all 0.3s ease",
    bottom: isMobile ? 0 : "auto",
    borderRadius: isMobile ? "12px 12px 0 0" : "8px",
  };

  return (
    <div
      className="modal-overlay"
      onClick={handleClose}
      style={{
        backdropFilter: "blur(6px)",
        backgroundColor: "rgba(0,0,0,0.4)",
        transition: "opacity 0.3s ease",
        opacity: open ? 1 : 0,
      }}
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={modalStyle}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <button className="close_btn" onClick={handleClose}>
          ✖
        </button>


        {item.image_url && (
          <img
            src={item.image_url}
            alt="current"
            className="food_image"
          />
        )}
        <div className="form" style={{padding:10}}>
<input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Food Name"
          className="input"
          style={{margin: 2}}
        />

        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="input"
          style={{margin: 2}}
        />

        <select
          value={vegNonveg}
          onChange={(e) => setVegNonveg(e.target.value)}
          className="input"
          style={{margin: 2}}
        >
          <option value="veg">Veg</option>
          <option value="non-veg">Non-Veg</option>
        </select>

        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price"
          className="input"
          style={{margin: 2}}
        />

        <input className="input" style={{width: '175px'}}type="file" accept="image/*" onChange={handleImageChange} />
        </div>

        

        <div className="actions_btns" style={{display:"flex", textAlign:"right", marginLeft:10, marginBottom: 10}}>
          <button onClick={handleClose} className="clear_cart_btn" style={{color:"#000"}}>
            Cancel
          </button>
          <button onClick={handleSave} className="checkout_btn" style={{color:"#000"}}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
