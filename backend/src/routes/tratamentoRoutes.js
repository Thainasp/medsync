const express = require("express");
const router = express.Router();
const controller = require("../controllers/tratamentoController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, controller.listarTratamentos);
router.post("/", authMiddleware, controller.criarTratamento);

module.exports = router;