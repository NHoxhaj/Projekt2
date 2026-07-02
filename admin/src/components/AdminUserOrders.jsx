import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { IconButton } from '@mui/material'; 
import DeleteIcon from '@mui/icons-material/Delete'; 
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { apiUrl } from '../config/api';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterType, setFilterType] = useState(''); 
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(apiUrl('/api/admin/users'), { withCredentials: true });
        setUsers(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching users');
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filterUsers = () => {
    switch (filterType) {
      case 'oneTime':
        return users.filter(user => user.orders.length === 1);
      case 'repeat':
        return users.filter(user => user.orders.length > 1 && user.orders.length <= 10);
      case 'loyal':
        return users.filter(user => user.orders.length > 10);
      default:
        return users;
    }
  };

  const viewOrderHistory = (userId) => {
    navigate(`/admin/users/${userId}/orders`); 
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(apiUrl(`/api/admin/users/${userId}`), { withCredentials: true });
        setUsers(users.filter(user => user._id !== userId));
      } catch (err) {
        setError(err.response?.data?.message || 'Error deleting user');
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="admin-page admin-content-page admin-users-page">
      

      <div className="main-content">
        <div className="filter-navbar users-filter-navbar">
          <button onClick={() => setFilterType('oneTime')} className="aaa">
            One-time Buyers  <ExpandMoreIcon style={{ color: 'white', fontSize: '30px', marginLeft: '5px' }} />
          </button>
          <button onClick={() => setFilterType('repeat')} className="aaa">
            Repeat Buyers  <ExpandMoreIcon style={{ color: 'white', fontSize: '30px', marginLeft: '5px' }} />
          </button>
          <button onClick={() => setFilterType('loyal')} className="aaa">
            Loyal Clients  <ExpandMoreIcon style={{ color: 'white', fontSize: '30px', marginLeft: '5px' }} />
          </button>
          <button onClick={() => setFilterType('')} className="aaa">
            Të gjithë  <ExpandMoreIcon style={{ color: 'white', fontSize: '30px', marginLeft: '5px' }} />
          </button>
        </div>

        <table className="table table-striped mt-4 users-table">
          <thead>
            <tr>
              <th>Emri</th>
              <th>Email</th>
              <th>Produkti i preferuar</th>
              <th>Totali i porosive</th>
              <th>Totali i shpenzimeve</th>
              <th>Veprimet</th> 
            </tr>
          </thead>
          <tbody>
            {filterUsers().map((user) => (
              <tr key={user._id}>
                <td data-label="Emri">{user.firstName} {user.lastName}</td>
                <td data-label="Email">{user.email}</td>
                <td data-label="Produkti i preferuar">{getFavoriteProduct(user.orders)}</td> 
                <td data-label="Totali i porosive">{user.orders.length}</td>
                <td>{user.totalMoneySpent.toFixed(2)} €</td>
                <td data-label="Veprimet">
                  <button
                    className="aa"
                    onClick={() => viewOrderHistory(user._id)}
                  >
                    Historiku i porosive
                  </button>
                  <IconButton onClick={() => handleDelete(user._id)}>
                      <DeleteIcon sx={{ color: 'red' }} />
                      </IconButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const getFavoriteProduct = (orders) => {
  const productCount = {};

  orders.forEach(order => {
    order.items.forEach(item => {
      productCount[item.name] = (productCount[item.name] || 0) + item.quantity;
    });
  });

  let favoriteProduct = null;
  let maxCount = 0;
  for (const [product, count] of Object.entries(productCount)) {
    if (count > maxCount) {
      maxCount = count;
      favoriteProduct = product;
    }
  }

  return favoriteProduct;
};

export default AdminUsers;
