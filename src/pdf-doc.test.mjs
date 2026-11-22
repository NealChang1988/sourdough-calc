import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { countryMethod } from "./data/country-method.mjs";
import { effectiveHydration, formatAmount, recipeFor } from "./formula.mjs";
import { ui } from "./i18n.mjs";
import { buildRecipePdf, fontUrlFor } from "./pdf-doc.js";

const root = path.dirname(fileURLToPath(import.meta.url));
const fontBytes = {
  en: await readFile(path.join(root, "fonts", "noto-sans-sc-subset.ttf")),
  "zh-cn": await readFile(path.join(root, "fonts", "noto-sans-sc-subset.ttf")),
  "zh-tw": await readFile(path.join(root, "fonts", "noto-sans-tc-subset.ttf")),
};

const changed = {
  mode: "flour",
  flour: 800,
  hydration: 68,
  starter: 25,
  salt: 1.8,
  yeast: 0,
  balls: 4,
  gramsPerBall: 250,
};

function labelsFor(lang) {
  const copy = ui[lang];
  return {
    result: copy.result,
    flour: copy.flour,
    water: copy.water,
    starter: copy.starter,
    salt: copy.salt,
    yeast: copy.yeast,
    total: copy.total,
    grams: copy.grams,
    effective: copy.effective,
    hydration: copy.hydration,
    modeFlour: copy.modeFlour,
    modeBalls: copy.modeBalls,
    balls: copy.balls,
    perBall: copy.perBall,
  };
}

function pdfText(file) {
  const result = spawnSync("pdftotext", ["-enc", "UTF-8", "-layout", file, "-"], { encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr);
  return result.stdout;
}

test("recipe pdf uses the current numbers and the full method in each language", async () => {
  const recipe = recipeFor(changed);
  assert.equal(formatAmount(recipe.water), "544");
  assert.equal(formatAmount(recipe.salt), "14.4");
  assert.equal(formatAmount(effectiveHydration(recipe)), "71.6");
  const dir = await mkdtemp(path.join(tmpdir(), "dough-pdf-"));
  const titles = {
    en: "Country Sourdough Baker's Percentage",
    "zh-cn": "乡村酸种面包烘焙百分比",
    "zh-tw": "鄉村酸種麵包烘焙百分比",
  };
  const urls = {
    en: "https://doughcalc.app/en/country-sourdough-bakers-percentage/",
    "zh-cn": "https://doughcalc.app/zh-cn/xiangcun-suanzhong/",
    "zh-tw": "https://doughcalc.app/zh-tw/xiangcun-suanzhong/",
  };
  for (const lang of ["en", "zh-cn", "zh-tw"]) {
    const method = countryMethod[lang];
    const bytes = await buildRecipePdf({
      title: titles[lang],
      url: urls[lang],
      lang,
      labels: labelsFor(lang),
      method: {
        heading: method.heading,
        lead: method.lead,
        steps: method.steps,
      },
      inputs: changed,
      recipe,
      fontBytes: fontBytes[lang],
    });
    const file = path.join(dir, `${lang}.pdf`);
    await writeFile(file, bytes);
    const text = pdfText(file);
    const compact = text.replace(/\s+/g, "");
    assert.ok(compact.includes(titles[lang].replace(/\s+/g, "")), lang);
    assert.ok(compact.includes(urls[lang]), lang);
    assert.ok(compact.includes("68%"), lang);
    assert.ok(compact.includes("25%"), lang);
    assert.ok(compact.includes("1.8%"), lang);
    assert.ok(compact.includes("544"), lang);
    assert.ok(compact.includes("14.4"), lang);
    assert.ok(compact.includes("71.6%"), lang);
    assert.ok(compact.includes(method.heading.replace(/\s+/g, "")), lang);
    assert.ok(compact.includes(method.lead.replace(/\s+/g, "").slice(0, 24)), lang);
    for (const step of method.steps) {
      assert.ok(compact.includes(step.title.replace(/\s+/g, "")), `${lang} ${step.title}`);
      assert.ok(compact.includes(step.body.replace(/\s+/g, "").slice(0, 12)), `${lang} ${step.title}`);
    }
    assert.equal(text.includes("\uFFFD"), false, lang);
    const lines = text.split("\n").map((line) => line.trim()).filter(Boolean);
    for (let i = 0; i < lines.length - 1; i += 1) {
      const next = lines[i + 1];
      if (/\d$/.test(lines[i]) && /^(?:minutes|minute|hours|hour|g\b|cm\b|克|分鐘|小時|公分|厘米|個半小時)/.test(next)) {
        assert.fail(`${lang} split a number from its unit: ${lines[i]} / ${next}`);
      }
      if (/%$/.test(lines[i]) && /^水合/.test(next)) {
        assert.fail(`${lang} split a percentage from 水合: ${lines[i]} / ${next}`);
      }
    }
    if (lang === "en") assert.match(text, /Flour: 800 g/);
    if (lang === "zh-cn") assert.match(text, /面粉：800 克/);
    if (lang === "zh-tw") assert.match(text, /麵粉：800 克/);
  }
  assert.equal(fontUrlFor("zh-tw"), "/assets/fonts/noto-sans-tc-subset.ttf");
  assert.equal(fontUrlFor("zh-TW"), "/assets/fonts/noto-sans-tc-subset.ttf");
  assert.equal(fontUrlFor("zh-cn"), "/assets/fonts/noto-sans-sc-subset.ttf");
  assert.equal(fontUrlFor("en"), "/assets/fonts/noto-sans-sc-subset.ttf");
});
