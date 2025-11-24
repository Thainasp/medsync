const db = require("../db/database");

exports.listarEstoque = (req, res) => {
  const idUsuario = req.userId;

  const sql = `
    SELECT Estoque.*, Medicamento.nome AS nomeMedicamento
    FROM Estoque
    INNER JOIN Medicamento ON Estoque.Medicamento_idMedicamento = Medicamento.idMedicamento
    WHERE Medicamento.idPaciente = ?
  `;
  
  db.all(sql, [idUsuario], (err, rows) => {
    if (err) res.status(500).json({ erro: err.message });
    else res.json(rows);
  });
};

exports.criarEstoque = (req, res) => {
  const { data_compra, quantidade, Medicamento_idMedicamento } = req.body;
  
  db.run(
    `INSERT INTO Estoque (data_compra, quantidade, Medicamento_idMedicamento)
     VALUES (?, ?, ?)`,
    [data_compra, quantidade, Medicamento_idMedicamento],
    function (err) {
      if (err) res.status(500).json({ erro: err.message });
      else res.status(201).json({ id: this.lastID });
    }
  );
};