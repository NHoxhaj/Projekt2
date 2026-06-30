const Users = require('../controllers/user.controller');
const { authenticate, adminAuthenticate } = require('../middleware/authenticate');

module.exports = app => {
  app.post('/api/register', Users.register);
  app.post('/api/login', Users.login);
  app.post('/api/logout', Users.logout);
  app.get('/api/checkAuth', authenticate, Users.checkAuth);
  app.delete('/api/admin/users/:userId', adminAuthenticate, Users.deleteUserr);
  
};
