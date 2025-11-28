
const router = require('express').Router();
const controller = require('../controllers/purchase.controller');
const auth = require('../middlewares/auth');

// 1. Rutas de Cliente específicas
router.get('/historial/mis-compras', auth(['Cliente']), controller.getMyPurchases);

// 2. Ruta de Factura (Específica con parámetro, pero diferente a getById genérico)
router.get('/factura/:id', auth(['Administrador', 'Cliente']), controller.getInvoice);

// 3. Crear compra (Ambos)
router.post('/', auth(['Administrador', 'Cliente']), controller.buy);

// 4. Ver todas (Solo Admin)
router.get('/', auth(['Administrador']), controller.getAll);

// 5. Ver una específica por ID (Debe ir al final para no chocar con "historial")
router.get('/:id', auth(['Administrador', 'Cliente']), controller.getById);

module.exports = router;