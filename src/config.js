export const site = {
  name: "Paduka by Tabusi",
  domain: "https://tabusi.asrul.dev",
  host: "tabusi.asrul.dev",
  tagline: "Segar diminum, harga bersahabat",
  whatsapp: "6281211752502",
  whatsappMessage:
    "Halo Paduka, saya lihat jusnya di tabusi.asrul.dev dan mau pesan.",
  price: 12000,
  qrisImage: "/qris.png",
};

export function rupiah(amount) {
  const digits = String(amount).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `Rp${digits}`;
}

export function proofMessage({ name, note, items, total }) {
  const who = name.trim() || "belum diisi";
  const list = items.map((item) => `- Jus ${item.name} × ${item.qty}`).join("\n");
  return [
    "Halo Paduka, saya sudah membayar lewat QRIS.",
    `Nama: ${who}`,
    "Pesanan:",
    list,
    `Total: ${rupiah(total)}`,
    note.trim() ? `Catatan: ${note.trim()}` : "",
    "Bukti pembayaran saya lampirkan di chat ini.",
  ]
    .filter(Boolean)
    .join("\n");
}

export function whatsappUrl(message = site.whatsappMessage) {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}
