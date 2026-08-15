// server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Allow frontend to communicate with backend
app.use(express.json()); // Allow the server to read JSON data

// 🌟 Your First API Endpoint 🌟
app.get('/api/products', (req, res) => {
  // For now, we are sending dummy data. Later, this will come from a database!
  const products = [
    { id: 1, name: "Essential Tee - Black", price: 40000, category: "T-Shirts" },
    { id: 2, name: "Jersey - Blue", price: 35000, category: "Jerseys" },
    { id: 3, name: "Classic Tote - Grey", price: 40000, category: "Tote Bags" }
  ];
  
  res.json({ 
    message: "Successfully fetched products from the backend!",
    data: products 
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});