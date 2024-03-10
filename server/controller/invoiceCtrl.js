const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');
const validateMongoDbId = require('../utils/validateMongodbid');
const Client = require("../models/clienteModel");
const Invoice = require("../models/invoiceModel");
const Item = require("../models/itemModel");

//CREATE in voice
const createInvoice = asyncHandler(async (req, res) => {
  try {
    const  {id}  = req.params;
    const userId = req.user.id;
    const {
      invoiceNumber,
      invoiceDate,
      dueDate,
      paymentStatus,
      tax,
      discount,
      totalAmount,
      items
    } = req.body;

    console.log('Received invoice data:');
    console.log('Invoice Number:', invoiceNumber);
    console.log('Invoice Date:', invoiceDate);
    console.log('Due Date:', dueDate);
    console.log('Payment Status:', paymentStatus);
    console.log('Tax:', tax);
    console.log('Total Amount:', totalAmount);
    console.log('Items:', items);

    // Check if required fields are present
    if (!invoiceNumber || !invoiceDate || !dueDate || !paymentStatus || !totalAmount || !items) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if invoiceDate and dueDate are valid date strings
    if (!isValidDateString(invoiceDate) || !isValidDateString(dueDate)) {
      return res.status(400).json({ message: 'Invalid date format. Date should be in the format YYYY-MM-DD' });
    }

    const clientUserName = await Client.findById({ _id: id });
    console.log(clientUserName);
    // Create a new invoice document
    const newInvoice = new Invoice({
      invoiceNumber,
      invoiceDate,
      dueDate,
      recipient: userId,
      paymentStatus,
      tax,
      discount,
      totalAmount,
      clientId: clientUserName.username,
      items
    });

    // Save the new invoice to the database
    await newInvoice.save();

    // Respond with the created invoice
    res.status(201).json(newInvoice);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Function to check if a string is a valid date in the format 'YYYY-MM-DD'
function isValidDateString(dateString) {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  return dateRegex.test(dateString);
}






//GET all the invoice by authMiddleware
const getInvoices = asyncHandler(async (req, res) => {
    try {
        // Extract recipient ID from the authMiddleware
        const recipientId = req.user.id;
    
        // Query the database for invoices with the given recipient ID
        const invoices = await Invoice.find({ recipient: recipientId });
    
        // Respond with the found invoices
        res.status(200).json(invoices);
      } catch (error) {
        // If an error occurs, respond with an error message
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
      }
});

//GET a single invoice by its id
const getInvoice = asyncHandler(async (req, res) => {
    try {
        // Extract invoice ID from the request parameters
        const  {invoiceId}  = req.params;

        // Extract recipient ID from the authMiddleware
        const recipientId = req.user.id;

        // Query the database for the invoice with the given recipient ID and invoice ID
        const invoice = await Invoice.findOne({ _id: invoiceId, recipient: recipientId });
    
        // Check if the invoice exists
        if (!invoice) {
          return res.status(404).json({ message: 'Invoice not found' });
        }
    
        // Respond with the found invoice
        res.status(200).json(invoice);
      } catch (error) {
        // If an error occurs, respond with an error message
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
      }
});

//UPDATE invoice
const updateInvoice = asyncHandler(async (req, res) => {
    try {
        // Extract username from the request parameters
        const { username } = req.params;
        // Extract invoice ID from the request parameters
        const { invoiceId } = req.params;
        // Extract recipient from the auth middleware
        const userId = req.user.id;
        // Extract invoice data from the request body
        const {
          invoiceNumber,
          invoiceDate,
          dueDate,
          paymentStatus,
          tax,
          discount,
          totalAmount,
          items
        } = req.body;
    
        // Check if the invoice exists and belongs to the user
        const existingInvoice = await Invoice.findOne({ _id: invoiceId, recipient: userId, clientId: username });
        if (!existingInvoice) {
          return res.status(404).json({ message: 'Invoice not found' });
        }
    
        // Update the existing invoice document
        existingInvoice.invoiceNumber = invoiceNumber;
        existingInvoice.invoiceDate = new Date(invoiceDate);
        existingInvoice.dueDate = new Date(dueDate);
        existingInvoice.paymentStatus = paymentStatus;
        existingInvoice.tax = tax;
        existingInvoice.discount = discount;
        existingInvoice.totalAmount = totalAmount;
        existingInvoice.items = items;
    
        // Save the updated invoice to the database
        await existingInvoice.save();
    
        // Respond with the updated invoice
        res.status(200).json(existingInvoice);
      } catch (error) {
        // If an error occurs, respond with an error message
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
      }
});

//DELETE the invoice
const deleteInvoice = asyncHandler(async (req, res) => {
    try {
        // Extract invoice ID and username from the request parameters
        const { id, username } = req.params;
         // Extract recipient from the auth middleware
         const userId = req.user.id;
        // Use Mongoose to find and delete the invoice
        const deletedInvoice = await Invoice.findOneAndDelete({ _id: id, recipient: userId, clientId: username });
    
        // Check if the invoice exists
        if (!deletedInvoice) {
          return res.status(404).json({ message: 'Invoice not found' });
        }
    
        // Respond with a success message
        res.status(200).json({ message: 'Invoice deleted successfully' });
      } catch (error) {
        // If an error occurs, respond with an error message
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
      }
});

module.exports = { 
    createInvoice,
    getInvoices,
    getInvoice,
    updateInvoice,
    deleteInvoice
}