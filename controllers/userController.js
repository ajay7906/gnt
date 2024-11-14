const Contact = require('../models/userModel');
const { sendEmail } = require('../utils/emailService');
const { validationResult } = require('express-validator');

//const connection = require('../config/config');
const jwt = require('jsonwebtoken');
const promisePool = require('../config/config');
const JWT_SECRET = 'abcdxcss';
const bcrypt = require('bcrypt');

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

















// exports.createAdmin =  async (req, res)=>{

// const { email, password } = req.body;

//   // Query the database to check the user's credentials
//   // const query = 'SELECT * FROM admin WHERE email = ? AND password = ?';
//   const query = 'SELECT * FROM admin WHERE email = ? AND password = ?';
//   connection.query(query, [email, password], (error, results, fields) => {
//     if (error) {
//       console.error(error);
//       return res.status(500).json({ error: 'Internal server error' });
//     }

//     if (results.length > 0 && results[0].is_admin) {
//       // User is an admin, generate a JWT token and send it back to the client
//       const token = jwt.sign({ userId: results[0].id }, JWT_SECRET, { expiresIn: '1h' });
//       return res.json({ token: token });
//     } else {
//       // User is not an admin or the credentials are invalid
//       return res.status(401).json({ error: 'Invalid email or password' });
//     }
//   });
// };







// exports.createAdmin = async (req, res) => {
//   const { email, password } = req.body;
//  console.log(email, password);

//   // Query the database to check the user's credentials
//   const query = 'SELECT * FROM admin WHERE email = ?';
//   console.log(query);
//   await connection.query(query, [email], async (error, results) => {
//     console.log(query);

//     console.log(results);

//     if (error) {
//       console.error(error);
//       return res.status(500).json({ error: 'Internal server error' });
//     }

//     if (results.length > 0) {
//       const user = results[0];
//       const isPasswordValid = await bcrypt.compare(password, user.password); // Compare hashed password

//       if (isPasswordValid && user.is_admin) {
//         // User is an admin, generate a JWT token
//         const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
//         return res.json({ token: token });
//       }
//     }

//     // If credentials are invalid
//     return res.status(401).json({ error: 'Invalid email or password' });
//   });
// };



// exports.createAdmin = async (req, res) => {
//   const { email, password } = req.body;

//   // Query the database to check the user's credentials
//   const query = 'SELECT * FROM admin WHERE email = ?';
//   console.log(query);

 

//   connection.query('SELECT 1', (error, results) => {
//     if (error) {
//       console.error("Test query error:", error);
//     } else {
//       console.log("Test query successful:", results);
//     }
//   });

//   connection.query(query, [email], async (error, results) => {
//     if (error) {
//       console.error("Database query error:", error);
//       return res.status(500).json({ error: 'Internal server error' });
//     }
//     console.log(results);

//     if (results.length > 0) {
//       const user = results[0];

//       try {
//         const isPasswordValid = await bcrypt.compare(password, user.password);

//         if (isPasswordValid && user.is_admin) {
//           // Generate JWT token
//           const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
//           return res.json({ token: token });
//         } else {
//           return res.status(401).json({ error: 'Invalid email or password' });
//         }
//       } catch (bcryptError) {
//         console.error("Password comparison error:", bcryptError);
//         return res.status(500).json({ error: 'Internal server error' });
//       }
//     } else {
//       // No user found
//       return res.status(401).json({ error: 'Invalid email or password' });
//     }
//   });
// };




// exports.createAdmin = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const [results] = await promisePool.query('SELECT * FROM admin WHERE email = ?', [email]);

//     if (results.length > 0) {
//       const user = results[0];
//       const isPasswordValid = await bcrypt.compare(password, user.password);

//       if (isPasswordValid && user.is_admin) {
//         const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
//         return res.json({ token });
//       } else {
//         return res.status(401).json({ error: 'Invalid email or password' });
//       }
//     } else {
//       return res.status(401).json({ error: 'Invalid email or password' });
//     }
//   } catch (error) {
//     console.error("Database query error:", error);
//     return res.status(500).json({ error: 'Internal server error' });
//   }
// };




exports.createAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Query the database for the user by email
    const [results] = await promisePool.query('SELECT * FROM admin WHERE email = ?', [email]);

    if (results.length > 0) {
      const user = results[0];

      // Compare plain-text passwords directly (since no hashing is applied)
      if (password === user.password && user.is_admin) {
        // Generate JWT token if login is successful
        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
        return res.json({ token });
      } else {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
    } else {
      // No user found with the provided email
      return res.status(401).json({ error: 'Invalid email or password' });
    }
  } catch (error) {
    console.error("Database query error:", error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};







exports.isAdmin = async (req, res) => {

  if (!req.user.isAdmin) {
    return res.status(403).json({ error: 'Not authorized' });
  }
  res.json({ message: 'Welcome to admin panel' });
}












// server.js

// app.post('/login', (req, res) => {




//   const { email, password } = req.body;

//   // Query the database to check the user's credentials
//   const query = 'SELECT * FROM users WHERE email = ? AND password = ?';
//   connection.query(query, [email, password], (error, results, fields) => {
//     if (error) {
//       console.error(error);
//       return res.status(500).json({ error: 'Internal server error' });
//     }

//     if (results.length > 0 && results[0].is_admin) {
//       // User is an admin, generate a JWT token and send it back to the client
//       const token = jwt.sign({ userId: results[0].id }, JWT_SECRET, { expiresIn: '1h' });
//       return res.json({ token: token });
//     } else {
//       // User is not an admin or the credentials are invalid
//       return res.status(401).json({ error: 'Invalid email or password' });
//     }
//   });




// });