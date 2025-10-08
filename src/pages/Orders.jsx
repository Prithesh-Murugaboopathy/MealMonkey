import React, { useEffect, useState } from "react";
import axios from "axios";
import './index.css'

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://localhost:5000/orders", { withCredentials: true });
        setOrders(res.data);
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
    <div className="p-4">
      <h1>Orders</h1>
      
      <div className="space-y-6">
        {orders.map(order => (
          <div key={order.order_id}>
            <h2 className="font-semibold mb-2">Order</h2>
            <p>Status: <span className="font-bold">{order.order_status || "Pending"}</span></p>
            <p>Total: ₹{order.total_price || order.total_amount}</p>

            <div className="mt-2">
              <h3 className="font-semibold mb-1">Items:</h3>
              <div className="space-y-2">
                {order.items.map(item => (
                  <div key={item.food_id} className="flex items-center space-x-4">
                    <div>
                      <p>{item.name}</p>
                      <p>₹{item.price} x {item.quantity} = ₹{item.price * item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
