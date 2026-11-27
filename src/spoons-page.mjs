import { ingredientById, ingredientGroups } from "./cups.mjs";
import { KING_ARTHUR_URL, cupsCopy, fdcUrl } from "./cups-copy.mjs";
import { STEP_ICONS } from "./cups-page.mjs";
import { USDA_CREDIT } from "./butter-copy.mjs";
import { SPOON_ONLY, spoonCompute } from "./spoons.mjs";
import {
  exampleRows,
  faqEntries,
  gapParagraphs,
  presentSpoon,
  quickLines,
  sourceParagraphs,
  spoonName,
  spoonsCopy,
  tableBundle,
} from "./spoons-copy.mjs";

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function linkText(paragraph, pairs) {
  let html = escapeHtml(paragraph);
  for (const [label, href] of pairs) {
    const target = escapeHtml(label);
    if (label && html.includes(target)) {
      html = html.replace(target, `<a href="${escapeHtml(href)}">${target}</a>`);
    }
  }
  return `<p>${html}</p>`;
}

function optionGroups(lang) {
  const cups = cupsCopy[lang];
  const copy = spoonsCopy[lang];
  const existing = ingredientGroups()
    .map((group) => {
      const options = group.items
        .map((item) => {
          const selected = item.id === "sugar" ? " selected" : "";
          return `<option value="${item.id}"${selected}>${escapeHtml(cups.names[item.id])}</option>`;
        })
        .join("");
      return `<optgroup label="${escapeHtml(cups.groups[group.id])}">${options}</optgroup>`;
    })
    .join("");
  const spoon = SPOON_ONLY.map(
    (item) => `<option value="${item.id}">${escapeHtml(spoonName(item.id, lang))}</option>`,
  ).join("");
  return `${existing}<optgroup label="${escapeHtml(copy.group)}">${spoon}</optgroup>`;
}

export function renderSpoonsInner(lang) {
  const copy = spoonsCopy[lang];
  const cups = cupsCopy[lang];
  const opening = spoonCompute(copy.opening, { ingredient: "sugar", spoon: "us", defaultUnit: "tbsp" });
  const view = presentSpoon(opening, lang);
  const unitButtons = copy.units
    .map(
      ([id, label]) =>
        `<button type="button" class="secondary" data-unit="${id}" aria-pressed="${id === "tbsp" ? "true" : "false"}">${escapeHtml(label)}</button>`,
    )
    .join("");
  const chips = copy.chips
    .map(
      ([label, unit, value]) =>
        `<button type="button" class="secondary" data-amount="${escapeHtml(value)}" data-unit="${unit}">${escapeHtml(label)}</button>`,
    )
    .join("");
  const standards = ["us", "metric"]
    .map(
      (id) =>
        `<label><input type="radio" name="spoon" value="${id}"${id === "us" ? " checked" : ""}> ${escapeHtml(copy.spoons[id])}</label>`,
    )
    .join("");
  const quick = quickLines(lang)
    .map((line, index) => `<p${index === 0 ? "" : ' class="quick-row"'}>${escapeHtml(line)}</p>`)
    .join("");
  const tables = tableBundle();
  const gramRows = tables.grams
    .map(
      (row) =>
        `<tr><th scope="row">${escapeHtml(cups.names[row.id])}</th><td>${row.tbsp}</td><td>${row.tsp}</td></tr>`,
    )
    .join("");
  const onlyRows = tables.only
    .map(
      (row) =>
        `<tr><th scope="row">${escapeHtml(spoonName(row.id, lang))}</th><td>${row.tbsp}</td><td>${row.tsp}</td></tr>`,
    )
    .join("");
  const compareRows = tables.compare
    .map(
      (row) =>
        `<tr><th scope="row">${escapeHtml(cups.names[row.id])}</th><td>${row.us}</td><td>${row.metric}</td></tr>`,
    )
    .join("");
  const cupRows = tables.cups
    .map((row) => {
      const label = row.label === "1 tsp" ? `1 ${copy.tsp}` : `${row.label} ${copy.cup}`;
      return `<tr><th scope="row">${escapeHtml(label)}</th><td>${row.tbsp}</td><td>${row.tsp}</td><td>${row.ml}</td></tr>`;
    })
    .join("");
  const head = (labels) => labels.map((label) => `<th scope="col">${escapeHtml(label)}</th>`).join("");
  const steps = copy.steps
    .map((sentence, index) => `<li>${STEP_ICONS[index]}<span>${escapeHtml(sentence)}</span></li>`)
    .join("");
  const example = exampleRows(lang)
    .map((row) => `<tr><td>${escapeHtml(row[0])}</td><td>${escapeHtml(row[1])}</td></tr>`)
    .join("");
  const faq = faqEntries(lang)
    .map(([question, answer]) => `<h3>${escapeHtml(question)}</h3><p>${escapeHtml(answer)}</p>`)
    .join("");
  const chartLabel = lang === "en" ? "King Arthur Baking Ingredient Weight Chart" : "King Arthur Baking 食材重量表";
  const usda = fdcUrl(ingredientById("sugar").fdc);
  const sources = sourceParagraphs(lang)
    .map((paragraph) => linkText(paragraph, [[USDA_CREDIT, usda], [chartLabel, KING_ARTHUR_URL]]))
    .join("");
  const gaps = gapParagraphs(lang)
    .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
    .join("");
  const otherHidden = view.showOther ? "" : " hidden";
  const bothHidden = view.showBoth ? "" : " hidden";
  const kitchenHidden = view.showKitchen ? "" : " hidden";
  const cupsHidden = view.showCups ? "" : " hidden";
  return `<div class="quick-answer">${quick}</div>
<form id="spoon-calc" class="cups-tool spoon-tool" autocomplete="off" data-unit="tbsp" onsubmit="return false">
<p class="privacy-line">${escapeHtml(copy.privacy)}</p>
<p class="limits">${escapeHtml(copy.limits)}</p>
<label class="field"><span class="label">${escapeHtml(cups.ingredientLegend)}</span><select name="ingredient">${optionGroups(lang)}</select></label>
<label class="field"><span class="label">${escapeHtml(copy.amount)}</span><input name="amount" inputmode="decimal" value="${escapeHtml(copy.opening)}"></label>
<div class="units" role="group" aria-label="${escapeHtml(copy.unitsLegend)}">${unitButtons}</div>
<section class="card result" aria-live="polite">
<h2>${escapeHtml(copy.result)}</h2>
<span id="form-error" class="error" role="alert" hidden></span>
<p id="detected" class="detected"></p>
<p class="hero" id="out-main"><span class="nowrap">${escapeHtml(view.hero)}</span></p>
<p id="out-hint" class="hint"${view.hint ? "" : " hidden"}>${escapeHtml(view.hint)}</p>
<p id="out-summary">${escapeHtml(view.summary)}</p>
<dl id="out-rows">
<div id="row-other"${otherHidden}><dt id="out-other-label">${escapeHtml(view.otherLabel)}</dt><dd id="out-other">${escapeHtml(view.other)}</dd></div>
<div id="row-tbsp"${bothHidden}><dt>${escapeHtml(copy.rows.otherTbsp)}</dt><dd id="out-tbsp">${escapeHtml(view.tbsp)}</dd></div>
<div id="row-tsp"${bothHidden}><dt>${escapeHtml(copy.rows.otherTsp)}</dt><dd id="out-tsp">${escapeHtml(view.tsp)}</dd></div>
<div id="row-kitchen"${kitchenHidden}><dt>${escapeHtml(copy.rows.kitchen)}</dt><dd id="out-kitchen">${escapeHtml(view.kitchen)}</dd></div>
<div id="row-ml"><dt>${escapeHtml(copy.rows.ml)}</dt><dd id="out-ml">${escapeHtml(view.ml)}</dd></div>
<div id="row-oz"><dt>${escapeHtml(copy.rows.oz)}</dt><dd id="out-oz">${escapeHtml(view.oz)}</dd></div>
<div id="row-cups"${cupsHidden}><dt>${escapeHtml(copy.rows.cups)}</dt><dd id="out-cups">${escapeHtml(view.cups)}</dd></div>
</dl>
<div class="actions">
<button type="button" id="copy">${escapeHtml(copy.copy)}</button>
<button type="button" id="print" class="secondary">${escapeHtml(copy.print)}</button>
</div>
<textarea id="recipe-text" hidden readonly></textarea>
</section>
<div class="chips">${chips}</div>
<fieldset class="standards">
<legend>${escapeHtml(copy.spoonLegend)}</legend>
${standards}
</fieldset>
</form>
<section class="chart-wrap">
<h2>${escapeHtml(copy.chartTitle)}</h2>
<div class="chart-scroll"><table class="chart"><thead><tr>${head(copy.chartHead)}</tr></thead><tbody>${gramRows}</tbody></table></div>
</section>
<section class="chart-wrap">
<h2>${escapeHtml(copy.onlyTitle)}</h2>
<div class="chart-scroll"><table class="chart"><thead><tr>${head(copy.chartHead)}</tr></thead><tbody>${onlyRows}</tbody></table></div>
<p>${escapeHtml(copy.onlyNote)}</p>
</section>
<section class="chart-wrap">
<h2>${escapeHtml(copy.compareTitle)}</h2>
<div class="chart-scroll"><table class="chart"><thead><tr>${head(copy.compareHead)}</tr></thead><tbody>${compareRows}</tbody></table></div>
<p>${escapeHtml(copy.compareNote)}</p>
</section>
<section class="chart-wrap">
<h2>${escapeHtml(copy.cupTitle)}</h2>
<div class="chart-scroll"><table class="chart"><thead><tr>${head(copy.cupHead)}</tr></thead><tbody>${cupRows}</tbody></table></div>
</section>
<section class="howto"><h2>${escapeHtml(copy.howtoTitle)}</h2><ol>${steps}</ol></section>
<section class="example"><h2>${escapeHtml(copy.exampleTitle)}</h2><table><thead><tr><th>${escapeHtml(copy.before)}</th><th>${escapeHtml(copy.after)}</th></tr></thead><tbody>${example}</tbody></table></section>
<section class="faq"><h2>${escapeHtml(copy.faqTitle)}</h2>${faq}</section>
<section class="sources-note"><h2>${escapeHtml(copy.sourcesTitle)}</h2>${sources}</section>
<section class="gap"><h2>${escapeHtml(copy.gapTitle)}</h2>${gaps}</section>
<script type="module" src="/assets/spoons.js"></script>`;
}
