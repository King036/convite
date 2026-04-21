

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
  const count = document.getElementById('guest-count').value;
  const confirm = document.getElementById('guest-confirm').value;

  if (!name) {
    document.getElementById('guest-name').style.borderColor = '#C026D3';
    document.getElementById('guest-name').focus();
    return;
  }

  document.getElementById('rsvp-form-wrap').style.display = 'none';
  const successWrap = document.getElementById('rsvp-success');
  successWrap.style.display = 'block';

  if (confirm === 'sim') {
    document.getElementById('success-emoji').textContent = '🎊';
    document.getElementById('success-title').textContent = `Que ótimo, ${name}!`;
    document.getElementById('success-msg').textContent = 'Sua presença foi confirmada. Te esperamos na pista com muito samba! 🎶';
    confirmedGuests.push({ name, count });
    launchConfetti();
    showGuestList();
  } else if (confirm === 'talvez') {
    document.getElementById('success-emoji').textContent = '🤞';
    document.getElementById('success-title').textContent = `Oi, ${name}!`;
    document.getElementById('success-msg').textContent = 'Esperamos que você consiga aparecer. Vai ser incrível! 🎶';
  } else {
    document.getElementById('success-emoji').textContent = '😢';
    document.getElementById('success-title').textContent = `Que pena, ${name}...`;
    document.getElementById('success-msg').textContent = 'A gente vai sentir sua falta! Mas obrigado por avisar. 💛';
  }
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
    div.innerHTML = `<span class="guest-dot"></span> <strong>${g.name}</strong> <span style="color:rgba(255,243,204,0.45);font-size:0.8rem;">&nbsp;· ${g.count} pessoa(s)</span>`;
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

// ---- SOUNDS via Web Audio API ----
let audioCtx = null;
function getCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}

function playSound(type) {
  const ctx = getCtx();

  const sounds = {
    pandeiro: () => {
      // Tambourine-like burst: noise hit + shimmer
      const buf = ctx.createBuffer(1, ctx.sampleRate * 0.35, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 2.5);
      }
      const src = ctx.createBufferSource();
      src.buffer = buf;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.7, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      const filter = ctx.createBiquadFilter();
      filter.type = 'highpass'; filter.frequency.value = 3000;
      src.connect(filter); filter.connect(gain); gain.connect(ctx.destination);
      src.start();
      // Add metallic jingle
      for (let j = 0; j < 5; j++) {
        const osc = ctx.createOscillator();
        const g2 = ctx.createGain();
        osc.frequency.value = 6000 + Math.random() * 4000;
        osc.type = 'sine';
        g2.gain.setValueAtTime(0.08, ctx.currentTime + j * 0.04);
        g2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + j * 0.04 + 0.15);
        osc.connect(g2); g2.connect(ctx.destination);
        osc.start(ctx.currentTime + j * 0.04);
        osc.stop(ctx.currentTime + j * 0.04 + 0.15);
      }
    },

    violao: () => {
      // Strummed chord: 6 notes in quick succession
      const chord = [196, 247, 294, 370, 440, 587];
      chord.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.value = freq;
        const t = ctx.currentTime + i * 0.03;
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.12, t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.8);
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass'; filter.frequency.value = 2000;
        osc.connect(filter); filter.connect(gain); gain.connect(ctx.destination);
        osc.start(t); osc.stop(t + 0.9);
      });
    },

    saxofone: () => {
      // Sax-like: warm tone with vibrato
      const notes = [440, 494, 523];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.18);
        // vibrato
        const vib = ctx.createOscillator();
        const vibGain = ctx.createGain();
        vib.frequency.value = 5; vibGain.gain.value = 8;
        vib.connect(vibGain); vibGain.connect(osc.frequency);
        const t = ctx.currentTime + i * 0.18;
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.18, t + 0.05);
        gain.gain.setValueAtTime(0.15, t + 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass'; filter.frequency.value = 1200; filter.Q.value = 1.5;
        osc.connect(filter); filter.connect(gain); gain.connect(ctx.destination);
        vib.start(t); osc.start(t); osc.stop(t + 0.25); vib.stop(t + 0.25);
      });
    },

    microfone: () => {
      // Feedback squeal + crowd cheer-like noise burst
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1400, ctx.currentTime + 0.1);
      osc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.25);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(); osc.stop(ctx.currentTime + 0.3);
      // Applause-like noise
      const buf = ctx.createBuffer(1, ctx.sampleRate * 0.5, ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * 0.15 * Math.sin(i / d.length * Math.PI);
      const ns = ctx.createBufferSource(); ns.buffer = buf;
      const ng = ctx.createGain(); ng.gain.value = 0.4;
      const nf = ctx.createBiquadFilter(); nf.type = 'bandpass'; nf.frequency.value = 1500;
      ns.connect(nf); nf.connect(ng); ng.connect(ctx.destination);
      ns.start(ctx.currentTime + 0.1);
    },

    notas: () => {
      // Cheerful melody: do-re-mi-sol
      const melody = [523, 587, 659, 784];
      melody.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        const t = ctx.currentTime + i * 0.13;
        gain.gain.setValueAtTime(0.25, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
        osc.connect(gain); gain.connect(ctx.destination);
        osc.start(t); osc.stop(t + 0.22);
      });
    },

    festa: () => {
      // Party horn + fanfare
      const fanfare = [523, 659, 784, 1047];
      fanfare.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.value = freq;
        const t = ctx.currentTime + i * 0.1;
        gain.gain.setValueAtTime(0.15, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass'; filter.frequency.value = 2500;
        osc.connect(filter); filter.connect(gain); gain.connect(ctx.destination);
        osc.start(t); osc.stop(t + 0.3);
      });
      // Noise burst
      const buf = ctx.createBuffer(1, ctx.sampleRate * 0.3, ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 1.5) * 0.3;
      const ns = ctx.createBufferSource(); ns.buffer = buf;
      const ng = ctx.createGain(); ng.gain.value = 0.5;
      ns.connect(ng); ng.connect(ctx.destination);
      ns.start(ctx.currentTime + 0.3);
    }
  };

  if (sounds[type]) sounds[type]();
}