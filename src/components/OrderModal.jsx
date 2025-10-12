import React, { useState, useEffect } from "react";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import "./css/OrderModal.css";

export default function OrderModal({ order, onClose }) {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    setTimeout(() => setOpen(true), 10);
  }, []);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      onClose();
      setClosing(false);
    }, 300);
  };

  const modalStyle = {
    transform: closing ? "translateY(100px)" : open ? "translateY(0)" : "translateY(50px)",
    opacity: open ? 1 : 0,
    transition: "all 0.3s ease",
  };

  if (!order) return null;

  return (
    <div
      className="modal-overlay"
      onClick={handleClose}
      style={{ backdropFilter: "blur(6px)", backgroundColor: "rgba(0,0,0,0.4)" }}
    >
      <div
        className="modal-content order-modal"
        style={modalStyle}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="close_btn" onClick={handleClose}>
          <CloseRoundedIcon />
        </button>
        <h2 className="font-semibold text-xl mb-3">Order</h2>
        <p>Status: <b>{order.order_status || "Pending"}</b></p>
        <p>Total: ₹{order.total_price || order.total_amount}</p>
        <hr className="my-3" />
        <div className="space-y-3">
          <h3 className="font-semibold">Items:</h3>
          {order.items.map((item) => (
            <div key={item.food_id} className="flex justify-between items-center">
              <div>
                <p className="font-medium">{item.food_name}</p>
                <p className="text-sm text-gray-500">
                  ₹{item.price} × {item.quantity} = ₹{item.price * item.quantity}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
