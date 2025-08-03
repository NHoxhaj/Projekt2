import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box} from '@mui/material';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [open, setOpen] = useState(false); 
  const [newOrder, setNewOrder] = useState({
    qyteti: '',
    adresa: '',
    totalPrice: '',
    paymentMethod: 'cash', 
    items: [{ name: '', quantity: 1, price: '' }], 
  });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/admin/orders', {
          withCredentials: true,
        });
        const sortedOrders = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setOrders(sortedOrders);
      } catch (err) {
        console.error('Error fetching orders:', err);
      }
    };
  
    fetchOrders();
  }, []);
  

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(
        `http://localhost:8000/api/admin/orders/${orderId}`,
        { status: newStatus },
        { withCredentials: true }
      );
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      console.error('Error updating order status:', err);
    }
  };

  const handleDelete = async (orderId) => {
  
      try {
        await axios.delete(`http://localhost:8000/api/admin/orders/${orderId}`, {
          withCredentials: true,
        });
        setOrders(orders.filter(order => order._id !== orderId));
      } catch (err) {
        console.error('Error deleting order:', err);
        alert('Failed to delete order');
      }
    
  };
  const pendingOrders = orders.filter(order => order.status === 'Pending');
  const cookingOrders = orders.filter(order => order.status === 'Cooking');
  const finishedOrders = orders.filter(order => order.status === 'Finished');

  const renderOrderList = (orderList) => (
    <ul>
      {orderList.map(order => (
        <li key={order._id} className="order-item">
          <p><span className="label">Numri i porosisë:</span> {order.orderNumber}</p>
          <p><span className="label">Data:</span> {new Date(order.createdAt).toLocaleString()}</p>
          <p><span className="label">Qyteti:</span> {order.qyteti}</p>
          <p><span className="label">Adresa:</span> {order.adresa}</p>
          <p><span className="label">Statusi:</span> 
            <select
              value={order.status}
              onChange={(e) => handleStatusChange(order._id, e.target.value)}
            >
              <option value="Pending">Pending</option>
              <option value="Cooking">Cooking</option>
              <option value="Finished">Finished</option>
            </select>
          </p>
          <p><span className="label">Çmimi total:</span> {order.totalPrice} euro</p>
          <p><span className="label">Metoda e pagesës:</span> {order.paymentMethod}</p>
          <div>
            {order.items && order.items.length > 0 ? (
              order.items.map((item) => (
                <div key={item._id} className="">
                  <p><span className="label1">{item.name}</span> </p>
                  <p><span className="label">Sasia:</span> {item.quantity}</p>
                </div>
              ))
            ) : (
              <p>No items found for this order.</p>
            )}
          </div>
          <button id="delete" onClick={() => handleDelete(order._id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
  

  return (
    <div className="ordersContainer" style={{ marginLeft: '250px', padding: '20px' }}>
      <div id='titulli'>
      <Box display="flex" alignItems="center">
        <h1 id='title'>Porositë</h1>
      </Box></div>

      <div className="order-lists">
        <div className="order-list1">
          <h2 id='pending'>Pending</h2>
          {renderOrderList(pendingOrders)}
        </div>
        <div className="order-list2">
          <h2 id='cooking'>Cooking</h2>
          {renderOrderList(cookingOrders)}
        </div>
        <div className="order-list3">
          <h2 id='finished'>Finished</h2>
          {renderOrderList(finishedOrders)}
        </div>
      </div>

    </div>
  );
};

export default AdminOrders;
