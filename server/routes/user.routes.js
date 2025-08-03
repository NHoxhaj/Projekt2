const Users = require('../controllers/user.controller');
const { authenticate } = require('../middleware/authenticate');

module.exports = app => {
  app.post('/api/register', Users.register);
  app.post('/api/login', Users.login);
  app.get('/api/logout', Users.logout);
  app.get('/api/checkAuth', authenticate, Users.checkAuth);
  app.delete('/api/admin/users/:userId', Users.deleteUserr);
  
};
