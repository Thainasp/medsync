const express = require('express');
const app = express();
app.use(express.json());
const port = 3001;
const cors = require("cors");
app.use(cors());

const pacienteRoutes = require("./routes/pacienteRoutes");
const receitaRoutes = require("./routes/receitaRoutes");
const medicamentoRoutes = require("./routes/medicamentoRoutes");
const prescricaoRoutes = require("./routes/prescricaoRoutes");
const tratamentoRoutes = require("./routes/tratamentoRoutes");
const estoqueRoutes = require("./routes/estoqueRoutes");
const thpRoutes = require("./routes/tratamentoHasPrescricaoRoutes");

app.get('/', (req, res) => {
  res.send('O servidor Backend está funcionando!');
});

// Rotas
app.use("/pacientes", pacienteRoutes);
app.use("/receitas", receitaRoutes);
app.use("/medicamentos", medicamentoRoutes);
app.use("/prescricoes", prescricaoRoutes);
app.use("/tratamentos", tratamentoRoutes);
app.use("/estoque", estoqueRoutes);
app.use("/tratamento-prescricao", thpRoutes);

app.get("/", (req, res) => res.send("API rodando"));

app.listen(port, () =>
  console.log(`Servidor rodando em http://localhost:${port}`)
);

