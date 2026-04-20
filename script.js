/* ===== CURSOR ===== */
const cursorDot  = document.createElement('div');
const cursorRing = document.createElement('div');
cursorDot.className  = 'cursor-dot';
cursorRing.className = 'cursor-ring';
document.body.append(cursorDot, cursorRing);

let mouseX = 0, mouseY = 0;
let ringX  = 0, ringY  = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorDot.style.left = mouseX + 'px';
  cursorDot.style.top  = mouseY + 'px';
});

(function animateRing() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top  = ringY + 'px';
  requestAnimationFrame(animateRing);
})();

document.querySelectorAll('a, button, .slide, .step, .creator-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursorRing.style.width  = '60px';
    cursorRing.style.height = '60px';
    cursorRing.style.background = 'rgba(227,247,148,0.15)';
    cursorRing.style.borderColor = 'var(--accent)';
  });
  el.addEventListener('mouseleave', () => {
    cursorRing.style.width  = '40px';
    cursorRing.style.height = '40px';
    cursorRing.style.background = 'transparent';
    cursorRing.style.borderColor = 'var(--dark)';
  });
});

/* ===== MOUSE TRAIL ===== */
const TRAIL_COUNT = 12;
const trails = [];
for (let i = 0; i < TRAIL_COUNT; i++) {
  const d = document.createElement('div');
  d.className = 'trail-dot';
  document.getElementById('mouseTrail').appendChild(d);
  trails.push({ el: d, x: 0, y: 0 });
}

const trailPositions = Array(TRAIL_COUNT).fill({ x: 0, y: 0 });
document.addEventListener('mousemove', e => {
  trailPositions.unshift({ x: e.clientX, y: e.clientY });
  trailPositions.pop();
});

(function animateTrail() {
  trailPositions.forEach((pos, i) => {
    const t = trails[i];
    if (!t) return;
    t.el.style.left    = pos.x + 'px';
    t.el.style.top     = pos.y + 'px';
    t.el.style.opacity = (1 - i / TRAIL_COUNT) * 0.5;
    t.el.style.transform = `translate(-50%,-50%) scale(${1 - i * 0.05})`;
  });
  requestAnimationFrame(animateTrail);
})();

/* ===== NAV SCROLL ===== */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
});

/* ===== MOBILE MENU ===== */
const burger   = document.getElementById('navBurger');
const mobileMenu = document.getElementById('mobileMenu');
let menuOpen = false;

burger.addEventListener('click', () => {
  menuOpen = !menuOpen;
  mobileMenu.classList.toggle('open', menuOpen);
  burger.querySelectorAll('span')[0].style.transform = menuOpen ? 'rotate(45deg) translate(5px,5px)' : '';
  burger.querySelectorAll('span')[1].style.transform = menuOpen ? 'rotate(-45deg) translate(4px,-4px)' : '';
});

mobileMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    menuOpen = false;
    mobileMenu.classList.remove('open');
    burger.querySelectorAll('span').forEach(s => s.style.transform = '');
  });
});

/* ===== SCROLL REVEAL ===== */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const delay = el.dataset.delay ? parseInt(el.dataset.delay) : 0;
      setTimeout(() => el.classList.add('visible'), delay);
      revealObserver.unobserve(el);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal-text, .reveal-item').forEach(el => {
  revealObserver.observe(el);
});

/* ===== PARALLAX ===== */
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  document.querySelectorAll('.parallax-text').forEach(el => {
    const speed = parseFloat(el.dataset.speed || 0.2);
    el.style.transform = `translateY(${scrollY * speed * -0.3}px)`;
  });

  const bgText = document.querySelector('.hero__bg-text');
  if (bgText) {
    bgText.style.transform = `translate(-50%, calc(-50% + ${scrollY * 0.15}px))`;
  }
});

/* ===== SLIDER ===== */
const slider    = document.getElementById('slider');
const dotsWrap  = document.getElementById('sliderDots');
const prevBtn   = document.getElementById('prevBtn');
const nextBtn   = document.getElementById('nextBtn');
const slides    = document.querySelectorAll('.slide');
let current     = 0;

slides.forEach((_, i) => {
  const dot = document.createElement('div');
  dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
  dot.addEventListener('click', () => goToSlide(i));
  dotsWrap.appendChild(dot);
});

function goToSlide(index) {
  current = (index + slides.length) % slides.length;
  const cardW  = 300 + 24;
  slider.scrollTo({ left: current * cardW, behavior: 'smooth' });
  document.querySelectorAll('.slider-dot').forEach((d, i) => {
    d.classList.toggle('active', i === current);
  });
}

prevBtn.addEventListener('click', () => goToSlide(current - 1));
nextBtn.addEventListener('click', () => goToSlide(current + 1));

// Auto-advance
let sliderTimer = setInterval(() => goToSlide(current + 1), 4000);
slider.addEventListener('mouseenter', () => clearInterval(sliderTimer));
slider.addEventListener('mouseleave', () => {
  sliderTimer = setInterval(() => goToSlide(current + 1), 4000);
});

/* ===== HERO ORBIT INTERACTION ===== */
const heroCircle = document.getElementById('heroCircle');
if (heroCircle) {
  let angle = 0;
  (function rotateCards() {
    angle += 0.2;
    const cards = heroCircle.querySelectorAll('.circle-card');
    cards.forEach((card, i) => {
      const theta = (angle + i * (360 / cards.length)) * (Math.PI / 180);
      const r = 150;
      const x = Math.cos(theta) * r;
      const y = Math.sin(theta) * r;
      card.style.position  = 'absolute';
      card.style.left      = `calc(50% + ${x}px)`;
      card.style.top       = `calc(50% + ${y}px)`;
      card.style.transform = 'translate(-50%, -50%)';
    });
    requestAnimationFrame(rotateCards);
  })();
}

/* ===== SMOOTH SCROLL FOR ANCHOR LINKS ===== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ===== NUMBER COUNTER ANIMATION ===== */
function animateCounters() {
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count);
    let current  = 0;
    const step   = target / 60;
    const timer  = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = Math.floor(current).toLocaleString();
      if (current >= target) clearInterval(timer);
    }, 16);
  });
}

const statsObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounters();
      statsObserver.disconnect();
    }
  });
}, { threshold: 0.5 });

const ctaSection = document.querySelector('.cta-section');
if (ctaSection) statsObserver.observe(ctaSection);

/* ===== PAGE LOAD ANIMATION ===== */
window.addEventListener('load', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.6s ease';
  requestAnimationFrame(() => {
    document.body.style.opacity = '1';
  });

  // Stagger hero content
  const heroItems = document.querySelectorAll('.hero__tag, .hero__headline, .hero__sub, .hero__actions');
  heroItems.forEach((el, i) => {
    el.style.opacity    = '0';
    el.style.transform  = 'translateY(24px)';
    el.style.transition = `opacity 0.7s ease ${i * 0.12}s, transform 0.7s ease ${i * 0.12}s`;
    setTimeout(() => {
      el.style.opacity   = '1';
      el.style.transform = 'translateY(0)';
    }, 200 + i * 120);
  });
});
