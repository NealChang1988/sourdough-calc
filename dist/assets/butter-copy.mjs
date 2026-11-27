import { cupsCopy } from "./cups-copy.mjs";
import {
  STICK_G,
  butterStickTable,
  cupWeight,
  formatGrams,
  formatKitchen,
  ingredientById,
  measureFigures,
  displayGrams,
  nearestCup,
  wholeGrams,
} from "./cups.mjs";

export const USDA_CREDIT = "U.S. Department of Agriculture, Agricultural Research Service. FoodData Central";

export const KING_LABEL = {
  en: "King Arthur Baking Ingredient Weight Chart",
  "zh-cn": "King Arthur Baking 食材重量表",
  "zh-tw": "King Arthur Baking 食材重量表",
};

function butterPerCup() {
  return ingredientById("butter").gUs;
}

export function quickFacts() {
  const cup = cupWeight("butter", "us");
  return {
    stick: wholeGrams(STICK_G),
    half: wholeGrams(cup / 2),
    cup: wholeGrams(cup),
    tbsp: wholeGrams(cup / 16),
  };
}

function blockParts() {
  const sticks = 250 / STICK_G;
  const whole = Math.floor(sticks + 1e-9);
  return {
    label: formatKitchen(sticks),
    whole,
    rest: Math.round(250 - whole * STICK_G),
  };
}

export function butterExampleRows(lang) {
  const copy = butterCopy[lang];
  const grams = wholeGrams(1.5 * STICK_G);
  const tbsp = wholeGrams((1.5 * STICK_G * 16) / butterPerCup());
  const cups = formatKitchen(1.5 / 2);
  const two = wholeGrams(roundToCupTbsp(2));
  const block = blockParts();
  return [
    [copy.exBefore[0], copy.exStick.replace("{g}", String(grams)).replace("{tbsp}", String(tbsp)).replace("{cups}", cups)],
    [copy.exBefore[1], copy.exTbsp.replace("{g}", String(two))],
    [copy.exBefore[2], copy.exBlock.replace("{sticks}", block.label).replace("{whole}", String(block.whole)).replace("{rest}", String(block.rest))],
  ];
}

function roundToCupTbsp(count) {
  const per = cupWeight("butter", "us");
  const factor = 100;
  const value = (count / 16) * per;
  return Math.round(value * factor + 1e-8) / factor;
}

export function butterView(result, lang) {
  const copy = butterCopy[lang];
  const cups = cupsCopy[lang];
  const figures = measureFigures(result);
  const butter = result.ingredient === "butter";
  const grams = displayGrams(figures.grams);
  const gramBit = lang === "en" ? `${grams} g` : `${grams} ${copy.gram}`;
  const name = cups.names[result.ingredient];
  const shown = lang === "en" ? name.charAt(0).toLowerCase() + name.slice(1) : name;
  const tbspN = Math.round(figures.tbsp);
  const tbspBit = `${tbspN} ${copy.tbsp}`;
  const sticksPlain = formatKitchen(figures.sticks);
  const sticksLabel = formatKitchen(figures.sticks, { thirdNote: true });
  const stickWord = lang === "en" && figures.sticks > 1.005 ? copy.sticks : copy.stick;
  const summary = butter
    ? `${gramBit} ${shown} ≈ ${tbspBit} ≈ ${sticksPlain} ${stickWord}`
    : `${gramBit} ${shown} ≈ ${tbspBit}`;
  const nearest = nearestCup(figures.cups);
  let frac = "";
  if (nearest.under) frac = cups.under;
  else {
    const mark = nearest.label === "1" ? `1 ${cups.units.one}` : nearest.label.includes(" ") || /^\d+$/.test(nearest.label) ? `${nearest.label} ${cups.units.many}` : `${nearest.label} ${cups.units.one}`;
    frac = cups.nearest.replace("{mark}", mark).replace("{diff}", nearest.diff);
  }
  const oz = (Math.round(figures.oz * 100 + 1e-8) / 100).toFixed(2);
  const ml = (Math.round(figures.ml * 100 + 1e-8) / 100).toFixed(2);
  const cells = {
    oz: `${oz} ${cups.suffix.oz}`,
    sticks: sticksLabel,
    tbsp: formatKitchen(figures.tbsp, { thirdNote: true }),
    tsp: formatKitchen(figures.tsp, { thirdNote: true }),
    cups: formatKitchen(figures.cups, { sixteenths: true }),
    ml: `${ml} ${cups.suffix.ml}`,
  };
  const copyText = butter
    ? `${summary} · ${cells.oz} · ${cells.cups} ${copy.cup} · ${cells.ml}`
    : `${summary} · ${cells.oz} · ${cells.cups} ${copy.cup} · ${cells.ml}`;
  return {
    grams: gramBit,
    summary,
    frac,
    under: nearest.under,
    showSticks: butter,
    cells,
    copyText,
  };
}

export const butterCopy = {
  en: {
    privacy: "What you type stays in this browser and is never sent.",
    limits: "Above 0, and at most 100,000 g, 1,000 cups, 2,000 sticks, 16,000 tbsp, or 48,000 tsp.",
    amount: "Amount",
    unitsLegend: "Unit",
    units: [
      ["stick", "stick"],
      ["tbsp", "tbsp"],
      ["tsp", "tsp"],
      ["cup", "cup"],
      ["g", "g"],
      ["oz", "oz"],
    ],
    chips: [
      ["1 stick", "stick", "1 stick"],
      ["2 sticks", "stick", "2 sticks"],
      ["1/2 cup", "cup", "1/2 cup"],
      ["1 cup", "cup", "1 cup"],
      ["1 tbsp", "tbsp", "1 tbsp"],
      ["100 g", "g", "100 g"],
      ["250 g", "g", "250 g"],
    ],
    opening: "1 stick",
    standardHint: "Sticks and spoons stay US sizes; only the cup changes.",
    usingTyped: "Using {name} from what you typed.",
    result: "Result",
    rows: {
      oz: "Ounces",
      sticks: "Sticks",
      tbsp: "Tablespoons",
      tsp: "Teaspoons",
      cups: "Cups",
      ml: "Milliliters",
    },
    copy: "Copy result",
    copied: "Copied",
    copyFail: "Select the result text and copy it",
    print: "Print",
    quickTitle: "Quick answer",
    stickTable: "How much is a stick of butter?",
    tableHead: ["Sticks", "Grams", "Ounces", "Tablespoons", "Cups"],
    howtoTitle: "How to use",
    steps: [
      "Type an Amount, like 1 stick or 2 tbsp, or tap 1 stick, 1/2 cup, or 100 g.",
      "If you typed only a number, tap stick, tbsp, tsp, cup, g, or oz.",
      "Read the grams in the Result, then Copy result or Print.",
    ],
    exampleTitle: "Example",
    before: "Before",
    after: "After",
    exBefore: ["1 1/2 sticks butter", "2 tbsp butter", "250 g block of butter"],
    exStick: "{g} g ({tbsp} tbsp, {cups} cup)",
    exTbsp: "{g} g",
    exBlock: "{sticks} sticks ({whole} sticks + {rest} g)",
    faqTitle: "Questions",
    sourcesTitle: "Where the numbers come from",
    gapTitle: "What this does not cover",
    gram: "g",
    tbsp: "tbsp",
    stick: "stick",
    sticks: "sticks",
    cup: "cup",
    quick: ["1 stick = {stick} g", "1/2 cup = {half} g · 1 cup = {cup} g", "1 tbsp = {tbsp} g"],
  },
  "zh-cn": {
    privacy: "你输入的内容只留在这个浏览器里，不会发送出去。",
    limits: "须大于 0。最多 100,000 克、1,000 杯、2,000 条、16,000 汤匙或 48,000 茶匙。",
    amount: "数量",
    unitsLegend: "单位",
    units: [
      ["stick", "条"],
      ["tbsp", "汤匙"],
      ["tsp", "茶匙"],
      ["cup", "杯"],
      ["g", "克"],
      ["oz", "盎司"],
    ],
    chips: [
      ["1 条", "stick", "1 条"],
      ["2 条", "stick", "2 条"],
      ["1/2 杯", "cup", "1/2 杯"],
      ["1 杯", "cup", "1 杯"],
      ["1 汤匙", "tbsp", "1 汤匙"],
      ["100 克", "g", "100 克"],
      ["250 克", "g", "250 克"],
    ],
    opening: "1 条",
    standardHint: "条、汤匙和茶匙仍是美制；换杯制只会改变杯。",
    usingTyped: "按你输入的{name}计算。",
    result: "结果",
    rows: { oz: "盎司", sticks: "条", tbsp: "汤匙", tsp: "茶匙", cups: "杯", ml: "毫升" },
    copy: "复制结果",
    copied: "已复制",
    copyFail: "请选中结果文字再复制",
    print: "打印",
    quickTitle: "快速答案",
    stickTable: "一条黄油是多少？",
    tableHead: ["条", "克", "盎司", "汤匙", "杯"],
    howtoTitle: "怎么用",
    steps: [
      "在数量里输入 1 条或 2 汤匙，或点 1 条、1/2 杯、100 克。",
      "如果只输入数字，再点条、汤匙、茶匙、杯、克或盎司。",
      "看结果的克数，然后复制结果或打印。",
    ],
    exampleTitle: "例子",
    before: "换算前",
    after: "换算后",
    exBefore: ["1 1/2 条黄油", "2 汤匙黄油", "250 克黄油"],
    exStick: "{g} 克（{tbsp} 汤匙、{cups} 杯）",
    exTbsp: "{g} 克",
    exBlock: "{sticks} 条（{whole} 条 + {rest} 克）",
    faqTitle: "常见问题",
    sourcesTitle: "这些数字从哪来",
    gapTitle: "这里不算哪些",
    gram: "克",
    tbsp: "汤匙",
    stick: "条",
    sticks: "条",
    cup: "杯",
    quick: ["1 条 = {stick} 克", "1/2 杯 = {half} 克 · 1 杯 = {cup} 克", "1 汤匙 = {tbsp} 克"],
  },
  "zh-tw": {
    privacy: "你輸入的內容只留在這個瀏覽器，不會送出去。",
    limits: "須大於 0。最多 100,000 克、1,000 杯、2,000 條、16,000 湯匙或 48,000 茶匙。",
    amount: "數量",
    unitsLegend: "單位",
    units: [
      ["stick", "條"],
      ["tbsp", "湯匙"],
      ["tsp", "茶匙"],
      ["cup", "杯"],
      ["g", "克"],
      ["oz", "盎司"],
    ],
    chips: [
      ["1 條", "stick", "1 條"],
      ["2 條", "stick", "2 條"],
      ["1/2 杯", "cup", "1/2 杯"],
      ["1 杯", "cup", "1 杯"],
      ["1 湯匙", "tbsp", "1 湯匙"],
      ["100 克", "g", "100 克"],
      ["250 克", "g", "250 克"],
    ],
    opening: "1 條",
    standardHint: "條、湯匙和茶匙仍是美制；換杯制只會改變杯。",
    usingTyped: "按你輸入的{name}計算。",
    result: "結果",
    rows: { oz: "盎司", sticks: "條", tbsp: "湯匙", tsp: "茶匙", cups: "杯", ml: "毫升" },
    copy: "複製結果",
    copied: "已複製",
    copyFail: "請選中結果文字再複製",
    print: "列印",
    quickTitle: "快速答案",
    stickTable: "一條奶油是多少？",
    tableHead: ["條", "克", "盎司", "湯匙", "杯"],
    howtoTitle: "怎麼用",
    steps: [
      "在數量輸入 1 條或 2 湯匙，或點 1 條、1/2 杯、100 克。",
      "如果只打數字，再點條、湯匙、茶匙、杯、克或盎司。",
      "看結果的克數，然後複製結果或列印。",
    ],
    exampleTitle: "例子",
    before: "換算前",
    after: "換算後",
    exBefore: ["1 1/2 條奶油", "2 湯匙奶油", "250 克奶油"],
    exStick: "{g} 克（{tbsp} 湯匙、{cups} 杯）",
    exTbsp: "{g} 克",
    exBlock: "{sticks} 條（{whole} 條 + {rest} 克）",
    faqTitle: "常見問題",
    sourcesTitle: "這些數字從哪來",
    gapTitle: "這裡不算哪些",
    gram: "克",
    tbsp: "湯匙",
    stick: "條",
    sticks: "條",
    cup: "杯",
    quick: ["1 條 = {stick} 克", "1/2 杯 = {half} 克 · 1 杯 = {cup} 克", "1 湯匙 = {tbsp} 克"],
  },
};

export function quickLines(lang) {
  const facts = quickFacts();
  return butterCopy[lang].quick.map((line) =>
    line
      .replace("{stick}", String(facts.stick))
      .replace("{half}", String(facts.half))
      .replace("{cup}", String(facts.cup))
      .replace("{tbsp}", String(facts.tbsp)),
  );
}

export function faqEntries(lang) {
  const stick = formatGrams(STICK_G);
  const cup = formatGrams(butterPerCup());
  const block = blockParts();
  const facts = quickFacts();
  if (lang === "zh-cn") {
    return [
      ["一条黄油是多少克？", `一条美制黄油是 4 盎司，也就是 ${facts.stick} 克、8 汤匙、半杯。`],
      [
        "为什么会看到 113 克、113.5 克和 227 克？",
        `一条是 4 盎司，算出来是 ${stick} 克。一杯是两条，${cup} 克。美国农业部 FoodData Central 和 King Arthur 的表把它们写成 113 克和 227 克。227 克的一半是 113.5 克，所以有的表会写成 113.5。`,
      ],
      [
        "250 克一块是几条？",
        `大约 ${block.label} 条，也就是 ${block.whole} 条再加 ${block.rest} 克。这只是例子，包装规格没有核对过。`,
      ],
      ["选了公制杯，一条会变吗？", "不会。一条还是 4 盎司。变的只有杯。"],
      ["用秤会不会更准？", "会。拿得出秤就称一下。汤匙只是厨房里的估法。"],
    ];
  }
  if (lang === "zh-tw") {
    return [
      ["一條奶油是幾克？", `一條美制奶油是 4 盎司，也就是 ${facts.stick} 克、8 湯匙、半杯。`],
      [
        "為什麼會看到 113 克、113.5 克和 227 克？",
        `一條是 4 盎司，算出來是 ${stick} 克。一杯是兩條，${cup} 克。美國農業部 FoodData Central 和 King Arthur 的表把它們寫成 113 克和 227 克。227 克的一半是 113.5 克，所以有的表會寫成 113.5。`,
      ],
      [
        "250 克一塊是幾條？",
        `大約 ${block.label} 條，也就是 ${block.whole} 條再加 ${block.rest} 克。這只是例子，包裝規格沒有核對過。`,
      ],
      ["選了公制杯，一條會變嗎？", "不會。一條還是 4 盎司。變的只有杯。"],
      ["用秤會不會更準？", "會。拿得出秤就稱一下。湯匙只是廚房裡的估法。"],
    ];
  }
  return [
    ["How many grams is a stick of butter?", `One US stick is 4 oz: ${facts.stick} g, 8 tablespoons, or 1/2 cup.`],
    [
      "Why do I see 113 g, 113.5 g and 227 g?",
      `A stick is 4 oz, which works out to ${stick} g. A cup is 2 sticks, ${cup} g. USDA FoodData Central and the King Arthur chart round those to 113 g and 227 g. Half of 227 g is 113.5 g, which is why some charts list 113.5.`,
    ],
    [
      "How many sticks is a 250 g block?",
      `About ${block.label} sticks: ${block.whole} sticks plus ${block.rest} g. Use that as an example only. Package sizes were not checked.`,
    ],
    ["Does choosing a metric cup change a stick?", "No. A stick stays 4 oz. The cup size is the only thing that changes."],
    ["Is a scale more accurate?", "Yes. Weigh the butter when you can. A spoon measure is a kitchen estimate."],
  ];
}

export function sourceParagraphs(lang) {
  const oz = (STICK_G / 4).toFixed(9);
  const facts = quickFacts();
  if (lang === "zh-cn") {
    return [
      `1 盎司 = ${oz} 克。这一页把 4 盎司的结果收成整数克：一条 ${facts.stick} 克，一杯 ${facts.cup} 克，一汤匙 ${facts.tbsp} 克。这三个整数和下面两个来源一致。`,
      `${USDA_CREDIT}。咸黄油，FDC 173410：一条 113 克，一汤匙 14.2 克，一杯 227 克。`,
      "King Arthur Baking 食材重量表：黄油 8 汤匙（半杯）= 4 盎司 = 113 克。",
    ];
  }
  if (lang === "zh-tw") {
    return [
      `1 盎司 = ${oz} 克。這一頁把 4 盎司的結果收成整數克：一條 ${facts.stick} 克，一杯 ${facts.cup} 克，一湯匙 ${facts.tbsp} 克。這三個整數和下面兩個來源一致。`,
      `${USDA_CREDIT}。鹹奶油，FDC 173410：一條 113 克，一湯匙 14.2 克，一杯 227 克。`,
      "King Arthur Baking 食材重量表：奶油 8 湯匙（半杯）= 4 盎司 = 113 克。",
    ];
  }
  return [
    `1 oz = ${oz} g. This page rounds 4 oz values to whole grams: ${facts.stick} g for a stick, ${facts.cup} g for a cup, and ${facts.tbsp} g for a tablespoon. Those whole-gram figures match both sources below.`,
    `${USDA_CREDIT}. Butter, salted, FDC 173410: stick 113 g, tablespoon 14.2 g, cup 227 g.`,
    "King Arthur Baking Ingredient Weight Chart: butter, 8 tablespoons (1/2 cup) = 4 oz = 113 g.",
  ];
}

export function gapParagraphs(lang) {
  if (lang === "zh-cn") {
    return [
      "这里不算融化的、打发的，或植物黄油。加盐和不加盐的重量差没有核对，美国以外的黄油包装规格也没有核对。",
      "这是厨房里的估算。秤最准。",
    ];
  }
  if (lang === "zh-tw") {
    return [
      "這裡不算融化的、打發的，或植物奶油。加鹽和不加鹽的重量差沒有核對，美國以外的奶油包裝規格也沒有核對。",
      "這是廚房裡的估算。秤最準。",
    ];
  }
  return [
    "This page does not cover melted, whipped, or plant-based butter. Salted and unsalted weight differences were not checked, and butter package sizes outside the US were not checked.",
    "It is a kitchen estimate. A scale is the most accurate.",
  ];
}

export function stickTableRows() {
  return butterStickTable();
}
