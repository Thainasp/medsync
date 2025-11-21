const express = require("express");
const router = express.Router();
const controller = require("../controllers/tratamentoHasPrescricaoController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, controller.listar);
router.post("/", authMiddleware, controller.criar);

module.exports = router;