import { amountCleanup, chartCell, convert, formatSwapped, parseInput, resolveAmount } from "./cups.mjs";
import { cupsCopy, detectionNote, errorText, fdcUrl, present } from "./cups-copy.mjs";

const lang =
  document.documentElement.lang === "zh-CN" ? "zh-cn" : document.documentElement.lang === "zh-TW" ? "zh-tw" : "en";
const copy = cupsCopy[lang];
const form = document.querySelector("#calc");
const amount = form.querySelector("[name=amount]");
const ingredient = form.querySelector("[name=ingredient]");
const error = document.querySelector("#form-error");
const detected = document.querySelector("#detected");
const copyButton = document.querySelector("#copy");
const copyLabel = copyButton.textContent;
const recipeBox = document.querySelector("#recipe-text");
const fields = ["out-main", "out-frac", "out-scoop", "out-cups", "out-tbsp", "out-tsp", "out-ml", "out-grams", "out-oz", "out-sticks"];
let pinned = "";
let lastView = null;

function mode() {
  return {
    direction: form.querySelector("input[name=direction]:checked").value,
    system: form.querySelector("input[name=system]:checked").value,
  };
}

function syncQuick(direction) {
  document.querySelector("[data-quick=grams]").hidden = direction !== "grams";
  document.querySelector("[data-quick=cups]").hidden = direction !== "cups";
}

function clearOutputs() {
  for (const id of fields) document.querySelector(`#${id}`).textContent = "—";
  document.querySelector("#out-warn").hidden = true;
  document.querySelector("#row-sticks").hidden = true;
  document.querySelector("#row-tbsp").classList.remove("spotlight");
  document.querySelector("#row-tsp").classList.remove("spotlight");
  lastView = null;
}

function showError(parsed) {
  const limit = parsed.limit || (mode().direction === "grams" ? 100000 : 1000);
  error.hidden = false;
  error.textContent = parsed.reason === "stick" ? copy.stickError : errorText(parsed.reason, lang, limit, parsed.unit);
  detected.textContent = "";
  clearOutputs();
  if (parsed.reason === "stick") {
    for (const id of fields) document.querySelector(`#${id}`).textContent = "";
  }
}

function show(result, note) {
  const view = present(result, lang);
  error.hidden = true;
  detected.textContent = note;
  document.querySelector("#out-main").textContent = view.main;
  document.querySelector("#out-frac").textContent = view.frac;
  document.querySelector("#out-warn").hidden = !view.warn;
  document.querySelector("#out-warn").textContent = view.warn;
  document.querySelector("#out-scoop").textContent = view.scoop;
  document.querySelector("#out-cups").textContent = view.cups;
  document.querySelector("#out-tbsp").textContent = view.tbsp;
  document.querySelector("#out-tsp").textContent = view.tsp;
  document.querySelector("#out-ml").textContent = view.ml;
  document.querySelector("#out-grams").textContent = view.grams;
  document.querySelector("#out-oz").textContent = view.oz;
  document.querySelector("#out-sticks").textContent = view.sticks || "—";
  document.querySelector("#row-sticks").hidden = !view.showSticks;
  document.querySelector("#row-tbsp").classList.toggle("spotlight", view.under);
  document.querySelector("#row-tsp").classList.toggle("spotlight", view.under);
  document.querySelector("#convention").textContent = view.convention;
  const fdc = document.querySelector("#fdc");
  fdc.href = fdcUrl(view.fdc);
  fdc.textContent = `${fdc.dataset.label} FDC ${view.fdc}`;
  lastView = view;
}

function updateChart(system) {
  for (const cell of document.querySelectorAll(".chart td[data-ing]")) {
    cell.textContent = chartCell(cell.dataset.ing, system, Number(cell.dataset.num) / Number(cell.dataset.den));
  }
}

function update(options = {}) {
  const current = mode();
  const raw = amount.value;
  const parsed = parseInput(raw, current.direction);
  if (!parsed.ok) {
    pinned = "";
    syncQuick(current.direction);
    showError(parsed);
    return;
  }
  if (options.fromAmount) {
    const noted = parsed.directionDetected || parsed.ingredientDetected || parsed.unknown || parsed.unrecognized || parsed.system || parsed.scaled;
    pinned = noted ? detectionNote(parsed, lang, { mode: current.direction }) : "";
    if (parsed.ingredientDetected) ingredient.value = parsed.ingredient;
    if (parsed.directionDetected) {
      form.querySelector(`input[name=direction][value="${parsed.direction}"]`).checked = true;
    }
    if (parsed.system) form.querySelector(`input[name=system][value="${parsed.system}"]`).checked = true;
    if (options.clean) {
      const cleanup = amountCleanup(raw, current.direction);
      if (cleanup.messy && amount.value !== cleanup.text) amount.value = cleanup.text;
    }
  }
  const chosen = mode();
  const resolved = resolveAmount(parsed, { system: chosen.system, ingredient: ingredient.value });
  if (!resolved.ok) {
    pinned = "";
    syncQuick(chosen.direction);
    showError(resolved);
    return;
  }
  if (options.fromAmount && resolved.hero === "grams" && parsed.unit && !parsed.directionDetected) {
    form.querySelector('input[name=direction][value="cups"]').checked = true;
  }
  const shown = mode();
  syncQuick(shown.direction);
  const result = convert({
    ingredient: ingredient.value,
    system: chosen.system,
    direction: resolved.direction,
    amount: resolved.amount,
  });
  result.hero = resolved.hero;
  show(result, pinned);
  updateChart(chosen.system);
}

function commitAmount() {
  const cleanup = amountCleanup(amount.value, mode().direction);
  if (!cleanup.ok || cleanup.messy) update({ fromAmount: true, clean: true });
}

amount.addEventListener("input", (event) => {
  update({ fromAmount: true, clean: event.inputType === "insertFromPaste" });
});
amount.addEventListener("change", commitAmount);
amount.addEventListener("blur", commitAmount);
amount.addEventListener("keydown", (event) => {
  if (event.key !== "Enter") return;
  event.preventDefault();
  commitAmount();
});
form.addEventListener("change", (event) => {
  const name = event.target.name;
  if (name === "ingredient" || name === "direction" || name === "system") pinned = "";
  update();
});
form.addEventListener("submit", (event) => {
  event.preventDefault();
  update();
});

for (const button of document.querySelectorAll("[data-ingredient]")) {
  button.addEventListener("click", () => {
    pinned = "";
    ingredient.value = button.dataset.ingredient;
    update();
  });
}

for (const button of document.querySelectorAll("[data-amount]")) {
  button.addEventListener("click", () => {
    amount.value = button.dataset.amount;
    amount.dispatchEvent(new Event("input", { bubbles: true }));
  });
}

document.querySelector("#swap").addEventListener("click", () => {
  const current = mode();
  const parsed = parseInput(amount.value, current.direction);
  if (!parsed.ok) {
    update();
    return;
  }
  const resolved = resolveAmount(parsed, { system: current.system, ingredient: ingredient.value });
  if (!resolved.ok) {
    update();
    return;
  }
  const result = convert({
    ingredient: ingredient.value,
    system: current.system,
    direction: resolved.direction,
    amount: resolved.amount,
  });
  const showingGrams = resolved.hero === "grams" || (resolved.hero !== "cups" && resolved.direction !== "grams");
  const next = showingGrams ? "grams" : "cups";
  amount.value = formatSwapped(next === "cups" ? result.cupsExact : result.gramsExact, next);
  form.querySelector(`input[name=direction][value="${next}"]`).checked = true;
  pinned = "";
  update();
});

copyButton.addEventListener("click", async () => {
  if (!lastView) update();
  if (!lastView) return;
  recipeBox.value = lastView.copyText;
  let copied = false;
  try {
    await navigator.clipboard.writeText(lastView.copyText);
    copied = true;
    recipeBox.hidden = true;
  } catch {
    recipeBox.hidden = false;
    recipeBox.focus();
    recipeBox.select();
    copied = document.execCommand("copy");
  }
  copyButton.textContent = copied ? copy.copied : copy.copyFail;
  if (copied) {
    const previous = copyLabel;
    setTimeout(() => {
      copyButton.textContent = previous;
    }, 1600);
  }
});

document.querySelector("#print").addEventListener("click", () => {
  window.print();
});

update();
