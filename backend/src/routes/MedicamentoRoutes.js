const express = require("express");
const router = express.Router();
const controller = require("../controllers/medicamentoController");

router.get("/", controller.listarMedicamentos);
router.post("/criar", controller.criarMedicamento);
router.put("/editar", controller.editarMedicamento);
router.get("/:id", controller.getMedicamentoById);
module.exports = router;
