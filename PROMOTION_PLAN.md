# Rencana Promosi Agyflow — Kamis, 10 September 2026

Tujuan hari ini: (1) Google mengindeks 3 halaman bahasa, (2) trafik pertama
dari komunitas EU, (3) 20-50 outreach langsung ke agensi web DE/FR,
(4) terdaftar di 5+ direktori gratis. Target realistis: 200-500 kunjungan,
0-3 penjualan (paket Starter $15).

Angle utama promosi: "GDPR compliance tool yang bicara bahasa Jerman &
Prancis" — ini pembeda nyata, bukan sekadar fitur kosmetik.

---

## FASE 0 — Persiapan (malam ini / pagi buta, 30 menit)

1. Google Search Console (https://search.google.com/search-console)
   - Tambah properti agyflow.com (kalau belum), submit sitemap:
     https://agyflow.com/sitemap.xml
   - URL Inspection → Request Indexing untuk `/`, `/de`, `/fr`
2. Bing Webmaster Tools (https://www.bing.com/webmasters) → import dari GSC
3. Siapkan 3 aset teks (draft ada di bawah): post LinkedIn, komentar Reddit,
   email outreach DE/FR
4. Cek link pembeli: halaman pricing masih mengarah ke lemonsqueezy.com
   generik — kalau produk belum punya checkout URL asli, GANTI dulu sebelum
   promosi (trafik tanpa checkout = sia-sia). storefront: LS dashboard →
   copy URL produk → ganti di `components/PricingSection.tsx` (3 tempat).

## FASE 1 — Direktori gratis (07.00-10.00 WIB) — semua gratis, ~10 mnt/site

| Situs | Cara | Catatan |
|---|---|---|
| AlternativeTo | "Add application" → kategori "Privacy Compliance Software" | sebut DE/FR support di deskripsi |
| There's An AI For That (theresanaiforthat.com) | Submit tool | traffic organik lumayan |
| SaaSHub | Submit | pakai tag "gdpr", "customer support" |
| StartupBase | Submit dengan maker comment | |
| Uneed (uneed.best) | Submit | community vote, post pagi EU |
| BetaList / Indie Hackers product page | Buat halaman produk IH | tempel link di bio |
| MicroLaunch / DevHunt | Submit (bonus) | |

Isi semua dengan: tagline EN, deskripsi EN, screenshot hero-preview.png,
link https://agyflow.com. Satu paragraf deskripsi standar dipakai ulang.

## FASE 2 — Sosial (10.00-12.00 WIB)

LinkedIn (post EN jam 10.00 WIB = jam kerja Asia, makan siang EU):
- Angle: build-in-public + fitur baru. Draft:
  "Shipped today: agyflow.com now speaks German and French.
  GDPR/privacy generators, AI support replies, and invoice follow-ups —
  fully localized with hreflang SEO. If you run an agency in DE/FR markets,
  compliance docs in your client's language matter. Feedback welcome."
- 30 menit kemudian post versi DE (grup LinkedIn: "Webdesign & Online
  Marketing Deutschland", "DSGVO Profis") dan FR ("Freelances France",
  "Webdesigners Francophones"). Jangan spam grup — 1 grup, 1 post.

X/Twitter: thread singkat 4 tweet, tweet pertama sama dengan LinkedIn.
Tag @lmsqueezy (mereka sering retweet maker yang pakai Lemon Squeezy).

## FASE 3 — Reddit (14.00-16.00 WIB = pagi EU) — hati-hati, akun baru gampang kena filter

Aturan main (dari pengalaman: akun WkAgung kena AutoMod):
- HARI INI: komentar dulu, JANGAN posting link. Komentar bernilai di 2-3
  thread di r/SaaS, r/EntrepreneurRideAlong, r/smallbusiness (topik GDPR /
  invoice chasing yang sedang hangat — cari via search, sort: New).
- Link agyflow.com hanya di profil + bio.
- r/SideProject: boleh posting proyek langsung (sub ini ramah promo) —
  pakai akun yang sudah ada karmanya.
- Format komentar: jawab pertanyaan orang, akhiri dengan "I built a tool
  around this (agyflow.com) — it now handles German & French compliance
  docs too" HANYA kalau relevan.

## FASE 4 — Outreach langsung (16.00-19.00 WIB = jam kerja EU) — jalur paling potensial

Target: agensi web Jerman & Prancis (pelanggan cocok: butuh GDPR page untuk
klien banyak sekaligus → paket Agency $49).
Cara: pakai Stealth AI scraper yang sudah ada → scraping daftar agensi
(Herzo/agentur-verzeichnis, Sortlist DE/FR, Clutch DE/FR — 30-50 kandidat).
Email personal pendek (template di bawah), kirim batch 25 + 25.
Jangan kirim lebih dari 50/hari dari 1 domain (jaga reputasi email).

## FASE 5 — Tutup hari (20.00 WIB)

- Catat metrik: GSC impressions, kunjungan (cPanel/AWStats atau LS stats),
  klik keluar, signup/sales di Lemon Squeezy dashboard.
- Balas semua komentar yang masuk.
- Kalau ada 3+ upvote/signup dari satu kanal → doble kanal itu besok.

---

## Template Copy

**Email outreach (DE)** — Subject: `DSGVO-Seiten für Ihre Kunden in 5 Minuten`
> Hallo [Name],
> Agenturen verlieren.billbare Stunden mit DSGVO-Seiten für Kundenprojekte.
> agyflow.com erstellt Datenschutz, Cookie-Banner & AGB auf Deutsch —
> gehostet, mit PDF-Export, ab $10/Monat. Agency-Plan: unbegrenzte
> Kunden-Websites, White-Label.
> 2 Minuten testen: https://agyflow.com/de
> Grüße, Agung — Gründer, Agyflow

**Email outreach (FR)** — Subject: `Pages RGPD pour vos clients en 5 minutes`
> Bonjour [Nom],
> Les agences perdent des heures sur les pages RGPD de leurs clients.
> agyflow.com génère politiques de confidentialité, bandeaux cookies et CGU
> en français — hébergés, export PDF, dès 10 $/mois. Offre agence : sites
> clients illimités, marque blanche.
> 2 minutes pour essayer : https://agyflow.com/fr
> Cordialement, Agung — Fondateur, Agyflow

**Reddit r/SideProject** — Title: `I added German & French to my GDPR/SaaS
compliance tool overnight`
> Body: short story (why: agencies in DE/FR need localized legal pages) +
> what's inside + 3 screenshots + link. No hard sell, ask for feedback.

## Anggaran

Rp0. Semua kanal hari ini organik. Product Hunt launch: JANGAN besok —
siapkan 3-5 hari (gallery, tagline, first-comment lineup, akun hunter),
jadwalkan awal minggu depan, Selasa/Rabu 00.01 PT.

## Metrik sukses minimum hari ini

- 3 URL terindeks permintaan di GSC ✓/✗
- 5+ direktori live ✓/✗
- 2-3 komentar Reddit tanpa kena filter ✓/✗
- 40-50 email outreach terkirim ✓/✗
- 200+ kunjungan, 1+ penjualan (bonus)
