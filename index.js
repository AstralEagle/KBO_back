const express = require('express');
const connectDB = require('./db');
const app = express();
const port = 3001;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

// Simple route for testing
app.get('/api', (req, res) => {
  res.json({ message: 'Backend is connected!' });
});

// Routes
app.use('/api/companies', require('./routes/companies'));

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
