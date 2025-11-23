/**
 * Calcula a data de vencimento de uma receita (30 dias após a data da receita).
 * @param {string} dateString - A data inicial da receita no formato 'DD-MM-YYYY'.
 * @returns {Date} A data de validade.
 */

const db = require("../db/database");

const util = require('util');

// Wrapper promisificado local
const dbAsync = {
  get: util.promisify(db.get).bind(db),
  all: util.promisify(db.all).bind(db),
  run: (sql, params = []) => {
    return new Promise((resolve, reject) => {
      db.run(sql, params, function (err) {
        if (err) return reject(err);
        // 'this' é a Statement; fornecemos lastID/changes para o chamador
        resolve({ lastID: this.lastID, changes: this.changes });
      });
    });
  }
};

function isValidBRDate(dateString) {
  // Aceita apenas DD/MM/YYYY
  return /^\d{2}\/\d{2}\/\d{4}$/.test(dateString);
}

function toISODate(dateString) {
  const [day, month, year] = dateString.split('/');
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

function calculoVencimentoReceita(dateString) {
  // Retorna a data de vencimento em formato ISO (YYYY-MM-DD)
  if (!isValidBRDate(dateString)) throw new Error("Data deve estar no formato DD/MM/YYYY");
  const [day, month, year] = dateString.split('/');
  const startDate = new Date(`${year}-${month.padStart(2,'0')}-${day.padStart(2,'0')}`);
  startDate.setDate(startDate.getDate() + 30);
  const y = startDate.getFullYear();
  const m = String(startDate.getMonth() + 1).padStart(2, '0');
  const d = String(startDate.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

exports.criarReceita = async (req, res) => {
  const { nomeReceita, dataReceita, Paciente_idPaciente, medicamentosReceita, observacoes } =
    req.body;

  if (!nomeReceita || !dataReceita || !medicamentosReceita || !Array.isArray(medicamentosReceita) || medicamentosReceita.length === 0) {
    return res.status(400).json({ erro: 'Campos obrigatórios ausentes ou formato inválido.' });
  }

  if (!isValidBRDate(dataReceita)) {
    return res.status(400).json({ erro: 'dataReceita deve estar no formato DD/MM/YYYY' });
  }
  const dataEmissaoISO = toISODate(dataReceita);

  const dataVencimento = calculoVencimentoReceita(dataReceita);

  for (const med of medicamentosReceita) {
    if (!med || !med.nome) return res.status(400).json({ erro: 'Cada medicamento precisa ter o campo nome' });

    // validação da dosagem: existe e é número finito
    if (med.dosagem === undefined || med.dosagem === null || !Number.isFinite(Number(med.dosagem))) {
      return res.status(400).json({ erro: `Dosagem inválida para o medicamento "${med.nome}"` });
    }

    // validação da frequência: inteiro (aceita string numérica)
    if (!Number.isInteger(Number(med.frequencia))) {
      return res.status(400).json({ erro: `Frequência inválida para o medicamento "${med.nome}"` });
    }

    // validação da quantidade/uso: aceita `qtdUso` ou `quantidade` (inteiro > 0)
    const qtdUsoVal = med.qtdUso !== undefined ? med.qtdUso : med.quantidade;
    if (!Number.isInteger(Number(qtdUsoVal)) || Number(qtdUsoVal) <= 0) {
      return res.status(400).json({ erro: `Quantidade de uso inválida para o medicamento "${med.nome}"` });
    }
  }

  let paciente;
  try {
    paciente = await dbAsync.get("SELECT idPaciente FROM Paciente WHERE idPaciente = ?", [Paciente_idPaciente]);
  } catch (err) {
    console.error("Erro ao buscar paciente:", err.message);
    return res.status(500).json({ erro: err.message });
  }
  if (!paciente) return res.status(400).json({ erro: 'Paciente não encontrado' });

  try {
    await dbAsync.run("BEGIN TRANSACTION;");
    // 2. INSERIR A RECEITA
    const receitaResult = await dbAsync.run(`
            INSERT INTO Receita (nomeReceita, data_emissao, Paciente_idPaciente, observacoes)
     VALUES (?, ?, ?, ?)`,
      [nomeReceita, dataEmissaoISO, Paciente_idPaciente, observacoes]
    );

    const idReceitaCriada = receitaResult.lastID;

    // 3. ITERAR E INSERIR AS PRESCRIÇÕES (Itens da Receita)
    for (const med of medicamentosReceita) {

      // 3a. Busca ou Insere o Medicamento no Catálogo
      const medRow = await dbAsync.get("SELECT idMedicamento FROM Medicamento WHERE nome = ?", [med.nome]);

      let idMedicamento;
      if (medRow) {
        idMedicamento = medRow.idMedicamento;
      } else {
        const novoMedResult = await dbAsync.run(
          "INSERT INTO Medicamento (nome, dosagem) VALUES (?, ?)",
          [med.nome, med.dosagem]
        );
        idMedicamento = novoMedResult.lastID;
      }
      // 3b. Inserir na tabela Prescricao
      await dbAsync.run(`
                INSERT INTO Prescricao (
                    frequencia, quantidade, observacoes, Medicamento_idMedicamento, Receita_idReceita
                ) VALUES (?, ?, ?, ?, ?)`, [
        med.frequencia,
        med.qtdUso,
        med.observacoesItem || null,
        idMedicamento,
        idReceitaCriada
      ]);
    }

    // 4. COMMIT DA TRANSAÇÃO
    await dbAsync.run("COMMIT;");
    res.status(201).json({
      message: "Receita e prescrições salvas com sucesso!",
      idReceita: idReceitaCriada
    });

  } catch (error) {
    // ROLLBACK em caso de qualquer erro
    await dbAsync.run("ROLLBACK;").catch(rollbackErr => console.error("Erro no ROLLBACK:", rollbackErr.message));
    console.error("Erro durante a criação da receita (transação desfeita):", error.message);
    res.status(500).json({ erro: error.message });
  }
};

exports.atualizarReceita = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  // Removendo campos que não atualizam o cabeçalho (e que exigem lógica separada)
  delete updateData.Paciente_idPaciente;
  delete updateData.medicamentosReceita;

  let fields = [];
  let params = [];
  let dataVencimento;

  // Construção dinâmica
  if (updateData.nomeReceita) { fields.push("nomeReceita = ?"); params.push(updateData.nomeReceita); }
  if (updateData.observacoes !== undefined) { fields.push("observacoes = ?"); params.push(updateData.observacoes); }

  if (updateData.dataReceita) {
    const dataEmissaoISO = toISODate(updateData.dataReceita);
    fields.push("data_emissao = ?");
    params.push(dataEmissaoISO);

    dataVencimento = calculoVencimentoReceita(updateData.dataReceita);
    fields.push("data_vencimento = ?");
    params.push(dataVencimento);
  }

  if (fields.length === 0) {
    return res.status(400).json({ erro: "Nenhum dado válido fornecido para atualização." });
  }

  params.push(id); // ID para a cláusula WHERE

  const sql = `UPDATE Receita SET ${fields.join(', ')} WHERE idReceita = ?`;

  try {
    const result = await dbAsync.run(sql, params);

    if (result.changes === 0) {
      return res.status(404).json({ erro: "Receita não encontrada." });
    }

    res.status(200).json({ message: "Cabeçalho da Receita atualizado com sucesso!" });

  } catch (err) {
    console.error("Erro ao atualizar receita:", err.message);
    res.status(500).json({ erro: err.message });
  }
};

// -------------------------------------------------------------------
// OUTRAS FUNÇÕES (Não alteradas na lógica principal, mas adaptadas para async/await)
// -------------------------------------------------------------------

exports.listarReceitas = async (req, res) => {
  try {
    const sql = `
            SELECT R.idReceita, R.nomeReceita, R.data_emissao, P.nome AS nomePaciente
            FROM Receita R
            INNER JOIN Paciente P ON R.Paciente_idPaciente = P.idPaciente
        `;
    const receitas = await dbAsync.all(sql);
    res.json(receitas);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

exports.buscarReceita = async (req, res) => {
  const id = req.params.id;

  try {
    // 1. Busca dados do cabeçalho da Receita
    const receita = await dbAsync.get("SELECT * FROM Receita WHERE idReceita = ?", [id]);
    if (!receita) {
      return res.status(404).json({ erro: "Receita não encontrada." });
    }

    // 2. Busca os itens (Prescricoes) relacionados (JOIN com Medicamento para o nome/dosagem)
    const itens = await dbAsync.all(`
            SELECT 
                p.idPrescricao AS id, p.frequencia, p.quantidade AS qtdUso, p.observacoes AS observacoesItem, 
                m.nome AS nomeMedicamento, m.dosagem 
            FROM Prescricao p
            INNER JOIN Medicamento m ON p.Medicamento_idMedicamento = m.idMedicamento
            WHERE p.Receita_idReceita = ?
        `, [id]);

    // 3. Combina e envia (Mapeando nomes para o Front-end)
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
    res.status(500).json({ erro: 'Erro interno ao buscar dados da receita.' });
  }
};

exports.deletarReceita = async (req, res) => {
  const id = req.params.id;

  try {
    await dbAsync.run("BEGIN TRANSACTION;");

    // 1. Deleta itens relacionados na Prescricao
    await dbAsync.run("DELETE FROM Prescricao WHERE Receita_idReceita = ?", [id]);

    // 2. Deleta a Receita
    const result = await dbAsync.run("DELETE FROM Receita WHERE idReceita = ?", [id]);

    await dbAsync.run("COMMIT;");

    if (result.changes === 0) {
      return res.status(404).json({ erro: "Receita não encontrada" });
    }
    res.json({ mensagem: "Receita e suas prescrições deletadas com sucesso" });

  } catch (err) {
    await dbAsync.run("ROLLBACK;").catch(rollbackErr => console.error("Erro no ROLLBACK:", rollbackErr.message));
    res.status(500).json({ erro: err.message });
  }
};
