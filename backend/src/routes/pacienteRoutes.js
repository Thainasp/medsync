const express = require("express");
const router = express.Router();
const pacienteController = require("../controllers/pacienteController");

router.get("/", pacienteController.listarPacientes);
router.post("/", pacienteController.criarPaciente);
router.get("/:id", pacienteController.buscarPaciente);
router.delete("/:id", pacienteController.deletarPaciente);

module.exports = router;
