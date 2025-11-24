const db = require("../db/database");
// Importa o JSON com 70k medicamentos
const catalogo = require("../data/catalogoMedicamentos"); 

// 🔹 NOVA FUNÇÃO: Busca Inteligente (Começa com > Contém)
exports.buscarNoCatalogo = (req, res) => {
  const termoOriginal = req.query.nome;

  // Só busca se tiver pelo menos 3 letras para não travar
  if (!termoOriginal || termoOriginal.length < 3) {
    return res.json([]); 
  }

  const termo = termoOriginal.toLowerCase();

  try {
    const comecamCom = [];
    const contem = [];

    // Percorre o catálogo uma única vez para categorizar
    for (const med of catalogo) {
      // Segurança: pula se não tiver nome
      if (!med.NOME_MEDICAMENTO) continue;

      const nome = med.NOME_MEDICAMENTO.toLowerCase();

      if (nome.startsWith(termo)) {
        comecamCom.push(med);
      } else if (nome.includes(termo)) {
        contem.push(med);
      }
    }

    // Junta as listas: Primeiro os que começam, depois o resto
    // Limitamos a 20 resultados no total para manter o frontend rápido
    const resultadosCombinados = [...comecamCom, ...contem].slice(0, 20);

    // Mapeia para o formato padrão do frontend
    const formatado = resultadosCombinados.map(item => ({
      id: item.id,
      nomeMedicamento: item.NOME_MEDICAMENTO
    }));

    res.json(formatado);

  } catch (error) {
    console.error("Erro ao buscar no catálogo:", error);
    res.status(500).json({ erro: "Erro ao processar busca no catálogo." });
  }
};

// --- FUNÇÕES EXISTENTES MANTIDAS (NÃO ALTERADAS) ---

exports.listarMedicamentos = (req, res) => {
  const idUsuario = req.userId;
  db.all("SELECT * FROM Medicamento WHERE idPaciente = ?", [idUsuario], (err, rows) => {
    if (err) res.status(500).json({ erro: err.message });
    else res.status(200).json(rows);
  });
};

exports.getMedicamentoById = (req, res) => {
  const idUsuario = req.userId;
  db.get("SELECT * FROM Medicamento WHERE idMedicamento = ? AND idPaciente = ?", 
    [req.params.id, idUsuario], 
    (err, row) => {
      if (err) res.status(500).json({ erro: err.message });
      else if (!row) res.status(404).json({ erro: "Medicamento não encontrado" });
      else res.json(row);
    }
  );
};

exports.criarMedicamento = (req, res) => {
  const idUsuario = req.userId;
  const { nome, dosagem } = req.body;

  db.run(
    "INSERT INTO Medicamento (nome, dosagem, idPaciente) VALUES (?, ?, ?)",
    [nome, dosagem, idUsuario],
    function (err) {
      if (err) res.status(500).json({ erro: err.message });
      else res.status(201).json({ id: this.lastID, nome, dosagem });
    }
  );
};

exports.editarMedicamento = (req, res) => {
  const idUsuario = req.userId;
  const { nome, dosagem, id } = req.body;
  
  db.run(
    "UPDATE Medicamento SET nome = ?, dosagem = ? WHERE idMedicamento = ? AND idPaciente = ?",
    [nome, dosagem, id, idUsuario],
    function (err) {
      if (err) res.status(500).json({ erro: err.message });
      else res.status(201).json({ mensagem: "Atualizado com sucesso" });
    }
  );
};