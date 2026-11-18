/* =========================================================
   SDN 1 TERKESI — main.js
   ========================================================= */

// Tahun otomatis di footer
document.querySelectorAll('[data-year]').forEach(el => {
  el.textContent = new Date().getFullYear();
});

// Navbar: shadow saat discroll
const navbar = document.querySelector('.navbar');
const backTop = document.querySelector('.back-top');
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (navbar) navbar.classList.toggle('scrolled', y > 10);
  if (backTop) backTop.classList.toggle('show', y > 500);
}, { passive: true });

// Kembali ke atas
if (backTop) {
  backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// Menu mobile
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    navToggle.textContent = open ? '✕' : '☰';
  });
  navLinks.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.textContent = '☰';
    })
  );
}

// Animasi reveal saat scroll
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// Lightbox galeri
const lightbox = document.querySelector('.lightbox');
if (lightbox) {
  const lbImg = lightbox.querySelector('img');
  document.querySelectorAll('.galeri-item').forEach(item => {
    item.addEventListener('click', () => {
      lbImg.src = item.querySelector('img').src;
      lbImg.alt = item.dataset.caption || '';
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });
  lightbox.addEventListener('click', e => {
    if (e.target === lightbox || e.target.classList.contains('lightbox-close')) {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && lightbox.classList.contains('open')) {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
}

// Slider hero: panah + titik + autoslide
(function () {
  const slider = document.querySelector('.hero-slider');
  if (!slider) return;
  const slides = slider.querySelectorAll('.slide');
  const titiks = slider.querySelectorAll('.titik');
  let indeks = 0;
  let timer = null;

  function tampil(i) {
    indeks = (i + slides.length) % slides.length;
    slides.forEach((s, k) => s.classList.toggle('aktif', k === indeks));
    titiks.forEach((t, k) => t.classList.toggle('aktif', k === indeks));
  }

  function mulaiOtomatis() {
    clearInterval(timer);
    timer = setInterval(() => tampil(indeks + 1), 5000);
  }

  // panah
  const prev = slider.querySelector('#slidePrev');
  const next = slider.querySelector('#slideNext');
  if (prev) prev.addEventListener('click', () => { tampil(indeks - 1); mulaiOtomatis(); });
  if (next) next.addEventListener('click', () => { tampil(indeks + 1); mulaiOtomatis(); });

  // klik titik
  titiks.forEach(t => t.addEventListener('click', () => { tampil(+t.dataset.i); mulaiOtomatis(); }));

  // jeda saat kursor di atas gambar (desktop)
  slider.addEventListener('mouseenter', () => clearInterval(timer));
  slider.addEventListener('mouseleave', mulaiOtomatis);

  mulaiOtomatis();
})();

// Form kontak & PPDB: tampilkan pesan sukses (simulasi, tanpa backend)
document.querySelectorAll('form[data-demo]').forEach(form => {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const nama = form.querySelector('input[name="nama"]');
    if (nama && !nama.value.trim()) { nama.focus(); return; }
    const box = form.querySelector('.form-pesan');
    if (box) {
      box.style.display = 'block';
      box.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    form.reset();
  });
});
