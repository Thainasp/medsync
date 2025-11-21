const express = require("express");
const router = express.Router();
const pacienteController = require("../controllers/pacienteController");
const authMiddleware = require("../middleware/authMiddleware");

// 🔹 Rotas PÚBLICAS (Não precisam de token)
router.post("/login", pacienteController.login);
router.post("/cadastro", pacienteController.criarPaciente);

// 🔹 Rotas PRIVADAS (Precisam de token e protegem os dados)
router.get("/", authMiddleware, pacienteController.listarPacientes);
router.get("/:id", authMiddleware, pacienteController.buscarPaciente);
router.delete("/:id", authMiddleware, pacienteController.deletarPaciente);

module.exports = router;