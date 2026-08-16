/**
 * audit du site : crawle toutes les pages internes depuis la home,
 * vérifie chaque lien, collecte erreurs console, titres, h1, alt manquants.
 * usage : npm run build && npm run start &  puis  node scripts/audit.mjs
 * sortie : docs/AUDIT.md
 */
import { chromium } from "playwright";
import { writeFileSync } from "node:fs";

const BASE = process.env.AUDIT_BASE ?? "http://localhost:3000";
const OUT = new URL("../docs/AUDIT.md", import.meta.url).pathname;

const SEEDS = [
  "/",
  "/recherche?ville=paris",
  "/recherche?ville=londres",
  "/recherche?ville=new-york",
  "/pro",
  "/pro/annonces",
  "/pro/annonces/nouvelle",
];

const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH ?? "/opt/pw-browsers/chromium",
});
const ctx = await browser.newContext({ viewport: { width: 1440, height: 960 } });

const visited = new Map(); // path -> report
const externals = new Map(); // href -> [pages]
const apiLinks = new Map(); // path -> status (vérifiés en HTTP simple, pas en navigation)
const queue = [...SEEDS];

function normalize(href) {
  try {
    const u = new URL(href, BASE);
    if (u.origin !== new URL(BASE).origin) return { external: u.href };
    return { internal: u.pathname + u.search };
  } catch {
    return { invalid: href };
  }
}

while (queue.length) {
  const path = queue.shift();
  if (visited.has(path)) continue;

  const page = await ctx.newPage();
  const consoleErrors = [];
  page.on("pageerror", (e) => consoleErrors.push(`pageerror: ${e.message}`));
  page.on("console", (m) => {
    const t = m.text();
    // les ressources externes (photos, tuiles) sont bloquées dans la sandbox : on les ignore
    if (m.type() === "error" && !t.includes("ERR_TUNNEL") && !t.includes("Failed to load resource"))
      consoleErrors.push(t.slice(0, 160));
  });

  let status = 0;
  try {
    const resp = await page.goto(BASE + path, { waitUntil: "load", timeout: 30000 });
    status = resp?.status() ?? 0;
    await page.waitForTimeout(1200);
  } catch (e) {
    visited.set(path, { status: "ERREUR", error: String(e).slice(0, 120) });
    await page.close();
    continue;
  }

  const data = await page.evaluate(() => {
    const links = [...document.querySelectorAll("a[href]")].map((a) => a.getAttribute("href"));
    const imgsNoAlt = [...document.querySelectorAll("img:not([alt])")].length;
    const h1s = [...document.querySelectorAll("h1")].map((h) => h.textContent?.trim() ?? "");
    const inputsNoLabel = [...document.querySelectorAll("input, select, textarea")].filter(
      (el) => el.id && !document.querySelector(`label[for="${el.id}"]`) && el.type !== "checkbox"
    ).length;
    return { title: document.title, links, imgsNoAlt, h1s, inputsNoLabel };
  });

  for (const href of data.links) {
    if (!href || href.startsWith("mailto:") || href.startsWith("tel:")) continue;
    const n = normalize(href);
    if (n.internal) {
      const clean = n.internal;
      if (clean.startsWith("/api/")) {
        if (!apiLinks.has(clean)) apiLinks.set(clean, null);
      } else if (!visited.has(clean) && !queue.includes(clean)) queue.push(clean);
    } else if (n.external) {
      if (!externals.has(n.external)) externals.set(n.external, []);
      if (!externals.get(n.external).includes(path)) externals.get(n.external).push(path);
    }
  }

  visited.set(path, {
    status,
    title: data.title,
    h1: data.h1s[0] ?? "—",
    h1Count: data.h1s.length,
    imgsNoAlt: data.imgsNoAlt,
    inputsNoLabel: data.inputsNoLabel,
    consoleErrors,
  });
  await page.close();
}

// endpoints api (pdf…) : simple requête http, pas de navigation
for (const path of apiLinks.keys()) {
  try {
    const res = await fetch(BASE + path);
    apiLinks.set(path, `${res.status} ${res.headers.get("content-type") ?? ""}`.trim());
  } catch (e) {
    apiLinks.set(path, `ERREUR ${String(e).slice(0, 60)}`);
  }
}

await browser.close();

// ---- rapport ----
const now = "2026-08-16";
const rows = [...visited.entries()];
const broken = rows.filter(([, r]) => r.status !== 200);
const withErrors = rows.filter(([, r]) => (r.consoleErrors ?? []).length > 0);

let md = `# audit du site — ${now}

Généré par \`scripts/audit.mjs\` (crawler Playwright sur ${BASE}).

## synthèse

- pages internes crawlées : **${rows.length}**
- pages en erreur (≠ 200) : **${broken.length}**
- pages avec erreurs JS console : **${withErrors.length}**
- liens externes détectés : **${externals.size}** (non vérifiables depuis la
  sandbox — voir section dédiée)

## pages internes

| page | statut | titre | h1 | img sans alt | champs sans label | erreurs js |
| --- | --- | --- | --- | --- | --- | --- |
`;

for (const [path, r] of rows) {
  md += `| \`${path}\` | ${r.status} | ${r.title ?? "—"} | ${r.h1 ?? "—"}${
    (r.h1Count ?? 1) > 1 ? ` (${r.h1Count} h1 !)` : ""
  } | ${r.imgsNoAlt ?? "—"} | ${r.inputsNoLabel ?? "—"} | ${
    (r.consoleErrors ?? []).length || "0"
  } |\n`;
}

if (withErrors.length) {
  md += `\n### détail des erreurs js\n\n`;
  for (const [path, r] of withErrors) {
    md += `- \`${path}\` :\n`;
    for (const e of r.consoleErrors) md += `  - ${e}\n`;
  }
}

if (apiLinks.size) {
  md += `\n## endpoints api (fiches pdf…)\n\n| endpoint | statut |\n| --- | --- |\n`;
  for (const [path, status] of apiLinks) md += `| \`${path}\` | ${status} |\n`;
}

md += `\n## liens externes (footer « sites officiels », etc.)

Le proxy réseau de l'environnement de développement bloque les domaines
externes : ces liens sont donc **à vérifier depuis un navigateur normal**
(ouvrir chaque lien une fois la démo déployée sur vercel).

| lien | présent sur |
| --- | --- |
`;
for (const [href, pages] of externals) {
  const where =
    pages.length >= rows.length * 0.8
      ? `footer — toutes les pages (${pages.length})`
      : pages.map((p) => `\`${p}\``).join(", ");
  md += `| ${href} | ${where} |\n`;
}

md += `\n## limites connues / dette

- photos et fonds de carte servis par des cdn externes (unsplash, carto) :
  placeholders en attendant la photothèque officielle akelius
- les biens sont des données de démonstration — l'import du stock réel
  nécessite l'accès au site akelius.fr (bloqué depuis la sandbox de dev)
- liens externes non testables automatiquement depuis la sandbox (voir
  ci-dessus)
`;

writeFileSync(OUT, md);
console.log(`audit écrit dans docs/AUDIT.md — ${rows.length} pages, ${broken.length} erreurs, ${externals.size} liens externes`);
if (broken.length) {
  for (const [p, r] of broken) console.log(`  ✗ ${p} → ${r.status} ${r.error ?? ""}`);
  process.exitCode = 1;
}
