import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminNavBar from './components/AdminNavBarr';
import axios from 'axios';
import './App.css';
import AdminAuth from './components/AdminAuth';
import AdminOrders from './components/admin';
import EarningsPage from './components/EarningsPage';
import AdminUsers from './components/AdminUserOrders';
import Stat from './components/Stat';
import UserOrderHistory from './components/OrderHistory';

axios.defaults.withCredentials = true;

const App = () => {
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);
  const [admin, setAdmin] = useState(null);


  useEffect(() => {
    const checkAdminLoginStatus = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/adminCheckAuth', { withCredentials: true });
        if (response.status === 200) {
          setAdminLoggedIn(true);
          setAdmin(response.data.admin);
        }
      } catch (err) {
        handleAdminAuthError(err);
      }
    };
    checkAdminLoginStatus();
  }, []);


  const handleAdminAuthError = (err) => {
    if (err.response && err.response.status === 401) {
      setAdminLoggedIn(false);
      setAdmin(null);
      console.error('Unauthorized: Please log in');
    } else {
      console.error('Error checking login status:', err);
    }
  };

  
  const handleAdminLogout = async () => {
    try {
      await axios.get('http://localhost:8000/api/admin/logout');
      setAdminLoggedIn(false);
      setAdmin(null);
    } catch (err) {
      console.error('Error logging out:', err);
      alert('An unexpected error occurred');
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="/AdminAuth" element={<AdminAuth setAdminLoggedIn={setAdminLoggedIn} setAdmin={setAdmin} />} />
        <Route path="/admin/orders" element={adminLoggedIn ? (
          <>
            <AdminNavBar handleAdminLogout={handleAdminLogout} />
            <AdminOrders adminLoggedIn={adminLoggedIn} admin={admin} />
          </>
        ) : (
          <Navigate to="/AdminAuth" />
        )} />
         <Route path="/admin/users" element={adminLoggedIn ? (
          <>
            <AdminNavBar handleAdminLogout={handleAdminLogout} />
            <AdminUsers />
          </>
        ) : (
          <Navigate to="/AdminAuth" />
        )} />
         <Route path="/admin/earnings" element={adminLoggedIn ? (
          <>
            <AdminNavBar handleAdminLogout={handleAdminLogout} />
            <EarningsPage />
          </>
        ) : (
          <Navigate to="/AdminAuth" />
        )} />
       
         <Route path="/admin/users/:userId/orders" element={adminLoggedIn ? (
          <>
            <AdminNavBar handleAdminLogout={handleAdminLogout} />
            <UserOrderHistory />
          </>
        ) : (
          <Navigate to="/AdminAuth" />
        )} />
              <Route path="/admin/stat" element={adminLoggedIn ? (
          <>
            <AdminNavBar handleAdminLogout={handleAdminLogout} />
            <Stat />
          </>
        ) : (
          <Navigate to="/AdminAuth" />
        )} />
        
      </Routes>
    </Router>
  );
};

export default App;
