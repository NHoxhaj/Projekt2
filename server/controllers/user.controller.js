const User = require("../models/user.model");
const Admin = require("../models/admin.model");
const Order = require("../models/order.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require('dotenv').config();
const secret = process.env.FIRST_SECRET_KEY;

module.exports.register = async (req, res) => {
  try {
    const user = await User.create(req.body);
    const userToken = jwt.sign({ id: user._id, firstName: user.firstName }, process.env.FIRST_SECRET_KEY);
    res.cookie("usertoken", userToken, { httpOnly: true }).json({ msg: "Registration successful!", user });
  } catch (err) {
    console.error(err); 
    res.status(400).json({ err });
  }
};

module.exports.login = async (req, res) => {
  const { email, password } = req.body;

  console.log('User login request received:', req.body);

  try {
    const user = await User.findOne({ email });
    console.log('User found in DB:', user);

    if (!user) {
      return res.status(400).json({ error: "Email not found" });
    }

    const correctPassword = await bcrypt.compare(password, user.password);
    if (!correctPassword) {
      return res.status(400).json({ error: "Incorrect password" });
    }
    const token = jwt.sign({ id: user._id, role: 'user' }, secret, { expiresIn: '1h' });
    res.clearCookie('usertoken');
    res.cookie("usertoken", token, { httpOnly: true }).json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports.logout = (req, res) => {
  res.clearCookie('usertoken');
  res.sendStatus(200);
};


module.exports.checkAuth = (req, res) => {
  const token = req.cookies.usertoken;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  jwt.verify(token, process.env.FIRST_SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Unauthorized" });
    } else {
      res.status(200).json({ msg: "Authorized", user: decoded });
    }
  });
};

exports.getAllUsersWithOrders = async (req, res) => {
  try {
    const users = await User.find({}).lean();
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

