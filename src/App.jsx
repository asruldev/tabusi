import { useEffect, useState } from "react";
import { examples, juices } from "./data";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Meja from "./components/Meja";
import Bayar from "./components/Bayar";
import Nampan from "./components/Nampan";
import StoryStudio from "./components/StoryStudio";
import Footer from "./components/Footer";
import FruitNinja from "./components/FruitNinja";

const STORAGE_KEY = "paduka-nampan";

function readNampan() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((line) => line && juices.some((juice) => juice.id === line.id))
      .map((line) => ({
        id: line.id,
        qty: Math.min(9, Math.max(1, Math.round(Number(line.qty)) || 1)),
      }));
  } catch {
    return [];
  }
}

export default function App() {
  const [drinkId, setDrinkId] = useState("mangga");
  const [words, setWords] = useState(examples[0]);
  const [sender, setSender] = useState("");
  const [emoji, setEmoji] = useState(false);
  const [pulseKey, setPulseKey] = useState(0);
  const [lines, setLines] = useState([]);
  const [stored, setStored] = useState(false);
  const [notice, setNotice] = useState("");
  const [playTick, setPlayTick] = useState(0);

  useEffect(() => {
    setLines(readNampan());
    setStored(true);
  }, []);

  useEffect(() => {
    if (!stored) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines, stored]);

  function selectDrink(id, shouldScroll) {
    setDrinkId(id);
    setPulseKey((value) => value + 1);
    if (shouldScroll && typeof document !== "undefined") {
      document.getElementById("story")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function addJuice(id) {
    setLines((prev) => {
      const row = prev.find((line) => line.id === id);
      if (!row) return [...prev, { id, qty: 1 }];
      return prev.map((line) =>
        line.id === id ? { ...line, qty: Math.min(9, line.qty + 1) } : line
      );
    });
    const juice = juices.find((item) => item.id === id);
    setNotice(juice ? `Jus ${juice.name} masuk nampan.` : "");
  }

  function setQty(id, qty) {
    setLines((prev) => {
      if (qty <= 0) return prev.filter((line) => line.id !== id);
      return prev.map((line) =>
        line.id === id ? { ...line, qty: Math.min(9, qty) } : line
      );
    });
  }

  return (
    <>
      <a className="skip-link" href="#konten">
        Loncat ke isi
      </a>
      <div className="page-wash" aria-hidden="true" />
      <p className="visually-hidden" aria-live="polite">
        {notice}
      </p>
      <Header onPlay={() => setPlayTick((value) => value + 1)} />
      <main id="konten">
        <Hero />
        <Meja
          lines={lines}
          onAdd={addJuice}
          onQty={setQty}
          onStory={(id) => selectDrink(id, true)}
        />
        <Bayar lines={lines} onQty={setQty} />
        <StoryStudio
          drinkId={drinkId}
          words={words}
          sender={sender}
          emoji={emoji}
          pulseKey={pulseKey}
          onWords={setWords}
          onSender={setSender}
          onEmoji={setEmoji}
          onDrink={(id) => selectDrink(id, false)}
          onPulse={() => setPulseKey((value) => value + 1)}
        />
      </main>
      <Footer />
      <Nampan lines={lines} />
      <FruitNinja playTick={playTick} />
    </>
  );
}
