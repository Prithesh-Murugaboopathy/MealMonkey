import React, { useState, useEffect } from "react";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import "./css/OrderModal.css";

export default function OrderModal({ order, onClose }) {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    setOpen(true);
  }, []);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  if (!order) return null;

  const status = order.order_status?.toLowerCase() || "pending";

  return (
    <div className={`modal_overlay ${closing ? 'fade_out' : 'fade_in'}`} onClick={handleClose}>
      <div 
        className={`modal_card_premium order_modal_details ${closing ? 'slide_down' : 'slide_up'}`} 
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal_close_btn" onClick={handleClose}>
          <CloseRoundedIcon />
        </button>

        <div className="order_modal_header">
          <div className="receipt_icon_wrapper">
            <ReceiptLongRoundedIcon sx={{ color: '#20a875' }} />
          </div>
          <h2 className="modal_title_text">Order Details</h2>
          <p className="order_id_subtitle">#{order.order_id} • {order.restaurant_name}</p>
          
          <div className={`status_pill_premium ${status}`} style={{ marginTop: '15px', display: 'inline-block' }}>
            {status}
          </div>
        </div>

        <div className="order_items_container">
          <h4 className="section_label">Items Ordered</h4>
          <div className="order_items_list">
            {order.items.map((item) => (
              <div key={item.food_id} className="order_item_row">
                <div className="item_info">
                  <p className="item_name_text">{item.food_name}</p>
                  <p className="item_qty_price">₹{item.price} × {item.quantity}</p>
                </div>
                <div className="item_total">
                  ₹{item.price * item.quantity}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="order_modal_footer">
          <div className="summary_row_premium">
            <span>Subtotal</span>
            <span>₹{order.total_price || order.total_amount}</span>
          </div>
          <div className="summary_row_premium total_highlight">
            <span>Grand Total</span>
            <span>₹{order.total_price || order.total_amount}</span>
          </div>
        </div>
      </div>
    </div>
  );
}