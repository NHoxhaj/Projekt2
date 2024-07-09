const mongoose = require('mongoose');
const Order = require('../models/order.models');

const createOrder = async (req, res) => {
  const { items, orderNumber } = req.body;
  const userId = req.userId;

  // Validate userId
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: 'Invalid userId' });
  }

  // Convert userId to ObjectId
  const validUserId = new mongoose.Types.ObjectId(userId);

  // Ensure items are converted to ObjectId
  let validItems;
  try {
    validItems = items.map(item => {
      if (!mongoose.Types.ObjectId.isValid(item)) {
        throw new Error(`Invalid item ID: ${item}`);
      }
      return new mongoose.Types.ObjectId(item);
    });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }

  try {
    const newOrder = new Order({ userId: validUserId, items: validItems, orderNumber });
    const savedOrder = await newOrder.save();
    return res.status(201).json(savedOrder);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create order', details: error.message });
  }
};

const getOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      return res.json({ status: order.status });
    } else {
      return res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch order status', details: error.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    return res.json(orders);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch orders', details: error.message });
  }
};

module.exports = { createOrder, getOrderStatus, getAllOrders };