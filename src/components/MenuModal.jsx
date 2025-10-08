import axios from "axios"; 
import React, { useState, useEffect, useContext } from "react";
import { Flip, toast, ToastContainer } from "react-toastify";
import { CartContext } from "../context/CartContext";

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
      const res = await axios.get("http://localhost:5000/cart", { withCredentials: true });
      const cartItems = res.data.items || [];
      console.log("Cart Items from backend:", cartItems);

      const firstRestId = Number(cartItems[0]?.restaurant_id);
      const currentFoodRestId = Number(food.restaurant_id);

      if (cartItems.length > 0 && firstRestId !== currentFoodRestId) {
        toast.info(({ closeToast }) => (
          <div>
            <p>Cart has items from another restaurant!</p>
            <div className="flex justify-between mt-2">
              <button className="bg-gray-300 px-2 py-1 rounded mr-2" onClick={closeToast}>Cancel</button>
              <button
                className="bg-red-500 text-white px-2 py-1 rounded"
                onClick={async () => {
                  await clearCart();
                  await addToCart(food);
                  closeToast();
                  toast.success("Cart cleared & item added!");
                }}
              >
                Clear & Add
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
      await axios.patch(
        "http://localhost:5000/cart/update",
        { food_id: food.food_id, quantity: newQty },
        { withCredentials: true }
      );
      setQuantity(newQty); // Update UI instantly
    } catch {
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
    <div className="modal-overlay" style={{ backdropFilter: "blur(6px)", backgroundColor: "rgba(0,0,0,0.4)" }}>
      <ToastContainer autoClose={false} position="bottom-right" transition={Flip} closeButton={false} stacked />
      <div className="modal-content" style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <button className="close_btn" onClick={handleClose}>✖</button>
        <h2 className="text-2xl font-bold mb-4">{restaurant.name}</h2>

        <div className="flex flex-col items-center">
          <img src={food.image_url || "/food-placeholder.png"} alt={food.name} className="h-48 w-full object-cover rounded mb-4" />
          <h3 className="font-semibold text-xl">{food.name}</h3>
          <p className="text-sm text-gray-600 mb-2">{food.description}</p>
          <p className="font-bold text-lg mb-4">₹{food.price}</p>

          {quantity === 0 ? (
            <button className="bg-green-500 text-white rounded px-4 py-2" onClick={handleAdd} disabled={loading}>
              {loading ? "Adding..." : "Add"}
            </button>
          ) : (
            <div className="flex items-center space-x-2">
              <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={() => handleUpdate(quantity - 1)} disabled={loading}>-</button>
              <span className="px-3 py-1 border rounded">{quantity}</span>
              <button className="bg-green-500 text-white px-3 py-1 rounded" onClick={() => handleUpdate(quantity + 1)} disabled={loading}>+</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
