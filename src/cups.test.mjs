import assert from "node:assert/strict";
import test from "node:test";
import { amountCleanup, chartCell, convert, cupWeight, formatSwapped, formatWeight, interpret, parseInput, scenarioLine } from "./cups.mjs";
import { cupsCopy, detectionNote, errorText, present } from "./cups-copy.mjs";
import { pages } from "./catalog.mjs";
import { renderPage, renderSitemap } from "./render.mjs";

const CUP_WEIGHTS = {
  ap: ["120.00", "126.80", "144.11"],
  bread: ["120.00", "126.80", "144.11"],
  whole: ["113.00", "119.41", "135.71"],
  sugar: ["200.00", "211.34", "240.19"],
  brown: ["220.00", "232.47", "264.21"],
  powdered: ["120.00", "126.80", "144.11"],
  butter: ["226.80", "239.65", "272.37"],
  cocoa: ["86.00", "90.88", "103.28"],
  oats: ["89.00", "94.05", "106.88"],
  rice: ["185.00", "195.49", "222.18"],
  honey: ["339.00", "358.22", "407.12"],
  milk: ["244.00", "257.83", "293.03"],
  water: ["236.59", "250.00", "284.13"],
  oil: ["218.00", "230.36", "261.81"],
  olive: ["216.00", "228.24", "259.41"],
  corn: ["128.00", "135.26", "153.72"],
};

const SCENARIOS = [
  ["A1", { ingredient: "ap", system: "us", direction: "grams", amount: 250 }, "250.00 g | 2.08 cups (nearest frac: 2 1/8, diff +2.0%) | scoop: 2 cups + 1 tbsp + 1 tsp | 33.33 tbsp | 100.00 tsp | 492.89 ml | 8.82 oz"],
  ["A2", { ingredient: "ap", system: "metric", direction: "grams", amount: 250 }, "250.00 g | 1.97 cups (nearest frac: 2, diff +1.4%) | scoop: 1 cup + 3/4 cup + 3 tbsp + 2 tsp | 32.86 tbsp | 98.58 tsp | 492.89 ml | 8.82 oz"],
  ["B1", { ingredient: "ap", system: "us", direction: "cups", amount: 1.5 }, "180.00 g | 1.50 cups (nearest frac: 1 1/2, diff +0.0%) | scoop: 1 cup + 1/2 cup | 24.00 tbsp | 72.00 tsp | 354.88 ml | 6.35 oz"],
  ["B2", { ingredient: "ap", system: "metric", direction: "cups", amount: 1.5 }, "190.20 g | 1.50 cups (nearest frac: 1 1/2, diff +0.0%) | scoop: 1 cup + 1/2 cup | 25.00 tbsp | 75.00 tsp | 375.00 ml | 6.71 oz"],
  ["C1", { ingredient: "sugar", system: "us", direction: "grams", amount: 200 }, "200.00 g | 1.00 cups (nearest frac: 1, diff +0.0%) | scoop: 1 cup | 16.00 tbsp | 48.00 tsp | 236.59 ml | 7.05 oz"],
  ["C2", { ingredient: "sugar", system: "metric", direction: "grams", amount: 200 }, "200.00 g | 0.95 cups (nearest frac: 1, diff +5.7%) | scoop: 3/4 cup + 3 tbsp + 1 tsp | 15.77 tbsp | 47.32 tsp | 236.59 ml | 7.05 oz"],
  ["D1", { ingredient: "butter", system: "us", direction: "grams", amount: 100 }, "100.00 g | 0.44 cups (nearest frac: 1/2, diff +13.4%) | scoop: 1/3 cup + 1 tbsp + 2 tsp | 7.05 tbsp | 21.16 tsp | 104.32 ml | 3.53 oz"],
  ["E1", { ingredient: "water", system: "us", direction: "grams", amount: 350 }, "350.00 g | 1.48 cups (nearest frac: 1 1/2, diff +1.4%) | scoop: 1 cup + 1/3 cup + 2 tbsp + 1 tsp | 23.67 tbsp | 71.01 tsp | 350.00 ml | 12.35 oz"],
  ["E2", { ingredient: "water", system: "metric", direction: "grams", amount: 350 }, "350.00 g | 1.40 cups (nearest frac: 1 3/8, diff -1.8%) | scoop: 1 cup + 1/3 cup + 1 tbsp + 0.5 tsp | 23.33 tbsp | 70.00 tsp | 350.00 ml | 12.35 oz"],
  ["E3", { ingredient: "honey", system: "us", direction: "grams", amount: 85 }, "85.00 g | 0.25 cups (nearest frac: 1/4, diff -0.3%) | scoop: 1/4 cup | 4.01 tbsp | 12.04 tsp | 59.32 ml | 3.00 oz"],
  ["F1", { ingredient: "brown", system: "us", direction: "cups", amount: 0.75 }, "165.00 g | 0.75 cups (nearest frac: 3/4, diff +0.0%) | scoop: 3/4 cup | 12.00 tbsp | 36.00 tsp | 177.44 ml | 5.82 oz"],
  ["F2", { ingredient: "oats", system: "us", direction: "grams", amount: 100 }, "100.00 g | 1.12 cups (nearest frac: 1 1/8, diff +0.1%) | scoop: 1 cup + 2 tbsp | 17.98 tbsp | 53.93 tsp | 265.83 ml | 3.53 oz"],
  ["G1", { ingredient: "cocoa", system: "us", direction: "grams", amount: 5 }, "5.00 g | 0.06 cups (nearest frac: < 1/8, diff +0.0%) | scoop: 1 tbsp | 0.93 tbsp | 2.79 tsp | 13.76 ml | 0.18 oz"],
];

test("1-cup weights match the 16 published figures", () => {
  for (const [id, expected] of Object.entries(CUP_WEIGHTS)) {
    const actual = ["us", "metric", "uk"].map((system) => cupWeight(id, system).toFixed(2));
    assert.deepEqual(actual, expected, id);
    assert.equal(formatWeight(cupWeight("water", "us")), "236.59");
    assert.equal(formatWeight(cupWeight("water", "metric")), "250");
    assert.equal(formatWeight(cupWeight("water", "uk")), "284.13");
  }
});

test("13 scenarios match the expected script line exactly", () => {
  for (const [id, input, expected] of SCENARIOS) {
    const result = convert(input);
    assert.equal(scenarioLine(result), expected, id);
    assert.equal(Number.isFinite(result.gramsExact), true, id);
    assert.equal(result.cupsText.includes("NaN"), false, id);
  }
  assert.equal(convert(SCENARIOS[6][1]).sticksText, "0.88");
  assert.equal(convert(SCENARIOS[0][1]).sticksText, null);
});

test("messy recipe text parses, and bad input does not", () => {
  const flour = parseInput("250g flour");
  assert.equal(flour.ok, true);
  assert.equal(flour.value, 250);
  assert.equal(flour.direction, "grams");
  assert.equal(flour.ingredient, "ap");
  const cups = parseInput("1 1/2 cups");
  assert.equal(cups.value, 1.5);
  assert.equal(cups.direction, "cups");
  assert.equal(cups.ingredient, null);
  const sugar = parseInput("200 grams of sugar");
  assert.equal(sugar.value, 200);
  assert.equal(sugar.ingredient, "sugar");
  assert.equal(sugar.direction, "grams");
  const brown = parseInput("3/4 cup brown sugar");
  assert.equal(brown.value, 0.75);
  assert.equal(brown.direction, "cups");
  assert.equal(brown.ingredient, "brown");
  assert.equal(parseInput("1-1/2").value, 1.5);
  assert.equal(parseInput("1½").value, 1.5);
  assert.equal(parseInput("¾").value, 0.75);
  assert.equal(parseInput("½").value, 0.5);
  assert.equal(parseInput("1,200 g").value, 1200);
  assert.equal(parseInput("0.5kg").value, 500);
  assert.equal(parseInput("2.5oz").direction, "grams");
  assert.ok(Math.abs(parseInput("2.5oz").value - 70.87375) < 1e-6);
  const metric = parseInput("1 metric cup flour");
  assert.equal(metric.direction, "cups");
  assert.equal(metric.system, "metric");
  assert.equal(metric.ingredient, "ap");
  const almond = parseInput("250g almond meal");
  assert.equal(almond.ok, true);
  assert.equal(almond.value, 250);
  assert.equal(almond.ingredient, null);
  assert.equal(almond.unknown, "almond meal");
  assert.equal(parseInput("250g kryptonite").unknown, "kryptonite");
  assert.equal(parseInput("250克細砂糖").ingredient, "sugar");
  assert.equal(parseInput("100克黄油").ingredient, "butter");
  assert.equal(parseInput("100克奶油").ingredient, "butter");
  assert.equal(parseInput("30克玉米淀粉").ingredient, "corn");
  assert.equal(parseInput("30克玉米澱粉").ingredient, "corn");
  assert.equal(parseInput("350克水").ingredient, "water");
  for (const raw of ["0", "-50", "abc", "", "   ", "1/0"]) {
    assert.equal(parseInput(raw, "grams").ok, false, raw);
  }
  assert.equal(parseInput("150000", "grams").ok, false);
  assert.equal(parseInput("100000", "grams").ok, true);
  assert.equal(parseInput("1000", "cups").ok, true);
  assert.equal(parseInput("1001", "cups").ok, false);
});

test("result text states the cup, the scoop, and anything detected", () => {
  const flour = convert({ ingredient: "ap", system: "us", direction: "grams", amount: 250 });
  const view = present(flour, "en");
  assert.equal(
    view.copyText,
    "250 g All-purpose flour = 2.08 US cups (approx. 2 1/8 cups, or 2 cups + 1 tbsp + 1 tsp) · 33.33 tbsp · 492.89 ml · 8.82 oz",
  );
  assert.match(view.convention, /120 g per US cup \(236\.59 ml\)/);
  assert.equal(present(convert({ ingredient: "ap", system: "metric", direction: "cups", amount: 1.5 }), "en").main, "190.2 g");
  const cocoa = present(convert({ ingredient: "cocoa", system: "us", direction: "grams", amount: 5 }), "en");
  assert.match(cocoa.frac, /Less than 1\/8 cup/);
  assert.equal(cocoa.frac.includes("0 cups"), false);
  assert.equal(present(convert({ ingredient: "butter", system: "us", direction: "grams", amount: 100 }), "en").sticks, "0.88 stick");
  const pasted = parseInput("250g flour");
  assert.match(detectionNote(pasted, "en"), /All-purpose flour/);
  assert.match(detectionNote(pasted, "en"), /Grams → Cups/);
  assert.match(detectionNote(parseInput("1 1/2 cups"), "en"), /Cups → Grams/);
  assert.match(detectionNote(parseInput("1 metric cup sugar"), "en"), /Metric cup/);
  assert.match(detectionNote(parseInput("250g almond meal"), "en"), /almond meal/);
  assert.match(detectionNote(parseInput("250g almond meal"), "en"), /Flour/);
});

test("comma decimals stay intact and thousands separators still group", () => {
  assert.equal(parseInput("1,5").value, 1.5);
  assert.equal(parseInput("0,75").value, 0.75);
  assert.equal(parseInput("2,25").value, 2.25);
  assert.equal(amountCleanup("1,5").text, "1.5");
  assert.equal(parseInput("1,000").value, 1000);
  assert.equal(parseInput("1,250").value, 1250);
  assert.equal(parseInput("1,250.5").value, 1250.5);
});

test("full-width digits and punctuation parse as half-width", () => {
  assert.equal(parseInput("２５０").value, 250);
  assert.equal(parseInput("１．５").value, 1.5);
  assert.equal(parseInput("１，５").value, 1.5);
  assert.equal(parseInput("１／３").value, 1 / 3);
});

test("a typed fraction stays in the box and swapped values round", () => {
  const fraction = amountCleanup("1/3", "cups");
  assert.equal(fraction.messy, false);
  assert.equal(fraction.text, "1/3");
  assert.equal(formatSwapped(250 / 120, "cups"), "2.08");
  assert.equal(formatSwapped(120 / 3, "grams"), "40");
  assert.equal(formatSwapped(40 / 120, "cups"), "0.33");
  const cups = formatSwapped(250 / 120, "cups");
  const grams = formatSwapped(Number(cups) * 120, "grams");
  assert.equal(formatSwapped(Number(grams) / 120, "cups"), cups);
});

test("typed messy text commits to the same amount as a paste", () => {
  const typed = amountCleanup("250g flour", "cups");
  const pasted = amountCleanup("250g flour", "grams");
  assert.equal(typed.messy, true);
  assert.equal(typed.text, "250");
  assert.equal(typed.text, pasted.text);
  assert.equal(typed.parsed.ingredient, "ap");
  assert.equal(typed.parsed.direction, "grams");
  assert.equal(amountCleanup("250", "cups").messy, false);
});

test("the three language pages use the spec titles and the existing page shell", () => {
  const page = pages.find((item) => item.id === "cups");
  assert.equal(page.title.en, "Grams to Cups and Cups to Grams Converter");
  assert.equal(page.title["zh-cn"], "克转杯换算器");
  assert.equal(page.title["zh-tw"], "克轉杯換算器");
  assert.equal(page.h1.en, "Grams to Cups Converter");
  const html = {
    en: renderPage(page, "en"),
    "zh-cn": renderPage(page, "zh-cn"),
    "zh-tw": renderPage(page, "zh-tw"),
  };
  assert.match(html.en, /<title>Grams to Cups and Cups to Grams Converter<\/title>/);
  assert.match(html.en, /property="og:title" content="Grams to Cups and Cups to Grams Converter"/);
  assert.match(html.en, /<h1>Grams to Cups Converter<\/h1>/);
  assert.doesNotMatch(html.en, /<title>[^<]*doughcalc/i);
  assert.match(html.en, /rel="canonical" href="https:\/\/doughcalc\.app\/en\/grams-to-cups-converter\/"/);
  assert.match(html.en, /property="og:url" content="https:\/\/doughcalc\.app\/en\/grams-to-cups-converter\/"/);
  assert.match(html.en, /property="og:image" content="https:\/\/doughcalc\.app\/og\.png"/);
  assert.match(html.en, /property="og:image:width" content="1200"/);
  assert.match(html.en, /property="og:image:height" content="630"/);
  assert.match(html.en, /name="twitter:card" content="summary_large_image"/);
  assert.match(html.en, /hreflang="zh-CN" href="[^"]+\/zh-cn\/ke-zhuan-bei-huansuanqi\/"/);
  assert.match(html.en, /hreflang="zh-TW" href="[^"]+\/zh-tw\/ke-zhuan-bei-huansuan\/"/);
  assert.match(html.en, /hreflang="x-default" href="[^"]+\/en\/grams-to-cups-converter\/"/);
  assert.match(html.en, /rel="icon" href="\/favicon\.svg"/);
  assert.doesNotMatch(html.en, /name="robots"/);
  assert.match(html.en, /src="\/assets\/cups\.js"/);
  assert.doesNotMatch(html.en, /src="\/assets\/calc\.js"/);
  assert.match(html.en, /Grams to cups/);
  assert.match(html.en, /href="mailto:alan\.chang198807@gmail\.com"/);
  assert.match(html.en, /Numbers stay in this browser/);
  assert.match(html.en, /id="out-main">2\.08 cups/);
  assert.match(html.en, /2 cups \+ 1 tbsp \+ 1 tsp/);
  assert.match(html.en, /236\.59/);
  assert.match(html.en, />Before</);
  assert.match(html.en, />After</);
  assert.match(html.en, /King Arthur Baking/);
  assert.match(html.en, /usda|USDA|fdc\.nal\.usda\.gov/);
  assert.doesNotMatch(html.en, /calorie|nutrition|卡路里|热量|熱量|营养|營養|健康/i);
  assert.match(html["zh-cn"], /<h1>克转杯换算器<\/h1>/);
  assert.match(html["zh-cn"], /黄油/);
  assert.match(html["zh-cn"], /细砂糖/);
  assert.match(html["zh-cn"], /玉米淀粉/);
  assert.match(html["zh-cn"], />换算前</);
  assert.match(html["zh-cn"], />换算后</);
  assert.doesNotMatch(html["zh-cn"], /奶油|細砂糖|玉米澱粉/);
  assert.match(html["zh-tw"], /<h1>克轉杯換算器<\/h1>/);
  assert.match(html["zh-tw"], /奶油/);
  assert.match(html["zh-tw"], /細砂糖/);
  assert.match(html["zh-tw"], /玉米澱粉/);
  assert.match(html["zh-tw"], />換算前</);
  assert.match(html["zh-tw"], />換算後</);
  assert.match(html["zh-tw"], /同樣滿 1 杯，水、麵粉和糖的重量都不一樣，所以一定要先選食材才能算。/);
  assert.match(html["zh-tw"], /美國食譜的 1 杯是 236\.59 毫升，台灣、澳洲與加拿大常見的公制量杯則是 250 毫升，相差約 5\.7%。/);
  const cupFaq = html["zh-tw"].slice(html["zh-tw"].indexOf("美制杯和公制杯差在哪"), html["zh-tw"].indexOf("烘焙百分比是什麼"));
  assert.ok(cupFaq.indexOf("236.59") < cupFaq.indexOf("英制"), cupFaq);
  assert.match(cupFaq, /美制杯是美國食譜的 1 杯，236\.59 毫升/);
  assert.match(cupFaq, /公制杯是台灣、澳洲與加拿大常見的 250 毫升/);
  assert.match(errorText("limit", "en", 1000), /1\.5/);
  assert.equal(errorText("limit", "en", 1000).includes("250"), false);
  assert.match(errorText("limit", "en", 100000), /250/);
  assert.match(errorText("limit", "zh-tw", 1000), /1\.5/);
  assert.match(errorText("limit", "zh-cn", 1000), /1\.5/);
  assert.match(html["zh-tw"], /麵包師傅把麵粉當 100%，水、鹽和酵母都用占麵粉重量的百分比來寫，算好克數後就可以拿來這裡換成量杯。/);
  assert.doesNotMatch(html["zh-tw"], /黄油|细砂糖|玉米淀粉/);
  for (const lang of ["en", "zh-cn", "zh-tw"]) {
    const labels = [
      cupsCopy[lang].ingredientLegend,
      ...cupsCopy[lang].quick.map((item) => item[1]),
      cupsCopy[lang].gramsToCups,
      cupsCopy[lang].cupsToGrams,
      cupsCopy[lang].systems.us,
      cupsCopy[lang].systems.metric,
      cupsCopy[lang].systems.uk,
      cupsCopy[lang].amount,
      cupsCopy[lang].result,
      cupsCopy[lang].copy,
      cupsCopy[lang].print,
    ];
    const steps = html[lang].slice(html[lang].indexOf('class="howto"'), html[lang].indexOf('class="example"'));
    for (const label of labels) assert.ok(steps.includes(label), `${lang} ${label}`);
    assert.ok(html[lang].indexOf('class="howto"') < html[lang].indexOf('class="example"'), lang);
    assert.ok(html[lang].indexOf('class="example"') < html[lang].indexOf('class="faq"'), lang);
    assert.ok(html[lang].indexOf('class="faq"') < html[lang].indexOf('class="related"'), lang);
  }
  const home = renderPage(pages.find((item) => item.id === "home"), "en");
  assert.match(home, /href="\/en\/grams-to-cups-converter\/"/);
  assert.match(home, />Grams to Cups Converter</);
  const sitemap = renderSitemap();
  assert.match(sitemap, /<loc>https:\/\/doughcalc\.app\/en\/grams-to-cups-converter\/<\/loc>/);
  assert.match(sitemap, /hreflang="zh-CN" href="https:\/\/doughcalc\.app\/zh-cn\/ke-zhuan-bei-huansuanqi\/"/);
  assert.match(sitemap, /hreflang="zh-TW" href="https:\/\/doughcalc\.app\/zh-tw\/ke-zhuan-bei-huansuan\/"/);
  assert.match(sitemap, /hreflang="x-default" href="https:\/\/doughcalc\.app\/en\/grams-to-cups-converter\/"/);
  assert.match(html.en, /butter-conversion/);
  assert.match(
    present(convert({ ingredient: "butter", system: "us", direction: "grams", amount: 100 }), "en").convention,
    /A US stick of butter is 4 oz \(113 g\), 8 tbsp, or half a US cup\./,
  );
  assert.deepEqual(
    ["1/4", "1/3", "1/2", "1"].map((token) => chartCell("butter", "us", token === "1" ? 1 : Number(token.split("/")[0]) / Number(token.split("/")[1]))),
    ["56.70", "75.60", "113.40", "226.80"],
  );
});

test("spoons, sticks, and milliliters convert, and unknown words are named", () => {
  const hero = (raw, options) => {
    const out = interpret(raw, options);
    assert.equal(out.ok, true, raw);
    return present(out.result, "en").main;
  };
  assert.equal(hero("2 tbsp butter"), "28.4 g");
  assert.equal(hero("1 stick butter"), "113.4 g");
  assert.equal(hero("3 tablespoons flour"), "22.5 g");
  assert.equal(hero("1 tsp sugar"), "4.2 g");
  assert.equal(hero("2 tbsp", { ingredient: "ap" }), "15 g");
  assert.equal(hero("100 ml butter"), "95.9 g");
  assert.equal(hero("1/2 cup butter"), "113.4 g");
  assert.equal(hero("1 cup butter"), "226.8 g");
  assert.equal(hero("2 tbsp butter", { system: "metric" }), "28.8 g");
  assert.equal(hero("2 tbsp butter", { system: "uk" }), "34.1 g");
  assert.equal(hero("1 cup sugar"), "200 g");
  assert.equal(hero("1 cup flour"), "120 g");
  assert.equal(hero("250 g", { ingredient: "ap" }), "2.08 cups");
  assert.equal(hero("2 湯匙 奶油"), "28.4 g");
  assert.equal(hero("1 條奶油"), "113.4 g");
  assert.equal(hero("1 大匙 細砂糖"), "12.5 g");
  assert.equal(hero("2 汤匙 黄油"), "28.4 g");
  assert.equal(hero("2 tbsp. butter"), "28.4 g");
  assert.equal(hero("1 stick butter", { system: "metric" }), "113.4 g");
  assert.equal(hero("1 stick butter", { system: "uk" }), "113.4 g");
  const flourStick = interpret("1 stick flour");
  assert.equal(flourStick.ok, false);
  assert.equal(flourStick.resolved.reason, "stick");
  assert.equal(cupsCopy.en.stickError, "A stick is a butter measure. Pick butter, or enter cups, grams, or tablespoons.");
  assert.equal(cupsCopy["zh-cn"].stickError, "“条”是黄油专用的单位。请选黄油，或改用杯、克、汤匙。");
  assert.equal(cupsCopy["zh-tw"].stickError, "「條」是奶油專用的單位。請選奶油，或改用杯、克、湯匙。");
  const pinches = detectionNote(parseInput("2 pinches butter"), "en");
  assert.match(pinches, /Detected Butter/);
  assert.match(pinches, /I read this as 2 g — I didn't recognize "pinches"\./);
  const bare = detectionNote(parseInput("2 pinches"), "en");
  assert.match(bare, /No listed density for pinches/);
  assert.equal(bare.includes("I read this as"), false);
  assert.match(detectionNote(parseInput("250g almond meal"), "en"), /almond meal/);
  assert.equal(amountCleanup("2 tbsp butter").text, "2 tbsp butter");
  const same = {
    "250": { value: 250, direction: "grams", ingredient: null, unit: null },
    "1 1/2 cups": { value: 1.5, direction: "cups", ingredient: null, unit: "cup" },
    "250 g flour": { value: 250, direction: "grams", ingredient: "ap", unit: "g" },
    "1/2 cup brown sugar": { value: 0.5, direction: "cups", ingredient: "brown", unit: "cup" },
    "200 克": { value: 200, direction: "grams", ingredient: null, unit: "g" },
    "1 杯 細砂糖": { value: 1, direction: "cups", ingredient: "sugar", unit: "cup" },
  };
  for (const [raw, expected] of Object.entries(same)) {
    const parsed = parseInput(raw);
    assert.equal(parsed.ok, true, raw);
    assert.equal(parsed.value, expected.value, raw);
    assert.equal(parsed.direction, expected.direction, raw);
    assert.equal(parsed.ingredient, expected.ingredient, raw);
    assert.equal(parsed.unit, expected.unit, raw);
  }
  assert.equal(hero("250", { ingredient: "ap" }), "2.08 cups");
  assert.equal(hero("1 1/2 cups", { ingredient: "ap" }), "180 g");
  assert.equal(hero("1/2 cup brown sugar"), "110 g");
  assert.equal(hero("200 克", { ingredient: "ap" }), "1.67 cups");
  assert.equal(hero("1 杯 細砂糖"), "200 g");
});
