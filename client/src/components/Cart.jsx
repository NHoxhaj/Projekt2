import React, { useEffect, useState } from 'react';
import { food_list } from '../assets/assets';

const Cart = ({ cartItems, paymentMethod, setPaymentMethod, removeFromCart, placeOrder, qyteti, setQyteti, adresa, setAdresa }) => {
  const [itemsInCart, setItemsInCart] = useState([]);
  const transportFee = 3; 

  useEffect(() => {
    console.log("cartItems:", cartItems); 
    
    const selectedItems = food_list.filter(item => 
      cartItems.some(cartItem => cartItem.foodItemId === item._id)
    );
    
    const itemsWithQuantities = selectedItems.map(item => {
      const cartItem = cartItems.find(cartItem => cartItem.foodItemId === item._id);
      return { ...item, quantity: cartItem.quantity };
    });
    
    console.log("itemsWithQuantities:", itemsWithQuantities); 
    
    setItemsInCart(itemsWithQuantities);
  }, [cartItems]);

  const handlePlaceOrder = () => {
    if (!qyteti || !paymentMethod || !adresa || itemsInCart.length === 0) {
      alert('Të gjitha fushat e nevojshme duhet të plotësohen.');
      return;
    }
    placeOrder({ qyteti, paymentMethod, adresa, items: itemsInCart });
  };

  const totalPrice = itemsInCart.reduce((total, item) => total + item.price * item.quantity, 0) + transportFee;

  console.log("Current paymentMethod:", paymentMethod); 

  return (
    <div className="food-menuu">
      <h2 id='menuu'>Karta</h2>
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
              <p className="text-gray-600">Cmimi: ${item.price.toFixed(2)}</p>
              <button onClick={() => removeFromCart(item._id)} className="remove">Remove</button>
            </div>
          </div>
        ))}
      </ul>
      <p className="form-group">
        <p>
        <label htmlFor="qyteti">Qyteti: </label>
        <input
          type="text"
          id="qyteti"
          value={qyteti}
          onChange={(e) => setQyteti(e.target.value)}
        />
      
      </p>
      <p>
        <label htmlFor="adresa">Adresa:</label>
        <input
          type="text"
          id="adresa"
          value={adresa}
          onChange={(e) => setAdresa(e.target.value)}
        />
        </p>
      </p>
      <p className="form-group">
        <p>
        <label htmlFor="paymentMethod">Metoda e pagesës: </label>
        </p>
        <p>
          <input
            type="radio"
            id="Cash"
            name="paymentMethod"
            value="Cash"
            checked={paymentMethod === 'Cash'}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          <label htmlFor="Cash"> Cash</label>
          </p>
          <p>
          <input
            type="radio"
            id="creditCard"
            name="paymentMethod"
            value="CreditCard"
            checked={paymentMethod === 'CreditCard'}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          <label htmlFor="creditCard"> Credit Card </label>
          </p>
      
      </p>
      <div className="total-price">
        <h5>Cmimi total (përfshirë transportin): {totalPrice.toFixed(2)} euro</h5>
      </div>
      <button id='porosia' onClick={handlePlaceOrder}>Dërgo Porosinë</button>
    </div>
  );
};

export default Cart;
