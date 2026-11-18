/* =========================================================
   SDN 1 TERKESI — admin.js
   Editor konten lengkap. Semua foto memakai LINK (URL),
   bukan upload — agar website tetap ringan.
   ========================================================= */
(function () {
  const $ = (id) => document.getElementById(id);
  const d = window.SITE ? window.SITE.get() : {};

  /* ---------- elemen ---------- */
  const loginView = $("loginView");
  const adminView = $("adminView");
  const statusBar = $("statusBar");

  /* =========================================================
     LOGIN — password saja
     ========================================================= */
  const PASS_KEY = "sd_pass_aktif";

  // hash SHA-256 mandiri (tidak tergantung auth.js agar bebas masalah cache)
  async function sha256(text) {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
  }

  // pastikan hash password tersedia (dibuat saat pertama kali)
  async function pastikanPasswordSiap() {
    if (!localStorage.getItem(PASS_KEY)) {
      localStorage.setItem(PASS_KEY, await sha256("admin123"));
    }
  }
  pastikanPasswordSiap();

  const formLogin = $("loginForm");
  if (formLogin) {
    formLogin.addEventListener("submit", async (e) => {
      e.preventDefault();
      const p = $("pass").value;
      const h = await sha256(p);
      const tersimpan = localStorage.getItem(PASS_KEY);
      if (h === tersimpan) {
        sessionStorage.setItem("sd_sesi", "1");
        $("loginView").classList.add("tersembunyi");
        $("adminView").classList.remove("tersembunyi");
        $("statusBar").classList.add("show");
        muatHalaman();
      } else {
        $("loginError").style.display = "block";
      }
    });
  }

  const btnLogout = $("btnLogout");
  if (btnLogout) {
    btnLogout.addEventListener("click", () => {
      sessionStorage.removeItem("sd_sesi");
      location.reload();
    });
  }

  /* =========================================================
     HELPER: baris "foto via link" + pratinjau
     Dipakai bersama oleh hero, kepsek, guru, ekskul, galeri.
     ========================================================= */
  function buatBarisFotoURL(opts) {
    // opts: { get, set, previewId?, bulat?, lebar, tinggi, placeholder }
    const w = opts.lebar || 96, h = opts.tinggi || 72;
    const wrap = document.createElement("div");
    wrap.className = "foto-url-baris";
    wrap.innerHTML = `
      <img class="foto-preview ${opts.bulat ? "bulat" : ""}" alt="Pratinjau"
           style="width:${w}px;height:${h}px" />
      <div style="flex:1; min-width:180px">
        <label class="label-kecil">Link Foto (URL)</label>
        <input type="url" class="input-url-foto" placeholder="${opts.placeholder || "https://contoh.com/foto.jpg"}" />
        <small style="color:var(--slate-600); font-size:.75rem">
          Salin link gambar (mis. dari Google Drive/Gmail/Imgur), tempel di sini, pratinjau muncul otomatis.
        </small>
      </div>`;
    const img = wrap.querySelector("img");
    const input = wrap.querySelector("input");
    img.src = opts.get() || "";
    if (!opts.get()) img.style.visibility = "hidden";
    input.value = opts.get() || "";
    input.addEventListener("input", () => {
      const v = input.value.trim();
      opts.set(v);
      if (v) { img.src = v; img.style.visibility = "visible"; }
      else { img.removeAttribute("src"); img.style.visibility = "hidden"; }
    });
    return wrap;
  }

  /* =========================================================
     MUAT DATA KE FORM
     ========================================================= */
  function muatHalaman() {
    $("f_namaSekolah").value = d.identitas?.namaSekolah || "";
    $("f_tagline").value = d.identitas?.tagline || "";
    $("f_npsn").value = d.identitas?.npsn || "";
    $("f_telepon").value = d.identitas?.telepon || "";
    $("f_email").value = d.identitas?.email || "";
    $("f_alamat").value = d.identitas?.alamat || "";

    $("f_hero1").value = d.hero?.judul1 || "";
    $("f_hero2").value = d.hero?.judul2 || "";
    $("f_hero3").value = d.hero?.judul3 || "";
    $("f_herodesc").value = d.hero?.deskripsi || "";

    $("tgPPDB").checked = d.pengaturan?.ppdbOpen !== false;
    $("tgWA").checked = d.media?.waTampil !== false;
    $("f_waNomor").value = d.media?.waNomor || "";
    $("f_waPesan").value = d.media?.waPesan || "";

    if (d.kepalaSekolah) {
      $("f_ksnama").value = d.kepalaSekolah.nama || "";
      $("f_ksSambutan").value = d.kepalaSekolah.sambutan || "";
    }

    renderHeroFoto();
    renderKSFoto();
    renderGuru();
    renderProgram();
    renderEkskul();
    renderBerita();
    renderKalender();
    renderUnduhan();
    renderGaleri();
  }

  /* ---------- foto hero ---------- */
  function renderHeroFoto() {
    const wadah = $("fotoHeroUrl");
    if (!wadah) return;
    wadah.innerHTML = "";
    wadah.appendChild(buatBarisFotoURL({
      get: () => d.hero?.foto || "",
      set: (v) => { d.hero.foto = v; },
      lebar: 150, tinggi: 96,
      placeholder: "https://images.unsplash.com/... (foto depan website)"
    }));
  }

  /* ---------- foto kepala sekolah ---------- */
  function renderKSFoto() {
    const wadah = $("fotoKSUrl");
    if (!wadah) return;
    wadah.innerHTML = "";
    wadah.appendChild(buatBarisFotoURL({
      get: () => d.kepalaSekolah?.foto || "",
      set: (v) => { d.kepalaSekolah.foto = v; },
      bulat: true, lebar: 96, tinggi: 96,
      placeholder: "https://... (foto kepala sekolah)"
    }));
  }

  /* =========================================================
     GURU — foto via link per guru
     ========================================================= */
  function renderGuru() {
    const wrap = $("guruEditors");
    wrap.innerHTML = "";
    d.guru = d.guru || [];
    d.guru.forEach(g => {
      const div = document.createElement("div");
      div.className = "item-editor";
      div.innerHTML = `
        <div style="display:flex; gap:14px; align-items:center; flex-wrap:wrap">
          <img class="foto-preview bulat foto-guru" src="${g.foto || "https://ui-avatars.com/api/?name=" + encodeURIComponent(g.nama || "Guru") + "&background=1a4f9c&color=fff&size=240"}" alt="Foto guru" style="width:72px;height:72px" />
          <div style="flex:1; min-width:220px">
            <label class="label-kecil">Nama Guru</label>
            <input value="${g.nama || ""}" data-g="nama" />
            <label class="label-kecil" style="margin-top:10px">Peran / Mapel</label>
            <input value="${g.peran || ""}" data-g="peran" />
          </div>
          <button type="button" class="tombol-kecil" style="background:#fee2e2;color:#b91c1c">Hapus</button>
        </div>`;
      div.querySelector("[data-g=nama]").addEventListener("input", e => { g.nama = e.target.value; });
      div.querySelector("[data-g=peran]").addEventListener("input", e => { g.peran = e.target.value; });
      div.querySelector("button").addEventListener("click", () => { div.remove(); g.__hapus = true; });
      // baris link foto
      const baris = buatBarisFotoURL({
        get: () => g.foto || "",
        set: (v) => { g.foto = v; },
        bulat: true, lebar: 72, tinggi: 72,
        placeholder: "https://... (link foto guru — kosongkan untuk inisial otomatis)"
      });
      baris.style.marginTop = "10px";
      div.appendChild(baris);
      wrap.appendChild(div);
    });
    // buang item yang ditandai hapus
    d.guru = d.guru.filter(g => !g.__hapus);
  }
  $("btnTambahGuru").addEventListener("click", () => {
    d.guru.push({ nama: "Guru Baru", peran: "Guru Mapel", foto: "" });
    renderGuru();
  });

  /* =========================================================
     PROGRAM & EKSKUL — foto via link per ekskul
     ========================================================= */
  function renderProgram() {
    const wrap = $("programEditors");
    wrap.innerHTML = "";
    (d.program || []).forEach(p => {
      const div = document.createElement("div");
      div.className = "item-editor";
      div.innerHTML = `
        <div style="display:flex; gap:14px; align-items:center; flex-wrap:wrap">
          <div style="flex:1; min-width:220px">
            <label class="label-kecil">Nama Program</label>
            <input value="${p.nama || ""}" data-p="nama" />
            <label class="label-kecil" style="margin-top:10px">Deskripsi</label>
            <textarea data-p="ket">${p.keterangan || ""}</textarea>
          </div>
          <button type="button" class="tombol-kecil" style="background:#fee2e2;color:#b91c1c">Hapus</button>
        </div>`;
      div.querySelectorAll("[data-p]").forEach(inp => {
        inp.addEventListener("input", () => { p[inp.dataset.p === "ket" ? "keterangan" : inp.dataset.p] = inp.value; });
      });
      div.querySelector("button").addEventListener("click", () => { div.remove(); p.__hapus = true; });
      wrap.appendChild(div);
    });
    d.program = (d.program || []).filter(p => !p.__hapus);
  }
  $("btnTambahProgram").addEventListener("click", () => {
    d.program = d.program || [];
    d.program.push({ nama: "Program Baru", keterangan: "Deskripsi program." });
    renderProgram();
  });

  function renderEkskul() {
    const wrap = $("ekskulEditors");
    wrap.innerHTML = "";
    (d.ekskul || []).forEach(e => {
      const div = document.createElement("div");
      div.className = "item-editor";
      div.innerHTML = `
        <div style="display:flex; gap:14px; align-items:center; flex-wrap:wrap">
          <img class="foto-preview ekskul-foto" src="${e.foto || ""}" alt="Foto kegiatan"
               style="width:96px;height:72px;${e.foto ? "" : "visibility:hidden"}" />
          <div style="flex:1; min-width:220px">
            <label class="label-kecil">Nama Ekskul</label>
            <input value="${e.nama || ""}" data-e="nama" />
            <label class="label-kecil" style="margin-top:10px">Jadwal</label>
            <input value="${e.jadwal || ""}" data-e="jadwal" />
            <label class="label-kecil" style="margin-top:10px">Pembina</label>
            <input value="${e.pembina || ""}" data-e="pembina" />
          </div>
          <button type="button" class="tombol-kecil" style="background:#fee2e2;color:#b91c1c">Hapus</button>
        </div>`;
      wrap.appendChild(div);
      div.querySelectorAll("input[data-e]").forEach(inp => {
        inp.addEventListener("input", () => { e[inp.dataset.e] = inp.value; });
      });
      div.querySelector("button").addEventListener("click", () => { div.remove(); e.__hapus = true; });
      // baris link foto kegiatan
      const baris = buatBarisFotoURL({
        get: () => e.foto || "",
        set: (v) => { e.foto = v; },
        lebar: 96, tinggi: 72,
        placeholder: "https://... (link foto kegiatan ekskul)"
      });
      const imgBaris = baris.querySelector("img");
      imgBaris.className += " ekskul-foto-mini";
      baris.style.marginTop = "10px";
      div.appendChild(baris);
      wrap.appendChild(div);
    });
    d.ekskul = (d.ekskul || []).filter(e => !e.__hapus);
  }
  $("btnTambahEkskul").addEventListener("click", () => {
    d.ekskul.push({ nama: "Kegiatan Baru", jadwal: "Hari, jam", pembina: "Nama pembina", foto: "" });
    renderEkskul();
  });

  /* =========================================================
     BERITA
     ========================================================= */
  function renderBerita() {
    const wrap = $("beritaEditors");
    wrap.innerHTML = "";
    (d.berita || []).forEach(b => {
      const div = document.createElement("div");
      div.className = "item-editor";
      div.innerHTML = `
        <div style="display:flex; gap:14px; align-items:center; flex-wrap:wrap">
          <div style="flex:1; min-width:220px">
            <label class="label-kecil">Judul</label>
            <input value="${b.judul || ""}" data-b="judul" />
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px">
              <div><label class="label-kecil" style="margin-top:10px">Tanggal</label>
                <input value="${b.tanggal || ""}" data-b="tanggal" /></div>
              <div><label class="label-kecil" style="margin-top:10px">Kategori</label>
                <input value="${b.kategori || ""}" data-b="kategori" /></div>
            </div>
            <label class="label-kecil" style="margin-top:10px">Ringkasan</label>
            <textarea data-b="ringkasan">${b.ringkasan || ""}</textarea>
          </div>
          <button type="button" class="tombol-kecil" style="background:#fee2e2;color:#b91c1c">Hapus</button>
        </div>`;
      wrap.appendChild(div);
      div.querySelectorAll("[data-b]").forEach(inp => {
        inp.addEventListener("input", () => { b[inp.dataset.b] = inp.value; });
      });
      div.querySelector("button").addEventListener("click", () => { div.remove(); b.__hapus = true; });
    });
    d.berita = (d.berita || []).filter(b => !b.__hapus);
  }
  $("btnTambahBerita").addEventListener("click", () => {
    d.berita = d.berita || [];
    d.berita.push({ judul: "Judul Berita", tanggal: "Hari ini", kategori: "Umum", ringkasan: "Isi ringkasan berita." });
    renderBerita();
  });

  /* =========================================================
     KALENDER
     ========================================================= */
  function renderKalender() {
    const wrap = $("kalenderEditors");
    wrap.innerHTML = "";
    (d.kalender || []).forEach(k => {
      const div = document.createElement("div");
      div.className = "item-editor";
      div.innerHTML = `
        <div style="display:flex; gap:14px; align-items:center; flex-wrap:wrap">
          <div style="flex:1; min-width:220px">
            <label class="label-kecil">Bulan</label>
            <input value="${k.tgl || ""}" data-k="tgl" />
            <label class="label-kecil" style="margin-top:10px">Kegiatan</label>
            <input value="${k.kegiatan || ""}" data-k="kegiatan" />
          </div>
          <button type="button" class="tombol-kecil" style="background:#fee2e2;color:#b91c1c">Hapus</button>
        </div>`;
      wrap.appendChild(div);
      div.querySelectorAll("input[data-k]").forEach(inp => {
        inp.addEventListener("input", () => { k[inp.dataset.k] = inp.value; });
      });
      div.querySelector("button").addEventListener("click", () => { div.remove(); k.__hapus = true; });
    });
    d.kalender = (d.kalender || []).filter(k => !k.__hapus);
  }
  $("btnTambahKalender").addEventListener("click", () => {
    d.kalender.push({ tgl: "Bulan", kegiatan: "Deskripsi kegiatan" });
    renderKalender();
  });

  /* =========================================================
     UNDUHAN
     ========================================================= */
  function renderUnduhan() {
    const wrap = $("unduhanEditors");
    wrap.innerHTML = "";
    (d.unduhan || []).forEach(u => {
      const div = document.createElement("div");
      div.className = "item-editor";
      div.innerHTML = `
        <div style="display:flex; gap:14px; align-items:center; flex-wrap:wrap">
          <div style="flex:1; min-width:220px">
            <label class="label-kecil">Judul Dokumen</label>
            <input value="${u.judul || ""}" data-u="judul" />
            <label class="label-kecil" style="margin-top:10px">Tautan Google Drive</label>
            <input value="${u.file || ""}" data-u="file" placeholder="https://drive.google.com/..." />
            <label class="label-kecil" style="margin-top:10px">Keterangan</label>
            <input value="${u.ket || ""}" data-u="ket" />
          </div>
          <button type="button" class="tombol-kecil" style="background:#fee2e2;color:#b91c1c">Hapus</button>
        </div>`;
      wrap.appendChild(div);
      div.querySelectorAll("input[data-u]").forEach(inp => {
        inp.addEventListener("input", () => { u[inp.dataset.u] = inp.value; });
      });
      div.querySelector("button").addEventListener("click", () => { div.remove(); u.__hapus = true; });
    });
    d.unduhan = (d.unduhan || []).filter(u => !u.__hapus);
  }
  $("btnTambahUnduhan").addEventListener("click", () => {
    d.unduhan.push({ judul: "Dokumen Baru", ket: "Keterangan file", file: "https://drive.google.com/..." });
    renderUnduhan();
  });

  /* =========================================================
     GALERI — tambah foto via LINK (bukan upload)
     ========================================================= */
  function renderGaleri() {
    const wrap = $("galeriEditors");
    if (!wrap) return;
    wrap.innerHTML = "";
    d.galeri = d.galeri || [];
    if (!d.galeri.length) {
      wrap.innerHTML = '<p style="color:var(--slate-600); font-size:.9rem">Belum ada foto galeri. Tempel link foto di kolom atas lalu klik "+ Tambah Foto Galeri".</p>';
      return;
    }
    d.galeri.forEach((g, i) => {
      const div = document.createElement("div");
      div.className = "item-editor";
      div.innerHTML = `
        <div style="display:flex; gap:14px; align-items:center; flex-wrap:wrap">
          <img src="${g.src}" alt="Foto ${i + 1}" style="width:120px;height:90px;object-fit:cover;border-radius:10px;border:1px solid var(--border)" />
          <div style="flex:1; min-width:220px">
            <label class="label-kecil">Link Foto</label>
            <input data-gl="src" value="${g.src || ""}" placeholder="https://..." />
            <label class="label-kecil" style="margin-top:8px">Keterangan</label>
            <input data-gl="ket" value="${g.ket || ""}" placeholder="cth: Pramuka Jumat sore" />
          </div>
          <button type="button" class="tombol-kecil" style="background:#fee2e2;color:#b91c1c">Hapus</button>
        </div>`;
      div.querySelectorAll("[data-gl]").forEach(inp => {
        inp.addEventListener("input", () => {
          g[inp.dataset.gl] = inp.value;
          if (inp.dataset.gl === "src") div.querySelector("img").src = inp.value;
        });
      });
      div.querySelector("button").addEventListener("click", () => { div.remove(); g.__hapus = true; });
      wrap.appendChild(div);
    });
    d.galeri = d.galeri.filter(g => !g.__hapus);
  }
  const btnTambahGaleri = $("btnTambahGaleri");
  if (btnTambahGaleri) {
    btnTambahGaleri.addEventListener("click", () => {
      d.galeri = d.galeri || [];
      d.galeri.push({ src: "", ket: "" });
      renderGaleri();
      // fokus ke kolom link yang baru muncul
      const inputs = document.querySelectorAll("#galeriEditors [data-gl=src]");
      if (inputs.length) inputs[inputs.length - 1].focus();
    });
  }

  /* =========================================================
     SIMPAN / RESET
     ========================================================= */
  $("btnSimpan").addEventListener("click", () => {
    d.identitas.namaSekolah = $("f_namaSekolah").value;
    d.identitas.tagline = $("f_tagline").value;
    d.identitas.npsn = $("f_npsn").value;
    d.identitas.telepon = $("f_telepon").value;
    d.identitas.email = $("f_email").value;
    d.identitas.alamat = $("f_alamat").value;
    d.hero.judul1 = $("f_hero1").value;
    d.hero.judul2 = $("f_hero2").value;
    d.hero.judul3 = $("f_hero3").value;
    d.hero.deskripsi = $("f_herodesc").value;
    d.media.waNomor = $("f_waNomor").value;
    d.media.waPesan = $("f_waPesan").value;
    if (d.kepalaSekolah) {
      d.kepalaSekolah.nama = $("f_ksnama").value;
      d.kepalaSekolah.sambutan = $("f_ksSambutan").value;
    }
    // buang item yang ditandai hapus (klik tombol Hapus sudah menandai)
    d.guru = (d.guru || []).filter(g => !g.__hapus);
    d.ekskul = (d.ekskul || []).filter(e => !e.__hapus);
    d.galeri = (d.galeri || []).filter(g => !g.__hapus);
    localStorage.setItem("sd_data", JSON.stringify(d));
    tampilkanPesanOK();
  });

  function tampilkanPesanOK() {
    $("simpanOK").style.display = "block";
    setTimeout(() => ($("simpanOK").style.display = "none"), 4000);
  }

  $("btnReset").addEventListener("click", () => {
    if (confirm("Kembalikan semua konten ke bawaan?")) {
      localStorage.removeItem("sd_data");
      location.reload();
    }
  });

  /* =========================================================
     GANTI PASSWORD
     ========================================================= */
  $("btnGantiPass").addEventListener("click", () => {
    const lama = $("f_passLama").value;
    const baru = $("f_passBaru").value;
    if (baru.length < 6) { alert("Password baru minimal 6 karakter."); return; }
    const tersimpan = localStorage.getItem("sd_pass_aktif") || "admin123";
    if (lama !== tersimpan) { alert("Password lama salah."); return; }
    localStorage.setItem("sd_pass_aktif", baru);
    $("pesanPass").textContent = "Password berhasil diganti!";
    $("pesanPass").style.color = "#16a34a";
  });

  /* =========================================================
     EKSPOR
     ========================================================= */
  $("btnEkspor").addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(d, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "data-website-sdn1terkesi.json";
    a.click();
  });

  /* =========================================================
     INIT
     ========================================================= */
  if (sessionStorage.getItem("sd_sesi") === "1") {
    $("loginView").classList.add("tersembunyi");
    $("adminView").classList.remove("tersembunyi");
    $("statusBar").classList.add("show");
    muatHalaman();
  } else {
    $("loginView").classList.remove("tersembunyi");
  }
})();
