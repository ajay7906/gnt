// Required dependencies
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mysql = require('mysql2/promise');

// MySQL connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'your_username',
  password: 'your_password',
  database: 'your_database',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Configure multer for resume uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/resumes';
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'resume-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['.pdf', '.doc', '.docx'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, DOC, and DOCX files are allowed.'));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Create the applications table if it doesn't exist
async function initializeDatabase() {
  try {
    const connection = await pool.getConnection();
    await connection.query(`
      CREATE TABLE IF NOT EXISTS job_applications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        linkedin_url VARCHAR(255),
        experience VARCHAR(50) NOT NULL,
        portfolio_url VARCHAR(255),
        resume_path VARCHAR(255) NOT NULL,
        job_title VARCHAR(255) NOT NULL,
        application_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status ENUM('pending', 'reviewed', 'shortlisted', 'rejected') DEFAULT 'pending'
      )
    `);
    connection.release();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

initializeDatabase();

// Handle job application submission
router.post('/api/job-applications', upload.single('resume'), async (req, res) => {
  const connection = await pool.getConnection();
  try {
    // Validate required fields
    const requiredFields = ['fullName', 'email', 'phone', 'experience'];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        throw new Error(`${field} is required`);
      }
    }

    if (!req.file) {
      throw new Error('Resume file is required');
    }

    // Send WhatsApp notification
    try {
      const whatsappResponse = await fetch(
        `https://whatsapp.gntindia.com/api/sendtextmessage.php?LicenseNumber=47757954399&APIKey=GfeYz42caOWXL7xhkjD5C8BHt&Contact=91${req.body.phone}&Message=Thank you for applying! We've received your application and are excited to review it. Our team will be in touch soon if you're shortlisted. Got questions? Reach us anytime at fin.hpcpl@gmail.com. Best of luck, Team GNT India`
      );
      if (!whatsappResponse.ok) {
        console.error('WhatsApp notification failed');
      }
    } catch (whatsappError) {
      console.error('Error sending WhatsApp notification:', whatsappError);
    }

    // Insert application into database
    const [result] = await connection.query(
      `INSERT INTO job_applications (
        full_name, 
        email, 
        phone, 
        linkedin_url, 
        experience, 
        portfolio_url, 
        resume_path, 
        job_title
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        req.body.fullName,
        req.body.email,
        req.body.phone,
        req.body.linkedin || null,
        req.body.experience,
        req.body.portfolio || null,
        req.file.path,
        req.body.jobTitle
      ]
    );

    // Send success response
    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      applicationId: result.insertId
    });

  } catch (error) {
    console.error('Error processing application:', error);
    
    // Clean up uploaded file if there was an error
    if (req.file) {
      fs.unlink(req.file.path, (unlinkError) => {
        if (unlinkError) console.error('Error deleting file:', unlinkError);
      });
    }

    res.status(400).json({
      success: false,
      message: error.message || 'Error processing your application'
    });

  } finally {
    connection.release();
  }
});









// Get all applications (with optional filters)
router.get('/api/job-applications', async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { status, jobTitle } = req.query;
    let query = 'SELECT * FROM job_applications WHERE 1=1';
    const params = [];

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    if (jobTitle) {
      query += ' AND job_title = ?';
      params.push(jobTitle);
    }

    query += ' ORDER BY application_date DESC';

    const [applications] = await connection.query(query, params);
    res.json({ success: true, applications });

  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching applications'
    });

  } finally {
    connection.release();
  }
});

module.exports = router;