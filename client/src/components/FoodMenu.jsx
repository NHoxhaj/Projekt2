import React, { useEffect, useState } from 'react';
import { food_list } from '../assets/assets';
import food from '../assets/foodd.webp'

const FoodMenu = ({ addToCart, searchTerm, handleQuantityChange, quantities }) => {
  const [filteredItems, setFilteredItems] = useState([]);

  useEffect(() => {
    const filteredItems = food_list.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredItems(filteredItems);
  }, [searchTerm]);

  const handleAddToCart = (item) => {
    console.log("Adding to cart:", item);
    const itemWithQuantity = { ...item, quantity: quantities[item._id] || 1 };
    addToCart(itemWithQuantity);
  };

  return (
    <div className="food-menu-container">

      <h1 id='menu'>Menu</h1>
      <div className="food-menu">
        {filteredItems.map(item => (
          <div key={item._id} className="food-item">
            <div id='dflex'>
              <div>
                <h3>{item.name}</h3>
                <img id='img' src={item.image} alt={item.name} />
              </div>
              <div id='desc'>
                <p>{item.description}</p>
                <label id='cmimi' htmlFor="price">Cmimi:</label>
                <p>${item.price.toFixed(2)}</p>
                <label>Sasia:</label>
                <input
                  type="number"
                  min="1"
                  value={quantities[item._id] || 1}
                  onChange={(e) => handleQuantityChange(item._id, parseInt(e.target.value))}
                />
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
