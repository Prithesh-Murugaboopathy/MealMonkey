import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./pages/Home";
import RestaurantMenu from "./pages/RestaurantMenu";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Checkout from "./pages/Checkout";
import Navbar from "./components/Navbar";
import RestaurantRegister from "./pages/RestaurantRegister";
import RestaurantLogin from "./pages/RestaurantLogin";
import RestaurantDashboard from "./pages/RestaurantDashboard";
import Restaurants from "./pages/Restaurants";
import axios from "axios";
import CartModal from "./components/CartModal";
import Orders from "./pages/Orders";
import Menu from "./pages/Menu";

import './App.css'
import SearchBar from "./components/SearchBar";

function App() {
  // eslint-disable-next-line no-unused-vars
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    async function fetchCart() {
      try {
        const res = await axios.get("http://localhost:5000/cart", { withCredentials: true });
        setCartItems(res.data.items || []);
      } catch (err) {
        console.log("Error fetching cart");
      }
    }
    fetchCart();
  }, []);
  return (
    <CartProvider>
      <Router>
        <Navbar />
        <ToastContainer position="top-right" autoClose={3000} stacked />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/restaurant/:id" element={<RestaurantMenu setCartItems={setCartItems} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cart" element={<CartModal />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/restaurant_register" element={<RestaurantRegister />} />
          <Route path="/menu" element={<Menu />} />.
          <Route path="/restaurant_login" element={<RestaurantLogin />} />
          <Route path="/restaurant_dashboard" element={<RestaurantDashboard setCartItems={setCartItems} />} />
          <Route path="/restaurants" element={<Restaurants />} />
          <Route path="/search" element={<SearchBar />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
