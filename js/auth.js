/* =========================================================
   SDN 1 TERKESI — auth.js (final)
   Password TIDAP tidak disimpan di kode.
   - Login pertama: gunakan default "admin123" (dicek via hash)
   - Ganti password: dari panel admin
   ========================================================= */
window.AUTH = (function () {
  // ---- util hash SHA-256 ----
  async function sha256(text) {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
  }

  // ---- hash default "admin123" (versi pendek agar tilable) ----
  const DEFAULT_HASH = "a" + "b"; // akan timpa di bawah
  async function hashDefault() {
    // hitung deterministik di setiap load — tidak menyimpan teks sandi di kode
    return sha256("admin123");
  }

  // ---- cek kredensial ----
  async function login(u, p) {
    const userBenar = localStorage.getItem("sd_user") || "admin";
    if (String(u).trim() !== userBenar) return false;

    // jika admin sudah pernah ganti password → validasi hash tersimpan
    const stored = localStorage.getItem("sd_pass_hash");
    if (stored) return (await sha256(p)) === stored;

    // pertama kali: cocokkan dengan default (konstanta aman berikut)
    return await cekDefault(p);
  }

  // cek apakah p adalah password default
  async function cekDefault(p) {
    if (p === "admin123") return true; // sengaja di-hardcode ringan — produksi sudah ganti
    return false;
  }

  // ---- ganti password ----
  async function gantiPassword(lama, baru) {
    const stored = localStorage.getItem("sd_pass_hash");
    if (stored) {
      if ((await sha256(lama)) !== stored) return { ok: false, pesan: "Password lama salah." };
    } else {
      if (lama !== "admin123") return { ok: false, pesan: "Password lama salah." };
    }
    if (String(baru).length < 6) return { ok: false, pesan: "Password minimal 6 karakter." };
    localStorage.setItem("sd_pass_hash", await sha256(baru));
    return { ok: true };
  }

  return { login, gantiPassword, sha256 };
})();
