




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




// const promisePool = require('../config/config');

exports.getBlogPosts = async (req, res) => {
  try {
    const { option } = req.query; // Get the option from query parameters
    let query = 'SELECT id, title, description, image, `option` , created_at FROM blog';
    let values = [];

    // If option is provided, filter by it
    if (option) {
      query += ' WHERE `option` = ?';
      values.push(option);
    }

    // Add ordering by creation date, newest first
    query += ' ORDER BY created_at DESC';

    const [posts] = await promisePool.query(query, values);

    // Convert binary image data to base64 for each post
    const processedPosts = posts.map(post => ({
      ...post,
      image: post.image ? `data:image/jpeg;base64,${post.image.toString('base64')}` : null
    }));

    res.status(200).json({
      status: 'success',
      data: processedPosts
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching blog posts'
    });
  }
};

// Get a single blog post by ID
exports.getBlogPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const query = 'SELECT id, title, description, image, `option`, created_at FROM blog WHERE id = ?';
    
    const [posts] = await promisePool.query(query, [id]);

    if (posts.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Blog post not found'
      });
    }

    // Convert binary image data to base64
    const post = {
      ...posts[0],
      image: posts[0].image ? `data:image/jpeg;base64,${posts[0].image.toString('base64')}` : null
    };

    res.status(200).json({
      status: 'success',
      data: post
    });
  } catch (error) {
    console.error('Error fetching blog post:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching blog post'
    });
  }
};


















































// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/');
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });

// const upload = multer({ storage });

// Update blog post
exports.updateBlogPost = async (req, res) => {
  upload.single('image')(req, res, async (err) => {
    if (err) {
      console.error('Multer error:', err);
      return res.status(500).json({ error: 'Error processing the file upload' });
    }

    try {
      const { id } = req.params;
      const { title, description, option } = req.body;
      
      let imageData = null;
      let updateQuery = 'UPDATE blog SET title = ?, description = ?, `option` = ?';
      let queryParams = [title, description, option];

      // Handle new image upload if provided
      if (req.file) {
        console.log('New image file:', req.file);
        imageData = fs.readFileSync(req.file.path);
        fs.unlinkSync(req.file.path); // Delete the temporary file
        
        updateQuery += ', image = ?';
        queryParams.push(imageData);
      }

      updateQuery += ' WHERE id = ?';
      queryParams.push(id);

      // Check if post exists before updating
      const [existingPost] = await promisePool.query(
        'SELECT id FROM blog WHERE id = ?',
        [id]
      );

      if (existingPost.length === 0) {
        return res.status(404).json({
          status: 'error',
          message: 'Blog post not found'
        });
      }

      const [result] = await promisePool.query(updateQuery, queryParams);

      if (result.affectedRows === 0) {
        return res.status(404).json({
          status: 'error',
          message: 'Blog post not found or no changes made'
        });
      }

      res.status(200).json({
        status: 'success',
        message: 'Blog post updated successfully'
      });

    } catch (error) {
      console.error('Error updating blog post:', error);
      res.status(500).json({
        status: 'error',
        message: 'Error updating blog post'
      });
    }
  });
};

// Delete blog post
exports.deleteBlogPost = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if post exists before deleting
    const [existingPost] = await promisePool.query(
      'SELECT id FROM blog WHERE id = ?',
      [id]
    );

    if (existingPost.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Blog post not found'
      });
    }

    const query = 'DELETE FROM blog WHERE id = ?';
    const [result] = await promisePool.query(query, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Blog post not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Blog post deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting blog post:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error deleting blog post'
    });
  }
};