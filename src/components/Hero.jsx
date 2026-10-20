export default function Hero() {
  return (
    <section className="hero" id="atas" aria-labelledby="judul">
      <img
        className="hero-logo"
        src="/logo.png"
        width="950"
        height="373"
        alt="paduka by Tabusi"
        fetchPriority="high"
      />
      <h1 id="judul">Jus buah segar</h1>
      <p>
        Mangga, sirsak, buah naga, pisang, melon, persik, alpukat, jambu, dan
        stroberi.
      </p>
      <ol className="jalur">
        <li>Pilih jus</li>
        <li>Bayar QRIS</li>
        <li>Kirim bukti</li>
      </ol>
      <div className="hero-actions">
        <a className="btn btn-ink" href="#meja">
          Ke meja
        </a>
        <a className="btn btn-ghost" href="#bayar">
          Bayar
        </a>
      </div>
    </section>
  );
}
