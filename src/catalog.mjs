import { breads } from "./data/breads.mjs";
import { hydrationNotes } from "./data/hydration-notes.mjs";
import { saltNotes, starterNotes } from "./data/mix-notes.mjs";
import { BALL_COUNTS, pizzaStyles } from "./data/pizza.mjs";
import { FAMILIES, LANGS, ui } from "./i18n.mjs";

const FEATURED_IDS = [
  "hydration-75",
  "hydration-70",
  "pizza-neapolitan-6",
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

function ballSentence(lang, balls, grams, total) {
  const en = {
    1: `One ball at ${grams} g is a single pie, ${total} g of dough.`,
    2: `Two balls at ${grams} g each come to ${total} g. Cut the dough in half and weigh both pieces.`,
    3: `Three balls at ${grams} g each come to ${total} g. Weigh every piece so the three pies match.`,
    4: `Four balls at ${grams} g each come to ${total} g. Divide the dough in half, then divide each half.`,
    6: `Six balls at ${grams} g each come to ${total} g. Weigh each piece so the pies bake alike.`,
    8: `Eight balls at ${grams} g each come to ${total} g. Use a large bowl and leave the balls room in the fridge.`,
    10: `Ten balls at ${grams} g each come to ${total} g. Keep the container covered so the surfaces do not dry.`,
    12: `Twelve balls at ${grams} g each come to ${total} g. Mix in a bowl with room to fold, then weigh every piece.`,
  };
  const zhCn = {
    1: `一球 ${grams} 克，就是一张饼，面团一共 ${total} 克。`,
    2: `两球各 ${grams} 克，合计 ${total} 克。对半切开，两块都称一下。`,
    3: `三球各 ${grams} 克，合计 ${total} 克。每一块都称，三张饼才会一样大。`,
    4: `四球各 ${grams} 克，合计 ${total} 克。先对半，再把每一半分开。`,
    6: `六球各 ${grams} 克，合计 ${total} 克。逐块称重，烤出来才一致。`,
    8: `八球各 ${grams} 克，合计 ${total} 克。用大盆拌，冷藏时给面团球留出空隙。`,
    10: `十球各 ${grams} 克，合计 ${total} 克。容器要盖严，表面才不会干。`,
    12: `十二球各 ${grams} 克，合计 ${total} 克。盆要留出折叠的空间，分割时逐块称重。`,
  };
  const zhTw = {
    1: `一球 ${grams} 克，就是一張餅，麵團一共 ${total} 克。`,
    2: `兩球各 ${grams} 克，合計 ${total} 克。對半切開，兩塊都秤一下。`,
    3: `三球各 ${grams} 克，合計 ${total} 克。每一塊都秤，三張餅才會一樣大。`,
    4: `四球各 ${grams} 克，合計 ${total} 克。先對半，再把每一半分開。`,
    6: `六球各 ${grams} 克，合計 ${total} 克。逐塊秤重，烤出來才一致。`,
    8: `八球各 ${grams} 克，合計 ${total} 克。用大盆拌，冷藏時給麵團球留出空隙。`,
    10: `十球各 ${grams} 克，合計 ${total} 克。容器要蓋嚴，表面才不會乾。`,
    12: `十二球各 ${grams} 克，合計 ${total} 克。盆要留出摺疊的空間，分割時逐塊秤重。`,
  };
  const table = lang === "en" ? en : lang === "zh-tw" ? zhTw : zhCn;
  return table[balls];
}

function text(lang, value) {
  return value[lang];
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
      preset: null,
    };
  });
}

function hydrationPages() {
  const pages = [];
  for (let n = 60; n <= 90; n += 1) {
    const note = hydrationNotes[n];
    const title = {
      en: `${n}% Hydration Sourdough Calculator`,
      "zh-cn": `${n}% 水合酸种计算器`,
      "zh-tw": `${n}% 水合酸種計算`,
    };
    const intro = {
      en: `This ${n}% hydration sourdough is scaled from 500 g of flour with 20% starter and 2% salt. ${note.en}`,
      "zh-cn": `这份 ${n}% 水合的酸种以 500 克面粉为基准，酸种 20%，盐 2%。${note["zh-cn"]}`,
      "zh-tw": `這份 ${n}% 水合的酸種以 500 克麵粉為基準，酸種 20%，鹽 2%。${note["zh-tw"]}`,
    };
    pages.push({
      id: `hydration-${n}`,
      kind: "tool",
      category: "hydration",
      slug: {
        en: `${n}-hydration-sourdough-calculator`,
        "zh-cn": `${n}-shuihe-suanzhong-jisuanqi`,
        "zh-tw": `${n}-shuihe-suan-zhong-jisuan`,
      },
      title,
      h1: title,
      description: {
        en: note.en,
        "zh-cn": note["zh-cn"],
        "zh-tw": note["zh-tw"],
      },
      intro: { en: [intro.en], "zh-cn": [intro["zh-cn"]], "zh-tw": [intro["zh-tw"]] },
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
    });
  }
  return pages;
}

function pizzaPages() {
  const pages = [];
  for (const style of pizzaStyles) {
    for (const balls of BALL_COUNTS) {
      const total = balls * style.ballGrams;
      const spec = style;
      const title = {
        en: balls === 1 ? `${style.name.en} for 1 Ball` : `${style.name.en} for ${balls} Balls`,
        "zh-cn": `${balls} 球${style.name["zh-cn"]}`,
        "zh-tw": `${balls} 球${style.name["zh-tw"]}`,
      };
      const intro = {};
      const description = {};
      for (const lang of LANGS) {
        const lead =
          lang === "en"
            ? `${style.name.en} for ${balls === 1 ? "1 ball" : `${balls} balls`} uses ${ratioParts(lang, spec)}.`
            : `${style.name[lang]}，${balls} 球，${ratioParts(lang, spec)}。`;
        const countLine = ballSentence(lang, balls, style.ballGrams, total);
        intro[lang] = [
          lang === "en" ? `${lead} ${countLine} ${style.method[lang]}` : `${lead}${countLine}${style.method[lang]}`,
        ];
        description[lang] =
          lang === "en"
            ? `${balls} ${balls === 1 ? "ball" : "balls"} at ${style.ballGrams} g. Total dough is ${total} g, at ${ratioParts(lang, spec)}.`
            : `${balls} 球，每球 ${style.ballGrams} 克，面团合计 ${total} 克，${ratioParts(lang, spec)}。`;
        if (lang === "zh-tw") {
          description[lang] = `${balls} 球，每球 ${style.ballGrams} 克，麵團合計 ${total} 克，${ratioParts(lang, spec)}。`;
        }
      }
      pages.push({
        id: `pizza-${style.id}-${balls}`,
        kind: "tool",
        category: "pizza",
        styleId: style.id,
        slug: {
          en: `${style.slug.en}-${balls}-${balls === 1 ? "ball" : "balls"}`,
          "zh-cn": `${style.slug.zh}-${balls}-qiu`,
          "zh-tw": `${style.slug.zh}-${balls}-qiu`,
        },
        title,
        h1: title,
        description,
        intro,
        preset: {
          mode: "balls",
          flour: 500,
          hydration: style.hydration,
          starter: style.starter,
          salt: style.salt,
          yeast: style.yeast,
          balls,
          gramsPerBall: style.ballGrams,
        },
        neighbor: balls,
      });
    }
  }
  return pages;
}

function breadPages() {
  return breads.map((item) => {
    const title = {
      en: `${item.name.en} Baker's Percentage`,
      "zh-cn": `${item.name["zh-cn"]}烘焙百分比`,
      "zh-tw": `${item.name["zh-tw"]}烘焙百分比`,
    };
    const description = {};
    const intro = {};
    for (const lang of LANGS) {
      const ratios = ratioParts(lang, item);
      if (lang === "en") {
        description[lang] = `${item.name.en} from ${item.flour} g of flour at ${ratios}.`;
        intro[lang] = [
          `${item.name.en} is mixed from ${item.flour} g of flour at ${ratios}. ${item.clause.en}`,
        ];
      } else if (lang === "zh-cn") {
        description[lang] = `${item.name["zh-cn"]}以 ${item.flour} 克面粉为基准，${ratios}。`;
        intro[lang] = [`${description[lang]}${item.clause["zh-cn"]}`];
      } else {
        description[lang] = `${item.name["zh-tw"]}以 ${item.flour} 克麵粉為基準，${ratios}。`;
        intro[lang] = [`${description[lang]}${item.clause["zh-tw"]}`];
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

function starterPages() {
  return Object.keys(starterNotes)
    .map(Number)
    .sort((a, b) => a - b)
    .map((n) => {
      const note = starterNotes[n];
      const title = {
        en: `${n}% Sourdough Starter Calculator`,
        "zh-cn": `${n}% 酸种比例计算器`,
        "zh-tw": `${n}% 酸種比例計算`,
      };
      return {
        id: `starter-${n}`,
        kind: "tool",
        category: "starter",
        slug: {
          en: `${n}-percent-sourdough-starter`,
          "zh-cn": `${n}-suanzhong-bili`,
          "zh-tw": `${n}-suan-zhong-bili`,
        },
        title,
        h1: title,
        description: { en: note.en, "zh-cn": note["zh-cn"], "zh-tw": note["zh-tw"] },
        intro: {
          en: [
            `A ${n}% starter on 500 g of flour at 75% hydration and 2% salt. ${note.en}`,
          ],
          "zh-cn": [`以 500 克面粉为基准，水合 75%，盐 2%，酸种 ${n}%。${note["zh-cn"]}`],
          "zh-tw": [`以 500 克麵粉為基準，水合 75%，鹽 2%，酸種 ${n}%。${note["zh-tw"]}`],
        },
        preset: {
          mode: "flour",
          flour: 500,
          hydration: 75,
          starter: n,
          salt: 2,
          yeast: 0,
          balls: 4,
          gramsPerBall: 250,
        },
        neighbor: n,
      };
    });
}

function saltPages() {
  return Object.keys(saltNotes)
    .map(Number)
    .sort((a, b) => a - b)
    .map((n) => {
      const note = saltNotes[n];
      const slugBit = String(n).replace(".", "-");
      const title = {
        en: `${n}% Salt Baker's Percentage`,
        "zh-cn": `${n}% 盐的烘焙百分比`,
        "zh-tw": `${n}% 鹽的烘焙百分比`,
      };
      return {
        id: `salt-${slugBit}`,
        kind: "tool",
        category: "salt",
        slug: {
          en: `${slugBit}-salt-bakers-percentage`,
          "zh-cn": `${slugBit}-yan-baifenbi`,
          "zh-tw": `${slugBit}-yan-baifenbi`,
        },
        title,
        h1: title,
        description: { en: note.en, "zh-cn": note["zh-cn"], "zh-tw": note["zh-tw"] },
        intro: {
          en: [
            `Salt at ${n}% of flour weight, on 500 g of flour with 70% hydration and 20% starter. ${note.en}`,
          ],
          "zh-cn": [`以 500 克面粉为基准，水合 70%，酸种 20%，盐 ${n}%。${note["zh-cn"]}`],
          "zh-tw": [`以 500 克麵粉為基準，水合 70%，酸種 20%，鹽 ${n}%。${note["zh-tw"]}`],
        },
        preset: {
          mode: "flour",
          flour: 500,
          hydration: 70,
          starter: 20,
          salt: n,
          yeast: 0,
          balls: 4,
          gramsPerBall: 250,
        },
        neighbor: n,
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
  if (tools.length < 150 || tools.length > 200) throw new Error(`long-tail count ${tools.length}`);
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
  ...starterPages(),
  ...saltPages(),
];

assertPages(pages);

const byId = new Map(pages.map((page) => [page.id, page]));

export function featuredPages() {
  return FEATURED_IDS.map((id) => byId.get(id));
}

export function hubGroups(hub, lang) {
  const tools = pages.filter((page) => page.kind === "tool" && page.category === hub.category);
  if (hub.category === "pizza") {
    return pizzaStyles.map((style) => ({
      title: style.name[lang],
      pages: tools.filter((page) => page.styleId === style.id),
    }));
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
  const tools = pages.filter((item) => item.kind === "tool");
  if (page.category === "hydration" || page.category === "starter" || page.category === "salt") {
    return nearest(
      page,
      tools.filter((item) => item.category === page.category),
      4,
    );
  }
  if (page.category === "pizza") {
    return nearest(
      page,
      tools.filter((item) => item.styleId === page.styleId),
      4,
    );
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
