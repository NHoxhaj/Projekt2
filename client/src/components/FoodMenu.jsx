import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { food_list } from '../assets/assets';
import { apiUrl, assetUrl } from '../config/api';


const FoodMenu = ({ addToCart, searchTerm, handleQuantityChange, quantities }) => {
  const [filteredItems, setFilteredItems] = useState([]);
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await axios.get(apiUrl('/api/foodItems'));
        setMenuItems(response.data);
      } catch (error) {
        setMenuItems(food_list);
      }
    };

    fetchMenuItems();
  }, []);

  useEffect(() => {
    const Items = menuItems.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredItems(Items);
  }, [menuItems, searchTerm]);

  const handleAddToCart = (item) => {
    const itemWithQuantity = { ...item, quantity: quantities[item._id] || 1 };
    addToCart(itemWithQuantity);
  };

  return (
    <div className="food-menu-container">
      <h1 id='menu'>Menu</h1>
      <div className="food-menu">
        {filteredItems.map(item => (
          <div key={item._id} className="food-item">
            <div className="food-card-content">
              <div id='dflex' className="food-card-header">
                <h3>{item.name}</h3>
              </div>
              <div className="food-card-main">
                <img id='img' className="food-card-image" src={assetUrl(item.image)} alt={item.name} />
                <div id='desc' className="food-card-details">
                  <p className="food-card-description"><span>Perberesit:</span> {item.description}</p>
                </div>
              </div>
              <div className="food-card-meta">
                <div className="food-card-price">
                  <label id='cmimi' htmlFor="price">Cmimi:</label>
                  <p>${item.price.toFixed(2)}</p>
                </div>
                <div className="food-card-quantity">
                  <label id='sasia'>Sasia:</label>
                  <input
                  id='input-line'
                    type="number"
                    min="1"
                    value={quantities[item._id] || 1}
                    onChange={(e) => handleQuantityChange(item._id, parseInt(e.target.value))}
                  />
                </div>
              </div>
              <div className="food-card-actions">
                <button id='order' onClick={() => handleAddToCart(item)}>Shto ne karte</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FoodMenu;
