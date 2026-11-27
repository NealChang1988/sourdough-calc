import assert from "node:assert/strict";
import test from "node:test";
import { butterExampleRows, butterView, quickFacts, quickLines } from "./butter-copy.mjs";
import { detectionNote, errorText } from "./cups-copy.mjs";
import { applyUnitTap, displayGrams, formatKitchen, interpret, measureFigures, wholeGrams } from "./cups.mjs";
import { pages } from "./catalog.mjs";
import { renderPage, renderSitemap } from "./render.mjs";

const ROWS = [
  ["1 stick", "113", "1", "8", "24", "1/2", "118.29", "4.00"],
  ["2 sticks", "227", "2", "16", "48", "1", "236.59", "8.00"],
  ["1/2 stick", "57", "1/2", "4", "12", "1/4", "59.15", "2.00"],
  ["1 1/2 sticks", "170", "1 1/2", "12", "36", "3/4", "177.44", "6.00"],
  ["1 tbsp", "14", "1/8", "1", "3", "1/16 (0.06)", "14.79", "0.50"],
  ["2 tbsp", "28", "1/4", "2", "6", "1/8", "29.57", "1.00"],
  ["4 tbsp", "57", "1/2", "4", "12", "1/4", "59.15", "2.00"],
  ["1/2 cup", "113", "1", "8", "24", "1/2", "118.29", "4.00"],
  ["1/3 cup", "76", "2/3 (0.67)", "5 1/3 (5.33)", "16", "1/3", "78.86", "2.67"],
  ["1 cup", "227", "2", "16", "48", "1", "236.59", "8.00"],
  ["100 g", "100", "0.88", "7.05", "21.16", "0.44", "104.32", "3.53"],
  ["250 g", "250", "2.20", "17.64", "52.91", "1.10", "260.79", "8.82"],
  ["113 g", "113", "1.00", "7.97", "23.92", "0.50", "117.88", "3.99"],
];

function shown(raw, options = {}) {
  const out = interpret(raw, { ingredient: "butter", spoonStyle: "us", hero: "grams", ...options });
  assert.equal(out.ok, true, raw);
  const figures = measureFigures(out.result);
  const view = butterView(out.result, options.lang || "en");
  return {
    grams: String(wholeGrams(figures.grams)),
    sticks: formatKitchen(figures.sticks, { thirdNote: true }),
    tbsp: formatKitchen(figures.tbsp, { thirdNote: true }),
    tsp: formatKitchen(figures.tsp, { thirdNote: true }),
    cups: formatKitchen(figures.cups, { sixteenths: true }),
    ml: figures.ml.toFixed(2),
    oz: figures.oz.toFixed(2),
    summary: view.summary,
    hero: view.grams,
  };
}

test("butter page answers match the 13 US rows", () => {
  for (const [raw, grams, sticks, tbsp, tsp, cups, ml, oz] of ROWS) {
    const actual = shown(raw);
    assert.equal(actual.grams, grams, raw);
    assert.equal(actual.sticks, sticks, `${raw} sticks`);
    assert.equal(actual.tbsp, tbsp, `${raw} tbsp`);
    assert.equal(actual.tsp, tsp, `${raw} tsp`);
    assert.equal(actual.cups, cups, `${raw} cups`);
    assert.equal(actual.ml, ml, `${raw} ml`);
    assert.equal(actual.oz, oz, `${raw} oz`);
  }
  assert.equal(shown("100 g").summary, "100 g butter ≈ 7 tbsp ≈ 0.88 stick");
  assert.equal(shown("1 stick").hero, "113 g");
  assert.equal(shown("2 tbsp butter").grams, "28");
  assert.equal(shown("1 stick butter").grams, "113");
  assert.equal(shown("100 ml").grams, "96");
  assert.equal(shown("1,5 sticks").grams, "170");
  assert.equal(shown("1½ sticks").grams, "170");
  assert.equal(shown("１ stick").grams, "113");
  assert.equal(shown("2 湯匙", { lang: "zh-tw" }).hero, "28 克");
  assert.equal(shown("1 条", { lang: "zh-cn" }).hero, "113 克");
  const flour = interpret("1 stick flour", { ingredient: "butter", spoonStyle: "us" });
  assert.equal(flour.ok, false);
  assert.equal(flour.resolved.reason, "stick");
  const zero = interpret("0", { ingredient: "butter", defaultUnit: "stick" });
  assert.equal(zero.ok, false);
  assert.match(errorText(zero.parsed.reason, "en", 2000), /for example/);
  const tooMany = interpret("3000 sticks", { ingredient: "butter", spoonStyle: "us" });
  assert.equal(tooMany.ok, false);
  assert.equal(tooMany.resolved.reason, "limit");
  assert.match(errorText("limit", "en", tooMany.resolved.limit, tooMany.resolved.unit), /2,000 sticks/);
  assert.match(errorText("limit", "en", tooMany.resolved.limit), /for example/);
  assert.deepEqual(quickFacts(), { stick: 113, half: 113, cup: 227, tbsp: 14 });
  assert.deepEqual(butterExampleRows("en"), [
    ["1 1/2 sticks butter", "170 g (12 tbsp, 3/4 cup)"],
    ["2 tbsp butter", "28 g"],
    ["250 g block of butter", "2.20 sticks (2 sticks + 23 g)"],
  ]);
});

test("butter pages use the spec titles in all three languages", () => {
  const page = pages.find((item) => item.id === "butter");
  const expect = {
    en: {
      h1: "Butter Converter: Sticks, Cups and Tablespoons to Grams",
      title: "Butter in Grams: Stick, Cup and Tablespoon Converter",
      description: "One US stick of butter is 4 oz, 8 tablespoons or 1/2 cup: 113 g. Convert sticks, cups, tablespoons and grams.",
      path: "/en/butter-conversion/",
      lang: "en",
    },
    "zh-cn": {
      h1: "黄油换算器：条、杯、汤匙转克",
      title: "黄油多少克？一条、半杯、一汤匙黄油换算",
      description: "一条黄油是 4 盎司、8 汤匙、半杯：113 克。换算条、杯、汤匙和克。",
      path: "/zh-cn/huangyou-huansuan/",
      lang: "zh-CN",
    },
    "zh-tw": {
      h1: "奶油換算器：條、杯、湯匙轉克",
      title: "奶油幾克？一條、半杯、一湯匙奶油換算",
      description: "一條奶油是 4 盎司、8 湯匙、半杯：113 克。換算條、杯、湯匙和克。",
      path: "/zh-tw/naiyou-huansuan/",
      lang: "zh-TW",
    },
  };
  const html = {};
  for (const lang of ["en", "zh-cn", "zh-tw"]) {
    html[lang] = renderPage(page, lang);
    const spec = expect[lang];
    assert.equal(page.h1[lang], spec.h1);
    assert.equal(page.title[lang], spec.title);
    assert.equal(page.description[lang], spec.description);
    assert.match(html[lang], new RegExp(`<html lang="${spec.lang}">`));
    assert.match(html[lang], new RegExp(`<title>${spec.title.replace(/[?]/g, "\\?")}</title>`));
    assert.match(html[lang], new RegExp(`<h1>${spec.h1}</h1>`));
    assert.match(html[lang], new RegExp(`name="description" content="${spec.description}"`));
    assert.match(html[lang], new RegExp(`property="og:title" content="${spec.title.replace(/[?]/g, "\\?")}"`));
    assert.match(html[lang], new RegExp(`property="og:description" content="${spec.description}"`));
    assert.match(html[lang], new RegExp(`rel="canonical" href="https://doughcalc\\.app${spec.path}"`));
    assert.match(html[lang], /property="og:image" content="https:\/\/doughcalc\.app\/og\.png"/);
    assert.match(html[lang], /rel="icon" href="\/favicon\.svg"/);
    assert.match(html[lang], /hreflang="en"/);
    assert.match(html[lang], /hreflang="zh-CN"/);
    assert.match(html[lang], /hreflang="zh-TW"/);
    assert.match(html[lang], /hreflang="x-default" href="https:\/\/doughcalc\.app\/en\/butter-conversion\/"/);
    assert.match(html[lang], /aria-current="page"/);
    assert.match(html[lang], /id="out-main"/);
    assert.match(html[lang], /113/);
    assert.match(html[lang], /src="\/assets\/butter\.js"/);
    assert.doesNotMatch(html[lang], /src="https?:/);
    for (const href of html[lang].match(/href="[^"]+"/g) || []) assert.equal(href.includes("?"), false, href);
    assert.doesNotMatch(html[lang], /official|guaranteed|certified|\bexact\b|exactly/i);
    assert.doesNotMatch(html[lang], /calorie|nutrition|卡路里|热量|熱量|营养|營養/);
    assert.match(html[lang], /href="https:\/\/fdc\.nal\.usda\.gov\/food-details\/173410\/nutrients"/);
    assert.match(html[lang], /href="https:\/\/www\.kingarthurbaking\.com\/learn\/ingredient-weight-chart"/);
    assert.match(html[lang], /U\.S\. Department of Agriculture, Agricultural Research Service\. FoodData Central/);
    assert.match(html[lang], /113\.5/);
    assert.match(html[lang], /227/);
    const footer = html[lang].slice(html[lang].indexOf("<footer"));
    assert.doesNotMatch(footer, /butter-conversion|huangyou-huansuan|naiyou-huansuan/);
    assert.match(footer, /mailto:alan\.chang198807@gmail\.com/);
    const steps = html[lang].slice(html[lang].indexOf('class="howto"'), html[lang].indexOf('class="example"'));
    assert.ok(steps.includes("svg"), lang);
  }
  assert.match(html.en, /What you type stays in this browser and is never sent\./);
  assert.match(html.en, /One US stick of butter is 4 oz \(113 g\), 8 tablespoons, or half a cup\./);
  assert.match(html.en, /1 stick = 113 g/);
  assert.match(html.en, /1\/2 cup = 113 g/);
  assert.match(html.en, /1 cup = 227 g/);
  assert.match(html.en, /1 tbsp = 14 g/);
  assert.match(html.en, /value="1 stick"/);
  assert.match(html.en, /Sticks and spoons stay US sizes; only the cup changes\./);
  assert.match(html.en, /What this does not cover/);
  assert.match(html.en, /melted, whipped, or plant-based butter/);
  assert.match(html.en, /How much is a stick of butter\?/);
  assert.match(html.en, />28</);
  assert.match(html.en, /href="\/en\/grams-to-cups-converter\/"/);
  assert.match(html.en, />Grams to Cups Converter</);
  assert.match(html.en, /href="\/en\/"/);
  assert.doesNotMatch(html.en, /tablespoon-converter|sugar-converter|flour-converter/);
  const labels = ["Amount", "stick", "tbsp", "tsp", "cup", "g", "oz", "1 stick", "1/2 cup", "100 g", "Result", "Copy result", "Print"];
  const steps = html.en.slice(html.en.indexOf('class="howto"'), html.en.indexOf('class="example"'));
  for (const label of labels) assert.ok(html.en.includes(`>${label}<`) || html.en.includes(`>${label}</`), label);
  for (const label of labels) assert.ok(steps.includes(label), label);
  assert.match(html["zh-cn"], /你输入的内容只留在这个浏览器里，不会发送出去。/);
  assert.match(html["zh-cn"], /一条美制黄油是 4 盎司（113 克）、8 汤匙，也就是半杯。/);
  assert.match(html["zh-cn"], /在数量里输入 1 条或 2 汤匙，或点 1 条、1\/2 杯、100 克。/);
  assert.match(html["zh-tw"], /你輸入的內容只留在這個瀏覽器，不會送出去。/);
  assert.match(html["zh-tw"], /一條美制奶油是 4 盎司（113 克）、8 湯匙，也就是半杯。/);
  assert.match(html["zh-tw"], /在數量輸入 1 條或 2 湯匙，或點 1 條、1\/2 杯、100 克。/);
  for (const lang of ["en", "zh-cn", "zh-tw"]) {
    assert.equal(quickLines(lang).length, 3, lang);
    assert.ok(html[lang].indexOf('class="howto"') < html[lang].indexOf('class="example"'), lang);
    assert.ok(html[lang].indexOf('class="example"') < html[lang].indexOf('class="faq"'), lang);
    assert.ok(html[lang].indexOf('class="faq"') < html[lang].indexOf("sources-note"), lang);
    assert.ok(html[lang].indexOf("sources-note") < html[lang].indexOf('class="gap"'), lang);
    assert.ok(html[lang].indexOf('class="gap"') < html[lang].indexOf('class="related"'), lang);
  }
  const home = renderPage(pages.find((item) => item.id === "home"), "en");
  assert.match(home, /href="\/en\/butter-conversion\/"/);
  assert.match(home, />Butter Converter: Sticks, Cups and Tablespoons to Grams</);
  assert.match(home, />Grams to Cups Converter</);
  const sitemap = renderSitemap();
  assert.equal(sitemap.split("<loc>").length - 1, 240);
  assert.match(sitemap, /<loc>https:\/\/doughcalc\.app\/en\/butter-conversion\/<\/loc>/);
  assert.match(sitemap, /<loc>https:\/\/doughcalc\.app\/zh-cn\/huangyou-huansuan\/<\/loc>/);
  assert.match(sitemap, /<loc>https:\/\/doughcalc\.app\/zh-tw\/naiyou-huansuan\/<\/loc>/);
  assert.match(sitemap, /hreflang="x-default" href="https:\/\/doughcalc\.app\/en\/butter-conversion\/"/);
});

function butterGrams(raw, options = {}) {
  const out = interpret(raw, { ingredient: "butter", spoonStyle: "us", hero: "grams", ...options });
  assert.equal(out.ok, true, raw);
  return { grams: butterView(out.result, "en").grams, parsed: out.parsed, result: out.result };
}

test("unit taps, limits, pounds, and small grams stay consistent", () => {
  const cups = butterGrams("2", { defaultUnit: "cup" });
  assert.equal(cups.grams, "454 g");
  const cupNote = detectionNote(cups.parsed, "en", { pageIngredient: "butter", skipDirection: true });
  assert.match(cupNote, /I read this as 2 cups\./);
  assert.equal(cupNote.includes("Cups →"), false);
  assert.equal(butterGrams("2", { defaultUnit: "oz" }).grams, "57 g");
  const pinches = butterGrams("2 pinches", { defaultUnit: "oz" });
  assert.equal(pinches.grams, "57 g");
  assert.match(detectionNote(pinches.parsed, "en", { pageIngredient: "butter", skipDirection: true }), /2 oz/);
  const tapped = applyUnitTap("2 sticks", "g", { ingredient: "butter", spoonStyle: "us", hero: "grams" });
  assert.equal(butterGrams(tapped.amount, { defaultUnit: "g" }).grams, "227 g");
  assert.match(butterView(interpret(tapped.amount, { ingredient: "butter", spoonStyle: "us", hero: "grams", defaultUnit: "g" }).result, "en").summary, /2 sticks/);
  const bare = applyUnitTap("2", "cup", { ingredient: "butter", spoonStyle: "us", defaultUnit: "stick", hero: "grams" });
  assert.equal(bare.amount, "2");
  assert.equal(butterGrams("2000 sticks").grams, "226796 g");
  assert.equal(butterGrams("16000 tbsp").grams, "226800 g");
  const tooMany = interpret("2001 sticks", { ingredient: "butter", spoonStyle: "us" });
  assert.equal(tooMany.ok, false);
  const message = errorText(tooMany.resolved.reason, "en", tooMany.resolved.limit, tooMany.resolved.unit);
  assert.match(message, /2,000 sticks/);
  assert.match(message, /for example 2/);
  assert.match(errorText(tooMany.resolved.reason, "zh-cn", tooMany.resolved.limit, tooMany.resolved.unit), /2,000 条/);
  assert.equal(butterGrams("0.25 lb").grams, "113 g");
  assert.equal(butterGrams("1e3 g").grams, "1000 g");
  assert.equal(butterGrams("半杯").grams, "113 g");
  assert.equal(butterGrams("半條").grams, "57 g");
  assert.equal(butterGrams("半条").grams, "57 g");
  assert.equal(butterGrams("0.4", { defaultUnit: "g" }).grams, "0.4 g");
  const third = butterView(interpret("1/3 cup", { ingredient: "butter", spoonStyle: "us", hero: "grams" }).result, "en");
  assert.equal(third.summary.includes("(0.67)"), false);
  assert.match(third.summary, /2\/3 stick/);
  const typedCups = detectionNote(butterGrams("2 cups").parsed, "en", { pageIngredient: "butter", skipDirection: true });
  assert.equal(typedCups.includes("Cups →"), false);
});

const UNIT_GRAMS = {
  g: (n) => n,
  kg: (n) => n * 1000,
  oz: (n) => n * 28.3495,
  lb: (n) => n * 28.3495 * 16,
  ml: (n) => (n * 226.796185) / 236.5882365,
  stick: (n) => n * 113.3980925,
  cup: (n) => Math.round((n * 226.8 + Number.EPSILON) * 100) / 100,
  tbsp: (n) => Math.round(((n / 16) * 226.8 + Number.EPSILON) * 100) / 100,
  tsp: (n) => Math.round(((n / 48) * 226.8 + Number.EPSILON) * 100) / 100,
};

test("the noted unit is the unit that was calculated", () => {
  const units = ["stick", "tbsp", "tsp", "cup", "g", "oz", "lb", "ml", "kg"];
  for (const unit of units) {
    for (const count of [0.25, 1, 2, 4]) {
      const raw = String(count);
      const out = interpret(raw, { ingredient: "butter", spoonStyle: "us", hero: "grams", defaultUnit: unit });
      assert.equal(out.ok, true, `${count} ${unit}`);
      assert.equal(out.parsed.unit, unit, `${count} ${unit}`);
      assert.ok(Math.abs(out.result.gramsExact - UNIT_GRAMS[unit](count)) < 0.05, `${count} ${unit} ${out.result.gramsExact}`);
      const note = detectionNote(out.parsed, "en", { pageIngredient: "butter", skipDirection: true });
      assert.match(note, new RegExp(`\\b${count}\\b`), note);
      assert.equal(butterView(out.result, "en").grams, `${displayGrams(out.result.gramsExact)} g`);
      if (Math.abs(UNIT_GRAMS[unit](count) - count) > 0.5) {
        assert.notEqual(displayGrams(out.result.gramsExact), displayGrams(count), `${count} ${unit}`);
      }
    }
    const pinches = interpret("2 pinches", { ingredient: "butter", spoonStyle: "us", hero: "grams", defaultUnit: unit });
    assert.equal(pinches.ok, true, unit);
    assert.equal(pinches.parsed.unit, unit);
    assert.ok(Math.abs(pinches.result.gramsExact - UNIT_GRAMS[unit](2)) < 0.05, unit);
  }
  let remembered = "stick";
  for (const raw of ["0.25 lb", "2"]) {
    const out = interpret(raw, { ingredient: "butter", spoonStyle: "us", hero: "grams", defaultUnit: remembered });
    assert.equal(out.ok, true, raw);
    remembered = out.parsed.unit;
  }
  const twoLb = interpret("2", { ingredient: "butter", spoonStyle: "us", hero: "grams", defaultUnit: "lb" });
  assert.equal(butterView(twoLb.result, "en").grams, "907 g");
  assert.match(detectionNote(twoLb.parsed, "en", { pageIngredient: "butter", skipDirection: true }), /2 lb/);
  const twoMl = interpret("2", { ingredient: "butter", spoonStyle: "us", hero: "grams", defaultUnit: "ml" });
  assert.equal(butterView(twoMl.result, "en").grams, "1.9 g");
  assert.match(detectionNote(twoMl.parsed, "en", { pageIngredient: "butter", skipDirection: true }), /2 ml/);
  for (const lang of ["en", "zh-cn", "zh-tw"]) {
    assert.match(errorText("limit", lang, 100000, "g"), lang === "en" ? /100,000 g/ : /100,000 克/);
    assert.match(errorText("limit", lang, 1000, "cup"), lang === "en" ? /1,000 cups/ : /1,000 杯/);
    assert.match(errorText("limit", lang, 3527, "oz"), lang === "en" ? /3,527 oz/ : /3,527 盎司/);
  }
  const ounces = interpret("3528 oz", { ingredient: "butter", spoonStyle: "us" });
  assert.equal(ounces.ok, false);
  assert.match(errorText(ounces.parsed.reason, "en", ounces.parsed.limit, ounces.parsed.unit), /3,527 oz/);
  assert.match(butterView(interpret("2 cups", { ingredient: "butter", spoonStyle: "us", hero: "grams" }).result, "en").copyText, /2 cups/);
  const stickTap = applyUnitTap("250 g", "stick", { ingredient: "butter", spoonStyle: "us", hero: "grams" });
  assert.equal(butterView(interpret(stickTap.amount, { ingredient: "butter", spoonStyle: "us", hero: "grams", defaultUnit: "stick" }).result, "en").grams, "250 g");
  const gramTap = applyUnitTap("2 sticks", "g", { ingredient: "butter", spoonStyle: "us", hero: "grams" });
  const back = interpret(gramTap.amount, { ingredient: "butter", spoonStyle: "us", hero: "grams", defaultUnit: "g" });
  assert.match(butterView(back.result, "en").summary, /2 sticks/);
  assert.equal(butterView(back.result, "en").summary.includes("2.00"), false);
});
