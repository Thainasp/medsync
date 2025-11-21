const db = require("../db/database"); 
const bcrypt = require("bcryptjs"); 
const jwt = require("jsonwebtoken"); 

const SECRET_KEY = "chave_super_secreta_do_medsync"; 

// Listar todos (Geralmente admin, mas mantive a lógica filtrando nada por enquanto, 
// ou você pode remover essa rota se não for usar)
exports.listarPacientes = (req, res) => {
  db.all("SELECT idPaciente, nome, email, telefone FROM Paciente", [], (err, rows) => {
    if (err) {
      res.status(500).json({ erro: err.message });
    } else {
      res.json(rows);
    }
  });
};

exports.criarPaciente = (req, res) => {
  const { nome, senha, email, telefone } = req.body;

  if (!nome || !senha || !email || !telefone) {
    return res.status(400).json({ erro: "Todos os campos são obrigatórios." });
  }

  db.get("SELECT * FROM Paciente WHERE email = ?", [email], (err, row) => {
    if (err) return res.status(500).json({ erro: "Erro no servidor ao verificar email." });
    if (row) return res.status(400).json({ erro: "Email já cadastrado." });

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(senha, salt);

    db.run(
      "INSERT INTO Paciente (nome, senha, email, telefone) VALUES (?, ?, ?, ?)",
      [nome, hash, email, telefone],
      function (err) {
        if (err) res.status(500).json({ erro: err.message });
        else res.status(201).json({
            id: this.lastID, nome, email, telefone, message: "Usuário criado com sucesso!"
        });
      }
    );
  });
};

exports.login = (req, res) => {
  const { email, senha } = req.body;

  db.get("SELECT * FROM Paciente WHERE email = ?", [email], (err, paciente) => {
    if (err) return res.status(500).json({ erro: "Erro interno." });
    if (!paciente) return res.status(404).json({ erro: "Usuário não encontrado." });

    const senhaValida = bcrypt.compareSync(senha, paciente.senha);
    if (!senhaValida) return res.status(401).json({ erro: "Senha incorreta." });

    const token = jwt.sign(
        { id: paciente.idPaciente, email: paciente.email }, 
        SECRET_KEY, 
        { expiresIn: '1h' }
    );

    res.status(200).json({ auth: true, token: token, nome: paciente.nome, id: paciente.idPaciente });
  });
};

// Modificado: Só permite buscar o PRÓPRIO perfil
exports.buscarPaciente = (req, res) => {
  const idSolicitado = req.params.id;
  const idUsuarioLogado = req.userId; // Vem do token

  // Verifica se o usuário está tentando ver dados de outro
  if (parseInt(idSolicitado) !== idUsuarioLogado) {
      return res.status(403).json({ erro: "Acesso não autorizado aos dados deste paciente." });
  }

  db.get("SELECT idPaciente, nome, email, telefone FROM Paciente WHERE idPaciente = ?", [idSolicitado], (err, row) => {
    if (err) res.status(500).json({ erro: err.message });
    else if (!row) res.status(404).json({ erro: "Paciente não encontrado." });
    else res.json(row);
  });
};

// Modificado: Só permite deletar a PRÓPRIA conta
exports.deletarPaciente = (req, res) => {
  const idSolicitado = req.params.id;
  const idUsuarioLogado = req.userId;

  if (parseInt(idSolicitado) !== idUsuarioLogado) {
      return res.status(403).json({ erro: "Você só pode deletar sua própria conta." });
  }

  db.run("DELETE FROM Paciente WHERE idPaciente = ?", [idSolicitado], function (err) {
    if (err) res.status(500).json({ erro: err.message });
    else if (this.changes === 0) res.status(404).json({ erro: "Paciente não encontrado." });
    else res.json({ mensagem: "Paciente removido com sucesso." });
  });
};