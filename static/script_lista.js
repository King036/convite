
const KEY = 'bday_guests_v2';
const COLORS = ['#ff6b9d', '#ffd93d', '#6bcb77', '#4d96ff', '#c77dff', '#ff9a3c', '#ff6b6b', '#74c0fc'];
let guests = [];
let activeFilter = 'todos';

// Floating dots
const bg = document.getElementById('confetti-bg');
for (let i = 0; i < 22; i++) {
    const d = document.createElement('div');
    d.className = 'dot';
    const size = 8 + Math.random() * 18;
    const isCircle = Math.random() > 0.5;
    d.style.cssText = `
      width:${size}px; height:${size}px;
      left:${Math.random() * 100}%;
      background:${COLORS[Math.floor(Math.random() * COLORS.length)]};
      animation-duration:${6 + Math.random() * 10}s;
      animation-delay:${-Math.random() * 12}s;
      border-radius:${isCircle ? '50%' : '4px'};
    `;
    bg.appendChild(d);
}

function load() {
    try { guests = JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { guests = []; }
}
function save() { localStorage.setItem(KEY, JSON.stringify(guests)); }

function getInitial(name) { return name.charAt(0).toUpperCase(); }
function getColor(name) { return COLORS[name.charCodeAt(0) % COLORS.length]; }

function bump(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.remove('bump');
    void el.offsetWidth;
    el.classList.add('bump');
    setTimeout(() => el.classList.remove('bump'), 400);
}

function spawnBurst(aceitou) {
    const emojis = aceitou ? ['🎉', '✨', '🥳', '🎊', '⭐', '🌟'] : ['😢', '💔'];
    for (let i = 0; i < 3; i++) {
        setTimeout(() => {
            const e = document.createElement('div');
            e.className = 'burst';
            e.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            e.style.left = (20 + Math.random() * 60) + '%';
            e.style.top = '50%';
            document.body.appendChild(e);
            setTimeout(() => e.remove(), 800);
        }, i * 120);
    }
}

function add(aceitou) {
    const inp = document.getElementById('inp');
    const nome = inp.value.trim();
    if (!nome) {
        inp.focus();
        inp.style.borderColor = 'var(--pink)';
        setTimeout(() => inp.style.borderColor = '', 800);
        return;
    }
    guests.unshift({ id: Date.now(), nome, aceitou });
    save();
    inp.value = '';
    spawnBurst(aceitou);
    render();
    bump(aceitou ? 'cnt-sim' : 'cnt-nao');
    bump('cnt-total');
}

function remove(id) {
    guests = guests.filter(g => g.id !== id);
    save();
    render();
}

function setFilter(el) {
    document.querySelectorAll('.filt').forEach(b => b.classList.remove('active'));
    el.classList.add('active');
    activeFilter = el.dataset.f;
    render();
}

function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

function render() {
    document.getElementById('cnt-sim').textContent = guests.filter(g => g.aceitou).length;
    document.getElementById('cnt-nao').textContent = guests.filter(g => !g.aceitou).length;
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
    } else {
        empty.style.display = 'none';
        list.innerHTML = filtered.map(g => `
        <div class="guest-row">
          <div class="avatar" style="background:${getColor(g.nome)}">${esc(getInitial(g.nome))}</div>
          <span class="guest-name">${esc(g.nome)}</span>
          <span class="badge ${g.aceitou ? 'badge-sim' : 'badge-nao'}">${g.aceitou ? '✅ Aceitou' : '❌ Recusou'}</span>
          <button class="btn-del" onclick="remove(${g.id})" title="Remover">×</button>
        </div>
      `).join('');
    }
}

document.getElementById('inp').addEventListener('keydown', e => {
    if (e.key === 'Enter') add(true);
});

load();
render();
//_____________________________________________________________________________  
//API
//motrar dados


fetch('https://convite-lmdr.onrender.com/usuarios')
    .then(res => res.json())
    .then(data => {
        const lista = document.getElementById('list');

        lista.innerHTML = ''; // limpa antes

        data.forEach(g => {
            const row = document.createElement('div');
            row.className = 'guest-row';

            row.innerHTML = `
    <div class="avatar" style="background:${getColor(g.nome)}">
      ${getInitial(g.nome)}
    </div>

    <span class="guest-name">${esc(g.nome)}</span>

    <span class="badge ${g.aceitou ? 'badge-sim' : 'badge-nao'}">
      ${g.aceitou ? '✅ Aceitou' : '❌ Recusou'}
    </span>
  `;

            lista.appendChild(row);
        });
    });