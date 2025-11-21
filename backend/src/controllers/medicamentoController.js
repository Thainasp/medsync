const db = require("../db/database");

// Lista APENAS os medicamentos do usuário logado
exports.listarMedicamentos = (req, res) => {
  const idUsuario = req.userId;
  db.all("SELECT * FROM Medicamento WHERE idPaciente = ?", [idUsuario], (err, rows) => {
    if (err) res.status(500).json({ erro: err.message });
    else res.status(200).json(rows);
  });
};

exports.getMedicamentoById = (req, res) => {
  const idUsuario = req.userId;
  db.get("SELECT * FROM Medicamento WHERE idMedicamento = ? AND idPaciente = ?", 
    [req.params.id, idUsuario], 
    (err, row) => {
      if (err) res.status(500).json({ erro: err.message });
      else if (!row) res.status(404).json({ erro: "Medicamento não encontrado" });
      else res.json(row);
    }
  );
};

exports.criarMedicamento = (req, res) => {
  const idUsuario = req.userId;
  const { nome, dosagem } = req.body;

  // Salvamos o idPaciente junto!
  db.run(
    "INSERT INTO Medicamento (nome, dosagem, idPaciente) VALUES (?, ?, ?)",
    [nome, dosagem, idUsuario],
    function (err) {
      if (err) res.status(500).json({ erro: err.message });
      else res.status(201).json({ id: this.lastID, nome, dosagem });
    }
  );
};

exports.editarMedicamento = (req, res) => {
  const idUsuario = req.userId;
  const { nome, dosagem, id } = req.body;
  
  db.run(
    "UPDATE Medicamento SET nome = ?, dosagem = ? WHERE idMedicamento = ? AND idPaciente = ?",
    [nome, dosagem, id, idUsuario],
    function (err) {
      if (err) res.status(500).json({ erro: err.message });
      else res.status(201).json({ mensagem: "Atualizado com sucesso" });
    }
  );
};