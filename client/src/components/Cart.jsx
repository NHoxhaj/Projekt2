import React, { useEffect, useState } from 'react';
import { assetUrl } from '../config/api';

const Cart = ({ cartItems, paymentMethod, setPaymentMethod, removeFromCart, placeOrder, qyteti, setQyteti, adresa, setAdresa }) => {
  const [itemsInCart, setItemsInCart] = useState([]);
  const transportFee = 3; 

  useEffect(() => {
    setItemsInCart(cartItems);
  }, [cartItems]);

  const handlePlaceOrder = () => {
    if (!qyteti || !paymentMethod || !adresa || itemsInCart.length === 0) {
      alert('Të gjitha fushat e nevojshme duhet të plotësohen.');
      return;
    }
    placeOrder({ qyteti, paymentMethod, adresa, items: itemsInCart });
  };

  const totalPrice = itemsInCart.reduce((total, item) => total + item.price * item.quantity, 0) + transportFee;

  return (
    <div className="food-menuu cart-container">
      <h2 id='menuu'>Karta</h2>
      <ul className="space-y-2">
        {itemsInCart.map((item) => (
          <div key={item.foodItemId} className="food-item cart-item" id='dflex'>
            <div className="cart-card-media">
              <h3 className="text-lg font-semibold">{item.name}</h3>
              <img id='img' src={assetUrl(item.image)} alt={item.name} className="w-16 h-16 object-cover" />
            </div>
            <div id='desc' className="cart-card-details">
              <p className="cart-card-description"><span>Perberesit:</span> {item.description}</p>
              <div className="cart-card-meta">
                <div className="cart-card-quantity">
                  <label htmlFor="quantity">Sasia:</label>
                  <p>{item.quantity}</p>
                </div>
                <p className="text-gray-600 cart-card-price">Cmimi: ${item.price.toFixed(2)}</p>
              </div>
              <button onClick={() => removeFromCart(item.foodItemId)} className="remove">Remove</button>
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
