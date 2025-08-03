const { adminAuthenticate } = require('../middleware/authenticate');
const Admin = require('../controllers/admin.controller');
const User = require('../controllers/user.controller');
const Order=require('../controllers/order.controller');
const Earnings=require('../controllers/earnings.controller')

module.exports = (app) => {
    app.post('/api/admin/register', Admin.register);
    app.post('/api/admin/login', Admin.login);
    app.get('/api/admin/logout', Admin.logout);
    app.get('/api/admin/orders', adminAuthenticate,Order.getAllOrders);
    app.put('/api/admin/orders/:id',  Order.updateOrderStatusById);
    app.delete('/api/admin/orders/:id', Order.deleteOrder);
    app.get('/api/admin/top-day',Order.getTopOrderDay);
    app.get('/api/adminCheckAuth', adminAuthenticate, Admin.checkAuth);
    app.get('/api/admin/users', User.getAllUsersWithOrders);
    app.get('/api/admin/address-distribution', Order.getOrdersByCityCategory);
    app.get('/api/admin/daily-orders', Order.orderNr);
    app.get('/api/admin/least-ordered', Order.leastOrderedProducts);
    app.get('/api/admin/top-products',Order.topOrders);
    app.get('/api/admin/payment-distribution',Order.paymentType); 
    app.get('/api/admin/earnings', Earnings.getEarnings); 
    app.get('/api/admin/users/:userId/orders', User.getUserOrderHistory); 
};

