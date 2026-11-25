export function gramsFromFlour(input) {
  const flour = input.flour;
  const water = (flour * input.hydration) / 100;
  const starter = (flour * input.starter) / 100;
  const salt = (flour * input.salt) / 100;
  const yeast = (flour * (input.yeast ?? 0)) / 100;
  const total = flour + water + starter + salt + yeast;
  return { flour, water, starter, salt, yeast, total };
}

export function flourFromBalls(input) {
  const total = input.balls * input.gramsPerBall;
  const percentSum = input.hydration + input.starter + input.salt + (input.yeast ?? 0);
  const flour = total / (1 + percentSum / 100);
  return gramsFromFlour({ ...input, flour });
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

export function round1(n) {
  return Math.round((n + Number.EPSILON) * 10) / 10;
}

export function formatAmount(n) {
  const rounded = round1(n);
  if (Number.isInteger(rounded)) return String(rounded);
  return rounded.toFixed(1);
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
