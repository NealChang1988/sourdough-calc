import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { inflateSync } from "node:zlib";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { pages } from "./catalog.mjs";
import { doughGuides } from "./data/dough-guides.mjs";
import { recipeFor } from "./formula.mjs";
import fontkit from "./vendor/fontkit.esm.min.js";
import { PDFDocument } from "./vendor/pdf-lib.esm.min.js";
import { buildRecipePdf, fontUrlFor, wrapText } from "./pdf-doc.js";
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

function readU16(buf, offset) {
  return buf.readUInt16BE(offset);
}

function tableSlice(font, tag) {
  const numTables = readU16(font, 4);
  for (let i = 0; i < numTables; i += 1) {
    const at = 12 + i * 16;
    if (font.toString("latin1", at, at + 4) !== tag) continue;
    const offset = font.readUInt32BE(at + 8);
    const length = font.readUInt32BE(at + 12);
    return font.subarray(offset, offset + length);
  }
  return null;
}

function locaOffsets(font) {
  const head = tableSlice(font, "head");
  const maxp = tableSlice(font, "maxp");
  const loca = tableSlice(font, "loca");
  const format = head.readInt16BE(50);
  const glyphs = readU16(maxp, 4);
  const offsets = [];
  for (let i = 0; i <= glyphs; i += 1) {
    offsets.push(format === 0 ? readU16(loca, i * 2) * 2 : loca.readUInt32BE(i * 4));
  }
  return offsets;
}

function glyphOutline(font, gid) {
  const glyf = tableSlice(font, "glyf");
  const offsets = locaOffsets(font);
  const start = offsets[gid];
  const end = offsets[gid + 1];
  if (end <= start) return { contours: 0, points: 0 };
  const contours = glyf.readInt16BE(start);
  const box = [
    glyf.readInt16BE(start + 2),
    glyf.readInt16BE(start + 4),
    glyf.readInt16BE(start + 6),
    glyf.readInt16BE(start + 8),
  ];
  if (contours <= 0) return { contours, points: contours < 0 ? -1 : 0, box };
  const last = glyf.readUInt16BE(start + 10 + (contours - 1) * 2);
  return { contours, points: last + 1, box };
}

function inflated(bytes) {
  return bytes[0] === 0x78 ? inflateSync(bytes) : bytes;
}

function isFont(bytes) {
  const sig = bytes.toString("latin1", 0, 4);
  return sig === "true" || sig === "OTTO" || (bytes[0] === 0 && bytes[1] === 1);
}

async function pdfParts(pdfBytes) {
  const doc = await PDFDocument.load(pdfBytes);
  let font = null;
  let cmap = "";
  for (const [, obj] of doc.context.enumerateIndirectObjects()) {
    if (!obj.contents) continue;
    const data = inflated(obj.contents);
    if (!font && isFont(data)) font = data;
    const text = data.toString("latin1");
    if (text.includes("beginbfchar") || text.includes("beginbfrange")) cmap = text;
  }
  return { font, cmap, pages: doc.getPageCount() };
}

function decodeUtf16Hex(hex) {
  const units = [];
  for (let i = 0; i + 4 <= hex.length; i += 4) units.push(Number.parseInt(hex.slice(i, i + 4), 16));
  return String.fromCharCode(...units);
}

function unicodePairs(cmap) {
  const pairs = [];
  let mode = "";
  for (const part of cmap.split(/(beginbfchar|endbfchar|beginbfrange|endbfrange)/)) {
    if (part === "beginbfchar" || part === "endbfchar" || part === "beginbfrange" || part === "endbfrange") {
      mode = part;
      continue;
    }
    if (mode === "beginbfchar") {
      for (const match of part.matchAll(/<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>/g)) {
        pairs.push([Number.parseInt(match[1], 16), decodeUtf16Hex(match[2])]);
      }
    }
    if (mode === "beginbfrange") {
      for (const match of part.matchAll(/<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>/g)) {
        const start = Number.parseInt(match[1], 16);
        const end = Number.parseInt(match[2], 16);
        const first = decodeUtf16Hex(match[3]);
        if (end < start || end - start > 500 || [...first].length !== 1) continue;
        const unicode = first.codePointAt(0);
        for (let gid = start; gid <= end; gid += 1) pairs.push([gid, String.fromCodePoint(unicode + gid - start)]);
      }
    }
  }
  return pairs;
}

test("committed font subsets pad every glyph to a multiple of 4 bytes", () => {
  for (const [name, bytes] of Object.entries(fonts)) {
    const offsets = locaOffsets(bytes);
    for (let i = 0; i < offsets.length - 1; i += 1) {
      const length = offsets[i + 1] - offsets[i];
      assert.equal(length % 2, 0, `${name} glyph ${i} has odd length ${length}`);
      assert.equal(length % 4, 0, `${name} glyph ${i} length ${length} is not padded to 4 bytes`);
    }
  }
});

test("every non-space character in a guide PDF keeps a non-empty outline", async () => {
  for (const page of pages) {
    if (!doughGuides[page.id]) continue;
    for (const lang of ["en", "zh-cn", "zh-tw"]) {
      const payload = pdfPayload(page, lang);
      const pdfBytes = await buildRecipePdf({
        ...payload,
        inputs: page.preset,
        recipe: recipeFor(page.preset),
        fontBytes: lang === "zh-tw" ? fonts.tc : fonts.sc,
      });
      const { font, cmap, pages: pageCount } = await pdfParts(pdfBytes);
      assert.ok(font, `${page.id} ${lang} embedded font`);
      if (
        page.id === "pizza-sicilian" ||
        page.id === "bread-bialy" ||
        page.id === "bread-hoagie-rolls" ||
        page.id === "bread-pane-toscano" ||
        page.id === "bread-spelt-sourdough"
      ) {
        assert.equal(pageCount, 1, `${page.id} ${lang}`);
      }
      const pairs = unicodePairs(cmap);
      assert.ok(pairs.length > 30, `${page.id} ${lang} mapped ${pairs.length}`);
      const source = fontkit.create(lang === "zh-tw" ? fonts.tc : fonts.sc);
      for (const [gid, text] of pairs) {
        const chars = [...text];
        if (chars.length === 1 && /\s/.test(chars[0])) continue;
        const drawn = glyphOutline(font, gid);
        const label = `${page.id} ${lang} ${text}`;
        assert.ok(drawn.contours > 0 && drawn.points > 0, `${label} drew blank`);
        if (chars.length === 1) {
          const expected = source.glyphForCodePoint(chars[0].codePointAt(0))._decode();
          assert.equal(drawn.contours, expected.numberOfContours, label);
        }
      }
    }
  }
});

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

  const guideUnits = /^(?:分钟|小時|小时|分鐘|公分|厘米|克|minutes|minute|hours|hour|cm|g)/;
  for (const [id, guide] of Object.entries(doughGuides)) {
    for (const lang of ["en", "zh-cn", "zh-tw"]) {
      const bytes = lang === "zh-tw" ? fonts.tc : fonts.sc;
      const font = await pdf.embedFont(bytes);
      const bodies = [guide[lang].lead, ...guide[lang].steps.map((step) => step.body)];
      for (const body of bodies) {
        const filler = "dough notes ".repeat(40);
        const lines = wrapText(`${filler}${body}`, font, 11, 160).map((line) => line.trim()).filter(Boolean);
        for (let i = 0; i < lines.length - 1; i += 1) {
          assert.equal(/\d$/.test(lines[i]) && guideUnits.test(lines[i + 1]), false, `${id} ${lang} ${lines[i]} / ${lines[i + 1]}`);
          assert.equal(/°$/.test(lines[i]) && /^[CF]/.test(lines[i + 1]), false, `${id} ${lang} ${lines[i]} / ${lines[i + 1]}`);
        }
        const joined = lines.join("\n");
        assert.equal(lines.some((line) => /(?:^|\D)\d\.$/.test(line)), false, `${id} ${lang} ${joined}`);
      }
    }
  }
});
