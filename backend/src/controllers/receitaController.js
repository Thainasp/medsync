/**
 * Calcula a data de vencimento de uma receita (30 dias após a data da receita).
 * @param {string} dateString - A data inicial da receita no formato 'YYYY-MM-DD'.
 * @returns {Date} A data de validade.
 */

const db = require("../db/database");

exports.criarReceita = (req, res) => {
  const { nomeReceita,
    dataReceita,
    medicamentoId,
    alertaAtivo,
    Paciente_idPaciente,
    observacoes
  } = req.body;

  if (!nomeReceita || !dataReceita || !medicamentoId) {
    return res.status(400).json({ error: 'Erro! Preencha os campos obrigatórios.' });
  }

  const dataVencimento = calculoVencimentoReceita(dataReceita);

  db.run(
    `INSERT INTO Receita (
    nomeReceita, 
    data_emissao,
    medicamentoId,
    Paciente_idPaciente, 
    observacoes,
    alertaAtivo,
    data_vencimento)
    VALUES (?, ?, ?, ?, ?, ?, ?)`,

    [nomeReceita,
      dataReceita,
      medicamentoId,
      Paciente_idPaciente,
      observacoes,
      alertaAtivo,
      dataVencimento.toISOString().split('T')[0]],

    function (err) {
      if (err) {
        console.error("Erro ao inserir receita:", err.message);
        return res.status(500).json({ erro: 'Erro interno ao salvar a receita.' });
      }
      return res.status(201).json({
        id: this.lastID,
        nomeReceita,
        dataReceita: dataReceita,
        data_vencimento: dataVencimento.toISOString().split('T')[0],
      });
    });
  };


  function calculoVencimentoReceita(dateString) {
    const dataInicio = new Date(dateString);
    dataInicio.setDate(dataInicio.getDate() + 30); // Adiciona 30 dias.
    return dataInicio;
  };

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

  exports.atualizarReceita = (req, res) => { 

    const { id } = req.params;
    const updateData = req.body;

    delete updateData.Paciente_idPaciente;

    const { 
        nomeReceita, 
        dataReceita, 
        nomeMedicamentoUsado,
        dosagemUsada,
        alertaAtivo, 
        observacoes 
    } = req.body;
   };
