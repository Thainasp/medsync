const db = require("../db/database"); 
const bcrypt = require("bcryptjs"); 
const jwt = require("jsonwebtoken"); 

const SECRET_KEY = "chave_super_secreta_do_medsync"; 

// 🔹 Controlador para listar todos os pacientes
exports.listarPacientes = (req, res) => {
  db.all("SELECT idPaciente, nome, email, telefone FROM Paciente", [], (err, rows) => {
    if (err) {
      res.status(500).json({ erro: err.message });
    } else {
      res.json(rows);
    }
  });
};

// 🔹 Controlador para adicionar um paciente (CADASTRO)
exports.criarPaciente = (req, res) => {
  const { nome, senha, email, telefone } = req.body;

  if (!nome || !senha || !email || !telefone) {
    return res.status(400).json({ erro: "Todos os campos são obrigatórios." });
  }

  // 1. Verifica se o email já existe
  db.get("SELECT * FROM Paciente WHERE email = ?", [email], (err, row) => {
    if (err) return res.status(500).json({ erro: "Erro no servidor ao verificar email." });
    if (row) return res.status(400).json({ erro: "Email já cadastrado." });

    // 2. Criptografa a senha
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(senha, salt);

    // 3. Salva no banco
    db.run(
      "INSERT INTO Paciente (nome, senha, email, telefone) VALUES (?, ?, ?, ?)",
      [nome, hash, email, telefone],
      function (err) {
        if (err) {
          res.status(500).json({ erro: err.message });
        } else {
          res.status(201).json({
            id: this.lastID,
            nome,
            email,
            telefone,
            message: "Usuário criado com sucesso!"
          });
        }
      }
    );
  });
};

// 🔹 Controlador para LOGIN
exports.login = (req, res) => {
  const { email, senha } = req.body;

  db.get("SELECT * FROM Paciente WHERE email = ?", [email], (err, paciente) => {
    if (err) return res.status(500).json({ erro: "Erro interno." });
    
    if (!paciente) {
        return res.status(404).json({ erro: "Usuário não encontrado." });
    }

    const senhaValida = bcrypt.compareSync(senha, paciente.senha);
    
    if (!senhaValida) {
        return res.status(401).json({ erro: "Senha incorreta." });
    }

    const token = jwt.sign(
        { id: paciente.idPaciente, email: paciente.email }, 
        SECRET_KEY, 
        { expiresIn: '1h' }
    );

    res.status(200).json({
        auth: true,
        token: token,
        nome: paciente.nome,
        id: paciente.idPaciente
    });
  });
};

// 🔹 Buscar por ID
exports.buscarPaciente = (req, res) => {
  const { id } = req.params;
  db.get("SELECT idPaciente, nome, email, telefone FROM Paciente WHERE idPaciente = ?", [id], (err, row) => {
    if (err) res.status(500).json({ erro: err.message });
    else if (!row) res.status(404).json({ erro: "Paciente não encontrado." });
    else res.json(row);
  });
};

// 🔹 Deletar Paciente
exports.deletarPaciente = (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM Paciente WHERE idPaciente = ?", [id], function (err) {
    if (err) res.status(500).json({ erro: err.message });
    else if (this.changes === 0)
      res.status(404).json({ erro: "Paciente não encontrado." });
    else res.json({ mensagem: "Paciente removido com sucesso." });
  });
};