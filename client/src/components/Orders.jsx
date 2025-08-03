import React, { useEffect, useState } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import NavBar from './Navbar.jsx';


const socket = io('http://localhost:8000', {
  transports: ['websocket', 'polling'],
});

const Orders = ({ loggedIn, user, handleLogout, setSearchTerm }) => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/orders', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
  
        console.log('Fetched orders:', response.data);
  
        if (Array.isArray(response.data)) {
          const sortedOrders = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setOrders(sortedOrders);
        } else {
          console.error('Expected array but got:', response.data);
          setOrders([]);
        }
      } catch (err) {
        console.error('Error fetching orders:', err.message);
      }
    };
  
    fetchOrders();
  
    socket.on('orderStatusUpdated', (updatedOrder) => {
      console.log('Order status updated:', updatedOrder);
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
        <h1>Porositë e tua</h1>
        <div>
          {orders.length > 0 ? (
            orders.map((order) => (
              <div key={order._id} id="porosiaa">
                <div className="order-details">
                  <p> <span className="label">Numri i porosisë: </span>{order.orderNumber}</p>
                  <p> <span className="label">Data: </span> {new Date(order.createdAt).toLocaleString()}</p>
                  <p> <span className="label">Statusi: </span> {order.status}</p>
                  <p> <span className="label">Cmimi total: </span>{order.totalPrice} Euro</p>
                </div>
                <div className="order-items">
                  {order.items && order.items.length > 0 ? (
                    order.items.map((item) => (
                      <div key={item._id} className="order-item-detail">
                        <p> <span className="label">Emri: </span>{item.name}</p>
                        <p> <span className="label">Sasia: </span> {item.quantity}</p>
                        <img src={item.image} alt={item.name} style={{ width: '100px', height: '100px' }} />
                        
                      </div>
                    ))
                  ) : (
                    <p>No items found for this order.</p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p>Nuk ke asnjë porosi.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;




