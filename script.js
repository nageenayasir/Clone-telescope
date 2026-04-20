/* ===== HERO LINE WRAP ===== */
document.querySelectorAll('.hero__line').forEach(line => {
  const text = line.innerHTML;
  line.innerHTML = `<span class="hero__line-inner">${text}</span>`;
});

/* ===== CURSOR ===== */
const cursor   = document.getElementById('cursor');
const follower = document.getElementById('cursorFollower');
let mx = -100, my = -100;
let fx = -100, fy = -100;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top  = my + 'px';
});

(function animFollower() {
  fx += (mx - fx) * .1;
  fy += (my - fy) * .1;
  follower.style.left = fx + 'px';
  follower.style.top  = fy + 'px';
  requestAnimationFrame(animFollower);
})();

document.querySelectorAll('a, button, .dslide, .how__step, .curator, .pill').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});

/* ===== NAV SCROLL ===== */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

/* ===== MOBILE TOGGLE ===== */
const toggle = document.getElementById('navToggle');
let mobileOpen = false;
if (toggle) {
  toggle.addEventListener('click', () => {
    mobileOpen = !mobileOpen;
    const spans = toggle.querySelectorAll('span');
    spans[0].style.transform = mobileOpen ? 'rotate(45deg) translate(4px, 4px)'  : '';
    spans[1].style.transform = mobileOpen ? 'rotate(-45deg) translate(3px, -3px)' : '';
  });
}

/* ===== SCROLL REVEAL ===== */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: .12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

/* ===== DISCOVER SLIDER ===== */
const slider  = document.getElementById('discoverSlider');
const dotsWrap = document.getElementById('dDots');
const prevBtn  = document.getElementById('dPrev');
const nextBtn  = document.getElementById('dNext');
const slides   = document.querySelectorAll('.dslide');
let current    = 0;

slides.forEach((_, i) => {
  const d = document.createElement('div');
  d.className = 'dnav-dot' + (i === 0 ? ' active' : '');
  d.addEventListener('click', () => goTo(i));
  dotsWrap.appendChild(d);
});

function goTo(idx) {
  current = ((idx % slides.length) + slides.length) % slides.length;
  slider.scrollTo({ left: current * (260 + 20), behavior: 'smooth' });
  document.querySelectorAll('.dnav-dot').forEach((d, i) =>
    d.classList.toggle('active', i === current)
  );
}

prevBtn.addEventListener('click', () => goTo(current - 1));
nextBtn.addEventListener('click', () => goTo(current + 1));

let autoSlide = setInterval(() => goTo(current + 1), 3800);
slider.addEventListener('mouseenter', () => clearInterval(autoSlide));
slider.addEventListener('mouseleave', () => { autoSlide = setInterval(() => goTo(current + 1), 3800); });

/* ===== SMOOTH ANCHOR SCROLL ===== */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
  });
});

/* ===== PARALLAX HERO BG TEXT ===== */
window.addEventListener('scroll', () => {
  const hero = document.querySelector('.hero__visual');
  if (hero) {
    hero.style.transform = `translateY(calc(-50% + ${window.scrollY * 0.12}px))`;
  }
}, { passive: true });

/* ===== ADD REVEAL CLASSES TO SECTIONS ===== */
[
  '.discover__header',
  '.discover__slider',
  '.statement__left',
  '.statement__right',
  '.how__header',
  '.how__step',
  '.curators__header',
  '.curator',
  '.cta__badge',
  '.cta__title',
  '.cta__sub',
  '.cta__btns',
].forEach((sel, si) => {
  document.querySelectorAll(sel).forEach((el, i) => {
    el.classList.add('reveal');
    el.dataset.delay = String(i % 3 + 1);
  });
});
