/* ───────────────────────────────────────────
   script.js — Portfolio Interactions
─────────────────────────────────────────── */

'use strict';

/* ══════════════════════════════════════════
   AURORA CANVAS
══════════════════════════════════════════ */
(function initAurora() {
  const canvas = document.getElementById('auroraCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, time = 0;
  const waves = [
    { color: [124, 58, 237],  speed: 0.0008, amp: 0.18, phase: 0 },
    { color: [34,  211, 238], speed: 0.0006, amp: 0.14, phase: 2.1 },
    { color: [96,  165, 250], speed: 0.001,  amp: 0.10, phase: 4.2 },
    { color: [244, 114, 182], speed: 0.0007, amp: 0.12, phase: 1.0 },
  ];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    waves.forEach(w => {
      const grad = ctx.createLinearGradient(0, 0, W, H);
      const [r, g, b] = w.color;
      grad.addColorStop(0,   `rgba(${r},${g},${b},0)`);
      grad.addColorStop(0.4, `rgba(${r},${g},${b},0.06)`);
      grad.addColorStop(0.6, `rgba(${r},${g},${b},0.09)`);
      grad.addColorStop(1,   `rgba(${r},${g},${b},0)`);

      ctx.beginPath();
      ctx.moveTo(0, H * 0.5);
      for (let x = 0; x <= W; x += 6) {
        const y = H * 0.5
          + Math.sin(x * 0.003 + time * w.speed * 1000 + w.phase) * H * w.amp
          + Math.sin(x * 0.006 + time * w.speed * 700  + w.phase * 1.3) * H * w.amp * 0.4;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(W, H);
      ctx.lineTo(0, H);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();
    });

    time++;
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  draw();
})();


/* ══════════════════════════════════════════
   PARTICLES
══════════════════════════════════════════ */
(function initParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  const count = 60;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      top:  ${Math.random() * 100}%;
      --dur:   ${4 + Math.random() * 8}s;
      --delay: ${-Math.random() * 8}s;
      width:   ${1 + Math.random() * 2}px;
      height:  ${1 + Math.random() * 2}px;
      opacity: 0;
    `;
    container.appendChild(p);
  }
})();


/* ══════════════════════════════════════════
   MOUSE PARALLAX HERO
══════════════════════════════════════════ */
(function initParallax() {
  const content = document.getElementById('heroContent');
  const blobs = document.querySelectorAll('.blob');
  if (!content) return;

  let mx = 0, my = 0;
  let cx = 0, cy = 0;
  let raf;

  function lerp(a, b, t) { return a + (b - a) * t; }

  function animate() {
    cx = lerp(cx, mx, 0.06);
    cy = lerp(cy, my, 0.06);
    content.style.transform = `translate(${cx * 8}px, ${cy * 6}px)`;
    blobs.forEach((b, i) => {
      const factor = (i + 1) * 12;
      b.style.transform = `translate(${cx * factor}px, ${cy * factor * 0.7}px)`;
    });
    raf = requestAnimationFrame(animate);
  }

  window.addEventListener('mousemove', e => {
    mx = (e.clientX / window.innerWidth  - 0.5);
    my = (e.clientY / window.innerHeight - 0.5);
  });

  animate();
})();


/* ══════════════════════════════════════════
   ROLE CYCLE
══════════════════════════════════════════ */
(function initRoleCycle() {
  const words = document.querySelectorAll('.role-word');
  if (!words.length) return;
  let current = 0;

  function cycle() {
    words[current].classList.remove('active');
    words[current].classList.add('exit');

    setTimeout(() => {
      words[current].classList.remove('exit');
      current = (current + 1) % words.length;
      words[current].classList.add('active');
    }, 500);
  }

  setInterval(cycle, 3000);
})();


/* ══════════════════════════════════════════
   NAV SCROLL
══════════════════════════════════════════ */
(function initNav() {
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
})();


/* ══════════════════════════════════════════
   HAMBURGER MENU
══════════════════════════════════════════ */
(function initHamburger() {
  const btn  = document.getElementById('hamburger');
  const menu = document.getElementById('mobileMenu');
  const links = document.querySelectorAll('.mob-link');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    menu.classList.toggle('open');
    document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
  });

  links.forEach(l => l.addEventListener('click', () => {
    menu.classList.remove('open');
    document.body.style.overflow = '';
  }));
})();


/* ══════════════════════════════════════════
   SCROLL REVEAL
══════════════════════════════════════════ */
(function initReveal() {
  const selectors = ['.reveal-up', '.reveal-fade', '.reveal-left', '.reveal-right'];
  const targets = document.querySelectorAll(selectors.join(','));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger siblings in a grid
        const siblings = Array.from(entry.target.parentElement.children)
          .filter(el => el.classList.contains('reveal-up') || el.classList.contains('reveal-left') || el.classList.contains('reveal-right'));
        const idx = siblings.indexOf(entry.target);
        entry.target.style.transitionDelay = `${idx * 80}ms`;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  targets.forEach(t => observer.observe(t));
})();


/* ══════════════════════════════════════════
   ANIMATED COUNTERS
══════════════════════════════════════════ */
(function initCounters() {
  const nums = document.querySelectorAll('.stat-num');
  if (!nums.length) return;

  function animateCounter(el) {
    const target  = parseFloat(el.dataset.target);
    const decimal = parseInt(el.dataset.decimal || '0');
    const suffix  = el.dataset.suffix || '';
    const unit    = el.nextElementSibling && el.nextElementSibling.classList.contains('stat-unit')
                    ? el.nextElementSibling.textContent : '';
    const duration = 1800;
    const start    = performance.now();

    function update(now) {
      const progress = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 4);
      const val  = (target * ease);
      el.textContent = val.toFixed(decimal) + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  nums.forEach(n => observer.observe(n));
})();


/* ══════════════════════════════════════════
   SKILL TABS + PROGRESS BARS
══════════════════════════════════════════ */
(function initSkillTabs() {
  const tabs  = document.querySelectorAll('.tab-btn');
  const panels = document.querySelectorAll('.skills-panel');

  function activateTab(id) {
    tabs.forEach(t => t.classList.remove('active'));
    panels.forEach(p => p.classList.remove('active'));
    document.querySelector(`[data-tab="${id}"]`).classList.add('active');
    const panel = document.getElementById(`tab-${id}`);
    if (panel) {
      panel.classList.add('active');
      triggerBars(panel);
    }
  }

  function triggerBars(panel) {
    panel.querySelectorAll('.skill-orb').forEach((orb, i) => {
      setTimeout(() => {
        orb.classList.add('visible');
      }, i * 80);
    });
  }

  tabs.forEach(t => {
    t.addEventListener('click', () => activateTab(t.dataset.tab));
  });

  // Trigger bars for initially active panel
  const activePanel = document.querySelector('.skills-panel.active');
  if (activePanel) {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        triggerBars(activePanel);
        observer.disconnect();
      }
    }, { threshold: 0.3 });
    observer.observe(activePanel);
  }
})();


/* ══════════════════════════════════════════
   3D TILT on PROJECT CARDS
══════════════════════════════════════════ */
(function initTilt() {
  const cards = document.querySelectorAll('.project-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const cx   = rect.left + rect.width  / 2;
      const cy   = rect.top  + rect.height / 2;
      const dx   = (e.clientX - cx) / (rect.width  / 2);
      const dy   = (e.clientY - cy) / (rect.height / 2);
      card.style.transform = `
        translateY(-8px)
        rotateX(${-dy * 4}deg)
        rotateY(${dx  * 4}deg)
      `;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.6s cubic-bezier(0.23,1,0.32,1)';
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.15s ease';
    });
  });
})();


/* ══════════════════════════════════════════
   SMOOTH SCROLL for anchor links
══════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});


/* ══════════════════════════════════════════
   HERO reveal on load
══════════════════════════════════════════ */
window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    document.querySelectorAll('.hero .reveal-fade').forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), 800 + i * 150);
    });
  }, 200);
});


/* ══════════════════════════════════════════
   CURSOR GLOW (desktop)
══════════════════════════════════════════ */
(function initCursorGlow() {
  if (window.matchMedia('(pointer: coarse)').matches) return; // skip touch devices

  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed;
    top: 0; left: 0;
    width: 350px; height: 350px;
    pointer-events: none;
    z-index: 0;
    background: radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%);
    transform: translate(-50%, -50%);
    transition: opacity 0.3s;
    border-radius: 50%;
    will-change: transform;
  `;
  document.body.appendChild(glow);

  let gx = 0, gy = 0, tx = 0, ty = 0;

  window.addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; });

  (function loop() {
    gx += (tx - gx) * 0.08;
    gy += (ty - gy) * 0.08;
    glow.style.transform = `translate(${gx - 175}px, ${gy - 175}px)`;
    requestAnimationFrame(loop);
  })();
})();
