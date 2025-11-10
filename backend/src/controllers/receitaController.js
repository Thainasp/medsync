const db = require("../db/database");

exports.listarReceitas = (req, res) => {
  const sql = `
    SELECT Receita.*, Paciente.nome AS nomePaciente
    FROM Receita
    INNER JOIN Paciente ON Receita.Paciente_idPaciente = Paciente.idPaciente
  `;
  db.all(sql, [], (err, rows) => {
    if (err) res.status(500).json({ erro: err.message });
    else res.json(rows);
  });
};

exports.criarReceita = (req, res) => {
  const { nomeReceita, data_emissao, Paciente_idPaciente, observacoes } =
    req.body;
  db.run(
    `INSERT INTO Receita (nomeReceita, data_emissao, Paciente_idPaciente, observacoes)
     VALUES (?, ?, ?, ?)`,
    [nomeReceita, data_emissao, Paciente_idPaciente, observacoes],
    function (err) {
      if (err) res.status(500).json({ erro: err.message });
      else res.status(201).json({ id: this.lastID, nomeReceita, data_emissao });
    }
  );
};

exports.buscarReceita = (req, res) => {
  db.get(
    "SELECT * FROM Receita WHERE idReceita = ?",
    [req.params.id],
    (err, row) => {
      if (err) res.status(500).json({ erro: err.message });
      else if (!row) res.status(404).json({ erro: "Receita não encontrada" });
      else res.json(row);
    }
  );
};

exports.deletarReceita = (req, res) => {
  db.run(
    "DELETE FROM Receita WHERE idReceita = ?",
    [req.params.id],
    function (err) {
      if (err) res.status(500).json({ erro: err.message });
      else if (this.changes === 0)
        res.status(404).json({ erro: "Receita não encontrada" });
      else res.json({ mensagem: "Receita deletada com sucesso" });
    }
  );
};
