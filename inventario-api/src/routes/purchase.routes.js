
const router = require('express').Router();
const controller = require('../controllers/purchase.controller');
const auth = require('../middlewares/auth');

router.post('/', auth(['Administrador', 'Cliente']), controller.buy);
router.get('/', auth(['Administrador']), controller.getAll);
router.get('/:id', auth(['Administrador', 'Cliente']), controller.getById);

module.exports = router;