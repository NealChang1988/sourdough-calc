import assert from "node:assert/strict";
import test from "node:test";
import { pages } from "./catalog.mjs";
import { errorText, cupsCopy } from "./cups-copy.mjs";
import { interpret, parseInput } from "./cups.mjs";
import { renderPage, renderSitemap } from "./render.mjs";
import { butterView } from "./butter-copy.mjs";
import {
  exampleRows,
  faqEntries,
  presentSpoon,
  quickLines,
  spoonsCopy,
} from "./spoons-copy.mjs";
import {
  cupSpoonRows,
  gramsPerSpoonRows,
  spoonCompute,
  spoonOnlyRows,
  usMetricRows,
} from "./spoons.mjs";

const page = pages.find((item) => item.id === "spoons");

function show(raw, options = {}) {
  const out = spoonCompute(raw, { ingredient: "sugar", spoon: "us", defaultUnit: "tbsp", ...options });
  assert.equal(out.ok, true, `${raw} ${out.reason || ""}`);
  return { out, view: presentSpoon(out, "en") };
}

test("grams per spoon and by-the-spoon tables match the published figures", () => {
  const expected = {
    ap: ["7.5", "2.5"],
    bread: ["7.5", "2.5"],
    whole: ["7.1", "2.4"],
    sugar: ["12.5", "4.2"],
    brown: ["13.8", "4.6"],
    powdered: ["7.5", "2.5"],
    butter: ["14.2", "4.7"],
    milk: ["15.3", "5.1"],
    honey: ["21.2", "7.1"],
    water: ["14.8", "4.9"],
    oil: ["13.6", "4.5"],
    olive: ["13.5", "4.5"],
    cocoa: ["5.4", "1.8"],
    oats: ["5.6", "1.9"],
    rice: ["11.6", "3.9"],
    corn: ["8.0", "2.7"],
  };
  for (const row of gramsPerSpoonRows()) assert.deepEqual([row.tbsp, row.tsp], expected[row.id], row.id);
  const only = {
    salt: ["18.0", "6.0", "18.3", "6.1"],
    dc: ["8.0", "2.7", "8.1", "2.7"],
    morton: ["16.0", "5.3", "16.2", "5.4"],
    bp: ["12.0", "4.0", "12.2", "4.1"],
    soda: ["18.0", "6.0", "18.3", "6.1"],
    yeast: ["9.0", "3.0", "9.1", "3.0"],
    vanilla: ["14.0", "4.7", "14.2", "4.7"],
  };
  const metric = Object.fromEntries(spoonOnlyRows("metric").map((row) => [row.id, row]));
  for (const row of spoonOnlyRows("us")) {
    assert.deepEqual([row.tbsp, row.tsp, metric[row.id].tbsp, metric[row.id].tsp], only[row.id], row.id);
  }
  assert.deepEqual(
    usMetricRows().map((row) => [row.us, row.metric]),
    [["12.5", "12.7"], ["7.5", "7.6"], ["14.2", "14.4"], ["14.8", "15.0"]],
  );
  assert.deepEqual(
    cupSpoonRows().map((row) => [row.tbsp, row.tsp, row.ml]),
    [
      ["16", "48", "236.59"],
      ["8", "24", "118.29"],
      ["4", "12", "59.15"],
      ["2", "6", "29.57"],
      ["1", "3", "14.79"],
      ["", "1", "4.93"],
    ],
  );
});

test("forward and reverse spoon answers match the expected table", () => {
  const forward = [
    ["1 tbsp", {}, "12.5", "3 tsp", "14.79", "0.44", "1/16 (0.06)"],
    ["1 tsp sugar", {}, "4.2", "1/3 tbsp (0.33)", "4.93", "0.15", "0.02"],
    ["2 tbsp sugar", {}, "25", "6 tsp", "29.57", "0.88", "1/8 (0.13)"],
    ["3 tbsp sugar", {}, "37.5", "9 tsp", "44.36", "1.32", "3/16 (0.19)"],
    ["3 tablespoons flour", {}, "22.5", "9 tsp", "44.36", "0.79", "3/16 (0.19)"],
    ["1 tbsp flour", {}, "7.5", "3 tsp", "14.79", "0.26", "1/16 (0.06)"],
    ["1 tsp flour", {}, "2.5", "1/3 tbsp (0.33)", "4.93", "0.09", "0.02"],
    ["1 tbsp honey", {}, "21.2", "3 tsp", "14.79", "0.75", "1/16 (0.06)"],
    ["1 tsp brown sugar", {}, "4.6", "1/3 tbsp (0.33)", "4.93", "0.16", "0.02"],
    ["1 tbsp powdered sugar", {}, "7.5", "3 tsp", "14.79", "0.26", "1/16 (0.06)"],
    ["1 tsp powdered sugar", {}, "2.5", "1/3 tbsp (0.33)", "4.93", "0.09", "0.02"],
    ["1 tbsp butter", {}, "14.2", "3 tsp", "14.79", "0.50", "1/16 (0.06)"],
    ["1 tbsp water", {}, "14.8", "3 tsp", "14.79", "0.52", "1/16 (0.06)"],
    ["1 1/2 tsp salt", {}, "9.0", "1/2 tbsp (0.50)", "7.39", "0.32", ""],
    ["1 tbsp salt", {}, "18", "3 tsp", "14.79", "0.63", ""],
    ["1 tbsp", { ingredient: "dc" }, "8.0", "3 tsp", "14.79", "0.28", ""],
    ["1 tbsp", { ingredient: "morton" }, "16", "3 tsp", "14.79", "0.56", ""],
    ["1 tsp baking powder", {}, "4.0", "1/3 tbsp (0.33)", "4.93", "0.14", ""],
    ["1/2 tsp baking soda", {}, "3.0", "0.17 tbsp", "2.46", "0.11", ""],
    ["2 tsp instant yeast", {}, "6.0", "2/3 tbsp (0.67)", "9.86", "0.21", ""],
    ["1 tbsp vanilla", {}, "14", "3 tsp", "14.79", "0.49", ""],
    ["1 stick butter", {}, "113.4", "8 tbsp", "118.29", "4.00", "1/2"],
    ["1/4 cup sugar", {}, "50", "4 tbsp", "59.15", "1.76", "1/4"],
    ["1 tbsp sugar", { spoon: "metric" }, "12.7", "3 tsp", "15.00", "0.45", "0.06"],
    ["1 tsp sugar", { spoon: "metric" }, "4.2", "1/3 tbsp (0.33)", "5.00", "0.15", "0.02"],
    ["1 tbsp flour", { spoon: "metric" }, "7.6", "3 tsp", "15.00", "0.27", "0.06"],
    ["1 tbsp butter", { spoon: "metric" }, "14.4", "3 tsp", "15.00", "0.51", "0.06"],
    ["1 tbsp salt", { spoon: "metric" }, "18.3", "3 tsp", "15.00", "0.64", ""],
  ];
  for (const [raw, options, grams, other, ml, oz, cups] of forward) {
    const { view, out } = show(raw, options);
    assert.equal(view.grams, `${grams} g`, raw);
    if (raw.startsWith("1 stick") || raw.startsWith("1/4 cup")) {
      assert.equal(view.tbsp, other, raw);
      assert.match(view.tsp, /tsp$/, raw);
    } else assert.equal(view.other, other, raw);
    assert.equal(out.mlText, ml, raw);
    assert.equal(out.ozText, oz, raw);
    assert.equal(view.cups, cups ? `${cups} cup` : "", raw);
  }
  const tiny = show("1/16 tsp salt");
  assert.equal(tiny.view.grams, "0.4 g");
  assert.equal(tiny.view.hint, "Less than 1/8 tsp — use a scale.");
  assert.equal(tiny.out.mlText, "0.31");
  assert.equal(tiny.out.ozText, "0.01");
  assert.equal(tiny.view.cups, "");

  const reverse = [
    ["15 g sugar", {}, "1.20", "3.60", "1 tbsp + 0.6 tsp"],
    ["25 g sugar", {}, "2.00", "6.00", "2 tbsp"],
    ["24.9 g sugar", {}, "1.99", "5.98", "2 tbsp"],
    ["100 g flour", {}, "13.33", "40.00", "13 tbsp + 1.0 tsp"],
    ["30 g honey", {}, "1.42", "4.25", "1 tbsp + 1.2 tsp"],
    ["10 g salt", {}, "0.56", "1.67", "1.67 tsp"],
    ["5 g instant yeast", {}, "0.56", "1.67", "1.67 tsp"],
    ["1 g baking soda", {}, "0.06", "0.17", "0.17 tsp"],
    ["15 g sugar", { spoon: "metric" }, "1.18", "3.55", "1 tbsp + 0.5 tsp"],
  ];
  for (const [raw, options, tbsp, tsp, kitchen] of reverse) {
    const { out, view } = show(raw, options);
    assert.equal(out.tbspText, tbsp, raw);
    assert.equal(out.tspText, tsp, raw);
    assert.equal(view.kitchen, kitchen, raw);
    assert.match(view.hero, new RegExp(tbsp), raw);
  }
  const tooSmall = show("0.5 g salt");
  assert.equal(tooSmall.view.hero, "Less than 1/8 tsp — use a scale.");
  assert.equal(tooSmall.view.showNumbers, false);
});

test("spoon-only words stay off the converter and butter page", () => {
  for (const raw of ["1 tsp salt", "1 tsp baking powder", "1 tbsp yeast", "1 tsp vanilla", "1 tsp baking soda"]) {
    const parsed = parseInput(raw);
    assert.equal(parsed.ok, true, raw);
    assert.equal(parsed.ingredient, null, raw);
  }
  assert.equal(parseInput("1 tbsp cocoa powder").ingredient, "cocoa");
  assert.equal(parseInput("1 tbsp powdered sugar").ingredient, "powdered");
  assert.equal(parseInput("1 tbsp baking powder").ingredient, null);
  const butter = interpret("2 tbsp butter", { ingredient: "butter", spoonStyle: "us", hero: "grams" });
  assert.equal(butterView(butter.result, "en").grams, "28 g");
  const stick = interpret("1 stick butter", { ingredient: "butter", spoonStyle: "us", hero: "grams" });
  assert.equal(butterView(stick.result, "en").grams, "113 g");
});

test("page messages name the next step", () => {
  const kosher = spoonCompute("1 tbsp kosher salt");
  assert.equal(kosher.ok, false);
  assert.equal(kosher.reason, "kosher");
  const cup = spoonCompute("1 cup salt");
  assert.equal(cup.ok, false);
  assert.equal(cup.reason, "nocup");
  const stick = spoonCompute("1 stick flour");
  assert.equal(stick.ok, false);
  assert.equal(stick.reason, "stick");
  const butter = show("1 stick butter");
  assert.equal(butter.view.grams, "113.4 g");
  const pinches = show("2 pinches salt");
  assert.equal(pinches.view.grams, "36 g");
  assert.equal(pinches.out.parsed.unit, "tbsp");
  assert.match(pinches.out.parsed.unrecognized, /pinches/);
  for (const raw of ["0", "-1", "abc", ""]) {
    const out = spoonCompute(raw);
    assert.equal(out.ok, false, raw);
    assert.match(errorText(out.reason, "en", out.limit, out.unit), /Enter a number/);
  }
  assert.match(errorText(spoonCompute("16001 tbsp").reason, "en", spoonCompute("16001 tbsp").limit, "tbsp"), /16,000 tbsp/);
  assert.match(errorText(spoonCompute("48001 tsp").reason, "en", spoonCompute("48001 tsp").limit, "tsp"), /48,000 tsp/);
  assert.match(errorText(spoonCompute("100001 g").reason, "en", spoonCompute("100001 g").limit, spoonCompute("100001 g").unit), /100,000 g/);
  const zh = spoonCompute("1 茶匙 盐", { ingredient: "sugar", defaultUnit: "tbsp" });
  assert.equal(presentSpoon(zh, "zh-cn").grams, "6.0 克");
  const tw = spoonCompute("1 湯匙 細砂糖");
  assert.equal(presentSpoon(tw, "zh-tw").grams, "12.5 克");
});

test("the spoons page is published in three languages", () => {
  assert.equal(page.h1.en, "Tablespoons and Teaspoons to Grams");
  assert.equal(page.title.en, "Tablespoons to Grams (and Teaspoons to Grams) by Ingredient");
  assert.equal(page.description.en, "Tablespoons and teaspoons to grams for flour, sugar, butter, honey, salt and more, with US and metric spoons.");
  assert.equal(page.h1["zh-cn"], "汤匙、茶匙转克换算器");
  assert.equal(page.title["zh-cn"], "汤匙、茶匙换算成克（各种食材）");
  assert.equal(page.description["zh-cn"], "面粉、糖、黄油、蜂蜜、盐等食材的汤匙、茶匙换算成克，含美制和公制汤匙。");
  assert.equal(page.h1["zh-tw"], "湯匙、茶匙轉克換算器");
  assert.equal(page.title["zh-tw"], "湯匙、茶匙換算成克（各種食材）");
  assert.equal(page.description["zh-tw"], "麵粉、糖、奶油、蜂蜜、鹽等食材的湯匙、茶匙換算成克，含美制和公制湯匙。");
  const html = {
    en: renderPage(page, "en"),
    "zh-cn": renderPage(page, "zh-cn"),
    "zh-tw": renderPage(page, "zh-tw"),
  };
  assert.match(html.en, /<html lang="en">/);
  assert.match(html["zh-cn"], /<html lang="zh-CN">/);
  assert.match(html["zh-tw"], /<html lang="zh-TW">/);
  assert.match(html.en, /rel="canonical" href="https:\/\/doughcalc\.app\/en\/tablespoons-teaspoons-to-grams\/"/);
  assert.match(html.en, /hreflang="zh-CN"/);
  assert.match(html.en, /hreflang="zh-TW"/);
  assert.match(html.en, /hreflang="x-default" href="https:\/\/doughcalc\.app\/en\/tablespoons-teaspoons-to-grams\/"/);
  assert.match(html.en, /property="og:title" content="Tablespoons to Grams \(and Teaspoons to Grams\) by Ingredient"/);
  assert.match(html.en, /og:image/);
  assert.match(html.en, /favicon/);
  assert.match(html.en, /12\.5 g/);
  assert.match(html.en, /By the spoon/);
  assert.match(spoonsCopy.en.kosher, /Kosher salt depends on the brand/);
  assert.match(html.en, /What you type stays in this browser and is never sent\./);
  assert.match(html.en, /Above 0, and at most 100,000 g, 16,000 tbsp, or 48,000 tsp\./);
  assert.match(html.en, /onsubmit="return false"/);
  assert.match(html.en, /We assume level spoons/);
  assert.match(html.en, /kingarthurbaking\.com\/learn\/ingredient-weight-chart/);
  assert.match(html.en, /fdc\.nal\.usda\.gov/);
  assert.match(html.en, /7\.5 g/);
  assert.match(html.en, /8\.0 g/);
  assert.match(html.en, /Australian tablespoon/);
  assert.match(html.en, /active dry yeast/);
  assert.doesNotMatch(html.en, /official|guaranteed|certified|\bexact\b/i);
  assert.match(html.en, /href="\/en\/butter-conversion\/"/);
  assert.match(html.en, /href="\/en\/grams-to-cups-converter\/"/);
  const footer = html.en.slice(html.en.indexOf("<footer"));
  assert.doesNotMatch(footer, /tablespoons-teaspoons-to-grams/);
  assert.match(footer, /mailto:alan\.chang198807@gmail\.com/);
  const steps = html.en.slice(html.en.indexOf('class="howto"'), html.en.indexOf('class="example"'));
  for (const label of ["Ingredient", "Amount", "2 tbsp", "15 g", "1 tbsp", "1 tsp", "tbsp", "tsp", "g", "Result", "Copy result", "Print"]) {
    assert.ok(steps.includes(label), label);
    assert.ok(html.en.includes(`>${label}<`) || html.en.includes(`>${label}</`) || html.en.includes(` ${label}`), label);
  }
  assert.match(html["zh-cn"], /先选食材，再在数量里输入 2 汤匙或 15 克，或点 1 汤匙、1 茶匙、15 克。/);
  assert.match(html["zh-tw"], /先選食材，再在數量輸入 2 湯匙或 15 克，或點 1 湯匙、1 茶匙、15 克。/);
  assert.equal(spoonsCopy["zh-cn"].tiny, "不到 1/8 茶匙，请用秤。");
  assert.equal(spoonsCopy["zh-tw"].tiny, "不到 1/8 茶匙，請用秤。");
  assert.equal(quickLines("en")[1], "Sugar: 1 tbsp = 12.5 g · 1 tsp = 4.2 g");
  assert.equal(quickLines("en")[2], "Flour: 1 tbsp = 7.5 g · 1 tsp = 2.5 g");
  assert.equal(quickLines("en")[3], "Butter: 1 tbsp = 14.2 g · 1 tsp = 4.7 g");
  assert.match(quickLines("zh-cn")[1], /细砂糖：1 汤匙 = 12\.5 克/);
  assert.match(quickLines("zh-tw")[2], /中筋麵粉：1 湯匙 = 7\.5 克/);
  assert.deepEqual(exampleRows("en")[0], ["2 tbsp sugar", "25 g"]);
  assert.deepEqual(exampleRows("en")[1], ["1 1/2 tsp salt", "9.0 g"]);
  assert.deepEqual(exampleRows("en")[2], ["15 g sugar", "1.2 tbsp (1 tbsp + 0.6 tsp)"]);
  assert.equal(faqEntries("en").length, 5);
  assert.match(faqEntries("en")[4][1], /14\.175 g/);
  assert.match(html.en, /value="1 tbsp"/);
  assert.match(html["zh-cn"], /value="1 汤匙"/);
  const home = renderPage(pages.find((item) => item.id === "home"), "en");
  assert.match(home, /href="\/en\/tablespoons-teaspoons-to-grams\/"/);
  assert.match(home, />Tablespoons and Teaspoons to Grams</);
  const butter = renderPage(pages.find((item) => item.id === "butter"), "en");
  assert.match(butter, /href="\/en\/tablespoons-teaspoons-to-grams\/"/);
  const cups = renderPage(pages.find((item) => item.id === "cups"), "en");
  assert.match(cups, /href="\/en\/tablespoons-teaspoons-to-grams\/"/);
  assert.doesNotMatch(cups, /<option value="salt"/);
  assert.doesNotMatch(butter, /<option value="salt"/);
  const sitemap = renderSitemap();
  assert.equal(sitemap.split("<loc>").length - 1, 243);
  assert.match(sitemap, /<loc>https:\/\/doughcalc\.app\/en\/tablespoons-teaspoons-to-grams\/<\/loc>/);
  assert.match(sitemap, /<loc>https:\/\/doughcalc\.app\/zh-cn\/tangchi-chachi-zhuan-ke\/<\/loc>/);
  assert.match(sitemap, /<loc>https:\/\/doughcalc\.app\/zh-tw\/tangchi-chachi-zhuan-ke\/<\/loc>/);
  assert.match(sitemap, /hreflang="x-default" href="https:\/\/doughcalc\.app\/en\/tablespoons-teaspoons-to-grams\/"/);
  assert.equal(cupsCopy.en.names.sugar, "Granulated sugar");
});
