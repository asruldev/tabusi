# TABUSI

Situs pameran kopi [tabusi.asrul.dev](https://tabusi.asrul.dev). Pengunjung bisa melihat menu, menyapa lewat WhatsApp, dan membuat gambar Instagram Story dari kata-katanya.

Ini bukan toko online. Tidak ada keranjang atau checkout.

## Yang perlu diganti sebelum tayang

Nomor WhatsApp ada di `js/config.js`. Ganti nilai `whatsapp` ke format internasional tanpa plus, contoh `62812xxxxxxx`.

## GitHub Pages

1. Push repositori ini ke GitHub.
2. Di pengaturan repositori, nyalakan Pages dari branch `main`, folder `/ (root)`.
3. Custom domain: `tabusi.asrul.dev`. File `CNAME` sudah disiapkan.

## DNS di `asrul.dev`

Buat record CNAME:

- Nama: `tabusi`
- Tujuan: `<username>.github.io`

Setelah DNS merambat, centang HTTPS di pengaturan GitHub Pages.

## Story generator

Pengunjung mengetik kata-kata, memilih suasana, lalu mengunduh gambar 9:16 untuk Instagram Story.
