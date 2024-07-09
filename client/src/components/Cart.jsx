import React, { useEffect, useState } from 'react';
import { food_list } from '../assets/assets';

const Cart = ({ cartItems, removeFromCart, placeOrder }) => {
  const [itemsInCart, setItemsInCart] = useState([]);

  useEffect(() => {
    const selectedItems = food_list.filter(item => cartItems.some(cartItem => cartItem.id === item._id));
    const itemsWithQuantities = selectedItems.map(item => {
      const cartItem = cartItems.find(cartItem => cartItem.id === item._id);
      return { ...item, quantity: cartItem.quantity };
    });
    setItemsInCart(itemsWithQuantities);
  }, [cartItems]);

  return (
    <div className="food-menu">
      <h2 id='menu'>Karta</h2>
      <ul className="space-y-2">
        {itemsInCart.map((item) => (
          <div key={item._id} className="food-item" id='dflex'>
            <div>
              <h3 className="text-lg font-semibold">{item.name}</h3>
              <img id='img' src={item.image} alt={item.name} className="w-16 h-16 object-cover" />
            </div>
            <div id='desc'>
              <p>{item.description}</p>
              <label htmlFor="quantity">Sasia:</label>
              <p>{item.quantity}</p>
              <p className="text-gray-600">${item.price.toFixed(2)}</p>
              <button onClick={() => removeFromCart(item._id)} className="remove">Remove</button>
            </div>
          </div>
          
        ))}
      </ul>
      <button onClick={placeOrder} id="order">Perfundo porosine</button>
    </div>
  );
};

export default Cart;
