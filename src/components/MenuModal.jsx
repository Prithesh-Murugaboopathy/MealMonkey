import axios from "axios"; 
import React, { useState, useEffect, useContext } from "react";
import { Flip, toast, ToastContainer } from "react-toastify";
import { CartContext } from "../context/CartContext";
import './css/MenuModal.css'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import API from "../api/api";

export default function MenuModal({ restaurant, food, onClose }) {
  const { cart, addToCart, updateCart, clearCart } = useContext(CartContext);
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [loading, setLoading] = useState(false);

  const isMobile = window.innerWidth < 768;

  useEffect(() => {
    setTimeout(() => setOpen(true), 10);
    const item = cart.find(i => i.food_id === food.food_id);
    setQuantity(item ? item.quantity : 0);
  }, [food.food_id, cart]);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      onClose();
      setClosing(false);
    }, 300);
  };

  const handleAdd = async () => {
    setLoading(true);
    try {
      const res = await API.get("/cart");
      const cartItems = res.data.items || [];
      console.log("Cart Items from backend:", cartItems);

      const firstRestId = Number(cartItems[0]?.restaurant_id);
      const currentFoodRestId = Number(food.restaurant_id);

      if (cartItems.length > 0 && firstRestId !== currentFoodRestId) {
        toast.info(({ closeToast }) => (
          <div>
            <p>Cart has items from another restaurant!</p>
            <div style={{display: 'flex', }}>
              <button className="clear_cart_btn" style={{color: '#000', fontSize:'13px'}} onClick={closeToast}>Never Mind</button>
              <button
                className="checkout_btn" style={{color: '#000', fontSize:'13px'}}
                onClick={async () => {
                  await clearCart();
                  await addToCart(food);
                  closeToast();
                  toast.success("Cart cleared & item added!");
                }}
              >
                Start Fresh!
              </button>
            </div>
          </div>
        ));
        return;
      }

      await addToCart(food);
      setQuantity(1); // Update local quantity
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
    await API.patch(
      "/cart/update",
      { food_id: food.food_id, quantity: newQty },
      { withCredentials: true }
    );

    setQuantity(newQty); // UI update
  } catch (err) {
    console.error(err);
    toast.error("Failed to update cart");
  }

  setLoading(false);
};


  const modalStyle = {
    transform: closing ? "translateY(100px)" :
               dragOffset ? `translateY(${dragOffset}px)` :
               open ? "translateY(0)" : "translateY(50px)",
    opacity: open ? 1 : 0,
    transition: "all 0.3s ease",
    bottom: isMobile ? 0 : "auto",
    borderRadius: isMobile ? "12px 12px 0 0" : "8px",
  };

  if (!food) return null;

  return (
    <div className="modal-overlay" onClick={handleClose} style={{ backdropFilter: "blur(6px)", backgroundColor: "rgba(0,0,0,0.4)" }}>
      <ToastContainer autoClose={false} position="bottom-right" transition={Flip} closeButton={false} stacked />
      <div className="modal-content" style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <button className="close_btn" onClick={handleClose}><CloseRoundedIcon /></button>
        <div className="">
          <img src={food.image_url || "/food-placeholder.png"} alt={food.name} className="food_image" />
          <div className="details">
            <div className="left_side">
              <h3 className="food_modal_name">
                {food.name.length > 25 
                ? food.name.slice(0, 20) + "..." 
                : food.name}
              </h3>
              <p className="food_modal_price">₹ {food.price}</p>
            </div>
            {quantity === 0 ? (
              <button className="food_modal_add_to_cart" onClick={handleAdd} disabled={loading}>
                {loading ? "Adding..." : "ADD"}
              </button>
            ) : (
              <div className="customizable_qty">
                <button className="left_minus_btn" onClick={() => handleUpdate(quantity - 1)} disabled={loading}><RemoveRoundedIcon /></button>
                <span className="food_modal_qty">{quantity}</span>
                <button className="right_plus_btn" onClick={() => handleUpdate(quantity + 1)} disabled={loading}><AddRoundedIcon /></button>
              </div>
            )}
          </div>
          <p className="food_modal_desc">{food.description}</p>
        </div>
        
      </div>
    </div>
  );
}