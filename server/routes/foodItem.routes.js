const FoodItemController = require('../controllers/foodItem.controller');

module.exports = app => {
  app.post('/api/foodItems', FoodItemController.createFoodItem);
  app.get('/api/foodItems', FoodItemController.getAllFoodItems);
};