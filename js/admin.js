/* =========================================================
   SDN 1 TERKESI — admin.js
   Editor konten lengkap: identitas, hero, guru, ekskul,
   berita, kalender, unduhan, WA/PPDB toggle, ganti password.
   ========================================================= */
(function () {
  const $ = (id) => document.getElementById(id);
  const d = window.SITE ? window.SITE.get() : {};

  /* ---------- elemen ---------- */
  const loginView = $("loginView");
  const adminView = $("adminView");
  const statusBar = $("statusBar");

  /* =========================================================
     LOGIN
     ========================================================= */
  const formLogin = $("loginForm");
  if (formLogin) {
    formLogin.addEventListener("submit", (e) => {
      e.preventDefault();
      const u = $("username").value.trim();
      const p = $("pass").value;
      if (u === "admin" && p === "admin123") {
        sessionStorage.setItem("sd_sesi", "1");
        // langsung tampilkan editor tanpa reload
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

  // cek sesi — tampilkan editor jika sudah login
  function cekSesi() {
    const sudah = sessionStorage.getItem("sd_sesi") === "1";
    if (loginView) { loginView.classList.toggle("tersembunyi", sudah); }
    if (adminView) { adminView.classList.toggle("tersembunyi", !sudah); }
    if (statusBar) statusBar.classList.toggle("show", sudah);
    return sudah;
  }

  /* =========================================================
     MUAT DATA KE FORM (saat halaman dibuka)
     ========================================================= */
  function muatHalaman() {
    // identitas
    $("f_namaSekolah").value = d.identitas?.namaSekolah || "";
    $("f_tagline").value = d.identitas?.tagline || "";
    $("f_npsn").value = d.identitas?.npsn || "";
    $("f_telepon").value = d.identitas?.telepon || "";
    $("f_email").value = d.identitas?.email || "";
    $("f_alamat").value = d.identitas?.alamat || "";

    // hero
    $("f_hero1").value = d.hero?.judul1 || "";
    $("f_hero2").value = d.hero?.judul2 || "";
    $("f_hero3").value = d.hero?.judul3 || "";
    $("f_herodesc").value = d.hero?.deskripsi || "";
    $("prev_hero").src = d.hero?.foto || "";

    // toggle
    $("tgPPDB").checked = d.pengaturan?.ppdbOpen !== false;
    $("tgWA").checked = d.media?.waTampil !== false;
    $("f_waNomor").value = d.media?.waNomor || "";
    $("f_waPesan").value = d.media?.waPesan || "";

    // kepala sekolah
    if (d.kepalaSekolah) {
      $("f_ksnama").value = d.kepalaSekolah.nama || "";
      $("f_ksSambutan").value = d.kepalaSekolah.sambutan || "";
      $("prev_ks").src = d.kepalaSekolah.foto || "";
    }

    renderGuru();
    renderProgram();
    renderEkskul();
    renderBerita();
    renderKalender();
    renderUnduhan();
    renderGaleri();
  }

  /* =========================================================
     HELPER: buat item editor generik (dipakai guru/ekskul/dll)
     ========================================================= */
  function buatItem(fields, data, hapusCb) {
    const div = document.createElement("div");
    div.className = "item-editor";
    fields.forEach(f => {
      const label = document.createElement("label");
      label.className = "label-kecil";
      label.textContent = f.label;
      const input = document.createElement(f.type === "textarea" ? "textarea" : "input");
      if (f.type !== "textarea") input.type = "text";
      input.value = data[f.key] || "";
      input.style.width = "100%";
      input.dataset.key = f.key;
      input.addEventListener("input", () => { data[f.key] = input.value; });
      div.appendChild(label);
      div.appendChild(input);
    });
    const btn = document.createElement("button");
    btn.textContent = "Hapus item ini";
    btn.type = "button";
    btn.className = "tombol-kecil";
    btn.style.background = "#fee2e2";
    btn.style.marginTop = "8px";
    btn.addEventListener("click", () => { div.remove(); data.__hapus = true; });
    div.appendChild(btn);
    return div;
  }

  /* =========================================================
     GURU
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
          <img class="foto-preview bulat" src="${g.foto || "https://ui-avatars.com/api/?name=" + encodeURIComponent(g.nama || "Guru") + "&background=1a4f9c&color=fff&size=240"}" alt="Foto guru" style="width:72px;height:72px" />
          <div style="flex:1; min-width:200px">
            <label class="label-kecil">Nama Guru</label>
            <input value="${g.nama || ""}" data-g="nama" />
            <label class="label-kecil" style="margin-top:10px">Peran / Mapel</label>
            <input value="${g.peran || ""}" data-g="peran" />
          </div>
        </div>`;
      div.querySelector("[data-g=nama]").addEventListener("input", e => { g.nama = e.target.value; });
      div.querySelector("[data-g=peran]").addEventListener("input", e => { g.peran = e.target.value; });
      // upload foto per guru
      const up = document.createElement("input");
      up.type = "file"; up.accept = "image/*";
      up.style.cssText = "margin-top:10px; font-size:.85rem";
      up.className = "upload-foto";
      up.addEventListener("change", async () => {
        const file = up.files && up.files[0];
        if (!file) return;
        const imgBaru = div.querySelector(".foto-preview");
        imgBaru.src = await window.SITE.kompresFoto(file, 400, 0.82);
        g.foto = imgBaru.src;
      });
      div.appendChild(up);
      const hapus = document.createElement("button");
      hapus.textContent = "Hapus guru";
      hapus.type = "button";
      hapus.className = "tombol-kecil";
      hapus.style.marginTop = "8px";
      hapus.addEventListener("click", () => div.remove());
      div.appendChild(hapus);
      wrap.appendChild(div);
    });
  }
  $("btnTambahGuru").addEventListener("click", () => {
    d.guru.push({ nama: "Guru Baru", peran: "Guru Mapel" });
    renderGuru();
  });

  /* =========================================================
     PROGRAM & EKSKUL
     ========================================================= */
  function renderProgram() {
    const wrap = $("programEditors");
    wrap.innerHTML = "";
    (d.program || []).forEach(p => {
      const div = document.createElement("div");
      div.className = "item-editor";
      div.innerHTML = `
        <label class="label-kecil">Nama Program</label>
        <input value="${p.nama || ""}" data-p="nama" />
        <label class="label-kecil" style="margin-top:10px">Deskripsi</label>
        <textarea data-p="ket">${p.keterangan || ""}</textarea>`;
      div.querySelectorAll("[data-p]").forEach(inp => {
        inp.addEventListener("input", () => { p[inp.dataset.p === "ket" ? "keterangan" : inp.dataset.p] = inp.value; });
      });
      wrap.appendChild(div);
    });
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
          <img class="foto-preview ekskul-foto" src="${e.foto || ""}" alt="Foto kegiatan" style="width:96px;height:72px;${e.foto ? "" : "display:none"}" />
          <div style="flex:1; min-width:200px">
            <label class="label-kecil">Nama Ekskul</label>
            <input value="${e.nama || ""}" data-e="nama" />
            <label class="label-kecil" style="margin-top:10px">Jadwal</label>
            <input value="${e.jadwal || ""}" data-e="jadwal" />
            <label class="label-kecil" style="margin-top:10px">Pembina</label>
            <input value="${e.pembina || ""}" data-e="pembina" />
          </div>
        </div>`;
      wrap.appendChild(div);
      div.querySelectorAll("input[data-e]").forEach(inp => {
        inp.addEventListener("input", () => { e[inp.dataset.e] = inp.value; });
      });
      // upload foto kegiatan per ekskul
      const up = document.createElement("input");
      up.type = "file"; up.accept = "image/*";
      up.style.cssText = "margin-top:10px; font-size:.85rem";
      up.addEventListener("change", async () => {
        const file = up.files && up.files[0];
        if (!file) return;
        const src = await window.SITE.kompresFoto(file, 640, 0.78);
        const img = div.querySelector(".ekskul-foto");
        img.src = src; img.style.display = "block";
        e.foto = src;
        up.dataset.berubah = "1";
        const ket = document.createElement("small");
        ket.textContent = "✔ foto siap — klik Simpan Perubahan";
        ket.style.color = "#166534";
        if (!div.querySelector(".ket-foto")) div.appendChild(ket);
      });
      div.appendChild(up);
    });
  }
  $("btnTambahEkskul").addEventListener("click", () => {
    d.ekskul.push({ nama: "Kegiatan Baru", jadwal: "Hari, jam", pembina: "Nama pembina" });
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
        <label class="label-kecil">Judul</label>
        <input value="${b.judul || ""}" data-b="judul" />
        <label class="label-kecil" style="margin-top:10px">Tanggal</label>
        <input value="${b.tanggal || ""}" data-b="tanggal" />
        <label class="label-kecil" style="margin-top:10px">Kategori</label>
        <input value="${b.kategori || ""}" data-b="kategori" />
        <label class="label-kecil" style="margin-top:10px">Ringkasan</label>
        <textarea data-b="ringkasan">${b.ringkasan || ""}</textarea>`;
      wrap.appendChild(div);
      div.querySelectorAll("[data-b]").forEach(inp => {
        inp.addEventListener("input", () => { b[inp.dataset.b] = inp.value; });
      });
    });
  }
  $("btnTambahBerita").addEventListener("click", () => {
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
        <label class="label-kecil">Bulan</label>
        <input value="${k.tgl || ""}" data-k="tgl" />
        <label class="label-kecil" style="margin-top:10px">Kegiatan</label>
        <input value="${k.kegiatan || ""}" data-k="kegiatan" />`;
      wrap.appendChild(div);
      div.querySelectorAll("input[data-k]").forEach(inp => {
        inp.addEventListener("input", () => { k[inp.dataset.k] = inp.value; });
      });
    });
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
        <label class="label-kecil">Judul Dokumen</label>
        <input value="${u.judul || ""}" data-u="judul" />
        <label class="label-kecil" style="margin-top:10px">Tautan Google Drive</label>
        <input value="${u.file || ""}" data-u="file" placeholder="https://drive.google.com/..." />
        <label class="label-kecil" style="margin-top:10px">Keterangan</label>
        <input value="${u.ket || ""}" data-u="ket" />`;
      wrap.appendChild(div);
      div.querySelectorAll("input[data-u]").forEach(inp => {
        inp.addEventListener("input", () => { u[inp.dataset.u] = inp.value; });
      });
    });
  }
  $("btnTambahUnduhan").addEventListener("click", () => {
    d.unduhan.push({ judul: "Dokumen Baru", ket: "Keterangan file", file: "https://drive.google.com/..." });
    renderUnduhan();
  });

  /* =========================================================
     GALERI KEGIATAN — upload banyak foto sekaligus
     ========================================================= */
  function renderGaleri() {
    const wrap = $("galeriEditors");
    if (!wrap) return;
    wrap.innerHTML = "";
    d.galeri = d.galeri || [];
    if (!d.galeri.length) {
      wrap.innerHTML = '<p style="color:var(--slate-600); font-size:.9rem">Belum ada foto. Klik tombol di bawah untuk menambah.</p>';
      return;
    }
    d.galeri.forEach((g, i) => {
      const div = document.createElement("div");
      div.className = "item-editor";
      div.style.cssText = "display:inline-block; margin:0 10px 10px 0; text-align:center; position:relative";
      div.innerHTML = `
        <img src="${g.src}" alt="Foto ${i + 1}" style="width:120px;height:90px;object-fit:cover;border-radius:10px;border:1px solid var(--border)" />
        <br />
        <input value="${g.ket || ""}" placeholder="keterangan foto" data-gl="ket" style="width:120px; font-size:.75rem; margin-top:6px; padding:5px 8px; border:1px solid var(--border); border-radius:7px" />
        <br />
        <button type="button" class="tombol-kecil" style="background:#fee2e2;color:#b91c1c;margin-top:4px">Hapus</button>`;
      div.querySelector("[data-gl=ket]").addEventListener("input", e => { g.ket = e.target.value; });
      div.querySelector("button").addEventListener("click", () => { d.galeri.splice(i, 1); renderGaleri(); });
      wrap.appendChild(div);
    });
  }
  const upGaleri = $("upGaleri");
  if (upGaleri) {
    upGaleri.addEventListener("change", async () => {
      const files = Array.from(upGaleri.files || []);
      for (const f of files) {
        try {
          const src = await window.SITE.kompresFoto(f, 760, 0.75);
          d.galeri = d.galeri || [];
          d.galeri.push({ src, ket: "" });
        } catch (e) { alert("Gagal memproses " + f.name); }
      }
      renderGaleri();
      upGaleri.value = "";
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
      const pks = $("prev_ks").src;
      if (pks && !pks.startsWith("data:image/svg")) d.kepalaSekolah.foto = pks;
    }
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
    // validasi sederhana (password disimpan di localStorage sesi ini)
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
  // sesi aktif → langsung tampilkan
  if (sessionStorage.getItem("sd_sesi") === "1") {
    $("loginView").classList.add("tersembunyi");
    $("adminView").classList.remove("tersembunyi");
    $("statusBar").classList.add("show");
    muatHalaman();
  } else {
    $("loginView").classList.remove("tersembunyi");
  }
})();
