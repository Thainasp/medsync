const db = require("../db/database");

exports.listar = (req, res) => {
  const sql = `
    SELECT thp.*, t.data_inicio, p.idPrescricao
    FROM Tratamento_has_Prescricao thp
    INNER JOIN Tratamento t ON thp.Tratamento_idTratamento = t.idTratamento
    INNER JOIN Prescricao p ON thp.Prescricao_idPrescricao = p.idPrescricao
  `;
  db.all(sql, [], (err, rows) => {
    if (err) res.status(500).json({ erro: err.message });
    else res.json(rows);
  });
};

exports.criar = (req, res) => {
  console.log(req.body)
  const { Tratamento_idTratamento, Prescricao_idPrescricao, horario } =
    req.body;
  db.run(
    `INSERT INTO Tratamento_has_Prescricao (Tratamento_idTratamento, Prescricao_idPrescricao, horario)
     VALUES (?, ?, ?)`,
    [Tratamento_idTratamento, Prescricao_idPrescricao, horario],
    function (err) {
      if (err) res.status(500).json({ erro: err.message });
      else res.status(201).json({ id: this.lastID });
    }
  );
};
