const express = require("express");
const router = express.Router();
const controller = require("../controllers/receitaController");
const authMiddleware = require("../middleware/authMiddleware");

// Aplica a proteção em TODAS as rotas deste arquivo
router.use(authMiddleware);

// Definição das rotas
router.get("/", controller.listarReceitas);
router.post("/", controller.criarReceita);
router.get("/:id", controller.buscarReceita);
router.patch("/:id", controller.atualizarReceita); // Rota nova da equipe
router.delete("/:id", controller.deletarReceita);

module.exports = router;