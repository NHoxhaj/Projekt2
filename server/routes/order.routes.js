const { createOrder, getOrderStatus, getAllOrders } = require('../controllers/order.controllers');
const { authenticate } = require('../middleware/authenticate');

module.exports = app => {
  app.post('/api/orders', authenticate, createOrder);
  app.get('/api/orders/:id/status', authenticate, getOrderStatus);
  app.get('/api/orders', authenticate, getAllOrders);
};