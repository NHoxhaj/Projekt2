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
import { apiUrl, setupCsrfProtection } from './config/api';
import { Analytics } from '@vercel/analytics/react';

axios.defaults.withCredentials = true;
setupCsrfProtection();

const App = () => {
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);
  const [admin, setAdmin] = useState(null);


  useEffect(() => {
    const checkAdminLoginStatus = async () => {
      try {
        const response = await axios.get(apiUrl('/api/adminCheckAuth'), { withCredentials: true });
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
      await axios.post(apiUrl('/api/admin/logout'), {}, { withCredentials: true });
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
        <Route path="/" element={<AdminAuth setAdminLoggedIn={setAdminLoggedIn} setAdmin={setAdmin} />} />
        <Route path="/admin/orders" element={adminLoggedIn ? (
          <>
            <AdminNavBar handleAdminLogout={handleAdminLogout} />
            <AdminOrders adminLoggedIn={adminLoggedIn} admin={admin} />
          </>
        ) : (
          <Navigate to="/" />
        )} />
         <Route path="/admin/users" element={adminLoggedIn ? (
          <>
            <AdminNavBar handleAdminLogout={handleAdminLogout} />
            <AdminUsers />
          </>
        ) : (
          <Navigate to="/" />
        )} />
         <Route path="/admin/earnings" element={adminLoggedIn ? (
          <>
            <AdminNavBar handleAdminLogout={handleAdminLogout} />
            <EarningsPage />
          </>
        ) : (
          <Navigate to="/" />
        )} />
       
         <Route path="/admin/users/:userId/orders" element={adminLoggedIn ? (
          <>
            <AdminNavBar handleAdminLogout={handleAdminLogout} />
            <UserOrderHistory />
          </>
        ) : (
          <Navigate to="/" />
        )} />
              <Route path="/admin/stat" element={adminLoggedIn ? (
          <>
            <AdminNavBar handleAdminLogout={handleAdminLogout} />
            <Stat />
          </>
        ) : (
          <Navigate to="/" />
        )} />
        
      </Routes>
      <Analytics />
    </Router>
  );
};

export default App;
