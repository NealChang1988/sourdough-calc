export function gramsFromFlour(input) {
  const flour = input.flour;
  const water = (flour * input.hydration) / 100;
  const starter = (flour * input.starter) / 100;
  const salt = (flour * input.salt) / 100;
  const yeast = (flour * (input.yeast ?? 0)) / 100;
  const total = flour + water + starter + salt + yeast;
  return { flour, water, starter, salt, yeast, total };
}

function isRoundedTenth(n) {
  if (!Number.isFinite(n)) return false;
  const tenths = snap(n) * 10;
  const nearest = Math.round(tenths);
  if (Math.abs(tenths - nearest) > 1e-6) return false;
  return nearest % 10 !== 0;
}

function snappedFlour(input, flour) {
  const balls = input.balls;
  const per = input.gramsPerBall;
  if (!(balls > 0) || !Number.isFinite(flour) || !isRoundedTenth(per)) return flour;
  let best = null;
  for (const candidate of [Math.round(flour), Math.floor(flour), Math.ceil(flour)]) {
    if (!(candidate > 0)) continue;
    const made = gramsFromFlour({ ...input, flour: candidate });
    const gap = Math.abs(made.total / balls - per);
    if (gap > 0.051) continue;
    if (best === null || gap < best.gap) best = { flour: candidate, gap };
  }
  return best ? best.flour : flour;
}

export function flourFromBalls(input) {
  const total = input.balls * input.gramsPerBall;
  const percentSum = input.hydration + input.starter + input.salt + (input.yeast ?? 0);
  const flour = total / (1 + percentSum / 100);
  return gramsFromFlour({ ...input, flour: snappedFlour(input, flour) });
}

export function recipeFor(preset) {
  if (preset.mode === "balls") return flourFromBalls(preset);
  return gramsFromFlour(preset);
}

export function effectiveHydration(recipe) {
  const starterFlour = recipe.starter / 2;
  const starterWater = recipe.starter / 2;
  const flourAll = recipe.flour + starterFlour;
  const waterAll = recipe.water + starterWater;
  if (flourAll === 0) return 0;
  return (waterAll / flourAll) * 100;
}

function snap(n) {
  return Math.round(n * 1e6) / 1e6;
}

export function round1(n) {
  return Math.round(snap(n) * 10) / 10;
}

export function formatAmount(n) {
  const rounded = round1(n);
  if (Number.isInteger(rounded)) return String(rounded);
  return rounded.toFixed(1);
}

function formatPiece(n) {
  return formatAmount(n);
}

function shownPreset(n) {
  const text = String(n);
  return text.includes("e") ? formatAmount(n) : text;
}

const AMOUNT_TOKENS = {
  flour: (recipe) => formatAmount(recipe.flour),
  water: (recipe) => formatAmount(recipe.water),
  starter: (recipe) => formatAmount(recipe.starter),
  salt: (recipe) => formatAmount(recipe.salt),
  yeast: (recipe) => formatAmount(recipe.yeast),
  total: (recipe) => formatAmount(recipe.total),
  effective: (recipe) => formatAmount(effectiveHydration(recipe)),
  piece: (recipe, preset) => formatPiece(recipe.total / preset.balls),
  seeds: (recipe) => formatAmount(recipe.flour * 0.16),
  olives: (recipe) => formatAmount(recipe.flour * 0.2),
  poolishHalf: (recipe) => formatAmount(recipe.starter / 2),
  hydration: (_recipe, preset) => shownPreset(preset.hydration),
  starterPct: (_recipe, preset) => shownPreset(preset.starter),
  saltPct: (_recipe, preset) => shownPreset(preset.salt),
  yeastPct: (_recipe, preset) => shownPreset(preset.yeast),
  balls: (_recipe, preset) => shownPreset(preset.balls),
};

const CONDITIONS = [
  ["ifYeast", "endYeast", (recipe) => formatAmount(recipe.yeast) !== "0"],
  ["ifStarter", "endStarter", (recipe) => formatAmount(recipe.starter) !== "0"],
  ["ifMany", "endMany", (_recipe, preset) => Number(preset.balls) > 1],
  ["ifOne", "endOne", (_recipe, preset) => !(Number(preset.balls) > 1)],
];

function joinItems(items, sep, andWord) {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  if (sep === "、") return `${items.slice(0, -1).join("、")}${andWord} ${items[items.length - 1]}`;
  if (items.length === 2) return `${items[0]} ${andWord} ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, ${andWord} ${items[items.length - 1]}`;
}

function joinMarkedLists(text) {
  const lists = [
    ["enjoin", ", ", "and"],
    ["zhjoin", "、", "和"],
  ];
  let out = text;
  for (const [name, sep, andWord] of lists) {
    out = out.replace(new RegExp(`\\{\\{${name}\\}\\}([\\s\\S]*?)\\{\\{endjoin\\}\\}`, "g"), (_, inner) => {
      const items = [...inner.matchAll(/\{\{item\}\}([\s\S]*?)\{\{enditem\}\}/g)]
        .map((match) => match[1].trim())
        .filter(Boolean);
      return joinItems(items, sep, andWord);
    });
  }
  return out;
}

function applyConditions(text, recipe, preset) {
  let out = text;
  let prev;
  do {
    prev = out;
    for (const [open, close, pred] of CONDITIONS) {
      const keep = pred(recipe, preset);
      out = out.replace(new RegExp(`\\{\\{${open}\\}\\}([\\s\\S]*?)\\{\\{${close}\\}\\}`, "g"), (_, inner) => (keep ? inner : ""));
    }
  } while (out !== prev);
  return out;
}

export function fillAmounts(text, recipe, preset) {
  const source = joinMarkedLists(applyConditions(String(text), recipe, preset));
  if (!source.includes("{{")) return source;
  return source.replace(/\{\{([A-Za-z]+)\}\}/g, (token, key) => {
    const fill = AMOUNT_TOKENS[key];
    return fill ? fill(recipe, preset) : token;
  });
}

export function toHalfWidth(text) {
  return String(text)
    .replaceAll("\u3000", " ")
    .replace(/[\uFF10-\uFF19]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0xfee0))
    .replaceAll("\uFF0E", ".")
    .replaceAll("\uFF0C", ",")
    .replaceAll("\uFF0F", "/")
    .replaceAll("\uFF05", "%")
    .replaceAll("\uFF47", "g")
    .replaceAll("\uFF27", "G");
}

function halfWidth(text) {
  return toHalfWidth(text);
}

function numberFrom(value) {
  if (typeof value === "number") return value;
  if (typeof value !== "string") return Number.NaN;
  const text = halfWidth(value)
    .trim()
    .replace(/\s*(?:g|克|%)\s*$/iu, "")
    .trim();
  if (!/^-?\d+(?:\.\d+)?$/.test(text) && !/^-?\d{1,3}(?:,\d{3})+(?:\.\d+)?$/.test(text)) {
    return Number.NaN;
  }
  return Number(text.replaceAll(",", ""));
}

export function parseInputs(raw) {
  const mode = raw.mode === "balls" ? "balls" : "flour";
  const values = {
    hydration: numberFrom(raw.hydration),
    starter: numberFrom(raw.starter),
    salt: numberFrom(raw.salt),
    yeast: numberFrom(raw.yeast),
    flour: numberFrom(raw.flour),
    balls: numberFrom(raw.balls),
    gramsPerBall: numberFrom(raw.gramsPerBall),
  };
  const order =
    mode === "balls"
      ? ["balls", "gramsPerBall", "hydration", "starter", "salt", "yeast"]
      : ["flour", "hydration", "starter", "salt", "yeast"];
  for (const name of order) {
    const value = values[name];
    const weight = name === "flour" || name === "balls" || name === "gramsPerBall";
    if (!Number.isFinite(value) || value < 0 || (weight && !(value > 0))) {
      return { ok: false, field: name };
    }
  }
  return { ok: true, preset: { mode, ...values } };
}
