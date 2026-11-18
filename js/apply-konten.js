/* =========================================================
   SDN 1 TERKESI — Penerapan konten dari localStorage
   ========================================================= */
(function () {
  let data = null;
  try {
    data = JSON.parse(localStorage.getItem("konten_sdn1terkesi") || "null");
  } catch (e) { /* abaikan */ }
  if (!data) return;

  const q = (sel) => document.querySelector(sel);
  const qa = (sel) => document.querySelectorAll(sel);
  const setText = (sel, txt) => { const el = q(sel); if (el && txt) el.textContent = txt; };

  // ----- Identitas -----
  if (data.identitas) {
    setText(".brand-name", data.identitas.namaSekolah);
    setText(".brand-tag", data.identitas.tagline);
  }

  // ----- Hero (hanya beranda) -----
  if (data.hero && q(".hero-title")) {
    q(".hero-title").innerHTML =
      `${data.hero.judul1} <em>${data.hero.judul2}</em> ${data.hero.judul3}`;
    setText(".hero-desc", data.hero.deskripsi);
    const img = q(".hero-figure img");
    if (img && data.hero.foto) img.src = data.hero.foto;
  }

  // ----- Kepala sekolah (beranda) -----
  if (data.kepalaSekolah && q(".ttd-kepala b")) {
    setText(".ttd-kepala b", data.kepalaSekolah.nama);
    const img = q(".kepala-foto img");
    if (img && data.kepalaSekolah.foto) img.src = data.kepalaSekolah.foto;
  }

  // ----- Berita (beranda) -----
  if (data.berita && q(".berita-card")) {
    const cards = qa(".berita-card");
    const news = data.berita;
    for (let i = 0; i < cards.length && i < news.length; i++) {
      const c = cards[i], b = news[i];
      const h = c.querySelector("h3");
      const dNum = c.querySelector(".berita-tanggal b");
      const dTxt = c.querySelector(".berita-tanggal small");
      const k = c.querySelector(".berita-kategori");
      const p = c.querySelector(".berita-body p");
      if (h) h.textContent = b.judul;
      if (dNum && dTxt) {
        const bagi = String(b.tanggal).split(" ");
        dNum.textContent = bagi[0] || "";
        dTxt.textContent = bagi.slice(1).join(" ") || "";
      }
      if (k) k.textContent = b.kategori;
      if (p) p.textContent = b.ringkasan;
    }
  }
})();
