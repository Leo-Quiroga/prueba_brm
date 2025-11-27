const { DataTypes } = require("sequelize");// DataTypes permite definir tipos de datos en campos del modelo
const sequelize = require("../config/db");

// Definición del modelo User con sus atributos y configuraciones
const User = sequelize.define("User", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.ENUM("Administrador", "Cliente"), allowNull: false }
});

module.exports = User;
