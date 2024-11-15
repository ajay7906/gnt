




// const multer = require('multer');
// const fs = require('fs');
// const promisePool = require('../config/config');

// // Configure multer for file uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/');
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });

// const upload = multer({ storage });

// exports.createBlogPost = async (req, res) => {
//   upload.single('image')(req, res, async (err) => {
//     if (err) {
//       console.error('Multer error:', err);
//       return res.status(500).json({ error: 'Error processing the file upload' });
//     }

//     try {
//       const { title, description } = req.body;
//       console.log('Title:', title);
//       console.log('Description:', description);

//       let imageData = null;

//       if (req.file) {
//         console.log('Image file:', req.file);
//         imageData = fs.readFileSync(req.file.path); // Read file from the uploaded location
//         fs.unlinkSync(req.file.path); // Delete the file after reading it
//       } else {
//         console.log('No image provided');
//       }

//       // Save to the database
//       const query = 'INSERT INTO blog (title, description, image) VALUES (?, ?, ?)';
//       const values = [title, description, imageData];

//       try {
//         const [result] = await promisePool.query(query, values);
//         console.log('Database insertion result:', result);
//         res.status(200).json({ message: 'Blog post saved successfully' });
//       } catch (dbError) {
//         console.error('Database query error:', dbError);
//         res.status(500).json({ error: 'Error saving blog post' });
//       }
//     } catch (error) {
//       console.error('Server error:', error);
//       res.status(500).json({
//         status: 'error',
//         message: 'Internal server error',
//       });
//     }
//   });
// };









































const multer = require('multer');
const fs = require('fs');
const promisePool = require('../config/config');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

exports.createBlogPost = async (req, res) => {
  upload.single('image')(req, res, async (err) => {
    if (err) {
      console.error('Multer error:', err);
      return res.status(500).json({ error: 'Error processing the file upload' });
    }

    try {
      const { title, description, option } = req.body; // Capture the new field
      console.log('Title:', title);
      console.log('Description:', description);
      console.log('Option:', option); // Log the new field

      let imageData = null;

      if (req.file) {
        console.log('Image file:', req.file);
        imageData = fs.readFileSync(req.file.path); // Read file from the uploaded location
        fs.unlinkSync(req.file.path); // Delete the file after reading it
      } else {
        console.log('No image provided');
      }

      // Save to the database
      const query = 'INSERT INTO blog (title, description, image, `option`) VALUES (?, ?, ?, ?)';
      const values = [title, description, imageData, option];

      try {
        const [result] = await promisePool.query(query, values);
        console.log('Database insertion result:', result);
        res.status(200).json({ message: 'Blog post saved successfully' });
      } catch (dbError) {
        console.error('Database query error:', dbError);
        res.status(500).json({ error: 'Error saving blog post' });
      }
    } catch (error) {
      console.error('Server error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Internal server error',
      });
    }
  });
};
