import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { pages, staticRedirects, toolCount } from "./src/catalog.mjs";
import { LANGS } from "./src/i18n.mjs";
import {
  pagePath,
  renderNotFound,
  renderPage,
  renderRobots,
  renderRoot,
  renderSitemap,
} from "./src/render.mjs";
import { SITE_URL } from "./site.config.mjs";

const root = path.dirname(fileURLToPath(import.meta.url));

async function writeText(file, contents) {
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, contents);
}

export function renderRedirects() {
  const lines = staticRedirects().map((rule) => `${rule.from} ${rule.to} ${rule.status}`);
  return `${lines.join("\n")}\n`;
}

export async function writeSite(distDir) {
  await rm(distDir, { recursive: true, force: true });
  await mkdir(distDir, { recursive: true });
  const assets = path.join(distDir, "assets");
  await mkdir(assets, { recursive: true });
  await writeFile(path.join(assets, "site.css"), await readFile(path.join(root, "src", "site.css")));
  await writeFile(path.join(assets, "calc.js"), await readFile(path.join(root, "src", "calc.js")));
  await writeFile(
    path.join(assets, "country-sourdough.webp"),
    await readFile(path.join(root, "src", "country-sourdough.webp")),
  );
  await writeFile(path.join(assets, "formula.mjs"), await readFile(path.join(root, "src", "formula.mjs")));
  await writeFile(path.join(distDir, "favicon.svg"), await readFile(path.join(root, "src", "favicon.svg")));
  await writeFile(path.join(distDir, "favicon.ico"), await readFile(path.join(root, "src", "favicon.ico")));
  await writeText(path.join(distDir, "index.html"), renderRoot());
  await writeText(path.join(distDir, "404.html"), renderNotFound());
  await writeText(path.join(distDir, "robots.txt"), renderRobots());
  await writeText(path.join(distDir, "sitemap.xml"), renderSitemap());
  await writeText(path.join(distDir, "_redirects"), renderRedirects());
  for (const page of pages) {
    for (const lang of LANGS) {
      const pathname = pagePath(lang, page.slug[lang]);
      await writeText(path.join(distDir, pathname, "index.html"), renderPage(page, lang));
    }
  }
  return { pages: pages.length, tools: toolCount(), languages: LANGS.length };
}

async function main() {
  const distDir = path.resolve(root, "dist");
  const stats = await writeSite(distDir);
  const robots = await readFile(path.join(distDir, "robots.txt"), "utf8");
  const sample = await readFile(
    path.join(distDir, "en", "70-hydration-sourdough-calculator", "index.html"),
    "utf8",
  );
  const sitemap = await readFile(path.join(distDir, "sitemap.xml"), "utf8");
  if (!robots.includes(`Sitemap: ${SITE_URL}/sitemap.xml`)) {
    throw new Error("robots.txt is missing the sitemap URL");
  }
  if (!sample.includes(`${SITE_URL}/en/70-hydration-sourdough-calculator/`)) {
    throw new Error("sample page is missing its canonical URL");
  }
  const urlCount = sitemap.split("<loc>").length - 1;
  if (urlCount !== stats.pages * stats.languages) {
    throw new Error(`sitemap has ${urlCount} urls, expected ${stats.pages * stats.languages}`);
  }
  console.log(
    `Wrote ${stats.pages} pages x ${stats.languages} languages (${stats.tools} long-tail pages per language) to ${distDir}`,
  );
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await main();
}
