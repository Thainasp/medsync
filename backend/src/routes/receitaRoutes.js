const express = require("express");
const router = express.Router();
const controller = require("../controllers/receitaController");

router.get("/", controller.listarReceitas);
router.post("/", controller.criarReceita);
router.get("/:id", controller.buscarReceita);
router.delete("/:id", controller.deletarReceita);

module.exports = router;
