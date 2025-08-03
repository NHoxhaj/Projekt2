const FoodItem = require('../models/foodItem.model');

exports.createFoodItem = async (req, res) => {
    try {
        const foodItem = new FoodItem(req.body);
        await foodItem.save();
        res.status(201).json(foodItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getAllFoodItems = async (req, res) => {
    try {
        const foodItems = await FoodItem.find();
        res.status(200).json(foodItems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getFoodItemById = async (req, res) => {
    try {
        const foodItem = await FoodItem.findById(req.params.id);
        if (!foodItem) {
            return res.status(404).json({ message: "Food item not found" });
        }
        res.status(200).json(foodItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


