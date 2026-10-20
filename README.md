# Paduka by Tabusi

Situs jus buah [tabusi.asrul.dev](https://tabusi.asrul.dev). Pengunjung menyusun pesanan di nampan, membayar dengan QRIS, lalu mengirim bukti lewat WhatsApp. Story Instagram tetap bisa dibuat.

Rasa yang dijual: mangga, sirsak, naga, pisang, melon, persik, alpukat, jambu, dan stroberi.

## Menjalankan

```bash
npm install
npm run dev
```

`npm run build` menghasilkan folder `dist`. HTML beranda sudah berisi teks menu, jadi isinya tetap terbaca tanpa menjalankan JavaScript.

## Yang perlu dicek

Nomor WhatsApp dan harga satu gelas ada di `src/config.js`. Nomor memakai format internasional tanpa plus, contoh `62812xxxxxxx`. Ubah `price` kalau harga gelas berubah.

QRIS yang dipakai statis: pembeli memasukkan nominal sendiri, sesuai total nampan. Gambarnya ada di `public/qris.png`, disalin dari `assets/qris.PNG`.

Logo web diambil dari `assets/logo.PNG`, lalu dipotong menjadi `public/logo.png`.

## GitHub Pages

Sumber terbitan adalah GitHub Actions, bukan folder root.

1. Push ke branch `main`.
2. Di pengaturan repositori, Pages → Build and deployment → Source: **GitHub Actions**.
3. Workflow `.github/workflows/pages.yml` membangun situs dan menerbitkannya.
4. Domain tetap `tabusi.asrul.dev`. File `CNAME` ikut terbawa di hasil build.

## DNS di `asrul.dev`

Record CNAME:

- Nama: `tabusi`
- Tujuan: `<username>.github.io`

Setelah DNS merambat, nyalakan HTTPS di pengaturan GitHub Pages.
