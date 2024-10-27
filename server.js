const express = require('express');
const { connectDB } = require('./config/config');
const exampleRoutes = require('./routes/routes');

const app = express();
const port = process.env.PORT || 3000;

// Connect to database when server starts
(async () => {
  try {
    await connectDB();
    
    app.use(express.json());
    app.use('/api', exampleRoutes);
    
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
})();