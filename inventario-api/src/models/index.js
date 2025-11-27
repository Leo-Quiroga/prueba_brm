
// importa y exporta todos los modelos de la aplicación  
const User = require('./User');
const Product = require('./Product');
const Purchase = require('./Purchase');
const PurchaseItem = require('./PurchaseItem');

// Usuario -> Compras (1 a N)
User.hasMany(Purchase, { foreignKey: 'userId', as: 'purchases' });
Purchase.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Compra -> Items de Compra (1 a N)
Purchase.hasMany(PurchaseItem, { foreignKey: 'purchaseId', as: 'items' });
PurchaseItem.belongsTo(Purchase, { foreignKey: 'purchaseId', as: 'purchase' });

// Producto -> Items de Compra (1 a N)
Product.hasMany(PurchaseItem, { foreignKey: 'productId', as: 'purchaseItems' });
PurchaseItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

module.exports = {
    User,
    Product,
    Purchase,
    PurchaseItem
};  