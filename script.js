/* ══════════════════════════════════════════════════
   LION KING GENDER REVEAL · script.js
   Wlad & Samy · 2026
══════════════════════════════════════════════════ */

/* ── SPLASH SCREEN → starts audio on first tap ── */
function enterSite() {
  const splash = document.getElementById('splash');
  const audio  = document.getElementById('bgMusic');

  if (!splash || splash.classList.contains('hiding')) return;
  splash.classList.add('hiding');

  // Small delay lets the browser register the gesture before .play()
  // This is key for Android Chrome which is stricter than iOS Safari
  setTimeout(() => {
    if (audio) {
      audio.volume = 0.6;
      audio.play()
        .then(() => setPlayingState(true))
        .catch(() => setPlayingState(false));
    }
  }, 80);

  splash.addEventListener('animationend', () => {
    splash.remove();
    window.scrollTo(0, 0);
  }, { once: true });
}

// Also listen for touchstart as a fallback for Android (fires before click)
document.addEventListener('DOMContentLoaded', () => {
  const splash = document.getElementById('splash');
  if (splash) {
    splash.addEventListener('touchstart', (e) => {
      e.preventDefault();
      enterSite();
    }, { passive: false });
  }
});

/* ── MUSIC PLAYER state helpers ── */

function setPlayingState(playing) {
  const playBtn  = document.getElementById('playBtn');
  const playIcon = document.getElementById('playIcon');
  const bars     = document.getElementById('musicBars');
  if (!playBtn) return;
  if (playing) {
    playIcon.textContent = '⏸';
    playBtn.classList.remove('paused');
    bars?.classList.remove('paused');
  } else {
    playIcon.textContent = '▶';
    playBtn.classList.add('paused');
    bars?.classList.add('paused');
  }
}

function toggleMusic() {
  const audio = document.getElementById('bgMusic');
  if (!audio) return;
  if (audio.paused) {
    audio.play().then(() => setPlayingState(true)).catch(() => {});
  } else {
    audio.pause();
    setPlayingState(false);
  }
}

function setVolume(val) {
  const audio = document.getElementById('bgMusic');
  if (audio) audio.volume = parseFloat(val);
  // Update slider gradient fill
  const slider = document.getElementById('volSlider');
  if (slider) {
    const pct = Math.round(parseFloat(val) * 100);
    slider.style.background =
      `linear-gradient(to right, var(--gold) ${pct}%, #ffffff33 ${pct}%)`;
  }
}


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
  const wrapper  = document.getElementById('envelope')?.closest('.envelope-wrapper')
                || document.querySelector('.envelope-wrapper');
  const hint     = document.getElementById('openHint');
  const blessing = document.getElementById('blessing');
  if (!wrapper || wrapper.classList.contains('opened')) return;
  wrapper.classList.add('opened');
  if (hint) hint.style.display = 'none';
  setTimeout(() => { if (blessing) blessing.classList.add('visible'); }, 900);
}

/* ── GENDER REVEAL via confetti only (dress code cards) ── */

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

/* ── RSVP: dynamic WhatsApp message builder ── */
let rsvpCompanion = 'solo';
let rsvpTeam      = null;

function setCompanion(val) {
  rsvpCompanion = val;
  document.getElementById('tog-solo').classList.toggle('active', val === 'solo');
  document.getElementById('tog-con').classList.toggle('active',  val === 'con');
  const field = document.getElementById('companion-field');
  field.style.display = val === 'con' ? 'flex' : 'none';
  buildWhatsApp();
}

function setTeam(val) {
  rsvpTeam = val;
  document.getElementById('tog-boy').classList.toggle('active',  val === 'boy');
  document.getElementById('tog-girl').classList.toggle('active', val === 'girl');
  buildWhatsApp();
}

function buildWhatsApp() {
  const name      = document.getElementById('rsvp-name')?.value.trim();
  const companion = document.getElementById('rsvp-companion')?.value.trim();
  const preview   = document.getElementById('rsvp-preview-text');
  const btn       = document.getElementById('whatsapp-btn');

  // Build message parts
  const hasCom    = rsvpCompanion === 'con' && companion;
  const teamLabel = rsvpTeam === 'boy'  ? 'Team Niño 💙'
                  : rsvpTeam === 'girl' ? 'Team Niña 💗'
                  : null;

  // Build the human-readable preview
  let msg = '';
  if (name) {
    msg += `Mi nombre es ${name}`;
    if (hasCom)    msg += `, y voy con ${companion}`;
    msg += `! `;
    if (teamLabel) msg += `Somos ${teamLabel}. `;
    msg += hasCom ? `Confirmamos nuestra asistencia! 🦁👑`
                  : `Confirmo mi asistencia! 🦁👑`;
  }

  // Update preview box
  if (preview) {
    preview.textContent = msg || 'Completa los campos para ver el mensaje...';
  }

  // Enable/disable button
  const isReady = !!name && !!rsvpTeam;
  if (btn) {
    btn.classList.toggle('ready', isReady);
    if (isReady) {
      btn.href = `https://wa.me/593959819007?text=${encodeURIComponent(msg)}`;
    } else {
      btn.href = '#';
    }
  }
}

function validateRsvp() {
  const name = document.getElementById('rsvp-name')?.value.trim();
  if (!name || !rsvpTeam) {
    // Briefly shake the form to indicate missing fields
    const form = document.querySelector('.rsvp-form');
    form?.classList.add('shake');
    setTimeout(() => form?.classList.remove('shake'), 500);
    return false;
  }
  return true;
}
