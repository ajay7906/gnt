const express = require('express');
const { createPayment, successPaymentControllers } = require('../controllers/paymentControllers');
const router = express.Router();


router.post('/create-payment', createPayment);
router.post('/status', successPaymentControllers);

module.exports = router;
