// const express = require('express');
// const cors = require('cors');
// //const { getConnection } = require('./config/config');
// const connection = require('./config/config');
// const promisePool = require('./config/config');
// const multer = require('multer');
// require('dotenv').config();

// const app = express();

// app.use('/uploads', express.static('uploads'));



// const corsOptions = {
 
//   // origin: ['http://88.222.213.80:4173', 'http://9672418000.shop:4173', ''],
//   origin:['http://localhost:5173', 'https://gntindia.com', 'http://gntindia.com'],
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   exposedHeaders: ['Authorization'],
//   credentials: true,

// };

// // promisePool.connect((err) => {  
// //   if (err) {    
// //     console.error('Error connecting to MySQL:', err);    
// //     return;    
// //   }    
// //   console.log('Connected to MySQL database');    
// // });

// // connection.connect((err) => {
// //   if (err) {
// //     console.error('Error connecting to MySQL:', err);
// //     return;
// //   }
// //   console.log('Connected to MySQL database');
// // });



// app.use(cors(corsOptions));

// // Middleware
// //app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Routes
// app.use('/api/v1', require('./routes/userRoutes'));
// app.use('/api/v1/blog', require('./routes/postRoutes'));
// app.use('/api/v1/job', require('./routes/jobRoutes'));
// //app.use('/api/v1', require('./routes/contactRoutes'));


// app.get('/health', (req, res) => {
//   res.status(200).send('Backend is healthy');
// });


// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({
//     success: false,
//     message: 'Something went wrong!',
//     error: process.env.NODE_ENV === 'development' ? err.message : undefined
//   });
// });



// // Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

























const express = require('express');
const cors = require('cors');
const https = require('https');
const fs = require('fs');
require('dotenv').config();

// Database connections
const connection = require('./config/config');
const promisePool = require('./config/config');
const multer = require('multer');

// Initialize the Express app
const app = express();

// Serve static files from the uploads directory
app.use('/uploads', express.static('uploads'));

// CORS Configuration
const corsOptions = {
  origin: ['http://localhost:5173', 'https://gntindia.com', 'http://gntindia.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Authorization'],
  credentials: true,
};
app.use(cors(corsOptions));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/v1', require('./routes/userRoutes'));
app.use('/api/v1/blog', require('./routes/postRoutes'));
app.use('/api/v1/job', require('./routes/jobRoutes'));

// Health Check Route
app.get('/health', (req, res) => {
  res.status(200).send('Backend is healthy');
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// Load SSL certificates
const sslOptions = {
  key: fs.readFileSync('/etc/letsencrypt/live/gntindia.com/privkey.pem'), // Path to private key
  cert: fs.readFileSync('/etc/letsencrypt/live/gntindia.com/fullchain.pem'), // Path to full chain certificate
};

// Start HTTPS server
const PORT = process.env.PORT || 5000;
https.createServer(sslOptions, app).listen(PORT, () => {
  console.log(`Secure server is running on https://gntindia.com:${PORT}`);
});
