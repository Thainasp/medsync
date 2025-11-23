const express = require("express");
const router = express.Router();
const controller = require("../controllers/receitaController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", controller.listarReceitas);
router.post("/", controller.criarReceita);
router.get("/:id", controller.buscarReceita);
router.delete("/:id", controller.deletarReceita);
router.patch('/:id', controller.atualizarReceita);
router.get("/", authMiddleware, controller.listarReceitas);
router.post("/", authMiddleware, controller.criarReceita);
router.get("/:id", authMiddleware, controller.buscarReceita);
router.delete("/:id", authMiddleware, controller.deletarReceita);

module.exports = router;