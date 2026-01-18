import React, { useState, useEffect, useRef } from "react";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import CloudUploadRoundedIcon from '@mui/icons-material/CloudUploadRounded';
import toast, { Toaster } from 'react-hot-toast';
import API from "../api/api";
import './css/MenuModal.css';

export default function EditFoodModal({ item, onClose, setMenu, refreshMenu }) {
  const [name, setName] = useState(item.name);
  const [description, setDescription] = useState(item.description);
  const [price, setPrice] = useState(item.price);
  const [vegNonveg, setVegNonveg] = useState(item.veg_nonveg);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [closing, setClosing] = useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setOpen(true);
  }, []);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("veg_nonveg", vegNonveg);
    if (imageFile) formData.append("image", imageFile);

    try {
      const res = await API.patch(`/edit_food/${item.food_id}`, formData);
    
      const updatedItem = {
        ...item,
        ...res.data,
        food_id: item.food_id,
        image_url: res.data.image_url || item.image_url,
      };
    
      setMenu(prev => prev.map(i => i.food_id === item.food_id ? updatedItem : i));
    
      if (typeof refreshMenu === "function") refreshMenu();
      
      toast.success("Dish updated successfully");
      handleClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save changes");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`modal_overlay ${closing ? 'fade_out' : 'fade_in'}`} onClick={handleClose}>
      <Toaster position="bottom-right" />
      <div 
        className={`modal_card_premium ${closing ? 'slide_down' : 'slide_up'}`} 
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal_close_btn" onClick={handleClose}>
          <CloseRoundedIcon />
        </button>

        <div className="modal_inset_image_container" onClick={() => fileInputRef.current.click()}>
          <img 
            src={imagePreview || item.image_url || "/food-placeholder.png"} 
            alt="edit preview" 
            className="modal_food_image" 
          />
          <div className="banner_edit_overlay" style={{background: 'rgba(0,0,0,0.4)'}}>
            <CloudUploadRoundedIcon />
            <p>Replace Photo</p>
          </div>
          <input type="file" ref={fileInputRef} style={{display:'none'}} onChange={handleImageChange} />
        </div>

        <div className="modal_body_content">
          <div className="modal_header_row">
            <div className="title_group">
              <h3 className="modal_title_text" style={{fontSize: '24px'}}>Modify Creation</h3>
              <p className="label_mini" style={{color: '#71717a', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px'}}>Item ID: #{item.food_id}</p>
            </div>
          </div>

          <div className="dash_form_premium" style={{marginTop: '10px'}}>
             <div className="input_wrapper_premium">
                <label>Dish Name</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Truffle Pasta" />
             </div>

             <div className="input_wrapper_premium">
                <label>Description</label>
                <input type="text" value={description} onChange={e => setDescription(e.target.value)} placeholder="Short culinary description..." />
             </div>

             <div className="form_row_split">
                <div className="input_wrapper_premium">
                    <label>Price (₹)</label>
                    <input type="number" value={price} onChange={e => setPrice(e.target.value)} />
                </div>
                <div className="input_wrapper_premium">
                    <label>Dietary</label>
                    <select value={vegNonveg} onChange={e => setVegNonveg(e.target.value)}>
                        <option value="veg">Veg</option>
                        <option value="non-veg">Non-Veg</option>
                    </select>
                </div>
             </div>

             <div className="modal_actions_row" style={{display: 'flex', gap: '15px', marginTop: '20px'}}>
                <button className="btn_secondary_matte" onClick={handleClose} style={{flex: 1}}>Cancel</button>
                <button className="modal_add_btn_premium" onClick={handleSave} disabled={loading} style={{flex: 2}}>
                    {loading ? "Saving..." : "Save Changes"}
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}