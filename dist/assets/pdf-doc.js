import fontkit from "./vendor/fontkit.esm.min.js";
import { PDFDocument, rgb } from "./vendor/pdf-lib.esm.min.js";
import { effectiveHydration, formatAmount } from "./formula.mjs";

const FONT_URL = {
  "zh-tw": "/assets/fonts/noto-sans-tc-subset.ttf",
  "zh-TW": "/assets/fonts/noto-sans-tc-subset.ttf",
};
const DEFAULT_FONT_URL = "/assets/fonts/noto-sans-sc-subset.ttf";
const PAGE = [595.28, 841.89];
const MARGIN = 48;
const CLOSING = new Set("，。、：；）)」』】》,.;:!?%％".split(""));
const GLUED =
  /^((?:\d+(?:\.\d+)?(?:(?:–|-)\d+(?:\.\d+)?)?½?|½)(?:°[CF])?%?)(?:[ \u00A0]+(個半小時|分鐘|小時|公分|厘米|水合|minutes|minute|hours|hour|cm|g|克))?/;

const fontBytesPromises = new Map();

export function fontUrlFor(lang) {
  return FONT_URL[lang] ?? DEFAULT_FONT_URL;
}

export function loadPdfFont(url = DEFAULT_FONT_URL) {
  if (!fontBytesPromises.has(url)) {
    fontBytesPromises.set(
      url,
      fetch(url)
        .then(async (response) => {
          if (!response.ok) throw new Error("Could not load the PDF font");
          return response.arrayBuffer();
        })
        .catch((error) => {
          fontBytesPromises.delete(url);
          throw error;
        }),
    );
  }
  return fontBytesPromises.get(url);
}

function isCjk(ch) {
  const code = ch.codePointAt(0);
  return (
    (code >= 0x3400 && code <= 0x9fff) ||
    (code >= 0xf900 && code <= 0xfaff) ||
    (code >= 0x3000 && code <= 0x303f) ||
    (code >= 0xff00 && code <= 0xffef)
  );
}

function tokenize(text) {
  const tokens = [];
  const chars = [...text];
  let i = 0;
  while (i < chars.length) {
    const rest = chars.slice(i).join("");
    const glued = GLUED.exec(rest);
    if (glued) {
      tokens.push(glued[0]);
      i += [...glued[0]].length;
      continue;
    }
    const ch = chars[i];
    if (CLOSING.has(ch) && tokens.length) {
      tokens[tokens.length - 1] += ch;
      i += 1;
      continue;
    }
    if (ch === " " || ch === "\u00A0") {
      tokens.push(" ");
      i += 1;
      continue;
    }
    if (isCjk(ch)) {
      tokens.push(ch);
      i += 1;
      continue;
    }
    let word = ch;
    i += 1;
    while (i < chars.length) {
      const next = chars[i];
      if (next === " " || next === "\u00A0" || isCjk(next) || CLOSING.has(next) || /\d/.test(next)) break;
      word += next;
      i += 1;
    }
    tokens.push(word);
  }
  return tokens;
}

function wrapText(text, font, size, maxWidth) {
  const lines = [];
  const widthOf = (value) => font.widthOfTextAtSize(value, size);
  for (const paragraph of String(text).split("\n")) {
    if (!paragraph) {
      lines.push("");
      continue;
    }
    let line = "";
    for (const token of tokenize(paragraph)) {
      if (token === " ") {
        if (!line) continue;
        if (widthOf(`${line} `) <= maxWidth) line += " ";
        else {
          lines.push(line.trimEnd());
          line = "";
        }
        continue;
      }
      if (!line || widthOf(line + token) <= maxWidth) {
        line += token;
        continue;
      }
      lines.push(line.trimEnd());
      line = token;
    }
    if (line.trim()) lines.push(line.trimEnd());
  }
  return lines;
}

function labelSep(lang) {
  return String(lang || "").toLowerCase().startsWith("zh") ? "：" : ": ";
}

export function formatEntered(n) {
  const text = Number(n).toFixed(2);
  return text.replace(/\.00$/, "").replace(/(\.\d)0$/, "$1");
}

function inputLines(labels, inputs, sep) {
  const lines = [inputs.mode === "balls" ? labels.modeBalls : labels.modeFlour];
  if (inputs.mode === "balls") {
    lines.push(`${labels.balls}${sep}${formatEntered(inputs.balls)}`);
    lines.push(`${labels.perBall}${sep}${formatEntered(inputs.gramsPerBall)} ${labels.grams}`);
  } else {
    lines.push(`${labels.flour}${sep}${formatEntered(inputs.flour)} ${labels.grams}`);
  }
  lines.push(`${labels.hydration}${sep}${formatEntered(inputs.hydration)}%`);
  lines.push(`${labels.starter}${sep}${formatEntered(inputs.starter)}%`);
  lines.push(`${labels.salt}${sep}${formatEntered(inputs.salt)}%`);
  lines.push(`${labels.yeast}${sep}${formatEntered(inputs.yeast)}%`);
  return lines;
}

function resultLines(labels, recipe, sep) {
  const lines = ["flour", "water", "starter", "salt", "yeast", "total"].map(
    (key) => `${labels[key]}${sep}${formatAmount(recipe[key])} ${labels.grams}`,
  );
  lines.push(`${labels.effective}${sep}${formatAmount(effectiveHydration(recipe))}%`);
  return lines;
}

export async function buildRecipePdf(data) {
  const fontBytes = data.fontBytes ?? (await loadPdfFont(data.fontUrl ?? fontUrlFor(data.lang)));
  const pdf = await PDFDocument.create();
  pdf.registerFontkit(fontkit);
  pdf.setTitle(data.title);
  pdf.setAuthor("doughcalc.app");
  pdf.setCreator("doughcalc.app");
  if (data.lang) pdf.setLanguage(data.lang);
  const font = await pdf.embedFont(fontBytes, { subset: true });
  const ink = rgb(0.14, 0.11, 0.09);
  const muted = rgb(0.36, 0.32, 0.27);
  const maxWidth = PAGE[0] - MARGIN * 2;
  let page = pdf.addPage(PAGE);
  let y = PAGE[1] - MARGIN;

  function nextPage() {
    page = pdf.addPage(PAGE);
    y = PAGE[1] - MARGIN;
  }

  function draw(text, size, color, gap = 4) {
    for (const line of wrapText(text, font, size, maxWidth)) {
      const lineHeight = line ? size + gap : gap + 2;
      if (y - lineHeight < MARGIN) nextPage();
      if (line) {
        page.drawText(line, { x: MARGIN, y: y - size, size, font, color });
      }
      y -= lineHeight;
    }
  }

  const sep = labelSep(data.lang);
  draw(data.title, 18, ink, 6);
  draw(data.url, 10, muted, 8);
  for (const line of inputLines(data.labels, data.inputs, sep)) draw(line, 11, ink, 3);
  y -= 6;
  draw(data.labels.result, 14, ink, 5);
  for (const line of resultLines(data.labels, data.recipe, sep)) draw(line, 11, ink, 3);
  y -= 6;
  draw(data.method.heading, 14, ink, 5);
  draw(data.method.lead, 11, ink, 3);
  y -= 2;
  data.method.steps.forEach((step, index) => {
    if (y - (12 + 3 + 11 + 3) < MARGIN) nextPage();
    draw(`${index + 1}. ${step.title}`, 12, ink, 3);
    draw(step.body, 11, ink, 3);
    y -= 3;
  });
  return pdf.save();
}

export function downloadPdf(bytes, filename) {
  const blob = new Blob([bytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2500);
}
