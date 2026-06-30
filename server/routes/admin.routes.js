const { adminAuthenticate } = require('../middleware/authenticate');
const Admin = require('../controllers/admin.controller');
const User = require('../controllers/user.controller');
const Order=require('../controllers/order.controller');
const Earnings=require('../controllers/earnings.controller')

module.exports = (app) => {
    app.post('/api/admin/login', Admin.login);
    app.post('/api/admin/logout', Admin.logout);
    app.get('/api/admin/orders', adminAuthenticate,Order.getAllOrders);
    app.put('/api/admin/orders/:id',adminAuthenticate,  Order.updateOrderStatusById);
    app.delete('/api/admin/orders/:id',adminAuthenticate,Order.deleteOrder);
    app.get('/api/admin/top-day',adminAuthenticate, Order.getTopOrderDay);
    app.get('/api/adminCheckAuth', adminAuthenticate, Admin.checkAuth);
    app.get('/api/admin/users',adminAuthenticate, User.getAllUsersWithOrders);
    app.get('/api/admin/address-distribution',adminAuthenticate, Order.getOrdersByCityCategory);
    app.get('/api/admin/daily-orders',adminAuthenticate, Order.orderNr);
    app.get('/api/admin/least-ordered',adminAuthenticate, Order.leastOrderedProducts);
    app.get('/api/admin/top-products',adminAuthenticate, Order.topOrders);
    app.get('/api/admin/payment-distribution',adminAuthenticate, Order.paymentType); 
    app.get('/api/admin/earnings',adminAuthenticate, Earnings.getEarnings); 
    app.get('/api/admin/users/:userId/orders',adminAuthenticate, User.getUserOrderHistory); 
};

