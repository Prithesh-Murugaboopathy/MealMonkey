import React, { useState, useEffect, useContext } from "react";
import { CartContext } from "../context/CartContext";
import { Link } from "react-router-dom";
import './css/CartModal.css'
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';

export default function CartModal({ onClose }) {
  const { cart, updateCart, removeFromCart, clearCart, fetchCart } = useContext(CartContext);
  const [open, setOpen] = useState(true);
  const [closing, setClosing] = useState(false);
  
  useEffect(() => {
    fetchCart();
  }, []);

  const handleClose = () => {
    setClosing(true);
    setOpen(false);
    setTimeout(onClose, 300);
  };


  if (!cart || cart.length === 0)
    return (
      <div className="move_from_da_top">
        <div className="insider">
          <h2>Your cart is empty...</h2>
        </div>
      </div>
    );

  return (
    <div className="cart_display">
      <div className="cart_page">
        <h2 className="cart_page_title">Your Cart</h2>
          {cart.map((item) => (
            <div key={item.food_id} className="cart_items">
                <p className="cart_item_name">{item.name.length > 20
                ? item.name.slice(0, 20) + "..." 
                : item.name}</p>
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
                <p className="text-sm text-gray-500">₹ {item.price * item.quantity}</p>
              </div>
            </div>
          ))}
          <div className="action_btns">
            <button className="clear_cart_btn" onClick={clearCart}>
              Clear Cart
            </button>
            <Link to='/checkout'>
              <button className="checkout_btn">
                Checkout
              </button>
            </Link>
        </div>
      </div>
    </div>
  );
}
