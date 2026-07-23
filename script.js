/**
 * Pinky Bakery · Fan-Made Website
 * script.js — Interactions & Animations
 */

'use strict';

/* ──────────────────────────────────────────────────────────
   1. Navbar & Back To Top Setup
   ────────────────────────────────────────────────────────── */
const navbar     = document.getElementById('navbar');
const hamburger  = document.getElementById('hamburger');
const navLinks   = document.getElementById('navLinks');
const allLinks   = navLinks ? navLinks.querySelectorAll('.nav-link') : [];
const backToTop  = document.getElementById('backToTop'); // ID matches HTML element

function toggleBackToTop() {
  if (backToTop) {
    backToTop.hidden = window.scrollY < 400;
  }
}

// Shrink navbar & toggle Back To Top on scroll
window.addEventListener('scroll', () => {
  if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 60);
  toggleBackToTop();
}, { passive: true });

if (backToTop) {
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Hamburger toggle
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close mobile nav on link click
  navLinks.addEventListener('click', (e) => {
    if (e.target.classList.contains('nav-link')) {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
}

// Active nav link on scroll
const sections = document.querySelectorAll('section[id], .hero');
const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      allLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { threshold: 0.35 });

sections.forEach(sec => navObserver.observe(sec));


/* ──────────────────────────────────────────────────────────
   2. Hero Typing Effect
   ────────────────────────────────────────────────────────── */
const typingEl  = document.getElementById('heroTyping');
const phrases   = [
  'Freshly Baked Happiness Every Day',
  'Cakes · Pastries · Snacks · More',
  'Your Favourite Bakery in Khategaon'
];

let phraseIndex = 0;
let charIndex   = 0;
let isDeleting  = false;
let typingTimer;

function typeLoop() {
  if (!typingEl) return;
  const current = phrases[phraseIndex];

  if (!isDeleting) {
    charIndex++;
  } else {
    charIndex--;
  }

  typingEl.textContent = current.slice(0, charIndex);

  let delay = isDeleting ? 42 : 70;

  if (!isDeleting && charIndex === current.length) {
    delay = 2400;   // pause at end
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    delay = 400;
  }

  typingTimer = setTimeout(typeLoop, delay);
}

if (typingEl) setTimeout(typeLoop, 600);


/* ──────────────────────────────────────────────────────────
   3. Scroll Reveal Animations
   ────────────────────────────────────────────────────────── */
const revealEls = document.querySelectorAll(
  '.reveal-up, .reveal-left, .reveal-right, .reveal-fade'
);

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => revealObserver.observe(el));


/* ──────────────────────────────────────────────────────────
   4. Counter Animation (Hero Stats)
   ────────────────────────────────────────────────────────── */
const counterEls = document.querySelectorAll('.stat-num[data-target]');

function animateCounter(el) {
  const target  = parseInt(el.dataset.target, 10);
  const duration = 1600; // ms
  const step     = 16;   // ~60fps
  const increment = Math.ceil((target / (duration / step)));
  let current = 0;

  const tick = () => {
    current = Math.min(current + increment, target);
    el.textContent = current.toLocaleString('en-IN');
    if (current < target) requestAnimationFrame(tick);
  };

  tick();
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      counterEls.forEach(el => animateCounter(el));
      counterObserver.disconnect();
    }
  });
}, { threshold: 0.5 });

const statsBlock = document.querySelector('.hero-stats');
if (statsBlock) counterObserver.observe(statsBlock);


/* ──────────────────────────────────────────────────────────
   5. Menu Category Filter
   ────────────────────────────────────────────────────────── */
const tabBtns   = document.querySelectorAll('.tab-btn');
const menuCards = document.querySelectorAll('.menu-card');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const cat = btn.dataset.cat;

    tabBtns.forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');

    menuCards.forEach(card => {
      const match = cat === 'all' || card.dataset.cat === cat;
      card.classList.toggle('hidden', !match);

      if (match) {
        card.classList.remove('revealed');
        requestAnimationFrame(() => {
          setTimeout(() => card.classList.add('revealed'), 20);
        });
      }
    });
  });
});

menuCards.forEach(card => card.classList.add('revealed'));


/* ──────────────────────────────────────────────────────────
   6. Gallery Lightbox
   ────────────────────────────────────────────────────────── */
const galleryItems = document.querySelectorAll('.gallery-item');
const lightbox     = document.getElementById('lightbox');
const lightboxImg  = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');

const galleryBgs = [
  'linear-gradient(135deg, #ff9ab5, #ff4f87, #c4294e)',
  'linear-gradient(135deg, #ffe8a3, #f5c842, #e8a820)',
  'linear-gradient(135deg, #6b3226, #2d0f05, #4a1a0d)',
  'linear-gradient(135deg, #ffd0e8, #ff80c0, #d04090)',
  'linear-gradient(135deg, #f5dba8, #c4772e, #8a5015)',
  'linear-gradient(135deg, #d4965a, #8a5015, #5a2e05)',
  'linear-gradient(135deg, #ffb870, #e07020, #a04010)',
  'linear-gradient(135deg, #c8a868, #7a5010, #3a2005)'
];

const galleryLabels = [
  '🎂 Celebration Cakes',
  '🍰 Layered Pastries',
  '🍫 Chocolate Delights',
  '🌸 Rose Specials',
  '🥐 Morning Croissants',
  '🍪 Cookie Selection',
  '🌮 Savoury Bakes',
  '☕ Café Classics'
];

let currentLbIdx = 0;

function openLightbox(idx) {
  if (!lightbox || !lightboxImg) return;
  currentLbIdx = idx;
  lightboxImg.style.background = galleryBgs[idx];
  lightboxImg.setAttribute('aria-label', galleryLabels[idx]);
  lightbox.hidden = false;
  document.body.style.overflow = 'hidden';
  if (lightboxClose) lightboxClose.focus();
}

function closeLightbox() {
  if (!lightbox) return;
  lightbox.hidden = true;
  document.body.style.overflow = '';
  if (galleryItems[currentLbIdx]) galleryItems[currentLbIdx].focus();
}

function showLbImage(idx) {
  if (!lightboxImg) return;
  currentLbIdx = (idx + galleryBgs.length) % galleryBgs.length;
  lightboxImg.style.animation = 'none';
  requestAnimationFrame(() => {
    lightboxImg.style.animation = '';
    lightboxImg.style.background = galleryBgs[currentLbIdx];
  });
}

galleryItems.forEach((item, i) => {
  item.addEventListener('click', () => openLightbox(i));
  item.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(i); }
  });
});

if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
if (lightboxPrev) lightboxPrev.addEventListener('click', () => showLbImage(currentLbIdx - 1));
if (lightboxNext) lightboxNext.addEventListener('click', () => showLbImage(currentLbIdx + 1));

if (lightbox) {
  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });
}

document.addEventListener('keydown', e => {
  if (!lightbox || lightbox.hidden) return;
  if (e.key === 'Escape')     closeLightbox();
  if (e.key === 'ArrowLeft')  showLbImage(currentLbIdx - 1);
  if (e.key === 'ArrowRight') showLbImage(currentLbIdx + 1);
});


/* ──────────────────────────────────────────────────────────
   7. Testimonials Carousel
   ────────────────────────────────────────────────────────── */
const track    = document.getElementById('testimonialsTrack');
const dotsWrap = document.getElementById('testiDots');
const cards    = track ? track.querySelectorAll('.testimonial-card') : [];

let currentSlide = 0;
let slidesPerView = getSlidesPerView();
let totalSlides   = cards.length ? Math.ceil(cards.length / slidesPerView) : 0;
let autoplayTimer;

function getSlidesPerView() {
  return window.innerWidth < 700 ? 1 : (window.innerWidth < 1000 ? 2 : 3);
}

function buildDots() {
  if (!dotsWrap) return;
  dotsWrap.innerHTML = '';
  for (let i = 0; i < totalSlides; i++) {
    const dot = document.createElement('button');
    dot.className = 'testi-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', `Review slide ${i + 1}`);
    dot.addEventListener('click', () => goToSlide(i));
    dotsWrap.appendChild(dot);
  }
}

function updateDots() {
  if (!dotsWrap) return;
  dotsWrap.querySelectorAll('.testi-dot').forEach((d, i) => {
    d.classList.toggle('active', i === currentSlide);
  });
}

function goToSlide(idx) {
  if (!track || !cards.length) return;
  currentSlide = (idx + totalSlides) % totalSlides;
  const cardWidth = cards[0].offsetWidth + 24;
  track.style.transform = `translateX(-${currentSlide * slidesPerView * cardWidth}px)`;
  updateDots();
  resetAutoplay();
}

function nextSlide() {
  goToSlide(currentSlide + 1);
}

function resetAutoplay() {
  clearInterval(autoplayTimer);
  if (cards.length) autoplayTimer = setInterval(nextSlide, 5000);
}

// Touch / swipe support
if (track) {
  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) goToSlide(currentSlide + (diff > 0 ? 1 : -1));
  });
}

window.addEventListener('resize', () => {
  if (!cards.length) return;
  slidesPerView = getSlidesPerView();
  totalSlides   = Math.ceil(cards.length / slidesPerView);
  currentSlide  = 0;
  buildDots();
  goToSlide(0);
}, { passive: true });

if (cards.length) {
  buildDots();
  resetAutoplay();
}


/* ──────────────────────────────────────────────────────────
   8. Button Ripple Effect
   ────────────────────────────────────────────────────────── */
document.querySelectorAll('.ripple-btn').forEach(btn => {
  btn.addEventListener('click', function (e) {
    const rect   = this.getBoundingClientRect();
    const size   = Math.max(rect.width, rect.height) * 2;
    const x      = e.clientX - rect.left - size / 2;
    const y      = e.clientY - rect.top  - size / 2;

    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
    `;

    this.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  });
});


/* ──────────────────────────────────────────────────────────
   9. Smooth Scroll (polyfill for anchor links)
   ────────────────────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', function (e) {
    const id  = this.getAttribute('href').slice(1);
    const el  = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    const offset = navbar ? navbar.offsetHeight + 8 : 8;
    const top    = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});


/* ──────────────────────────────────────────────────────────
   10. Parallax Floating Decorations
   ────────────────────────────────────────────────────────── */
const decos = document.querySelectorAll('.hero-deco');

document.addEventListener('mousemove', e => {
  const cx = window.innerWidth  / 2;
  const cy = window.innerHeight / 2;
  const dx = (e.clientX - cx) / cx;
  const dy = (e.clientY - cy) / cy;

  decos.forEach((deco, i) => {
    const factor = (i % 3 + 1) * 6;
    const sign   = i % 2 === 0 ? 1 : -1;
    deco.style.transform = `translate(${dx * factor * sign}px, ${dy * factor}px)`;
  });
}, { passive: true });


/* ──────────────────────────────────────────────────────────
   11. Page Load — Reveal & Mandatory Formspree Popup
   ────────────────────────────────────────────────────────── */
window.addEventListener('DOMContentLoaded', () => {
  // Stagger hero children
  const heroRevealEls = document.querySelectorAll('.hero .reveal-fade');
  heroRevealEls.forEach((el, i) => {
    setTimeout(() => el.classList.add('revealed'), 300 + i * 180);
  });

  // --- Mandatory Formspree Popup Logic ---
  const popupOverlay     = document.getElementById("mandatory-popup");
  const mandatoryForm    = document.getElementById("mandatory-form");
  const visitorNameInput = document.getElementById("visitor-name");
  const submitBtn        = document.getElementById("submit-btn");

  if (popupOverlay && mandatoryForm) {
    const hasVisitedBefore = localStorage.getItem("portfolio_visitor_name");

    if (!hasVisitedBefore) {
      popupOverlay.style.display = "flex";
    }

    mandatoryForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const nameVal = visitorNameInput ? visitorNameInput.value.trim() : "";
      if (!nameVal) return;

      if (submitBtn) {
        submitBtn.textContent = "Submitting...";
        submitBtn.disabled = true;
      }

      const formData = new FormData(mandatoryForm);

      try {
        const response = await fetch(mandatoryForm.action, {
          method: "POST",
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          localStorage.setItem("portfolio_visitor_name", nameVal);
          popupOverlay.style.display = "none";
        } else {
          alert("Something went wrong. Please try again.");
          if (submitBtn) {
            submitBtn.textContent = "Submit";
            submitBtn.disabled = false;
          }
        }
      } catch (error) {
        alert("Network error. Please check your connection.");
        if (submitBtn) {
          submitBtn.textContent = "Submit";
          submitBtn.disabled = false;
        }
      }
    });
  }
});
