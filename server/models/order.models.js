const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FoodDelivery',
    },
  ],
  status: {
    type: String,
    default: 'Pending',
  },
  orderNumber: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;