import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { pages } from "./catalog.mjs";
import { doughGuides } from "./data/dough-guides.mjs";
import fontkit from "./vendor/fontkit.esm.min.js";
import { PDFDocument } from "./vendor/pdf-lib.esm.min.js";
import { fontUrlFor, wrapText } from "./pdf-doc.js";
import { pdfPayload } from "./render.mjs";

const root = path.dirname(fileURLToPath(import.meta.url));
const fonts = {
  sc: await readFile(path.join(root, "fonts", "noto-sans-sc-subset.ttf")),
  tc: await readFile(path.join(root, "fonts", "noto-sans-tc-subset.ttf")),
};

function missingGlyphs(fontBytes, text) {
  const font = fontkit.create(fontBytes);
  const missing = [];
  const seen = new Set();
  for (const ch of text) {
    if (ch === "\n" || ch === "\r" || seen.has(ch)) continue;
    seen.add(ch);
    const code = ch.codePointAt(0);
    if (!font.hasGlyphForCodePoint?.(code)) {
      const glyph = font.glyphForCodePoint(code);
      if (!glyph || glyph.id === 0 || glyph.name === ".notdef") missing.push(ch);
    }
  }
  return missing;
}

function payloadText(payload) {
  return JSON.stringify(payload);
}

test("guide text uses ASCII decimals and no full-width digits in numbers", () => {
  for (const [id, guide] of Object.entries(doughGuides)) {
    for (const lang of ["en", "zh-cn", "zh-tw"]) {
      const block = guide[lang];
      const text = [block.heading, block.lead, block.alt, block.creditBefore, ...block.steps.flatMap((step) => [step.title, step.body])].join("\n");
      assert.equal(text.includes("．"), false, `${id} ${lang}`);
      assert.equal(/[０-９][0-9０-９]|[0-9][０-９]/.test(text), false, `${id} ${lang}`);
    }
  }
});

test("every PDF character is in the font subset for that language", () => {
  const buckets = { sc: "0123456789.%°CF", tc: "0123456789.%°CF" };
  for (const page of pages) {
    if (!doughGuides[page.id]) continue;
    for (const lang of ["en", "zh-cn", "zh-tw"]) {
      const payload = pdfPayload(page, lang);
      const text = payloadText(payload);
      const bucket = lang === "zh-tw" ? "tc" : "sc";
      buckets[bucket] += text;
      assert.equal(payload.fontUrl, fontUrlFor(lang === "zh-tw" ? "zh-TW" : lang));
    }
  }
  for (const [name, text] of Object.entries(buckets)) {
    const missing = missingGlyphs(fonts[name], text);
    assert.deepEqual(missing, [], `${name} missing ${missing.join(" ")}`);
  }
});

test("Chinese units stay attached to the number in front of them", async () => {
  const pdf = await PDFDocument.create();
  pdf.registerFontkit(fontkit);
  const samples = [
    [fonts.sc, "这里写很长的说明把行撑开静置 30 分钟然后再等 2 小时加入 10 克深度 1 厘米温度 24°C 水合 65% 发酵 2 到 2.5 小时盐 2.5%。"],
    [fonts.tc, "這裡寫很長的說明把行撐開靜置 30 分鐘然後再等 2 小時加入 10 克深度 1 公分溫度 24°C 水合 65% 發酵 2 到 2.5 小時鹽 2.5%。"],
  ];
  const units = /^(?:分钟|小時|小时|分鐘|公分|厘米|克)/;
  for (const [bytes, sample] of samples) {
    const font = await pdf.embedFont(bytes);
    const filler = "dough notes ".repeat(40);
    const lines = wrapText(`${filler}${sample}`, font, 11, 160).map((line) => line.trim()).filter(Boolean);
    for (let i = 0; i < lines.length - 1; i += 1) {
      assert.equal(/\d$/.test(lines[i]) && units.test(lines[i + 1]), false, `${lines[i]} / ${lines[i + 1]}`);
      assert.equal(/°$/.test(lines[i]) && /^[CF]/.test(lines[i + 1]), false, `${lines[i]} / ${lines[i + 1]}`);
      assert.equal(/%$/.test(lines[i]) && /^水合/.test(lines[i + 1]), false, `${lines[i]} / ${lines[i + 1]}`);
    }
    const joined = lines.join("\n");
    assert.ok(lines.some((line) => line.includes("2 到 2.5")), joined);
    assert.ok(lines.some((line) => line.includes("2.5%")), joined);
    assert.equal(lines.some((line) => /(?:^|\D)\d\.$/.test(line)), false, joined);
    assert.match(joined, /30 分钟|30 分鐘/);
    assert.match(joined, /2 小时|2 小時/);
    assert.match(joined, /10 克/);
    assert.match(joined, /1 厘米|1 公分/);
    assert.match(joined, /24°C/);
    assert.match(joined, /65%/);
  }
});
