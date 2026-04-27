const API_URL = 'https://convite-lmdr.onrender.com/usuarios';

let guests = [];
let activeFilter = 'todos';
let searchText = '';

// ================== CARREGAR API ==================
async function loadGuests() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();

    guests = data.map(g => ({
      id: g.id,
      nome: g.nome,
      presenca: g.presenca === true || g.presenca === "sim"
    }));

    render();
  } catch (err) {
    console.error('Erro API:', err);
  }
}

// ================== ADICIONAR ==================
async function add(aceitou) {
  const inp = document.getElementById('inp');
  const nome = inp.value.trim();

  if (!nome) return;

  await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome, presenca })
  });

  inp.value = '';
  loadGuests();
}

// ================== REMOVER ==================
async function removeGuest(id) {
  await fetch(`${API_URL}/${id}`, {
    method: 'DELETE'
  });

  loadGuests();
}

// ================== FILTRO ==================
function setFilter(el) {
  document.querySelectorAll('.filt').forEach(b => b.classList.remove('active'));
  el.classList.add('active');

  activeFilter = el.dataset.f;
  render();
}

// ================== BUSCA ==================
function setupSearch() {
  const search = document.getElementById('search');

  if (!search) return;

  search.addEventListener('input', e => {
    searchText = e.target.value.toLowerCase();
    render();
  });
}

// ================== RENDER ==================
function render() {
  const list = document.getElementById('list');

  const filtered = guests.filter(g => {
    const nome = (g.nome || '').toLowerCase();

    const matchText = nome.includes(searchText);

    const matchFilter =
      activeFilter === 'todos' ||
      (activeFilter === 'sim' && g.presenca) ||
      (activeFilter === 'nao' && !g.presenca);

    return matchText && matchFilter;
  });

  // CONTADORES
  document.getElementById('cnt-sim').textContent =
    guests.filter(g => g.presenca).length;

  document.getElementById('cnt-nao').textContent =
    guests.filter(g => !g.presenca).length;

  document.getElementById('cnt-total').textContent =
    guests.length;

  // LISTA
  if (!list) return;

  list.innerHTML = filtered.map(g => `
    <div class="guest-row">
      <div class="avatar">${g.nome.charAt(0).toUpperCase()}</div>

      <span class="guest-name">${g.nome}</span>

      <span class="badge ${g.aceitou ? 'badge-sim' : 'badge-nao'}">
        ${g.presenca ? '✅ Aceitou' : '❌ Recusou'}
      </span>

      
    </div>
  `).join('');
}

// ================== INIT ==================
document.addEventListener('DOMContentLoaded', () => {
  setupSearch();

  document.getElementById('inp').addEventListener('keydown', e => {
    if (e.key === 'Enter') add(true);
  });

  loadGuests();
});