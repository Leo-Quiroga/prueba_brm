//Define las rutas para la gestión de productos y las protege con middleware de autenticación y autorización.

const router = require("express").Router();
const controller = require("../controllers/auth.controller");
const auth = require("../middlewares/auth");

router.post("/", auth(["admin"]), controller.create);
router.get("/", auth(["admin", "user"]), controller.getAll);
router.get("/:id", auth(["admin", "user"]), controller.getById);
router.put("/:id", auth(["admin"]), controller.update);
router.delete("/:id", auth(["admin"]), controller.delete);

module.exports = router;
