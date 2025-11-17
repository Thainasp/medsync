const db = require("../db/database");

exports.listarMedicamentos = (req, res) => {
  db.all("SELECT * FROM Medicamento", [], (err, rows) => {
    if (err) res.status(500).json({ erro: err.message });
    else res.json(rows);
  });
};

exports.getMedicamentoById = (req, res) => {
  db.get(
    "SELECT * FROM Medicamento WHERE idMedicamento = ?",
    [req.params.id],
    (err, row) => {
      if (err) res.status(500).json({ erro: err.message }); 
      else if (!row) res.status(404).json({ erro: "Medicamento não encontrado" });
    });
}

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
      else res.status(201).json({ mensagem: "Medicamento atualizado com sucesso" });
    }
  );
};