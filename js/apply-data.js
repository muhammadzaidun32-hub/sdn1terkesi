/* =========================================================
   SDN 1 TERKESI — apply-data.js
   Mengisi semua halaman dari data (localStorage / bawaan):
   guru, ekskul, program, jadwal, kalender, unduhan, berita,
   PPDB (form, cek status, cetak bukti).
   ========================================================= */
(function () {
  const KEPALA_FOTO_DEFAULT = "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=400&q=80";

  /* ---------- jadwal default per kelas ---------- */
  const JADWAL_DEFAULT = {
    1: [
      ["Senin", "1-4", "Tematik: Bahasa Indonesia", "Wali Kelas 1"],
      ["Senin", "5-6", "Matematika", "Wali Kelas 1"],
      ["Selasa", "1-4", "Tematik: IPAS", "Wali Kelas 1"],
      ["Selasa", "5-6", "Seni Rupa", "Wali Kelas 1"],
      ["Rabu", "1-4", "PJOK", "Guru PJOK"],
      ["Rabu", "5-6", "Pendidikan Agama", "Guru PAI"],
      ["Kamis", "1-4", "Tematik: Bahasa Indonesia", "Wali Kelas 1"],
      ["Kamis", "5-6", "Matematika", "Wali Kelas 1"],
      ["Jumat", "1-4", "Pendidikan Pancasila", "Wali Kelas 1"],
      ["Jumat", "5-6", "Literasi & Numerasi", "Wali Kelas 1"]
    ],
    2: [
      ["Senin", "1-4", "Bahasa Indonesia", "Wali Kelas 2"],
      ["Senin", "5-6", "Matematika", "Wali Kelas 2"],
      ["Selasa", "1-4", "IPAS", "Wali Kelas 2"],
      ["Selasa", "5-6", "Seni Musik", "Wali Kelas 2"],
      ["Rabu", "1-4", "PJOK", "Guru PJOK"],
      ["Rabu", "5-6", "Pendidikan Agama", "Guru PAI"],
      ["Kamis", "1-4", "Bahasa Inggris", "Guru B.Inggris"],
      ["Kamis", "5-6", "Bahasa Indonesia", "Wali Kelas 2"],
      ["Jumat", "1-4", "Pendidikan Pancasila", "Wali Kelas 2"],
      ["Jumat", "5-6", "Literasi & Numerasi", "Wali Kelas 2"]
    ],
    3: [
      ["Senin", "1-4", "Bahasa Indonesia", "Wali Kelas 3"],
      ["Senin", "5-6", "Matematika", "Wali Kelas 3"],
      ["Selasa", "1-4", "IPAS", "Wali Kelas 3"],
      ["Selasa", "5-6", "Seni Rupa", "Wali Kelas 3"],
      ["Rabu", "1-4", "PJOK", "Guru PJOK"],
      ["Rabu", "5-6", "Pendidikan Agama", "Guru PAI"],
      ["Kamis", "1-4", "Bahasa Inggris", "Guru B.Inggris"],
      ["Kamis", "5-6", "IPAS", "Wali Kelas 3"],
      ["Jumat", "1-4", "Pendidikan Pancasila", "Wali Kelas 3"],
      ["Jumat", "5-6", "Literasi & Numerasi", "Wali Kelas 3"]
    ],
    4: [
      ["Senin", "1-4", "Bahasa Indonesia", "Wali Kelas 4"],
      ["Senin", "5-6", "Matematika", "Wali Kelas 4"],
      ["Selasa", "1-4", "IPAS", "Wali Kelas 4"],
      ["Selasa", "5-6", "Seni Musik", "Wali Kelas 4"],
      ["Rabu", "1-4", "PJOK", "Guru PJOK"],
      ["Rabu", "5-6", "Pendidikan Agama", "Guru PAI"],
      ["Kamis", "1-4", "Bahasa Inggris", "Guru B.Inggris"],
      ["Kamis", "5-6", "IPAS", "Wali Kelas 4"],
      ["Jumat", "1-4", "Pendidikan Pancasila", "Wali Kelas 4"],
      ["Jumat", "5-6", "Literasi & Numerasi", "Wali Kelas 4"]
    ],
    5: [
      ["Senin", "1-4", "Bahasa Indonesia", "Wali Kelas 5"],
      ["Senin", "5-6", "Matematika", "Wali Kelas 5"],
      ["Selasa", "1-4", "IPAS", "Wali Kelas 5"],
      ["Selasa", "5-6", "Seni Musik", "Wali Kelas 5"],
      ["Rabu", "1-4", "PJOK", "Guru PJOK"],
      ["Rabu", "5-6", "Pendidikan Agama", "Guru PAI"],
      ["Kamis", "1-4", "Bahasa Inggris", "Guru B.Inggris"],
      ["Kamis", "5-6", "IPAS", "Wali Kelas 5"],
      ["Jumat", "1-4", "Pendidikan Pancasila", "Wali Kelas 5"],
      ["Jumat", "5-6", "Literasi & Numerasi", "Wali Kelas 5"]
    ],
    6: [
      ["Senin", "1-4", "Bahasa Indonesia", "Wali Kelas 6"],
      ["Senin", "5-6", "Matematika", "Wali Kelas 6"],
      ["Selasa", "1-4", "IPAS", "Wali Kelas 6"],
      ["Selasa", "5-6", "Seni Rupa", "Wali Kelas 6"],
      ["Rabu", "1-4", "PJOK", "Guru PJOK"],
      ["Rabu", "5-6", "Pendidikan Agama", "Guru PAI"],
      ["Kamis", "1-4", "Bahasa Inggris", "Guru B.Inggris"],
      ["Kamis", "5-6", "IPAS", "Wali Kelas 6"],
      ["Jumat", "1-4", "Pendidikan Pancasila", "Wali Kelas 6"],
      ["Jumat", "5-6", "Persiapan Ujian Sekolah", "Wali Kelas 6"]
    ]
  };

  /* ---------- ikon ekskul ---------- */
  const IKON_EKSKUL = {
    "Pramuka": "🏕️", "BTQ (Baca Tulis Qur'an)": "🕌", "Karawitan": "🎵",
    "Futsal": "⚽", "Menari & Seni Tari": "💃", "Robotika / Coding Kids": "🤖",
    "Drum Band / Marching Band": "🥁", "Tahfidz & Hadroh": "📖"
  };

  /* ---------- guru foto otomatis (inisial) ---------- */
  function avatar(nama) {
    return "https://ui-avatars.com/api/?name=" + encodeURIComponent(nama) + "&background=1a4f9c&color=fff&size=200";
  }

  /* ---------- util DOM ---------- */
  const badan = document.body;
  const d = window.SITE ? window.SITE.get() : {};

  function el(tag, cls, html) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
  }

  /* =========================================================
     1) DAFTAR GURU  (profil.html #guruGrid)
     ========================================================= */
  const guruGrid = document.getElementById("guruGrid");
  if (guruGrid) {
    (d.guru || []).forEach(g => {
      const kartu = el("article", "guru-card reveal");
      kartu.innerHTML = `
        <img class="guru-foto" src="${g.foto || avatar(g.nama)}" alt="Foto ${g.nama}" loading="lazy">
        <b>${g.nama}</b>
        <small>${g.peran || "Guru"}</small>`;
      guruGrid.appendChild(kartu);
    });
  }

  /* =========================================================
     2) PROGRAM UNGGULAN (program.html #programGrid)
     ========================================================= */
  const programGrid = document.getElementById("programGrid");
  if (programGrid && d.program) {
    d.program.forEach(p => {
      const kartu = el("article", "program-card reveal");
      kartu.innerHTML = `
        <div class="program-ikon">${p.ikon || "🌟"}</div>
        <h3>${p.nama}</h3>
        <p>${p.keterangan || ""}</p>`;
      programGrid.appendChild(kartu);
    });
  }

  /* =========================================================
     3) EKSKUL (program.html #ekskulGrid) — kartu + foto
     ========================================================= */
  const ekskulGrid = document.getElementById("ekskulGrid");
  if (ekskulGrid) {
    (d.ekskul || []).forEach((e, i) => {
      const ikon = IKON_EKSKUL[e.nama] || "⭐";
      const kartu = el("article", "program-card ekskul-card reveal");
      kartu.innerHTML = `
        <div class="program-ikon">${ikon}</div>
        <h3>${e.nama}</h3>
        <p>${e.jadwal || ""}</p>
        <p class="pembina">Pembina: ${e.pembina || "-"}</p>`;
      ekskulGrid.appendChild(kartu);
    });
    // foto suasana di bawah
    const fotoGrid = document.getElementById("galeriMiniGrid");
    if (fotoGrid && d.ekskulFoto) {
      d.ekskulFoto.forEach(src => {
        const item = el("div", "galeri-item", `<img src="${src}" alt="Kegiatan ekskul" loading="lazy">`);
        fotoGrid.appendChild(item);
      });
    }
  }

  /* =========================================================
     4) JADWAL PER KELAS (jadwal.html #tabelJadwal)
     ========================================================= */
  const tabelJadwal = document.getElementById("tabelJadwal");
  if (tabelJadwal) {
    const url = new URL(location.href);
    let kelas = url.searchParams.get("kelas") || "1";
    if (!JADWAL_DEFAULT[kelas]) kelas = "1";
    // tandai tab aktif
    document.querySelectorAll(".tab-kelas").forEach(b => {
      b.classList.toggle("btn-solid", b.dataset.kelas === kelas);
      b.classList.toggle("btn-outline", b.dataset.kelas !== kelas);
      b.addEventListener("click", () => {
        const u = new URL(location.href);
        u.searchParams.set("kelas", b.dataset.kelas);
        location.href = u.href;
      });
    });
    const tbody = tabelJadwal.querySelector("tbody");
    (JADWAL_DEFAULT[kelas] || []).forEach(r => {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td>`;
      tbody.appendChild(tr);
    });
  }

  /* =========================================================
     5) KALENDER SEKOLAH (jadwal.html #tabelKalender)
     ========================================================= */
  const tabelKalender = document.getElementById("tabelKalender");
  if (tabelKalender) {
    const tbody = tabelKalender.querySelector("tbody");
    (d.kalender || []).forEach(k => {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td><b>${k.tgl}</b></td><td>${k.kegiatan}</td>`;
      tbody.appendChild(tr);
    });
  }

  /* =========================================================
     6) UNDUHAN (unduhan.html #tabelUnduhan)
     ========================================================= */
  const tabelUnduhan = document.getElementById("tabelUnduhan");
  if (tabelUnduhan) {
    const tbody = tabelUnduhan.querySelector("tbody");
    (d.unduhan || []).forEach(u => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><b>${u.judul}</b></td>
        <td>${u.ket || ""}</td>
        <td><a class="btn btn-solid" href="${u.file}" download>⬇️ Unduh</a></td>`;
      tbody.appendChild(tr);
    });
  }

  /* =========================================================
     7) PENGATURAN PPDB — banner tutup/buka
     ========================================================= */
  function cekPPDB() {
    const ribbon = document.getElementById("ppdbTutupRibbon");
    if (!ribbon) return;
    const buka = !d.pengaturan || d.pengaturan.ppdbOpen !== false;
    ribbon.classList.toggle("buka", buka);
    ribbon.classList.toggle("tutup", !buka);
    ribbon.textContent = buka
      ? "🎉 Pendaftaran siswa baru DIBUKA — silakan isi formulir di bawah."
      : "🔒 Pendaftaran siswa baru DITUTUP sementara. Hubungi sekolah untuk info.";
    ribbon.style.display = "block";
    // sembunyikan formulir saat pendaftaran ditutup
    const formP = document.getElementById("formPPDB");
    if (formP && !buka) {
      formP.innerHTML = '<p style="font-weight:700; color:#b91c1c">🔒 Pendaftaran sedang ditutup. Silakan hubungi sekolah.</p>';
    }
  }
  cekPPDB();

  /* =========================================================
     8) FORM PPDB — simpan + nomor pendaftaran + cetak bukti
     ========================================================= */
  const formPPDB = document.getElementById("formPPDB");
  if (formPPDB) {
    // pra-isi kelas tujuan dari ?kelas=
    const url = new URL(location.href);
    const kelas = url.searchParams.get("kelas");
    if (kelas) {
      const sel = formPPDB.querySelector("[name=kelas_tujuan]");
      if (sel) sel.value = kelas;
    }

    formPPDB.addEventListener("submit", ev => {
      ev.preventDefault();
      const fd = new FormData(formPPDB);
      const nama = (fd.get("nama") || "").toString().trim();
      if (!nama) { alert("Mohon isi nama lengkap anak."); return; }

      // nomor pendaftaran: SD-2026-XXXX
      const daftar = JSON.parse(localStorage.getItem("sd_pendaftar") || "[]");
      const no = "SD-" + new Date().getFullYear() + "-" + String(daftar.length + 1).padStart(4, "0");
      const data = { no, waktu: new Date().toLocaleString("id-ID"), obj: Object.fromEntries(fd.entries()) };
      daftar.push(data);
      localStorage.setItem("sd_pendaftar", JSON.stringify(daftar));

      tampilkanBukti(data);
    });
  }

  function tampilkanBukti(data) {
    const panel = document.getElementById("buktiPanel");
    if (!panel) return;
    panel.style.display = "block";
    panel.innerHTML = `
      <div class="bukti-kartu" id="areaCetak">
        <h3>🧾 Bukti Pendaftaran</h3>
        <table class="tabel-data">
          <tr><th>No. Pendaftaran</th><td><b>${data.no}</b></td></tr>
          <tr><th>Nama Anak</th><td>${data.obj.nama}</td></tr>
          <tr><th>Kelas Tujuan</th><td>Kelas ${data.obj.kelas_tujuan}</td></tr>
          <tr><th>Asal TK</th><td>${data.obj.asal_tk || "-"}</td></tr>
          <tr><th>Nama Orang Tua</th><td>${data.obj.nama_ortu}</td></tr>
          <tr><th>No. WhatsApp</th><td>${data.obj.wa}</td></tr>
          <tr><th>Waktu Daftar</th><td>${data.waktu}</td></tr>
        </table>
        <p style="margin-top:12px; color:var(--slate-600); font-size:.9rem">
          Simpan nomor pendaftaran Anda. Panitia akan menghubungi via WhatsApp
          untuk verifikasi dokumen.</p>
        <button class="btn btn-solid" onclick="window.print()">🖨️ Cetak Bukti</button>
      </div>`;
    panel.scrollIntoView({ behavior: "smooth" });
  }

  /* =========================================================
     9) CEK STATUS PENDAFTARAN (ppdb.html #formStatus)
     ========================================================= */
  const formStatus = document.getElementById("formStatus");
  if (formStatus) {
    formStatus.addEventListener("submit", ev => {
      ev.preventDefault();
      const no = (new FormData(formStatus).get("no") || "").toString().trim().toUpperCase();
      const hasil = document.getElementById("statusHasil");
      const daftar = JSON.parse(localStorage.getItem("sd_pendaftar") || "[]");
      const found = daftar.find(x => x.no === no);
      if (found) {
        hasil.style.display = "block";
        hasil.style.background = "#e7f8ef";
        hasil.innerHTML = `✅ <b>DITEMUKAN</b> — ${found.obj.nama}, kelas ${found.obj.kelas_tujuan}
          (daftar ${found.waktu}). Status: <b>Menunggu verifikasi dokumen.</b>`;
      } else {
        hasil.style.display = "block";
        hasil.style.background = "#fde8e8";
        hasil.innerHTML = `❌ Nomor <b>${no || "(kosong)"}</b> tidak ditemukan. Periksa kembali.`;
      }
    });
  }
})();
