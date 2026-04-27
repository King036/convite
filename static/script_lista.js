const API_URL = 'https://convite-lmdr.onrender.com/usuarios';

const COLORS = ['#ff6b9d','#ffd93d','#6bcb77','#4d96ff','#c77dff','#ff9a3c','#ff6b6b','#74c0fc'];

let guests = [];
let activeFilter = 'todos';

function getInitial(name) {
  return name.charAt(0).toUpperCase();
}

function getColor(name) {
  return COLORS[name.charCodeAt(0) % COLORS.length];
}

function esc(s) {
  return String(s)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;');
}

// 🔄 CARREGAR DA API
function loadGuests() {
  fetch(API_URL)
    .then(res => res.json())
    .then(data => {
      guests = data.map(item => ({
        id: item.id,
        nome: item.nome,
        aceitou: item.aceitou === true || item.aceitou === 'sim'
      }));

      render();
    })
    .catch(err => console.error('Erro ao carregar:', err));
}

// ➕ ADICIONAR (SALVA NA API)
function add(aceitou) {
  const inp = document.getElementById('inp');
  const nome = inp.value.trim();

  if (!nome) {
    inp.focus();
    return;
  }

  fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ nome, aceitou })
  })
  .then(() => {
    inp.value = '';
    loadGuests(); // recarrega lista
  })
  .catch(err => console.error('Erro ao adicionar:', err));
}

// ❌ REMOVER (API)
function removeGuest(id) {
  fetch(`${API_URL}/${id}`, {
    method: 'DELETE'
  })
  .then(() => loadGuests())
  .catch(err => console.error('Erro ao deletar:', err));
}

// 🎯 FILTRO
function setFilter(el) {
  document.querySelectorAll('.filt').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  activeFilter = el.dataset.f;
  render();
}

// 🎨 RENDERIZAÇÃO (AGORA TUDO FUNCIONA)
function render() {
  const sim = guests.filter(g => g.aceitou).length;
  const nao = guests.filter(g => !g.aceitou).length;

  document.getElementById('cnt-sim').textContent = sim;
  document.getElementById('cnt-nao').textContent = nao;
  document.getElementById('cnt-total').textContent = guests.length;

  const filtered = guests.filter(g => {
    if (activeFilter === 'sim') return g.aceitou;
    if (activeFilter === 'nao') return !g.aceitou;
    return true;
  });

  const list = document.getElementById('list');
  const empty = document.getElementById('empty');

  if (filtered.length === 0) {
    list.innerHTML = '';
    empty.style.display = 'block';
    return;
  }

  empty.style.display = 'none';

  list.innerHTML = filtered.map(g => `
    <div class="guest-row">
      <div class="avatar" style="background:${getColor(g.nome)}">
        ${esc(getInitial(g.nome))}
      </div>

      <span class="guest-name">${esc(g.nome)}</span>

      <span class="badge ${g.aceitou ? 'badge-sim' : 'badge-nao'}">
        ${g.aceitou ? '✅ Aceitou' : '❌ Recusou'}
      </span>

      <button class="btn-del" onclick="removeGuest(${g.id})">×</button>
    </div>
  `).join('');
}

// ⌨️ ENTER adiciona como "aceitou"
document.getElementById('inp').addEventListener('keydown', e => {
  if (e.key === 'Enter') add(true);
});

// 🚀 INICIAR
loadGuests();