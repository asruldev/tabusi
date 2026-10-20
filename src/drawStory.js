import { themeFor } from "./data";
import { site } from "./config";

const WIDTH = 1080;
const HEIGHT = 1920;

const emojiSpots = [
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

let logo = null;
let pending = null;

export function getLogo() {
  return logo;
}

export function loadLogo() {
  if (logo) return Promise.resolve(logo);
  if (typeof Image === "undefined") return Promise.resolve(null);
  if (!pending) {
    pending = new Promise((resolve) => {
      const image = new Image();
      image.onload = () => {
        logo = image;
        resolve(image);
      };
      image.onerror = () => resolve(null);
      image.src = "/logo.png";
    });
  }
  return pending;
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

function wrapText(context, value, maxWidth) {
  const words = value.split(/\s+/).filter(Boolean);
  const lines = [];
  let line = "";

  words.forEach((word) => {
    const test = line ? `${line} ${word}` : word;
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

function drawEmojiWallpaper(context, drink) {
  const icons = drink.emojis.length ? drink.emojis : ["♡"];
  context.save();
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.globalAlpha = 0.42;
  emojiSpots.forEach((spot, index) => {
    const icon = icons[index % icons.length];
    context.save();
    context.translate(spot[0], spot[1]);
    context.rotate((spot[3] * Math.PI) / 180);
    context.font = `${spot[2]}px Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, sans-serif`;
    context.fillText(icon, 0, 0);
    context.restore();
  });
  context.restore();
}

export function drawStory(canvas, story, logoImage) {
  const context = canvas.getContext("2d");
  const theme = themeFor(story.drink);
  const drink = story.drink;

  context.clearRect(0, 0, WIDTH, HEIGHT);

  const sky = context.createLinearGradient(0, 0, 0, HEIGHT);
  sky.addColorStop(0, theme.top);
  sky.addColorStop(1, theme.bottom);
  context.fillStyle = sky;
  context.fillRect(0, 0, WIDTH, HEIGHT);

  if (story.emoji) {
    drawEmojiWallpaper(context, drink);
  } else {
    context.fillStyle = theme.accent;
    context.globalAlpha = 0.85;
    context.textAlign = "center";
    context.font = "64px Outfit, sans-serif";
    context.fillText("✦", 120, 168);
    context.font = "48px Outfit, sans-serif";
    context.fillText("✧", 960, 240);
    context.font = "54px Outfit, sans-serif";
    context.fillText("♡", 140, 1760);
    context.fillText("♡", 940, 1700);
    context.globalAlpha = 1;
  }

  const logoW = 760;
  const logoH = logoImage ? logoW * (logoImage.height / logoImage.width) : 200;
  const logoY = 210;
  if (logoImage) {
    context.drawImage(logoImage, (WIDTH - logoW) / 2, logoY, logoW, logoH);
  } else {
    context.fillStyle = theme.ink;
    context.textAlign = "center";
    context.font = "560 120px Fraunces, Georgia, serif";
    context.fillText("paduka", WIDTH / 2, logoY + 120);
    context.font = "500 36px Outfit, sans-serif";
    context.fillText("by Tabusi", WIDTH / 2, logoY + 180);
  }

  const cardX = 96;
  const cardY = logoY + logoH + 48;
  const cardW = WIDTH - 192;
  const cardH = 700;
  context.fillStyle = theme.card;
  roundRect(context, cardX, cardY, cardW, cardH, 48);
  context.fill();

  let size = 64;
  let lines = [];
  let lineH = 80;
  const maxWidth = cardW - 96;
  const maxHeight = story.sender ? 460 : 520;

  while (size >= 34) {
    context.font = `700 ${size}px Outfit, sans-serif`;
    lines = wrapText(context, story.words, maxWidth);
    lineH = size * 1.28;
    if (lines.length * lineH <= maxHeight) break;
    size -= 2;
  }

  context.fillStyle = theme.ink;
  context.textAlign = "center";
  context.textBaseline = "alphabetic";
  const blockH = lines.length * lineH + (story.sender ? 70 : 0);
  const textTop = cardY + (cardH - blockH) / 2 + size;
  lines.forEach((line, index) => {
    context.fillText(line, WIDTH / 2, textTop + index * lineH);
  });

  if (story.sender) {
    context.globalAlpha = 0.8;
    context.font = "700 34px Outfit, sans-serif";
    context.fillText(`— ${story.sender}`, WIDTH / 2, cardY + cardH - 64);
    context.globalAlpha = 1;
  }

  const badge = `Jus ${drink.name}`;
  context.font = "700 32px Outfit, sans-serif";
  const badgeW = Math.min(WIDTH - 200, context.measureText(badge).width + 96);
  const badgeX = (WIDTH - badgeW) / 2;
  const badgeY = cardY + cardH + 48;
  context.fillStyle = drink.color;
  roundRect(context, badgeX, badgeY, badgeW, 84, 999);
  context.fill();
  context.strokeStyle = theme.ink;
  context.globalAlpha = 0.16;
  context.lineWidth = 3;
  context.stroke();
  context.globalAlpha = 1;
  context.fillStyle = drink.badgeInk;
  context.fillText(badge, WIDTH / 2, badgeY + 54);

  context.fillStyle = theme.soft;
  context.font = "600 30px Outfit, sans-serif";
  context.fillText(`${site.tagline} ♡`, WIDTH / 2, badgeY + 164);
  context.font = "600 26px Outfit, sans-serif";
  context.fillText(site.host, WIDTH / 2, badgeY + 214);
  context.textAlign = "start";
}

export function captionFor(story) {
  return [
    story.words,
    story.sender ? `— ${story.sender}` : "",
    `Jus ${story.drink.name}`,
    site.tagline,
    site.host,
  ]
    .filter(Boolean)
    .join("\n");
}
