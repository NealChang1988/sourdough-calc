import { toHalfWidth } from "./formula.mjs";

export const US_ML = 236.5882365;
export const METRIC_ML = 250;
export const UK_ML = 284.130625;
export const OZ_G = 28.3495;
// 4 oz, with the international avoirdupois ounce. A US cup of butter is two sticks.
export const STICK_G = 113.3980925;
export const GRAM_LIMIT = 100000;
export const CUP_LIMIT = 1000;
export const UNIT_LIMITS = { stick: 2000, tbsp: 16000, tsp: 48000 };

export const SYSTEMS = {
  us: { id: "us", ml: US_ML, tbspMl: US_ML / 16, tspMl: US_ML / 48 },
  metric: { id: "metric", ml: METRIC_ML, tbspMl: 15, tspMl: 5 },
  uk: { id: "uk", ml: UK_ML, tbspMl: UK_ML / 16, tspMl: UK_ML / 48 },
};

export const INGREDIENTS = [
  { id: "ap", gUs: 120, group: "flour", quick: "flour", fdc: "168894" },
  { id: "bread", gUs: 120, group: "flour", fdc: "168896" },
  { id: "whole", gUs: 113, group: "flour", fdc: "168893" },
  { id: "sugar", gUs: 200, group: "sugar", quick: "sugar", fdc: "169655" },
  { id: "brown", gUs: 220, group: "sugar", quick: "brown", fdc: "168833" },
  { id: "powdered", gUs: 120, group: "sugar", fdc: "169656" },
  { id: "butter", gUs: STICK_G * 2, group: "fat", quick: "butter", fdc: "173410" },
  { id: "milk", gUs: 244, group: "fat", fdc: "171265" },
  { id: "honey", gUs: 339, group: "liquid", quick: "honey", fdc: "169640" },
  { id: "water", gUs: US_ML, group: "liquid", quick: "water", fdc: "173647" },
  { id: "oil", gUs: 218, group: "liquid", fdc: "171411" },
  { id: "olive", gUs: 216, group: "liquid", fdc: "171413" },
  { id: "cocoa", gUs: 86, group: "dry", fdc: "169593" },
  { id: "oats", gUs: 89, group: "dry", fdc: "173904" },
  { id: "rice", gUs: 185, group: "dry", fdc: "168877" },
  { id: "corn", gUs: 128, group: "dry", fdc: "169698" },
];

const GROUPS = ["flour", "sugar", "fat", "liquid", "dry"];

const PHRASES = [
  ["all-purpose flour", "ap"],
  ["all purpose flour", "ap"],
  ["plain flour", "ap"],
  ["all-purpose", "ap"],
  ["all purpose", "ap"],
  ["bread flour", "bread"],
  ["strong flour", "bread"],
  ["whole wheat flour", "whole"],
  ["whole-wheat flour", "whole"],
  ["wholemeal flour", "whole"],
  ["whole wheat", "whole"],
  ["whole-wheat", "whole"],
  ["brown sugar", "brown"],
  ["powdered sugar", "powdered"],
  ["confectioners' sugar", "powdered"],
  ["confectioners sugar", "powdered"],
  ["confectioner's sugar", "powdered"],
  ["icing sugar", "powdered"],
  ["granulated sugar", "sugar"],
  ["caster sugar", "sugar"],
  ["white sugar", "sugar"],
  ["corn starch", "corn"],
  ["cornstarch", "corn"],
  ["cocoa powder", "cocoa"],
  ["rolled oats", "oats"],
  ["old-fashioned oats", "oats"],
  ["old fashioned oats", "oats"],
  ["olive oil", "olive"],
  ["vegetable oil", "oil"],
  ["whole milk", "milk"],
  ["white rice", "rice"],
  ["flour", "ap"],
  ["sugar", "sugar"],
  ["butter", "butter"],
  ["cocoa", "cocoa"],
  ["oats", "oats"],
  ["rice", "rice"],
  ["honey", "honey"],
  ["milk", "milk"],
  ["water", "water"],
  ["oil", "oil"],
  ["中筋麵粉", "ap"],
  ["中筋面粉", "ap"],
  ["高筋麵粉", "bread"],
  ["高筋面粉", "bread"],
  ["全麥麵粉", "whole"],
  ["全麦面粉", "whole"],
  ["全麥粉", "whole"],
  ["全麦粉", "whole"],
  ["中筋粉", "ap"],
  ["高筋粉", "bread"],
  ["無糖可可粉", "cocoa"],
  ["无糖可可粉", "cocoa"],
  ["傳統燕麥片", "oats"],
  ["传统燕麦片", "oats"],
  ["玉米澱粉", "corn"],
  ["玉米淀粉", "corn"],
  ["細砂糖", "sugar"],
  ["细砂糖", "sugar"],
  ["白砂糖", "sugar"],
  ["可可粉", "cocoa"],
  ["燕麥片", "oats"],
  ["燕麦片", "oats"],
  ["橄欖油", "olive"],
  ["橄榄油", "olive"],
  ["植物油", "oil"],
  ["全脂鮮奶", "milk"],
  ["全脂牛奶", "milk"],
  ["全脂奶", "milk"],
  ["生白米", "rice"],
  ["麵粉", "ap"],
  ["面粉", "ap"],
  ["全麥", "whole"],
  ["全麦", "whole"],
  ["紅糖", "brown"],
  ["红糖", "brown"],
  ["糖粉", "powdered"],
  ["砂糖", "sugar"],
  ["奶油", "butter"],
  ["黃油", "butter"],
  ["黄油", "butter"],
  ["燕麥", "oats"],
  ["燕麦", "oats"],
  ["蜂蜜", "honey"],
  ["鮮奶", "milk"],
  ["牛奶", "milk"],
  ["白米", "rice"],
].sort((a, b) => b[0].length - a[0].length);

const SOLO = [
  ["水", "water"],
  ["米", "rice"],
];

const UNICODE_FRACTIONS = {
  "½": "1/2",
  "⅓": "1/3",
  "⅔": "2/3",
  "¼": "1/4",
  "¾": "3/4",
  "⅛": "1/8",
  "⅜": "3/8",
  "⅝": "5/8",
  "⅞": "7/8",
  "⅕": "1/5",
  "⅖": "2/5",
  "⅗": "3/5",
  "⅘": "4/5",
  "⅙": "1/6",
  "⅚": "5/6",
};

const FRAC_SIZES = [
  [3 / 4, "3/4"],
  [2 / 3, "2/3"],
  [1 / 2, "1/2"],
  [1 / 3, "1/3"],
  [1 / 4, "1/4"],
];

const NEAREST = [
  [0, ""],
  [1 / 8, "1/8"],
  [1 / 4, "1/4"],
  [1 / 3, "1/3"],
  [3 / 8, "3/8"],
  [1 / 2, "1/2"],
  [5 / 8, "5/8"],
  [2 / 3, "2/3"],
  [3 / 4, "3/4"],
  [7 / 8, "7/8"],
  [1, "1"],
];

const STOPS = ["of", "a", "an", "the", "and", "for", "to", "into", "about", "approx", "approximately", "roughly", "some", "的", "約", "大约", "大約", "左右"];

export function ingredientById(id) {
  return INGREDIENTS.find((item) => item.id === id);
}

export function ingredientGroups() {
  return GROUPS.map((id) => ({ id, items: INGREDIENTS.filter((item) => item.group === id) }));
}

export function roundTo(value, digits) {
  const factor = 10 ** digits;
  const shifted = value * factor;
  return Math.round(shifted + Math.sign(shifted) * 1e-8) / factor;
}

export function formatWeight(value) {
  const rounded = roundTo(value, 2);
  if (Math.abs(rounded - Math.round(rounded)) < 1e-9) return String(Math.round(rounded));
  return rounded.toFixed(2);
}

export function formatGrams(value) {
  const rounded = roundTo(value, 2);
  if (rounded < 10) return roundTo(rounded, 1).toFixed(1);
  const one = roundTo(rounded, 1);
  if (Math.abs(one - Math.round(one)) < 1e-9) return String(Math.round(one));
  return one.toFixed(1);
}

export function trimNumber(value) {
  const rounded = roundTo(value, 6);
  if (Math.abs(rounded - Math.round(rounded)) < 1e-9) return String(Math.round(rounded));
  return String(rounded);
}

export function cupWeight(id, system) {
  const item = ingredientById(id);
  return roundTo((item.gUs * SYSTEMS[system].ml) / US_ML, 2);
}

export function chartCell(id, system, frac) {
  return formatWeight(roundTo(cupWeight(id, system) * frac, 2));
}

function formatDiff(pct) {
  const rounded = roundTo(pct, 1);
  const sign = rounded < 0 ? "-" : "+";
  return `${sign}${Math.abs(rounded).toFixed(1)}%`;
}

export function nearestCup(cups) {
  if (!(cups >= 1 / 8)) return { label: "< 1/8", diff: "+0.0%", under: true, pct: 0 };
  const base = Math.floor(cups);
  let best = null;
  for (let whole = base; whole <= base + 1; whole += 1) {
    for (const [frac, label] of NEAREST) {
      const value = whole + frac;
      const distance = Math.abs(value - cups);
      const text = frac === 0 || frac === 1 ? String(whole + frac) : whole === 0 ? label : `${whole} ${label}`;
      if (!best || distance < best.distance - 1e-12) best = { value, distance, text };
    }
  }
  const pct = ((best.value - cups) / cups) * 100;
  return { label: best.text, diff: formatDiff(pct), under: false, pct: roundTo(pct, 1) };
}

export function scoopParts(cups, system) {
  const tbspPerCup = system === "metric" ? METRIC_ML / 15 : 16;
  const tspPerCup = system === "metric" ? 50 : 48;
  let remaining = cups;
  const whole = Math.floor(remaining + 1e-9);
  remaining -= whole;
  let frac = null;
  for (const [size, label] of FRAC_SIZES) {
    if (remaining + 1e-9 >= size) {
      frac = label;
      remaining -= size;
      break;
    }
  }
  let tbsp = Math.floor(remaining * tbspPerCup + 1e-9);
  remaining -= tbsp / tbspPerCup;
  let tsp = Math.round(remaining * tspPerCup * 2) / 2;
  if (tsp >= 3 - 1e-9) {
    tbsp += Math.floor(tsp / 3);
    tsp = Math.round((tsp % 3) * 2) / 2;
  }
  if (Math.abs(tsp) < 1e-9) tsp = 0;
  if (Math.abs(tsp - 3) < 1e-9) {
    tbsp += 1;
    tsp = 0;
  }
  return { whole, frac, tbsp, tsp };
}

export function formatScoop(parts, units) {
  const bits = [];
  if (parts.whole) bits.push(`${parts.whole} ${parts.whole === 1 ? units.one : units.many}`);
  if (parts.frac) bits.push(`${parts.frac} ${units.one}`);
  if (parts.tbsp) bits.push(`${parts.tbsp} ${units.tbsp}`);
  if (parts.tsp) bits.push(`${trimNumber(parts.tsp)} ${units.tsp}`);
  return bits.join(" + ");
}

function cupsText(cups) {
  const rounded = roundTo(cups, 2);
  if (rounded === 0 && cups > 0) return "< 0.01";
  return rounded.toFixed(2);
}

export function convert({ ingredient = "ap", system = "us", direction = "grams", amount }) {
  const sys = SYSTEMS[system];
  const perCupExact = (ingredientById(ingredient).gUs * sys.ml) / US_ML;
  const perCup = roundTo(perCupExact, 2);
  const cupsExact = direction === "grams" ? amount / perCupExact : amount;
  const gramsExact = direction === "grams" ? amount : roundTo(amount * perCup, 2);
  const nearest = nearestCup(cupsExact);
  const parts = scoopParts(cupsExact, system);
  return {
    ingredient,
    system,
    direction,
    gramsExact,
    gramsFixed: roundTo(gramsExact, 2).toFixed(2),
    gramsLabel: formatGrams(gramsExact),
    cupsExact,
    cupsText: cupsText(cupsExact),
    nearest,
    scoopParts: parts,
    scoopEn: formatScoop(parts, { one: "cup", many: "cups", tbsp: "tbsp", tsp: "tsp" }),
    tbspText: roundTo(cupsExact * (sys.ml / sys.tbspMl), 2).toFixed(2),
    tspText: roundTo(cupsExact * (sys.ml / sys.tspMl), 2).toFixed(2),
    mlText: roundTo(cupsExact * sys.ml, 2).toFixed(2),
    ozText: roundTo(gramsExact / OZ_G, 2).toFixed(2),
    sticksText: ingredient === "butter" ? roundTo(gramsExact / STICK_G, 2).toFixed(2) : null,
    cupWeightText: formatWeight(perCup),
    cupMlText: formatWeight(roundTo(sys.ml, 2)),
  };
}

export function scenarioLine(result) {
  return `${result.gramsFixed} g | ${result.cupsText} cups (nearest frac: ${result.nearest.label}, diff ${result.nearest.diff}) | scoop: ${result.scoopEn} | ${result.tbspText} tbsp | ${result.tspText} tsp | ${result.mlText} ml | ${result.ozText} oz`;
}

function escapeReg(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function phraseIndex(text, phrase) {
  if (/[a-z]/i.test(phrase)) {
    const match = new RegExp(`(?:^|[^a-z0-9])${escapeReg(phrase.toLowerCase())}(?:$|[^a-z0-9])`).exec(text.toLowerCase());
    if (!match) return -1;
    return match.index + match[0].indexOf(phrase.toLowerCase());
  }
  return text.indexOf(phrase);
}

function findIngredient(text, extra) {
  const phrases = extra?.length ? [...extra, ...PHRASES].sort((a, b) => b[0].length - a[0].length) : PHRASES;
  for (const [phrase, id] of phrases) {
    const index = phraseIndex(text, phrase);
    if (index !== -1) return { id, phrase, index };
  }
  return null;
}

function detectSystem(text) {
  if (/英制|英製|\buk\b|imperial/i.test(text)) return "uk";
  if (/公制|公製|metric/i.test(text)) return "metric";
  if (/美制|美製|\bus\b/i.test(text)) return "us";
  return null;
}

function hasUnit(text, pattern) {
  return new RegExp(`(?:^|[^a-z])(?:${pattern})(?:$|[^a-z])`, "i").test(text);
}

function detectUnit(text) {
  if (hasUnit(text, "kilograms?|kg") || /千克|公斤/.test(text)) return { name: "kg", kind: "weight", scale: 1000 };
  if (hasUnit(text, "pounds?|lbs?|lb")) return { name: "lb", kind: "weight", scale: OZ_G * 16 };
  if (hasUnit(text, "milliliters?|millilitres?|ml") || /毫升/.test(text)) return { name: "ml", kind: "ml", scale: 1 };
  if (hasUnit(text, "tablespoons?|tbsp|tbs|tbl") || /湯匙|汤匙|大匙/.test(text)) return { name: "tbsp", kind: "volume", scale: 1 };
  if (hasUnit(text, "teaspoons?|tsp") || /茶匙|小匙/.test(text)) return { name: "tsp", kind: "volume", scale: 1 };
  if (hasUnit(text, "sticks?") || /條|条/.test(text)) return { name: "stick", kind: "stick", scale: 1 };
  if (hasUnit(text, "ounces?|oz") || /盎司/.test(text)) return { name: "oz", kind: "weight", scale: OZ_G };
  if (hasUnit(text, "cups?") || /杯/.test(text)) return { name: "cup", kind: "volume", scale: 1 };
  if (hasUnit(text, "grams?|gms|gm") || /克/.test(text)) return { name: "g", kind: "weight", scale: 1 };
  if (hasUnit(text, "g")) return { name: "g", kind: "weight", scale: 1 };
  if (hasUnit(text, "c")) return { name: "cup", kind: "volume", scale: 1 };
  return null;
}

function normalize(raw) {
  let text = toHalfWidth(raw).replace(/\s+/g, " ").trim();
  text = text.replace(/(\d)\s*([½⅓⅔¼¾⅛⅜⅝⅞⅕⅖⅗⅘⅙⅚])/gu, (_, digit, mark) => `${digit} ${UNICODE_FRACTIONS[mark]}`);
  text = text.replace(/[½⅓⅔¼¾⅛⅜⅝⅞⅕⅖⅗⅘⅙⅚]/gu, (mark) => UNICODE_FRACTIONS[mark]);
  text = text.replace(/(\d),(?=\d{3}(?:\D|$))/g, "$1");
  text = text.replace(/(\d),(?=\d{1,2}(?:\D|$))/g, "$1.");
  text = text.replace(/(^|\s)半\s*(?=杯|條|条)/g, "$10.5 ");
  return text;
}

export function formatSwapped(value, direction) {
  if (direction === "cups") {
    const rounded = roundTo(value, 2);
    if (Math.abs(rounded - Math.round(rounded)) < 1e-9) return String(Math.round(rounded));
    return rounded.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
  }
  return formatGrams(value);
}

function readNumber(text) {
  const match = /(\d+)\s+(\d+)\s*\/\s*(\d+)|(\d+)\s*-\s*(\d+)\s*\/\s*(\d+)|(\d+)\s*\/\s*(\d+)|(\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/.exec(text);
  if (!match) return null;
  if (match.index > 0 && text[match.index - 1] === "-") return { error: "range" };
  let value = Number.NaN;
  if (match[1] != null) {
    if (Number(match[3]) === 0) return { error: "format" };
    value = Number(match[1]) + Number(match[2]) / Number(match[3]);
  } else if (match[4] != null) {
    if (Number(match[6]) === 0) return { error: "format" };
    value = Number(match[4]) + Number(match[5]) / Number(match[6]);
  } else if (match[7] != null) {
    if (Number(match[8]) === 0) return { error: "format" };
    value = Number(match[7]) / Number(match[8]);
  } else {
    value = Number(match[9]);
  }
  if (!Number.isFinite(value)) return { error: "format" };
  return { value, index: match.index, length: match[0].length };
}

function leftoverWords(text) {
  let rest = text;
  rest = rest.replace(/kilograms?|\bkg\b|ounces?|\boz\b|grams?|gms|\bgm\b|cups?/gi, " ");
  rest = rest.replace(/\b(?:milliliters?|millilitres?|tablespoons?|teaspoons?|pounds?|sticks?|lbs?|lb|tbsp|tbs|tbl|tsp|ml)\b/gi, " ");
  rest = rest.replace(/千克|公斤|毫升|湯匙|汤匙|大匙|茶匙|小匙|條|条|盎司|克|杯/g, " ");
  rest = rest.replace(/(^|[^a-z])g([^a-z]|$)/gi, " ");
  rest = rest.replace(/(^|[^a-z])c([^a-z]|$)/gi, " ");
  rest = rest.replace(/metric|imperial|公制|公製|英制|英製|美制|美製|\buk\b|\bus\b/gi, " ");
  for (const stop of STOPS) {
    rest = /[a-z]/i.test(stop)
      ? rest.replace(new RegExp(`(?:^|[^a-z])${stop}(?=$|[^a-z])`, "gi"), " ")
      : rest.replaceAll(stop, " ");
  }
  return rest.replace(/[^a-z\u3400-\u9fff]+/gi, " ").trim();
}

function removePhrase(text, phrase) {
  const index = phraseIndex(text, phrase);
  if (index < 0) return text;
  return `${text.slice(0, index)} ${text.slice(index + phrase.length)}`;
}

function classicUnit(unit) {
  return !unit || ["g", "kg", "oz", "lb", "cup"].includes(unit.name);
}

function capFor(name, count, grams) {
  if (name === "cup" && count > CUP_LIMIT) return { limit: CUP_LIMIT, unit: "cup" };
  if (name === "g" && grams > GRAM_LIMIT) return { limit: GRAM_LIMIT, unit: "g" };
  if (name === "kg" && grams > GRAM_LIMIT) return { limit: GRAM_LIMIT / 1000, unit: "kg" };
  if (name === "oz" && grams > GRAM_LIMIT) return { limit: Math.floor(GRAM_LIMIT / OZ_G), unit: "oz" };
  if (name === "lb" && grams > GRAM_LIMIT) return { limit: Math.floor(GRAM_LIMIT / (OZ_G * 16)), unit: "lb" };
  return null;
}

export function parseInput(raw, mode = "grams", options = {}) {
  if (typeof raw !== "string" || raw.trim() === "") return { ok: false, reason: "format" };
  const text = normalize(raw);
  if (/^\s*-/.test(text)) return { ok: false, reason: "range" };
  const number = readNumber(text);
  if (!number) return { ok: false, reason: "format" };
  if (number.error) return { ok: false, reason: number.error };
  if (!(number.value > 0)) return { ok: false, reason: "range" };
  const unit = detectUnit(text);
  const counted = classicUnit(unit);
  const value = counted ? number.value * (unit?.scale ?? 1) : number.value;
  const direction = !unit || unit.kind === "stick" || unit.kind === "weight" ? (unit ? "grams" : mode) : unit.kind === "ml" ? "grams" : "cups";
  if (counted && !(options.deferBareCap && !unit)) {
    const name = unit?.name || (direction === "grams" ? "g" : "cup");
    const capped = capFor(name, number.value, value);
    if (capped) return { ok: false, reason: "limit", limit: capped.limit, unit: capped.unit };
  }
  const found = findIngredient(text, options.extraPhrases);
  const withoutNumber = `${text.slice(0, number.index)} ${text.slice(number.index + number.length)}`;
  const rest = leftoverWords(found ? removePhrase(withoutNumber, found.phrase) : withoutNumber);
  let unknown = null;
  let ingredient = found?.id ?? null;
  let ingredientDetected = Boolean(found);
  if (!found) {
    for (const [phrase, id] of SOLO) {
      if (rest === phrase) {
        ingredient = id;
        ingredientDetected = true;
        break;
      }
    }
    if (!ingredientDetected && rest) unknown = rest;
  }
  const unrecognized = ingredientDetected && rest ? rest : null;
  return {
    ok: true,
    value,
    direction,
    directionDetected: Boolean(unit) && classicUnit(unit),
    unit: unit?.name ?? null,
    count: number.value,
    ingredient,
    ingredientDetected,
    unknown,
    unrecognized,
    assumed: false,
    system: detectSystem(text),
    scaled: counted && (unit?.scale ?? 1) !== 1,
  };
}

export function resolveAmount(parsed, { system = "us", ingredient = "ap", spoonStyle = "follow" } = {}) {
  if (!parsed?.ok) return parsed;
  const unit = parsed.unit;
  const count = parsed.value;
  const ing = parsed.ingredient || ingredient;
  if (unit && UNIT_LIMITS[unit] && count > UNIT_LIMITS[unit]) {
    return { ok: false, reason: "limit", limit: UNIT_LIMITS[unit], unit };
  }
  const item = ingredientById(ing);
  if (!item) return { ok: false, reason: "format" };
  if (unit === "stick") {
    if (ing !== "butter") return { ok: false, reason: "stick" };
    return { ok: true, amount: count * STICK_G, direction: "grams", hero: "grams", unit, ingredient: ing };
  }
  if (unit === "tbsp" || unit === "tsp") {
    const sys = SYSTEMS[spoonStyle === "us" ? "us" : system];
    const per = unit === "tbsp" ? sys.tbspMl : sys.tspMl;
    const cups = (count * per) / sys.ml;
    if (spoonStyle === "us" && system !== "us") {
      return { ok: true, amount: cups * item.gUs, direction: "grams", hero: "grams", unit, ingredient: ing };
    }
    if (cups > CUP_LIMIT) return { ok: false, reason: "limit", limit: CUP_LIMIT, unit: "cup" };
    return { ok: true, amount: cups, direction: "cups", hero: "grams", unit, ingredient: ing };
  }
  if (unit === "ml") {
    const grams = (count * item.gUs) / US_ML;
    if (grams > GRAM_LIMIT) {
      return { ok: false, reason: "limit", limit: Math.floor((GRAM_LIMIT * US_ML) / item.gUs), unit: "ml" };
    }
    return { ok: true, amount: grams, direction: "grams", hero: "grams", unit, ingredient: ing };
  }
  if (parsed.assumed && (unit === "oz" || unit === "lb" || unit === "kg")) {
    const grams = count * (unit === "oz" ? OZ_G : unit === "lb" ? OZ_G * 16 : 1000);
    const capped = capFor(unit, count, grams);
    if (capped) return { ok: false, reason: "limit", limit: capped.limit, unit: capped.unit };
    return { ok: true, amount: grams, direction: "grams", hero: "grams", unit, ingredient: ing };
  }
  if (parsed.assumed && unit === "g") {
    if (count > GRAM_LIMIT) return { ok: false, reason: "limit", limit: GRAM_LIMIT, unit: "g" };
    return { ok: true, amount: count, direction: "grams", hero: "grams", unit, ingredient: ing };
  }
  if (parsed.assumed && unit === "cup") {
    if (count > CUP_LIMIT) return { ok: false, reason: "limit", limit: CUP_LIMIT, unit: "cup" };
    return { ok: true, amount: count, direction: "cups", hero: "grams", unit, ingredient: ing };
  }
  const limit = parsed.direction === "grams" ? GRAM_LIMIT : CUP_LIMIT;
  const limitUnit = unit || (parsed.direction === "grams" ? "g" : "cup");
  if (!(count > 0) || count > limit) return { ok: false, reason: "limit", limit, unit: limitUnit };
  return { ok: true, amount: count, direction: parsed.direction, hero: null, unit, ingredient: ing };
}

export function interpret(raw, options = {}) {
  const mode = options.mode || "grams";
  const parsed0 = parseInput(raw, mode, {
    deferBareCap: Boolean(options.defaultUnit),
    extraPhrases: options.extraPhrases,
  });
  if (!parsed0.ok) return { ok: false, parsed: parsed0 };
  const parsed =
    options.defaultUnit && !parsed0.unit ? { ...parsed0, unit: options.defaultUnit, assumed: true } : parsed0;
  const ingredient = parsed.ingredient || options.ingredient || "ap";
  const system = parsed.system || options.system || "us";
  const resolved = resolveAmount(parsed, {
    system,
    ingredient,
    spoonStyle: options.spoonStyle || "follow",
  });
  if (!resolved.ok) return { ok: false, parsed, resolved };
  const result = convert({
    ingredient,
    system,
    direction: resolved.direction,
    amount: resolved.amount,
  });
  result.hero = options.hero || resolved.hero;
  return { ok: true, parsed, resolved, result };
}

const KITCHEN = [
  [0, ""],
  [1 / 8, "1/8"],
  [1 / 4, "1/4"],
  [1 / 3, "1/3"],
  [3 / 8, "3/8"],
  [1 / 2, "1/2"],
  [5 / 8, "5/8"],
  [2 / 3, "2/3"],
  [3 / 4, "3/4"],
  [7 / 8, "7/8"],
];

const SIXTEENTHS = [1, 3, 5, 7, 9, 11, 13, 15].map((n) => [n / 16, `${n}/16`]);

export function formatKitchen(value, { sixteenths = false, thirdNote = false } = {}) {
  const v = Math.abs(value);
  const steps = sixteenths ? KITCHEN.concat(SIXTEENTHS) : KITCHEN;
  const whole = Math.floor(v + 1e-9);
  let best = null;
  for (let w = Math.max(0, whole - 1); w <= whole + 1; w += 1) {
    for (const [frac, label] of steps) {
      const candidate = w + frac;
      const dist = Math.abs(candidate - v);
      const limit = frac === 0 ? 1e-3 : 5e-4;
      if (dist < limit && (!best || dist < best.dist)) best = { dist, w, frac, label };
    }
  }
  if (best && best.frac === 0) return String(best.w);
  if (best) {
    const text = best.w ? `${best.w} ${best.label}` : best.label;
    const third = Math.abs(best.frac - 1 / 3) < 1e-9 || Math.abs(best.frac - 2 / 3) < 1e-9;
    const sixteenth = sixteenths && SIXTEENTHS.some(([frac]) => Math.abs(best.frac - frac) < 1e-9);
    if ((thirdNote && third) || sixteenth) return `${text} (${roundTo(v, 2).toFixed(2)})`;
    return text;
  }
  const decimal = roundTo(v, 2);
  if (Math.abs(decimal - Math.round(decimal)) < 1e-9 && Math.abs(v - Math.round(decimal)) < 0.002) {
    return String(Math.round(decimal));
  }
  return decimal.toFixed(2);
}

export function wholeGrams(value) {
  return Math.round(value);
}

export function displayGrams(value) {
  if (!(value > 0)) return "0";
  const whole = Math.round(value);
  if (value < 10 && Math.abs(value - whole) >= 0.05) return roundTo(value, 1).toFixed(1);
  if (whole >= 1) return String(whole);
  const tenth = roundTo(value, 1);
  if (tenth >= 0.1) return tenth.toFixed(1);
  const hundredth = roundTo(value, 2);
  if (hundredth >= 0.01) return hundredth.toFixed(2);
  return "< 0.01";
}

function exactInUnit(result, unit) {
  const figures = measureFigures(result);
  if (unit === "g") return figures.grams;
  if (unit === "oz") return figures.oz;
  if (unit === "ml") return figures.ml;
  if (unit === "lb") return figures.grams / (OZ_G * 16);
  if (unit === "kg") return figures.grams / 1000;
  if (unit === "cup") return figures.cups;
  if (unit === "stick") return figures.sticks;
  if (unit === "tbsp") return figures.tbsp;
  return figures.tsp;
}

export function quantityInUnit(result, unit) {
  const target = displayGrams(result.gramsExact);
  const exact = exactInUnit(result, unit);
  const nice = formatKitchen(exact);
  const candidates = [];
  if (nice && !nice.includes("(")) candidates.push(nice);
  for (let digits = 2; digits <= 6; digits += 1) candidates.push(trimNumber(roundTo(exact, digits)));
  const seen = new Set();
  for (const text of candidates) {
    if (!text || seen.has(text)) continue;
    seen.add(text);
    const again = interpret(text, {
      ingredient: result.ingredient,
      system: result.system,
      spoonStyle: "us",
      hero: "grams",
      defaultUnit: unit,
    });
    if (again.ok && displayGrams(again.result.gramsExact) === target) return text;
  }
  return trimNumber(roundTo(exact, 6));
}

export function applyUnitTap(raw, nextUnit, options = {}) {
  const current = interpret(raw, options);
  if (current.ok && current.parsed.unit && !current.parsed.assumed && current.parsed.unit !== nextUnit) {
    return { amount: quantityInUnit(current.result, nextUnit), unit: nextUnit };
  }
  return { amount: String(raw ?? ""), unit: nextUnit };
}

export function measureFigures(result) {
  const item = ingredientById(result.ingredient);
  const grams = result.gramsExact;
  const perCupExact = (item.gUs * SYSTEMS[result.system].ml) / US_ML;
  const fromCups = result.direction === "cups";
  const cups = fromCups ? result.cupsExact : grams / perCupExact;
  const usCups = fromCups && result.system === "us" ? result.cupsExact : grams / item.gUs;
  const sticks = result.ingredient === "butter" && fromCups && result.system === "us" ? result.cupsExact * 2 : grams / STICK_G;
  return {
    grams,
    oz: grams / OZ_G,
    sticks,
    tbsp: usCups * 16,
    tsp: usCups * 48,
    cups,
    ml: cups * SYSTEMS[result.system].ml,
  };
}

export function butterStickTable() {
  return [1 / 4, 1 / 2, 1, 3 / 2, 2].map((sticks) => {
    const grams = sticks * STICK_G;
    const gUs = ingredientById("butter").gUs;
    return {
      sticks,
      grams: wholeGrams(grams),
      oz: wholeGrams(grams / OZ_G),
      tbsp: wholeGrams((grams * 16) / gUs),
      cups: formatKitchen(grams / gUs),
      sticksLabel: formatKitchen(sticks),
    };
  });
}

export function amountCleanup(raw, mode = "grams") {
  const parsed = parseInput(raw, mode);
  if (!parsed.ok) return { ok: false, parsed, messy: false, text: String(raw ?? "") };
  const detected = Boolean(
    parsed.directionDetected ||
      parsed.ingredientDetected ||
      parsed.unknown ||
      parsed.unrecognized ||
      parsed.system ||
      parsed.scaled,
  );
  const messy = detected || String(raw).includes(",") || /[½⅓⅔¼¾⅛⅜⅝⅞]/u.test(String(raw));
  const preserve = parsed.unit === "tbsp" || parsed.unit === "tsp" || parsed.unit === "ml" || parsed.unit === "stick";
  return { ok: true, parsed, messy, text: messy && !preserve ? trimNumber(parsed.value) : String(raw) };
}
