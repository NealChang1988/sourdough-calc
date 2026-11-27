import { cupsCopy, errorText, readAsValue } from "./cups-copy.mjs";
import { spoonCompute, spoonUnitTap } from "./spoons.mjs";
import { presentSpoon, spoonName, spoonsCopy } from "./spoons-copy.mjs";

const lang =
  document.documentElement.lang === "zh-CN" ? "zh-cn" : document.documentElement.lang === "zh-TW" ? "zh-tw" : "en";
const copy = spoonsCopy[lang];
const cups = cupsCopy[lang];
const form = document.querySelector("#spoon-calc");
const amount = form.querySelector("[name=amount]");
const ingredient = form.querySelector("[name=ingredient]");
const error = document.querySelector("#form-error");
const detected = document.querySelector("#detected");
const copyButton = document.querySelector("#copy");
const copyLabel = copyButton.textContent;
const recipeBox = document.querySelector("#recipe-text");
const rows = document.querySelector("#out-rows");
let lastView = null;

function selectedUnit() {
  return form.dataset.unit || "tbsp";
}

function spoon() {
  return form.querySelector("input[name=spoon]:checked").value;
}

function options() {
  return { ingredient: ingredient.value, spoon: spoon(), defaultUnit: selectedUnit() };
}

function syncUnits(unit) {
  form.dataset.unit = unit;
  for (const button of form.querySelectorAll(".units [data-unit]")) {
    button.setAttribute("aria-pressed", button.dataset.unit === unit ? "true" : "false");
  }
}

function setText(id, text) {
  const node = document.querySelector(id);
  if (node) node.textContent = text;
}

function showError(failure) {
  error.hidden = false;
  if (failure.reason === "kosher") error.textContent = copy.kosher;
  else if (failure.reason === "nocup") error.textContent = copy.nocup.replace("{name}", spoonName(failure.ingredient, lang));
  else if (failure.reason === "stick") error.textContent = cups.stickError;
  else error.textContent = errorText(failure.reason, lang, failure.limit || 100000, failure.unit);
  detected.textContent = "";
  setText("#out-main", "");
  setText("#out-summary", "");
  document.querySelector("#out-hint").hidden = true;
  rows.hidden = true;
  lastView = null;
}

function show(view, note) {
  error.hidden = true;
  rows.hidden = !view.showNumbers;
  detected.textContent = note;
  setText("#out-main", view.hero);
  setText("#out-summary", view.showNumbers ? view.summary : "");
  const hint = document.querySelector("#out-hint");
  hint.hidden = !view.hint;
  hint.textContent = view.hint;
  document.querySelector("#row-other").hidden = !view.showOther;
  document.querySelector("#out-other-label").textContent = view.otherLabel;
  setText("#out-other", view.other);
  document.querySelector("#row-tbsp").hidden = !view.showBoth;
  document.querySelector("#row-tsp").hidden = !view.showBoth;
  setText("#out-tbsp", view.tbsp);
  setText("#out-tsp", view.tsp);
  document.querySelector("#row-kitchen").hidden = !view.showKitchen;
  setText("#out-kitchen", view.kitchen);
  setText("#out-ml", view.ml);
  setText("#out-oz", view.oz);
  document.querySelector("#row-cups").hidden = !view.showCups;
  setText("#out-cups", view.cups);
  lastView = view;
}

function noteFor(parsed) {
  const bits = [];
  if (parsed.ingredient && parsed.ingredient !== ingredient.value) {
    bits.push(copy.usingTyped.replace("{name}", spoonName(parsed.ingredient, lang)));
  }
  const value = readAsValue(parsed, lang, "grams");
  if (parsed.unrecognized) bits.push(cups.readAs.replace("{value}", value).replace("{text}", parsed.unrecognized));
  else if (parsed.assumed) bits.push(cups.readAsBare.replace("{value}", value));
  return bits.join(" ");
}

function update() {
  const out = spoonCompute(amount.value, options());
  if (!out.ok) {
    showError(out);
    return;
  }
  if (out.parsed.unit) syncUnits(out.parsed.unit);
  show(presentSpoon(out, lang), noteFor(out.parsed));
}

amount.addEventListener("input", () => update());
form.addEventListener("change", (event) => {
  if (event.target.name === "spoon" || event.target.name === "ingredient") update();
});
form.addEventListener("submit", (event) => {
  event.preventDefault();
  update();
});

for (const button of form.querySelectorAll(".units [data-unit]")) {
  button.addEventListener("click", () => {
    const unit = button.dataset.unit;
    const tap = spoonUnitTap(amount.value, unit, options());
    amount.value = tap.amount;
    syncUnits(tap.unit);
    update();
  });
}

for (const button of form.querySelectorAll("[data-amount]")) {
  button.addEventListener("click", () => {
    amount.value = button.dataset.amount;
    syncUnits(button.dataset.unit);
    update();
  });
}

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
