import { SITE_URL } from "../site.config.mjs";
import { pages, hubGroups, relatedPages, featuredPages } from "./catalog.mjs";
import { renderButterInner } from "./butter-page.mjs";
import { renderCupsInner } from "./cups-page.mjs";
import { doughGuides } from "./data/dough-guides.mjs";
import { effectiveHydration, fillAmounts, formatAmount, recipeFor } from "./formula.mjs";
import { HTML_LANG, HREFLANG, LANGS, OG_LOCALE, ui } from "./i18n.mjs";

export function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function pagePath(lang, slug) {
  if (!slug) return `/${lang}/`;
  return `/${lang}/${slug}/`;
}

export function absoluteUrl(pathname) {
  return `${SITE_URL}${pathname}`;
}

function alternates(page) {
  const links = LANGS.map((lang) => ({
    hreflang: HREFLANG[lang],
    href: absoluteUrl(pagePath(lang, page.slug[lang])),
  }));
  links.push({
    hreflang: "x-default",
    href: absoluteUrl(pagePath("en", page.slug.en)),
  });
  return links;
}

function shareMeta() {
  const image = absoluteUrl("/og.png");
  return `<meta property="og:image" content="${escapeHtml(image)}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="${escapeHtml(image)}">`;
}

function head({ lang, title, description, canonical, alts, robots }) {
  const altTags = alts
    .map(
      (alt) =>
        `<link rel="alternate" hreflang="${escapeHtml(alt.hreflang)}" href="${escapeHtml(alt.href)}">`,
    )
    .join("");
  const ogAlts = LANGS.filter((item) => item !== lang)
    .map(
      (item) =>
        `<meta property="og:locale:alternate" content="${OG_LOCALE[item]}">`,
    )
    .join("");
  const robotsTag = robots ? `<meta name="robots" content="${robots}">` : "";
  return `<!DOCTYPE html>
<html lang="${HTML_LANG[lang]}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(description)}">
<link rel="canonical" href="${escapeHtml(canonical)}">
${altTags}
<meta property="og:title" content="${escapeHtml(title)}">
<meta property="og:description" content="${escapeHtml(description)}">
<meta property="og:url" content="${escapeHtml(canonical)}">
<meta property="og:type" content="website">
<meta property="og:locale" content="${OG_LOCALE[lang]}">
${ogAlts}
${shareMeta()}
${robotsTag}
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="/assets/site.css">
</head>`;
}

function langSwitch(page, current) {
  const items = [
    ["en", "EN"],
    ["zh-cn", "简体"],
    ["zh-tw", "繁體"],
  ];
  const links = items
    .map(([lang, label]) => {
      const href = pagePath(lang, page.slug[lang]);
      const currentAttr = lang === current ? ` aria-current="page"` : "";
      return `<a href="${href}" hreflang="${HREFLANG[lang]}" lang="${HTML_LANG[lang]}"${currentAttr}>${label}</a>`;
    })
    .join("");
  return `<nav class="langs" aria-label="${escapeHtml(ui[current].langLabel)}">${links}</nav>`;
}

function header(page, lang) {
  const home = pagePath(lang, "");
  return `<a class="skip" href="#main">${escapeHtml(ui[lang].skip)}</a>
<header>
<a class="brand" href="${home}">${escapeHtml(ui[lang].siteName)}</a>
${langSwitch(page, lang)}
</header>`;
}

function footer(lang) {
  const homeHref = pagePath(lang, "");
  const cups = pages.find((page) => page.id === "cups");
  const anchors = [
    `<a href="${homeHref}">${escapeHtml(ui[lang].siteName)}</a>`,
    ...["hydration", "pizza", "bread", "starter", "salt"].map((category) => {
      const hub = pages.find((page) => page.id === `hub-${category}`);
      return `<a href="${pagePath(lang, hub.slug[lang])}">${escapeHtml(ui[lang].categories[category])}</a>`;
    }),
    `<a href="${pagePath(lang, cups.slug[lang])}">${escapeHtml(ui[lang].cupsNav)}</a>`,
    `<a href="mailto:alan.chang198807@gmail.com">${escapeHtml(ui[lang].feedback)}</a>`,
  ];
  return `<footer>
<nav aria-label="${escapeHtml(ui[lang].footerNav)}">${anchors.join("")}</nav>
<p>${escapeHtml(ui[lang].footer)}</p>
<p class="privacy">${escapeHtml(ui[lang].privacy)}</p>
</footer>`;
}

function crumb(page, lang) {
  if (page.kind === "home") return "";
  const home = `<a href="${pagePath(lang, "")}">${escapeHtml(ui[lang].siteName)}</a>`;
  if (page.kind === "hub" || page.kind === "convert" || page.kind === "butter") {
    return `<nav class="crumb" aria-label="${escapeHtml(ui[lang].crumbLabel)}">${home}</nav>`;
  }
  const hub = pages.find((item) => item.id === `hub-${page.category}`);
  const middle = `<a href="${pagePath(lang, hub.slug[lang])}">${escapeHtml(ui[lang].categories[page.category])}</a>`;
  return `<nav class="crumb" aria-label="${escapeHtml(ui[lang].crumbLabel)}">${home} / ${middle}</nav>`;
}

function linkList(items, lang) {
  return `<ul class="link-list">${items
    .map(
      (item) =>
        `<li><a href="${pagePath(lang, item.slug[lang])}">${escapeHtml(item.title[lang])}</a></li>`,
    )
    .join("")}</ul>`;
}

function field(name, label, unit, value, hint) {
  const hintHtml = hint ? `<span class="hint">${escapeHtml(hint)}</span>` : "";
  const unitHtml = unit ? ` <span class="unit">${escapeHtml(unit)}</span>` : "";
  return `<label class="field"><span class="label">${escapeHtml(label)}${unitHtml}</span><input name="${name}" inputmode="decimal" min="0" step="any" value="${escapeHtml(value)}">${hintHtml}</label>`;
}

function calculator(page, lang) {
  const copy = ui[lang];
  const preset = page.preset;
  const recipe = recipeFor(preset);
  const flourShown = preset.mode === "balls" ? formatAmount(recipe.flour) : String(preset.flour);
  const rows = ["flour", "water", "starter", "salt", "yeast", "total"]
    .map((key) => {
      return `<div><dt>${escapeHtml(copy[key])}</dt><dd id="out-${key}">${formatAmount(recipe[key])} ${escapeHtml(copy.grams)}</dd></div>`;
    })
    .join("");
  const labels = {
    title: page.h1[lang],
    flour: copy.flour,
    water: copy.water,
    starter: copy.starter,
    salt: copy.salt,
    yeast: copy.yeast,
    total: copy.total,
    grams: copy.grams,
    effective: copy.effective,
    copied: copy.copied,
    copyFail: copy.copyFail,
  };
  const json = JSON.stringify(labels).replaceAll("<", "\\u003c");
  return `<form id="calc" autocomplete="off">
<fieldset class="modes">
<legend>${escapeHtml(copy.modeLabel)}</legend>
<label><input type="radio" name="mode" value="flour"${preset.mode === "flour" ? " checked" : ""}> ${escapeHtml(copy.modeFlour)}</label>
<label><input type="radio" name="mode" value="balls"${preset.mode === "balls" ? " checked" : ""}> ${escapeHtml(copy.modeBalls)}</label>
</fieldset>
<div class="fields" data-panel="flour"${preset.mode === "flour" ? "" : " hidden"}>
${field("flour", copy.flour, copy.grams, flourShown)}
</div>
<div class="fields grid-2" data-panel="balls"${preset.mode === "balls" ? "" : " hidden"}>
${field("balls", copy.balls, "", String(preset.balls))}
${field("gramsPerBall", copy.perBall, copy.grams, String(preset.gramsPerBall))}
</div>
<div class="fields grid-2">
${field("hydration", copy.hydration, "%", String(preset.hydration))}
${field("starter", copy.starter, "%", String(preset.starter))}
${field("salt", copy.salt, "%", String(preset.salt))}
${field("yeast", copy.yeast, "%", String(preset.yeast), copy.yeastHint)}
</div>
</form>
<section class="card result" aria-live="polite">
<h2>${escapeHtml(copy.result)}</h2>
<span id="form-error" class="error" role="alert" hidden>${escapeHtml(copy.error)}</span>
<dl>${rows}</dl>
<p class="effective">${escapeHtml(copy.effective)} <strong id="out-effective">${formatAmount(effectiveHydration(recipe))}%</strong></p>
<p class="convention">${escapeHtml(copy.convention)}</p>
<div class="actions">
<button type="button" id="copy">${escapeHtml(copy.copy)}</button>
<button type="button" id="print" class="secondary">${escapeHtml(copy.print)}</button>${pdfButton(page, lang)}
</div>${pdfFail(page, lang)}
<textarea id="recipe-text" hidden readonly></textarea>
</section>
<script type="application/json" id="labels">${json}</script>${pdfMeta(page, lang)}
<script type="module" src="/assets/calc.js"></script>`;
}

const PDF_FONT = {
  en: "/assets/fonts/noto-sans-sc-subset.ttf",
  "zh-cn": "/assets/fonts/noto-sans-sc-subset.ttf",
  "zh-tw": "/assets/fonts/noto-sans-tc-subset.ttf",
};

const PDF_BUTTON = {
  en: {
    label: "Download PDF",
    loading: "Loading…",
    busy: "Preparing PDF…",
    fail: "PDF could not be created. Please try again.",
  },
  "zh-cn": { label: "下载 PDF", loading: "正在加载…", busy: "正在生成 PDF…", fail: "PDF 生成失败，请再按一次。" },
  "zh-tw": { label: "下載 PDF", loading: "正在載入…", busy: "正在產生 PDF…", fail: "PDF 產生失敗，請再按一次。" },
};

const COUNTRY_PDF_FILENAME = {
  en: "doughcalc-country-sourdough-en-recipe.pdf",
  "zh-cn": "doughcalc-xiangcun-suanzhong-zh-cn-recipe.pdf",
  "zh-tw": "doughcalc-xiangcun-suanzhong-zh-tw-recipe.pdf",
};

function methodPayload(page, method) {
  const recipe = recipeFor(page.preset);
  const stepPayload = (step) => {
    const source = step.pdfBody ?? step.body;
    const body = fillAmounts(source, recipe, page.preset);
    return source.includes("{{") ? { title: step.title, body, bodyTemplate: source } : { title: step.title, body };
  };
  const leadSource = method.pdfLead ?? method.lead;
  const lead = fillAmounts(leadSource, recipe, page.preset);
  return {
    heading: method.heading,
    lead,
    ...(leadSource.includes("{{") ? { leadTemplate: leadSource } : {}),
    steps: method.steps.map(stepPayload),
  };
}

export function pdfFilename(page, lang) {
  if (page.id === "bread-country-sourdough") return COUNTRY_PDF_FILENAME[lang];
  return `doughcalc-${page.slug[lang]}-${lang}-recipe.pdf`;
}

export function pdfPayload(page, lang) {
  const guide = doughGuides[page.id];
  if (!guide) return null;
  const copy = ui[lang];
  const method = guide[lang];
  return {
    title: page.h1[lang],
    url: absoluteUrl(pagePath(lang, page.slug[lang])),
    filename: pdfFilename(page, lang),
    lang: HTML_LANG[lang],
    fontUrl: PDF_FONT[lang],
    labels: {
      result: copy.result,
      flour: copy.flour,
      water: copy.water,
      starter: copy.starter,
      salt: copy.salt,
      yeast: copy.yeast,
      total: copy.total,
      grams: copy.grams,
      effective: copy.effective,
      hydration: copy.hydration,
      modeFlour: copy.modeFlour,
      modeBalls: copy.modeBalls,
      balls: copy.balls,
      perBall: copy.perBall,
    },
    method: methodPayload(page, method),
    messages: {
      label: PDF_BUTTON[lang].label,
      busy: PDF_BUTTON[lang].busy,
      fail: PDF_BUTTON[lang].fail,
    },
  };
}

function pdfButton(page, lang) {
  if (!doughGuides[page.id]) return "";
  const copy = PDF_BUTTON[lang];
  return `\n<button type="button" id="download-pdf" data-label="${escapeHtml(copy.label)}" data-loading="${escapeHtml(copy.loading)}" data-busy="${escapeHtml(copy.busy)}">${escapeHtml(copy.label)}</button>
<script>
(function () {
  var button = document.getElementById("download-pdf");
  if (!button) return;
  button.addEventListener("click", function () {
    if (window.__pdfReady || window.__pdfPending) return;
    window.__pdfPending = true;
    button.disabled = true;
    button.textContent = button.getAttribute("data-loading");
  });
})();
</script>`;
}

function pdfFail(page, lang) {
  if (!doughGuides[page.id]) return "";
  return `\n<p id="pdf-error" class="error" role="alert" hidden>${escapeHtml(PDF_BUTTON[lang].fail)}</p>`;
}

function pdfMeta(page, lang) {
  const payload = pdfPayload(page, lang);
  if (!payload) return "";
  const json = JSON.stringify(payload).replaceAll("<", "\\u003c");
  return `\n<script type="application/json" id="pdf-meta">${json}</script>`;
}

const WEIGH_RE = {
  en: /\b(measuring cups|measuring cup|kitchen scales|kitchen scale|weigh out|weighing|weighed|weighs|weigh)\b/i,
  "zh-cn": /量杯|称重|称出|称准|电子秤|厨房秤/,
  "zh-tw": /量杯|秤重|秤出|秤準|電子秤|廚房秤/,
};

function linkWeigh(escaped, lang, weigh) {
  if (!weigh || weigh.done) return escaped;
  let hit = false;
  const next = escaped.replace(WEIGH_RE[lang], (word) => {
    hit = true;
    return `<a href="${weigh.href}">${word}</a>`;
  });
  if (hit) weigh.done = true;
  return next;
}

function adjustSection(page, lang, weigh) {
  const block = page.adjust;
  if (!block) return "";
  const country = pages.find((item) => item.id === "bread-country-sourdough");
  const link = `<a href="${escapeHtml(pagePath(lang, country.slug[lang]))}">${escapeHtml(block.countryLink[lang])}</a>`;
  const paragraphs = block.paragraphs[lang]
    .map((paragraph) => `<p>${linkWeigh(escapeHtml(paragraph).replaceAll("{country}", link), lang, weigh)}</p>`)
    .join("");
  return `\n<section class="adjust"><h2>${escapeHtml(block.heading[lang])}</h2>${paragraphs}</section>`;
}

const FIGURE_LABEL = {
  en: "For illustration only",
  "zh-cn": "示意图",
  "zh-tw": "示意圖",
};

function methodText(template, recipe, preset, lang, weigh) {
  const filled = linkWeigh(escapeHtml(fillAmounts(template, recipe, preset).trim()), lang, weigh);
  if (!String(template).includes("{{")) return filled;
  return `<span data-template="${escapeHtml(template)}">${filled}</span>`;
}

function figureLabel(photo, lang) {
  if (!photo.illustration) return "";
  return lang === "en" ? `${escapeHtml(FIGURE_LABEL.en)}. ` : `${escapeHtml(FIGURE_LABEL[lang])}。`;
}

function methodSection(page, lang, weigh) {
  const guide = doughGuides[page.id];
  if (!guide) return "";
  const copy = guide[lang];
  const recipe = recipeFor(page.preset);
  const steps = copy.steps
    .filter((step) => fillAmounts(step.body, recipe, page.preset).trim())
    .map(
      (step) =>
        `<li><strong>${escapeHtml(step.title)}</strong> ${methodText(step.body, recipe, page.preset, lang, weigh)}</li>`,
    )
    .join("");
  const photo = guide.photo;
  const license = photo.licenseUrl
    ? `${escapeHtml(copy.licenseBefore || "")}<a href="${photo.licenseUrl}">${escapeHtml(copy.licenseLabel || "")}</a>${escapeHtml(copy.licenseAfter || "")}`
    : escapeHtml(copy.licenseAfter || "");
  const caption = copy.caption ? `${methodText(copy.caption, recipe, page.preset, lang, weigh)} ` : "";
  return `<section class="method">
<h2>${escapeHtml(copy.heading)}</h2>
<p>${methodText(copy.lead, recipe, page.preset, lang, weigh)}</p>
<ol>${steps}</ol>
<figure>
<img src="${photo.src}" width="${photo.width}" height="${photo.height}" alt="${escapeHtml(copy.alt)}"${photo.tall ? ' class="tall"' : ""} loading="lazy">
<figcaption>${figureLabel(photo, lang)}${caption}${escapeHtml(copy.creditBefore)}<a href="${photo.pageUrl}">${escapeHtml(copy.creditLink)}</a>${license}</figcaption>
</figure>
</section>`;
}

function convertLinks() {
  return ["home", "hub-hydration", "hub-bread", "hub-pizza"].map((id) => pages.find((page) => page.id === id));
}

function homeToolLinks(lang) {
  return ["cups", "butter"]
    .map((id) => pages.find((page) => page.id === id))
    .map((page) => `<p><a href="${pagePath(lang, page.slug[lang])}">${escapeHtml(page.h1[lang])}</a></p>`)
    .join("");
}

function butterRelated(lang) {
  const cups = pages.find((page) => page.id === "cups");
  const home = pages.find((page) => page.id === "home");
  const items = [
    [cups, cups.h1[lang]],
    [home, home.title[lang]],
  ];
  return `<ul class="link-list">${items
    .map(([page, label]) => `<li><a href="${pagePath(lang, page.slug[lang])}">${escapeHtml(label)}</a></li>`)
    .join("")}</ul>`;
}

function relatedBlock(page, lang) {
  if (page.kind === "butter") {
    return `<section class="related"><h2>${escapeHtml(ui[lang].related)}</h2>${butterRelated(lang)}</section>`;
  }
  const items = page.kind === "home" ? featuredPages() : page.kind === "convert" ? convertLinks() : relatedPages(page);
  if (!items.length) return "";
  const heading = page.kind === "home" ? ui[lang].featured : ui[lang].related;
  const butter = pages.find((item) => item.id === "butter");
  const extra =
    page.kind === "home"
      ? homeToolLinks(lang)
      : page.kind === "convert"
        ? `<p><a href="${pagePath(lang, butter.slug[lang])}">${escapeHtml(butter.h1[lang])}</a></p>`
        : "";
  return `<section class="related"><h2>${escapeHtml(heading)}</h2>${linkList(items, lang)}${extra}</section>`;
}

function described(page, lang) {
  const text = page.description[lang];
  if (!page.preset || !text.includes("{{")) return text;
  return fillAmounts(text, recipeFor(page.preset), page.preset);
}

function linkedIntro(page, lang, weigh) {
  const recipe = page.preset ? recipeFor(page.preset) : null;
  return page.intro[lang].map((paragraph) => {
    const live = recipe && paragraph.includes("{{");
    const text = live ? fillAmounts(paragraph, recipe, page.preset) : paragraph;
    const inner = linkWeigh(escapeHtml(text), lang, weigh);
    const body = live ? `<span data-template="${escapeHtml(paragraph)}">${inner}</span>` : inner;
    return `<p>${body}</p>`;
  }).join("");
}

function article(page, lang, inner, introHtml) {
  const mainClass =
    page.kind === "butter" ? ' class="convert butter"' : page.kind === "convert" ? ' class="convert"' : "";
  return `${header(page, lang)}
<main id="main"${mainClass}>
${crumb(page, lang)}
<h1>${escapeHtml(page.h1[lang])}</h1>
${introHtml}
${inner}
${relatedBlock(page, lang)}
</main>
${footer(lang)}`;
}

export function renderPage(page, lang) {
  const canonical = absoluteUrl(pagePath(lang, page.slug[lang]));
  const alts = alternates(page);
  const cups = pages.find((item) => item.id === "cups");
  const weigh = { done: page.kind === "convert" || page.kind === "butter", href: pagePath(lang, cups.slug[lang]) };
  const introHtml = linkedIntro(page, lang, weigh);
  let inner = "";
  if (page.kind === "convert") {
    inner = renderCupsInner(lang);
  } else if (page.kind === "butter") {
    inner = renderButterInner(lang);
  } else if (page.kind === "hub") {
    const groups = hubGroups(page, lang)
      .filter((group) => group.pages.length > 0)
      .map((group) => {
        const heading = group.title ? `<h2>${escapeHtml(group.title)}</h2>` : "";
        return `<section class="related">${heading}${linkList(group.pages, lang)}</section>`;
      })
      .join("");
    inner = `${page.preset ? calculator(page, lang) : ""}${groups}`;
  } else {
    inner = `${calculator(page, lang)}${adjustSection(page, lang, weigh)}${methodSection(page, lang, weigh)}`;
  }
  const html = `${head({
    lang,
    title: page.title[lang],
    description: described(page, lang),
    canonical,
    alts,
  })}
<body>
${article(page, lang, inner, introHtml)}
</body>
</html>
`;
  assertNoRawTemplates(html, `${page.id} ${lang}`);
  return html;
}

export function assertNoRawTemplates(html, label) {
  const headEnd = html.indexOf("</head>");
  const headHtml = headEnd >= 0 ? html.slice(0, headEnd) : html;
  if (headHtml.includes("{{")) throw new Error(`raw template in head ${label}`);
  const body = html.slice(html.indexOf("<body"));
  const visible = body
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, "");
  if (visible.includes("{{")) throw new Error(`raw template in text ${label}`);
}

export function renderRoot() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(ui.en.siteName)}</title>
<link rel="canonical" href="${absoluteUrl("/en/")}">
<meta http-equiv="refresh" content="0; url=/en/">
<meta name="robots" content="noindex">
${shareMeta()}
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="/assets/site.css">
</head>
<body>
<main id="main">
<p><a href="/en/">English dough calculator</a></p>
<p><a href="/zh-cn/" lang="zh-CN">简体中文面团计算器</a></p>
<p><a href="/zh-tw/" lang="zh-TW">繁體中文麵團計算器</a></p>
</main>
${sharedPrivacyFooter()}
</body>
</html>
`;
}

function sharedPrivacyFooter() {
  const notes = LANGS.map((lang) => {
    const langAttr = lang === "en" ? "" : ` lang="${HTML_LANG[lang]}"`;
    return `<p class="privacy"${langAttr}>${escapeHtml(ui[lang].privacy)}</p>`;
  }).join("\n");
  return `<footer>
${notes}
</footer>`;
}

export function renderNotFound() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(ui.en.notFoundTitle)}</title>
<meta name="robots" content="noindex">
${shareMeta()}
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="/assets/site.css">
</head>
<body>
<main id="main">
<h1>${escapeHtml(ui.en.notFoundTitle)}</h1>
<p>${escapeHtml(ui.en.notFoundBody)}</p>
<p><a href="/en/">English dough calculator</a></p>
<p><a href="/zh-cn/" lang="zh-CN">简体中文面团计算器</a></p>
<p><a href="/zh-tw/" lang="zh-TW">繁體中文麵團計算器</a></p>
</main>
${sharedPrivacyFooter()}
</body>
</html>
`;
}

export function renderSitemap() {
  const urls = [];
  for (const page of pages) {
    for (const lang of LANGS) {
      const loc = absoluteUrl(pagePath(lang, page.slug[lang]));
      const links = alternates(page)
        .map(
          (alt) =>
            `    <xhtml:link rel="alternate" hreflang="${escapeHtml(alt.hreflang)}" href="${escapeHtml(alt.href)}"/>`,
        )
        .join("\n");
      urls.push(`  <url>\n    <loc>${escapeHtml(loc)}</loc>\n${links}\n  </url>`);
    }
  }
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join("\n")}
</urlset>
`;
}

export function renderRobots() {
  return `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;
}
