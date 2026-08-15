// backend/server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); 
app.use(express.json()); 

// 🌟 API Endpoint: Send full product data to frontend
app.get('/api/products', (req, res) => {
  const products = [
    { 
      id: 1, 
      name: "Essential Tee - Black", 
      category: "T-Shirts", 
      price: 40000, 
      image: "frontblacktshirt.html.JPEG", 
      tag: "bestseller", 
      isNew: true 
    },
    { 
      id: 2, 
      name: "Jersey - Blue", 
      category: "Jerseys", 
      price: 35000, 
      image: "bluejersey.html.jpeg", 
      tag: "bestseller", 
      isNew: false 
    },
    { 
      id: 3, 
      name: "Classic Tote - Grey", 
      category: "Tote Bags", 
      price: 40000, 
      image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600", 
      tag: "bestseller", 
      isNew: false 
    },
    { 
      id: 4, 
      name: "Essential Tee - White", 
      category: "T-Shirts", 
      price: 40000, 
      image: "frontwhitetshirt2.html.png", 
      tag: "new", 
      isNew: true 
    }
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