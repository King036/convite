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

// ---- SHAKE ----
function triggerShake(el) {
  el.classList.remove('shake');
  void el.offsetWidth;
  el.classList.add('shake');
  setTimeout(() => el.classList.remove('shake'), 400);
}

// ---- RSVP ----
const confirmedGuests = [];

function submitRSVP() {
  const name = document.getElementById('guest-name').value.trim();
  if (!name) {
    document.getElementById('guest-name').style.borderColor = '#C026D3';
    document.getElementById('guest-name').focus();
    return;
  }
  if (!presencaSelected) {
    alert('Por favor, selecione se vai ou não comparecer! 😊');
    return;
  }
  document.getElementById('rsvp-form-wrap').style.display = 'none';
  document.getElementById('rsvp-success').style.display = 'block';
  if (presencaSelected === 'sim') {
    document.getElementById('success-emoji').textContent = '🎊';
    document.getElementById('success-title').textContent = `Que ótimo, ${name}!`;
    document.getElementById('success-msg').textContent = 'Sua presença foi confirmada. Te esperamos na pista com muito samba! 🎶';
    launchConfetti();
  } else {
    document.getElementById('success-emoji').textContent = '😢';
    document.getElementById('success-title').textContent = `Que pena, ${name}...`;
    document.getElementById('success-msg').textContent = 'A gente vai sentir sua falta! Mas obrigado por avisar. 💛';
  }
  confirmedGuests.push({ name, presenca: presencaSelected === 'sim' ? 'Sim' : 'Não' });
  showGuestList();
}

function showGuestList() {
  if (confirmedGuests.length === 0) return;
  const listEl = document.getElementById('guest-list');
  const itemsEl = document.getElementById('guest-items');
  listEl.style.display = 'block';
  itemsEl.innerHTML = '';
  confirmedGuests.forEach(g => {
    const div = document.createElement('div');
    div.className = 'guest-item';
    const dot = g.presenca === 'Sim' ? '#22D3EE' : '#C026D3';
    div.innerHTML = `<span class="guest-dot" style="background:${dot}"></span> <strong>${g.name}</strong> <span style="color:rgba(240,171,252,0.5);font-size:0.8rem;">&nbsp;· ${g.presenca}</span>`;
    itemsEl.appendChild(div);
  });
}

// ---- CONFETTI ----
function launchConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const colors = ['#C026D3','#E879F9','#22D3EE','#0891B2','#F0ABFC','#7C3AED','#06B6D4'];
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
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.5);
      ctx.restore();
    });
    if (alive) frame = requestAnimationFrame(draw);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  if (frame) cancelAnimationFrame(frame);
  draw();
}
// ---- GIFT TABS ----
function showGift(person, btn) {
  document.querySelectorAll('.gift-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.gift-tab').forEach(t => t.classList.remove('active'));
  document.getElementById('gift-' + person).classList.add('active');
  btn.classList.add('active');
}
function showSubTab(tab) {
  const roupas = document.getElementById('sub-roupas');
  const acess = document.getElementById('sub-acessorios');
  const btnR = document.getElementById('st-roupas');
  const btnA = document.getElementById('st-acessorios');
  if (tab === 'roupas') {
    roupas.style.display = 'block'; acess.style.display = 'none';
    btnR.style.background = 'linear-gradient(135deg,#C026D3,#0891B2)'; btnR.style.color = '#fff';
    btnA.style.background = 'rgba(255,255,255,0.05)'; btnA.style.color = 'rgba(240,171,252,0.7)';
  } else {
    acess.style.display = 'block'; roupas.style.display = 'none';
    btnA.style.background = 'linear-gradient(135deg,#C026D3,#0891B2)'; btnA.style.color = '#fff';
    btnR.style.background = 'rgba(255,255,255,0.05)'; btnR.style.color = 'rgba(240,171,252,0.7)';
  }
}
let presencaSelected = null;
function selectPresenca(val) {
  presencaSelected = val;
  const s = document.getElementById('btn-sim');
  const n = document.getElementById('btn-nao');
  if (val === 'sim') {
    s.style.background='linear-gradient(135deg,#C026D3,#0891B2)'; s.style.color='#fff'; s.style.borderColor='transparent';
    n.style.background='rgba(255,255,255,0.05)'; n.style.color='rgba(240,171,252,0.7)'; n.style.borderColor='rgba(192,38,211,0.3)';
  } else {
    n.style.background='rgba(192,38,211,0.25)'; n.style.color='#fff'; n.style.borderColor='rgba(192,38,211,0.5)';
    s.style.background='rgba(255,255,255,0.05)'; s.style.color='rgba(240,171,252,0.7)'; s.style.borderColor='rgba(192,38,211,0.3)';
  }
}

// ---- SOUNDS via Web Audio API ----
let audioCtx = null;
function getCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

// Utility: envelope helper
function env(param, ctx, atk, sus, rel, peak) {
  const t = ctx.currentTime;
  param.setValueAtTime(0.0001, t);
  param.exponentialRampToValueAtTime(peak, t + atk);
  param.setValueAtTime(peak, t + atk + sus);
  param.exponentialRampToValueAtTime(0.0001, t + atk + sus + rel);
}

function playSound(type) {
  const ctx = getCtx();

  const sounds = {

    // 🥁 PANDEIRO — tight drum hit + metallic jingles (tambourine-like)
    pandeiro: () => {
      // Bass thump
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(180, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.08);
      env(g.gain, ctx, 0.002, 0.01, 0.12, 0.7);
      osc.connect(g); g.connect(ctx.destination);
      osc.start(); osc.stop(ctx.currentTime + 0.25);

      // Noise crack (snare-like)
      const bufLen = ctx.sampleRate * 0.08;
      const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < bufLen; i++) d[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufLen * 0.15));
      const ns = ctx.createBufferSource();
      ns.buffer = buf;
      const ng = ctx.createGain(); ng.gain.value = 0.5;
      const nhp = ctx.createBiquadFilter(); nhp.type = 'highpass'; nhp.frequency.value = 2000;
      ns.connect(nhp); nhp.connect(ng); ng.connect(ctx.destination);
      ns.start();

      // Metallic jingles — 8 quick bursts
      for (let j = 0; j < 8; j++) {
        const jo = ctx.createOscillator();
        const jg = ctx.createGain();
        jo.type = 'sine';
        jo.frequency.value = 5000 + Math.random() * 6000;
        const jt = ctx.currentTime + j * 0.022;
        jg.gain.setValueAtTime(0.0001, jt);
        jg.gain.exponentialRampToValueAtTime(0.12, jt + 0.005);
        jg.gain.exponentialRampToValueAtTime(0.0001, jt + 0.07);
        jo.connect(jg); jg.connect(ctx.destination);
        jo.start(jt); jo.stop(jt + 0.08);
      }
    },

    // 🎸 VIOLÃO — nylon string pluck with body resonance
    violao: () => {
      // Karplus-Strong style: short noise burst filtered to sound like plucked string
      const chord = [196.0, 246.9, 293.7, 369.9, 440.0, 523.3]; // E2–E4 open chord
      chord.forEach((freq, i) => {
        const delay = i * 0.04;
        // Body thump on first string
        if (i === 0) {
          const bo = ctx.createOscillator();
          const bg = ctx.createGain();
          bo.type = 'sine'; bo.frequency.value = 80;
          bg.gain.setValueAtTime(0.3, ctx.currentTime + delay);
          bg.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + delay + 0.15);
          bo.connect(bg); bg.connect(ctx.destination);
          bo.start(ctx.currentTime + delay); bo.stop(ctx.currentTime + delay + 0.2);
        }
        // String tone: sawtooth + triangle mixed, bandpass filtered
        [['sawtooth', 0.08], ['triangle', 0.12]].forEach(([type, gain]) => {
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          const f = ctx.createBiquadFilter();
          o.type = type; o.frequency.value = freq;
          f.type = 'bandpass'; f.frequency.value = freq * 2; f.Q.value = 1;
          const t0 = ctx.currentTime + delay;
          g.gain.setValueAtTime(gain, t0);
          g.gain.exponentialRampToValueAtTime(0.0001, t0 + 1.2);
          o.connect(f); f.connect(g); g.connect(ctx.destination);
          o.start(t0); o.stop(t0 + 1.3);
        });
      });
    },

    // 🎷 SAXOFONE — warm overblown sax tone, 3-note riff
    saxofone: () => {
      const notes = [311.1, 349.2, 415.3]; // Eb4, F4, Ab4 — typical sax lick
      notes.forEach((freq, i) => {
        const t = ctx.currentTime + i * 0.2;
        // Fundamental
        const o1 = ctx.createOscillator();
        const o2 = ctx.createOscillator();
        const g = ctx.createGain();
        const f = ctx.createBiquadFilter();
        o1.type = 'sawtooth'; o1.frequency.value = freq;
        o2.type = 'square';   o2.frequency.value = freq * 1.005; // slight detune = warmth
        f.type = 'lowpass'; f.frequency.value = 2200; f.Q.value = 2;
        // Vibrato
        const vib = ctx.createOscillator();
        const vg = ctx.createGain();
        vib.frequency.value = 5.5; vg.gain.value = 5;
        vib.connect(vg); vg.connect(o1.frequency); vg.connect(o2.frequency);
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(0.18, t + 0.04);
        g.gain.setValueAtTime(0.15, t + 0.14);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
        o1.connect(f); o2.connect(f); f.connect(g); g.connect(ctx.destination);
        vib.start(t); o1.start(t); o2.start(t);
        o1.stop(t + 0.25); o2.stop(t + 0.25); vib.stop(t + 0.25);
      });
    },

    // 🎤 MICROFONE — breath + voice "hey!" burst
    microfone: () => {
      // Breath whoosh
      const bLen = Math.floor(ctx.sampleRate * 0.25);
      const bBuf = ctx.createBuffer(1, bLen, ctx.sampleRate);
      const bd = bBuf.getChannelData(0);
      for (let i = 0; i < bLen; i++) bd[i] = (Math.random() * 2 - 1) * Math.sin(Math.PI * i / bLen) * 0.4;
      const bs = ctx.createBufferSource(); bs.buffer = bBuf;
      const bf = ctx.createBiquadFilter(); bf.type = 'bandpass'; bf.frequency.value = 1800; bf.Q.value = 0.8;
      const bg = ctx.createGain(); bg.gain.value = 0.5;
      bs.connect(bf); bf.connect(bg); bg.connect(ctx.destination);
      bs.start();

      // "Hey!" — voiced formant simulation: two resonant oscillators
      const vowelFreqs = [[280, 2250], [300, 2100]]; // rough /e/ formants
      vowelFreqs.forEach(([f1, f2], i) => {
        const t = ctx.currentTime + 0.1 + i * 0.09;
        [f1, f2].forEach(freq => {
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          const filt = ctx.createBiquadFilter();
          o.type = 'sawtooth'; o.frequency.value = 150;
          filt.type = 'bandpass'; filt.frequency.value = freq; filt.Q.value = 8;
          g.gain.setValueAtTime(0.0001, t);
          g.gain.exponentialRampToValueAtTime(0.22, t + 0.03);
          g.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
          o.connect(filt); filt.connect(g); g.connect(ctx.destination);
          o.start(t); o.stop(t + 0.15);
        });
      });
    },

    // 🎶 NOTAS — bright marimba-like mallet hits
    notas: () => {
      const melody = [523.3, 659.3, 784.0, 1046.5]; // C5 E5 G5 C6
      melody.forEach((freq, i) => {
        const t = ctx.currentTime + i * 0.15;
        // Sine + slight inharmonic partial (mallet = lots of attack partials)
        [1, 2.76, 5.4].forEach((ratio, ri) => {
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.type = 'sine'; o.frequency.value = freq * ratio;
          const vol = ri === 0 ? 0.3 : 0.06 / ri;
          g.gain.setValueAtTime(vol, t);
          g.gain.exponentialRampToValueAtTime(0.0001, t + (ri === 0 ? 0.6 : 0.08));
          o.connect(g); g.connect(ctx.destination);
          o.start(t); o.stop(t + 0.65);
        });
      });
    },

    // 🎊 FESTA — confetti pop + brass fanfare stab
    festa: () => {
      // Pop crack
      const pLen = Math.floor(ctx.sampleRate * 0.03);
      const pBuf = ctx.createBuffer(1, pLen, ctx.sampleRate);
      const pd = pBuf.getChannelData(0);
      for (let i = 0; i < pLen; i++) pd[i] = (Math.random() * 2 - 1) * (1 - i / pLen);
      const ps = ctx.createBufferSource(); ps.buffer = pBuf;
      const pg = ctx.createGain(); pg.gain.value = 0.9;
      ps.connect(pg); pg.connect(ctx.destination);
      ps.start();

      // Brass chord stab: C major (C4 E4 G4 C5)
      [261.6, 329.6, 392.0, 523.3].forEach((freq, i) => {
        const t = ctx.currentTime + 0.03;
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        const f = ctx.createBiquadFilter();
        o.type = 'sawtooth'; o.frequency.value = freq;
        f.type = 'lowpass'; f.frequency.value = 3000;
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(0.18, t + 0.02);
        g.gain.setValueAtTime(0.15, t + 0.12);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
        o.connect(f); f.connect(g); g.connect(ctx.destination);
        o.start(t); o.stop(t + 0.4);
      });

      // Rising pitch sweep (party horn)
      const sw = ctx.createOscillator();
      const sg = ctx.createGain();
      sw.type = 'sawtooth';
      sw.frequency.setValueAtTime(400, ctx.currentTime + 0.4);
      sw.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.75);
      sg.gain.setValueAtTime(0.15, ctx.currentTime + 0.4);
      sg.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.8);
      sw.connect(sg); sg.connect(ctx.destination);
      sw.start(ctx.currentTime + 0.4); sw.stop(ctx.currentTime + 0.85);
    }
  };

  if (sounds[type]) sounds[type]();
}

// ---- SUB TABS (Jefferson) ----
function showJeffTab(tab) {
  var roupas = document.getElementById('jsub-roupas');
  var acess = document.getElementById('jsub-acessorios');
  var btnR = document.getElementById('jt-roupas');
  var btnA = document.getElementById('jt-acessorios');
  if (tab === 'roupas') {
    roupas.style.display = 'block'; acess.style.display = 'none';
    btnR.style.background = 'linear-gradient(135deg,#0891B2,#C026D3)'; btnR.style.color = '#fff';
    btnA.style.background = 'rgba(255,255,255,0.05)'; btnA.style.color = 'rgba(240,171,252,0.7)';
  } else {
    acess.style.display = 'block'; roupas.style.display = 'none';
    btnA.style.background = 'linear-gradient(135deg,#0891B2,#C026D3)'; btnA.style.color = '#fff';
    btnR.style.background = 'rgba(255,255,255,0.05)'; btnR.style.color = 'rgba(240,171,252,0.7)';
  }
}

//Api


const form = document.getElementById("presenca");

form.addEventListener("submit", function(event) {
  event.preventDefault(); // impede reload da página

  const nome = document.getElementById("nome").value;
  const pesenca = document.getElementById("nome").value;

  fetch("http://localhost:5000/salvar", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ nome: nome, presenca :presenca })
  })
  .then(res => res.json())
  .then(data => {
    console.log("Sucesso:", data);
  })
  .catch(err => {
    console.error("Erro:", err);
  });
});

//motrar dados
fetch("http://localhost:5000/usuarios")
  .then(res => res.json())
  .then(dados => {
    console.log(dados);
    mostrarUsuarios(dados);
  });