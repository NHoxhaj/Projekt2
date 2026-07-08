const User = require("../models/user.model");
const Admin = require("../models/admin.model");
const Order = require("../models/order.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { cookieOptions, jwtSecrets } = require('../config/security.config');
require('dotenv').config();

const sanitizeUser = (user) => {
  const plainUser = user.toObject ? user.toObject() : user;
  const { password, confirmPassword, __v, ...safeUser } = plainUser;
  return safeUser;
};

module.exports.register = async (req, res) => {
  try {
    const user = await User.create(req.body);
    const userToken = jwt.sign(
      { id: user._id, firstName: user.firstName, role: 'user' },
      jwtSecrets.user,
      { expiresIn: '1h' }
    );
    res.cookie("usertoken", userToken, cookieOptions).json({ msg: "Registration successful!", user: sanitizeUser(user) });
  } catch (err) {
    console.error(err); 
    res.status(400).json({ err });
  }
};

module.exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: "Email not found" });
    }

    const correctPassword = await bcrypt.compare(password, user.password);
    if (!correctPassword) {
      return res.status(400).json({ error: "Incorrect password" });
    }
    const token = jwt.sign({ id: user._id, role: 'user' }, jwtSecrets.user, { expiresIn: '1h' });
    res.clearCookie('usertoken', cookieOptions);
    res.cookie("usertoken", token, cookieOptions).json({ user: sanitizeUser(user) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports.logout = (req, res) => {
  res.clearCookie('usertoken', cookieOptions);
  res.sendStatus(200);
};


module.exports.checkAuth = (req, res) => {
  const token = req.cookies.usertoken;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  jwt.verify(token, jwtSecrets.user, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Unauthorized" });
    } else {
      res.status(200).json({ msg: "Authorized", user: decoded });
    }
  });
};

exports.getAllUsersWithOrders = async (req, res) => {
  try {
    const users = await User.find({}).select('-password -__v').lean();
    const usersWithOrders = await Promise.all(
      users.map(async (user) => {
        const orders = await Order.find({ userId: user._id }).lean();
        const totalProducts = orders.reduce((sum, order) => sum + order.items.length, 0);
        const totalMoneySpent = orders.reduce((sum, order) => sum + order.totalPrice, 0);

        return {
          ...user,
          orders,
          totalProducts,
          totalMoneySpent,
        };
      })
    );

    res.status(200).json(usersWithOrders);
  } catch (err) {
    res.status(500).json({ message: "Failed to retrieve users and their orders", error: err });
  }
};

module.exports.deleteUserr = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports.getUserOrderHistory = async (req, res) => {
  const { userId } = req.params;

  try {
    const orders = await Order.find({ userId }).sort({ createdAt: -1 }); 

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: 'No orders found for this user' });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching user order history:', error);
    res.status(500).json({ message: 'Error fetching user order history' });
  }
};

