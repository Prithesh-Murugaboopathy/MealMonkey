// ./pages/Checkout.jsx
import React, { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { toast, ToastContainer, Flip } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import { useNavigate } from "react-router-dom"; // also needed for navigate


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
    await axios.post("http://localhost:5000/checkout", { cart }, { withCredentials: true });
    toast.success("Order placed!");
    await clearCart(); // clear frontend cart
    navigate("/orders"); // redirect to orders page
  } catch (err) {
    toast.error(err.response?.data?.error || "Failed to place order");
  }
  };

  return (
    <div className="p-4">
      <ToastContainer autoClose={3000} position="bottom-right" transition={Flip} />
      <h1 className="text-3xl font-bold mb-4">Checkout</h1>

      {cart.length === 0 ? (
        <p>Your cart is empty!</p>
      ) : (
        <div className="space-y-4">
          {cart.map(item => (
            <div key={item.food_id} className="flex items-center justify-between border p-2 rounded">
              <div className="flex items-center space-x-4">
                <img src={item.image_url || "/food-placeholder.png"} alt={item.name} className="w-16 h-16 object-cover rounded"/>
                <div>
                  <h3 className="font-semibold">{item.name}</h3>
                  <p>₹{item.price} x {item.quantity} = ₹{item.price * item.quantity}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => updateCart(item.food_id, item.quantity - 1)}>-</button>
                <span>{item.quantity}</span>
                <button className="bg-green-500 text-white px-2 py-1 rounded" onClick={() => updateCart(item.food_id, item.quantity + 1)}>+</button>
                <button className="bg-gray-500 text-white px-2 py-1 rounded" onClick={() => removeFromCart(item.food_id)}>Remove</button>
              </div>
            </div>
          ))}

          <div className="flex justify-between items-center mt-4 border-t pt-4">
            <h2 className="text-xl font-bold">Total: ₹{totalAmount}</h2>
            <button
              className={`bg-blue-500 text-white px-4 py-2 rounded ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              onClick={handleCheckout}
              disabled={loading}
            >
              {loading ? "Processing..." : "Place Order"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
