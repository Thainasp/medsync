const db = require("../db/database");

// 🔹 Controlador para listar todos os pacientes
exports.listarPacientes = (req, res) => {
  db.all("SELECT * FROM Paciente", [], (err, rows) => {
    if (err) {
      res.status(500).json({ erro: err.message });
    } else {
      res.json(rows);
    }
  });
};

// 🔹 Controlador para adicionar um paciente
exports.criarPaciente = (req, res) => {
  const { nome, senha, email, telefone } = req.body;

  if (!nome || !senha || !email || !telefone) {
    return res.status(400).json({ erro: "Todos os campos são obrigatórios." });
  }

  db.run(
    "INSERT INTO Paciente (nome, senha, email, telefone) VALUES (?, ?, ?, ?)",
    [nome, senha, email, telefone],
    function (err) {
      if (err) {
        res.status(500).json({ erro: err.message });
      } else {
        res.status(201).json({
          id: this.lastID,
          nome,
          email,
          telefone,
        });
      }
    }
  );
};

// 🔹 Controlador para buscar paciente por ID
exports.buscarPaciente = (req, res) => {
  const { id } = req.params;
  db.get("SELECT * FROM Paciente WHERE idPaciente = ?", [id], (err, row) => {
    if (err) res.status(500).json({ erro: err.message });
    else if (!row) res.status(404).json({ erro: "Paciente não encontrado." });
    else res.json(row);
  });
};

// 🔹 Controlador para deletar paciente
exports.deletarPaciente = (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM Paciente WHERE idPaciente = ?", [id], function (err) {
    if (err) res.status(500).json({ erro: err.message });
    else if (this.changes === 0)
      res.status(404).json({ erro: "Paciente não encontrado." });
    else res.json({ mensagem: "Paciente removido com sucesso." });
  });
};
