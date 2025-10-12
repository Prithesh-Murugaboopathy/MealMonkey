import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  const fetchCart = async () => {
    try {
      const res = await axios.get("http://localhost:5000/cart", { withCredentials: true });
      setCart(res.data.items || []);
    } catch (err) {
      console.log("Error fetching cart:", err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const addToCart = async (food, quantity = 1) => {
    try {
      await axios.post(
        "http://localhost:5000/cart/add",
        { food_id: food.food_id, quantity },
        { withCredentials: true }
      );
      await fetchCart(); // ⬅️ Refresh the latest data from backend
    } catch (err) {
      console.log("Add to cart failed:", err);
    }
  };

  const updateCart = async (food_id, quantity) => {
    try {
      await axios.patch("http://localhost:5000/cart/update", { food_id, quantity }, { withCredentials: true });
      await fetchCart(); // ⬅️ Refresh again
    } catch (err) {
      console.log("Failed to update cart", err);
    }
  };

  const removeFromCart = async (food_id) => {
    try {
      await axios.delete(`http://localhost:5000/cart/remove/${food_id}`, { withCredentials: true });
      await fetchCart(); // ⬅️ Refresh again
    } catch (err) {
      console.log("Failed to remove item", err);
    }
  };

  const clearCart = async () => {
    try {
      await axios.delete("http://localhost:5000/cart/clear", { withCredentials: true });
      setCart([]);
    } catch (err) {
      console.log("Failed to clear cart", err);
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, updateCart, removeFromCart, clearCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
}
