import React, { useState, useEffect, useContext } from "react";
import { CartContext } from "../context/CartContext";
import { Link } from "react-router-dom";

export default function CartModal({ onClose }) {
  const { cart, updateCart, removeFromCart, clearCart } = useContext(CartContext);
  const [open, setOpen] = useState(true);
  const [closing, setClosing] = useState(false);
  
  const handleClose = () => {
    setClosing(true);
    setOpen(false);
    setTimeout(onClose, 300);
  };


  if (!cart || cart.length === 0)
    return (
      <div>
        <div>
          <h2>Your cart is empty</h2>
        </div>
      </div>
    );

  return (
    <div>
      <div>
        <h2 className="text-xl font-bold mb-4">Your Cart</h2>

        <div className="cart-items space-y-4">
          {cart.map((item) => (
            <div key={item.food_id} className="flex justify-between items-center border-b pb-2">
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-gray-500">₹{item.price}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded"
                  onClick={() =>
                    item.quantity - 1 <= 0
                      ? removeFromCart(item.food_id)
                      : updateCart(item.food_id, item.quantity - 1)
                  }
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  className="bg-green-500 text-white px-2 py-1 rounded"
                  onClick={() => updateCart(item.food_id, item.quantity + 1)}
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center mt-4">
          <button className="bg-gray-300 px-4 py-2 rounded" onClick={clearCart}>
            Clear Cart
          </button>
          <Link to='/checkout'>
            <button className="bg-green-600 text-white px-4 py-2 rounded">
              Checkout
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
