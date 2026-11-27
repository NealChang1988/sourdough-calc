import { cupsCopy, detectionNote, errorText } from "./cups-copy.mjs";
import { applyUnitTap, interpret } from "./cups.mjs";
import { butterCopy, butterView } from "./butter-copy.mjs";

const lang =
  document.documentElement.lang === "zh-CN" ? "zh-cn" : document.documentElement.lang === "zh-TW" ? "zh-tw" : "en";
const copy = butterCopy[lang];
const names = cupsCopy[lang].names;
const form = document.querySelector("#butter-calc");
const amount = form.querySelector("[name=amount]");
const error = document.querySelector("#form-error");
const detected = document.querySelector("#detected");
const copyButton = document.querySelector("#copy");
const copyLabel = copyButton.textContent;
const recipeBox = document.querySelector("#recipe-text");
const rows = document.querySelector("#out-rows");
let lastView = null;

function system() {
  return form.querySelector("input[name=system]:checked").value;
}

function selectedUnit() {
  return form.dataset.unit || "stick";
}

function syncUnits(unit) {
  form.dataset.unit = unit;
  for (const button of form.querySelectorAll("[data-unit]")) {
    if (!button.dataset.amount) button.setAttribute("aria-pressed", button.dataset.unit === unit ? "true" : "false");
  }
}

function showError(failure) {
  error.hidden = false;
  error.textContent =
    failure.reason === "stick" ? cupsCopy[lang].stickError : errorText(failure.reason, lang, failure.limit || 100000, failure.unit);
  detected.textContent = "";
  document.querySelector("#out-main").textContent = "";
  document.querySelector("#out-summary").textContent = "";
  document.querySelector("#out-frac").textContent = "";
  rows.hidden = true;
  lastView = null;
}

function show(view, note) {
  error.hidden = true;
  rows.hidden = false;
  detected.textContent = note;
  document.querySelector("#out-main").textContent = view.grams;
  document.querySelector("#out-summary").textContent = view.summary;
  document.querySelector("#out-frac").textContent = view.frac;
  for (const key of ["oz", "sticks", "tbsp", "tsp", "cups", "ml"]) {
    document.querySelector(`#out-${key}`).textContent = view.cells[key];
  }
  document.querySelector("#row-sticks").hidden = !view.showSticks;
  lastView = view;
}

function update() {
  const raw = amount.value;
  const out = interpret(raw, {
    ingredient: "butter",
    system: system(),
    mode: "grams",
    spoonStyle: "us",
    defaultUnit: selectedUnit(),
    hero: "grams",
  });
  document.querySelector("#standard-hint").hidden = system() === "us";
  if (!out.ok) {
    showError(out.resolved || out.parsed);
    return;
  }
  if (out.parsed.unit) syncUnits(out.parsed.unit);
  let note = detectionNote(out.parsed, lang, { mode: "grams", pageIngredient: "butter", skipDirection: true });
  if (out.parsed.ingredient && out.parsed.ingredient !== "butter" && out.parsed.unit !== "stick") {
    const using = copy.usingTyped.replace("{name}", names[out.parsed.ingredient]);
    note = note ? `${using} ${note}` : using;
  }
  show(butterView(out.result, lang), note);
}

amount.addEventListener("input", () => update());
form.addEventListener("change", (event) => {
  if (event.target.name === "system") update();
});
form.addEventListener("submit", (event) => {
  event.preventDefault();
  update();
});

for (const button of form.querySelectorAll(".units [data-unit]")) {
  button.addEventListener("click", () => {
    const unit = button.dataset.unit;
    const tap = applyUnitTap(amount.value, unit, {
      ingredient: "butter",
      system: system(),
      spoonStyle: "us",
      defaultUnit: selectedUnit(),
      hero: "grams",
    });
    amount.value = tap.amount;
    syncUnits(unit);
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
