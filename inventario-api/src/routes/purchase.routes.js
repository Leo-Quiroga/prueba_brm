
const router = require('express').Router();
const authController = require('../controllers/purchase.controller');
const auth = require('../middlewares/auth');

router.post('/', auth(['admin', 'user']), authController.createPurchase);
router.get('/', auth(['admin']), authController.getAllPurchases);
router.get('/:id', auth(['admin', 'user']), authController.getPurchaseById);

module.exports = router;