const express = require('express');
const cors = require("cors");
const app = express();
const port = 3001;

app.use(express.json());
app.use(cors());

// Importação das Rotas
const pacienteRoutes = require("./routes/pacienteRoutes");
const receitaRoutes = require("./routes/receitaRoutes");
const medicamentoRoutes = require("./routes/medicamentoRoutes");
const prescricaoRoutes = require("./routes/prescricaoRoutes");
const tratamentoRoutes = require("./routes/tratamentoRoutes");
const estoqueRoutes = require("./routes/estoqueRoutes");
const thpRoutes = require("./routes/tratamentoHasPrescricaoRoutes");

// Rota de Teste
app.get('/', (req, res) => {
  res.send('API MedSync rodando com sucesso!');
});

// Definição das Rotas
app.use("/pacientes", pacienteRoutes);
app.use("/receitas", receitaRoutes);
app.use("/medicamentos", medicamentoRoutes);
app.use("/prescricoes", prescricaoRoutes);
app.use("/tratamentos", tratamentoRoutes);
app.use("/estoque", estoqueRoutes);
app.use("/tratamento-prescricao", thpRoutes);

app.listen(port, () =>
  console.log(`Servidor rodando em http://localhost:${port}`)
);