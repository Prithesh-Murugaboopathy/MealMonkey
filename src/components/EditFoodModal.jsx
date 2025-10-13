// EditFoodModal.jsx
import React, { useState, useEffect } from "react";
import './index.css';
import API from "../api/api";

export default function EditFoodModal({ item, onClose, onSave }) {
  const [name, setName] = useState(item.name);
  const [description, setDescription] = useState(item.description);
  const [price, setPrice] = useState(item.price);
  const [vegNonveg, setVegNonveg] = useState(item.veg_nonveg);
  const [imageFile, setImageFile] = useState(null);

  const [closing, setClosing] = useState(false);
  const [dragStartY, setDragStartY] = useState(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [open, setOpen] = useState(false); 
  const isMobile = window.innerWidth < 768;

  useEffect(() => { setTimeout(() => setOpen(true), 10); }, []);

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

    // Axios automatically throws for non-2xx responses, so no need for res.ok
    onSave();
    handleClose();
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || "Failed to save changes");
  }
};


  const handleImageChange = (e) => setImageFile(e.target.files[0]);

  const modalStyle = {
    transform: closing ? "translateY(100px)" : dragOffset ? `translateY(${dragOffset}px)` : open ? "translateY(0)" : "translateY(50px)",
    opacity: open ? 1 : 0,
    transition: "all 0.3s ease",
    bottom: isMobile ? 0 : "auto",
    borderRadius: isMobile ? "12px 12px 0 0" : "8px",
  };

  return (
    <div
      className="modal-overlay"
      onClick={handleClose}
      style={{ backdropFilter: "blur(6px)", backgroundColor: "rgba(0,0,0,0.4)", transition: "opacity 0.3s ease", opacity: open ? 1 : 0 }}
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={modalStyle}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <button className="close_btn" onClick={handleClose}>✖</button>
        <h2>Edit Food</h2>
        {item.image_url && <img src={item.image_url} alt="current" style={{ width:"100px", marginBottom:"10px" }} />}
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Food Name" />
        <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
        <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price" />
        <select value={vegNonveg} onChange={(e) => setVegNonveg(e.target.value)}>
          <option value="veg">Veg</option>
          <option value="non-veg">Non-Veg</option>
        </select>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <div className="actions_btns">
          <button onClick={handleClose} className="cancel_btn">Cancel</button>
          <button onClick={handleSave} className="save_btn">Save</button>
        </div>
      </div>
    </div>
  );
}
