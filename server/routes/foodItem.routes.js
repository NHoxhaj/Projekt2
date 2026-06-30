const FoodItemController = require('../controllers/foodItem.controller');
const { adminAuthenticate } = require('../middleware/authenticate');

module.exports = app => {
  app.post('/api/foodItems', adminAuthenticate, FoodItemController.createFoodItem);
  app.get('/api/foodItems', FoodItemController.getAllFoodItems);
};
