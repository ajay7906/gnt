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