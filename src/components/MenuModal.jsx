import React, { useState, useEffect, useContext } from "react";
import toast, { Toaster } from 'react-hot-toast';
import { CartContext } from "../context/CartContext";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import API from "../api/api";
import './css/MenuModal.css';

export default function MenuModal({ restaurant, food, onClose }) {
  const { cart, addToCart, clearCart } = useContext(CartContext);
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setOpen(true);
    const item = cart.find(i => i.food_id === food.food_id);
    setQuantity(item ? item.quantity : 0);
  }, [food.food_id, cart]);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleAdd = async () => {
    setLoading(true);
    try {
      const res = await API.get("/cart");
      const cartItems = res.data.items || [];
      
      const firstRestId = Number(cartItems[0]?.restaurant_id);
      const currentFoodRestId = Number(food.restaurant_id);

      if (cartItems.length > 0 && firstRestId !== currentFoodRestId) {
        setLoading(false); 
        
        toast((t) => (
          <div className="restaurant_conflict_toast">
            <div className="toast_content">
              <h6>Replace cart items?</h6>
              <p>Your cart has items from another restaurant. Start a new cart instead?</p>
            </div>
            <div className="toast_actions">
              <button 
                className="never_mind" 
                onClick={() => toast.dismiss(t.id)}
              >
                Never Mind
              </button>
              <button
                className="start_fresh"
                onClick={async () => {
                  toast.dismiss(t.id);
                  setLoading(true);
                  try {
                    await clearCart(); 
                    await addToCart(food); 
                    setQuantity(1);
                    toast.success("Started a fresh cart!");
                  } catch (err) {
                    toast.error("Failed to reset cart");
                  } finally {
                    setLoading(false);
                  }
                }}
              >
                Start Fresh
              </button>
            </div>
          </div>
        ), { duration: 6000 });
        return;
      }
      await addToCart(food);
      setQuantity(1);
      toast.success("Added to cart!");

    } catch (err) {
      toast.error(err.response?.status === 401 ? "Login first!" : "Failed to add to cart!");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (newQty) => {
    if (newQty < 0) return;
    setLoading(true);
    try {
      await API.patch("/cart/update", { food_id: food.food_id, quantity: newQty });
      setQuantity(newQty);
    } catch (err) {
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (!food) return null;

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

        <div className="modal_inset_image_container">
          <img 
            src={food.image_url || "/food-placeholder.png"} 
            alt={food.name} 
            className="modal_food_image" 
          />
          <div className={`diet_indicator_large ${food.veg_nonveg}`}>
            <div className="dot"></div>
          </div>
        </div>

        <div className="modal_body_content">
          <div className="modal_header_row">
            <div className="title_group">
              <h3 className="modal_title_text">{food.name}</h3>
              <p className="modal_price_text">₹{food.price}</p>
            </div>

            {quantity === 0 ? (
              <button className="modal_add_btn_premium" onClick={handleAdd} disabled={loading}>
                {loading ? "..." : "ADD"}
              </button>
            ) : (
              <div className="modal_qty_pill">
                <button onClick={() => handleUpdate(quantity - 1)} disabled={loading}><RemoveRoundedIcon fontSize="small" /></button>
                <span className="qty_display">{quantity}</span>
                <button onClick={() => handleUpdate(quantity + 1)} disabled={loading}><AddRoundedIcon fontSize="small" /></button>
              </div>
            )}
          </div>

          <div className="modal_description_section">
            <h4>Description</h4>
            <p>{food.description || "No description available for this item."}</p>
          </div>
        </div>
      </div>
    </div>
  );
}