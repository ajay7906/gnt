// const express = require('express');
// const userController = require('../controllers/controllers');

// const router = express.Router();

// router.post('/register', userController.registerUser);
// router.post('/verify-otp', userController.verifyOTP);

// module.exports = router;



















const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
 //const contactController = require('../controllers/contactController');
 const userController = require('../controllers/userController');

// Validation middleware
const validateContact = [
  check('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  
  check('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email address'),
  
  check('subject')
    .trim()
    .notEmpty().withMessage('Subject is required')
    .isLength({ min: 5, max: 200 }).withMessage('Subject must be between 5 and 200 characters'),
  
  check('message')
    .trim()
    .notEmpty().withMessage('Message is required')
    .isLength({ min: 10, max: 1000 }).withMessage('Message must be between 10 and 1000 characters')
];

// Routes
router.post('/contacts', validateContact, userController.createContact);

module.exports = router;
