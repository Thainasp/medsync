const db = require("../db/database");
const catalogoMedicamentos = require("../data/catalogoMedicamentos.js");

exports.listarMedicamentos = (req, res) => {
  const catalogo = catalogoMedicamentos.map((medicamento) => {
    return {
      id: medicamento.id,
      nomeMedicamento: medicamento.NOME_MEDICAMENTO,
    };
  });
  res.status(200).json(catalogo);
};

exports.getMedicamentoById = (req, res) => {
  db.get(
    "SELECT * FROM Medicamento WHERE idMedicamento = ?",
    [req.params.id],
    (err, row) => {
      if (err) res.status(500).json({ erro: err.message });
      else if (!row)
        res.status(404).json({ erro: "Medicamento não encontrado" });
    }
  );
};

exports.criarMedicamento = (req, res) => {
  const { nome, dosagem } = req.body;
  db.run(
    "INSERT INTO Medicamento (nome, dosagem) VALUES (?, ?)",
    [nome, dosagem],
    function (err) {
      if (err) res.status(500).json({ erro: err.message });
      else res.status(201).json({ id: this.lastID, nome, dosagem });
    }
  );
};

exports.editarMedicamento = (req, res) => {
  const { nome, dosagem, id } = req.body;
  db.run(
    "UPDATE Medicamento SET nome = ?, dosagem = ? WHERE idMedicamento = ?",
    [nome, dosagem, id],
    function (err) {
      if (err) res.status(500).json({ erro: err.message });
      else
        res
          .status(201)
          .json({ mensagem: "Medicamento atualizado com sucesso" });
    }
  );
};
