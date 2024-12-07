const express = require('express');
const { createPayment, successPaymentControllers, createPaymentForOrder, successPaymentForOrder } = require('../controllers/paymentControllers');
const router = express.Router();


router.post('/create-payment', createPayment);
router.post('/status', successPaymentControllers);
router.post('/paymentOrder', createPaymentForOrder);
router.post('/paymentOrderStatus' , successPaymentForOrder);

module.exports = router;
