const mongoose = require('mongoose');
const itemSchema = require('./itemModel.js');

var invoiceSchema = new mongoose.Schema({ 
  invoiceNumber: {
    type: String
  },
  invoiceDate: {
    type: String, // Change type to String
    required: true
  },
  dueDate: {
    type: String, // Change type to String
    required: true
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  paymentStatus: {
    type: String,
    enum: ['Cash in hand', 'Bank Transfer'],
    default: 'Cash in hand'
  },
  tax: Number,
  discount: Number,
  totalAmount: Number,
  clientId: {
    type: String
  },
  items: [itemSchema]
});

const Invoice = mongoose.model('Invoice', invoiceSchema);

module.exports = Invoice;
