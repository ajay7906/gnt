const Contact = require('../models/userModel');
const { sendEmail } = require('../utils/emailService');
const { validationResult } = require('express-validator');

exports.createContact = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Create contact in database
    const result = await Contact.create(req.body);

    // Send notification email
    await sendEmail({
      to: 'info@gntind.com',
      subject: `New Contact Form Submission: ${req.body.subject}`,
      text: `
        Name: ${req.body.name}
        Email: ${req.body.email}
        Subject: ${req.body.subject}
        Message: ${req.body.message}
      `
    });

    // Send confirmation email to user
    await sendEmail({
      to: req.body.email,
      subject: 'Thank you for contacting GNT India',
      text: `
        Dear ${req.body.name},

        Thank you for reaching out to us. We have received your message and will get back to you shortly.

        Best regards,
        GNT India Team
      `
    });

    res.status(201).json({
      success: true,
      message: 'Contact form submitted successfully',
      data: result
    });
  } catch (error) {
    console.error('Error in createContact:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while processing your request',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};


exports.createAdmin =  async (req, res)=>{








  
  const { email, password } = req.body;

  // Query the database to check the user's credentials
  const query = 'SELECT * FROM users WHERE email = ? AND password = ?';
  connection.query(query, [email, password], (error, results, fields) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (results.length > 0 && results[0].is_admin) {
      // User is an admin, generate a JWT token and send it back to the client
      const token = jwt.sign({ userId: results[0].id }, JWT_SECRET, { expiresIn: '1h' });
      return res.json({ token: token });
    } else {
      // User is not an admin or the credentials are invalid
      return res.status(401).json({ error: 'Invalid email or password' });
    }
  });





};

exports.isAdmin =  async (req, res)=>{

  if (!req.user.isAdmin) {
    return res.status(403).json({ error: 'Not authorized' });
  }
  res.json({ message: 'Welcome to admin panel' });
}












// server.js
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your_secret_key';

app.post('/login', (req, res) => {




  const { email, password } = req.body;

  // Query the database to check the user's credentials
  const query = 'SELECT * FROM users WHERE email = ? AND password = ?';
  connection.query(query, [email, password], (error, results, fields) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (results.length > 0 && results[0].is_admin) {
      // User is an admin, generate a JWT token and send it back to the client
      const token = jwt.sign({ userId: results[0].id }, JWT_SECRET, { expiresIn: '1h' });
      return res.json({ token: token });
    } else {
      // User is not an admin or the credentials are invalid
      return res.status(401).json({ error: 'Invalid email or password' });
    }
  });




});