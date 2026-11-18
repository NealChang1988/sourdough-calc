import { SITE_URL } from "../site.config.mjs";
import { pages, hubGroups, relatedPages, featuredPages } from "./catalog.mjs";
import { effectiveHydration, formatAmount, recipeFor } from "./formula.mjs";
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
  const anchors = [
    `<a href="${homeHref}">${escapeHtml(ui[lang].siteName)}</a>`,
    ...["hydration", "pizza", "bread", "starter", "salt"].map((category) => {
      const hub = pages.find((page) => page.id === `hub-${category}`);
      return `<a href="${pagePath(lang, hub.slug[lang])}">${escapeHtml(ui[lang].categories[category])}</a>`;
    }),
    `<a href="mailto:alan.chang198807@gmail.com">${escapeHtml(ui[lang].feedback)}</a>`,
  ];
  return `<footer>
<nav aria-label="${escapeHtml(ui[lang].footerNav)}">${anchors.join("")}</nav>
<p>${escapeHtml(ui[lang].footer)}</p>
</footer>`;
}

function crumb(page, lang) {
  if (page.kind === "home") return "";
  const home = `<a href="${pagePath(lang, "")}">${escapeHtml(ui[lang].siteName)}</a>`;
  if (page.kind === "hub") {
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
<button type="button" id="print" class="secondary">${escapeHtml(copy.print)}</button>
</div>
<textarea id="recipe-text" hidden readonly></textarea>
</section>
<script type="application/json" id="labels">${json}</script>
<script type="module" src="/assets/calc.js"></script>`;
}

function relatedBlock(page, lang) {
  const items = page.kind === "home" ? featuredPages() : relatedPages(page);
  if (!items.length) return "";
  const heading = page.kind === "home" ? ui[lang].featured : ui[lang].related;
  return `<section class="related"><h2>${escapeHtml(heading)}</h2>${linkList(items, lang)}</section>`;
}

function article(page, lang, inner) {
  const paragraphs = page.intro[lang].map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("");
  return `${header(page, lang)}
<main id="main">
${crumb(page, lang)}
<h1>${escapeHtml(page.h1[lang])}</h1>
${paragraphs}
${inner}
${relatedBlock(page, lang)}
</main>
${footer(lang)}`;
}

export function renderPage(page, lang) {
  const canonical = absoluteUrl(pagePath(lang, page.slug[lang]));
  const alts = alternates(page);
  let inner = "";
  if (page.kind === "hub") {
    const groups = hubGroups(page, lang)
      .filter((group) => group.pages.length > 0)
      .map((group) => {
        const heading = group.title ? `<h2>${escapeHtml(group.title)}</h2>` : "";
        return `<section class="related">${heading}${linkList(group.pages, lang)}</section>`;
      })
      .join("");
    inner = `${page.preset ? calculator(page, lang) : ""}${groups}`;
  } else {
    inner = calculator(page, lang);
  }
  return `${head({
    lang,
    title: page.title[lang],
    description: page.description[lang],
    canonical,
    alts,
  })}
<body>
${article(page, lang, inner)}
</body>
</html>
`;
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
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="/assets/site.css">
</head>
<body>
<main id="main">
<p><a href="/en/">English dough calculator</a></p>
<p><a href="/zh-cn/" lang="zh-CN">简体中文面团计算器</a></p>
<p><a href="/zh-tw/" lang="zh-TW">繁體中文麵團計算器</a></p>
</main>
</body>
</html>
`;
}

export function renderNotFound() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(ui.en.notFoundTitle)}</title>
<meta name="robots" content="noindex">
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
