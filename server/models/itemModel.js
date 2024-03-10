const mongoose = require('mongoose'); // Erase if already required


const itemSchema = new mongoose.Schema({
    description: {
        type: String
    },
    unit: {
        type: Number
    },
    quantity: Number,
    unitPrice: Number,
    taxPercentage: Number,
    tax: Number,
    discountPercentage: Number,
    discount: Number,
    amount: Number
  });

  module.exports = itemSchema;
