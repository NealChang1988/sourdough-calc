import assert from "node:assert/strict";
import { mkdtemp, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { writeSite } from "../build.mjs";
import { SITE_URL } from "../site.config.mjs";
import { pages, toolCount } from "./catalog.mjs";
import { formatAmount } from "./formula.mjs";
import { renderPage } from "./render.mjs";

test("each language has 150 to 200 long-tail pages", () => {
  const count = toolCount();
  assert.ok(count >= 150 && count <= 200, `long-tail count ${count}`);
});

test("home page shows the 500 g reference recipe", () => {
  const home = pages.find((page) => page.id === "home");
  const html = renderPage(home, "en");
  assert.match(html, /id="out-water">375 g/);
  assert.match(html, /id="out-starter">100 g/);
  assert.match(html, /id="out-salt">10 g/);
  assert.match(html, /id="out-total">985 g/);
  assert.match(html, /id="out-effective">77\.3%/);
  assert.match(html, new RegExp(`rel="canonical" href="${SITE_URL}/en/"`));
  assert.match(html, /hreflang="zh-CN"/);
  assert.match(html, /hreflang="zh-TW"/);
  assert.match(html, /hreflang="x-default" href="[^"]+\/en\/"/);
});

test("sample long-tail pages keep their titles and language tags", () => {
  const hydration = pages.find((page) => page.id === "hydration-70");
  const pizza = pages.find((page) => page.id === "pizza-neapolitan-6");
  const focaccia = pages.find((page) => page.id === "bread-focaccia");
  assert.equal(hydration.title.en, "70% Hydration Sourdough Calculator");
  assert.equal(pizza.title.en, "Neapolitan Pizza Dough for 6 Balls");
  assert.equal(focaccia.title.en, "Focaccia Baker's Percentage");
  const tw = renderPage(hydration, "zh-tw");
  assert.match(tw, /<html lang="zh-TW">/);
  assert.match(tw, /<h1>70% 水合酸種計算<\/h1>/);
  assert.match(tw, /hreflang="en"/);
  const focacciaTw = renderPage(focaccia, "zh-tw");
  assert.match(focacciaTw, /佛卡夏烘焙百分比/);
});

test("every calculator page prints water from baker's percentage", () => {
  for (const page of pages) {
    if (!page.preset) continue;
    const html = renderPage(page, "en");
    const preset = page.preset;
    const flour =
      preset.mode === "balls"
        ? (preset.balls * preset.gramsPerBall) /
          (1 + (preset.hydration + preset.starter + preset.salt + preset.yeast) / 100)
        : preset.flour;
    const water = (flour * preset.hydration) / 100;
    assert.ok(html.includes(`id="out-water">${formatAmount(water)} g`), page.id);
  }
});

test("pages do not mention nutrition, brands, or trackers", () => {
  const banned = [
    /king arthur/i,
    /calorie/i,
    /nutrition/i,
    /affiliate/i,
    /weight loss/i,
    /卡路里/,
    /热量/,
    /熱量/,
    /营养/,
    /營養/,
    /减肥/,
    /減肥/,
    /健康/,
    /google-analytics/i,
    /gtag\(/,
  ];
  const blob = JSON.stringify(pages);
  for (const pattern of banned) {
    assert.equal(pattern.test(blob), false, pattern.source);
  }
});

test("writeSite emits sitemap, robots, and a sample page", async () => {
  const dir = await mkdtemp(path.join(tmpdir(), "dough-"));
  await writeSite(dir);
  const robots = await readFile(path.join(dir, "robots.txt"), "utf8");
  assert.match(robots, new RegExp(`Sitemap: ${SITE_URL}/sitemap.xml`));
  const sample = await readFile(
    path.join(dir, "en", "70-hydration-sourdough-calculator", "index.html"),
    "utf8",
  );
  assert.match(sample, /<title>70% Hydration Sourdough Calculator<\/title>/);
  const focaccia = await readFile(
    path.join(dir, "zh-tw", "fokaxia-hongbei-baifenbi", "index.html"),
    "utf8",
  );
  assert.match(focaccia, /佛卡夏烘焙百分比/);
  const root = await readFile(path.join(dir, "index.html"), "utf8");
  assert.match(root, /url=\/en\//);
});
