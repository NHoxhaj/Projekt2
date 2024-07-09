// server/middleware/authenticate.js

const jwt = require("jsonwebtoken");
require('dotenv').config();

const secret = process.env.FIRST_SECRET_KEY;

module.exports.authenticate = (req, res, next) => {
  const token = req.cookies.usertoken; // Assuming token is stored in a cookie
  if (!token) {
    return res.status(401).json({ verified: false, message: "No token provided" });
  }

  jwt.verify(token, secret, (err, payload) => {
    if (err) {
      return res.status(401).json({ verified: false, message: "Invalid token" });
    } else {
      req.userId = payload.id;
      next();
    }
  });
};
