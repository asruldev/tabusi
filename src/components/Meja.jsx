import { useState } from "react";
import { juices, racikan } from "../data";
import { rupiah, site } from "../config";

export default function Meja({ lines, onAdd, onQty, onStory }) {
  const [openId, setOpenId] = useState("");

  return (
    <section className="meja" id="meja" aria-labelledby="meja-judul">
      <p className="kicker">Di meja</p>
      <h2 id="meja-judul">Pilih jusnya</h2>
      <p className="lead">
        Satu gelas {rupiah(site.price)}. Tekan Tambah. Jumlahnya bisa diubah
        langsung di sini, lalu lanjut bayar.
      </p>
      <ol className="tempat-list">
        {juices.map((juice, index) => {
          const row = lines.find((line) => line.id === juice.id);
          const qty = row ? row.qty : 0;
          const open = openId === juice.id;
          return (
            <li
              key={juice.id}
              className="tempat"
              style={{
                "--wash": juice.wash,
                "--orb": juice.color,
                animationDelay: `${index * 35}ms`,
              }}
            >
              <span className="tempat-no">{String(index + 1).padStart(2, "0")}</span>
              <div className="tempat-main">
                <h3>{juice.name}</h3>
                <p>{juice.blurb}</p>
              </div>
              <div className="tempat-side">
                <p className="harga">{rupiah(site.price)}</p>
                {qty === 0 ? (
                  <button type="button" className="btn btn-ink" onClick={() => onAdd(juice.id)}>
                    Tambah
                  </button>
                ) : (
                  <span className="qty">
                    <button
                      type="button"
                      aria-label={`Kurangi jus ${juice.name}`}
                      onClick={() => onQty(juice.id, qty - 1)}
                    >
                      −
                    </button>
                    <span key={qty}>{qty}</span>
                    <button
                      type="button"
                      aria-label={`Tambah jus ${juice.name}`}
                      onClick={() => onAdd(juice.id)}
                    >
                      +
                    </button>
                  </span>
                )}
                <button type="button" className="text-btn" onClick={() => onStory(juice.id)}>
                  Story
                </button>
                <button
                  type="button"
                  className="text-btn"
                  aria-expanded={open}
                  aria-controls={`isi-${juice.id}`}
                  onClick={() => setOpenId(open ? "" : juice.id)}
                >
                  {open ? "Tutup isi" : "Lihat isi"}
                </button>
              </div>
              {open ? (
                <div className="isi" id={`isi-${juice.id}`}>
                  <div>
                    <h4>Komposisi</h4>
                    <ul>
                      <li>
                        <strong>Buah.</strong> {juice.buah}
                      </li>
                      <li>
                        <strong>Air.</strong> {racikan.air}
                      </li>
                      <li>
                        <strong>SKM.</strong> {racikan.skm}
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4>Vitamin</h4>
                    <ul>
                      {juice.vitamin.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                    <h4>Gizi lain</h4>
                    <ul>
                      {juice.gizi.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <p className="isi-note">
                    Vitamin dan gizi di atas adalah ciri buahnya. Gelas jadi
                    belum diuji laboratorium, jadi tidak ada angka miligram.
                  </p>
                </div>
              ) : null}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
