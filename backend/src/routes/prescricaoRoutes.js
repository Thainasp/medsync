const express = require("express");
const router = express.Router();
const controller = require("../controllers/prescricaoController");

router.get("/", controller.listarPrescricoes);
router.post("/", controller.criarPrescricao);

module.exports = router;
