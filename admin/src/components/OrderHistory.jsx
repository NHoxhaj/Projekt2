import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const UserOrderHistory = () => {
  const { userId } = useParams(); 
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserOrders = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/admin/users/${userId}/orders`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setOrders(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching order history');
        setLoading(false);
      }
    };

    fetchUserOrders();
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="user-order-history admin-content-page">
      <h1>Historiku i porosive</h1>
      <ul>
        {orders.map(order => (
          <li key={order._id} className="order-item">
            <p><strong>Numri i porosise:</strong> {order.orderNumber}</p>
            <p><strong>Data:</strong> {new Date(order.createdAt).toLocaleString()}</p>
            <p><strong>Qyteti:</strong> {order.qyteti}</p>
            <p><strong>Adresa:</strong> {order.adresa}</p>
            <p><strong>Cmimi total:</strong> {order.totalPrice} €</p>
            <p><strong>Metoda e pageses:</strong> {order.paymentMethod}</p>
            <div>
              <h4>Produktet:</h4>
              {order.items && order.items.length > 0 ? (
                order.items.map((item) => (
                  <div key={item._id} className="order-item-details">
                    <p>{item.name} - Sasia: {item.quantity} - Cmimi: {item.price} €</p>
                  </div>
                ))
              ) : (
                <p>No items found for this order.</p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserOrderHistory;
