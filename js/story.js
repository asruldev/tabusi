(function () {
  const WIDTH = 1080;
  const HEIGHT = 1920;

  const themes = {
    classic: {
      top: "#F6EFE4",
      bottom: "#E8D9C4",
      ink: "#3D2416",
      soft: "#6B4A38",
      accent: "#D98689",
      card: "rgba(255, 250, 243, 0.78)",
    },
    aren: {
      top: "#F8E3C4",
      bottom: "#C9844A",
      ink: "#3D2416",
      soft: "#5A3A22",
      accent: "#FFF6E8",
      card: "rgba(255, 246, 232, 0.62)",
    },
    creamy: {
      top: "#FFFAF2",
      bottom: "#E8D4B2",
      ink: "#3D2416",
      soft: "#6B4A38",
      accent: "#D98689",
      card: "rgba(255, 255, 255, 0.7)",
    },
    amerikano: {
      top: "#3D2416",
      bottom: "#1B120C",
      ink: "#F6EFE4",
      soft: "#E8D4B2",
      accent: "#E8A4A6",
      card: "rgba(255, 250, 243, 0.1)",
    },
    alpukat: {
      top: "#F3F7E6",
      bottom: "#8FB36A",
      ink: "#2F3D1C",
      soft: "#4F6330",
      accent: "#F6EFE4",
      card: "rgba(255, 250, 243, 0.7)",
    },
    mangga: {
      top: "#FFF6DE",
      bottom: "#F0A202",
      ink: "#4A2E0C",
      soft: "#6B4312",
      accent: "#FFF6E8",
      card: "rgba(255, 250, 243, 0.68)",
    },
    pisang: {
      top: "#FFF9E6",
      bottom: "#E8C547",
      ink: "#4A3A12",
      soft: "#6B5420",
      accent: "#FFF6E8",
      card: "rgba(255, 250, 243, 0.7)",
    },
    naga: {
      top: "#FDE8F0",
      bottom: "#D94A7A",
      ink: "#4A1230",
      soft: "#6B2A48",
      accent: "#FDE8F0",
      card: "rgba(255, 250, 243, 0.72)",
    },
    jamu: {
      top: "#F6EFDA",
      bottom: "#C4A35A",
      ink: "#3D2E12",
      soft: "#5C4820",
      accent: "#FFF6E8",
      card: "rgba(255, 250, 243, 0.7)",
    },
    teahzy: {
      top: "#F9F0EA",
      bottom: "#D9A08A",
      ink: "#4A2C24",
      soft: "#6B4338",
      accent: "#FFF6E8",
      card: "rgba(255, 250, 243, 0.72)",
    },
  };

  const drinks = {
    "gula-aren": {
      name: "Kopi Gula Aren",
      price: "13K",
      color: "#C9844A",
      ink: "#3D2416",
      kind: "kopi",
      theme: "aren",
      beans: ["#C9844A", "#E8A4A6", "#3D2416"],
      emojis: ["☕", "🌴", "🤎"],
    },
    "salted-creamy": {
      name: "Kopi Salted Creamy",
      price: "13K",
      color: "#E8D4B2",
      ink: "#3D2416",
      kind: "kopi",
      theme: "creamy",
      beans: ["#E8D4B2", "#E8A4A6", "#C9844A"],
      emojis: ["☕", "🥛", "🤍"],
    },
    amerikano: {
      name: "Amerikano",
      price: "10K",
      color: "#2A1B14",
      ink: "#F6EFE4",
      kind: "kopi",
      theme: "amerikano",
      beans: ["#C9844A", "#E8A4A6", "#3D2416"],
      emojis: ["☕", "🖤", "🫘"],
    },
    alpukat: {
      name: "Jus Alpukat",
      price: "12K",
      color: "#7FA35A",
      ink: "#F6EFE4",
      kind: "jus",
      theme: "alpukat",
      beans: ["#7FA35A", "#C5D98A", "#4F6330"],
      emojis: ["🥑", "💚", "🍃"],
    },
    mangga: {
      name: "Jus Mangga",
      price: "12K",
      color: "#F0A202",
      ink: "#3D2416",
      kind: "jus",
      theme: "mangga",
      beans: ["#F0A202", "#F5C97A", "#C9844A"],
      emojis: ["🥭", "🧡", "☀️"],
    },
    pisang: {
      name: "Jus Pisang",
      price: "12K",
      color: "#E8C547",
      ink: "#3D2416",
      kind: "jus",
      theme: "pisang",
      beans: ["#E8C547", "#FFF1B0", "#C9844A"],
      emojis: ["🍌", "💛", "✨"],
    },
    naga: {
      name: "Jus Buah Naga",
      price: "12K",
      color: "#D94A7A",
      ink: "#F6EFE4",
      kind: "jus",
      theme: "naga",
      beans: ["#D94A7A", "#F4A4C0", "#8A2A4E"],
      emojis: ["🐉", "🩷", "🌸"],
    },
    "jamu-rancin": {
      name: "Jamu Rancin",
      price: "10K",
      color: "#C4A35A",
      ink: "#3D2416",
      kind: "jamu",
      theme: "jamu",
      beans: ["#C4A35A", "#A3B18A", "#8A6A32"],
      emojis: ["🍋", "🍯", "🌿"],
    },
    teahzy: {
      name: "Teahzy",
      price: "12K",
      color: "#D9A08A",
      ink: "#3D2416",
      kind: "teh",
      theme: "teahzy",
      beans: ["#D9A08A", "#F3D5C0", "#C9844A"],
      emojis: ["🍵", "🥛", "🤍"],
    },
  };

  const examples = [
    "Kopi enak, hati lebih ringan.",
    "Siang ini pelan saja. Kopi dulu, urusan belakangan.",
    "Silahkan Paduka, satu teguk dulu.",
    "Hari boleh ramai, kopinya tetap tenang.",
    "Manis sedikit, pulang jadi lebih baik.",
    "Strong & simple. Always on point.",
    "Creamy, lembut, pas di lidah.",
    "Kalau capek, jangan dipaksa. Kopi dulu.",
    "Rezeki datang pelan, kopinya jangan ditunggu lama.",
    "Untuk yang lagi butuh jeda sejenak.",
    "Bukan buru-buru. Ini soal rasa.",
    "Kopi enak, harga bersahabat.",
    "Ambil napas. Teguk pelan. Lanjut lagi.",
    "Paduka lapar urusan, TABUSI siapkan kopinya.",
    "Sedikit manis, banyak tenang.",
    "Cuma nenteng kopi, tapi berani nantang dunia.",
    "Alpukatnya lembut, siangnya jadi tenang.",
    "Mangga manis, mood langsung naik.",
    "Pisang creamy, kenyangnya pas.",
    "Buah naga seger, mata ikut melek.",
    "Kopi atau jus, yang penting pelan dulu.",
    "Jamu Rancin: jahe, sereh, nipis, madu.",
    "Pelan-pelan rapi, mulai dari jamunya.",
    "Teahzy creamy, lembut di lidah.",
    "Tehnya lembut, siangnya jadi tenang.",
  ];

  const form = document.getElementById("story-form");
  const text = document.getElementById("story-text");
  const from = document.getElementById("story-from");
  const canvas = document.getElementById("story-canvas");
  const count = document.getElementById("char-now");
  const status = document.getElementById("story-status");
  const downloadBtn = document.getElementById("download-story");
  const shareBtn = document.getElementById("share-story");
  const copyBtn = document.getElementById("copy-caption");
  const shuffleBtn = document.getElementById("shuffle-text");
  const emojiPreview = document.getElementById("emoji-preview");
  const phoneFrame = document.getElementById("phone-frame");
  const charCount = document.querySelector(".char-count");

  if (!form || !canvas) return;

  const ctx = canvas.getContext("2d");

  function taglineFor(drink) {
    if (drink.kind === "jus") return "Jus seger, harga bersahabat ♡";
    if (drink.kind === "jamu") return "Hangat diminum, harga bersahabat ♡";
    if (drink.kind === "teh") return "Lembut diminum, harga bersahabat ♡";
    return "Kopi enak, harga bersahabat ♡";
  }

  function selected(name) {
    const field = form.querySelector('[name="' + name + '"]:checked');
    return field ? field.value : "";
  }

  function state() {
    const drink = drinks[selected("menu")] || drinks["gula-aren"];
    return {
      words: (text.value || examples[0]).trim(),
      sender: (from.value || "").trim(),
      theme: themes[drink.theme] || themes.classic,
      drink: drink,
      emoji: Boolean(form.emoji && form.emoji.checked),
    };
  }

  function roundRect(context, x, y, w, h, r) {
    const radius = Math.min(r, w / 2, h / 2);
    context.beginPath();
    context.moveTo(x + radius, y);
    context.arcTo(x + w, y, x + w, y + h, radius);
    context.arcTo(x + w, y + h, x, y + h, radius);
    context.arcTo(x, y + h, x, y, radius);
    context.arcTo(x, y, x + w, y, radius);
    context.closePath();
  }

  function drawSpaced(context, value, x, y, spacing) {
    const chars = value.split("");
    const widths = chars.map(function (ch) {
      return context.measureText(ch).width;
    });
    const total =
      widths.reduce(function (sum, width) {
        return sum + width;
      }, 0) +
      spacing * Math.max(0, chars.length - 1);
    let cursor = x - total / 2;
    context.textAlign = "left";
    chars.forEach(function (ch, index) {
      context.fillText(ch, cursor, y);
      cursor += widths[index] + spacing;
    });
    context.textAlign = "center";
  }

  function wrapText(context, value, maxWidth) {
    const words = value.split(/\s+/).filter(Boolean);
    const lines = [];
    let line = "";

    words.forEach(function (word) {
      const test = line ? line + " " + word : word;
      if (context.measureText(test).width > maxWidth && line) {
        lines.push(line);
        line = word;
      } else {
        line = test;
      }
    });

    if (line) lines.push(line);
    return lines.length ? lines : [value];
  }

  function drawCup(context, x, y, size, ink, beanA, beanB, beanC) {
    context.save();
    context.translate(x, y);
    context.scale(size / 64, size / 72);
    context.strokeStyle = ink;
    context.lineWidth = 2.6;
    context.lineCap = "round";
    context.lineJoin = "round";

    context.beginPath();
    context.moveTo(18, 28);
    context.bezierCurveTo(18, 18, 24, 13.5, 32, 13.5);
    context.bezierCurveTo(40, 13.5, 46, 18, 46, 28);
    context.stroke();

    context.beginPath();
    context.moveTo(31, 10);
    context.quadraticCurveTo(32.4, 15.5, 31, 20.5);
    context.stroke();

    context.beginPath();
    context.moveTo(16, 29.5);
    context.lineTo(48, 29.5);
    context.lineTo(45.8, 59.8);
    context.quadraticCurveTo(45.4, 66, 42.3, 66);
    context.lineTo(21.7, 66);
    context.quadraticCurveTo(18.6, 66, 18.2, 59.8);
    context.closePath();
    context.stroke();

    context.fillStyle = beanA;
    context.beginPath();
    context.arc(25, 48, 3.2, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = beanB;
    context.beginPath();
    context.arc(32.5, 52.5, 3.2, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = beanC;
    context.beginPath();
    context.arc(39.2, 47.6, 3.2, 0, Math.PI * 2);
    context.fill();
    context.restore();
  }

  function drawEmojiWallpaper(drink) {
    const icons = drink.emojis && drink.emojis.length ? drink.emojis : ["♡"];
    const spots = [
      [90, 130, 72, -18],
      [980, 170, 64, 12],
      [200, 320, 58, 8],
      [860, 360, 70, -10],
      [70, 520, 62, 16],
      [1010, 560, 54, -14],
      [160, 880, 68, 6],
      [940, 920, 60, -8],
      [80, 1120, 56, 14],
      [1000, 1180, 72, -12],
      [140, 1480, 64, 10],
      [900, 1520, 58, -16],
      [70, 1720, 66, 8],
      [980, 1780, 70, -6],
      [520, 160, 52, 4],
      [430, 1840, 60, -4],
      [680, 1860, 54, 10],
      [300, 640, 50, -20],
      [780, 680, 48, 18],
      [540, 1680, 46, 0],
    ];

    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.globalAlpha = 0.42;
    spots.forEach(function (spot, index) {
      const icon = icons[index % icons.length];
      ctx.save();
      ctx.translate(spot[0], spot[1]);
      ctx.rotate((spot[3] * Math.PI) / 180);
      ctx.font =
        spot[2] +
        "px Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, sans-serif";
      ctx.fillText(icon, 0, 0);
      ctx.restore();
    });
    ctx.restore();
  }

  function drawStory(current) {
    const theme = current.theme;
    const drink = current.drink;

    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    const sky = ctx.createLinearGradient(0, 0, 0, HEIGHT);
    sky.addColorStop(0, theme.top);
    sky.addColorStop(1, theme.bottom);
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    ctx.fillStyle = theme.accent;
    ctx.globalAlpha = 0.22;
    ctx.beginPath();
    ctx.arc(140, 210, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(940, 280, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    if (current.emoji) {
      drawEmojiWallpaper(drink);
    } else {
      ctx.fillStyle = theme.accent;
      ctx.font = "64px Nunito, sans-serif";
      ctx.fillText("✦", 86, 168);
      ctx.font = "48px Nunito, sans-serif";
      ctx.fillText("✧", 930, 220);
      ctx.font = "54px Nunito, sans-serif";
      ctx.fillText("♡", 120, 430);
      ctx.fillText("♡", 920, 1480);
    }

    drawCup(
      ctx,
      WIDTH / 2 - 58,
      168,
      116,
      theme.ink,
      drink.beans[0],
      drink.beans[1],
      drink.beans[2]
    );

    ctx.fillStyle = theme.ink;
    ctx.font = "800 28px Nunito, sans-serif";
    ctx.textAlign = "center";
    drawSpaced(ctx, "TABUSI", WIDTH / 2, 360, 14);

    ctx.font = "700 92px Fredoka, Nunito, sans-serif";
    ctx.fillText("Silahkan", WIDTH / 2, 490);
    ctx.fillStyle = theme.accent;
    ctx.font = "700 108px Caveat, cursive";
    ctx.fillText("Paduka ♡", WIDTH / 2, 610);

    const cardX = 96;
    const cardY = 700;
    const cardW = WIDTH - 192;
    const cardH = 620;
    ctx.fillStyle = theme.card;
    roundRect(ctx, cardX, cardY, cardW, cardH, 48);
    ctx.fill();

    let size = 64;
    let lines = [];
    let lineH = 80;
    const maxWidth = cardW - 88;
    const maxHeight = current.sender ? 360 : 420;

    while (size >= 34) {
      ctx.font = "800 " + size + "px Nunito, sans-serif";
      lines = wrapText(ctx, current.words, maxWidth);
      lineH = size * 1.28;
      if (lines.length * lineH <= maxHeight) break;
      size -= 2;
    }

    ctx.fillStyle = theme.ink;
    ctx.textAlign = "center";
    const textTop = cardY + (cardH - lines.length * lineH - (current.sender ? 70 : 0)) / 2 + size;
    lines.forEach(function (line, index) {
      ctx.fillText(line, WIDTH / 2, textTop + index * lineH);
    });

    if (current.sender) {
      ctx.globalAlpha = 0.8;
      ctx.font = "700 34px Nunito, sans-serif";
      ctx.fillText("— " + current.sender, WIDTH / 2, cardY + cardH - 56);
      ctx.globalAlpha = 1;
    }

    const badge = drink.price ? drink.name + "  ·  " + drink.price : drink.name;
    ctx.font = "800 30px Nunito, sans-serif";
    const badgeW = Math.min(WIDTH - 200, ctx.measureText(badge).width + 88);
    const badgeX = (WIDTH - badgeW) / 2;
    const badgeY = 1388;
    ctx.fillStyle = drink.color;
    roundRect(ctx, badgeX, badgeY, badgeW, 78, 999);
    ctx.fill();
    ctx.strokeStyle = theme.ink;
    ctx.globalAlpha = 0.18;
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.fillStyle = drink.ink;
    ctx.fillText(badge, WIDTH / 2, badgeY + 51);

    const tagline = taglineFor(drink);
    ctx.fillStyle = theme.soft;
    ctx.font = "700 28px Nunito, sans-serif";
    ctx.fillText(tagline, WIDTH / 2, 1568);
    ctx.font = "700 24px Nunito, sans-serif";
    ctx.fillText("tabusi.asrul.dev", WIDTH / 2, 1618);
    ctx.textAlign = "start";
  }

  function setStatus(message, kind) {
    status.textContent = message;
    status.classList.toggle("is-ok", kind === "ok");
    status.classList.toggle("is-err", kind === "err");
  }

  function pulsePreview() {
    if (!phoneFrame) return;
    phoneFrame.classList.remove("is-updating");
    void phoneFrame.offsetWidth;
    phoneFrame.classList.add("is-updating");
  }

  function pickExample(avoid) {
    const pool = examples.filter(function (item) {
      return item !== avoid;
    });
    const source = pool.length ? pool : examples;
    return source[Math.floor(Math.random() * source.length)];
  }

  function applyMenu(id, shouldScroll) {
    const radio = form.querySelector('[name="menu"][value="' + id + '"]');
    if (!radio) return;
    radio.checked = true;
    render();
    pulsePreview();
    if (shouldScroll) {
      document.getElementById("story").scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function render() {
    const length = (text.value || "").length;
    count.textContent = String(length);
    if (charCount) charCount.classList.toggle("is-near", length >= 120);
    const current = state();
    if (emojiPreview) {
      emojiPreview.textContent = (current.drink.emojis || []).join(" ");
    }
    drawStory(current);
  }

  function caption() {
    const current = state();
    return [
      current.words,
      current.sender ? "— " + current.sender : "",
      current.drink.price
        ? current.drink.name + " · " + current.drink.price
        : current.drink.name,
      taglineFor(current.drink),
      "tabusi.asrul.dev",
    ]
      .filter(Boolean)
      .join("\n");
  }

  function canvasBlob() {
    return new Promise(function (resolve, reject) {
      canvas.toBlob(function (blob) {
        if (blob) resolve(blob);
        else reject(new Error("blob"));
      }, "image/png");
    });
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(function () {
      URL.revokeObjectURL(url);
    }, 2000);
  }

  form.addEventListener("input", render);
  form.addEventListener("change", function (event) {
    render();
    if (event.target && (event.target.name === "menu" || event.target.name === "emoji")) {
      pulsePreview();
    }
  });

  if (shuffleBtn) {
    shuffleBtn.addEventListener("click", function () {
      text.value = pickExample(text.value.trim());
      render();
      pulsePreview();
      text.focus();
    });
  }

  document.querySelectorAll("[data-menu]").forEach(function (card) {
    card.setAttribute("tabindex", "0");
    card.setAttribute("role", "button");
    card.setAttribute("title", "Pakai rasa ini di story");
    card.addEventListener("click", function () {
      applyMenu(card.getAttribute("data-menu"), true);
    });
    card.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        applyMenu(card.getAttribute("data-menu"), true);
      }
    });
  });

  copyBtn.addEventListener("click", async function () {
    try {
      await navigator.clipboard.writeText(caption());
      setStatus("Caption sudah disalin. Tinggal tempel di Instagram.", "ok");
    } catch (error) {
      setStatus("Tidak bisa menyalin otomatis. Salin manual dari kotak kata-kata.", "err");
    }
  });

  downloadBtn.addEventListener("click", async function () {
    setStatus("Menyiapkan gambar story...", "");
    downloadBtn.disabled = true;

    try {
      await document.fonts.ready;
      render();
      const blob = await canvasBlob();
      downloadBlob(blob, "tabusi-story.png");
      setStatus("Siap, Paduka. Story-nya sudah diunduh ♡", "ok");
    } catch (error) {
      setStatus("Gagal mengunduh. Coba lagi, atau pakai tombol Bagikan.", "err");
    } finally {
      downloadBtn.disabled = false;
    }
  });

  if (shareBtn && navigator.canShare) {
    shareBtn.hidden = false;
    shareBtn.addEventListener("click", async function () {
      status.textContent = "Menyiapkan gambar untuk dibagikan...";
      try {
        await document.fonts.ready;
        render();
        const blob = await canvasBlob();
        const file = new File([blob], "tabusi-story.png", { type: "image/png" });
        if (!navigator.canShare({ files: [file] })) {
          downloadBlob(blob, "tabusi-story.png");
          setStatus("Perangkat ini tidak bisa berbagi file. Gambar diunduh saja.", "ok");
          return;
        }
        await navigator.share({
          files: [file],
          title: "TABUSI Story",
          text: caption(),
        });
        setStatus("Story siap dibagikan. Semoga yang lihat jadi haus ♡", "ok");
      } catch (error) {
        if (error && error.name === "AbortError") {
          setStatus("Berbagi dibatalkan.", "");
          return;
        }
        setStatus("Tidak bisa membagikan. Coba unduh gambarnya.", "err");
      }
    });
  }

  text.value = examples[Math.floor(Math.random() * examples.length)];
  render();
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(render);
  }
})();
