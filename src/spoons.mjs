import {
  CUP_LIMIT,
  GRAM_LIMIT,
  INGREDIENTS,
  OZ_G,
  STICK_G,
  UNIT_LIMITS,
  US_ML,
  convert,
  formatGrams,
  formatKitchen,
  ingredientById,
  interpret,
  parseInput,
  roundTo,
} from "./cups.mjs";

export const US_TBSP_ML = US_ML / 16;
export const US_TSP_ML = US_ML / 48;

export const SPOON_ONLY = [
  { id: "salt", tbspG: 18 },
  { id: "dc", tbspG: 8 },
  { id: "morton", tbspG: 16 },
  { id: "bp", tbspG: 12 },
  { id: "soda", tbspG: 18 },
  { id: "yeast", tbspG: 9 },
  { id: "vanilla", tbspG: 14 },
];

export const SPOON_PHRASES = [
  ["diamond crystal kosher salt", "dc"],
  ["diamond crystal", "dc"],
  ["morton kosher salt", "morton"],
  ["morton", "morton"],
  ["bicarbonate of soda", "soda"],
  ["baking soda", "soda"],
  ["baking powder", "bp"],
  ["instant yeast", "yeast"],
  ["vanilla extract", "vanilla"],
  ["table salt", "salt"],
  ["salt", "salt"],
  ["速发酵母", "yeast"],
  ["速發酵母", "yeast"],
  ["即发酵母", "yeast"],
  ["即發酵母", "yeast"],
  ["小苏打", "soda"],
  ["小蘇打", "soda"],
  ["苏打粉", "soda"],
  ["蘇打粉", "soda"],
  ["泡打粉", "bp"],
  ["香草精", "vanilla"],
  ["食盐", "salt"],
  ["食鹽", "salt"],
  ["细盐", "salt"],
  ["細鹽", "salt"],
  ["vanilla", "vanilla"],
  ["yeast", "yeast"],
  ["酵母", "yeast"],
  ["盐", "salt"],
  ["鹽", "salt"],
];

const SPOON_IDS = new Set(SPOON_ONLY.map((item) => item.id));

export function spoonOnly(id) {
  return SPOON_ONLY.find((item) => item.id === id) || null;
}

export function bareKosher(text) {
  const raw = String(text || "");
  const lower = raw.toLowerCase();
  if (/diamond\s+crystal/.test(lower) || /(?:^|[^a-z])morton(?:$|[^a-z])/.test(lower)) return false;
  if (/kosher\s+salt/.test(lower)) return true;
  return /粗盐|粗鹽|犹太盐|猶太鹽/.test(raw);
}

export function tbspGrams(id, spoon = "us") {
  const only = spoonOnly(id);
  const us = only ? only.tbspG : ingredientById(id).gUs / 16;
  if (spoon !== "metric") return us;
  return (us * 15) / US_TBSP_ML;
}

export function oneDecimal(value) {
  return roundTo(value, 1).toFixed(1);
}

export function gramsPerSpoonRows() {
  return INGREDIENTS.map((item) => ({
    id: item.id,
    tbsp: oneDecimal(item.gUs / 16),
    tsp: oneDecimal(item.gUs / 48),
  }));
}

export function spoonOnlyRows(spoon = "us") {
  return SPOON_ONLY.map((item) => ({
    id: item.id,
    tbsp: oneDecimal(spoon === "metric" ? (item.tbspG * 15) / US_TBSP_ML : item.tbspG),
    tsp: oneDecimal(spoon === "metric" ? (item.tbspG / 3) * 15 / US_TBSP_ML : item.tbspG / 3),
  }));
}

export function usMetricRows(ids = ["sugar", "ap", "butter", "water"]) {
  return ids.map((id) => ({
    id,
    us: oneDecimal(ingredientById(id).gUs / 16),
    metric: oneDecimal((ingredientById(id).gUs / US_ML) * 15),
  }));
}

export function cupSpoonRows() {
  const ml = (frac) => roundTo(US_ML * frac, 2).toFixed(2);
  return [
    { label: "1", tbsp: "16", tsp: "48", ml: ml(1) },
    { label: "1/2", tbsp: "8", tsp: "24", ml: ml(1 / 2) },
    { label: "1/4", tbsp: "4", tsp: "12", ml: ml(1 / 4) },
    { label: "1/8", tbsp: "2", tsp: "6", ml: ml(1 / 8) },
    { label: "1/16", tbsp: "1", tsp: "3", ml: ml(1 / 16) },
    { label: "1 tsp", tbsp: "", tsp: "1", ml: roundTo(US_TSP_ML, 2).toFixed(2) },
  ];
}

function spoonVolume(unit, count, spoon) {
  const tbspMl = spoon === "metric" ? 15 : US_TBSP_ML;
  const tspMl = spoon === "metric" ? 5 : US_TSP_ML;
  if (unit === "tbsp") return count * tbspMl;
  if (unit === "tsp") return count * tspMl;
  return null;
}

function cupsOfSpoons(unit, count, spoon) {
  if (unit === "tbsp") return spoon === "metric" ? (count * 15) / 250 : count / 16;
  if (unit === "tsp") return spoon === "metric" ? (count * 5) / 250 : count / 48;
  return null;
}

export function kitchenParts(tbspExact, tspExact) {
  if (!(tspExact >= 0.125 - 1e-9)) return { tiny: true };
  if (tbspExact < 1 - 1e-9) return { tiny: false, tspOnly: roundTo(tspExact, 2).toFixed(2) };
  let whole = Math.floor(tbspExact + 1e-9);
  let tenth = roundTo((tbspExact - whole) * 3, 1);
  if (tenth >= 3 - 1e-9) {
    whole += 1;
    tenth = 0;
  }
  if (tenth <= 1e-9) return { tiny: false, whole, tenth: 0 };
  return { tiny: false, whole, tenth };
}

export function formatSpoonPhrase(value, unitWord) {
  if (Math.abs(value - Math.round(value)) < 1e-6) return `${Math.round(value)} ${unitWord}`;
  const frac = formatKitchen(value);
  const decimals = roundTo(value, 2).toFixed(2);
  if (frac.includes("/")) return `${frac} ${unitWord} (${decimals})`;
  return `${decimals} ${unitWord}`;
}

function fail(reason, extra = {}) {
  return { ok: false, reason, ...extra };
}

function limitOf(unit, count, grams) {
  if (unit === "tbsp" && count > UNIT_LIMITS.tbsp) return { limit: UNIT_LIMITS.tbsp, unit: "tbsp" };
  if (unit === "tsp" && count > UNIT_LIMITS.tsp) return { limit: UNIT_LIMITS.tsp, unit: "tsp" };
  if (unit === "stick" && count > UNIT_LIMITS.stick) return { limit: UNIT_LIMITS.stick, unit: "stick" };
  if (unit === "cup" && count > CUP_LIMIT) return { limit: CUP_LIMIT, unit: "cup" };
  if (unit === "g" && grams > GRAM_LIMIT) return { limit: GRAM_LIMIT, unit: "g" };
  if (grams > GRAM_LIMIT && count > 0) return { limit: Math.floor((count * GRAM_LIMIT) / grams), unit };
  return null;
}

export function spoonCompute(raw, options = {}) {
  const menu = options.ingredient || "sugar";
  const spoon = options.spoon === "metric" ? "metric" : "us";
  const defaultUnit = options.defaultUnit || "tbsp";
  if (bareKosher(raw)) return fail("kosher");
  const parsed0 = parseInput(String(raw ?? ""), "grams", {
    deferBareCap: true,
    extraPhrases: SPOON_PHRASES,
  });
  if (!parsed0.ok) return { ok: false, parsed: parsed0, reason: parsed0.reason, limit: parsed0.limit, unit: parsed0.unit };
  const parsed = defaultUnit && !parsed0.unit ? { ...parsed0, unit: defaultUnit, assumed: true } : parsed0;
  const ingredient = parsed.ingredient || menu;
  const unit = parsed.unit;
  const count = parsed.assumed || !["oz", "lb", "kg", "g"].includes(unit) ? parsed.count ?? parsed.value : parsed.count ?? parsed.value;
  const only = spoonOnly(ingredient);
  if (only && unit === "cup") return fail("nocup", { ingredient, parsed });
  if (unit === "stick" && ingredient !== "butter") return fail("stick", { parsed });

  if (!only && ["tbsp", "tsp", "cup", "stick", "g", "oz", "lb", "ml"].includes(unit)) {
    const via = interpret(String(raw ?? ""), {
      ingredient: menu,
      defaultUnit,
      system: spoon === "metric" ? "metric" : "us",
      spoonStyle: spoon === "metric" ? "follow" : "us",
      hero: "grams",
      mode: "grams",
      extraPhrases: SPOON_PHRASES,
    });
    if (!via.ok) return { ok: false, parsed: via.parsed, resolved: via.resolved, reason: (via.resolved || via.parsed).reason, limit: (via.resolved || via.parsed).limit, unit: (via.resolved || via.parsed).unit };
    return finishCupBased(via, spoon, ingredient);
  }

  const perTbsp = tbspGrams(ingredient, spoon);
  let grams = 0;
  if (unit === "tbsp") grams = count * perTbsp;
  else if (unit === "tsp") grams = count * (perTbsp / 3);
  else if (unit === "g") grams = parsed.assumed ? count : parsed.value;
  else if (unit === "oz") grams = count * OZ_G;
  else if (unit === "lb") grams = count * OZ_G * 16;
  else if (unit === "kg") grams = count * 1000;
  else if (unit === "ml") grams = count * (perTbsp / (spoon === "metric" ? 15 : US_TBSP_ML));
  else if (unit === "stick") grams = count * STICK_G;
  else return fail("format", { parsed });

  const capped = limitOf(unit, count, grams);
  if (capped) return fail("limit", { ...capped, parsed });
  const tbspExact = grams / perTbsp;
  const tspExact = tbspExact * 3;
  const mlExact = unit === "ml" ? count : unit === "tbsp" || unit === "tsp" ? spoonVolume(unit, count, spoon) : (grams / perTbsp) * (spoon === "metric" ? 15 : US_TBSP_ML);
  return pack({
    parsed,
    ingredient,
    spoon,
    forward: unit !== "g" && unit !== "kg",
    grams,
    tbspExact,
    tspExact,
    mlExact,
    cupsExact: null,
  });
}

function finishCupBased(via, spoon, ingredient) {
  const unit = via.parsed.unit;
  const count = via.parsed.count ?? via.parsed.value;
  const grams = via.result.gramsExact;
  const perTbsp = tbspGrams(ingredient, spoon);
  let tbspExact;
  let tspExact;
  let mlExact;
  let cupsExact;
  if (unit === "tbsp" || unit === "tsp") {
    tbspExact = unit === "tbsp" ? count : count / 3;
    tspExact = tbspExact * 3;
    mlExact = spoonVolume(unit, count, spoon);
    cupsExact = cupsOfSpoons(unit, count, spoon);
  } else if (unit === "cup") {
    tbspExact = spoon === "metric" ? count * (250 / 15) : count * 16;
    tspExact = tbspExact * 3;
    mlExact = count * (spoon === "metric" ? 250 : US_ML);
    cupsExact = count;
  } else if (unit === "stick") {
    tbspExact = grams / perTbsp;
    tspExact = tbspExact * 3;
    mlExact = (grams / ingredientById("butter").gUs) * US_ML;
    cupsExact = grams / ingredientById("butter").gUs;
  } else if (unit === "ml") {
    mlExact = count;
    tbspExact = grams / perTbsp;
    tspExact = tbspExact * 3;
    cupsExact = spoon === "metric" ? count / 250 : count / US_ML;
  } else {
    tbspExact = grams / perTbsp;
    tspExact = tbspExact * 3;
    mlExact = tbspExact * (spoon === "metric" ? 15 : US_TBSP_ML);
    cupsExact = spoon === "metric" ? mlExact / 250 : mlExact / US_ML;
  }
  return pack({
    parsed: via.parsed,
    ingredient: via.resolved.ingredient,
    spoon,
    forward: unit !== "g" && unit !== "kg",
    grams,
    tbspExact,
    tspExact,
    mlExact,
    cupsExact: spoonOnly(via.resolved.ingredient) ? null : cupsExact,
  });
}

function pack(input) {
  const forwardTiny = input.tspExact < 0.125 - 1e-9;
  const kitchen = input.forward ? { tiny: forwardTiny } : kitchenParts(input.tbspExact, input.tspExact);
  return {
    ok: true,
    ...input,
    gramsLabel: formatGrams(input.grams),
    tbspText: roundTo(input.tbspExact, 2).toFixed(2),
    tspText: roundTo(input.tspExact, 2).toFixed(2),
    mlText: roundTo(input.mlExact, 2).toFixed(2),
    ozText: roundTo(input.grams / OZ_G, 2).toFixed(2),
    cupsText: input.cupsExact == null ? null : cupsText(input.cupsExact),
    tiny: input.forward ? forwardTiny : kitchen.tiny,
    parts: kitchen,
  };
}

function cupsText(value) {
  const label = formatKitchen(value, { sixteenths: true });
  if (label.includes("(")) return label;
  if (/\/8\b/.test(label)) return `${label} (${roundTo(value, 2).toFixed(2)})`;
  if (label.includes("/")) return label;
  if (Math.abs(value - Math.round(value)) < 0.002) return String(Math.round(value));
  return roundTo(value, 2).toFixed(2);
}

export function spoonUnitTap(raw, nextUnit, options = {}) {
  const current = spoonCompute(raw, options);
  if (!current.ok || !current.parsed.unit || current.parsed.assumed || current.parsed.unit === nextUnit) {
    return { amount: String(raw ?? ""), unit: nextUnit };
  }
  const exact = nextUnit === "tbsp" ? current.tbspExact : nextUnit === "tsp" ? current.tspExact : current.grams;
  const target = current.gramsLabel;
  const candidates = [];
  if (nextUnit !== "g") {
    const frac = formatKitchen(exact);
    if (frac && !frac.includes("(")) candidates.push(frac);
  }
  for (let digits = 0; digits <= 4; digits += 1) candidates.push(String(roundTo(exact, digits)));
  const seen = new Set();
  for (const text of candidates) {
    if (!text || seen.has(text)) continue;
    seen.add(text);
    const again = spoonCompute(text, { ...options, defaultUnit: nextUnit });
    if (again.ok && again.gramsLabel === target) return { amount: text, unit: nextUnit };
  }
  return { amount: String(roundTo(exact, 4)), unit: nextUnit };
}

export function otherSpoon(result) {
  if (result.parsed.unit === "tsp" || (result.forward && result.tbspExact < 1 && result.parsed.unit !== "tbsp")) {
    return { kind: "tbsp", value: result.tbspExact };
  }
  return { kind: "tsp", value: result.tspExact };
}

export { convert, formatGrams, formatKitchen, roundTo };
