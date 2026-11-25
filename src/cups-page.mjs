import { chartCell, convert, ingredientGroups } from "./cups.mjs";
import { KING_ARTHUR_URL, cupsCopy, fdcUrl, present } from "./cups-copy.mjs";

const FRACS = [
  ["1/4", 1 / 4],
  ["1/3", 1 / 3],
  ["1/2", 1 / 2],
  ["1", 1],
];

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

const ICONS = [
  `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8 10h8M8 13h8M8 16h5" fill="none" stroke="currentColor" stroke-width="2"/></svg>`,
  `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 19h14M7 16l9.5-9.5a1.8 1.8 0 0 1 2.5 2.5L9.5 18.5 6 19.2 7 16z" fill="none" stroke="currentColor" stroke-width="2"/></svg>`,
  `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8 12.5l2.5 2.5L16 9.5" fill="none" stroke="currentColor" stroke-width="2"/></svg>`,
];

function optionGroups(copy) {
  return ingredientGroups()
    .map((group) => {
      const options = group.items
        .map((item) => {
          const selected = item.id === "ap" ? " selected" : "";
          return `<option value="${item.id}"${selected}>${escapeHtml(copy.names[item.id])}</option>`;
        })
        .join("");
      return `<optgroup label="${escapeHtml(copy.groups[group.id])}">${options}</optgroup>`;
    })
    .join("");
}

function chips(items, attr) {
  return items
    .map(([id, label]) => `<button type="button" class="secondary" data-${attr}="${escapeHtml(id)}">${escapeHtml(label)}</button>`)
    .join("");
}

function amountChips(labels, values) {
  return labels
    .map((label, index) => `<button type="button" class="secondary" data-amount="${escapeHtml(values[index])}">${escapeHtml(label)}</button>`)
    .join("");
}

export function renderCupsInner(lang) {
  const copy = cupsCopy[lang];
  const result = convert({ ingredient: "ap", system: "us", direction: "grams", amount: 250 });
  const view = present(result, lang);
  const head = copy.chartHead
    .map((label, index) => `<th${index === 0 ? "" : ' scope="col"'}>${escapeHtml(label)}</th>`)
    .join("");
  const rows = ingredientGroups()
    .flatMap((group) => group.items)
    .map((item) => {
      const cells = FRACS.map(
        ([token, frac]) =>
          `<td data-ing="${item.id}" data-num="${token.split("/")[0] || token}" data-den="${token.includes("/") ? token.split("/")[1] : "1"}">${escapeHtml(chartCell(item.id, "us", frac))}</td>`,
      ).join("");
      return `<tr><th scope="row">${escapeHtml(copy.names[item.id])}</th>${cells}</tr>`;
    })
    .join("");
  const steps = copy.steps
    .map((sentence, index) => `<li>${ICONS[index]}<span>${escapeHtml(sentence)}</span></li>`)
    .join("");
  const example = copy.exampleRows
    .map((row) => `<tr><td>${escapeHtml(row[0])}</td><td>${escapeHtml(row[1])}</td></tr>`)
    .join("");
  const faq = copy.faq
    .map(([question, answer]) => `<h3>${escapeHtml(question)}</h3><p>${escapeHtml(answer)}</p>`)
    .join("");
  return `<form id="calc" class="cups-tool" autocomplete="off">
<p class="limits">${escapeHtml(copy.limits)}</p>
<label class="field"><span class="label">${escapeHtml(copy.ingredientLegend)}</span><select name="ingredient">${optionGroups(copy)}</select></label>
<div class="chips">${chips(copy.quick, "ingredient")}</div>
<label class="field"><span class="label">${escapeHtml(copy.amount)}</span><input name="amount" inputmode="decimal" value="250"></label>
<div class="chips" data-quick="grams">${amountChips(copy.gramQuick, copy.gramValues)}</div>
<div class="chips" data-quick="cups" hidden>${amountChips(copy.cupQuick, copy.cupQuick)}</div>
<fieldset class="modes">
<legend>${escapeHtml(copy.directionLegend)}</legend>
<label><input type="radio" name="direction" value="grams" checked> ${escapeHtml(copy.gramsToCups)}</label>
<label><input type="radio" name="direction" value="cups"> ${escapeHtml(copy.cupsToGrams)}</label>
<button type="button" id="swap" class="secondary">${escapeHtml(copy.swap)}</button>
</fieldset>
<fieldset class="standards">
<legend>${escapeHtml(copy.standardLegend)}</legend>
<label><input type="radio" name="system" value="us" checked> ${escapeHtml(copy.systems.us)}</label>
<label><input type="radio" name="system" value="metric"> ${escapeHtml(copy.systems.metric)}</label>
<label><input type="radio" name="system" value="uk"> ${escapeHtml(copy.systems.uk)}</label>
</fieldset>
</form>
<section class="card result" aria-live="polite">
<h2>${escapeHtml(copy.result)}</h2>
<span id="form-error" class="error" role="alert" hidden>${escapeHtml(copy.formatError)}</span>
<p id="detected" class="detected"></p>
<p class="hero" id="out-main">${escapeHtml(view.main)}</p>
<p id="out-frac">${escapeHtml(view.frac)}</p>
<p id="out-warn" class="warn" hidden></p>
<p id="out-scoop">${escapeHtml(view.scoop)}</p>
<dl>
<div><dt>${escapeHtml(copy.rows.cups)}</dt><dd id="out-cups">${escapeHtml(view.cups)}</dd></div>
<div id="row-tbsp"><dt>${escapeHtml(copy.rows.tbsp)}</dt><dd id="out-tbsp">${escapeHtml(view.tbsp)}</dd></div>
<div id="row-tsp"><dt>${escapeHtml(copy.rows.tsp)}</dt><dd id="out-tsp">${escapeHtml(view.tsp)}</dd></div>
<div><dt>${escapeHtml(copy.rows.ml)}</dt><dd id="out-ml">${escapeHtml(view.ml)}</dd></div>
<div><dt>${escapeHtml(copy.rows.grams)}</dt><dd id="out-grams">${escapeHtml(view.grams)}</dd></div>
<div><dt>${escapeHtml(copy.rows.oz)}</dt><dd id="out-oz">${escapeHtml(view.oz)}</dd></div>
<div id="row-sticks" hidden><dt>${escapeHtml(copy.rows.sticks)}</dt><dd id="out-sticks">—</dd></div>
</dl>
<p class="convention" id="convention">${escapeHtml(view.convention)}</p>
<p class="sources"><a id="fdc" data-label="${escapeHtml(copy.usda)}" href="${escapeHtml(fdcUrl(view.fdc))}">${escapeHtml(copy.usda)} FDC ${escapeHtml(view.fdc)}</a>${lang === "en" ? "." : "。"} <a href="${KING_ARTHUR_URL}">${escapeHtml(copy.king)}</a>${lang === "en" ? "." : "。"}</p>
<div class="actions">
<button type="button" id="copy">${escapeHtml(copy.copy)}</button>
<button type="button" id="print" class="secondary">${escapeHtml(copy.print)}</button>
</div>
<textarea id="recipe-text" hidden readonly></textarea>
</section>
<p class="hint standard-hint">${escapeHtml(copy.standardHint)}</p>
<section class="chart-wrap">
<h2>${escapeHtml(copy.chartTitle)}</h2>
<table class="chart"><thead><tr>${head}</tr></thead><tbody>${rows}</tbody></table>
</section>
<section class="howto"><h2>${escapeHtml(copy.howtoTitle)}</h2><ol>${steps}</ol></section>
<section class="example"><h2>${escapeHtml(copy.exampleTitle)}</h2><table><thead><tr><th>${escapeHtml(copy.before)}</th><th>${escapeHtml(copy.after)}</th></tr></thead><tbody>${example}</tbody></table></section>
<section class="faq"><h2>${escapeHtml(copy.faqTitle)}</h2>${faq}</section>
<script type="module" src="/assets/cups.js"></script>`;
}
