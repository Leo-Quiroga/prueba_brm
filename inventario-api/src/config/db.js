// Configuración de la conexión a la base de datos usando Sequelize
// Se obtienen las variables de entorno desde el archivo .env

const { Sequelize } = require('sequelize');
// Crear una nueva instancia de Sequelize con los parámetros de conexión
const sequelize = new Sequelize(
    process.env.DB_NAME, 
    process.env.DB_USER, 
    process.env.DB_PASS, 
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        logging: false,
    }
);
// Exportar la instancia de Sequelize para su uso en otros módulos  
module.exports = sequelize;