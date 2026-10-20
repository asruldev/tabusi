import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const entry = path.resolve(".ssr/entry-server.js");
if (!fs.existsSync(entry)) {
  console.error(fs.readdirSync(".ssr", { recursive: true }));
  throw new Error("Berkas SSR tidak ketemu.");
}

const { render } = await import(pathToFileURL(entry).href);
const templatePath = path.resolve("dist/index.html");
const template = fs.readFileSync(templatePath, "utf8");
const app = render();
const marker = '<div id="root"></div>';
if (!template.includes(marker)) {
  throw new Error("Penanda root tidak ketemu di dist/index.html.");
}

const names = ["Mangga", "Sirsak", "Naga", "Pisang", "Melon", "Persik", "Alpukat", "Jambu", "Stroberi"];
for (const name of names) {
  if (!app.includes(name)) throw new Error(`Prerender kehilangan ${name}.`);
}

const html = template.replace(marker, `<div id="root">${app}</div>`);
fs.writeFileSync(templatePath, html);
fs.rmSync(".ssr", { recursive: true, force: true });
console.log("Prerender beranda selesai.");
