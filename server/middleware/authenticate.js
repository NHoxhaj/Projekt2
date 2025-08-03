const jwt = require("jsonwebtoken");
require('dotenv').config();

const secret = process.env.FIRST_SECRET_KEY;

module.exports.authenticate = (req, res, next) => {
  const token = req.cookies.usertoken || (req.headers.authorization && req.headers.authorization.split(' ')[1]);
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
}

module.exports.adminAuthenticate = (req, res, next) => {
  let token = req.cookies.admintoken;

  if (!token && req.headers.authorization) {
    const authHeaderParts = req.headers.authorization.split(' ');
    if (authHeaderParts.length === 2) {
      token = authHeaderParts[1];
    }
  }

  if (!token) {
    return res.status(401).json({ verified: false, message: "No token provided" });
  }

  jwt.verify(token, secret, (err, payload) => {
    if (err) {
      return res.status(401).json({ verified: false, message: "Invalid token" });
    } else {
      req.adminId = payload.id;
      console.log(`Admin ID: ${req.adminId}`); 
      next();
    }
  });
};
