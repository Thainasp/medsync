const db = require("../db/database");

exports.listarPrescricoes = (req, res) => {
  

  const sql = `
    SELECT Prescricao.*, Medicamento.nome AS nomeMedicamento, Receita.nomeReceita
    FROM Prescricao
    INNER JOIN Medicamento ON Prescricao.Medicamento_idMedicamento = Medicamento.idMedicamento
    INNER JOIN Receita ON Prescricao.Receita_idReceita = Receita.idReceita
  `;
  db.all(sql, [], (err, rows) => {
    if (err) res.status(500).json({ erro: err.message });
    else res.json(rows);
  });
};

exports.criarPrescricao = (req, res) => {
  console.log(req.body);
  const {
    frequencia,
    quantidade,
    observacoes,
    Medicamento_idMedicamento,
    Receita_idReceita,
  } = req.body;
  db.run(
    `INSERT INTO Prescricao (frequencia, quantidade, observacoes, Medicamento_idMedicamento, Receita_idReceita)
     VALUES (?, ?, ?, ?, ?)`,
    [
      frequencia,
      quantidade,
      observacoes,
      Medicamento_idMedicamento,
      Receita_idReceita,
    ],
    function (err) {
      if (err) res.status(500).json({ erro: err.message });
      else res.status(201).json({ id: this.lastID });
    }
  );
};
