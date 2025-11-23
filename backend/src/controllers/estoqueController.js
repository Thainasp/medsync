const db = require("../db/database");

exports.listarEstoque = (req, res) => {
  const idUsuario = req.userId;

  // A Mágica: Join Estoque -> Medicamento -> (Filtro idPaciente)
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
  // Mantém igual. Como o Medicamento já é privado (passo 2),
  // você só consegue criar estoque de um remédio que é seu.
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