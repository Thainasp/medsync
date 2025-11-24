const db = require("../db/database");
const util = require('util');

// Wrapper promisificado local (Mantido da sua equipe)
const dbAsync = {
  get: util.promisify(db.get).bind(db),
  all: util.promisify(db.all).bind(db),
  run: (sql, params = []) => {
    return new Promise((resolve, reject) => {
      db.run(sql, params, function (err) {
        if (err) return reject(err);
        resolve({ lastID: this.lastID, changes: this.changes });
      });
    });
  }
};

// Funções Auxiliares
function isValidBRDate(dateString) {
  return /^\d{2}\/\d{2}\/\d{4}$/.test(dateString);
}

function toISODate(dateString) {
  const [day, month, year] = dateString.split('/');
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

function calculoVencimentoReceita(dateString) {
  if (!isValidBRDate(dateString)) throw new Error("Data deve estar no formato DD/MM/YYYY");
  const [day, month, year] = dateString.split('/');
  const startDate = new Date(`${year}-${month.padStart(2,'0')}-${day.padStart(2,'0')}`);
  startDate.setDate(startDate.getDate() + 30);
  const y = startDate.getFullYear();
  const m = String(startDate.getMonth() + 1).padStart(2, '0');
  const d = String(startDate.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// --- CONTROLLERS ---

exports.criarReceita = async (req, res) => {
  // SEGURANÇA: Pegamos o ID do token, ignorando o que vem no body
  const Paciente_idPaciente = req.userId; 
  
  const { nomeReceita, dataReceita, medicamentosReceita, observacoes } = req.body;

  if (!nomeReceita || !dataReceita || !medicamentosReceita || !Array.isArray(medicamentosReceita) || medicamentosReceita.length === 0) {
    return res.status(400).json({ erro: 'Campos obrigatórios ausentes ou formato inválido.' });
  }

  if (!isValidBRDate(dataReceita)) {
    return res.status(400).json({ erro: 'dataReceita deve estar no formato DD/MM/YYYY' });
  }
  const dataEmissaoISO = toISODate(dataReceita);

  // Validações dos itens
  for (const med of medicamentosReceita) {
    if (!med || !med.nome) return res.status(400).json({ erro: 'Cada medicamento precisa ter o campo nome' });
    if (med.dosagem === undefined || med.dosagem === null || !Number.isFinite(Number(med.dosagem))) {
      return res.status(400).json({ erro: `Dosagem inválida para o medicamento "${med.nome}"` });
    }
    if (!Number.isInteger(Number(med.frequencia))) {
      return res.status(400).json({ erro: `Frequência inválida para o medicamento "${med.nome}"` });
    }
    const qtdUsoVal = med.qtdUso !== undefined ? med.qtdUso : med.quantidade;
    if (!Number.isInteger(Number(qtdUsoVal)) || Number(qtdUsoVal) <= 0) {
      return res.status(400).json({ erro: `Quantidade de uso inválida para o medicamento "${med.nome}"` });
    }
  }

  try {
    // Inicia Transação
    await dbAsync.run("BEGIN TRANSACTION;");

    // 1. INSERIR A RECEITA (Vinculada ao usuário logado)
    const receitaResult = await dbAsync.run(`
      INSERT INTO Receita (nomeReceita, data_emissao, Paciente_idPaciente, observacoes)
      VALUES (?, ?, ?, ?)`,
      [nomeReceita, dataEmissaoISO, Paciente_idPaciente, observacoes]
    );

    const idReceitaCriada = receitaResult.lastID;

    // 2. ITERAR E INSERIR AS PRESCRIÇÕES
    for (const med of medicamentosReceita) {
      // Busca ou cria medicamento (privado do usuário)
      const medRow = await dbAsync.get(
        "SELECT idMedicamento FROM Medicamento WHERE nome = ? AND idPaciente = ?",
        [med.nome, Paciente_idPaciente]
      );

      let idMedicamento;
      if (medRow) {
        idMedicamento = medRow.idMedicamento;
      } else {
        const novoMedResult = await dbAsync.run(
          "INSERT INTO Medicamento (nome, dosagem, idPaciente) VALUES (?, ?, ?)",
          [med.nome, med.dosagem, Paciente_idPaciente]
        );
        idMedicamento = novoMedResult.lastID;
      }

      const qtdUsoVal = med.qtdUso !== undefined ? med.qtdUso : med.quantidade;
      await dbAsync.run(`
        INSERT INTO Prescricao (frequencia, quantidade, observacoes, Medicamento_idMedicamento, Receita_idReceita) 
        VALUES (?, ?, ?, ?, ?)`, 
        [Number(med.frequencia), Number(qtdUsoVal), med.observacoesItem || null, idMedicamento, idReceitaCriada]
      );
    }

    await dbAsync.run("COMMIT;");
    res.status(201).json({
      message: "Receita e prescrições salvas com sucesso!",
      idReceita: idReceitaCriada
    });

  } catch (error) {
    await dbAsync.run("ROLLBACK;").catch(console.error);
    console.error("Erro durante a criação da receita:", error.message);
    res.status(500).json({ erro: error.message });
  }
};

exports.atualizarReceita = async (req, res) => {
  const { id } = req.params;
  const idUsuario = req.userId; // Segurança
  const updateData = req.body;

  delete updateData.Paciente_idPaciente; // Impede troca de dono
  delete updateData.medicamentosReceita;

  let fields = [];
  let params = [];

  if (updateData.nomeReceita) { fields.push("nomeReceita = ?"); params.push(updateData.nomeReceita); }
  if (updateData.observacoes !== undefined) { fields.push("observacoes = ?"); params.push(updateData.observacoes); }

  if (updateData.dataReceita) {
    const dataEmissaoISO = toISODate(updateData.dataReceita);
    fields.push("data_emissao = ?");
    params.push(dataEmissaoISO);
    // data_vencimento removido pois não estava na estrutura original do banco enviada, 
    // mas se existir no banco, pode manter a lógica da sua equipe.
  }

  if (fields.length === 0) {
    return res.status(400).json({ erro: "Nenhum dado válido fornecido." });
  }

  // Adiciona verificação de segurança (WHERE id AND idPaciente)
  const sql = `UPDATE Receita SET ${fields.join(', ')} WHERE idReceita = ? AND Paciente_idPaciente = ?`;
  params.push(id, idUsuario);

  try {
    const result = await dbAsync.run(sql, params);

    if (result.changes === 0) {
      return res.status(404).json({ erro: "Receita não encontrada ou acesso negado." });
    }

    res.status(200).json({ message: "Receita atualizada com sucesso!" });

  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

exports.listarReceitas = async (req, res) => {
  const idUsuario = req.userId;
  try {
    const sql = `
      SELECT R.idReceita, R.nomeReceita, R.data_emissao, P.nome AS nomePaciente
      FROM Receita R
      INNER JOIN Paciente P ON R.Paciente_idPaciente = P.idPaciente
      WHERE R.Paciente_idPaciente = ?  -- FILTRO DE SEGURANÇA
    `;
    const receitas = await dbAsync.all(sql, [idUsuario]);
    res.json(receitas);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

exports.buscarReceita = async (req, res) => {
  const id = req.params.id;
  const idUsuario = req.userId;

  try {
    // 1. Busca cabeçalho com segurança
    const receita = await dbAsync.get(
      "SELECT * FROM Receita WHERE idReceita = ? AND Paciente_idPaciente = ?", 
      [id, idUsuario]
    );
    
    if (!receita) {
      return res.status(404).json({ erro: "Receita não encontrada." });
    }

    // 2. Busca itens
    const itens = await dbAsync.all(`
      SELECT 
        p.idPrescricao AS id, p.frequencia, p.quantidade AS qtdUso, p.observacoes AS observacoesItem, 
        m.nome AS nomeMedicamento, m.dosagem 
      FROM Prescricao p
      INNER JOIN Medicamento m ON p.Medicamento_idMedicamento = m.idMedicamento
      WHERE p.Receita_idReceita = ?
    `, [id]);

    const responseData = {
      id: receita.idReceita,
      nomeReceita: receita.nomeReceita,
      dataReceita: receita.data_emissao,
      observacoes: receita.observacoes,
      medicamentosReceita: itens
    };

    res.json(responseData);

  } catch (error) {
    console.error("Erro ao buscar receita:", error.message);
    res.status(500).json({ erro: 'Erro interno.' });
  }
};

exports.deletarReceita = async (req, res) => {
  const id = req.params.id;
  const idUsuario = req.userId;

  try {
    // Verifica dono antes de deletar
    const receita = await dbAsync.get("SELECT idReceita FROM Receita WHERE idReceita = ? AND Paciente_idPaciente = ?", [id, idUsuario]);
    if (!receita) return res.status(404).json({ erro: "Receita não encontrada." });

    await dbAsync.run("BEGIN TRANSACTION;");
    await dbAsync.run("DELETE FROM Prescricao WHERE Receita_idReceita = ?", [id]);
    await dbAsync.run("DELETE FROM Receita WHERE idReceita = ?", [id]);
    await dbAsync.run("COMMIT;");

    res.json({ mensagem: "Receita deletada com sucesso" });

  } catch (err) {
    await dbAsync.run("ROLLBACK;").catch(console.error);
    res.status(500).json({ erro: err.message });
  }
};