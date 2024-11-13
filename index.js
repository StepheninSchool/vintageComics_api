const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

// Import routes
const usersRoute = require('./routes/users');
const productsRoute = require('./routes/products');

// Middleware to parse JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Allows parsing of URL-encoded data

// Use the routes
app.use('/users', usersRoute);
app.use('/products', productsRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
