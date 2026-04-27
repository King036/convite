const API_URL = 'https://convite-lmdr.onrender.com/usuarios';

const COLORS = ['#ff6b9d','#ffd93d','#6bcb77','#4d96ff','#c77dff','#ff9a3c','#ff6b6b','#74c0fc'];

let guests = [];
let activeFilter = 'todos';
let searchText = '';

// ================= UTIL =================
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

// ================= API =================
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

function add(aceitou) {
  const inp = document.getElementById('inp');
  const nome = inp.value.trim();

  if (!nome) return;

  fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome, aceitou })
  })
  .then(() => {
    inp.value = '';
    loadGuests();
  });
}

function removeGuest(id) {
  fetch(`${API_URL}/${id}`, { method: 'DELETE' })
    .then(() => loadGuests());
}

// ================= FILTROS =================
function setFilter(el) {
  document.querySelectorAll('.filt').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  activeFilter = el.dataset.f;
  render();
}

document.getElementById('search').addEventListener('input', e => {
  searchText = e.target.value.toLowerCase();
  render();
});

// ================= RENDER =================
function render() {
  const sim = guests.filter(g => g.aceitou).length;
  const nao = guests.filter(g => !g.aceitou).length;

  document.getElementById('cnt-sim').textContent = sim;
  document.getElementById('cnt-nao').textContent = nao;
  document.getElementById('cnt-total').textContent = guests.length;

  const filtered = guests.filter(g => {
    const matchStatus =
      activeFilter === 'todos' ||
      (activeFilter === 'sim' && g.aceitou) ||
      (activeFilter === 'nao' && !g.aceitou);

    const matchText = g.nome.toLowerCase().includes(searchText);

    return matchStatus && matchText;
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

// ================= EVENTOS =================
document.getElementById('search').addEventListener('keydown', e => {
  if (e.key === 'Enter') add(true);
});

// ================= START =================
loadGuests();