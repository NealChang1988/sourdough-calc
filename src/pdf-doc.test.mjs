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
import { buildRecipePdf } from "./pdf-doc.js";

const root = path.dirname(fileURLToPath(import.meta.url));
const fontBytes = await readFile(path.join(root, "fonts", "noto-sans-subset.ttf"));

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
      fontBytes,
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
  }
});
