const db = require("../db/database");

exports.listarPrescricoes = (req, res) => {
  const idUsuario = req.userId;

  // Segurança: Garante que o ID do usuário existe (veio do middleware)
  if (!idUsuario) {
      return res.status(403).json({ erro: "Usuário não autenticado." });
  }

  // Traz a prescrição SE a Receita dela pertencer ao Paciente logado
  const sql = `
    SELECT Prescricao.*, Medicamento.nome AS nomeMedicamento, Receita.nomeReceita
    FROM Prescricao
    INNER JOIN Receita ON Prescricao.Receita_idReceita = Receita.idReceita
    INNER JOIN Medicamento ON Prescricao.Medicamento_idMedicamento = Medicamento.idMedicamento
    WHERE Receita.Paciente_idPaciente = ?
  `;

  db.all(sql, [idUsuario], (err, rows) => {
    if (err) res.status(500).json({ erro: err.message });
    else res.json(rows);
  });
};

exports.criarPrescricao = (req, res) => {
  const { frequencia, quantidade, observacoes, Medicamento_idMedicamento, Receita_idReceita } = req.body;
  const idUsuario = req.userId;

  if (!idUsuario) return res.status(403).json({ erro: "Usuário não autenticado." });

  // 1. Validação de segurança: Verifica se a Receita alvo pertence ao usuário
  db.get("SELECT idReceita FROM Receita WHERE idReceita = ? AND Paciente_idPaciente = ?", 
    [Receita_idReceita, idUsuario], 
    (err, row) => {
      if (err) return res.status(500).json({ erro: err.message });
      
      // Se não achou a receita vinculada a esse usuário:
      if (!row) return res.status(403).json({ erro: "Acesso negado: Você não pode adicionar prescrições nesta receita." });

      // 2. Se passou na validação, cria a prescrição
      db.run(
        `INSERT INTO Prescricao (frequencia, quantidade, observacoes, Medicamento_idMedicamento, Receita_idReceita)
         VALUES (?, ?, ?, ?, ?)`,
        [frequencia, quantidade, observacoes, Medicamento_idMedicamento, Receita_idReceita],
        function (err) {
          if (err) res.status(500).json({ erro: err.message });
          else res.status(201).json({ id: this.lastID, message: "Prescrição adicionada com sucesso." });
        }
      );
  });
};