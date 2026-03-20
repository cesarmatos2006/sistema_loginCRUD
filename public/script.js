const API = "http://localhost:3000";

/*=====================
    LOGIN
=====================*/
const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("email").value;
        const senha = document.getElementById("senha").value;

        const res = await fetch(`${API}/login`, {
            method: "POST",
            headers: { "Content-Type":"application/json" },
            body: JSON.stringify({email,senha})
        });

        const data = await res.json();

        if (res.ok) {
            alert("Login realizado!");
            window.location.href = "dashboard.html";
        } else {
            alert(data.erro);
        }
    });
}
/*=================
    CADASTRO
=================*/
const cadastroForm = document.getElementById("cadastroForm");

if (cadastroForm) {
    cadastroForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const nome = document.getElementById("nome").value;
        const email = document.getElementById("email").value;
        const senha = document.getElementById("senha").value;

        const res = await fetch(`${API}/usuarios`, {
            method: "POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify({nome, email, senha})
        });

        if (res.ok) {
            alert("Usuário Cadastrado!");
            window.location.href = "index.html";
        } else {
            alert("Erro ao cadastrar");
        }
    });
}

/*===================
    DASHBOARD
===================*/
const tabela = document.getElementById("tabelaUsuario");

if (tabela) {
    carregarUsuarios();
}

async function carregarUsuarios() {
    const res = await fetch(`${API}/usuarios`);
    const usuarios = await res.json();

    tabela.innerHTML = "";

    usuarios.forEach((u) => {
        tabela.innerHTML += `
        <tr>
            <td>${u.id}</td>
            <td>${u.nome}</td>
            <td>${u.email}</td>
            <td>
                <div class="acoes">
                    <button class="btn-editar" onclick="editarUsuario(${u.id})">Editar</button>
                    <button class="btn-excluir" onclick="deletarUsuario(${u.id})">Excluir</button>
                </div>
            </td>
        </tr>
        `;
    });
}

/*===============
    DELETAR
===============*/
async function deletarUsuario(id) {
    if(!confirm("Tem certeza?")) return;

    await fetch(`${API}/usuarios/${id}`, {
        method: "DELETE"
    });

    carregarUsuarios();
}

/*==============================
    IR PARA CADASTRO
==============================*/
function irParaCadastro() {
    window.location.href = "cadastro.html";
}

/*========================
    EDITAR (SALVAR ID)
========================*/
function editarUsuario(id) {
    localStorage.setItem("usuarioID", id);
    window.location.href = "editar.html";
}

/*============================
    EDITAR (CARREGAR DADOS)
============================*/
const editarForm = document.getElementById("editarForm");

if (editarForm) {
    carregarDadosUsuario();

    editarForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const id = localStorage.getItem("usuarioID");
        const nome = document.getElementById("nome").value;
        const email = document.getElementById("email").value;

        const res = await fetch(`${API}/usuarios/${id}`, {
            method: "PUT",
            headers: { "Content-Type":"application/json" },
            body: JSON.stringify({nome, email})
        });

        if(res.ok) {
            alert("Atualizado com sucesso!");
            window.location.href = "dashboard.html";
        } else {
            alert("Erro ao editar");
        }
    });
}

async function carregarDadosUsuario() {
    const id = localStorage.getItem("usuarioID");

    const res = await fetch(`${API}/usuarios`);
    const usuarios = await res.json();

    const usuario = usuarios.find(u => u.id == id);

    if (usuario) {
        document.getElementById("nome").value = usuario.nome;
        document.getElementById("email").value = usuario.email;
    }
}

/*===================
    CANCELAR
===================*/
function voltar() {
    window.location.href = "dashboard.html";
}