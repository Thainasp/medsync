const express = require("express");
const router = express.Router();
const controller = require("../controllers/medicamentoController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, controller.listarMedicamentos);
router.post("/criar", authMiddleware, controller.criarMedicamento);
router.put("/editar", authMiddleware, controller.editarMedicamento);
router.get("/:id", authMiddleware, controller.getMedicamentoById);

module.exports = router;