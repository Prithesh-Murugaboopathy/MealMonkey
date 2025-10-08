import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // Fetch initial cart from backend
  useEffect(() => {
    async function fetchCart() {
      try {
        const res = await axios.get("http://localhost:5000/cart", { withCredentials: true });
        setCart(res.data.items || []);
      } catch (err) {
        console.log("Error fetching cart:", err);
      }
    }
    fetchCart();
  }, []);

  const addToCart = async (food, quantity = 1) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/cart/add",
        { food_id: food.food_id, quantity },
        { withCredentials: true }
      );
      // update local cart state
      setCart(prev => {
        const existing = prev.find(i => i.food_id === food.food_id);
        if (existing) {
          return prev.map(i =>
            i.food_id === food.food_id ? { ...i, quantity: i.quantity + quantity } : i
          );
        } else {
          return [...prev, { ...food, quantity }];
        }
      });
      return res.data;
    } catch (err) {
      throw err; // so frontend toast can catch it
    }
  };

  const updateCart = async (food_id, quantity) => {
    try {
      await axios.patch("http://localhost:5000/cart/update", { food_id, quantity }, { withCredentials: true });
      setCart(prev => prev.map(i => i.food_id === food_id ? { ...i, quantity } : i));
    } catch (err) {
      console.log("Failed to update cart", err);
    }
  };

  const removeFromCart = async (food_id) => {
    try {
      await axios.delete(`http://localhost:5000/cart/remove/${food_id}`, { withCredentials: true });
      setCart(prev => prev.filter(i => i.food_id !== food_id));
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
    <CartContext.Provider value={{ cart, addToCart, updateCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}
