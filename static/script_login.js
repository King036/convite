// ============================================================
//  ⚙️ CONFIGURAÇÃO
// ============================================================
const API_URL = 'https://convite-lmdr.onrender.com/salvarLogin'; // URL da sua API

// ============================================================
//  LOGIN
// ============================================================
async function doLogin() {
  const u   = document.getElementById('loginUser').value.trim();
  const p   = document.getElementById('loginPass').value;
  const err = document.getElementById('loginErr');

  err.textContent = '';

  if (!u || !p) {
    err.textContent = 'Preencha usuário e senha.';
    return;
  }

  try {
    const res = await fetch(`${API_URL}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: u, pass: p })
    });

    if (res.ok) {
      // salva sessão simples
      sessionStorage.setItem('logado', 'true');

      // redireciona
      window.location.href = '/convidados';
    } else {
      err.textContent = 'Usuário ou senha incorretos.';
    }

  } catch (e) {
    err.textContent = 'Erro ao conectar com o servidor.';
  }
}

// ============================================================
//  LOGOUT
// ============================================================
function doLogout() {
  sessionStorage.removeItem('logado');
  window.location.href = 'login.html';
}

// ============================================================
//  PROTEÇÃO DE PÁGINA
//  (coloque isso no main.html)
// ============================================================
function checkAuth() {
  if (sessionStorage.getItem('logado') !== 'true') {
    window.location.href = 'login.html';
  }
}

// ============================================================
//  EVENTOS (ENTER)
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  const userInput = document.getElementById('loginUser');
  const passInput = document.getElementById('loginPass');

  if (userInput) {
    userInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        document.getElementById('loginPass').focus();
      }
    });
  }

  if (passInput) {
    passInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        doLogin();
      }
    });
  }
});