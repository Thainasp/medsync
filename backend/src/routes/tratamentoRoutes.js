const express = require("express");
const router = express.Router();
const controller = require("../controllers/tratamentoController");

router.get("/", controller.listarTratamentos);
router.post("/", controller.criarTratamento);

module.exports = router;
