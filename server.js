const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const db = new sqlite3.Database("database.db");

db.run(`
    CREATE TABLE IF NOT EXISTS usuarios(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT,
        email TEXT UNIQUE,
        senha TEXT
    )
`);

app.post("/usuarios", (req, res) => {
    const {nome, email, senha} = req.body;

    db.run(
        "INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)",
        [nome, email, senha],
        function(err) {
            if (err) return res.status(400).json(err);
            res.json({id: this.lastID});
        }
    );
});

app.get("/usuarios", (req, res) => {
    db.all("SELECT * FROM usuarios", [], (err, rows) => {
        if(err) return res.status(500).json(err);
        res.json(rows);
    });
});

app.put("/usuarios/:id", (req,res) => {
    const {nome, email} = req.body;
    const {id} = req.params;

    db.run(
        "UPDATE usuarios SET nome = ?, email = ? WHERE id = ?",
        [nome, email, id],
        function(err) {
            if(err) {
                console.log("ERRO SQL COMPLETO:", err);
                return res.status(500).json(err);
            }

            res.json({ atualizado: this.changes });
        }
    );
});

app.delete("/usuarios/:id", (req, res) => {
    const {id} = req.params;

    db.run("DELETE FROM usuarios WHERE id = ?", id, function(err) {
        if(err) return res.status(400).json(err);
        res.json({ deletado: this.changes });
    });
});

app.post("/login", (req, res) => {
    const {email, senha} = req.body;

    db.get(
        "SELECT * FROM usuarios WHERE email = ? AND senha = ?",
        [email, senha],
        (err, user) => {
            if(err) return res.status(500).json(err);

            if(!user) {
                return res.status(401).json({ erro: "Usuário não encontrado"});
            }

            res.json({ mensagem: "Login sucesso", user});
        }
    );
});

app.listen(3000, () => {
    console.log("Servidor rodando em http://localhost:3000");
});