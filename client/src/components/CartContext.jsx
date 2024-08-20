// src/CartContext.js
import React, { createContext, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [qyteti, setQyteti] = useState('');
  const [adresa, setAdresa] = useState('');

  const addToCart = (item) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((cartItem) => cartItem.id === item._id);
      if (existingItem) {
        return prevItems.map((cartItem) =>
          cartItem.id === item._id
            ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
            : cartItem
        );
      } else {
        return [...prevItems, { id: item._id, quantity: item.quantity }];
      }
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
    setQyteti('');
    setAdresa('');
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        qyteti,
        setQyteti,
        adresa,
        setAdresa,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
