/* ============================================================
   TELESCOPE.FYI — ZOOM SCROLL INTRO
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

/* ================================================================
   ZOOM-SCROLL INTRO
   - heroScroll is 500vh tall
   - .hero is sticky (100vh)
   - .hero-zoom starts at scale(6) and eases down to scale(1)
   - Text fades in once scale < 1.25
   - After the hero-scroll section ends, normal scrolling resumes
   ================================================================ */
const heroScroll = document.getElementById('heroScroll');
const heroZoom   = document.getElementById('heroZoom');
const heroCenter = document.getElementById('heroCenter');

const SCALE_START = 6;    // initial zoom level
const SCALE_END   = 1;    // final zoom level
const TEXT_THRESHOLD = 0.78; // progress at which text starts appearing

function easeOutExpo(t) {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

function onScroll() {
  if (!heroScroll || !heroZoom) return;

  const scrollTop   = window.scrollY;
  const sectionTop  = heroScroll.offsetTop;
  const sectionH    = heroScroll.offsetHeight;
  const viewportH   = window.innerHeight;

  // progress: 0 = top of section, 1 = bottom of sticky range
  const raw      = (scrollTop - sectionTop) / (sectionH - viewportH);
  const progress = Math.max(0, Math.min(1, raw));

  // Ease the progress for a smoother feel
  const eased = easeOutExpo(progress);

  // Scale interpolation: SCALE_START → SCALE_END
  const scale = SCALE_START - (SCALE_START - SCALE_END) * eased;
  heroZoom.style.transform = `scale(${scale})`;

  // Text appears near the end of the zoom
  const textProgress = Math.max(0, (progress - TEXT_THRESHOLD) / (1 - TEXT_THRESHOLD));
  heroCenter.style.opacity = textProgress;

  // Blur effect — sharp by end
  const blur = (1 - eased) * 8;
  heroZoom.style.filter = blur > 0.1 ? `blur(${blur}px)` : 'none';
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll(); // run once on load

/* ---- MOUSE PARALLAX on photos (only while hero is in view) ---- */
const photos = document.querySelectorAll('.photo');
let targetX = 0, targetY = 0, curParX = 0, curParY = 0;

document.addEventListener('mousemove', e => {
  targetX = (e.clientX / window.innerWidth  - .5) * 30;
  targetY = (e.clientY / window.innerHeight - .5) * 22;
}, { passive: true });

(function animPhotos() {
  curParX += (targetX - curParX) * .06;
  curParY += (targetY - curParY) * .06;
  photos.forEach(p => {
    const vx = parseFloat(p.dataset.vx || 0);
    const vy = parseFloat(p.dataset.vy || 0);
    p.style.transform = `translate(${curParX * vx}px, ${curParY * vy}px)`;
  });
  requestAnimationFrame(animPhotos);
})();

/* ---- SCROLL REVEAL for sections below hero ---- */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: .12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.scroll-section__inner > *, .how-item, .mini-photo').forEach((el, i) => {
  el.classList.add('reveal');
  el.dataset.d = String((i % 3) + 1);
  revealObs.observe(el);
});

/* ---- SMOOTH ANCHOR SCROLL ---- */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
  });
});

/* ---- HIDE SCROLL INDICATOR after scrolling starts ---- */
const scrollArrow = document.querySelector('.bottom-nav__arrow');
const scrollLabel = document.querySelector('.bottom-nav__scroll');
window.addEventListener('scroll', () => {
  const gone = window.scrollY > 60;
  if (scrollArrow) scrollArrow.style.opacity = gone ? '0' : '1';
  if (scrollLabel) scrollLabel.style.opacity = gone ? '0' : '1';
}, { passive: true });
