const express = require("express");
const router = express.Router();
const pacienteController = require("../controllers/pacienteController");
const authMiddleware = require("../middleware/authMiddleware");

// 🔹 Rotas PÚBLICAS (Login, Cadastro, Recuperar Senha)
router.post("/login", pacienteController.login);
router.post("/cadastro", pacienteController.criarPaciente);
router.post("/recuperar-senha", pacienteController.recuperarSenha);

// 🔹 Rotas PRIVADAS (Listar, Buscar Perfil, Deletar Conta)
router.get("/", authMiddleware, pacienteController.listarPacientes);
router.get("/:id", authMiddleware, pacienteController.buscarPaciente);
router.delete("/:id", authMiddleware, pacienteController.deletarPaciente);

module.exports = router;