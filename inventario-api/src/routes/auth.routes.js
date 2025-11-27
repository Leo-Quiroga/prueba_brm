//Define las rutas de autenticación (registro e inicio de sesión) y las vincula a los controladores correspondientes.
const router = require("express").Router();
const controller = require("../controllers/auth.controller");

router.post("/register", controller.register);
router.post("/login", controller.login);

module.exports = router;