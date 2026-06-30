const Order = require('../models/order.model');
const FoodItem = require('../models/foodItem.model');

const DELIVERY_FEE = 3;

exports.createOrder = async (req, res) => {
  try {
    const { qyteti, adresa, items, paymentMethod, deliveryTime } = req.body;
    const userId = req.userId;

    if (!userId || !qyteti || !adresa || !paymentMethod || !items || items.length === 0) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    const submittedItems = items.map((item) => ({
      foodItemId: item.foodItemId || item.id,
      quantity: Number(item.quantity),
    }));

    if (submittedItems.some((item) => !item.foodItemId || !Number.isInteger(item.quantity) || item.quantity < 1)) {
      return res.status(400).json({ message: "Invalid order items" });
    }

    const foodItems = await FoodItem.find({
      _id: { $in: submittedItems.map((item) => item.foodItemId) },
    }).lean();

    if (foodItems.length !== submittedItems.length) {
      return res.status(400).json({ message: "One or more food items are invalid" });
    }

    const foodItemById = new Map(foodItems.map((item) => [item._id.toString(), item]));
    const trustedItems = submittedItems.map((item) => {
      const foodItem = foodItemById.get(item.foodItemId.toString());

      return {
        foodItemId: foodItem._id,
        quantity: item.quantity,
        name: foodItem.name,
        image: foodItem.image,
        description: foodItem.description,
        price: foodItem.price,
      };
    });

    const totalPrice = trustedItems.reduce(
      (total, item) => total + item.quantity * item.price,
      DELIVERY_FEE
    );

    const order = new Order({
      userId,
      items: trustedItems,
      adresa,
      qyteti,
      totalPrice,
      deliveryTime,
      orderNumber: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      status: 'Pending',
      paymentMethod,
    });

    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    let orders;

    if (req.adminId) {
      orders = await Order.find()
        .populate('userId', '-password -__v')
        .populate('items.foodItemId');
    } else if (req.userId) {
      orders = await Order.find({ userId: req.userId }).populate('items.foodItemId');
    } else {
      return res.status(401).json({ message: "Unauthorized" });
    }

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('UserId').populate('items.foodItemId');
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getOrderStatusById = async (req, res) => {
  try {
      const order = await Order.findById(req.params.id, 'status userId');
      if (!order) {
          return res.status(404).json({ message: "Order not found" });
      }

      if (!req.adminId && order.userId.toString() !== req.userId) {
          return res.status(403).json({ message: "Forbidden" });
      }

      res.status(200).json({ status: order.status });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};
exports.updateOrderStatusById = async (req, res) => {
  try {
      const { status } = req.body;
      if (!['Pending', 'Cooking', 'Finished'].includes(status)) {
          return res.status(400).json({ message: "Invalid status. Allowed values are 'Pending', 'Cooking', or 'Finished'." });
      }

      const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });

      if (!order) {
          return res.status(404).json({ message: "Order not found" });
      }

      res.status(200).json({ message: "Order status updated successfully", order });
  } catch (error) {
      res.status(400).json({ message: error.message });
  }
};

exports.deleteOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.status(200).json({ message: "Order deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getOrdersByCityCategory = async (req, res) => {
  try {
    const ordersByCityCategory = await Order.aggregate([
      {
        $group: {
          _id: {
            $cond: { if: { $eq: ["$qyteti", "Tirane"] }, then: "Tirane", else: "Other Cities" }
          },
          totalOrders: { $sum: 1 }
        }
      }
    ]);

    const formattedResult = ordersByCityCategory.reduce((acc, curr) => {
      acc[curr._id] = curr.totalOrders;
      return acc;
    }, {});

    res.json({
      tirane: formattedResult.Tirane || 0,
      tjeter: formattedResult["Other Cities"] || 0
    });
  } catch (error) {
    console.error("Error getting orders by city category:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.orderNr=async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const totalOrders = await Order.countDocuments({ createdAt: { $gte: today } });
    res.json({ totalOrders });
  } catch (err) {
    res.status(500).json({ error: 'Error fetching daily orders' });
  }
};
exports.topOrders= async (req, res) => {
  try {
    const topItems = await Order.aggregate([
      { $unwind: "$items" },
      { $group: { _id: "$items.name", totalOrders: { $sum: "$items.quantity" } } },
      { $sort: { totalOrders: -1 } },
      { $limit: 3 }
    ]);

    res.status(200).json({
      success: true,
      data: topItems
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};
  exports.paymentType = async (req, res) => {
    try {
      const paymentData = await Order.aggregate([
        { $group: { _id: '$paymentMethod', count: { $sum: 1 } } },
        { $project: { _id: 0, paymentMethod: '$_id', count: 1 } }
      ]);

      const cashCount = paymentData.find(payment => payment.paymentMethod === 'Cash')?.count || 0;
      const creditCardCount = paymentData.find(payment => payment.paymentMethod === 'CreditCard')?.count || 0;
  
      res.json({ cash: cashCount, creditCard: creditCardCount });
    } catch (err) {
      console.error('Error fetching payment method distribution:', err);
      res.status(500).json({ error: 'Error fetching payment method distribution' });
    }};
    exports.getTopOrderDay = async (req, res) => {
      try {
        const ordersByDay = await Order.aggregate([
          {
            $group: {
              _id: { $dayOfWeek: "$orderDate" }, 
              totalOrders: { $sum: 1 }, 
              firstOrderDate: { $first: "$orderDate" }, 
            }
          },
          {
            $project: {
              totalOrders: 1,
              _id: 1,
              weeks: {
                $ceil: {
                  $divide: [{ $subtract: [new Date(), "$firstOrderDate"] }, 1000 * 60 * 60 * 24 * 7] // Calculate the total weeks
                }
              }
            }
          },
          {
            $project: {
              totalOrders: 1,
              averageOrders: { $divide: ["$totalOrders", "$weeks"] } 
            }
          },
          { $sort: { averageOrders: -1 } } 
        ]);
    
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const formattedResult = ordersByDay.map(day => ({
          day: daysOfWeek[day._id - 1], 
          averageOrders: day.averageOrders
        }));
    
        res.status(200).json({ topDays: formattedResult });
      } catch (error) {
        console.error("Error fetching average orders by day of week:", error);
        res.status(500).json({ message: "Failed to fetch average orders" });
      }
    };

exports.leastOrderedProducts = async (req, res) => {
  try {
    const leastOrderedItems = await Order.aggregate([
      { $unwind: "$items" },
      { $group: { _id: "$items.name", totalOrders: { $sum: "$items.quantity" } } },
      { $sort: { totalOrders: 1 } }, 
      { $limit: 3 }
    ]);

    res.status(200).json({
      success: true,
      data: leastOrderedItems
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};
