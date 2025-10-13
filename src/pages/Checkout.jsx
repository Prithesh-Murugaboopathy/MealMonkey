// ./pages/Checkout.jsx
import React, { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { toast, ToastContainer, Flip } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import { useNavigate } from "react-router-dom"; // also needed for navigate
import './css/Checkout.css'
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import API from "../api/api";


export default function Checkout() {
  const { cart, updateCart, removeFromCart, clearCart } = useContext(CartContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast.info("Cart is empty!");
      return;
    }
    setLoading(true);
    try {
    await API.post("/checkout", {cart});

    toast.success("Order placed!");
    await clearCart(); // clear frontend cart
    navigate("/orders"); // redirect to orders page
  } catch (err) {
    toast.error(err.response?.data?.error || "Failed to place order");
  }
  };

  return (
    <div className="checkout_display">
      <div className="checkout_page">
        <ToastContainer autoClose={3000} position="bottom-right" transition={Flip} />
        <h1 className="checkout_page_title">Checkout</h1>

        {cart.length === 0 ? (
          <p>Your cart is empty!</p>
        ) : (
          <div className="checkout_card">
            {cart.map(item => (
              <div key={item.food_id} className="checkout_items">
                <div className="flex items-center space-x-4">
                  <div>
                    <h3 className="font-semibold">{item.name.length > 20
                      ? item.name.slice(0, 20) + "..." 
                      : item.name}
                    </h3>
                  </div>
                </div>
                <div className="cart_customizable_qty">
                <button 
                  className="cart_left_minus_btn" 
                  onClick={() =>
                    item.quantity - 1 <= 0
                      ? removeFromCart(item.food_id)
                      : updateCart(item.food_id, item.quantity - 1)
                  }>
                    <RemoveRoundedIcon />
                  </button>
                <span className="cart_modal_qty">{item.quantity}</span>
                <button className="cart_right_plus_btn" onClick={() => updateCart(item.food_id, item.quantity + 1)}><AddRoundedIcon /></button>
                &nbsp;
                &nbsp;
                &nbsp;
                <p>₹{item.price * item.quantity}</p>
              </div>
              </div>
            ))}
            <div className="total">
              <h2 className="total_cost">To Pay &nbsp;₹{totalAmount}</h2>
            </div>
            <div className="place">
              <button
                className={`place_order ${loading ? "processing_style" : ""}`}
                onClick={handleCheckout}
                disabled={loading}
              >
                {loading ? "Processing..." : "Proceed to Payment"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
