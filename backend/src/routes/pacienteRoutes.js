const express = require("express");
const router = express.Router();
// Certifique-se que o caminho para o controller está correto
const pacienteController = require("../controllers/pacienteController");

// 🔹 Rota de LOGIN
// URL Final: http://localhost:3001/pacientes/login
router.post("/login", pacienteController.login);

// 🔹 Rota de CADASTRO
// URL Final: http://localhost:3001/pacientes/cadastro
router.post("/cadastro", pacienteController.criarPaciente);

// 🔹 Rotas CRUD Padrão (Manter para outras funcionalidades)
// URL Final: http://localhost:3001/pacientes/ (Lista todos)
router.get("/", pacienteController.listarPacientes);

// URL Final: http://localhost:3001/pacientes/:id (Busca um específico)
router.get("/:id", pacienteController.buscarPaciente);

// URL Final: http://localhost:3001/pacientes/:id (Deleta)
router.delete("/:id", pacienteController.deletarPaciente);

module.exports = router;