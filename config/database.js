const mongoose = require('mongoose');

// Mongodb Connection
mongoose.connect(process.env.DB_API, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected');
    // Start your server or perform other operations that depend on the database connection
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    // Handle connection errors, such as logging the error or terminating the application
  });
