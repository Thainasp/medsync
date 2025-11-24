const express = require("express");
const router = express.Router();
const controller = require("../controllers/medicamentoController");
const authMiddleware = require("../middleware/authMiddleware");

// Aplica segurança em todas as rotas
router.use(authMiddleware);

router.get("/", controller.listarMedicamentos);
router.post("/criar", controller.criarMedicamento);
router.put("/editar", controller.editarMedicamento);

// 🔹 ROTA NOVA (Tem que vir antes de /:id)
router.get("/catalogo", controller.buscarNoCatalogo);

router.get("/:id", controller.getMedicamentoById);

module.exports = router;