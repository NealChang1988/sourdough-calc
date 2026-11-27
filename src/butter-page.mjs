import { KING_ARTHUR_URL, fdcUrl } from "./cups-copy.mjs";
import { STEP_ICONS } from "./cups-page.mjs";
import { ingredientById, interpret } from "./cups.mjs";
import { cupsCopy } from "./cups-copy.mjs";
import {
  KING_LABEL,
  USDA_CREDIT,
  butterCopy,
  butterExampleRows,
  butterView,
  faqEntries,
  gapParagraphs,
  quickLines,
  sourceParagraphs,
  stickTableRows,
} from "./butter-copy.mjs";

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function linked(paragraph, label, href) {
  const safe = escapeHtml(paragraph);
  const target = escapeHtml(label);
  if (!label || !safe.includes(target)) return `<p>${safe}</p>`;
  return `<p>${safe.replace(target, `<a href="${escapeHtml(href)}">${target}</a>`)}</p>`;
}

export function renderButterInner(lang) {
  const copy = butterCopy[lang];
  const cups = cupsCopy[lang];
  const opening = interpret(copy.opening, { ingredient: "butter", spoonStyle: "us", hero: "grams" });
  const view = butterView(opening.result, lang);
  const unitButtons = copy.units
    .map(
      ([id, label]) =>
        `<button type="button" class="secondary" data-unit="${id}" aria-pressed="${id === "stick" ? "true" : "false"}">${escapeHtml(label)}</button>`,
    )
    .join("");
  const chips = copy.chips
    .map(
      ([label, unit, value]) =>
        `<button type="button" class="secondary" data-amount="${escapeHtml(value)}" data-unit="${unit}">${escapeHtml(label)}</button>`,
    )
    .join("");
  const standards = ["us", "metric", "uk"]
    .map(
      (id) =>
        `<label><input type="radio" name="system" value="${id}"${id === "us" ? " checked" : ""}> ${escapeHtml(cups.systems[id])}</label>`,
    )
    .join("");
  const rows = ["oz", "sticks", "tbsp", "tsp", "cups", "ml"]
    .map((key) => {
      const hidden = key === "sticks" && !view.showSticks ? " hidden" : "";
      return `<div id="row-${key}"${hidden}><dt>${escapeHtml(copy.rows[key])}</dt><dd id="out-${key}">${escapeHtml(view.cells[key])}</dd></div>`;
    })
    .join("");
  const quick = quickLines(lang)
    .map((line) => `<p>${escapeHtml(line)}</p>`)
    .join("");
  const tableHead = copy.tableHead.map((label) => `<th scope="col">${escapeHtml(label)}</th>`).join("");
  const tableRows = stickTableRows()
    .map(
      (row) =>
        `<tr><th scope="row">${escapeHtml(row.sticksLabel)}</th><td>${row.grams}</td><td>${row.oz}</td><td>${row.tbsp}</td><td>${escapeHtml(row.cups)}</td></tr>`,
    )
    .join("");
  const steps = copy.steps
    .map((sentence, index) => `<li>${STEP_ICONS[index]}<span>${escapeHtml(sentence)}</span></li>`)
    .join("");
  const example = butterExampleRows(lang)
    .map((row) => `<tr><td>${escapeHtml(row[0])}</td><td>${escapeHtml(row[1])}</td></tr>`)
    .join("");
  const faq = faqEntries(lang)
    .map(([question, answer]) => `<h3>${escapeHtml(question)}</h3><p>${escapeHtml(answer)}</p>`)
    .join("");
  const sources = sourceParagraphs(lang);
  const usda = fdcUrl(ingredientById("butter").fdc);
  const sourceHtml = `${linked(sources[0], "", "")}${linked(sources[1], USDA_CREDIT, usda)}${linked(sources[2], KING_LABEL[lang], KING_ARTHUR_URL)}`;
  const gaps = gapParagraphs(lang)
    .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
    .join("");
  return `<div class="quick-answer">${quick}</div>
<form id="butter-calc" class="cups-tool butter-tool" autocomplete="off" data-unit="stick" onsubmit="return false">
<p class="privacy-line">${escapeHtml(copy.privacy)}</p>
<p class="limits">${escapeHtml(copy.limits)}</p>
<label class="field"><span class="label">${escapeHtml(copy.amount)}</span><input name="amount" inputmode="decimal" value="${escapeHtml(copy.opening)}"></label>
<div class="units" role="group" aria-label="${escapeHtml(copy.unitsLegend)}">${unitButtons}</div>
<div class="chips">${chips}</div>
<fieldset class="standards">
<legend>${escapeHtml(cups.standardLegend)}</legend>
${standards}
</fieldset>
<p class="hint standard-hint" id="standard-hint" hidden>${escapeHtml(copy.standardHint)}</p>
</form>
<section class="card result" aria-live="polite">
<h2>${escapeHtml(copy.result)}</h2>
<span id="form-error" class="error" role="alert" hidden></span>
<p id="detected" class="detected"></p>
<p class="hero" id="out-main"><span class="nowrap">${escapeHtml(view.grams)}</span></p>
<p id="out-summary">${escapeHtml(view.summary)}</p>
<p id="out-frac">${escapeHtml(view.frac)}</p>
<dl id="out-rows">${rows}</dl>
<div class="actions">
<button type="button" id="copy">${escapeHtml(copy.copy)}</button>
<button type="button" id="print" class="secondary">${escapeHtml(copy.print)}</button>
</div>
<textarea id="recipe-text" hidden readonly></textarea>
</section>
<section class="chart-wrap">
<h2>${escapeHtml(copy.stickTable)}</h2>
<table class="chart stick-chart"><thead><tr>${tableHead}</tr></thead><tbody>${tableRows}</tbody></table>
</section>
<section class="howto"><h2>${escapeHtml(copy.howtoTitle)}</h2><ol>${steps}</ol></section>
<section class="example"><h2>${escapeHtml(copy.exampleTitle)}</h2><table><thead><tr><th>${escapeHtml(copy.before)}</th><th>${escapeHtml(copy.after)}</th></tr></thead><tbody>${example}</tbody></table></section>
<section class="faq"><h2>${escapeHtml(copy.faqTitle)}</h2>${faq}</section>
<section class="sources-note"><h2>${escapeHtml(copy.sourcesTitle)}</h2>${sourceHtml}</section>
<section class="gap"><h2>${escapeHtml(copy.gapTitle)}</h2>${gaps}</section>
<script type="module" src="/assets/butter.js"></script>`;
}
