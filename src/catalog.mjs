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

function listAnd(parts) {
  if (parts.length <= 1) return parts[0] ?? "";
  if (parts.length === 2) return `${parts[0]} and ${parts[1]}`;
  return `${parts.slice(0, -1).join(", ")}, and ${parts[parts.length - 1]}`;
}

function ratioParts(lang, spec) {
  const yeast = spec.yeast ?? 0;
  if (lang === "en") {
    return listAnd([
      `${spec.hydration}% water`,
      spec.starter > 0 ? `${spec.starter}% starter` : "no starter",
      `${spec.salt}% salt`,
      yeast > 0 ? `${yeast}% yeast` : "no added yeast",
    ]);
  }
  const starter = spec.starter > 0 ? `酸种 ${spec.starter}%` : "不加酸种";
  const salt = lang === "zh-tw" ? `鹽 ${spec.salt}%` : `盐 ${spec.salt}%`;
  const starterTw = spec.starter > 0 ? `酸種 ${spec.starter}%` : "不加酸種";
  const yeastText =
    lang === "zh-tw"
      ? yeast > 0
        ? `酵母 ${yeast}%`
        : "不加酵母"
      : yeast > 0
        ? `酵母 ${yeast}%`
        : "不加酵母";
  return [`水合 ${spec.hydration}%`, lang === "zh-tw" ? starterTw : starter, salt, yeastText].join("，");
}

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
    const intro = {};
    for (const lang of LANGS) {
      const ratios = ratioParts(lang, item);
      if (lang === "en") {
        intro[lang] = [
          `${item.name.en} is mixed from ${item.flour} g of flour at ${ratios}. ${item.clause.en}`,
        ];
      } else if (lang === "zh-cn") {
        intro[lang] = [
          `${item.name["zh-cn"]}以 ${item.flour} 克面粉为基准，${ratios}。${item.clause["zh-cn"]}`,
        ];
      } else {
        intro[lang] = [
          `${item.name["zh-tw"]}以 ${item.flour} 克麵粉為基準，${ratios}。${item.clause["zh-tw"]}`,
        ];
      }
    }
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
        balls: 4,
        gramsPerBall: 250,
      },
    };
  });
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
      if (page.kind !== "hub" && page.description[lang] === page.intro[lang].join(" ")) {
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
    const family = tools.filter((item) => item.family === page.family && item.id !== page.id);
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
