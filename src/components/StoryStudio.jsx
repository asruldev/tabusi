import { useEffect, useRef, useState } from "react";
import { examples, getJuice, juices } from "../data";
import { captionFor, drawStory, getLogo, loadLogo } from "../drawStory";

function StoryCanvas({ story }) {
  const ref = useRef(null);
  const { words, sender, emoji, drink } = story;

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return undefined;
    let cancel = false;

    const paint = (logo) => {
      if (!cancel) drawStory(canvas, { words, sender, emoji, drink }, logo);
    };

    paint(getLogo());
    loadLogo().then(paint);
    document.fonts?.ready?.then(() => paint(getLogo()));

    return () => {
      cancel = true;
    };
  }, [words, sender, emoji, drink]);

  return (
    <canvas
      ref={ref}
      width={1080}
      height={1920}
      role="img"
      aria-label={`Pratinjau story jus ${story.drink.name}`}
    />
  );
}

export default function StoryStudio({
  drinkId,
  words,
  sender,
  emoji,
  pulseKey,
  onWords,
  onSender,
  onEmoji,
  onDrink,
  onPulse,
}) {
  const frameRef = useRef(null);
  const textRef = useRef(null);
  const canvasRef = useRef(null);
  const [status, setStatus] = useState({ message: "", kind: "" });
  const [busy, setBusy] = useState(false);
  const [canShare, setCanShare] = useState(false);
  const drink = getJuice(drinkId);
  const story = {
    words: words.trim() || examples[0],
    sender: sender.trim(),
    emoji,
    drink,
  };

  useEffect(() => {
    setCanShare(typeof navigator.canShare === "function");
  }, []);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame || !pulseKey) return;
    frame.classList.remove("is-updating");
    void frame.offsetWidth;
    frame.classList.add("is-updating");
  }, [pulseKey]);

  function setNote(message, kind) {
    setStatus({ message, kind });
  }

  function shuffle() {
    const current = words.trim();
    const pool = examples.filter((item) => item !== current);
    const next = pool[Math.floor(Math.random() * pool.length)];
    onWords(next);
    onPulse();
    textRef.current?.focus();
  }

  async function paintFresh() {
    await document.fonts?.ready;
    const canvas = canvasRef.current?.querySelector("canvas");
    if (!canvas) return null;
    const logo = await loadLogo();
    drawStory(canvas, story, logo);
    return canvas;
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 2000);
  }

  function canvasBlob(canvas) {
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error("blob"));
      }, "image/png");
    });
  }

  async function downloadStory() {
    setNote("Menyiapkan gambar story...", "");
    setBusy(true);
    try {
      const canvas = await paintFresh();
      const blob = await canvasBlob(canvas);
      downloadBlob(blob, "paduka-story.png");
      setNote("Siap, Paduka. Story-nya sudah diunduh.", "ok");
    } catch {
      setNote("Gagal mengunduh. Coba lagi, atau pakai tombol Bagikan.", "err");
    } finally {
      setBusy(false);
    }
  }

  async function shareStory() {
    setNote("Menyiapkan gambar untuk dibagikan...", "");
    try {
      const canvas = await paintFresh();
      const blob = await canvasBlob(canvas);
      const file = new File([blob], "paduka-story.png", { type: "image/png" });
      if (!navigator.canShare?.({ files: [file] })) {
        downloadBlob(blob, "paduka-story.png");
        setNote("Perangkat ini tidak bisa berbagi file. Gambar diunduh saja.", "ok");
        return;
      }
      await navigator.share({
        files: [file],
        title: "Paduka Story",
        text: captionFor(story),
      });
      setNote("Story siap dibagikan.", "ok");
    } catch (error) {
      if (error && error.name === "AbortError") {
        setNote("Berbagi dibatalkan.", "");
        return;
      }
      setNote("Tidak bisa membagikan. Coba unduh gambarnya.", "err");
    }
  }

  async function copyCaption() {
    try {
      await navigator.clipboard.writeText(captionFor(story));
      setNote("Caption sudah disalin. Tinggal tempel di Instagram.", "ok");
    } catch {
      setNote("Tidak bisa menyalin otomatis. Salin manual dari kotak kata-kata.", "err");
    }
  }

  const nearLimit = words.length >= 120;

  return (
    <section className="story" id="story" aria-labelledby="story-judul">
      <div className="story-intro">
        <p className="kicker">Story</p>
        <h2 id="story-judul">Kata-kata untuk story</h2>
        <p>Tulis, pilih rasa, unduh. Pratinjaunya langsung ikut berubah.</p>
      </div>

      <div className="story-studio">
        <div className="phone-frame" id="phone-frame" ref={frameRef}>
          <p className="preview-label">Lihat hasilnya</p>
          <div className="phone-bezel">
            <div className="phone-notch" aria-hidden="true" />
            <div className="phone-stage" ref={canvasRef}>
              <StoryCanvas story={story} />
            </div>
          </div>
          <p className="preview-hint">Siap diunggah ke Instagram Story, ukuran 9:16</p>
        </div>

        <form
          className="story-form"
          onSubmit={(event) => event.preventDefault()}
        >
          <div className="label-row">
            <label htmlFor="story-text">Kata-katamu</label>
            <button type="button" className="text-btn" onClick={shuffle}>
              Ganti kata
            </button>
          </div>
          <textarea
            id="story-text"
            ref={textRef}
            name="text"
            maxLength={140}
            rows={3}
            value={words}
            placeholder="Tulis di sini, atau tekan Ganti kata."
            onChange={(event) => onWords(event.target.value)}
          />
          <p className={nearLimit ? "char-count is-near" : "char-count"}>
            {words.length}/140
          </p>

          <label htmlFor="story-from">Dari siapa? opsional</label>
          <input
            id="story-from"
            name="from"
            type="text"
            maxLength={28}
            value={sender}
            placeholder="Paduka"
            onChange={(event) => onSender(event.target.value)}
          />

          <fieldset>
            <legend>Pilih rasa</legend>
            <div className="theme-grid">
              {juices.map((juice) => (
                <label key={juice.id} className="theme-card">
                  <input
                    type="radio"
                    name="menu"
                    value={juice.id}
                    checked={juice.id === drinkId}
                    onChange={() => onDrink(juice.id)}
                  />
                  <span className="swatch" style={{ background: juice.swatch }} />
                  <span className="theme-copy">
                    <span>{juice.name}</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <label className="emoji-toggle">
            <input
              type="checkbox"
              name="emoji"
              checked={emoji}
              onChange={(event) => {
                onEmoji(event.target.checked);
                onPulse();
              }}
            />
            <span>Hias dengan emoji</span>
            <span className="emoji-preview" aria-hidden="true">
              {drink.emojis.join(" ")}
            </span>
          </label>

          <div className="story-actions">
            <button type="button" className="btn btn-ink" onClick={downloadStory} disabled={busy}>
              Unduh story
            </button>
            <button type="button" className="btn btn-soft" onClick={shareStory} hidden={!canShare}>
              Bagikan
            </button>
            <button type="button" className="btn btn-ghost" onClick={copyCaption}>
              Salin caption
            </button>
          </div>
          <p className={`status${status.kind ? ` is-${status.kind}` : ""}`} role="status">
            {status.message}
          </p>
        </form>
      </div>
    </section>
  );
}
