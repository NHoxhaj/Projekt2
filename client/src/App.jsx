import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './components/Auth';
import FoodMenu from './components/FoodMenu';
import Cart from './components/Cart';
import NavBar from './components/Navbar';
import axios from 'axios';
import './App.css';
import Orders from './components/Orders';
import Footer from './components/Footer';
import 'bootstrap/dist/css/bootstrap.min.css';

axios.defaults.withCredentials = true;

const App = () => {
  const [cartItems, setCartItems] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [qyteti, setQyteti] = useState('');
  const [adresa, setAdresa] = useState('');
  const [paymentMethod, setPaymentMethod] = useState("");
  const [cartItemCount, setCartItemCount] = useState(0); 


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



  const handleAuthError = (err) => {
    if (err.response && err.response.status === 401) {
      setLoggedIn(false);
      setUser(null);
      console.error('Unauthorized: Please log in');
    } else {
      console.error('Error checking login status:', err);
    }
  };

  

const addToCart = (item) => {
  setCartItems((prevItems) => {
    const existingItem = prevItems.find((cartItem) => cartItem.foodItemId === item._id);

    if (existingItem) {
      return prevItems.map((cartItem) =>
        cartItem.foodItemId === item._id
          ? { ...cartItem, quantity: cartItem.quantity + item.quantity } 
          : cartItem
      );
    } else {
      return [
        ...prevItems,
        {
          foodItemId: item._id,
          name: item.name,
          description: item.description,
          price: item.price,
          image: item.image,
          quantity: item.quantity || 1, 
        },
      ];
    }
  });

  setCartItemCount((prevCount) => prevCount + item.quantity || 1);
};


const removeFromCart = (id) => {
  setCartItems(prevItems => {
    const updatedItems = prevItems.filter(item => item.foodItemId !== id); 
    setCartItemCount(updatedItems.reduce((total, curr) => total + curr.quantity, 0));
    return updatedItems;
  });
};


  const handleQuantityChange = (id, newQuantity) => {
    setQuantities(prevQuantities => ({ ...prevQuantities, [id]: newQuantity }));
  };

  const placeOrder = async () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty.');
      return;
    }
  
    if (!qyteti || !adresa) {
      alert('Please provide both city and address.');
      return;
    }
  
    try {
      if (!user || !user._id) {
        throw new Error("User is not logged in.");
      }
  
      const orderPayload = {
        userId: user._id, 
        items: cartItems.map((item) => ({
          foodItemId: item.foodItemId,
          name: item.name,
          description:item.description,
          image: item.image,
          quantity: item.quantity,
          price: item.price,
        })),
        totalPrice: cartItems.reduce((total, item) => total +3+ item.quantity * item.price, 0),
        qyteti,
        adresa,
         orderNumber: `ORD-${Date.now()}`,
        paymentMethod,
      };
  
      const response = await axios.post('http://localhost:8000/api/orders', orderPayload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
  
      if (response.status === 201) {
        alert('Order placed successfully!');
        setCartItems([]);
        setCartItemCount(0);
        setQyteti('');
        setAdresa('');
        setPaymentMethod('');
      }
    } catch (err) {
      console.error('Error placing order:', err.response?.data?.message || err.message);
      alert(`Error placing order: ${err.response?.data?.message || err.message}`);
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


  return (
    <Router>
      <Routes>
  
        <Route path="/auth" element={<Auth setLoggedIn={setLoggedIn} setUser={setUser} />} />
        <Route path="/menu" element={loggedIn ? (
          <>
            <NavBar 
              loggedIn={loggedIn} 
              user={user} 
              handleLogout={handleLogout} 
              setSearchTerm={setSearchTerm} 
              cartItemCount={cartItemCount}
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
        <Route path="/cart" element={loggedIn ? (
          <>
            <NavBar 
              loggedIn={loggedIn} 
              user={user} 
              handleLogout={handleLogout} 
              setSearchTerm={setSearchTerm} 
              cartItemCount={cartItemCount} 
            />
            <Cart 
              cartItems={cartItems} 
              removeFromCart={removeFromCart} 
              placeOrder={placeOrder} 
              qyteti={qyteti}
              setQyteti={setQyteti}
              adresa={adresa}
              setAdresa={setAdresa}
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
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
