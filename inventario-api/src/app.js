// module.exports = app;
const express = require('express');
const morgan = require('morgan'); // Punto Extra: Logs de peticiones
const cors = require('cors');     // Recomendado: Manejo de cabeceras
const app = express();

// Middlewares
app.use(morgan('dev')); // Registra cada petición en consola
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/products', require('./routes/product.routes'));
app.use('/api/purchases', require('./routes/purchase.routes')); 

// Manejo de errores global (Punto Extra)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Error interno del servidor', error: err.message });
});

module.exports = app;