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
  };

  const drinks = {
    "gula-aren": { name: "Kopi Gula Aren", price: "13K", color: "#C9844A" },
    "salted-creamy": { name: "Kopi Salted Creamy", price: "13K", color: "#E8D4B2" },
    amerikano: { name: "Amerikano", price: "10K", color: "#2A1B14" },
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

  if (!form || !canvas) return;

  const ctx = canvas.getContext("2d");

  function selected(name) {
    const field = form.querySelector('[name="' + name + '"]:checked');
    return field ? field.value : "";
  }

  function state() {
    return {
      words: (text.value || examples[0]).trim(),
      sender: (from.value || "").trim(),
      theme: themes[selected("theme")] || themes.classic,
      drink: drinks[selected("drink")] || drinks["gula-aren"],
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

    ctx.fillStyle = theme.accent;
    ctx.font = "64px Nunito, sans-serif";
    ctx.fillText("✦", 86, 168);
    ctx.font = "48px Nunito, sans-serif";
    ctx.fillText("✧", 930, 220);
    ctx.font = "54px Nunito, sans-serif";
    ctx.fillText("♡", 120, 430);
    ctx.fillText("♡", 920, 1480);

    drawCup(ctx, WIDTH / 2 - 58, 168, 116, theme.ink, "#C9844A", "#E8A4A6", "#3D2416");

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

    const badge = drink.name + "  ·  " + drink.price;
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
    ctx.fillStyle = drink.color === "#2A1B14" ? "#F6EFE4" : "#3D2416";
    ctx.fillText(badge, WIDTH / 2, badgeY + 51);

    ctx.fillStyle = theme.soft;
    ctx.font = "700 28px Nunito, sans-serif";
    ctx.fillText("Kopi enak, harga bersahabat ♡", WIDTH / 2, 1568);
    ctx.font = "700 24px Nunito, sans-serif";
    ctx.fillText("tabusi.asrul.dev", WIDTH / 2, 1618);
    ctx.textAlign = "start";
  }

  function render() {
    count.textContent = String((text.value || "").length);
    drawStory(state());
  }

  function caption() {
    const current = state();
    return [
      current.words,
      current.sender ? "— " + current.sender : "",
      current.drink.name + " · " + current.drink.price,
      "Kopi enak, harga bersahabat ♡",
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
  form.addEventListener("change", render);

  copyBtn.addEventListener("click", async function () {
    try {
      await navigator.clipboard.writeText(caption());
      status.textContent = "Caption sudah disalin. Tinggal tempel di Instagram.";
    } catch (error) {
      status.textContent = "Tidak bisa menyalin otomatis. Salin manual dari kotak kata-kata.";
    }
  });

  downloadBtn.addEventListener("click", async function () {
    status.textContent = "Menyiapkan gambar story...";
    downloadBtn.disabled = true;

    try {
      await document.fonts.ready;
      render();
      const blob = await canvasBlob();
      downloadBlob(blob, "tabusi-story.png");
      status.textContent = "Gambar PNG sudah diunduh. Langsung unggah ke Instagram Story.";
    } catch (error) {
      status.textContent = "Gagal mengunduh. Coba lagi, atau pakai tombol Bagikan.";
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
          status.textContent = "Perangkat ini tidak bisa berbagi file. Gambar diunduh saja.";
          return;
        }
        await navigator.share({
          files: [file],
          title: "TABUSI Story",
          text: caption(),
        });
        status.textContent = "Story siap dibagikan.";
      } catch (error) {
        if (error && error.name === "AbortError") {
          status.textContent = "Berbagi dibatalkan.";
          return;
        }
        status.textContent = "Tidak bisa membagikan. Coba unduh gambarnya.";
      }
    });
  }

  text.value = examples[Math.floor(Math.random() * examples.length)];
  render();
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(render);
  }
})();
