const db = require("../db/database");

exports.listarReceitas = (req, res) => {
  const idUsuario = req.userId; // Vem do Token

  const sql = `
    SELECT Receita.* FROM Receita
    WHERE Receita.Paciente_idPaciente = ?
  `;
  
  db.all(sql, [idUsuario], (err, rows) => {
    if (err) res.status(500).json({ erro: err.message });
    else res.json(rows);
  });
};

exports.criarReceita = (req, res) => {
  const idUsuario = req.userId;
  const { nomeReceita, data_emissao, observacoes } = req.body; // Corrigido para data_emissao

  db.run(
    `INSERT INTO Receita (nomeReceita, data_emissao, Paciente_idPaciente, observacoes)
     VALUES (?, ?, ?, ?)`,
    [nomeReceita, data_emissao, idUsuario, observacoes],
    function (err) {
      if (err) res.status(500).json({ erro: err.message });
      else res.status(201).json({ id: this.lastID, nomeReceita });
    }
  );
};

exports.buscarReceita = (req, res) => {
  const idUsuario = req.userId;
  db.get(
    "SELECT * FROM Receita WHERE idReceita = ? AND Paciente_idPaciente = ?",
    [req.params.id, idUsuario],
    (err, row) => {
      if (err) res.status(500).json({ erro: err.message });
      else if (!row) res.status(404).json({ erro: "Receita não encontrada." });
      else res.json(row);
    }
  );
};

exports.deletarReceita = (req, res) => {
  const idUsuario = req.userId;
  db.run(
    "DELETE FROM Receita WHERE idReceita = ? AND Paciente_idPaciente = ?",
    [req.params.id, idUsuario],
    function (err) {
      if (err) res.status(500).json({ erro: err.message });
      else if (this.changes === 0) res.status(404).json({ erro: "Receita não encontrada." });
      else res.json({ mensagem: "Receita deletada com sucesso" });
    }
  );
};