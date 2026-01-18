import React, { useEffect, useState } from "react";
import OrderModal from "../components/OrderModal";
import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import "./css/Orders.css";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await API.get("/orders");
        setOrders(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return (
    <div className="menu_loading">
      <div className="spinner"></div>
      <p>Fetching your order history...</p>
    </div>
  );

  if (orders.length === 0) return (
    <div className="">
        <div className="empty_cart_card">
          <div className="empty_visuals">
            <div className="icon_circle">
              <ShoppingCartRoundedIcon className="floating_basket" sx={{ fontSize: 60 }} />
            </div>
            <div className="circle_glow"></div>
          </div>
          
          <h1 className="food_modal_name">Your Orders list is empty</h1>
          <p className="empty_description">
            Looks like you haven't made your choice yet. <br/>
            Explore our menu and discover something delicious!
          </p>
          
          <button className="final_checkout_btn" onClick={() => navigate("/")} style={{maxWidth: '250px'}}>
            Start Exploring !!
          </button>
        </div>
      </div>
  );

  return (
    <div className="menu_page_wrapper">
      <div className="menu_container">
        
        <header className="menu_header">
          <h1 className="page_title_premium">My Orders</h1>
          <p className="subtitle">Track and review your past culinary experiences</p>
        </header>

        <div className="orders_grid_premium">
          {orders.map((order) => {
            const status = order.order_status?.toLowerCase() || "pending";
            return (
              <div key={order.order_id} className="order_card_premium">
                <div className="order_card_header">
                  <div className="res_info">
                    <h2 className="res_name_small">{order.restaurant_name}</h2>
                    <p className="order_id_tag">Order ID: #{order.order_id}</p>
                  </div>
                  <div className={`status_pill_premium ${status}`}>
                    {status}
                  </div>
                </div>

                <div className="order_card_body">
                  <div className="price_section">
                    <p className="label">Total Amount</p>
                    <p className="order_total_price">₹{order.total_price || order.total_amount}</p>
                  </div>
                  
                  <button
                    className="view_order_btn"
                    onClick={() => setSelectedOrder(order)}
                  >
                    View Details <ArrowForwardIosRoundedIcon sx={{ fontSize: 14 }} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedOrder && (
        <OrderModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}
    </div>
  );
}