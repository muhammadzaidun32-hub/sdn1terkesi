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

// Slider hero geser: selalu maju ke kiri (loop mulus, tidak pernah mundur)
(function () {
  const track = document.getElementById('slideTrack');
  const realSlides = track ? track.querySelectorAll('.slide') : [];
  const titiks = document.querySelectorAll('.slide-kendali .titik');
  if (!track || !realSlides.length || !titiks.length) return;

  const JUMLAH = realSlides.length;           // 5 slide asli
  // klon slide pertama ditempel di akhir → loop terasa terus ke kiri
  const klon = realSlides[0].cloneNode(true);
  klon.setAttribute('aria-hidden', 'true');
  track.appendChild(klon);

  let indeks = 0;
  let timer = null;

  function geser(persen, animasi) {
    track.style.transition = animasi ? '' : 'none';
    track.style.transform = 'translateX(-' + persen + '%)';
    if (!animasi) { void track.offsetWidth; track.style.transition = ''; }
  }

  function tampil(i) {
    let pos = i;
    indeks = ((i % JUMLAH) + JUMLAH) % JUMLAH;
    titiks.forEach((t, k) => t.classList.toggle('aktif', k === indeks));

    if (pos >= JUMLAH) {
      // maju ke klon (slide kiri lanjut), lalu diam-diam kembali ke awal
      geser(pos * 100, true);
      setTimeout(() => geser(0, false), 850);
    } else {
      geser(pos * 100, true);
    }
  }

  function maju() { tampil(indeks + 1); }

  function mulaiOtomatis() {
    clearInterval(timer);
    timer = setInterval(maju, 5000);
  }

  const prev = document.getElementById('slidePrev');
  const next = document.getElementById('slideNext');

  if (next) next.addEventListener('click', () => { maju(); mulaiOtomatis(); });
  if (prev) prev.addEventListener('click', () => {
    if (indeks === 0) {
      // lompat diam-diam ke klon (posisi akhir), lalu maju normal
      geser(JUMLAH * 100, false);
      indeks = JUMLAH - 1;
      titiks.forEach((t, k) => t.classList.toggle('aktif', k === indeks));
      geser(indeks * 100, true);
    } else {
      tampil(indeks - 1);
    }
    mulaiOtomatis();
  });

  titiks.forEach(t => t.addEventListener('click', () => { tampil(+t.dataset.i); mulaiOtomatis(); }));

  document.querySelector('.hero').addEventListener('mouseenter', () => clearInterval(timer));
  document.querySelector('.hero').addEventListener('mouseleave', mulaiOtomatis);

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
