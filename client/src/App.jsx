import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Auth from './components/Auth';
import FoodMenu from './components/FoodMenu';
import Cart from './components/Cart';
import NavBar from './components/Navbar';
import AdminNavBar from './components/AdminNavbar';
import axios from 'axios';
import './App.css';
import Orders from './components/Orders';
import AdminAuth from './components/AdminAuth';
import AdminOrders from './components/admin';
import Footer from './components/Footer';
import 'bootstrap/dist/css/bootstrap.min.css';

axios.defaults.withCredentials = true;

const App = () => {
  const [cartItems, setCartItems] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);
  const [admin, setAdmin] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [qyteti, setQyteti] = useState('');
  const [adresa, setAdresa] = useState('');
  const [cartItemCount, setCartItemCount] = useState(0); // New state for item count

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/checkAuth', { withCredentials: true });
        if (response.status === 200) {
          setLoggedIn(true);
          setUser(response.data.user);
        }
      } catch (err) {
        handleAuthError(err);
      }
    };
    checkLoginStatus();
  }, []);

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

  const handleAuthError = (err) => {
    if (err.response && err.response.status === 401) {
      setLoggedIn(false);
      setUser(null);
      console.error('Unauthorized: Please log in');
    } else {
      console.error('Error checking login status:', err);
    }
  };

  const handleAdminAuthError = (err) => {
    if (err.response && err.response.status === 401) {
      setAdminLoggedIn(false);
      setAdmin(null);
      console.error('Unauthorized: Please log in');
    } else {
      console.error('Error checking login status:', err);
    }
  };

  const addToCart = (item) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(cartItem => cartItem.id === item._id);
      let newItems;
      if (existingItem) {
        newItems = prevItems.map(cartItem =>
          cartItem.id === item._id ? { ...cartItem, quantity: cartItem.quantity + item.quantity } : cartItem
        );
      } else {
        newItems = [...prevItems, { id: item._id, quantity: item.quantity }];
      }
      // Update item count
      setCartItemCount(newItems.reduce((total, curr) => total + curr.quantity, 0));
      return newItems;
    });
  };

  const removeFromCart = (id) => {
    setCartItems(prevItems => {
      const updatedItems = prevItems.filter(item => item.id !== id);
      // Update item count
      setCartItemCount(updatedItems.reduce((total, curr) => total + curr.quantity, 0));
      return updatedItems;
    });
  };

  const handleQuantityChange = (id, newQuantity) => {
    setQuantities(prevQuantities => ({ ...prevQuantities, [id]: newQuantity }));
  };

  const placeOrder = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/orders', {
        items: cartItems.map(item => ({ id: item.id, quantity: item.quantity })),
        qyteti,
        adresa,
        orderNumber: `ORD-${Date.now()}`
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.status === 201) {
        alert('Porosia u dergua');
        setCartItems([]);
        setQuantities({});
        setQyteti('');
        setAdresa('');
        setCartItemCount(0); 
      } else {
        alert('Failed to place order');
      }
    } catch (err) {
      console.error('Error placing order:', err);
      alert('An unexpected error occurred');
    }
  };

  const handleLogout = async () => {
    try {
      await axios.get('http://localhost:8000/api/logout');
      setLoggedIn(false);
      setUser(null);
    } catch (err) {
      console.error('Error logging out:', err);
      alert('An unexpected error occurred');
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
        <Route path="/" element={<Home />} />
        <Route path="/AdminAuth" element={<AdminAuth setAdminLoggedIn={setAdminLoggedIn} setAdmin={setAdmin} />} />
        <Route path="/auth" element={<Auth setLoggedIn={setLoggedIn} setUser={setUser} />} />
        <Route path="/menu" element={loggedIn ? (
          <>
            <NavBar 
              loggedIn={loggedIn} 
              user={user} 
              handleLogout={handleLogout} 
              setSearchTerm={setSearchTerm} 
              cartItemCount={cartItemCount} // Pass cart item count
            />
            <div className="flex">
              <div className="w-2/3 p-4">
                <FoodMenu 
                  addToCart={addToCart} 
                  searchTerm={searchTerm} 
                  handleQuantityChange={handleQuantityChange} 
                  quantities={quantities} 
                />
              </div>
            </div>
            <Footer /> 
          </>
        ) : (
          <Navigate to="/auth" />
        )} />
        <Route path="/admin/orders" element={adminLoggedIn ? (
          <>
            <AdminNavBar handleLogout={handleAdminLogout} />
            <AdminOrders adminLoggedIn={adminLoggedIn} admin={admin} />
          </>
        ) : (
          <Navigate to="/AdminAuth" />
        )} />
        <Route path="/cart" element={loggedIn ? (
          <>
            <NavBar 
              loggedIn={loggedIn} 
              user={user} 
              handleLogout={handleLogout} 
              setSearchTerm={setSearchTerm} 
              cartItemCount={cartItemCount} // Pass cart item count
            />
            <Cart 
              cartItems={cartItems} 
              removeFromCart={removeFromCart} 
              placeOrder={placeOrder} 
              qyteti={qyteti}
              setQyteti={setQyteti}
              adresa={adresa}
              setAdresa={setAdresa}
            />
          </>
        ) : (
          <Navigate to="/auth" />
        )} />
        
        <Route path="/orders" element={loggedIn ? (
          <>
            <Orders 
              cartItems={cartItems} 
              placeOrder={placeOrder} 
              loggedIn={loggedIn} 
              user={user} 
              handleLogout={handleLogout} 
              setSearchTerm={setSearchTerm} 
            />
          </>
        ) : (
          <Navigate to="/auth" />
        )} />
      </Routes>
    </Router>
  );
};

export default App;
