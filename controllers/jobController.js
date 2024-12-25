const multer = require('multer');
const promisePool = require('../config/config');
const fs = require('fs');
const path = require('path'); 

exports.createJob = async (req, res) => {
    try { 
        const { title, location, type, experience, department, description, skills } = req.body;
        const [result] = await promisePool.query(
            'INSERT INTO jobs (title, location, type, experience, department, description, skills) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [title, location, type, experience, department, description, JSON.stringify(skills)]
        );
        res.status(201).json({
            message: 'Job created successfully',
            jobId: result.insertId
        });
    } catch (error) {
        console.error('Error creating job:', error);
        res.status(500).json({ message: 'Error creating job', error: error.message });
    }
};


exports.getJobs = async (req, res) => {

    try {
        const { department, location } = req.query;
        let query = 'SELECT * FROM jobs WHERE 1=1';
        const params = [];

        if (department && department !== 'All') {
            query += ' AND department = ?';
            params.push(department);
        }

        if (location && location !== 'All') {
            query += ' AND location = ?';
            params.push(location);
        }

        const [jobs] = await promisePool.query(query, params);
        res.json(jobs);
    } catch (error) {
        console.error('Error fetching jobs:', error);
        res.status(500).json({ message: 'Error fetching jobs', error: error.message });
    }
}



exports.getJobById = async (req, res) => {
    try {
        const [jobs] = await promisePool.query('SELECT * FROM jobs WHERE id = ?', [req.params.id]);
        if (jobs.length === 0) {
            return res.status(404).json({ message: 'Job not found' });
        }
        res.json(jobs[0]);
    } catch (error) {
        console.error('Error fetching job:', error);
        res.status(500).json({ message: 'Error fetching job', error: error.message });
    }
}



exports.updateJobById = async (req, res) => {
    try {
        const { title, location, type, experience, department, description, skills } = req.body;
        const [result] = await promisePool.query(
            'UPDATE jobs SET title = ?, location = ?, type = ?, experience = ?, department = ?, description = ?, skills = ? WHERE id = ?',
            [title, location, type, experience, department, description, JSON.stringify(skills), req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Job not found' });
        }

        res.json({ message: 'Job updated successfully' });
    } catch (error) {
        console.error('Error updating job:', error);
        res.status(500).json({ message: 'Error updating job', error: error.message });
    }
}



exports.deleteJobById = async (req, res) => {
    try {
        const [result] = await promisePool.query('DELETE FROM jobs WHERE id = ?', [req.params.id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Job not found' });
        }

        res.json({ message: 'Job deleted successfully' });
    } catch (error) {
        console.error('Error deleting job:', error);
        res.status(500).json({ message: 'Error deleting job', error: error.message });
    }
}




// storage for resume
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads/resumes';
        // create directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'resume-' + uniqueSuffix + path.extname(file.originalname));
    }
}) 

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['.pdf', '.doc', '.docx']; 
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only PDF, DOC, and DOCX files are allowed.'));
    }
}

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
})



async function initializeDatabase() {
    try {
      const connection = await promisePool.getConnection();
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



 exports.uploadMiddleware = upload.single('resume');  

exports.applyJob = async (req, res) => {  


    const connection = await promisePool.getConnection();
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
        console.log(req.body.phone);
        
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
   
}