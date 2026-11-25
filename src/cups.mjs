export const US_ML = 236.5882365;
export const METRIC_ML = 250;
export const UK_ML = 284.130625;
export const OZ_G = 28.3495;
export const STICK_G = 113.5;
export const GRAM_LIMIT = 100000;
export const CUP_LIMIT = 1000;

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
  { id: "butter", gUs: 227, group: "fat", quick: "butter", fdc: "173410" },
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

function findIngredient(text) {
  for (const [phrase, id] of PHRASES) {
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
  if (hasUnit(text, "kilograms?|kg") || /千克|公斤/.test(text)) return { kind: "weight", scale: 1000 };
  if (hasUnit(text, "ounces?|oz") || /盎司/.test(text)) return { kind: "weight", scale: 28.3495 };
  if (hasUnit(text, "cups?") || /杯/.test(text)) return { kind: "volume", scale: 1 };
  if (hasUnit(text, "grams?|gms|gm") || /克/.test(text)) return { kind: "weight", scale: 1 };
  if (hasUnit(text, "g")) return { kind: "weight", scale: 1 };
  if (hasUnit(text, "c")) return { kind: "volume", scale: 1 };
  return null;
}

function normalize(raw) {
  let text = raw.replace(/\s+/g, " ").trim();
  text = text.replace(/(\d)\s*([½⅓⅔¼¾⅛⅜⅝⅞⅕⅖⅗⅘⅙⅚])/gu, (_, digit, mark) => `${digit} ${UNICODE_FRACTIONS[mark]}`);
  text = text.replace(/[½⅓⅔¼¾⅛⅜⅝⅞⅕⅖⅗⅘⅙⅚]/gu, (mark) => UNICODE_FRACTIONS[mark]);
  text = text.replace(/(\d),(?=\d{3}(?:\D|$))/g, "$1");
  return text;
}

function readNumber(text) {
  const match = /(\d+)\s+(\d+)\s*\/\s*(\d+)|(\d+)\s*-\s*(\d+)\s*\/\s*(\d+)|(\d+)\s*\/\s*(\d+)|(\d+(?:\.\d+)?)/.exec(text);
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
  rest = rest.replace(/kilograms?|\bkg\b|ounces?|\boz\b|grams?|gms|\bgm\b|cups?|千克|公斤|盎司|克|杯/gi, " ");
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

export function parseInput(raw, mode = "grams") {
  if (typeof raw !== "string" || raw.trim() === "") return { ok: false, reason: "format" };
  const text = normalize(raw);
  if (/^\s*-/.test(text)) return { ok: false, reason: "range" };
  const number = readNumber(text);
  if (!number) return { ok: false, reason: "format" };
  if (number.error) return { ok: false, reason: number.error };
  if (!(number.value > 0)) return { ok: false, reason: "range" };
  const unit = detectUnit(text);
  const value = number.value * (unit?.scale ?? 1);
  const direction = unit?.kind === "weight" ? "grams" : unit?.kind === "volume" ? "cups" : mode;
  const limit = direction === "grams" ? GRAM_LIMIT : CUP_LIMIT;
  if (!(value > 0) || value > limit) return { ok: false, reason: "limit", limit };
  const found = findIngredient(text);
  let unknown = null;
  if (!found) {
    const withoutNumber = `${text.slice(0, number.index)} ${text.slice(number.index + number.length)}`;
    let rest = leftoverWords(withoutNumber);
    for (const [phrase, id] of SOLO) {
      if (rest === phrase) {
        return {
          ok: true,
          value,
          direction,
          directionDetected: Boolean(unit),
          ingredient: id,
          ingredientDetected: true,
          unknown: null,
          system: detectSystem(text),
          scaled: (unit?.scale ?? 1) !== 1,
        };
      }
    }
    if (rest) unknown = rest;
  }
  return {
    ok: true,
    value,
    direction,
    directionDetected: Boolean(unit),
    ingredient: found?.id ?? null,
    ingredientDetected: Boolean(found),
    unknown,
    system: detectSystem(text),
    scaled: (unit?.scale ?? 1) !== 1,
  };
}
