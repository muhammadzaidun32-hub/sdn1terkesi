# 📖 PANDUAN WEBSITE SDN 1 TERKESI
### Untuk pengelola sekolah — tanpa perlu paham coding

---

## 1. MELIHAT WEBSITE

**Cara paling mudah:**
1. Buka folder `SDN 1 TERKESI`
2. Klik dua kali (double-click) file **`index.html`**
3. Website akan terbuka di browser (Chrome/Edge/Firefox)

**Cara via internet (setelah diunggah):**
> Website ini sudah diterbitkan di Vercel:
> **https://sdn1terkesi.vercel.app**
>
> Link ini bisa dibagikan ke warga, orang tua siswa, dan masyarakat.

---

## 2. MENGUBAH ISI WEBSITE (TANPA CODING)

Semua konten diubah lewat **Halaman Admin**:

**Langkah membuka admin:**
1. Buka file **`admin.html`** (double-click) → muncul halaman "Panel Admin Sekolah"
2. Isi:
   - **Username**: `admin`
   - **Password**: `admin123`
3. Klik **"Masuk"** → otomatis masuk ke editor

**Yang bisa Anda ubah:**

| Menu | Fungsi |
|---|---|
| ⚡ Pengaturan Cepat | Tombol ON/OFF: buka/tutup PPDB, tampil/sembunyikan tombol WhatsApp |
| 💬 WhatsApp | Ganti nomor WhatsApp + pesan otomatis |
| 🏫 Identitas Sekolah | Nama sekolah, NPSN, alamat, telepon, email |
| 🖼️ Hero Beranda | Judul besar + deskripsi + foto di halaman depan |
| 👤 Kepala Sekolah | Nama, sambutan, dan foto kepala sekolah |
| 👩‍🏫 Daftar Guru | Tambah/hapus guru + foto (klik "+ Tambah Guru") |
| ⚽ Program & Ekskul | Kartu program: pramuka, BTQ, karawitan, futsal, dll |
| 📰 Berita | Tambah/hapus berita & pengumuman sekolah |
| 📅 Kalender Sekolah | Tambah/hapus agenda per bulan |
| ⬇️ Unduhan | Tempel link Google Drive untuk formulir/dokumen |

> 💡 **Ganti foto**: klik tombol pilih foto → ambil dari HP/komputer → foto muncul otomatis. Foto disimpan di dalam browser (localStorage), tidak perlu internet untuk melihat.

> 💡 **Simpan**: klik **"💾 Simpan Perubahan"** setelah selesai mengedit. Lalu buka `index.html` untuk melihat hasilnya.

---

## 3. MENGUBAH PASSWORD ADMIN

1. Masuk ke admin (admin/admin123)
2. Scroll ke bawah → bagian **"🔑 Ganti Password Admin"**
3. Isi password lama dan password baru (minimal 6 huruf)
4. Klik **"Ganti Password"** → selesai!

> ⚠️ **PENTING**: Segera ganti password default `admin123` menjadi password Anda sendiri agar situs aman.

---

## 4. MENGELOLA DATA PENDAFTAR PPDB

1. Semua anak yang mendaftar lewat formulir online tersimpan otomatis.
2. Untuk melihat: buka **admin.html** → bagian **"📥 Data Pendaftar PPDB"**
3. Klik **"🔄 Muat Data"** → tabel pendaftar muncul.
4. Klik **"📊 Ekspor CSV (Excel)"** → file Excel terunduh, bisa dicetak/cetak ulang.

> 🔒 Data ini **hanya tampil di halaman admin** (password), tidak tampil di website publik.

---

## 5. MENERBITKAN / DEPLOY WEBSITE

Website ini sudah LIVE di Vercel. Jika ingin memperbarui setelah edit:

**Cara cepat (via Vercel CLI):**
```bash
# buka Command Prompt / PowerShell di folder ini
vercel --prod
```
Tunggu ±30 detik → website terbaru otomatis online.

**Cara lewat GitHub + Vercel:**
1. Unggah folder ini ke repo GitHub
2. Hubungkan repo ke Vercel (vercel.com/new)
3. Setiap perubahan di GitHub langsung ter-update ke website

> Panduan lengkap tersedia di **PANDUAN-DEPLOY.md**

---

## 6. TAMBAHAN: DATA DISIMPAN DI GOOGLE SPREADSHEET / DRIVE

Jika ingin Google Spreadsheet sebagai tempat penyimpanan data:

1. Buat Google Spreadsheet baru di sheets.google.com
2. Buka Google Apps Script (script.google.com)
3. Tempel kode dari file **`google-apps-script.gs`** (lihat file terpisah)
4. Klik **Deploy → Aplikasi web** → salin URL yang muncul
5. Salin URL itu ke admin → bagian WhatsApp/PPDB settings

> Foto siswa/guru bisa disimpan di Google Drive dan ditautkan lewat menu **Unduhan** di admin.

---

## 7. STRUKTUR FILE

```
SDN 1 TERKESI/
├── index.html      ← Beranda (halaman depan)
├── profil.html     ← Profil sekolah + daftar guru
├── program.html    ← Program & ekskul
├── jadwal.html     ← Jadwal pelajaran + kalender
├── ppdb.html       ← Pendaftaran online + cek status
├── berita.html     ← Berita & pengumuman
├── galeri.html     ← Galeri foto (klik untuk membesar)
├── unduhan.html    ← Dokumen unduhan
├── kontak.html     ← Kontak & formulir pesan
├── admin.html      ← Panel admin (password)
└── css/ , js/      ← Desain & kode
```

---

## 8. PUSAT BANTUAN

- **WhatsApp**: klik tombol hijau melayang di kanan bawah website
- **Email**: sdn1terkesi@gmail.com
- **Desainer**: Kang Zaed 🎨

---

*Terima kasih. Semoga bermanfaat untuk kemajuan pendidikan di Desa Terkesi!* 🙏
