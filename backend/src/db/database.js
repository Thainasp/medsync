const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("src/db/mydb.db", (err) => {
  if (err) {
    console.error("Erro ao conectar no banco:", err.message);
  } else {
    console.log("Banco de dados conectado com sucesso!");
  }
});

db.run("PRAGMA foreign_keys = ON;");

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS Paciente (
      idPaciente INTEGER PRIMARY KEY,
      nome TEXT NOT NULL,
      senha TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      telefone TEXT NOT NULL
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS Receita (
      idReceita INTEGER PRIMARY KEY,
      nomeReceita TEXT NOT NULL,
      data_emissao DATE NOT NULL,
      Paciente_idPaciente INTEGER NOT NULL,
      observacoes TEXT,
      FOREIGN KEY (Paciente_idPaciente)
        REFERENCES Paciente (idPaciente)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS Medicamento (
      idMedicamento INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      dosagem REAL NOT NULL
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS Prescricao (
      idPrescricao INTEGER PRIMARY KEY,
      frequencia INTEGER NOT NULL,
      quantidade INTEGER NOT NULL,
      observacoes TEXT,
      Medicamento_idMedicamento INTEGER NOT NULL,
      Receita_idReceita INTEGER NOT NULL,
      FOREIGN KEY (Medicamento_idMedicamento)
        REFERENCES Medicamento (idMedicamento)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION,
      FOREIGN KEY (Receita_idReceita)
        REFERENCES Receita (idReceita)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS Tratamento (
      idTratamento INTEGER PRIMARY KEY,
      data_inicio DATE NOT NULL,
      periodo INTEGER NOT NULL,
      consumido INTEGER
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS Estoque (
      idEstoque INTEGER PRIMARY KEY,
      data_compra DATE NOT NULL,
      quantidade INTEGER NOT NULL,
      Medicamento_idMedicamento INTEGER NOT NULL,
      FOREIGN KEY (Medicamento_idMedicamento)
        REFERENCES Medicamento (idMedicamento)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS Tratamento_has_Prescricao (
      Tratamento_idTratamento INTEGER NOT NULL,
      Prescricao_idPrescricao INTEGER NOT NULL,
      horario TIME,
      PRIMARY KEY (Tratamento_idTratamento, Prescricao_idPrescricao),
      FOREIGN KEY (Tratamento_idTratamento)
        REFERENCES Tratamento (idTratamento)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION,
      FOREIGN KEY (Prescricao_idPrescricao)
        REFERENCES Prescricao (idPrescricao)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION
    );
  `);

  console.log("✅ Todas as tabelas foram criadas (ou já existiam).");
});

module.exports = db;
