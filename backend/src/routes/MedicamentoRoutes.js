const express = require("express");
const router = express.Router();
const controller = require("../controllers/medicamentoController");

router.get("/", controller.listarMedicamentos);
router.post("/", controller.criarMedicamento);

module.exports = router;
