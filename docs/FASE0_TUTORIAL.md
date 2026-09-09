# FASE 0 — Tutorial One-by-One (malam ini, total ±60 menit)

Termasuk langkah agar agyflow.com masuk hasil pencarian TOP Google & Bing.
Ikuti urut. Bagian yang butuh aksi saya ditandai [AKU YANG KERJAKAN].

---

## A. Google Search Console (15 menit) — SYARAT masuk pencarian Google

1. Buka https://search.google.com/search-console → login akun Google.
2. Klik "Add property" → pilih **Domain** → ketik: `agyflow.com` → Continue.
3. Google menampilkan **TXT record** (diawali `google-site-verification=...`).
   COPY kode itu.
4. Login Rumahweb client area (member.rumahweb.com) → pilih domain
   agyflow.com → **DNS Management** → Add Record:
   - Type: `TXT`
   - Host/Name: `@`
   - Value: paste kode dari Google
   - TTL: default → Save
5. Balik ke GSC → klik **Verify**. Kalau gagal, tunggu 5-10 menit lalu ulang
   (DNS butuh waktu propagate).
6. Setelah verified: menu **Sitemaps** (kiri) → ketik `sitemap.xml` → Submit.
   Harus muncul "Success" dengan 3 URL ditemukan (/, /de, /fr).
7. **Request indexing** (penting, mempercepat masuk indeks):
   - Ketik di kolom URL Inspection paling atas: `https://agyflow.com/de`
   - Tunggu "URL is not on Google" → klik **Request Indexing**
   - Ulangi untuk `https://agyflow.com/` dan `https://agyflow.com/fr`

Alternatif kalau DNS ribet: di langkah 2 pilih **URL prefix**, lalu pilih
metode "HTML file", copy isi file verifikasinya → [AKU YANG KERJAKAN] upload
ke public_html via FTP → balik ke GSC klik Verify.

## B. Bing Webmaster Tools (5 menit) — SYARAT masuk pencarian Bing

1. Buka https://www.bing.com/webmasters → **Sign in with Google**
   (pakai akun Google yang sama dengan GSC).
2. Pilih **Import from Google Search Console** → klik Approve/Allow.
   Semua data situs + sitemap otomatis masuk. Selesai.
3. Cek menu **Sitemaps** — kalau sitemap.xml belum ada, tambahkan manual:
   `https://agyflow.com/sitemap.xml` → Submit.
4. (Opsional) Menu SEO Analyzer → jalankan scan untuk /de dan /fr.

Bing juga menekan hasil dari index Google-nya via IndexNow — kalau nanti
mau, saya bisa tambahkan IndexNow key di hosting supaya setiap update halaman
langsung notifikasi ke Bing (bonus, tidak wajib malam ini).

## C. Checkout Lemon Squeezy (20-30 menit) — PALING PENTING, jangan promosi sebelum ini

1. Login https://stores.lemonsqueezy.com (akun LS yang dipakai agyflow).
2. Cek apakah 3 produk sudah ada: **Starter $15/mo, Pro Founder $29/mo,
   Agency Suite $49/mo** (Products menu).
3. Kalau BELUM ada, buat 3 produk:
   - New Product → nama sesuai di atas → harga subscription bulanan
     ($15 / $29 / $49) → aktifkan "Test mode = OFF" → Publish
4. Untuk masing-masing produk: klik produk → **Checkout link** (tombol Copy).
   Bentuknya seperti:
   `https://NAMATOKO.lemonsqueezy.com/buy/xxxx-xxxx`
5. KIRIM 3 URL itu ke saya di chat.
   → [AKU YANG KERJAKAN] pasang ke tombol pricing (EN + DE + FR sekaligus,
   3 tombol × 3 bahasa), `npm run build`, upload via FTP, verify. ±10 menit.
6. VERIFIKASI di live site: buka agyflow.com/#pricing → klik "Choose
   Starter" → harus terbuka halaman checkout LS dengan harga & logo benar.
   ⚠️ JANGAN pernah test checkout pakai CC sendiri (akun LS bisa dibekukan).
   Cukup pastikan halaman checkout TERBUKA dengan harga benar.

Kalau mau pasang sendiri: edit `components/PricingSection.tsx` baris
86, 126, 161 → ganti `href="https://lemonsqueezy.com"` dengan checkout link
masing-masing → `npm run build` → upload isi `out/` ke public_html.

## D. Jalur menuju TOP Google & Bing (strategi, dijalankan bertahap)

Domain baru TIDAK bisa top untuk kata kunci umum ("gdpr generator") dalam
semalam. Jalur realistis ke posisi atas:

**D1. Indexing (malam ini)** — Bagian A + B di atas. Tanpa ini tidak ada
apa-apa. Brand search "agyflow" harus terindeks dalam 1-3 hari.

**D2. Kata kunci target yang realistis (long-tail, kompetisi rendah):**
- DE: `dsgvo datenschutzerklärung generator für agenturen`,
  `cookie banner generator deutsch`, `rechnungserinnerung automatisch tool`
- FR: `générateur politique de confidentialité rgpd`,
  `bandeau cookies rgpd site web`, `relance facture impayée automatique`
- EN: `gdpr privacy policy generator for agencies`, `multilingual ai
  customer support assistant`, `invoice follow up saas freelancer`

**D3. Backlink (besok, Fase 1 rencana promosi)** — sinyal #1 untuk domain
baru. Setiap direktori (AlternativeTo, SaaSHub, Uneed, There's An AI For
That, Indie Hackers) = 1 backlink + 1 jalur trafik. Target 5-8 backlink di
minggu pertama.

**D4. Konten landing per kata kunci (minggu depan)** — halaman khusus mis.
`/de/dsgvo-generator` dan `/fr/generateur-rgpd` dengan 800-1000 kata,
schema FAQ, internal link. Ini yang membuat long-tail DE/FR masuk halaman 1.
[AKU YANG KERJAKAN] — bilang saja, saya buatkan halamannya.

**D5. Sinyal brand** — JSON-LD `sameAs` sudah mengarah ke
twitter.com/agyflow + github.com/agyflow. Buat/buatkan kedua akun itu aktif
(profil = backlink + knowledge panel Google).

**D6. Monitor & iterasi** — setiap Senin cek GSC → Performance: query apa
yang mulai muncul, doble halaman yang menang. Bing → Search Performance.

**Ekspektasi jujur:**
- Hari 1-3: muncul di pencarian nama brand "agyflow" (Google & Bing)
- Minggu 2-8: long-tail DE/FR masuk halaman 1-2 (D3 + D4 jalan)
- Bulan 2-4: head terms (gdpr generator dll) kalau backlink terus tumbuh
