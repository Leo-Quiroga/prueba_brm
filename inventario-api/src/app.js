
const express = require('express');
const app = express();

app.use(express.json());

// Rutas
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/products', require('./routes/product.routes'));
app.use('/api/purchases', require('./routes/purchase.routes')); 

module.exports = app;