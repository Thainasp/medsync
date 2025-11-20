/**
 * Calcula a data de vencimento de uma receita (30 dias após a data da receita).
 * @param {string} dateString - A data inicial da receita no formato 'YYYY-MM-DD'.
 * @returns {Date} A data de validade.
 */

const db = require("../db/database");
const util = require('util');
// Promisifica as funções do SQLite
db.get = util.promisify(db.get);
db.all = util.promisify(db.all);
db.run = util.promisify(db.run);

// Função Auxiliar de Cálculo de Vencimento
function calculoVencimentoReceita(dateString) {
    const parts = dateString.split('-'); 
    // Garante que o formato MM/DD/YYYY é usado para criação do objeto Date
    const safeDateString = `${parts[1]}/${parts[0]}/${parts[2]}`; 
    const startDate = new Date(safeDateString);
    
    startDate.setDate(startDate.getDate() + 30); 
    
    return startDate.toISOString().split('T')[0]; // Retorna no formato YYYY-MM-DD
}

// -------------------------------------------------------------------
// CRIAR RECEITA (Transacional)
// -------------------------------------------------------------------

exports.criarReceita = async (req, res) => { // Use 'async' aqui
    const { 
        nomeReceita, 
        dataReceita, 
        observacoes, 
        medicamentosReceita,
        alertaVencimento,    
        notificacaoMed,      
        Paciente_idPaciente 
    } = req.body;

    // 1. Validação CORRIGIDA: Verifica se há pelo menos 1 medicamento no array
    if (!nomeReceita || !dataReceita || !medicamentosReceita || medicamentosReceita.length === 0) {
        return res.status(400).json({ error: 'Erro! Campos obrigatórios ou medicamentos ausentes.' });
    }

    const dataVencimento = calculoVencimentoReceita(dataReceita);

    // Inicia a transação
    try {
        await db.run("BEGIN TRANSACTION;");

        // 2. INSERIR A RECEITA PRINCIPAL
        const receitaResult = await db.run(`
            INSERT INTO Receita (
                nomeReceita, data_emissao, Paciente_idPaciente, observacoes, 
                data_vencimento, alerta_vencimento, notificacao_med
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [
            nomeReceita, 
            dataReceita, 
            Paciente_idPaciente || 1, 
            observacoes, 
            dataVencimento, 
            alertaVencimento, 
            notificacaoMed
        ]);

        const idReceitaCriada = receitaResult.lastID;

        // 3. ITERAR E INSERIR AS PRESCRIÇÕES (Itens da Receita)
        for (const med of medicamentosReceita) {
            
            // 3a. Busca ou Insere o Medicamento no Catálogo
            const medRow = await db.get("SELECT idMedicamento FROM Medicamento WHERE nome = ?", [med.nome]);

            let idMedicamento;
            if (medRow) {
                idMedicamento = medRow.idMedicamento;
            } else {
                // Insere o novo medicamento e pega o novo ID
                const novoMedResult = await db.run(
                    "INSERT INTO Medicamento (nome, dosagem) VALUES (?, ?)", 
                    [med.nome, med.dosagem] // Assumindo que dosagem vem do Front-end para novos
                );
                idMedicamento = novoMedResult.lastID;
            }
            
            // 3b. Inserir na tabela Prescricao
            await db.run(`
                INSERT INTO Prescricao (
                    frequencia, quantidade, observacoes, Medicamento_idMedicamento, Receita_idReceita
                ) VALUES (?, ?, ?, ?, ?)
            `, [
                med.frequencia, 
                med.qtdUso, 
                med.observacoesItem || null, 
                idMedicamento, 
                idReceitaCriada
            ]);
        }
        
        // 4. COMMIT DA TRANSAÇÃO
        await db.run("COMMIT;");
        res.status(201).json({
            message: "Receita e prescrições salvas com sucesso!",
            idReceita: idReceitaCriada
        });

    } catch (error) {
        // ROLLBACK em caso de qualquer erro
        await db.run("ROLLBACK;").catch(rollbackErr => console.error("Erro no ROLLBACK:", rollbackErr.message));
        console.error("Erro durante a criação da receita (transação desfeita):", error.message);
        res.status(500).json({ erro: error.message });
    }
};

// -------------------------------------------------------------------
// ATUALIZAR RECEITA (Cabeçalho)
// -------------------------------------------------------------------

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
    if (updateData.alertaVencimento !== undefined) { fields.push("alerta_vencimento = ?"); params.push(updateData.alertaVencimento); }
    if (updateData.notificacaoMed !== undefined) { fields.push("notificacao_med = ?"); params.push(updateData.notificacaoMed); }
    
    if (updateData.dataReceita) { 
        fields.push("data_emissao = ?"); 
        params.push(updateData.dataReceita);
        
        // Recalcula vencimento se a data mudar
        dataVencimento = calculoVencimentoReceita(updateData.dataReceita);
        fields.push("data_vencimento = ?");
        params.push(dataVencimento);
    }

    if (fields.length === 0) {
        return res.status(400).json({ error: "Nenhum dado válido fornecido para atualização." });
    }

    params.push(id); // ID para a cláusula WHERE

    const sql = `UPDATE Receita SET ${fields.join(', ')} WHERE idReceita = ?`;

    try {
        const result = await db.run(sql, params);

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
        const receitas = await db.all(sql);
        res.json(receitas);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};

exports.buscarReceita = async (req, res) => {
    const id = req.params.id;
    
    try {
        // 1. Busca dados do cabeçalho da Receita
        const receita = await db.get("SELECT * FROM Receita WHERE idReceita = ?", [id]);
        if (!receita) {
            return res.status(404).json({ erro: "Receita não encontrada." });
        }

        // 2. Busca os itens (Prescricoes) relacionados (JOIN com Medicamento para o nome/dosagem)
        const itens = await db.all(`
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
            alertaVencimento: !!receita.alerta_vencimento, // Garante Boolean
            notificacaoMed: !!receita.notificacao_med,   // Garante Boolean
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
        await db.run("BEGIN TRANSACTION;");
        
        // 1. Deleta itens relacionados na Prescricao
        await db.run("DELETE FROM Prescricao WHERE Receita_idReceita = ?", [id]);
        
        // 2. Deleta a Receita
        const result = await db.run("DELETE FROM Receita WHERE idReceita = ?", [id]);

        await db.run("COMMIT;");
        
        if (result.changes === 0) {
            return res.status(404).json({ erro: "Receita não encontrada" });
        }
        res.json({ mensagem: "Receita e suas prescrições deletadas com sucesso" });

    } catch (err) {
        await db.run("ROLLBACK;").catch(rollbackErr => console.error("Erro no ROLLBACK:", rollbackErr.message));
        res.status(500).json({ erro: err.message });
    }
};
