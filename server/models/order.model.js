const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [{
        foodItemId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'FoodItem',
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        image: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        }
    }],
    adresa: {
        type: String,
        required: true
    },
    qyteti: {
        type: String,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Cooking', 'Finished'],
        default: 'Pending'
    },
    paymentMethod: {
        type: String,
        enum: ['Cash', 'CreditCard'],
        default: 'Cash'
    },
    orderNumber: {
        type: String,
        unique: true
    },
    orderDate: {
        type: Date,
        default: Date.now
    },
}, { timestamps: true });



module.exports = mongoose.model('Order', orderSchema);
