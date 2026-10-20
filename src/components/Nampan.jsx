import { getJuice } from "../data";
import { rupiah, site } from "../config";

export default function Nampan({ lines }) {
  const count = lines.reduce((sum, line) => sum + line.qty, 0);
  const total = count * site.price;

  return (
    <aside className="nampan" aria-label="Nampan pesanan">
      <div className="nampan-dots" aria-hidden="true">
        {lines.slice(0, 6).map((line) => (
          <span key={line.id} style={{ background: getJuice(line.id).color }} />
        ))}
      </div>
      <p key={count} className="nampan-sum" aria-live="polite">
        {count === 0 ? "Belum ada jus" : `${count} gelas · ${rupiah(total)}`}
      </p>
      <a className="nampan-go" href={count === 0 ? "#meja" : "#bayar"}>
        {count === 0 ? "Pilih jus" : "Lanjut bayar"}
      </a>
    </aside>
  );
}
