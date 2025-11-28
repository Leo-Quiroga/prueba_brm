//Define las rutas para la gestión de productos y las protege con middleware de autenticación y autorización.

const router = require("express").Router();
const controller = require("../controllers/product.controller");
const auth = require("../middlewares/auth");

router.post("/", auth(["Administrador"]), controller.create);
router.get("/", auth(["Administrador", "Cliente"]), controller.getAll);
router.get("/:id", auth(["Administrador", "Cliente"]), controller.getById);
router.put("/:id", auth(["Administrador"]), controller.update);
router.delete("/:id", auth(["Administrador"]), controller.delete);

module.exports = router;

