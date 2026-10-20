import { useState } from "react";
import { getJuice } from "../data";
import { proofMessage, rupiah, site, whatsappUrl } from "../config";

function QrisSeal() {
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  return (
    <figure className="qris-seal">
      <figcaption>
        <span className="qris-mark">QRIS</span>
        <strong>Bayar seharga nampan</strong>
      </figcaption>
      {failed ? (
        <p className="qris-fallback">
          Kode QRIS belum tampil di halaman ini. Kirim pesanan lewat WhatsApp,
          lalu bayar dari kode yang kami balas.
        </p>
      ) : (
        <img
          src={site.qrisImage}
          width="1400"
          height="1972"
          alt="QRIS Paduka by Tabusi Beverages, NMID ID1026604786164"
          className={ready ? "is-ready" : undefined}
          onLoad={() => setReady(true)}
          onError={() => setFailed(true)}
        />
      )}
      <ol className="langkah">
        <li>Scan kode QRIS.</li>
        <li>Masukkan nominal yang sama dengan total.</li>
        <li>Kirim foto buktinya lewat tombol hijau.</li>
      </ol>
    </figure>
  );
}

export default function Bayar({ lines, onQty }) {
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const items = lines.map((line) => ({
    ...line,
    name: getJuice(line.id).name,
    color: getJuice(line.id).color,
  }));
  const count = items.reduce((sum, item) => sum + item.qty, 0);
  const total = count * site.price;
  const href = whatsappUrl(proofMessage({ name, note, items, total }));

  return (
    <section className="bayar" id="bayar" aria-labelledby="bayar-judul">
      <p className="kicker">Ujung meja</p>
      <h2 id="bayar-judul">Bayar, lalu kirim bukti</h2>
      <p className="lead">
        Cek gelasnya, bayar lewat QRIS sebesar total, lalu kirim foto bukti ke
        WhatsApp.
      </p>

      {items.length === 0 ? (
        <div className="bayar-kosong">
          <p>Nampan masih kosong. Pilih jus di meja dulu.</p>
          <a className="btn btn-ink" href="#meja">
            Ke meja
          </a>
        </div>
      ) : (
        <div className="bayar-sheet">
          <div>
            <ul className="bill">
              {items.map((item) => (
                <li key={item.id}>
                  <span className="bill-swatch" style={{ background: item.color }} aria-hidden="true" />
                  <span className="bill-name">Jus {item.name}</span>
                  <span className="qty">
                    <button
                      type="button"
                      aria-label={`Kurangi jus ${item.name}`}
                      onClick={() => onQty(item.id, item.qty - 1)}
                    >
                      −
                    </button>
                    <span>{item.qty}</span>
                    <button
                      type="button"
                      aria-label={`Tambah jus ${item.name}`}
                      onClick={() => onQty(item.id, item.qty + 1)}
                    >
                      +
                    </button>
                  </span>
                  <span className="bill-sub">{rupiah(site.price * item.qty)}</span>
                </li>
              ))}
            </ul>
            <p className="bill-total">
              <span>Total</span>
              <strong>{rupiah(total)}</strong>
            </p>

            <label htmlFor="nama-pemesan">Nama di bukti</label>
            <input
              id="nama-pemesan"
              type="text"
              maxLength={40}
              value={name}
              placeholder="Nama kamu"
              onChange={(event) => setName(event.target.value)}
            />

            <label htmlFor="catatan">Catatan, opsional</label>
            <input
              id="catatan"
              type="text"
              maxLength={80}
              value={note}
              placeholder="Kurang manis, tanpa es"
              onChange={(event) => setNote(event.target.value)}
            />

            <a className="btn btn-wa bill-send" href={href} target="_blank" rel="noopener noreferrer">
              Kirim bukti ke WhatsApp
            </a>
            <p className="bill-hint">
              Chat terbuka dengan rincian nampan. Lampirkan tangkapan layar
              pembayaran di situ.
            </p>
          </div>
          <QrisSeal />
        </div>
      )}
    </section>
  );
}
