import React, { useEffect, useContext } from "react";
import { CartContext } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import './css/CartModal.css';
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded';

export default function CartModal() {
  const { cart, updateCart, removeFromCart, clearCart, fetchCart } = useContext(CartContext);
  const navigate = useNavigate();
  
  useEffect(() => {
    fetchCart();
  });

  const subtotal = cart?.reduce((acc, item) => acc + (item.price * item.quantity), 0) || 0;
  const deliveryFee = subtotal > 0 ? 40 : 0;
  const platformFee = subtotal > 0 ? 5 : 0;
  const total = subtotal + deliveryFee + platformFee;

  if (!cart || cart.length === 0) {
    return (
      <div className="">
        <div className="empty_cart_card">
          <div className="empty_visuals">
            <div className="icon_circle">
              <ShoppingCartRoundedIcon className="floating_basket" sx={{ fontSize: 60 }} />
            </div>
            <div className="circle_glow"></div>
          </div>
          
          <h1 className="food_modal_name">Your basket is empty</h1>
          <p className="empty_description">
            Looks like you haven't made your choice yet. <br/>
            Explore our menu and discover something delicious!
          </p>
          
          <button className="final_checkout_btn" onClick={() => navigate("/")} style={{maxWidth: '250px'}}>
            Start Exploring !!
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart_page_wrapper">
      <div className="cart_container">
        {/* Left Column: Items */}
        <div className="cart_items_section">
          <div className="cart_header_full">
            <h2>Items in your basket</h2>
            <button className="clear_all_btn" onClick={clearCart}>Clear All</button>
          </div>

          <div className="items_grid">
            {cart.map((item) => (
              <div key={item.food_id} className="cart_item_row">
                <div className="item_details">
                  <h4 className="item_name_full">{item.name}</h4>
                  <p className="item_desc">Freshly prepared</p>
                </div>
                
                <div className="item_actions_row">
                  <div className="qty_selector_full">
                    <button 
                      className="qty_step" 
                      onClick={() => item.quantity - 1 <= 0 ? removeFromCart(item.food_id) : updateCart(item.food_id, item.quantity - 1)}
                    >
                      <RemoveRoundedIcon fontSize="small" />
                    </button>
                    <span className="qty_val">{item.quantity}</span>
                    <button className="qty_step" onClick={() => updateCart(item.food_id, item.quantity + 1)}>
                      <AddRoundedIcon fontSize="small" />
                    </button>
                  </div>
                  
                  <div className="item_price_tag">₹{item.price * item.quantity}</div>
                  
                  <button className="item_remove_icon" onClick={() => removeFromCart(item.food_id)}>
                    <DeleteOutlineRoundedIcon fontSize="small" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="cart_summary_section">
          <div className="summary_card">
            <h3>Bill Details</h3>
            
            <div className="summary_line">
              <span>Item Total</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="summary_line">
              <span>Delivery Fee</span>
              <span>₹{deliveryFee}</span>
            </div>
            <div className="summary_line">
              <span>Platform Fee</span>
              <span>₹{platformFee}</span>
            </div>
            
            <div className="summary_total">
              <span>TO PAY</span>
              <span>₹{total}</span>
            </div>

            <Link to='/checkout' className="checkout_link_full">
              <button className="final_checkout_btn">
                Confirm Order
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}