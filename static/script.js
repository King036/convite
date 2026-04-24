// ---- COUNTDOWN ----
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

// ---- SHOW STAGE CANVAS ----
(function() {
  const canvas = document.getElementById('show-canvas');
  const ctx = canvas.getContext('2d');
  let W, H;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // ---- CROWD (bottom strip of silhouettes) ----
  function drawCrowd(alpha) {
    ctx.save();
    ctx.globalAlpha = alpha;
    const baseY = H * 0.78;
    const colors = ['#1a0030','#120025','#200040','#150035'];
    // Generate stable crowd using seeded positions
    const heads = [];
    let x = 0;
    let seed = 42;
    function rand(s) { seed = (seed * 1664525 + 1013904223) & 0xffffffff; return ((seed >>> 0) / 0xffffffff); }
    while (x < W + 60) {
      const w = 28 + rand() * 20;
      const h = 55 + rand() * 50;
      heads.push({ x, w, h });
      x += w * 0.7 + rand() * 8;
    }
    heads.forEach(p => {
      const grad = ctx.createLinearGradient(p.x, baseY - p.h, p.x, baseY);
      grad.addColorStop(0, '#2a0050');
      grad.addColorStop(1, '#0a0018');
      ctx.fillStyle = grad;
      // Body
      ctx.beginPath();
      ctx.roundRect(p.x - p.w/2, baseY - p.h, p.w, p.h, [p.w*0.5, p.w*0.5, 0, 0]);
      ctx.fill();
      // Head bump
      ctx.beginPath();
      ctx.arc(p.x, baseY - p.h, p.w * 0.38, 0, Math.PI * 2);
      ctx.fill();
    });
    // Floor glow
    const floorGrad = ctx.createLinearGradient(0, baseY, 0, H);
    floorGrad.addColorStop(0, 'rgba(100,0,180,0.18)');
    floorGrad.addColorStop(1, 'rgba(0,0,10,0.9)');
    ctx.fillStyle = floorGrad;
    ctx.fillRect(0, baseY, W, H - baseY);
    ctx.restore();
  }

  // ---- SPOTLIGHTS ----
  const spotlights = [
    { ox: 0.15, oy: 0, tx: 0.35, ty: 0.72, color: [255,45,85],   speed: 0.003, phase: 0,    width: 0.09 },
    { ox: 0.85, oy: 0, tx: 0.65, ty: 0.72, color: [0,200,255],   speed: 0.004, phase: 1.2,  width: 0.08 },
    { ox: 0.50, oy: 0, tx: 0.50, ty: 0.70, color: [255,215,0],   speed: 0.0025,phase: 2.4,  width: 0.07 },
    { ox: 0.25, oy: 0, tx: 0.20, ty: 0.75, color: [180,0,255],   speed: 0.005, phase: 0.6,  width: 0.065},
    { ox: 0.75, oy: 0, tx: 0.80, ty: 0.75, color: [0,255,128],   speed: 0.0035,phase: 3.5,  width: 0.065},
  ];

  function drawSpotlights(t) {
    spotlights.forEach(sp => {
      // Animate target x with swing
      const swing = Math.sin(t * sp.speed * 1000 + sp.phase) * 0.28;
      const tx = (sp.tx + swing) * W;
      const ty = sp.ty * H;
      const ox = sp.ox * W;
      const oy = sp.oy;

      // Cone
      const coneWidth = sp.width * W;
      const [r,g,b] = sp.color;

      ctx.save();
      const grad = ctx.createLinearGradient(ox, oy, tx, ty);
      grad.addColorStop(0,   `rgba(${r},${g},${b},0.35)`);
      grad.addColorStop(0.4, `rgba(${r},${g},${b},0.12)`);
      grad.addColorStop(1,   `rgba(${r},${g},${b},0.0)`);

      const angle = Math.atan2(ty - oy, tx - ox);
      const perp = angle + Math.PI/2;
      const len = Math.hypot(tx - ox, ty - oy);

      ctx.beginPath();
      ctx.moveTo(ox, oy);
      ctx.lineTo(
        tx + Math.cos(perp) * coneWidth,
        ty + Math.sin(perp) * coneWidth
      );
      ctx.lineTo(
        tx - Math.cos(perp) * coneWidth,
        ty - Math.sin(perp) * coneWidth
      );
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.globalAlpha = 0.7;
      ctx.fill();

      // Pool of light at target
      const pool = ctx.createRadialGradient(tx, ty, 0, tx, ty, coneWidth * 1.5);
      pool.addColorStop(0, `rgba(${r},${g},${b},0.25)`);
      pool.addColorStop(1, `rgba(${r},${g},${b},0.0)`);
      ctx.globalAlpha = 0.8;
      ctx.fillStyle = pool;
      ctx.beginPath();
      ctx.ellipse(tx, ty, coneWidth * 1.5, coneWidth * 0.5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Source glow (lamp top)
      const lamp = ctx.createRadialGradient(ox, oy, 0, ox, oy, 30);
      lamp.addColorStop(0, `rgba(${r},${g},${b},0.9)`);
      lamp.addColorStop(1, `rgba(${r},${g},${b},0.0)`);
      ctx.globalAlpha = 0.9;
      ctx.fillStyle = lamp;
      ctx.beginPath();
      ctx.arc(ox, oy, 30, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    });
  }

  // ---- SMOKE / FOG ----
  const fogParticles = Array.from({length: 18}, (_, i) => ({
    x: Math.random() * 1.2 - 0.1,
    y: 0.6 + Math.random() * 0.25,
    r: 0.08 + Math.random() * 0.15,
    alpha: 0.03 + Math.random() * 0.06,
    speed: 0.00003 + Math.random() * 0.00005,
    drift: (Math.random() - 0.5) * 0.0001,
    phase: Math.random() * Math.PI * 2,
  }));

  function drawFog(t) {
    ctx.save();
    fogParticles.forEach(fp => {
      fp.y -= fp.speed;
      fp.x += fp.drift;
      if (fp.y < -0.1) { fp.y = 0.75 + Math.random() * 0.2; fp.x = Math.random() * 1.2 - 0.1; }
      const cx = fp.x * W;
      const cy = fp.y * H;
      const rad = fp.r * W;
      const pulse = fp.alpha * (0.7 + 0.3 * Math.sin(t * 0.0008 + fp.phase));
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad);
      grad.addColorStop(0, `rgba(180,100,255,${pulse})`);
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, rad, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  }

  // ---- LASER BEAMS ----
  const lasers = [
    { ox:0.15, oy:0.0, angle:0.85, color:'#FF2D55', speed:0.0015, phase:0 },
    { ox:0.85, oy:0.0, angle:2.30, color:'#00C8FF', speed:0.002,  phase:1 },
    { ox:0.50, oy:0.0, angle:1.57, color:'#FBBF24', speed:0.0012, phase:2 },
    { ox:0.30, oy:0.0, angle:1.1,  color:'#D946EF', speed:0.0018, phase:3 },
    { ox:0.70, oy:0.0, angle:2.0,  color:'#00FF80', speed:0.0014, phase:4 },
  ];

  function drawLasers(t) {
    lasers.forEach(l => {
      const swing = Math.sin(t * l.speed * 1000 + l.phase) * 0.6;
      const angle = l.angle + swing;
      const ox = l.ox * W;
      const oy = l.oy * H;
      const len = H * 1.5;
      const ex = ox + Math.cos(angle) * len;
      const ey = oy + Math.sin(angle) * len;

      ctx.save();
      const grad = ctx.createLinearGradient(ox, oy, ex, ey);
      const hex = l.color;
      grad.addColorStop(0,   hex + 'FF');
      grad.addColorStop(0.3, hex + '80');
      grad.addColorStop(1,   hex + '00');

      ctx.globalAlpha = 0.55;
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.5;
      ctx.shadowColor = l.color;
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.moveTo(ox, oy);
      ctx.lineTo(ex, ey);
      ctx.stroke();

      // Glow line
      ctx.globalAlpha = 0.2;
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(ox, oy);
      ctx.lineTo(ex, ey);
      ctx.stroke();

      ctx.restore();
    });
  }

  // ---- STROBE / BEAT FLASH ----
  let strobeAlpha = 0;
  let lastBeat = 0;
  const BPM = 102; // ~pagode BPM
  const beatInterval = 60000 / BPM;

  function updateStrobe(t) {
    if (t - lastBeat > beatInterval) {
      lastBeat = t;
      strobeAlpha = 0.07;
    }
    strobeAlpha *= 0.82;
  }

  // ---- STAGE STRUCTURE (truss bars at top) ----
  function drawTruss() {
    ctx.save();
    ctx.globalAlpha = 0.35;
    // Main horizontal bar
    const grad = ctx.createLinearGradient(0, 0, W, 0);
    grad.addColorStop(0,   'rgba(80,40,120,0.0)');
    grad.addColorStop(0.15,'rgba(120,80,180,0.8)');
    grad.addColorStop(0.85,'rgba(120,80,180,0.8)');
    grad.addColorStop(1,   'rgba(80,40,120,0.0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 2, W, 8);

    // Diagonal supports
    ctx.strokeStyle = 'rgba(140,100,200,0.3)';
    ctx.lineWidth = 1.5;
    for (let x = 0; x < W; x += 60) {
      ctx.beginPath();
      ctx.moveTo(x, 10);
      ctx.lineTo(x + 30, 30);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x + 30, 10);
      ctx.lineTo(x, 30);
      ctx.stroke();
    }
    // Bottom bar
    ctx.globalAlpha = 0.25;
    ctx.fillStyle = 'rgba(100,60,160,0.5)';
    ctx.fillRect(0, 30, W, 4);
    ctx.restore();
  }

  // ---- PAR CAN LIGHTS (fixtures on truss) ----
  const parCans = [0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9].map((xf, i) => ({
    xf,
    color: ['#FF2D55','#00C8FF','#FBBF24','#D946EF','#00FF80','#FF6B00','#00C8FF','#FF2D55','#FBBF24'][i],
    phase: i * 0.7,
  }));

  function drawParCans(t) {
    parCans.forEach(p => {
      const x = p.xf * W;
      const flicker = 0.6 + 0.4 * Math.sin(t * 0.004 + p.phase);
      ctx.save();
      ctx.globalAlpha = flicker * 0.85;
      // Fixture body
      ctx.fillStyle = 'rgba(60,40,80,0.9)';
      ctx.beginPath();
      ctx.roundRect(x - 10, 2, 20, 16, 3);
      ctx.fill();
      // Light beam downward
      const cg = ctx.createLinearGradient(x, 18, x, 18 + H * 0.15);
      cg.addColorStop(0,   p.color + 'CC');
      cg.addColorStop(0.5, p.color + '30');
      cg.addColorStop(1,   p.color + '00');
      ctx.fillStyle = cg;
      ctx.beginPath();
      ctx.moveTo(x - 6, 18);
      ctx.lineTo(x + 6, 18);
      ctx.lineTo(x + H * 0.08, 18 + H * 0.15);
      ctx.lineTo(x - H * 0.08, 18 + H * 0.15);
      ctx.closePath();
      ctx.fill();
      // Lens glow
      const lg = ctx.createRadialGradient(x, 10, 0, x, 10, 12);
      lg.addColorStop(0, p.color + 'FF');
      lg.addColorStop(1, p.color + '00');
      ctx.globalAlpha = flicker;
      ctx.fillStyle = lg;
      ctx.beginPath();
      ctx.arc(x, 10, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  }

  // ---- CONFETTI STREAMERS ----
  const streamers = Array.from({length: 35}, () => ({
    x: Math.random(),
    y: -Math.random(),
    vy: 0.0004 + Math.random() * 0.0006,
    vx: (Math.random() - 0.5) * 0.0003,
    color: ['#FF2D55','#FBBF24','#D946EF','#00C8FF','#00FF80','#fff'][Math.floor(Math.random()*6)],
    w: 3 + Math.random() * 5,
    h: 8 + Math.random() * 10,
    rot: Math.random() * Math.PI * 2,
    rotV: (Math.random() - 0.5) * 0.05,
  }));

  function drawStreamers(t) {
    ctx.save();
    streamers.forEach(s => {
      s.y += s.vy;
      s.x += s.vx;
      s.rot += s.rotV;
      if (s.y > 1.05) { s.y = -0.05; s.x = Math.random(); }
      ctx.globalAlpha = 0.7;
      ctx.fillStyle = s.color;
      ctx.save();
      ctx.translate(s.x * W, s.y * H);
      ctx.rotate(s.rot);
      ctx.fillRect(-s.w/2, -s.h/2, s.w, s.h);
      ctx.restore();
    });
    ctx.restore();
  }

  // ---- MAIN LOOP ----
  let startTime = null;
  function loop(ts) {
    if (!startTime) startTime = ts;
    const t = ts - startTime;

    ctx.clearRect(0, 0, W, H);

    // Sky gradient
    const sky = ctx.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0,   '#06001A');
    sky.addColorStop(0.5, '#0D0030');
    sky.addColorStop(1,   '#060010');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, H);

    // Draw layers
    drawTruss();
    drawParCans(t);
    drawSpotlights(t);
    drawLasers(t);
    drawFog(t);
    drawStreamers(t);
    drawCrowd(0.95);

    // Beat strobe flash
    updateStrobe(t);
    if (strobeAlpha > 0.002) {
      ctx.save();
      ctx.globalAlpha = strobeAlpha;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, W, H);
      ctx.restore();
    }

    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();

// ---- PARTICLES ----
(function() {
  const colors = ['#D946EF','#06B6D4','#FBBF24','#F0ABFC','#67E8F9'];
  const container = document.getElementById('particles');
  for (let i = 0; i < 28; i++) {
    const p = document.createElement('div');
    const size = Math.random() * 5 + 2;
    p.className = 'particle';
    p.style.cssText = [
      'width:' + size + 'px',
      'height:' + size + 'px',
      'background:' + colors[Math.floor(Math.random() * colors.length)],
      'left:' + (Math.random() * 100) + 'vw',
      'animation-duration:' + (Math.random() * 12 + 8) + 's',
      'animation-delay:' + (Math.random() * 10) + 's',
      'opacity:0.7',
      'box-shadow:0 0 ' + (size*3) + 'px ' + colors[Math.floor(Math.random() * colors.length)],
      'z-index:1'
    ].join(';');
    container.appendChild(p);
  }
})();

// ---- SCROLL REVEAL (suave) ----
(function() {
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        // Small delay per element index for natural feel
        const delay = parseFloat(entry.target.dataset.delay || 0);
        setTimeout(function() {
          entry.target.classList.add('visible');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .stagger, .section-divider').forEach(function(el, i) {
    // Stagger sibling elements naturally
    const siblings = el.parentElement ? el.parentElement.querySelectorAll('.reveal') : [];
    let siblingIndex = 0;
    siblings.forEach(function(s, si) { if (s === el) siblingIndex = si; });
    el.dataset.delay = siblingIndex * 80;
    observer.observe(el);
  });
})();

//api
//Api


const botao = document.getElementById("presenca");

botao.addEventListener("click", function() {

  const nome = document.getElementById("guest-name").value;

  console.log(nome);
    console.log(presencaSelected);


  fetch("https://convite-lmdr.onrender.com/salvar", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ nome: nome, resposta : presencaSelected })
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
fetch("https://convite-lmdr.onrender.com/usuarios")
  .then(res => res.json())
  .then(dados => {
    console.log(dados);
    mostrarUsuarios(dados);
  });