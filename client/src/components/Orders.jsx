import React, { useEffect, useState } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import NavBar from './Navbar.jsx';

const socket = io('http://localhost:8000');

const Orders = ({ loggedIn, user, handleLogout, setSearchTerm }) => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/orders', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setOrders(response.data);
      } catch (err) {
        console.error('Error fetching orders:', err);
      }
    };

    fetchOrders();

    socket.on('orderStatusUpdated', (updatedOrder) => {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === updatedOrder._id ? updatedOrder : order
        )
      );
    });

    return () => {
      socket.off('orderStatusUpdated');
    };
  }, []);

  return (
    <div>
      <NavBar loggedIn={loggedIn} user={user} handleLogout={handleLogout} setSearchTerm={setSearchTerm} />
      <div className="orders-container">
        <h1>Porosite e tua</h1>
        {orders.length > 0 ? (
          <ul>
            {orders.map((order, index) => (
              <li key={index} className="order-item">
                <p>Numri i porosise: {order.orderNumber}</p>
                <p>Data: {new Date(order.createdAt).toLocaleString()}</p>
                <p>Qyteti: {order.qyteti}</p>
                <p>Adresa: {order.adresa}</p>
                <p>Statusi: {order.status}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>Nuk ke asnje porosi.</p>
        )}
      </div>
    </div>
  );
};

export default Orders;
