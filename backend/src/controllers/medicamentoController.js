const db = require("../db/database");

exports.listarMedicamentos = (req, res) => {
  db.all("SELECT * FROM Medicamento", [], (err, rows) => {
    if (err) res.status(500).json({ erro: err.message });
    else res.json(rows);
  });
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
