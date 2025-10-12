import React, { useEffect, useState } from "react";
import axios from "axios";
import OrderModal from "../components/OrderModal";
import "./index.css";
import "./css/Orders.css";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://localhost:5000/orders", { withCredentials: true });
        setOrders(res.data);
        console.log("DEBUG /orders response:", res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <p>Loading orders...</p>;
  if (orders.length === 0) return <p>No orders placed yet!</p>;

  return (
    <div className="orders_page">
      <h1 className="page_title">Orders</h1>

      <div className="orders_display">
        {orders.map((order) => (
          <div key={order.order_id} className="order_card">
            <p>{order.restaurant_name.length > 25 
                ? order.restaurant_name.slice(0, 25) + "..." 
                : order.restaurant_name}</p>
            <p>Status: <span className="font-bold">{order.order_status || "Pending"}</span></p>
            <p>Total: ₹{order.total_price || order.total_amount}</p>

            <button
              className="view"
              onClick={() => setSelectedOrder(order)}
            >
              View Items
            </button>
          </div>
        ))}
      </div>

      {selectedOrder && (
        <OrderModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}
    </div>
  );
}
