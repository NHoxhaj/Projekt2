const jwt = require("jsonwebtoken");
const { jwtSecrets } = require('../config/security.config');
require('dotenv').config();

module.exports.authenticate = (req, res, next) => {
  const token = req.cookies.usertoken;
  if (!token) {
    return res.status(401).json({ verified: false, message: "No token provided" });
  }

  jwt.verify(token, jwtSecrets.user, (err, payload) => {
    if (err) {
      return res.status(401).json({ verified: false, message: "Invalid token" });
    }

    if (payload.role && payload.role !== 'user') {
      return res.status(403).json({ verified: false, message: "Forbidden" });
    }

    req.userId = payload.id;
    return next();
  });
}

module.exports.adminAuthenticate = (req, res, next) => {
  const token = req.cookies.admintoken;

  if (!token) {
    return res.status(401).json({ verified: false, message: "No token provided" });
  }

  jwt.verify(token, jwtSecrets.admin, (err, payload) => {
    if (err) {
      return res.status(401).json({ verified: false, message: "Invalid token" });
    }

    if (payload.role !== 'admin') {
      return res.status(403).json({ verified: false, message: "Forbidden" });
    }

    req.adminId = payload.id;
    return next();
  });
};
