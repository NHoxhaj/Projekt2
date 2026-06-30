const { createOrder,getOrderStatusById,getAllOrders, updateOrderStatusById } = require('../controllers/order.controller');
const { authenticate, adminAuthenticate } = require('../middleware/authenticate');

module.exports = app => {
  app.post('/api/orders', authenticate, createOrder);
  app.get('/api/orders', authenticate,getAllOrders);
  app.get('/order/:id/status',authenticate, getOrderStatusById);
  app.put('/order/:id/status', adminAuthenticate, updateOrderStatusById);
};
