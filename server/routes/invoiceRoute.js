const express = require('express');
const { authMidlleware } = require("../middlewares/authMiddleware");
const router = express.Router();
const {
        createInvoice,
        getInvoices,
        getInvoice,
        updateInvoice,
        deleteInvoice
                        } = require('../controller/invoiceCtrl');

router.post('/:id', authMidlleware, createInvoice);

router.get('/', authMidlleware, getInvoices);
router.get('/:invoiceId', authMidlleware, getInvoice);

router.put('/:username/:invoiceId', authMidlleware, updateInvoice);

router.delete('/:id/:username', authMidlleware, deleteInvoice);
module.exports = router;
