// src/middleware/validateContact.js
const validateContact = (req, res, next) => {
    const { name, email, subject, message } = req.body;
  
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }
  
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }
  
    next();
  };
  
  module.exports = validateContact;