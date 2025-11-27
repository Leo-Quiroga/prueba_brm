
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');  

const PurchaseItem = sequelize.define('PurchaseItem', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    price: { type: DataTypes.FLOAT, allowNull: false }
});

module.exports = PurchaseItem;