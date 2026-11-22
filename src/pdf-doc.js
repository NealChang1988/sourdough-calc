import fontkit from "./vendor/fontkit.esm.min.js";
import { PDFDocument, rgb } from "./vendor/pdf-lib.esm.min.js";
import { effectiveHydration, formatAmount } from "./formula.mjs";

const FONT_URL = "/assets/fonts/noto-sans-subset.ttf";
const PAGE = [595.28, 841.89];
const MARGIN = 48;

let fontBytesPromise;

export function loadPdfFont(url = FONT_URL) {
  if (!fontBytesPromise) {
    fontBytesPromise = fetch(url)
      .then(async (response) => {
        if (!response.ok) throw new Error("Could not load the PDF font");
        return response.arrayBuffer();
      })
      .catch((error) => {
        fontBytesPromise = undefined;
        throw error;
      });
  }
  return fontBytesPromise;
}

function wrapText(text, font, size, maxWidth) {
  const lines = [];
  for (const paragraph of String(text).split("\n")) {
    if (!paragraph) {
      lines.push("");
      continue;
    }
    let current = "";
    for (const part of paragraph.split(/(\s+)/)) {
      if (!part) continue;
      if (font.widthOfTextAtSize(part, size) > maxWidth) {
        if (current.trim()) lines.push(current.trimEnd());
        current = "";
        let buf = "";
        for (const ch of part) {
          if (font.widthOfTextAtSize(buf + ch, size) > maxWidth && buf) {
            lines.push(buf);
            buf = ch;
          } else {
            buf += ch;
          }
        }
        current = buf;
        continue;
      }
      if (font.widthOfTextAtSize(current + part, size) <= maxWidth) {
        current += part;
      } else {
        if (current.trim()) lines.push(current.trimEnd());
        current = part.trimStart();
      }
    }
    lines.push(current.trimEnd());
  }
  return lines;
}

function inputLines(labels, inputs) {
  const lines = [inputs.mode === "balls" ? labels.modeBalls : labels.modeFlour];
  if (inputs.mode === "balls") {
    lines.push(`${labels.balls}: ${formatAmount(inputs.balls)}`);
    lines.push(`${labels.perBall}: ${formatAmount(inputs.gramsPerBall)} ${labels.grams}`);
  } else {
    lines.push(`${labels.flour}: ${formatAmount(inputs.flour)} ${labels.grams}`);
  }
  lines.push(`${labels.hydration}: ${formatAmount(inputs.hydration)}%`);
  lines.push(`${labels.starter}: ${formatAmount(inputs.starter)}%`);
  lines.push(`${labels.salt}: ${formatAmount(inputs.salt)}%`);
  lines.push(`${labels.yeast}: ${formatAmount(inputs.yeast)}%`);
  return lines;
}

function resultLines(labels, recipe) {
  const lines = ["flour", "water", "starter", "salt", "yeast", "total"].map(
    (key) => `${labels[key]}: ${formatAmount(recipe[key])} ${labels.grams}`,
  );
  lines.push(`${labels.effective}: ${formatAmount(effectiveHydration(recipe))}%`);
  return lines;
}

export async function buildRecipePdf(data) {
  const fontBytes = data.fontBytes ?? (await loadPdfFont());
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

  draw(data.title, 18, ink, 6);
  draw(data.url, 10, muted, 8);
  for (const line of inputLines(data.labels, data.inputs)) draw(line, 11, ink, 3);
  y -= 8;
  draw(data.labels.result, 14, ink, 5);
  for (const line of resultLines(data.labels, data.recipe)) draw(line, 11, ink, 3);
  y -= 10;
  draw(data.method.heading, 14, ink, 5);
  draw(data.method.lead, 11, ink, 4);
  y -= 4;
  data.method.steps.forEach((step, index) => {
    if (y - (12 + 3 + 11 + 3) < MARGIN) nextPage();
    draw(`${index + 1}. ${step.title}`, 12, ink, 3);
    draw(step.body, 11, ink, 3);
    y -= 6;
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
