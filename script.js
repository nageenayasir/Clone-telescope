/* ============================================================
   TELESCOPE.FYI CLONE — script.js
   ============================================================ */

/* ---- CURSOR ---- */
const cursor     = document.getElementById('cursor');
const cursorRing = document.getElementById('cursorRing');
let mx = -200, my = -200, rx = -200, ry = -200;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top  = my + 'px';
}, { passive: true });

(function followRing() {
  rx += (mx - rx) * .1;
  ry += (my - ry) * .1;
  cursorRing.style.left = rx + 'px';
  cursorRing.style.top  = ry + 'px';
  requestAnimationFrame(followRing);
})();

document.querySelectorAll('a, button, .how-item').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('on-link'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('on-link'));
});

/* ---- PARALLAX PHOTOS on mouse move ---- */
const photos = document.querySelectorAll('.photo');
let targetX = 0, targetY = 0, currentX = 0, currentY = 0;

document.addEventListener('mousemove', e => {
  targetX = (e.clientX / window.innerWidth  - .5) * 28;
  targetY = (e.clientY / window.innerHeight - .5) * 20;
}, { passive: true });

(function animPhotos() {
  currentX += (targetX - currentX) * .06;
  currentY += (targetY - currentY) * .06;

  photos.forEach(photo => {
    const vx = parseFloat(photo.dataset.vx || 0);
    const vy = parseFloat(photo.dataset.vy || 0);
    photo.style.transform = `translate(${currentX * vx}px, ${currentY * vy}px)`;
  });
  requestAnimationFrame(animPhotos);
})();

/* ---- SCROLL REVEAL ---- */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: .12, rootMargin: '0px 0px -50px 0px' });

// Mark reveal targets
const revealSelectors = [
  '.scroll-section__inner > *',
  '.how-item',
  '.mini-photo',
];
revealSelectors.forEach(sel => {
  document.querySelectorAll(sel).forEach((el, i) => {
    el.classList.add('reveal');
    el.dataset.d = String((i % 3) + 1);
    revealObs.observe(el);
  });
});

/* ---- HERO HEADLINE entrance ---- */
const line1 = document.getElementById('heroLine1');
const line2 = document.getElementById('heroLine2');
if (line1 && line2) {
  [line1, line2].forEach((el, i) => {
    el.style.opacity   = '0';
    el.style.transform = 'translateY(22px)';
    el.style.transition = `opacity .9s cubic-bezier(.16,1,.3,1) ${.2 + i * .18}s,
                            transform .9s cubic-bezier(.16,1,.3,1) ${.2 + i * .18}s`;
  });
  window.addEventListener('load', () => {
    [line1, line2].forEach(el => {
      el.style.opacity   = '1';
      el.style.transform = 'translateY(0)';
    });
  });
}

/* ---- SMOOTH ANCHOR SCROLL ---- */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

/* ---- HIDE SCROLL INDICATOR AFTER SCROLL ---- */
const arrow = document.querySelector('.bottom-nav__arrow');
const scrollLabel = document.querySelector('.bottom-nav__scroll');
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY > 80;
  if (arrow)      arrow.style.opacity      = scrolled ? '0' : '1';
  if (scrollLabel) scrollLabel.style.opacity = scrolled ? '0' : '1';
}, { passive: true });
