/* ══════════════════════════════════════════════════
   LION KING GENDER REVEAL · script.js
   Wlad & Samy · 2026
══════════════════════════════════════════════════ */

/* ── PARTICLES (canvas) ── */
(function () {
  const canvas = document.getElementById('particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function createParticle() {
    return {
      x:       Math.random() * canvas.width,
      y:       canvas.height + 10,
      r:       Math.random() * 3 + 1,
      speed:   Math.random() * 0.6 + 0.3,
      opacity: Math.random() * 0.5 + 0.1,
      drift:   (Math.random() - 0.5) * 0.5
    };
  }

  // Seed some particles at random positions so the canvas isn't empty on load
  for (let i = 0; i < 50; i++) {
    const p = createParticle();
    p.y = Math.random() * canvas.height;
    particles.push(p);
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p, i) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(245, 200, 66, ${p.opacity})`;
      ctx.fill();
      p.y -= p.speed;
      p.x += p.drift;
      if (p.y < -10) particles[i] = createParticle();
    });
    requestAnimationFrame(animate);
  }
  animate();
})();

/* ── SCROLL REVEAL ── */
const scrollObserver = new IntersectionObserver(
  (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
  { threshold: 0.12 }
);
document.querySelectorAll('.reveal-on-scroll').forEach(el => scrollObserver.observe(el));

/* ── ENVELOPE OPEN ── */
function openEnvelope() {
  const env      = document.getElementById('envelope');
  const hint     = document.getElementById('openHint');
  const blessing = document.getElementById('blessing');
  if (!env || env.classList.contains('opened')) return;
  env.classList.add('opened');
  if (hint) hint.style.display = 'none';
  setTimeout(() => { if (blessing) blessing.classList.add('visible'); }, 1200);
}

/* ── GENDER REVEAL ── */
function revealGender(type) {
  document.querySelectorAll('.gender-btn').forEach(b => b.classList.remove('selected'));
  document.querySelectorAll('.gender-result').forEach(r => r.classList.remove('show'));
  const btn    = document.querySelector(`.btn-${type}`);
  const result = document.getElementById(`result-${type}`);
  if (btn)    btn.classList.add('selected');
  if (result) result.classList.add('show');
  launchConfetti(type);
}

function launchConfetti(type) {
  const colors = type === 'boy'
    ? ['#87CEEB', '#5DADE2', '#AED6F1', '#F5C842']
    : ['#FFB6C1', '#FF69B4', '#FFD1DC', '#F5C842'];

  for (let i = 0; i < 100; i++) {
    const conf = document.createElement('div');
    const size = Math.random() * 10 + 5;
    conf.style.cssText = `
      position:fixed;
      top:${Math.random() * 40}%;
      left:${Math.random() * 100}%;
      width:${size}px;
      height:${size}px;
      background:${colors[Math.floor(Math.random() * colors.length)]};
      border-radius:${Math.random() > 0.5 ? '50%' : '2px'};
      pointer-events:none;
      z-index:9999;
      animation:confettiFall ${Math.random() * 2 + 1.5}s ease forwards;
      transform:rotate(${Math.random() * 360}deg);
    `;
    document.body.appendChild(conf);
    setTimeout(() => conf.remove(), 4000);
  }
}

/* ── LIVE COUNTDOWN ── */
function updateCountdown() {
  // Event: Saturday 14 March 2026 at 12:00 PM (local time of the device)
  const target = new Date('2026-03-14T12:00:00');
  const now    = new Date();
  const diff   = target - now;

  const pad = (n) => String(Math.max(0, n)).padStart(2, '0');

  if (diff <= 0) {
    ['cd-days','cd-hours','cd-mins','cd-secs'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = '00';
    });
    return;
  }

  const days  = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins  = Math.floor((diff % 3600000)  / 60000);
  const secs  = Math.floor((diff % 60000)    / 1000);

  const dEl = document.getElementById('cd-days');
  const hEl = document.getElementById('cd-hours');
  const mEl = document.getElementById('cd-mins');
  const sEl = document.getElementById('cd-secs');

  if (dEl) dEl.textContent = days;
  if (hEl) hEl.textContent = pad(hours);
  if (mEl) mEl.textContent = pad(mins);
  if (sEl) sEl.textContent = pad(secs);
}
updateCountdown();
setInterval(updateCountdown, 1000);

/* ── RSVP FORM ── */
function submitRsvp() {
  const name   = document.getElementById('rsvp-name')?.value.trim();
  const guests = document.getElementById('rsvp-guests')?.value;
  const team   = document.getElementById('rsvp-team')?.value;

  if (!name || !guests || !team) {
    alert('Por favor completa todos los campos 🦁');
    return;
  }

  const form    = document.querySelector('.rsvp-form');
  const success = document.getElementById('rsvp-success');
  if (form)    form.style.display = 'none';
  if (success) success.style.display = 'block';

  // Optional: log to console for debugging / future webhook integration
  console.log('RSVP recibido:', { name, guests, team });
}
