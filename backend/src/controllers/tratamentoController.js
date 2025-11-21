const db = require("../db/database");

exports.listarTratamentos = (req, res) => {
  const idUsuario = req.userId;

  // O "Pulo do Gato":
  // Tratamento -> Tratamento_has_Prescricao -> Prescricao -> Receita -> Paciente
  const sql = `
    SELECT DISTINCT T.* FROM Tratamento T
    INNER JOIN Tratamento_has_Prescricao THP ON T.idTratamento = THP.Tratamento_idTratamento
    INNER JOIN Prescricao P ON THP.Prescricao_idPrescricao = P.idPrescricao
    INNER JOIN Receita R ON P.Receita_idReceita = R.idReceita
    WHERE R.Paciente_idPaciente = ?
  `;

  db.all(sql, [idUsuario], (err, rows) => {
    if (err) res.status(500).json({ erro: err.message });
    else res.json(rows);
  });
};

exports.criarTratamento = (req, res) => {
  // Como o Tratamento é criado "solto" antes de ser vinculado na tabela N:N,
  // nós permitimos a criação. A segurança virá na hora de listar (só aparece se tiver vínculo).
  const { periodo, consumido } = req.body; // Removi data_inicio pois não estava no seu Create Table, adicione se necessário

  db.run(
    "INSERT INTO Tratamento (periodo, consumido) VALUES (?, ?)",
    [periodo, consumido],
    function (err) {
      if (err) res.status(500).json({ erro: err.message });
      else res.status(201).json({ id: this.lastID });
    }
  );
};