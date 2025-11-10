const db = require("../db/database");

exports.listarTratamentos = (req, res) => {
  db.all("SELECT * FROM Tratamento", [], (err, rows) => {
    if (err) res.status(500).json({ erro: err.message });
    else res.json(rows);
  });
};

exports.criarTratamento = (req, res) => {
  const { data_inicio, periodo, consumido } = req.body;
  db.run(
    "INSERT INTO Tratamento (data_inicio, periodo, consumido) VALUES (?, ?, ?)",
    [data_inicio, periodo, consumido],
    function (err) {
      if (err) res.status(500).json({ erro: err.message });
      else res.status(201).json({ id: this.lastID });
    }
  );
};
