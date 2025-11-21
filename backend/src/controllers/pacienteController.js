const db = require("../db/database");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const SECRET_KEY = "chave_super_secreta_do_medsync";

// 🔹 Listar todos os pacientes
exports.listarPacientes = (req, res) => {
  db.all("SELECT idPaciente, nome, email, telefone FROM Paciente", [], (err, rows) => {
    if (err) {
      res.status(500).json({ erro: err.message });
    } else {
      res.json(rows);
    }
  });
};

// 🔹 Criar Paciente (Cadastro)
exports.criarPaciente = (req, res) => {
  const { nome, senha, email, telefone } = req.body;

  if (!nome || !senha || !email || !telefone) {
    return res.status(400).json({ erro: "Todos os campos são obrigatórios." });
  }

  // Verifica se email já existe
  db.get("SELECT * FROM Paciente WHERE email = ?", [email], (err, row) => {
    if (err) return res.status(500).json({ erro: "Erro no servidor ao verificar email." });
    if (row) return res.status(400).json({ erro: "Email já cadastrado." });

    // Criptografa a senha
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(senha, salt);

    // Salva no banco
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

// 🔹 Login
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

// 🔹 Buscar por ID (Protegido)
exports.buscarPaciente = (req, res) => {
  const idSolicitado = req.params.id;
  const idUsuarioLogado = req.userId; // Vem do token (authMiddleware)

  // Segurança: Só deixa buscar se for o próprio usuário
  if (parseInt(idSolicitado) !== idUsuarioLogado) {
      return res.status(403).json({ erro: "Acesso não autorizado aos dados deste paciente." });
  }

  db.get("SELECT idPaciente, nome, email, telefone FROM Paciente WHERE idPaciente = ?", [idSolicitado], (err, row) => {
    if (err) res.status(500).json({ erro: err.message });
    else if (!row) res.status(404).json({ erro: "Paciente não encontrado." });
    else res.json(row);
  });
};

// 🔹 Deletar Paciente (Protegido)
exports.deletarPaciente = (req, res) => {
  const idSolicitado = req.params.id;
  const idUsuarioLogado = req.userId;

  // Segurança: Só deixa deletar a própria conta
  if (parseInt(idSolicitado) !== idUsuarioLogado) {
      return res.status(403).json({ erro: "Você só pode deletar sua própria conta." });
  }

  db.run("DELETE FROM Paciente WHERE idPaciente = ?", [idSolicitado], function (err) {
    if (err) res.status(500).json({ erro: err.message });
    else if (this.changes === 0)
      res.status(404).json({ erro: "Paciente não encontrado." });
    else res.json({ mensagem: "Paciente removido com sucesso." });
  });
};

// 🔹 Recuperação de Senha (USANDO ETHEREAL - Visualização Fácil)
exports.recuperarSenha = async (req, res) => {
  const { email } = req.body;

  // 1. Verifica se o usuário existe
  db.get("SELECT * FROM Paciente WHERE email = ?", [email], async (err, paciente) => {
    if (err) return res.status(500).json({ erro: "Erro no servidor." });
    
    if (!paciente) {
      return res.status(404).json({ erro: "E-mail não encontrado no sistema." });
    }

    // 2. Gera uma nova senha aleatória (8 caracteres)
    const novaSenhaTemporaria = Math.random().toString(36).slice(-8);

    // 3. Criptografa a nova senha
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(novaSenhaTemporaria, salt);

    // 4. Atualiza no Banco de Dados
    db.run(
      "UPDATE Paciente SET senha = ? WHERE idPaciente = ?",
      [hash, paciente.idPaciente],
      async function(err) {
        if (err) {
            return res.status(500).json({ erro: "Erro ao atualizar senha no banco." });
        }

        try {
            // 5. Cria conta de teste no Ethereal
            let testAccount = await nodemailer.createTestAccount();

            const transporter = nodemailer.createTransport({
              host: "smtp.ethereal.email",
              port: 587,
              secure: false, 
              auth: {
                user: testAccount.user,
                pass: testAccount.pass, 
              },
            });

            const mailOptions = {
              from: '"MedSync Seguro" <noreply@medsync.com>',
              to: email, 
              subject: 'Sua Nova Senha Provisória',
              html: `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2 style="color: #007bff;">Olá, ${paciente.nome}!</h2>
                    <p>Esta é uma simulação de envio de e-mail segura.</p>
                    <hr />
                    <p>Sua <b>NOVA SENHA TEMPORÁRIA</b> é:</p>
                    <h1 style="background-color: #eee; padding: 10px; display: inline-block;">
                        ${novaSenhaTemporaria}
                    </h1>
                    <hr />
                    <p>Use esta senha para logar no sistema.</p>
                </div>
              `
            };

            // 6. Envia e pega o link
            let info = await transporter.sendMail(mailOptions);
            const previewUrl = nodemailer.getTestMessageUrl(info);
            
            console.log("✅ E-mail fake enviado!");
            console.log("📨 URL:", previewUrl);

            // Retornamos o link para o frontend mostrar ao usuário
            return res.status(200).json({ 
                mensagem: "Nova senha gerada!",
                previewUrl: previewUrl
            });

        } catch (error) {
            console.log("Erro ao enviar e-mail:", error);
            return res.status(500).json({ erro: "Erro ao processar envio de e-mail." });
        }
      }
    );
  });
};