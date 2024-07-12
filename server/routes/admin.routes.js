const Admin = require('../controllers/admin.controller');
const { adminAuthenticate } = require('../middleware/authenticate');
const Status=require('../controllers/order.controllers');

module.exports = (app) => {
    app.post('/api/admin/register', Admin.register);
    app.post('/api/admin/login', Admin.login);
    app.get('/api/admin/logout', Admin.logout);
    app.get('/api/admin/orders', Admin.getAllClientsOrders);
    app.put('/api/admin/orders/:id', adminAuthenticate, Status.updateOrderStatus);
    app.delete('/api/admin/orders/:id', Admin.deleteClient);
    app.get('/api/adminCheckAuth', adminAuthenticate, Admin.checkAuth);
};
