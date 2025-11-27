
require ('dotenv').config();
const app = require('./src/app');
const sequelize = require('./src/config/db');
require('./src/models');

try {
    sequelize.sync({ alter: true }).then(() => {
        console.log("Base de datos sincronizada");
        app.listen(3000, () => {
            console.log("Servidor corriendo en http://localhost:3000");
        });
    }).catch((error) => {
        console.error("Error sincronizando base de datos:", error);
    });
} catch (error) {
    console.error("Error al iniciar la aplicación:", error);
}