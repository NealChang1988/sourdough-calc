import { effectiveHydration, fillAmounts, formatAmount, parseInputs, recipeFor } from "./formula.mjs";

const form = document.querySelector("#calc");
const labels = JSON.parse(document.querySelector("#labels").textContent);
const outs = {
  flour: document.querySelector("#out-flour"),
  water: document.querySelector("#out-water"),
  starter: document.querySelector("#out-starter"),
  salt: document.querySelector("#out-salt"),
  yeast: document.querySelector("#out-yeast"),
  total: document.querySelector("#out-total"),
  effective: document.querySelector("#out-effective"),
};
const error = document.querySelector("#form-error");
const copyButton = document.querySelector("#copy");
const recipeBox = document.querySelector("#recipe-text");
const copyLabel = copyButton.textContent;

function readForm() {
  const data = new FormData(form);
  return parseInputs({
    mode: data.get("mode"),
    flour: data.get("flour"),
    balls: data.get("balls"),
    gramsPerBall: data.get("gramsPerBall"),
    hydration: data.get("hydration"),
    starter: data.get("starter"),
    salt: data.get("salt"),
    yeast: data.get("yeast"),
  });
}

function showRecipe(recipe, preset) {
  for (const key of ["flour", "water", "starter", "salt", "yeast", "total"]) {
    outs[key].textContent = `${formatAmount(recipe[key])} ${labels.grams}`;
  }
  outs.effective.textContent = `${formatAmount(effectiveHydration(recipe))}%`;
  if (new FormData(form).get("mode") === "balls") {
    form.querySelector("[name=flour]").value = formatAmount(recipe.flour);
  }
  for (const el of document.querySelectorAll("[data-template]")) {
    const text = fillAmounts(el.dataset.template, recipe, preset).trim();
    el.textContent = text;
    const item = el.closest("ol > li");
    if (item) item.hidden = text === "";
  }
}

function recipeText(recipe) {
  const sep = document.documentElement.lang.toLowerCase().startsWith("zh") ? "：" : ": ";
  const lines = [labels.title];
  const rows = [
    ["flour", true],
    ["water", true],
    ["starter", recipe.starter !== 0],
    ["salt", true],
    ["yeast", recipe.yeast !== 0],
    ["total", true],
  ];
  for (const [key, show] of rows) {
    if (!show) continue;
    lines.push(`${labels[key]}${sep}${formatAmount(recipe[key])} ${labels.grams}`);
  }
  lines.push(`${labels.effective}${sep}${formatAmount(effectiveHydration(recipe))}%`);
  return lines.join("\n");
}

function syncPanels() {
  const mode = new FormData(form).get("mode");
  form.querySelector("[data-panel=flour]").hidden = mode !== "flour";
  form.querySelector("[data-panel=balls]").hidden = mode !== "balls";
}

function clearRecipe() {
  for (const key of Object.keys(outs)) outs[key].textContent = "—";
}

function showError(field) {
  error.hidden = false;
  const input = field ? form.querySelector(`[name="${field}"]`) : null;
  const panel = input?.closest("[data-panel]");
  if (input && !panel?.hidden) {
    input.insertAdjacentElement("afterend", error);
    return;
  }
  document.querySelector(".result h2").insertAdjacentElement("afterend", error);
}

function update() {
  syncPanels();
  const parsed = readForm();
  if (!parsed.ok) {
    clearRecipe();
    showError(parsed.field);
    return;
  }
  error.hidden = true;
  showRecipe(recipeFor(parsed.preset), parsed.preset);
}

form.addEventListener("input", update);
form.addEventListener("change", update);
form.addEventListener("submit", (event) => {
  event.preventDefault();
  update();
});

copyButton.addEventListener("click", async () => {
  const parsed = readForm();
  if (!parsed.ok) {
    clearRecipe();
    showError(parsed.field);
    return;
  }
  const text = recipeText(recipeFor(parsed.preset));
  recipeBox.value = text;
  let copied = false;
  try {
    await navigator.clipboard.writeText(text);
    copied = true;
    recipeBox.hidden = true;
  } catch {
    recipeBox.hidden = false;
    recipeBox.focus();
    recipeBox.select();
    copied = document.execCommand("copy");
  }
  copyButton.textContent = copied ? labels.copied : labels.copyFail;
  if (copied) {
    setTimeout(() => {
      copyButton.textContent = copyLabel;
    }, 1600);
  }
});

document.querySelector("#print").addEventListener("click", () => {
  window.print();
});

const pdfButton = document.querySelector("#download-pdf");
const pdfError = document.querySelector("#pdf-error");
if (pdfButton) {
  const pdfLabel = pdfButton.dataset.label;
  let pdfBusy = false;
  async function runPdf() {
    if (pdfBusy) return;
    const parsed = readForm();
    if (!parsed.ok) {
      clearRecipe();
      showError(parsed.field);
      pdfButton.disabled = false;
      pdfButton.textContent = pdfLabel;
      return;
    }
    error.hidden = true;
    const recipe = recipeFor(parsed.preset);
    showRecipe(recipe, parsed.preset);
    pdfBusy = true;
    pdfButton.disabled = true;
    pdfButton.textContent = pdfButton.dataset.busy;
    try {
      const meta = JSON.parse(document.querySelector("#pdf-meta").textContent);
      const pdf = await import("./pdf-doc.js");
      const bytes = await pdf.buildRecipePdf({
        title: meta.title,
        url: meta.url,
        lang: meta.lang,
        fontUrl: meta.fontUrl,
        labels: meta.labels,
        method: {
          heading: meta.method.heading,
          lead: meta.method.leadTemplate
            ? fillAmounts(meta.method.leadTemplate, recipe, parsed.preset)
            : meta.method.lead,
          steps: meta.method.steps.map((step) => ({
            title: step.title,
            body: step.bodyTemplate ? fillAmounts(step.bodyTemplate, recipe, parsed.preset).trim() : step.body,
          })),
        },
        inputs: parsed.preset,
        recipe,
      });
      pdf.downloadPdf(bytes, meta.filename);
      if (pdfError) pdfError.hidden = true;
    } catch (err) {
      console.error(err);
      if (pdfError) pdfError.hidden = false;
    } finally {
      pdfBusy = false;
      pdfButton.disabled = false;
      pdfButton.textContent = pdfLabel;
    }
  }
  window.__pdfReady = true;
  pdfButton.addEventListener("click", () => {
    runPdf();
  });
  if (window.__pdfPending) {
    window.__pdfPending = false;
    runPdf();
  }
}

update();
