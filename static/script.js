// ========================================
// COUNTDOWN
// ========================================

function updateCountdown() {

  const target = new Date('2026-05-24T15:00:00');
  const now = new Date();

  const diff = target - now;

  if (diff <= 0) {

    document.getElementById('c-dias').textContent = '0';
    document.getElementById('c-horas').textContent = '0';
    document.getElementById('c-min').textContent = '0';
    document.getElementById('c-seg').textContent = '0';

    return;
  }

  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);

  document.getElementById('c-dias').textContent = String(d).padStart(2,'0');
  document.getElementById('c-horas').textContent = String(h).padStart(2,'0');
  document.getElementById('c-min').textContent = String(m).padStart(2,'0');
  document.getElementById('c-seg').textContent = String(s).padStart(2,'0');
}

setInterval(updateCountdown, 1000);
updateCountdown();


// ========================================
// SHAKE
// ========================================

function triggerShake(el) {

  el.classList.remove('shake');

  void el.offsetWidth;

  el.classList.add('shake');

  setTimeout(() => {

    el.classList.remove('shake');

  }, 400);
}


// ========================================
// RSVP
// ========================================

const confirmedGuests = [];

let presencaSelected = null;
let generoSelecionado = null;


// ========================================
// SELECT PRESENCA
// ========================================

function selectPresenca(val) {

  presencaSelected = val;

  const s = document.getElementById('btn-sim');
  const n = document.getElementById('btn-nao');

  if (val === 'sim') {

    s.style.background = 'linear-gradient(135deg,#C026D3,#0891B2)';
    s.style.color = '#fff';
    s.style.borderColor = 'transparent';

    n.style.background = 'rgba(255,255,255,0.05)';
    n.style.color = 'rgba(240,171,252,0.7)';
    n.style.borderColor = 'rgba(192,38,211,0.3)';

  } else {

    n.style.background = 'rgba(192,38,211,0.25)';
    n.style.color = '#fff';
    n.style.borderColor = 'rgba(192,38,211,0.5)';

    s.style.background = 'rgba(255,255,255,0.05)';
    s.style.color = 'rgba(240,171,252,0.7)';
    s.style.borderColor = 'rgba(192,38,211,0.3)';
  }
}


// ========================================
// SELECT GENERO
// ========================================

function selectGenero(genero) {

  generoSelecionado = genero;

  const homem = document.getElementById('btn-homem');
  const mulher = document.getElementById('btn-mulher');

  homem.style.background = 'rgba(255,255,255,0.05)';
  mulher.style.background = 'rgba(255,255,255,0.05)';

  homem.style.color = '#7DD3FC';
  mulher.style.color = '#F0ABFC';

  if (genero === 'homem') {

    homem.style.background = 'linear-gradient(135deg,#0891B2,#0369A1)';
    homem.style.color = '#fff';

  } else {

    mulher.style.background = 'linear-gradient(135deg,#C026D3,#9333EA)';
    mulher.style.color = '#fff';
  }
}


// ========================================
// SUBMIT RSVP
// ========================================

function submitRSVP() {

  const name = document.getElementById('guest-name').value.trim();

  if (!name) {

    document.getElementById('guest-name').style.borderColor = '#C026D3';

    document.getElementById('guest-name').focus();

    return;
  }

  if (!generoSelecionado) {

    alert('Selecione Homem ou Mulher 😊');

    return;
  }

  if (!presencaSelected) {

    alert('Selecione se vai comparecer 😊');

    return;
  }

  // esconder formulário
  document.getElementById('rsvp-form-wrap').style.display = 'none';

  // mostrar sucesso
  document.getElementById('rsvp-success').style.display = 'block';


  // ========================================
  // MENSAGEM
  // ========================================

  if (presencaSelected === 'sim') {

    document.getElementById('success-emoji').textContent = '🎊';

    document.getElementById('success-title').textContent =
      `Que ótimo, ${name}!`;

    document.getElementById('success-msg').textContent =
      'Sua presença foi confirmada. Te esperamos na pista com muito samba! 🎶';

    launchConfetti();

  } else {

    document.getElementById('success-emoji').textContent = '😢';

    document.getElementById('success-title').textContent =
      `Que pena, ${name}...`;

    document.getElementById('success-msg').textContent =
      'A gente vai sentir sua falta! 💛';
  }


  // ========================================
  // BOTÃO DINÂMICO
  // ========================================

  const listaContainer = document.getElementById('lista-container');

  listaContainer.innerHTML = '';

  if (presencaSelected === 'sim') {

    if (generoSelecionado === 'homem') {

      listaContainer.innerHTML = `
        <a href="https://events.vipme.com.br/2470174/497634?id_promoter=7735"
          target="_blank"
          style="
            display:inline-flex;
            align-items:center;
            gap:10px;
            background:linear-gradient(135deg,#0891B2,#0369A1);
            color:#fff;
            font-family:Nunito,sans-serif;
            font-weight:800;
            font-size:0.9rem;
            padding:14px 26px;
            border-radius:14px;
            text-decoration:none;
            letter-spacing:0.03em;
            box-shadow:0 0 24px rgba(8,145,178,0.4);
          ">

          <span style="font-size:1.3rem;">👔</span>

          <span>
            Lista dos Homens
            <br>

            <span style="
              font-size:0.7rem;
              opacity:0.8;
              font-weight:600;
            ">
              Jefferson
            </span>
          </span>

        </a>
      `;

    } else {

      listaContainer.innerHTML = `
        <a href="https://events.vipme.com.br/2470174/497633?id_promoter=7735"
          target="_blank"
          style="
            display:inline-flex;
            align-items:center;
            gap:10px;
            background:linear-gradient(135deg,#C026D3,#9333EA);
            color:#fff;
            font-family:Nunito,sans-serif;
            font-weight:800;
            font-size:0.9rem;
            padding:14px 26px;
            border-radius:14px;
            text-decoration:none;
            letter-spacing:0.03em;
            box-shadow:0 0 24px rgba(192,38,211,0.4);
          ">

          <span style="font-size:1.3rem;">👗</span>

          <span>
            Lista das Mulheres
            <br>

            <span style="
              font-size:0.7rem;
              opacity:0.8;
              font-weight:600;
            ">
              Tamyres
            </span>
          </span>

        </a>
      `;
    }
  }


  // ========================================
  // SALVAR CONVIDADOS
  // ========================================

  confirmedGuests.push({

    name,

    genero: generoSelecionado,

    presenca:
      presencaSelected === 'sim'
        ? 'Sim'
        : 'Não'
  });

  showGuestList();


  // ========================================
  // API
  // ========================================

  fetch("https://convite-lmdr.onrender.com/salvar", {

    method: "POST",

    headers: {
      "Content-Type": "application/json"
    },

    body: JSON.stringify({

      nome: name,

      genero: generoSelecionado,

      resposta: presencaSelected
    })

  })
  .then(res => res.json())

  .then(data => {

    console.log("Sucesso:", data);

  })

  .catch(err => {

    console.error("Erro:", err);

  });
}


// ========================================
// SHOW GUEST LIST
// ========================================

function showGuestList() {

  if (confirmedGuests.length === 0) return;

  const listEl = document.getElementById('guest-list');
  const itemsEl = document.getElementById('guest-items');

  listEl.style.display = 'block';

  itemsEl.innerHTML = '';

  confirmedGuests.forEach(g => {

    const div = document.createElement('div');

    div.className = 'guest-item';

    const dot =
      g.presenca === 'Sim'
        ? '#22D3EE'
        : '#C026D3';

    div.innerHTML = `
      <span
        class="guest-dot"
        style="background:${dot}">
      </span>

      <strong>${g.name}</strong>

      <span style="
        color:rgba(240,171,252,0.5);
        font-size:0.8rem;
      ">
        &nbsp;· ${g.genero} · ${g.presenca}
      </span>
    `;

    itemsEl.appendChild(div);
  });
}


// ========================================
// CONFETTI
// ========================================

function launchConfetti() {

  const canvas = document.getElementById('confetti-canvas');

  const ctx = canvas.getContext('2d');

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const colors = [
    '#C026D3',
    '#E879F9',
    '#22D3EE',
    '#0891B2',
    '#F0ABFC',
    '#7C3AED',
    '#06B6D4'
  ];

  const pieces = Array.from({length: 140}, () => ({

    x: Math.random() * canvas.width,

    y: Math.random() * -canvas.height,

    size: Math.random() * 9 + 4,

    color: colors[Math.floor(Math.random() * colors.length)],

    speed: Math.random() * 3 + 2,

    angle: Math.random() * 360,

    spin: (Math.random() - 0.5) * 6,

    drift: (Math.random() - 0.5) * 2,
  }));

  let frame;

  function draw() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let alive = false;

    pieces.forEach(p => {

      p.y += p.speed;

      p.x += p.drift;

      p.angle += p.spin;

      if (p.y < canvas.height + 20) alive = true;

      ctx.save();

      ctx.translate(p.x, p.y);

      ctx.rotate(p.angle * Math.PI / 180);

      ctx.fillStyle = p.color;

      ctx.fillRect(
        -p.size / 2,
        -p.size / 2,
        p.size,
        p.size * 0.5
      );

      ctx.restore();
    });

    if (alive) {

      frame = requestAnimationFrame(draw);

    } else {

      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  if (frame) {

    cancelAnimationFrame(frame);
  }

  draw();
}


// ========================================
// GIFT TABS
// ========================================

function showGift(person, btn) {

  document
    .querySelectorAll('.gift-panel')
    .forEach(p => p.classList.remove('active'));

  document
    .querySelectorAll('.gift-tab')
    .forEach(t => t.classList.remove('active'));

  document
    .getElementById('gift-' + person)
    .classList.add('active');

  btn.classList.add('active');
}


// ========================================
// SUB TABS
// ========================================

function showSubTab(tab) {

  const roupas = document.getElementById('sub-roupas');
  const acess = document.getElementById('sub-acessorios');

  const btnR = document.getElementById('st-roupas');
  const btnA = document.getElementById('st-acessorios');

  if (tab === 'roupas') {

    roupas.style.display = 'block';

    acess.style.display = 'none';

    btnR.style.background =
      'linear-gradient(135deg,#C026D3,#0891B2)';

    btnR.style.color = '#fff';

    btnA.style.background =
      'rgba(255,255,255,0.05)';

    btnA.style.color =
      'rgba(240,171,252,0.7)';

  } else {

    acess.style.display = 'block';

    roupas.style.display = 'none';

    btnA.style.background =
      'linear-gradient(135deg,#C026D3,#0891B2)';

    btnA.style.color = '#fff';

    btnR.style.background =
      'rgba(255,255,255,0.05)';

    btnR.style.color =
      'rgba(240,171,252,0.7)';
  }
}