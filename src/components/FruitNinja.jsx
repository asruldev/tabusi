import { useEffect, useRef, useState } from "react";
import { juices } from "../data";

const GRAVITY = 920;

function isTyping(target) {
  if (!target || typeof target.closest !== "function") return false;
  return Boolean(target.closest("input, textarea, select, [contenteditable='true']"));
}

function hits(px, py, radius, ax, ay, bx, by) {
  const abx = bx - ax;
  const aby = by - ay;
  const len2 = abx * abx + aby * aby;
  const t = len2 === 0 ? 0 : Math.max(0, Math.min(1, ((px - ax) * abx + (py - ay) * aby) / len2));
  const dx = px - (ax + abx * t);
  const dy = py - (ay + aby * t);
  return dx * dx + dy * dy <= radius * radius;
}

export default function FruitNinja({ playTick = 0 }) {
  const [phase, setPhase] = useState("idle");
  const [session, setSession] = useState(0);
  const [hud, setHud] = useState({ score: 0, lives: 3, combo: 0, best: 0 });
  const phaseRef = useRef("idle");
  const bestRef = useRef(0);
  const runRef = useRef(0);
  const running = phase !== "idle";
  const canvasRef = useRef(null);
  const skipTick = useRef(true);

  function start() {
    runRef.current += 1;
    phaseRef.current = "play";
    setHud((prev) => ({ score: 0, lives: 3, combo: 0, best: prev.best }));
    setPhase("play");
    setSession((value) => value + 1);
  }

  function stop() {
    phaseRef.current = "idle";
    setPhase("idle");
  }

  useEffect(() => {
    if (skipTick.current) {
      skipTick.current = false;
      return undefined;
    }
    start();
    return undefined;
  }, [playTick]);

  useEffect(() => {
    function onKey(event) {
      if (event.code !== "Space" && event.code !== "Escape") return;
      if (event.code === "Space") {
        if (isTyping(event.target)) return;
        event.preventDefault();
        if (phaseRef.current === "idle" || phaseRef.current === "over") start();
        return;
      }
      if (phaseRef.current !== "idle") {
        event.preventDefault();
        stop();
      }
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!running) return undefined;
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext("2d");
    const fruits = [];
    const halves = [];
    const bits = [];
    const notes = [];
    const blade = [];
    let pointer = null;
    let score = 0;
    let lives = 3;
    let combo = 0;
    let lastSlice = 0;
    let spawnIn = 0.45;
    let elapsed = 0;
    let grace = 1.1;
    let shake = 0;
    let flash = 0;
    let alive = true;
    let last = performance.now();
    const run = runRef.current;

    function current() {
      return alive && run === runRef.current && phaseRef.current !== "idle";
    }

    function size() {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function view() {
      const rect = canvas.getBoundingClientRect();
      return { w: rect.width, h: rect.height };
    }

    function pointFrom(event) {
      const rect = canvas.getBoundingClientRect();
      return { x: event.clientX - rect.left, y: event.clientY - rect.top, t: performance.now() };
    }

    function burst(x, y, color) {
      for (let i = 0; i < 10; i += 1) {
        const angle = (Math.PI * 2 * i) / 10 + Math.random() * 0.4;
        const speed = 80 + Math.random() * 220;
        bits.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 80,
          r: 3 + Math.random() * 4,
          color,
          life: 0.45 + Math.random() * 0.25,
        });
      }
    }

    function publish() {
      if (!current()) return;
      if (score > bestRef.current) bestRef.current = score;
      setHud({ score, lives: Math.max(0, lives), combo, best: bestRef.current });
    }

    function finish() {
      if (!current()) return;
      phaseRef.current = "over";
      setPhase("over");
      publish();
    }

    function cut(fruit) {
      fruit.gone = true;
      if (fruit.kind === "bomb") {
        lives -= 1;
        combo = 0;
        shake = 12;
        flash = 0.45;
        burst(fruit.x, fruit.y, "#542C05");
        publish();
        if (lives <= 0) finish();
        return;
      }

      const now = performance.now();
      combo = now - lastSlice < 480 ? combo + 1 : 1;
      lastSlice = now;
      score += combo;
      halves.push(
        { ...fruit, side: -1, vx: fruit.vx - 160, vy: fruit.vy - 30, vr: -5, life: 0.7 },
        { ...fruit, side: 1, vx: fruit.vx + 160, vy: fruit.vy - 30, vr: 5, life: 0.7 }
      );
      burst(fruit.x, fruit.y, fruit.juice.color);
      notes.push({
        x: fruit.x,
        y: fruit.y - fruit.r,
        text: combo > 1 ? `×${combo}` : "+1",
        life: 0.7,
      });
      publish();
    }

    function slash(from, to) {
      if (phaseRef.current !== "play") return;
      fruits.forEach((fruit) => {
        if (phaseRef.current !== "play" || fruit.gone) return;
        if (hits(fruit.x, fruit.y, fruit.r, from.x, from.y, to.x, to.y)) cut(fruit);
      });
    }

    function pace() {
      return 1 + Math.min(2.4, elapsed / 14);
    }

    function spawn(w, h, speed) {
      const cap = Math.min(12, 4 + Math.floor(elapsed / 7));
      if (fruits.filter((fruit) => !fruit.gone).length >= cap) return;
      const bomb = Math.random() < 0.12;
      const juice = juices[Math.floor(Math.random() * juices.length)];
      const r = bomb ? 30 : 34 + Math.random() * 8;
      const x = r + 24 + Math.random() * Math.max(40, w - r * 2 - 48);
      fruits.push({
        kind: bomb ? "bomb" : "fruit",
        juice,
        x,
        y: h + r + 8,
        vx: ((w / 2 - x) * (0.25 + Math.random() * 0.45) + (Math.random() - 0.5) * 90) * speed,
        vy: -(760 + Math.random() * 200) * speed,
        r,
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 3.4 * speed,
        gone: false,
      });
    }

    function drawDisc(item, alpha) {
      ctx.save();
      ctx.translate(item.x, item.y);
      ctx.rotate(item.rot);
      ctx.globalAlpha = alpha;
      if (item.side) {
        ctx.beginPath();
        ctx.rect(item.side < 0 ? -item.r - 2 : 2, -item.r - 2, item.r, item.r * 2 + 4);
        ctx.clip();
      }
      ctx.shadowColor = "rgba(84, 44, 5, 0.28)";
      ctx.shadowBlur = 16;
      ctx.shadowOffsetY = 8;
      ctx.beginPath();
      ctx.arc(0, 0, item.r, 0, Math.PI * 2);
      ctx.fillStyle = item.kind === "bomb" ? "#3B2718" : item.juice.color;
      ctx.fill();
      ctx.shadowColor = "transparent";
      ctx.lineWidth = 3;
      ctx.strokeStyle = "rgba(255, 253, 248, 0.92)";
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(-item.r * 0.22, -item.r * 0.28, item.r * 0.28, item.r * 0.16, -0.6, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 253, 248, 0.35)";
      ctx.fill();
      ctx.font = `${Math.round(item.r * 0.92)}px "Apple Color Emoji", "Segoe UI Emoji", sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(item.kind === "bomb" ? "✕" : item.juice.emojis[0], 0, item.r * 0.06);
      ctx.restore();
    }

    function frame(now) {
      if (!current()) return;
      const dt = Math.min(0.034, (now - last) / 1000);
      last = now;
      const { w, h } = view();

      if (phaseRef.current === "play") {
        elapsed += dt;
        grace = Math.max(0, grace - dt);
        spawnIn -= dt;
        if (spawnIn <= 0) {
          const speed = pace();
          const wave = 1 + Math.min(3, Math.floor(elapsed / 6));
          for (let i = 0; i < wave; i += 1) spawn(w, h, speed);
          spawnIn = Math.max(0.28, (1.12 + Math.random() * 0.32) / speed);
        }
      }

      const gravity = GRAVITY * pace() * pace();
      fruits.forEach((fruit) => {
        if (fruit.gone) return;
        fruit.vy += gravity * dt;
        fruit.x += fruit.vx * dt;
        fruit.y += fruit.vy * dt;
        fruit.rot += fruit.vr * dt;
        if (pointer && hits(fruit.x, fruit.y, fruit.r, pointer.x, pointer.y, pointer.x, pointer.y)) {
          cut(fruit);
        }
        if (fruit.gone) return;
        if (fruit.y < h * 0.72) fruit.seen = true;
        if (fruit.y - fruit.r > h + 30 && fruit.vy > 0) {
          fruit.gone = true;
          if (fruit.seen && grace <= 0 && fruit.kind === "fruit" && phaseRef.current === "play") {
            lives -= 1;
            combo = 0;
            publish();
            if (lives <= 0) finish();
          }
        }
      });

      for (let i = fruits.length - 1; i >= 0; i -= 1) {
        if (fruits[i].gone) fruits.splice(i, 1);
      }

      halves.forEach((half) => {
        half.life -= dt;
        half.vy += GRAVITY * dt;
        half.x += half.vx * dt;
        half.y += half.vy * dt;
        half.rot += half.vr * dt;
      });
      for (let i = halves.length - 1; i >= 0; i -= 1) {
        if (halves[i].life <= 0) halves.splice(i, 1);
      }

      bits.forEach((bit) => {
        bit.life -= dt;
        bit.vy += GRAVITY * dt;
        bit.x += bit.vx * dt;
        bit.y += bit.vy * dt;
      });
      for (let i = bits.length - 1; i >= 0; i -= 1) {
        if (bits[i].life <= 0) bits.splice(i, 1);
      }

      notes.forEach((note) => {
        note.life -= dt;
        note.y -= 36 * dt;
      });
      for (let i = notes.length - 1; i >= 0; i -= 1) {
        if (notes[i].life <= 0) notes.splice(i, 1);
      }

      while (blade.length && now - blade[0].t > 140) blade.shift();
      shake = Math.max(0, shake - dt * 28);
      flash = Math.max(0, flash - dt);

      ctx.clearRect(0, 0, w, h);
      ctx.save();
      if (shake > 0) {
        ctx.translate((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake);
      }
      if (flash > 0) {
        ctx.fillStyle = `rgba(196, 59, 104, ${flash * 0.18})`;
        ctx.fillRect(0, 0, w, h);
      }

      halves.forEach((half) => drawDisc(half, Math.max(0, half.life / 0.7)));
      fruits.forEach((fruit) => drawDisc(fruit, 1));

      bits.forEach((bit) => {
        ctx.globalAlpha = Math.max(0, bit.life * 2);
        ctx.fillStyle = bit.color;
        ctx.beginPath();
        ctx.arc(bit.x, bit.y, bit.r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      if (blade.length > 1) {
        ctx.beginPath();
        ctx.moveTo(blade[0].x, blade[0].y);
        for (let i = 1; i < blade.length; i += 1) ctx.lineTo(blade[i].x, blade[i].y);
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.strokeStyle = "rgba(84, 44, 5, 0.35)";
        ctx.lineWidth = 11;
        ctx.stroke();
        ctx.strokeStyle = "rgba(255, 253, 248, 0.95)";
        ctx.lineWidth = 5;
        ctx.stroke();
      }

      ctx.font = "700 28px Fraunces, Georgia, serif";
      ctx.textAlign = "center";
      notes.forEach((note) => {
        ctx.globalAlpha = Math.max(0, note.life);
        ctx.fillStyle = "#542C05";
        ctx.fillText(note.text, note.x, note.y);
      });
      ctx.restore();

      requestAnimationFrame(frame);
    }

    function track(event) {
      const next = pointFrom(event);
      if (pointer) slash(pointer, next);
      else slash(next, next);
      blade.push(next);
      pointer = next;
    }

    function down(event) {
      track(event);
      try {
        canvas.setPointerCapture(event.pointerId);
      } catch {
        /* usapan tetap dihitung meski pointer tidak tertangkap */
      }
    }

    function move(event) {
      if (event.pointerType === "touch" && !event.buttons) return;
      event.preventDefault();
      track(event);
    }

    function up(event) {
      if (event.pointerType === "touch") pointer = null;
    }

    function leave() {
      pointer = null;
    }

    size();
    const resize = () => size();
    window.addEventListener("resize", resize);
    canvas.addEventListener("pointerdown", down);
    canvas.addEventListener("pointermove", move, { passive: false });
    canvas.addEventListener("pointerup", up);
    canvas.addEventListener("pointerleave", leave);
    canvas.addEventListener("pointercancel", leave);
    const raf = requestAnimationFrame(frame);

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointerdown", down);
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerup", up);
      canvas.removeEventListener("pointerleave", leave);
      canvas.removeEventListener("pointercancel", leave);
    };
  }, [running, session]);

  return (
    <>
      <p className="visually-hidden">
        Tekan spasi untuk mulai. Arahkan kursor ke buah untuk mengiris, tanpa klik.
      </p>
      {phase !== "idle" && (
        <div className="iris-layer">
          <canvas ref={canvasRef} aria-hidden="true" />
          <div className="iris-hud">
            <p className="iris-pill">
              Skor {hud.score}
              {hud.combo > 1 ? ` · ×${hud.combo}` : ""}
            </p>
            <p className="iris-pill">Nyawa {hud.lives}</p>
            <button className="iris-pill iris-exit" type="button" onClick={stop}>
              Kembali
            </button>
          </div>
          <p className="iris-tip">Arahkan kursor ke buah, tanpa klik. Esc untuk kembali.</p>
          {phase === "over" && (
            <div className="iris-over" role="status">
              <p className="kicker">Iris selesai</p>
              <p className="iris-score">{hud.score}</p>
              <p>Terbaik {hud.best}</p>
              <button className="btn btn-ink" type="button" onClick={start}>
                Main lagi
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
