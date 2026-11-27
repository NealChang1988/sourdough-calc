import { breadAbout } from "./data/bread-about.mjs";
import { breads } from "./data/breads.mjs";
import { hydrationCopy, KEPT_HYDRATION } from "./data/hydration-notes.mjs";
import { OLD_BALL_COUNTS, pizzaStyles } from "./data/pizza.mjs";
import { FAMILIES, LANGS, ui } from "./i18n.mjs";

const FEATURED_IDS = [
  "hydration-75",
  "hydration-70",
  "pizza-neapolitan",
  "bread-focaccia",
  "bread-bagel",
  "bread-country-sourdough",
];

function homePage() {
  const title = {};
  const h1 = {};
  const description = {};
  const intro = {};
  for (const lang of LANGS) {
    title[lang] = ui[lang].home.title;
    h1[lang] = ui[lang].home.h1;
    description[lang] = ui[lang].home.description;
    intro[lang] = ui[lang].home.intro;
  }
  return {
    id: "home",
    kind: "home",
    category: "home",
    slug: { en: "", "zh-cn": "", "zh-tw": "" },
    title,
    h1,
    description,
    intro,
    preset: {
      mode: "flour",
      flour: 500,
      hydration: 75,
      starter: 20,
      salt: 2,
      yeast: 0,
      balls: 4,
      gramsPerBall: 250,
    },
  };
}

function hubPages() {
  return ["hydration", "pizza", "bread", "starter", "salt"].map((category) => {
    const slug = {};
    const title = {};
    const h1 = {};
    const description = {};
    const intro = {};
    for (const lang of LANGS) {
      const hub = ui[lang].hubs[category];
      slug[lang] = hub.slug;
      title[lang] = hub.title;
      h1[lang] = hub.h1;
      description[lang] = hub.description;
      intro[lang] = [hub.intro];
    }
    return {
      id: `hub-${category}`,
      kind: "hub",
      category,
      slug,
      title,
      h1,
      description,
      intro,
      preset:
        category === "starter"
          ? { mode: "flour", flour: 500, hydration: 75, starter: 20, salt: 2, yeast: 0, balls: 4, gramsPerBall: 250 }
          : category === "salt"
            ? { mode: "flour", flour: 500, hydration: 70, starter: 20, salt: 2, yeast: 0, balls: 4, gramsPerBall: 250 }
            : null,
    };
  });
}

function hydrationSlug(lang, n) {
  if (lang === "en") return `${n}-hydration-sourdough-calculator`;
  if (lang === "zh-cn") return `${n}-shuihe-suanzhong-jisuanqi`;
  return `${n}-shuihe-suan-zhong-jisuan`;
}

export function nearestHydration(n) {
  return KEPT_HYDRATION.reduce((best, candidate) => {
    const bestDist = Math.abs(n - best);
    const dist = Math.abs(n - candidate);
    if (dist < bestDist || (dist === bestDist && candidate < best)) return candidate;
    return best;
  });
}

function hydrationPages() {
  return KEPT_HYDRATION.map((n) => {
    const copy = hydrationCopy[n];
    const title = {
      en: `${n}% Hydration Sourdough Calculator`,
      "zh-cn": `${n}% 水合酸种计算器`,
      "zh-tw": `${n}% 水合酸種計算`,
    };
    return {
      id: `hydration-${n}`,
      kind: "tool",
      category: "hydration",
      slug: {
        en: hydrationSlug("en", n),
        "zh-cn": hydrationSlug("zh-cn", n),
        "zh-tw": hydrationSlug("zh-tw", n),
      },
      title,
      h1: title,
      description: copy.description,
      intro: {
        en: [copy.intro.en],
        "zh-cn": [copy.intro["zh-cn"]],
        "zh-tw": [copy.intro["zh-tw"]],
      },
      preset: {
        mode: "flour",
        flour: 500,
        hydration: n,
        starter: 20,
        salt: 2,
        yeast: 0,
        balls: 4,
        gramsPerBall: 250,
      },
      adjust: copy.adjust ?? null,
      neighbor: n,
    };
  });
}

function pizzaSlug(lang, style) {
  return lang === "en" ? style.slug.en : style.slug.zh;
}

function pizzaBallSlug(lang, style, balls) {
  if (lang === "en") return `${style.slug.en}-${balls}-${balls === 1 ? "ball" : "balls"}`;
  return `${style.slug.zh}-${balls}-qiu`;
}

function pizzaPages() {
  return pizzaStyles.map((style) => {
    const title = {
      en: style.name.en,
      "zh-cn": style.name["zh-cn"],
      "zh-tw": style.name["zh-tw"],
    };
    const intro = {};
    for (const lang of LANGS) {
      const gap = lang === "en" ? " " : "";
      intro[lang] = [`${style.method[lang]}${gap}${style.ballsNote[lang]}`];
    }
    return {
      id: `pizza-${style.id}`,
      kind: "tool",
      category: "pizza",
      styleId: style.id,
      slug: {
        en: pizzaSlug("en", style),
        "zh-cn": pizzaSlug("zh-cn", style),
        "zh-tw": pizzaSlug("zh-tw", style),
      },
      title,
      h1: title,
      description: style.about,
      intro,
      preset: {
        mode: "balls",
        flour: 500,
        hydration: style.hydration,
        starter: style.starter,
        salt: style.salt,
        yeast: style.yeast,
        balls: 4,
        gramsPerBall: style.ballGrams,
      },
    };
  });
}

const BALL_PRESET = {
  ciabatta: [4, 228],
  brioche: [1, 614],
  "rye-loaf": [1, 825],
  pita: [8, 82],
  "dinner-rolls": [10, 84],
  "whole-wheat-loaf": [1, 896],
  "english-muffins": [8, 82],
  "cinnamon-rolls": [8, 101],
  "hamburger-buns": [9, 92],
  croissant: [8, 97],
  "no-knead": [1, 902],
  challah: [1, 792],
  "soft-pretzels": [8, 100],
  naan: [4, 168],
  "multigrain-loaf": [1, 907],
  "sourdough-bagels": [8, 107.5],
  "skillet-bread": [1, 684],
  "garlic-knots": [20, 33.34],
  calzone: [4, 206],
  "kaiser-rolls": [10, 80.45],
  breadsticks: [16, 41.2],
  lavash: [4, 153.9],
  "rye-sourdough": [1, 977.4],
  bialy: [10, 79.3],
  "hoagie-rolls": [8, 103],
  "pane-toscano": [1, 960],
  "spelt-sourdough": [1, 980],
  "sandwich-loaf": [1, 840],
  "hot-dog-buns": [10, 82.55],
  "pullman-loaf": [1, 845],
  "sourdough-focaccia": [1, 1012.5],
  "whole-wheat-sourdough": [1, 1046],
  "overnight-white": [1, 871.3],
  "soft-rolls": [12, 70],
  "sourdough-sandwich": [1, 940],
  "sourdough-baguette": [4, 237.5],
  "seeded-sourdough": [1, 1021],
  "high-hydration-sourdough": [1, 1035],
  "olive-sourdough": [1, 970],
  miche: [1, 1950],
  "sourdough-ciabatta": [4, 255.3],
  "poolish-baguette": [4, 254],
  "low-hydration-sourdough": [1, 920],
  "pain-de-campagne": [1, 995],
  "sourdough-rolls": [8, 117.5],
  "sourdough-pizza": [5, 192.5],
  "hard-rolls": [8, 100.5],
  batard: [1, 980],
  "sourdough-pita": [8, 93.4],
  ficelle: [4, 172.8],
  schiacciata: [1, 863],
  "pane-pugliese": [1, 990],
  filone: [1, 853.5],
  "spelt-loaf": [1, 864],
};

// New breads stay out of older pages' related lists so those pages keep the same four links.
const ADDED_BREADS = new Set(["bread-croissant"]);

function breadPages() {
  return breads.map((item) => {
    const title = {
      en: `${item.name.en} Baker's Percentage`,
      "zh-cn": `${item.name["zh-cn"]}烘焙百分比`,
      "zh-tw": `${item.name["zh-tw"]}烘焙百分比`,
    };
    const about = breadAbout[item.id];
    if (!about?.en || !about["zh-cn"] || !about["zh-tw"]) throw new Error(`missing bread description ${item.id}`);
    const description = { en: about.en, "zh-cn": about["zh-cn"], "zh-tw": about["zh-tw"] };
    const intro = {
      en: [about.en],
      "zh-cn": [about["zh-cn"]],
      "zh-tw": [about["zh-tw"]],
    };
    return {
      id: `bread-${item.id}`,
      kind: "tool",
      category: "bread",
      family: item.family,
      slug: {
        en: item.slug.en,
        "zh-cn": item.slug.zh,
        "zh-tw": item.slug.zhTw || item.slug.zh,
      },
      title,
      h1: title,
      description,
      intro,
      preset: {
        mode: "flour",
        flour: item.flour,
        hydration: item.hydration,
        starter: item.starter,
        salt: item.salt,
        yeast: item.yeast,
        balls: BALL_PRESET[item.id]?.[0] ?? 4,
        gramsPerBall: BALL_PRESET[item.id]?.[1] ?? 250,
      },
    };
  });
}

function cupsPage() {
  const title = {
    en: "Grams to Cups Converter",
    "zh-cn": "克转杯换算器",
    "zh-tw": "克轉杯換算器",
  };
  return {
    id: "cups",
    kind: "convert",
    category: "convert",
    slug: {
      en: "grams-to-cups-converter",
      "zh-cn": "ke-zhuan-bei-huansuanqi",
      "zh-tw": "ke-zhuan-bei-huansuan",
    },
    title,
    h1: title,
    description: {
      en: "US, metric, and UK cup weights for flour, sugar, butter, water, and other baking ingredients.",
      "zh-cn": "用美制杯、公制杯或英制杯，换算面粉、细砂糖、黄油、水和其它烘焙食材。",
      "zh-tw": "用美制杯、公制杯或英制杯，換算麵粉、細砂糖、奶油、水和其它烘焙食材。",
    },
    intro: {
      en: [
        "Convert grams and cups for one baking ingredient, including spoons, milliliters, and ounces.",
      ],
      "zh-cn": ["把单一种烘焙食材从克换算成量杯，或从量杯换算成克，并同时列出汤匙、茶匙、毫升和重量盎司。"],
      "zh-tw": ["把單一種類的烘焙食材從克換算成量杯，或從量杯換算成克，並一併列出湯匙、茶匙、毫升與重量盎司。"],
    },
  };
}

function assertPages(list) {
  const ids = new Set();
  const slugs = { en: new Set(), "zh-cn": new Set(), "zh-tw": new Set() };
  const titles = { en: new Set(), "zh-cn": new Set(), "zh-tw": new Set() };
  for (const page of list) {
    if (ids.has(page.id)) throw new Error(`duplicate id ${page.id}`);
    ids.add(page.id);
    for (const lang of LANGS) {
      const slug = page.slug[lang];
      if (!/^[a-z0-9-]*$/.test(slug)) throw new Error(`bad slug ${page.id} ${lang} ${slug}`);
      if (slugs[lang].has(slug)) throw new Error(`duplicate slug ${lang} ${slug}`);
      slugs[lang].add(slug);
      for (const field of ["title", "h1", "description"]) {
        const value = page[field][lang];
        if (!value || !value.trim()) throw new Error(`missing ${field} ${page.id} ${lang}`);
      }
      const paragraphs = page.intro[lang];
      if (!paragraphs?.length || paragraphs.some((p) => p.trim().length < 40)) {
        throw new Error(`short intro ${page.id} ${lang}`);
      }
      if (titles[lang].has(page.title[lang])) throw new Error(`duplicate title ${lang} ${page.title[lang]}`);
      titles[lang].add(page.title[lang]);
      if (
        page.kind !== "hub" &&
        page.category !== "bread" &&
        page.description[lang] === page.intro[lang].join(" ")
      ) {
        throw new Error(`description copies intro ${page.id} ${lang}`);
      }
    }
    if (page.kind === "home" || page.kind === "tool") {
      const preset = page.preset;
      for (const key of ["hydration", "starter", "salt", "yeast", "flour", "balls", "gramsPerBall"]) {
        if (!Number.isFinite(preset[key]) || preset[key] < 0) throw new Error(`bad preset ${page.id} ${key}`);
      }
      if (preset.mode === "flour" && !(preset.flour > 0)) throw new Error(`bad flour ${page.id}`);
      if (preset.mode === "balls" && (!(preset.balls > 0) || !(preset.gramsPerBall > 0))) {
        throw new Error(`bad balls ${page.id}`);
      }
    }
  }
  const tools = list.filter((page) => page.kind === "tool");
  const expectedTools = KEPT_HYDRATION.length + pizzaStyles.length + breads.length;
  if (tools.length !== expectedTools) throw new Error(`long-tail count ${tools.length}`);
  for (const id of FEATURED_IDS) {
    if (!ids.has(id)) throw new Error(`missing featured ${id}`);
  }
}

export const pages = [
  homePage(),
  ...hubPages(),
  ...hydrationPages(),
  ...pizzaPages(),
  ...breadPages(),
  cupsPage(),
];

assertPages(pages);

const byId = new Map(pages.map((page) => [page.id, page]));

export function featuredPages() {
  return FEATURED_IDS.map((id) => byId.get(id));
}

export function hubGroups(hub, lang) {
  const tools = pages.filter((page) => page.kind === "tool" && page.category === hub.category);
  if (hub.category === "pizza") {
    return [{ title: "", pages: tools }];
  }
  if (hub.category === "bread") {
    return FAMILIES.map((family) => ({
      title: ui[lang].families[family],
      pages: tools.filter((page) => page.family === family),
    })).filter((group) => group.pages.length > 0);
  }
  return [{ title: "", pages: tools }];
}

function nearest(page, candidates, limit) {
  return candidates
    .filter((item) => item.id !== page.id)
    .sort((a, b) => Math.abs(a.neighbor - page.neighbor) - Math.abs(b.neighbor - page.neighbor) || a.neighbor - b.neighbor)
    .slice(0, limit);
}

export function relatedPages(page) {
  if (page.kind === "home") return featuredPages();
  if (page.kind !== "tool") return [];
  const tools = pages.filter((item) => item.kind === "tool");
  if (page.category === "hydration") {
    return nearest(
      page,
      tools.filter((item) => item.category === page.category),
      4,
    );
  }
  if (page.category === "pizza") {
    const styles = tools.filter((item) => item.category === "pizza" && item.id !== page.id);
    const index = styles.findIndex((item) => item.id > page.id);
    const start = index === -1 ? 0 : index;
    return styles.slice(start).concat(styles.slice(0, start)).slice(0, 4);
  }
  if (page.category === "bread") {
    const family = tools.filter(
      (item) =>
        item.family === page.family &&
        item.id !== page.id &&
        (ADDED_BREADS.has(page.id) || !ADDED_BREADS.has(item.id)),
    );
    const index = family.findIndex((item) => item.id > page.id);
    const start = index === -1 ? 0 : index;
    const ordered = family.slice(start).concat(family.slice(0, start));
    return ordered.slice(0, 4);
  }
  return [];
}

export function toolCount() {
  return pages.filter((page) => page.kind === "tool").length;
}

function langPath(lang, slug) {
  if (!slug) return `/${lang}/`;
  return `/${lang}/${slug}/`;
}

const STARTER_PERCENTS = [10, 15, 20, 25, 30, 35, 40];
const SALT_PERCENTS = [1.5, 1.8, 2, 2.2, 2.5, 3];

function starterSlug(lang, n) {
  if (lang === "en") return `${n}-percent-sourdough-starter`;
  if (lang === "zh-cn") return `${n}-suanzhong-bili`;
  return `${n}-suan-zhong-bili`;
}

function saltSlug(lang, n) {
  const bit = String(n).replace(".", "-");
  return lang === "en" ? `${bit}-salt-bakers-percentage` : `${bit}-yan-baifenbi`;
}

// Each pair was the same dough on two URLs. The kept id is the stronger search phrase.
const MERGED_BREADS = [
  {
    to: "bread-sourdough-sandwich",
    from: {
      en: "sandwich-sourdough-bakers-percentage",
      "zh-cn": "suanzhong-tusi",
      "zh-tw": "suanzhong-tusi",
    },
  },
  {
    to: "bread-country-sourdough",
    from: {
      en: "boule-bakers-percentage",
      "zh-cn": "yuanxing-suanzhong",
      "zh-tw": "yuanxing-suanzhong",
    },
  },
];

export function redirectRules() {
  const rules = [];
  for (const lang of LANGS) {
    for (let n = 60; n <= 90; n += 1) {
      const target = nearestHydration(n);
      if (target === n) continue;
      rules.push({
        from: langPath(lang, hydrationSlug(lang, n)),
        to: langPath(lang, hydrationSlug(lang, target)),
      });
    }
    for (const style of pizzaStyles) {
      for (const balls of OLD_BALL_COUNTS) {
        rules.push({
          from: langPath(lang, pizzaBallSlug(lang, style, balls)),
          to: langPath(lang, pizzaSlug(lang, style)),
        });
      }
    }
    for (const n of STARTER_PERCENTS) {
      rules.push({
        from: langPath(lang, starterSlug(lang, n)),
        to: langPath(lang, ui[lang].hubs.starter.slug),
      });
    }
    for (const n of SALT_PERCENTS) {
      rules.push({
        from: langPath(lang, saltSlug(lang, n)),
        to: langPath(lang, ui[lang].hubs.salt.slug),
      });
    }
    for (const merged of MERGED_BREADS) {
      const target = byId.get(merged.to);
      rules.push({
        from: langPath(lang, merged.from[lang]),
        to: langPath(lang, target.slug[lang]),
      });
    }
  }
  return rules;
}

export function staticRedirects() {
  const rules = [{ from: "/", to: "/en/", status: 302 }];
  for (const rule of redirectRules()) {
    rules.push({ from: rule.from, to: rule.to, status: 301 });
    const bare = rule.from.replace(/\/$/, "");
    if (bare !== rule.from) rules.push({ from: bare, to: rule.to, status: 301 });
  }
  return rules;
}

function assertRedirects() {
  const live = new Set();
  for (const page of pages) {
    for (const lang of LANGS) live.add(langPath(lang, page.slug[lang] || ""));
  }
  const seen = new Set();
  for (const rule of redirectRules()) {
    if (rule.from === rule.to) throw new Error(`redirect loop ${rule.from}`);
    if (seen.has(rule.from)) throw new Error(`duplicate redirect ${rule.from}`);
    seen.add(rule.from);
    if (!live.has(rule.to)) throw new Error(`redirect target missing ${rule.to}`);
    if (live.has(rule.from)) throw new Error(`redirect source is still a page ${rule.from}`);
  }
}

assertRedirects();
