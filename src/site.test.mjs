import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtemp, readdir, readFile, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { writeSite } from "../build.mjs";
import { SITE_URL } from "../site.config.mjs";
import { nearestHydration, pages, redirectRules, toolCount } from "./catalog.mjs";
import { doughGuides } from "./data/dough-guides.mjs";
import { formatAmount } from "./formula.mjs";
import { ui } from "./i18n.mjs";
import { renderPage } from "./render.mjs";

test("long-tail calculators are the kept hydration, pizza, and bread pages", () => {
  assert.equal(toolCount(), 73);
  assert.equal(pages.length, 79);
  assert.deepEqual(
    pages.filter((page) => page.category === "hydration" && page.kind === "tool").map((page) => page.preset.hydration),
    [65, 70, 75, 80],
  );
  assert.equal(pages.filter((page) => page.category === "pizza" && page.kind === "tool").length, 8);
  assert.equal(pages.some((page) => page.kind === "tool" && (page.category === "salt" || page.category === "starter")), false);
});

test("home page shows the 500 g reference recipe", () => {
  const home = pages.find((page) => page.id === "home");
  const html = renderPage(home, "en");
  assert.match(html, /id="out-water">375 g/);
  assert.match(html, /id="out-starter">100 g/);
  assert.match(html, /id="out-salt">10 g/);
  assert.match(html, /id="out-total">985 g/);
  assert.match(html, /id="out-effective">77\.3%/);
  assert.match(html, new RegExp(`rel="canonical" href="${SITE_URL}/en/"`));
  assert.match(html, /hreflang="zh-CN"/);
  assert.match(html, /hreflang="zh-TW"/);
  assert.match(html, /hreflang="x-default" href="[^"]+\/en\/"/);
});

test("sample long-tail pages keep their titles and language tags", () => {
  const hydration = pages.find((page) => page.id === "hydration-70");
  const pizza = pages.find((page) => page.id === "pizza-neapolitan");
  const focaccia = pages.find((page) => page.id === "bread-focaccia");
  assert.equal(hydration.title.en, "70% Hydration Sourdough Calculator");
  assert.equal(pizza.title.en, "Neapolitan Pizza Dough");
  assert.equal(focaccia.title.en, "Focaccia Baker's Percentage");
  const pizzaHtml = renderPage(pizza, "en");
  assert.match(pizzaHtml, /name="balls"/);
  assert.doesNotMatch(pizzaHtml, /name="balls"[^>]*disabled/);
  assert.match(pizzaHtml, /name="hydration"/);
  assert.doesNotMatch(pizzaHtml, /name="hydration"[^>]*readonly/);
  assert.match(pizzaHtml, /hreflang="zh-CN" href="[^"]+\/zh-cn\/nabulesi-pisa\/"/);
  assert.doesNotMatch(pizzaHtml, /-\d+-balls/);
  const tw = renderPage(hydration, "zh-tw");
  assert.match(tw, /<html lang="zh-TW">/);
  assert.match(tw, /<h1>70% 水合酸種計算<\/h1>/);
  assert.match(tw, /hreflang="en"/);
  const focacciaTw = renderPage(focaccia, "zh-tw");
  assert.match(focacciaTw, /佛卡夏烘焙百分比/);
});

test("every calculator page prints water from baker's percentage", () => {
  for (const page of pages) {
    if (!page.preset) continue;
    const html = renderPage(page, "en");
    const preset = page.preset;
    const flour =
      preset.mode === "balls"
        ? (preset.balls * preset.gramsPerBall) /
          (1 + (preset.hydration + preset.starter + preset.salt + preset.yeast) / 100)
        : preset.flour;
    const water = (flour * preset.hydration) / 100;
    assert.ok(html.includes(`id="out-water">${formatAmount(water)} g`), page.id);
  }
});

test("pages do not mention nutrition, brands, or trackers", () => {
  const banned = [
    /king arthur/i,
    /calorie/i,
    /nutrition/i,
    /affiliate/i,
    /weight loss/i,
    /卡路里/,
    /热量/,
    /熱量/,
    /营养/,
    /營養/,
    /减肥/,
    /減肥/,
    /健康/,
    /google-analytics/i,
    /gtag\(/,
  ];
  const blob = JSON.stringify(pages);
  for (const pattern of banned) {
    assert.equal(pattern.test(blob), false, pattern.source);
  }
});

test("kept pages describe different doughs and category pages calculate", () => {
  for (const lang of ["en", "zh-cn", "zh-tw"]) {
    const hydration = [65, 70, 75, 80].map((n) => pages.find((page) => page.id === `hydration-${n}`).description[lang]);
    assert.equal(new Set(hydration).size, 4);
    const pizza = pages.filter((page) => page.category === "pizza" && page.kind === "tool").map((page) => page.description[lang]);
    assert.equal(new Set(pizza).size, 8);
  }
  const salt = renderPage(pages.find((page) => page.id === "hub-salt"), "en");
  const starter = renderPage(pages.find((page) => page.id === "hub-starter"), "zh-cn");
  assert.match(salt, /id="calc"/);
  assert.match(salt, /name="salt"[^>]*value="2"/);
  assert.match(starter, /id="calc"/);
  assert.match(starter, /name="starter"[^>]*value="20"/);
  assert.match(salt, /href="mailto:alan.chang198807@gmail.com"/);
  assert.match(salt, /Feedback/);
  assert.match(salt, /Ratios for home baking\./);
  assert.match(starter, /意见反馈/);
  assert.match(starter, /家庭烘焙用的比例。/);
  const tw = renderPage(pages.find((page) => page.id === "home"), "zh-tw");
  assert.match(tw, /意見回饋/);
  assert.match(tw, /請只填數字，例如 3000，不要加單位/);
  assert.match(renderPage(pages.find((page) => page.id === "home"), "en"), /Enter a number only, for example 3000, without units/);
});

test("visible long-tail paragraphs differ within each language", () => {
  const payload = {};
  for (const category of ["bread", "hydration", "pizza"]) {
    const group = pages.filter((page) => page.category === category && page.kind === "tool");
    payload[category] = {};
    for (const lang of ["en", "zh-cn", "zh-tw"]) {
      payload[category][lang] = group.map((page) => page.intro[lang].join("\n"));
    }
  }
  const script = `
import json, difflib, sys
data = json.load(sys.stdin)
for category, langs in data.items():
    for lang, texts in langs.items():
        best = 0.0
        for i, a in enumerate(texts):
            for b in texts[i+1:]:
                ratio = difflib.SequenceMatcher(None, a, b, autojunk=False).ratio()
                if ratio > best:
                    best = ratio
        print(f"{category} {lang} {best:.4f}")
        if best >= 0.60:
            sys.exit(1)
`;
  const result = spawnSync("python3", ["-c", script], { input: JSON.stringify(payload), encoding: "utf8" });
  if (result.stdout) console.log(result.stdout.trim());
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
});

test("removed urls redirect to the nearest kept page", () => {
  assert.equal(nearestHydration(60), 65);
  assert.equal(nearestHydration(67), 65);
  assert.equal(nearestHydration(68), 70);
  assert.equal(nearestHydration(72), 70);
  assert.equal(nearestHydration(73), 75);
  assert.equal(nearestHydration(77), 75);
  assert.equal(nearestHydration(78), 80);
  assert.equal(nearestHydration(90), 80);
  const rules = redirectRules();
  assert.equal(rules.length, 318);
  const byFrom = new Map(rules.map((rule) => [rule.from, rule.to]));
  assert.equal(byFrom.get("/en/64-hydration-sourdough-calculator/"), "/en/65-hydration-sourdough-calculator/");
  assert.equal(byFrom.get("/en/67-hydration-sourdough-calculator/"), "/en/65-hydration-sourdough-calculator/");
  assert.equal(byFrom.get("/zh-cn/86-shuihe-suanzhong-jisuanqi/"), "/zh-cn/80-shuihe-suanzhong-jisuanqi/");
  assert.equal(byFrom.get("/en/neapolitan-pizza-dough-1-ball/"), "/en/neapolitan-pizza-dough/");
  assert.equal(byFrom.get("/en/neapolitan-pizza-dough-12-balls/"), "/en/neapolitan-pizza-dough/");
  assert.equal(byFrom.get("/zh-tw/baopi-pisa-6-qiu/"), "/zh-tw/baopi-pisa/");
  assert.equal(byFrom.get("/en/20-percent-sourdough-starter/"), "/en/starter-percentage/");
  assert.equal(byFrom.get("/zh-cn/2-5-yan-baifenbi/"), "/zh-cn/yan-bili/");
  assert.equal(byFrom.get("/zh-tw/1-5-yan-baifenbi/"), "/zh-tw/yan-bili/");
  assert.equal(byFrom.get("/en/sandwich-sourdough-bakers-percentage/"), "/en/sourdough-sandwich-loaf-bakers-percentage/");
  assert.equal(byFrom.get("/zh-cn/suanzhong-tusi/"), "/zh-cn/suanzhong-sanmingzhi/");
  assert.equal(byFrom.get("/zh-tw/suanzhong-tusi/"), "/zh-tw/suanzhong-sanmingzhi/");
  assert.equal(byFrom.get("/en/boule-bakers-percentage/"), "/en/country-sourdough-bakers-percentage/");
  assert.equal(byFrom.get("/zh-cn/yuanxing-suanzhong/"), "/zh-cn/xiangcun-suanzhong/");
  assert.equal(byFrom.get("/zh-tw/yuanxing-suanzhong/"), "/zh-tw/xiangcun-suanzhong/");
});

test("merged bread pages keep their own title, description, and calculator", () => {
  assert.equal(pages.some((page) => page.id === "bread-boule" || page.id === "bread-sandwich-sourdough"), false);
  const country = pages.find((page) => page.id === "bread-country-sourdough");
  const loaf = pages.find((page) => page.id === "bread-sourdough-sandwich");
  assert.equal(country.title.en, "Country Sourdough Baker's Percentage");
  assert.equal(country.title["zh-cn"], "乡村酸种面包烘焙百分比");
  assert.equal(country.title["zh-tw"], "鄉村酸種麵包烘焙百分比");
  assert.equal(
    country.description.en,
    "An everyday round or oval with a crackling crust and an irregular, open crumb. Sticky enough to want folds, then a taut skin when you shape it.",
  );
  assert.equal(country.slug.en, "country-sourdough-bakers-percentage");
  assert.equal(country.slug["zh-cn"], "xiangcun-suanzhong");
  assert.equal(country.slug["zh-tw"], "xiangcun-suanzhong");
  assert.equal(country.preset.flour, 500);
  assert.equal(country.preset.hydration, 75);
  assert.equal(country.preset.starter, 20);
  assert.equal(country.preset.salt, 2);
  assert.equal(loaf.title.en, "Sourdough Sandwich Loaf Baker's Percentage");
  assert.equal(loaf.title["zh-cn"], "酸种三明治吐司烘焙百分比");
  assert.equal(loaf.title["zh-tw"], "酸種三明治吐司烘焙百分比");
  assert.equal(
    loaf.description.en,
    "Keep a lid on the tin for the first part of the bake if you want a thinner, paler roof. Slice it once the loaf has cooled.",
  );
  assert.equal(loaf.slug.en, "sourdough-sandwich-loaf-bakers-percentage");
  assert.equal(loaf.slug["zh-cn"], "suanzhong-sanmingzhi");
  assert.equal(loaf.slug["zh-tw"], "suanzhong-sanmingzhi");
  assert.equal(loaf.preset.flour, 500);
  assert.equal(loaf.preset.hydration, 68);
  assert.equal(loaf.preset.starter, 18);
  assert.equal(loaf.preset.salt, 2);
  const countryHtml = renderPage(country, "en");
  assert.match(countryHtml, /rel="canonical" href="[^"]+\/en\/country-sourdough-bakers-percentage\/"/);
  assert.doesNotMatch(countryHtml, /boule-bakers-percentage/);
  const loafHtml = renderPage(loaf, "zh-cn");
  assert.match(loafHtml, /rel="canonical" href="[^"]+\/zh-cn\/suanzhong-sanmingzhi\/"/);
  assert.match(loafHtml, /hreflang="zh-TW" href="[^"]+\/zh-tw\/suanzhong-sanmingzhi\/"/);
  assert.doesNotMatch(loafHtml, /suanzhong-tusi/);
});

test("writeSite emits sitemap, robots, and a sample page", async () => {
  const dir = await mkdtemp(path.join(tmpdir(), "dough-"));
  await writeSite(dir);
  const robots = await readFile(path.join(dir, "robots.txt"), "utf8");
  assert.match(robots, new RegExp(`Sitemap: ${SITE_URL}/sitemap.xml`));
  const sample = await readFile(
    path.join(dir, "en", "70-hydration-sourdough-calculator", "index.html"),
    "utf8",
  );
  assert.match(sample, /<title>70% Hydration Sourdough Calculator<\/title>/);
  const focaccia = await readFile(
    path.join(dir, "zh-tw", "fokaxia-hongbei-baifenbi", "index.html"),
    "utf8",
  );
  assert.match(focaccia, /佛卡夏烘焙百分比/);
  const root = await readFile(path.join(dir, "index.html"), "utf8");
  assert.match(root, /url=\/en\//);
});

async function htmlFiles(dir) {
  const found = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) found.push(...(await htmlFiles(full)));
    else if (entry.name.endsWith(".html")) found.push(full);
  }
  return found;
}

test("built site drops removed urls and keeps a footer mailto on every page", async () => {
  const dir = await mkdtemp(path.join(tmpdir(), "dough-"));
  await writeSite(dir);
  const rules = redirectRules();
  const redirects = await readFile(path.join(dir, "_redirects"), "utf8");
  const sitemap = await readFile(path.join(dir, "sitemap.xml"), "utf8");
  assert.match(redirects, /^\/ \/en\/ 302$/m);
  assert.equal(sitemap.split("<loc>").length - 1, pages.length * 3);
  for (const rule of rules) {
    assert.ok(redirects.includes(`${rule.from} ${rule.to} 301`), rule.from);
    assert.equal(sitemap.includes(rule.from), false, rule.from);
  }
  const removed = new Set(rules.map((rule) => rule.from));
  for (const file of await htmlFiles(dir)) {
    const rel = path.relative(dir, file);
    const html = await readFile(file, "utf8");
    for (const from of removed) {
      assert.equal(html.includes(`href="${from}"`), false, `${rel} -> ${from}`);
    }
    if (!/^(en|zh-cn|zh-tw)\//.test(rel)) continue;
    assert.match(html, /href="mailto:alan.chang198807@gmail.com"/, rel);
    assert.match(html, /rel="canonical" href="[^"]+"/, rel);
    assert.match(html, /hreflang="en"/, rel);
    assert.match(html, /hreflang="zh-CN"/, rel);
    assert.match(html, /hreflang="zh-TW"/, rel);
    const canonical = html.match(/rel="canonical" href="([^"]+)"/)[1];
    assert.equal(removed.has(new URL(canonical).pathname), false, rel);
    assert.match(html, /class="langs"/, rel);
    if (!/^(en|zh-cn|zh-tw)\/index\.html$/.test(rel)) assert.match(html, /class="crumb"/, rel);
  }
});

test("country sourdough page adds a method and photo without touching other pages", async () => {
  const country = pages.find((page) => page.id === "bread-country-sourdough");
  const plain = pages.find((page) => page.id === "bread-bialy");
  const expected = {
    en: "Detailed method",
    "zh-cn": "详细做法",
    "zh-tw": "詳細做法",
  };
  for (const lang of ["en", "zh-cn", "zh-tw"]) {
    const html = renderPage(country, lang);
    assert.ok(html.indexOf('id="calc"') < html.indexOf('class="method"'), lang);
    assert.ok(html.indexOf('class="method"') < html.indexOf('class="related"'), lang);
    assert.match(html, new RegExp(`<h2>${expected[lang]}</h2>`));
    assert.match(html, /src="\/assets\/country-sourdough\.webp"/);
    assert.match(html, /width="1200"/);
    assert.match(html, /height="1601"/);
    assert.match(html, /loading="lazy"/);
    assert.match(html, /alt="[^"]+"/);
    assert.match(html, /Chance Agrella/);
    assert.match(html, /href="https:\/\/www\.pexels\.com\/photo\/artisan-sourdough-bread-freshly-baked-33735154\/"/);
    assert.match(html, /375/);
    assert.match(html, /100 g|100 克/);
    assert.match(html, /id="download-pdf"/);
    assert.match(html, /id="pdf-error"/);
    assert.doesNotMatch(html, /src="[^"]*pdf-lib/);
    assert.doesNotMatch(html, /src="[^"]*noto-sans/);
    assert.equal(renderPage(plain, lang).includes("country-sourdough.webp"), false, lang);
    assert.equal(renderPage(plain, lang).includes("download-pdf"), false, lang);
    assert.equal(renderPage(plain, lang).includes(expected[lang]), false, lang);
  }
  assert.match(renderPage(country, "en"), /Download PDF/);
  assert.match(renderPage(country, "en"), /data-busy="Preparing PDF…"/);
  assert.match(renderPage(country, "en"), /doughcalc-country-sourdough-en-recipe\.pdf/);
  assert.match(renderPage(country, "en"), /75% hydration/);
  assert.doesNotMatch(renderPage(country, "en"), /75% water/);
  assert.match(renderPage(country, "en"), /PDF could not be created\. Please try again\./);
  assert.match(renderPage(country, "zh-cn"), /下载 PDF/);
  assert.match(renderPage(country, "zh-cn"), /data-busy="正在生成 PDF…"/);
  assert.match(renderPage(country, "zh-cn"), /doughcalc-xiangcun-suanzhong-zh-cn-recipe\.pdf/);
  assert.match(renderPage(country, "zh-cn"), /noto-sans-sc-subset\.ttf/);
  assert.match(renderPage(country, "zh-cn"), /PDF 生成失败，请再按一次。/);
  assert.match(renderPage(country, "zh-tw"), /下載 PDF/);
  assert.match(renderPage(country, "zh-tw"), /data-busy="正在產生 PDF…"/);
  assert.match(renderPage(country, "zh-tw"), /doughcalc-xiangcun-suanzhong-zh-tw-recipe\.pdf/);
  assert.match(renderPage(country, "zh-tw"), /noto-sans-tc-subset\.ttf/);
  assert.match(renderPage(country, "zh-tw"), /薄薄撒了粉/);
  assert.match(renderPage(country, "zh-tw"), /撒了粉的發酵籃/);
  assert.doesNotMatch(renderPage(country, "zh-tw"), /灑/);
  assert.match(renderPage(country, "zh-tw"), /PDF 產生失敗，請再按一次。/);
  for (const id of Object.keys(doughGuides)) {
    const page = pages.find((item) => item.id === id);
    const tw = renderPage(page, "zh-tw");
    const method = tw.slice(tw.indexOf('<section class="method">'), tw.indexOf('<section class="related">'));
    const visible = method.replace(/<[^>]+>/g, "").replace(/[A-Za-z]+/g, "").replace(/\d\.\d/g, "0");
    assert.equal(/[,.:;!?()]/.test(visible), false, `${id} ${visible}`);
    assert.match(tw, /id="download-pdf"/);
    assert.match(tw, /class="method"/);
  }
  const dir = await mkdtemp(path.join(tmpdir(), "dough-"));
  await writeSite(dir);
  const photo = await stat(path.join(dir, "assets", "country-sourdough.webp"));
  assert.ok(photo.size > 0 && photo.size < 150 * 1024, photo.size);
  const built = await readFile(path.join(dir, "zh-tw", "xiangcun-suanzhong", "index.html"), "utf8");
  assert.match(built, /詳細做法/);
  assert.match(built, /country-sourdough\.webp/);
});

test("every page discloses anonymous analytics and none claim there is none", async () => {
  const dir = await mkdtemp(path.join(tmpdir(), "dough-"));
  await writeSite(dir);
  const denied = [
    /no analytics/i,
    /without analytics/i,
    /does not use analytics/i,
    /doesn't use analytics/i,
    /do not use analytics/i,
    /不使用分析/,
    /没有分析/,
    /沒有分析/,
    /无分析/,
    /無分析/,
    /不追踪/,
    /不追蹤/,
    /不跟踪/,
  ];
  const robots = await readFile(path.join(dir, "robots.txt"), "utf8");
  const sitemap = await readFile(path.join(dir, "sitemap.xml"), "utf8");
  const redirects = await readFile(path.join(dir, "_redirects"), "utf8");
  for (const text of [robots, sitemap, redirects]) {
    assert.equal(text.includes("Cloudflare"), false);
    assert.equal(text.includes(ui.en.privacy), false);
  }
  const files = await htmlFiles(dir);
  assert.ok(files.some((file) => file.endsWith(`${path.sep}404.html`)));
  for (const file of files) {
    const rel = path.relative(dir, file);
    const html = await readFile(file, "utf8");
    for (const pattern of denied) {
      assert.equal(pattern.test(html), false, `${rel} ${pattern}`);
    }
    const head = html.slice(0, html.indexOf("</head>"));
    assert.equal(head.includes("Cloudflare"), false, rel);
    assert.equal(head.includes(ui.en.privacy), false, rel);
    if (rel === "404.html" || rel === "index.html") {
      assert.ok(html.includes(`<p class="privacy">${ui.en.privacy}</p>`), rel);
      assert.ok(html.includes(`<p class="privacy" lang="zh-CN">${ui["zh-cn"].privacy}</p>`), rel);
      assert.ok(html.includes(`<p class="privacy" lang="zh-TW">${ui["zh-tw"].privacy}</p>`), rel);
      continue;
    }
    const lang = rel.split(path.sep)[0];
    assert.ok(ui[lang], rel);
    assert.ok(html.includes(`<p class="privacy">${ui[lang].privacy}</p>`), rel);
  }
});
