import { useEffect, useRef, useState } from "react";
import { juices } from "../data";

const GRAVITY = 920;
const JUTSU = [
  { id: "kage", keys: ["KeyQ", "KeyW", "KeyE"], name: "Kagebunshin" },
  { id: "raiton", keys: ["KeyJ", "KeyJ"], name: "Raiton" },
  { id: "futon", keys: ["KeyA", "KeyD"], name: "Futon" },
  { id: "kawarimi", keys: ["KeyS", "KeyS"], name: "Kawarimi" },
];

const TONES = [
  [523, 0.09, "triangle"],
  [659, 0.08, "sine"],
  [784, 0.07, "triangle"],
  [880, 0.06, "sine"],
  [392, 0.11, "triangle"],
  [988, 0.06, "square"],
];

function unlockAudio(audioRef) {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return null;
  if (!audioRef.current) audioRef.current = new AudioCtx();
  if (audioRef.current.state === "suspended") audioRef.current.resume();
  return audioRef.current;
}

function playTone(audioRef, freq, duration, type) {
  const ctx = unlockAudio(audioRef);
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const now = ctx.currentTime;
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.07, now + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + duration + 0.02);
}

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
  const audioRef = useRef(null);
  const skipTick = useRef(true);

  function start() {
    unlockAudio(audioRef);
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
    const winds = [];
    const bolts = [];
    const chord = [];
    let pointer = null;
    let swordAngle = -Math.PI * 0.78;
    let jutsuAt = 0;
    let raiton = 0;
    let pointScale = 1;
    let shout = null;
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

    function cut(fruit, quiet) {
      fruit.gone = true;
      if (fruit.kind === "bomb") {
        lives -= 1;
        combo = 0;
        shake = 12;
        flash = 0.45;
        burst(fruit.x, fruit.y, "#542C05");
        if (!quiet) playTone(audioRef, 110, 0.16, "square");
        publish();
        if (lives <= 0) finish();
        return;
      }

      if (!quiet) {
        const [freq, duration, type] = TONES[Math.floor(Math.random() * TONES.length)];
        playTone(audioRef, freq * (0.94 + Math.random() * 0.14), duration, type);
      }

      const now = performance.now();
      combo = now - lastSlice < 480 ? combo + 1 : 1;
      lastSlice = now;
      score += combo * pointScale;
      const gained = fruit.kind === "jus" && lives < 5;
      if (gained) lives += 1;
      halves.push(
        { ...fruit, side: -1, vx: fruit.vx - 160, vy: fruit.vy - 30, vr: -5, life: 0.7 },
        { ...fruit, side: 1, vx: fruit.vx + 160, vy: fruit.vy - 30, vr: 5, life: 0.7 }
      );
      burst(fruit.x, fruit.y, fruit.juice.color);
      notes.push({
        x: fruit.x,
        y: fruit.y - fruit.r,
        text: gained ? "+nyawa" : combo > 1 ? `×${combo}` : "+1",
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
        kind: bomb ? "bomb" : Math.random() < 0.5 ? "jus" : "fruit",
        juice,
        x,
        y: h + r + 8,
        vx: ((w / 2 - x) * (0.25 + Math.random() * 0.45) + (Math.random() - 0.5) * 90) * speed,
        vy: -Math.sqrt(2 * GRAVITY * Math.max(320, h + r + 8 - Math.max(36, h * 0.06))) *
          (0.92 + Math.random() * 0.08) *
          speed,
        r,
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 3.4 * speed,
        gone: false,
      });
    }

    function clipHalf(item) {
      if (!item.side) return;
      ctx.beginPath();
      ctx.rect(item.side < 0 ? -item.r - 2 : 2, -item.r - 2, item.r, item.r * 2 + 4);
      ctx.clip();
    }

    function drawGlass(item, alpha) {
      const r = item.r;
      ctx.save();
      ctx.translate(item.x, item.y);
      ctx.rotate(item.rot);
      ctx.globalAlpha = alpha;
      clipHalf(item);
      ctx.shadowColor = "rgba(84, 44, 5, 0.28)";
      ctx.shadowBlur = 16;
      ctx.shadowOffsetY = 8;
      ctx.beginPath();
      ctx.moveTo(-r * 0.72, -r * 0.42);
      ctx.lineTo(-r * 0.4, r * 0.58);
      ctx.quadraticCurveTo(0, r * 0.8, r * 0.4, r * 0.58);
      ctx.lineTo(r * 0.72, -r * 0.42);
      ctx.closePath();
      ctx.fillStyle = item.juice.color;
      ctx.fill();
      ctx.shadowColor = "transparent";
      ctx.lineWidth = 3;
      ctx.strokeStyle = "rgba(255, 253, 248, 0.92)";
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(0, -r * 0.42, r * 0.72, r * 0.16, 0, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 253, 248, 0.62)";
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(-r * 0.28, 0.02 * r, r * 0.07, r * 0.28, 0, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 253, 248, 0.4)";
      ctx.fill();
      ctx.restore();
    }

    function drawDisc(item, alpha) {
      if (item.kind === "jus") {
        drawGlass(item, alpha);
        return;
      }
      ctx.save();
      ctx.translate(item.x, item.y);
      ctx.rotate(item.rot);
      ctx.globalAlpha = alpha;
      clipHalf(item);
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

      raiton = Math.max(0, raiton - dt);
      pointScale = raiton > 0 ? 2 : 1;
      const timeScale = raiton > 0 ? 0.42 : 1;

      if (phaseRef.current === "play") {
        elapsed += dt;
        grace = Math.max(0, grace - dt);
        spawnIn -= dt * timeScale;
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
        fruit.vy += gravity * dt * timeScale;
        fruit.x += fruit.vx * dt * timeScale;
        fruit.y += fruit.vy * dt * timeScale;
        fruit.rot += fruit.vr * dt * timeScale;
        if (pointer && hits(fruit.x, fruit.y, fruit.r, pointer.x, pointer.y, pointer.x, pointer.y)) {
          cut(fruit);
        }
        if (fruit.gone) return;
        if (fruit.y < h * 0.72) fruit.seen = true;
        if (fruit.y - fruit.r > h + 30 && fruit.vy > 0) {
          fruit.gone = true;
          if (fruit.seen && grace <= 0 && fruit.kind !== "bomb" && phaseRef.current === "play") {
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

      winds.forEach((wind) => {
        wind.life -= dt;
        wind.x += wind.speed * dt;
      });
      for (let i = winds.length - 1; i >= 0; i -= 1) {
        if (winds[i].life <= 0) winds.splice(i, 1);
      }
      bolts.forEach((bolt) => {
        bolt.life -= dt;
      });
      for (let i = bolts.length - 1; i >= 0; i -= 1) {
        if (bolts[i].life <= 0) bolts.splice(i, 1);
      }
      if (shout) {
        shout.life -= dt;
        if (shout.life <= 0) shout = null;
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
      if (raiton > 0) {
        ctx.fillStyle = "rgba(110, 168, 255, 0.1)";
        ctx.fillRect(0, 0, w, h);
      }

      winds.forEach((wind) => {
        ctx.globalAlpha = Math.max(0, wind.life * 2);
        ctx.strokeStyle = "rgba(255, 253, 248, 0.95)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(wind.x, wind.y);
        ctx.lineTo(wind.x + wind.len, wind.y);
        ctx.stroke();
      });
      bolts.forEach((bolt) => {
        ctx.beginPath();
        ctx.moveTo(bolt.pts[0].x, bolt.pts[0].y);
        bolt.pts.forEach((point) => ctx.lineTo(point.x, point.y));
        ctx.globalAlpha = Math.max(0, bolt.life * 2.4);
        ctx.strokeStyle = "#F7FBFF";
        ctx.lineWidth = 2.5;
        ctx.stroke();
        ctx.globalAlpha = Math.max(0, bolt.life);
        ctx.strokeStyle = "#6EA8FF";
        ctx.lineWidth = 6;
        ctx.stroke();
      });
      ctx.globalAlpha = 1;

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

      if (pointer) drawSword(pointer.x, pointer.y, swordAngle);
      if (shout) {
        ctx.globalAlpha = Math.min(1, shout.life);
        ctx.font = "700 52px Fraunces, Georgia, serif";
        ctx.textAlign = "center";
        ctx.fillStyle = shout.color;
        ctx.fillText(shout.name, w / 2, h * 0.4);
        ctx.globalAlpha = 1;
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

    function drawSword(x, y, angle) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.shadowColor = "rgba(84, 44, 5, 0.35)";
      ctx.shadowBlur = 10;
      ctx.shadowOffsetY = 4;
      ctx.beginPath();
      ctx.moveTo(1, 0);
      ctx.lineTo(-7, 5.5);
      ctx.lineTo(-96, 2.2);
      ctx.lineTo(-100, 0);
      ctx.lineTo(-96, -2.2);
      ctx.lineTo(-7, -5.5);
      ctx.closePath();
      const steel = ctx.createLinearGradient(0, -6, 0, 6);
      steel.addColorStop(0, "#FFFFFF");
      steel.addColorStop(0.5, "#D7DEE8");
      steel.addColorStop(1, "#8D9AAB");
      ctx.fillStyle = steel;
      ctx.fill();
      ctx.shadowColor = "transparent";
      ctx.lineWidth = 1.25;
      ctx.strokeStyle = "#3A2418";
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-12, 1.1);
      ctx.quadraticCurveTo(-52, 3.2, -92, 0.8);
      ctx.strokeStyle = "rgba(255, 253, 248, 0.8)";
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(-104, 0, 5, 12, 0, 0, Math.PI * 2);
      ctx.fillStyle = "#542C05";
      ctx.fill();
      ctx.strokeStyle = "#C6A15B";
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-108, -3.2);
      ctx.lineTo(-138, -2.2);
      ctx.lineTo(-138, 2.2);
      ctx.lineTo(-108, 3.2);
      ctx.closePath();
      ctx.fillStyle = "#24160F";
      ctx.fill();
      ctx.strokeStyle = "#C6A15B";
      ctx.lineWidth = 1.3;
      for (let i = 0; i < 5; i += 1) {
        const wrap = -112 - i * 5;
        ctx.beginPath();
        ctx.moveTo(wrap, -3);
        ctx.lineTo(wrap - 3, 3);
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.arc(-141, 0, 3.3, 0, Math.PI * 2);
      ctx.fillStyle = "#C6A15B";
      ctx.fill();
      ctx.restore();
    }

    function zig(x0, y0, x1, y1) {
      const pts = [{ x: x0, y: y0 }];
      const steps = 6;
      for (let i = 1; i < steps; i += 1) {
        pts.push({
          x: x0 + ((x1 - x0) * i) / steps + (Math.random() - 0.5) * 46,
          y: y0 + ((y1 - y0) * i) / steps + (Math.random() - 0.5) * 34,
        });
      }
      pts.push({ x: x1, y: y1 });
      bolts.push({ pts, life: 0.38 });
    }

    function cast(id, w, h) {
      const names = { kage: "Kagebunshin", futon: "Futon", raiton: "Raiton", kawarimi: "Kawarimi" };
      const colors = { kage: "#542C05", futon: "#3E6B4F", raiton: "#1E4E8C", kawarimi: "#8A5A2B" };
      shout = { name: names[id], life: 1.05, color: colors[id] };
      if (id === "kage") {
        playTone(audioRef, 523, 0.12, "triangle");
        playTone(audioRef, 784, 0.16, "triangle");
        fruits.filter((fruit) => !fruit.gone && fruit.kind !== "bomb").forEach((fruit) => cut(fruit, true));
        return;
      }
      if (id === "futon") {
        playTone(audioRef, 174, 0.24, "sine");
        fruits.forEach((fruit) => {
          if (fruit.gone) return;
          fruit.vy = -(980 + Math.random() * 240);
          fruit.vx += (Math.random() - 0.5) * 160;
        });
        for (let i = 0; i < 16; i += 1) {
          winds.push({
            x: -120 - Math.random() * 80,
            y: Math.random() * h,
            len: 70 + Math.random() * 150,
            speed: 820 + Math.random() * 420,
            life: 0.35 + Math.random() * 0.25,
          });
        }
        return;
      }
      if (id === "kawarimi") {
        playTone(audioRef, 349, 0.16, "sine");
        playTone(audioRef, 523, 0.2, "triangle");
        if (lives < 5) {
          lives += 1;
          publish();
        }
        return;
      }
      playTone(audioRef, 988, 0.07, "square");
      playTone(audioRef, 1480, 0.09, "square");
      raiton = 3;
      flash = 0.2;
      const targets = fruits.filter((fruit) => !fruit.gone && fruit.kind !== "bomb");
      targets.forEach((fruit) => zig(w * 0.5, 0, fruit.x, fruit.y));
    }

    function onJutsuKey(event) {
      if (phaseRef.current !== "play" || event.repeat || isTyping(event.target)) return;
      if (!JUTSU.some((jutsu) => jutsu.keys.includes(event.code))) return;
      event.preventDefault();
      const now = performance.now();
      if (now - jutsuAt < 1500) return;
      chord.push({ code: event.code, t: now });
      while (chord.length && now - chord[0].t > 1200) chord.shift();
      const found = JUTSU.find((jutsu) => {
        if (chord.length < jutsu.keys.length) return false;
        const tail = chord.slice(-jutsu.keys.length);
        return tail.every((item, index) => item.code === jutsu.keys[index]);
      });
      if (!found) return;
      chord.length = 0;
      jutsuAt = now;
      const { w, h } = view();
      cast(found.id, w, h);
    }

    function track(event) {
      unlockAudio(audioRef);
      const next = pointFrom(event);
      if (pointer) {
        const dx = next.x - pointer.x;
        const dy = next.y - pointer.y;
        if (dx * dx + dy * dy > 9) {
          const aim = Math.atan2(dy, dx);
          let turn = aim - swordAngle;
          while (turn > Math.PI) turn -= Math.PI * 2;
          while (turn < -Math.PI) turn += Math.PI * 2;
          swordAngle += turn * 0.55;
        }
        slash(pointer, next);
      } else slash(next, next);
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
    window.addEventListener("keydown", onJutsuKey);
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
      window.removeEventListener("keydown", onJutsuKey);
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
        Tekan spasi untuk mulai. Jurus: QWE Kagebunshin, AD Futon, JJ Raiton, SS Kawarimi. Memotong gelas jus menambah nyawa.
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
          <p className="iris-tip">
            <span>QWE Kagebunshin · AD Futon · JJ Raiton · SS Kawarimi</span>
            <span>Arahkan kursor, tanpa klik. Potong jus, nyawa bertambah. Esc untuk kembali.</span>
          </p>
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
