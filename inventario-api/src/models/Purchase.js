
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Purchase = sequelize.define('Purchase', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    total: { type: DataTypes.FLOAT, allowNull: false }
});

module.exports = Purchase;