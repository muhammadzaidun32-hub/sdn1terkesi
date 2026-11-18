/* =========================================================
   SDN 1 TERKESI — data site + helper
   Semua konten dinamis & pengaturan tersimpan di localStorage.
   ========================================================= */

window.SITE = (function () {
  const KEY = "sd_data";
  const PASS_KEY = "sd_pass_hash";

  /* ---------- DEFAULT DATA ---------- */
  const bawaan = {
    media: {
      waNomor: "6281234567890",     // format 62xxx
      waTampil: true,
      waPesan: "Assalamualaikum, saya ingin bertanya tentang pendaftaran siswa baru."
    },
    pengaturan: {
      ppdbOpen: true
    },
    guru: [
      { nama: "Joko Susilo, S.Pd", peran: "Kepala Sekolah" },
      { nama: "Nama Guru 2", peran: "Guru Kelas 1" },
      { nama: "Nama Guru 3", peran: "Guru Kelas 2" },
      { nama: "Nama Guru 4", peran: "Guru Kelas 3" },
      { nama: "Nama Guru 5", peran: "Guru Kelas 4" },
      { nama: "Nama Guru 6", peran: "Guru Kelas 5" },
      { nama: "Nama Guru 7", peran: "Guru Kelas 6" },
      { nama: "Nama Guru 8", peran: "Guru PAI" }
    ],
    ekskul: [
      { nama: "Pramuka", jadwal: "Jumat, 13.30–15.00", pembina: "Guru Pembina" },
      { nama: "BTQ (Baca Tulis Qur'an)", jadwal: "Sabtu, 08.00–10.00", pembina: "Ustadz/Ustadzah" },
      { nama: "Karawitan", jadwal: "Rabu, 14.00–15.30", pembina: "Pamong Seni" },
      { nama: "Futsal", jadwal: "Sabtu, 07.00–09.00", pembina: "Guru Olahraga" },
      { nama: "Menari & Seni Tari", jadwal: "Jumat, 13.30–15.00", pembina: "Guru Seni" },
      { nama: "Robotika / Coding Kids", jadwal: "Jumat, 13.30–15.00", pembina: "Guru TIK" },
      { nama: "Drum Band / Marching Band", jadwal: "Sabtu, 07.00–08.30", pembina: "Instruktur" },
      { nama: "Tahfidz & Hadroh", jadwal: "Senin–Rabu, 06.45–07.15", pembina: "Guru PAI" }
    ],
    unduhan: [
      { judul: "Formulir Pendaftaran Siswa Baru", ket: "PDF — cukup unduh, isi, dan serahkan ke sekolah", file: "#" },
      { judul: "Jadwal Pelajaran Semester Genap", ket: "PDF — jadwal untuk semua kelas", file: "#" },
      { judul: "Kalender Akademik 2025/2026", ket: "PDF — libur dan kegiatan sepanjang tahun", file: "#" },
      { judul: "Panduan Orang Tua / Wali Murid", ket: "PDF — aturan serta tata tertib sekolah", file: "#" }
    ],
    kalender: [
      { tgl: "Juli",    kegiatan: "MPLS (Masa Pengenalan Lingkungan Sekolah)" },
      { tgl: "Agustus", kegiatan: "Peringatan Kemerdekaan RI (Lomba)" },
      { tgl: "September", kegiatan: "Penilaian Tengah Semester (PTS)" },
      { tgl: "Oktober", kegiatan: "Jambore / LDK Pramuka" },
      { tgl: "Desember", kegiatan: "Penilaian Akhir Semester (PAS) + Rapor" },
      { tgl: "Januari", kegiatan: "Awal Semester Genap" },
      { tgl: "Maret",   kegiatan: "Ujian M4L (bila diadakan)" },
      { tgl: "Mei",     kegiatan: "Ujian Sekolah Kelas 6" },
      { tgl: "Juni",    kegiatan: "Pembagian Rapor & Wisuda" }
    ]
  };

  /* ---------- STORAGE ---------- */
  function get() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const d = JSON.parse(raw);
        // gabungkan dengan default agar field-nya lengkap
        return Object.assign({}, bawaan, d, {
          media: Object.assign({}, bawaan.media, d.media || {}),
          pengaturan: Object.assign({}, bawaan.pengaturan, d.pengaturan || {}),
          guru: d.guru || bawaan.guru,
          ekskul: d.ekskul || bawaan.ekskul,
          unduhan: d.unduhan || bawaan.unduhan,
          kalender: d.kalender || bawaan.kalender
        });
      }
    } catch (e) {}
    return JSON.parse(JSON.stringify(bawaan));
  }
  function set(d) { localStorage.setItem(KEY, JSON.stringify(d)); }

  /* ---------- WA FLOAT ---------- */
  function renderWA() {
    const old = document.getElementById("waFloat");
    if (old) old.remove();
    const d = get();
    if (!d.media.waTampil || !d.media.waNomor) return;
    const a = document.createElement("a");
    a.className = "wa-float";
    a.href = "https://wa.me/" + encodeURIComponent(d.media.waNomor) + "?text=" + encodeURIComponent(d.media.waPesan || "Assalamualaikum");
    a.target = "_blank";
    a.rel = "noopener";
    a.title = "Hubungi kami via WhatsApp";
    a.innerHTML = "💬 <span>Chat WhatsApp</span>";
    document.body.appendChild(a);
  }

  /* ---------- INIT ---------- */
  function init() {
    const st = document.createElement("style");
    st.textContent = `
      .wa-float{position:fixed;right:18px;bottom:76px;z-index:95;display:inline-flex;align-items:center;gap:9px;
        background:#25d366;color:#fff;font-weight:700;font-size:.9rem;padding:11px 18px;border-radius:999px;
        box-shadow:0 12px 26px -8px rgba(0,100,0,.55);text-decoration:none;transition:transform .2s}
      .wa-float:hover{transform:translateY(-3px)}
      .wa-float svg{width:20px;height:20px;fill:#fff}
    `;
    document.head.appendChild(st);
    renderWA();
  }
  document.addEventListener("DOMContentLoaded", init);

  return { get, set, renderWA };
})();
