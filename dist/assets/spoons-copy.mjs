import { cupsCopy, KING_ARTHUR_URL } from "./cups-copy.mjs";
import { USDA_CREDIT } from "./butter-copy.mjs";
import {
  US_TBSP_ML,
  cupSpoonRows,
  formatGrams,
  formatSpoonPhrase,
  gramsPerSpoonRows,
  oneDecimal,
  roundTo,
  spoonOnlyRows,
  tbspGrams,
  usMetricRows,
} from "./spoons.mjs";

export { KING_ARTHUR_URL, USDA_CREDIT };

const names = {
  en: {
    salt: "Table salt",
    dc: "Diamond Crystal kosher salt",
    morton: "Morton kosher salt",
    bp: "Baking powder",
    soda: "Baking soda",
    yeast: "Instant yeast",
    vanilla: "Vanilla extract",
  },
  "zh-cn": {
    salt: "食盐（细盐）",
    dc: "Diamond Crystal 粗盐",
    morton: "Morton 粗盐",
    bp: "泡打粉",
    soda: "小苏打",
    yeast: "速发酵母",
    vanilla: "香草精",
  },
  "zh-tw": {
    salt: "食鹽（細鹽）",
    dc: "Diamond Crystal 粗鹽",
    morton: "Morton 粗鹽",
    bp: "泡打粉",
    soda: "小蘇打",
    yeast: "速發酵母",
    vanilla: "香草精",
  },
};

export function spoonName(id, lang) {
  return names[lang][id] || cupsCopy[lang].names[id];
}

function unitWord(kind, lang) {
  const copy = spoonsCopy[lang];
  return copy[kind];
}

function kitchenLine(parts, lang) {
  if (!parts || parts.tiny || (parts.whole == null && !parts.tspOnly)) return "";
  const tbsp = unitWord("tbsp", lang);
  const tsp = unitWord("tsp", lang);
  if (parts.tspOnly) return `${parts.tspOnly} ${tsp}`;
  if (!parts.tenth) return `${parts.whole} ${tbsp}`;
  return `${parts.whole} ${tbsp} + ${parts.tenth.toFixed(1)} ${tsp}`;
}

function plainName(id, lang) {
  const name = spoonName(id, lang);
  return lang === "en" ? name.charAt(0).toLowerCase() + name.slice(1) : name;
}

export function presentSpoon(result, lang) {
  const copy = spoonsCopy[lang];
  const name = plainName(result.ingredient, lang);
  const gramsBit = lang === "en" ? `${result.gramsLabel} g` : `${result.gramsLabel} ${copy.g}`;
  const spoonPair = result.parsed.unit === "tsp";
  const other = spoonPair
    ? { kind: "tbsp", text: formatSpoonPhrase(result.tbspExact, copy.tbsp) }
    : { kind: "tsp", text: formatSpoonPhrase(result.tspExact, copy.tsp) };
  const otherBit = other.text;
  const tbspBit = formatSpoonPhrase(result.tbspExact, copy.tbsp);
  const tspBit = formatSpoonPhrase(result.tspExact, copy.tsp);
  const kitchen = kitchenLine(result.parts, lang);
  const both = result.forward && result.parsed.unit !== "tbsp" && result.parsed.unit !== "tsp";
  const amountBit = formatSpoonPhrase(result.parsed.count ?? result.parsed.value, unitWord(result.parsed.unit, lang));
  let summary = copy.tiny;
  if (!result.tiny || result.forward) {
    if (!result.forward) summary = `${gramsBit} ${name} ≈ ${result.tbspText} ${copy.tbsp} · ${result.tspText} ${copy.tsp}${kitchen ? ` ≈ ${kitchen}` : ""}`;
    else if (both) summary = `${amountBit} ${name} ≈ ${gramsBit} ≈ ${tbspBit} · ${tspBit}`;
    else summary = `${amountBit} ${name} ≈ ${gramsBit} ≈ ${otherBit}`;
  }
  const cupName = lang === "en" && result.cupsExact > 1.005 ? "cups" : copy.cup;
  const hero = !result.forward && result.tiny ? copy.tiny : result.forward ? gramsBit : `${result.tbspText} ${copy.tbsp} · ${result.tspText} ${copy.tsp}`;
  const cups = result.cupsText == null ? "" : `${result.cupsText} ${cupName}`;
  return {
    hero,
    summary,
    kitchen,
    hint: result.forward && result.tiny ? copy.tiny : "",
    showNumbers: result.forward || !result.tiny,
    showOther: result.forward && !both,
    showBoth: result.forward && both,
    showKitchen: !result.forward && !result.tiny && Boolean(kitchen),
    grams: gramsBit,
    tbsp: tbspBit,
    tsp: tspBit,
    tbspExact: `${result.tbspText} ${copy.tbsp}`,
    tspExact: `${result.tspText} ${copy.tsp}`,
    other: otherBit,
    otherLabel: other.kind === "tbsp" ? copy.rows.otherTbsp : copy.rows.otherTsp,
    ml: `${result.mlText} ${copy.ml}`,
    oz: `${result.ozText} ${copy.oz}`,
    cups,
    showCups: result.cupsText != null,
    forward: result.forward,
    copyText: cups ? `${summary} · ${result.ozText} ${copy.oz} · ${cups} · ${result.mlText} ${copy.ml}` : summary,
    ingredientName: spoonName(result.ingredient, lang),
  };
}

function quickNumber(id, spoonKind) {
  return formatGrams(spoonKind === "tbsp" ? tbspGrams(id, "us") : tbspGrams(id, "us") / 3);
}

export const spoonsCopy = {
  en: {
    privacy: "What you type stays in this browser and is never sent.",
    limits: "Above 0, and at most 100,000 g, 16,000 tbsp, or 48,000 tsp.",
    lede: "Pick an ingredient and convert tablespoons, teaspoons and grams.",
    quickLead: "A US tablespoon is about 14.8 mL, or 3 teaspoons. The grams depend on the ingredient.",
    amount: "Amount",
    unitsLegend: "Unit",
    tbsp: "tbsp",
    tsp: "tsp",
    g: "g",
    ml: "ml",
    oz: "oz",
    cup: "cup",
    stick: "stick",
    units: [["tbsp", "tbsp"], ["tsp", "tsp"], ["g", "g"]],
    chips: [
      ["1 tbsp", "tbsp", "1 tbsp"],
      ["2 tbsp", "tbsp", "2 tbsp"],
      ["1 tsp", "tsp", "1 tsp"],
      ["1/2 tsp", "tsp", "1/2 tsp"],
      ["15 g", "g", "15 g"],
      ["100 g", "g", "100 g"],
    ],
    opening: "1 tbsp",
    spoonLegend: "Spoon",
    spoons: { us: "US spoon (14.8 mL)", metric: "Metric spoon (15 mL)" },
    group: "By the spoon",
    usingTyped: "Using {name} from what you typed.",
    kosher: "Kosher salt depends on the brand: Diamond Crystal is 8 g and Morton is 16 g per tablespoon. Pick one from the Ingredient menu.",
    nocup: "Cups aren't listed for {name}. Enter tbsp, tsp, or g.",
    tiny: "Less than 1/8 tsp — use a scale.",
    result: "Result",
    rows: { otherTbsp: "Tablespoons", otherTsp: "Teaspoons", ml: "Milliliters", oz: "Ounces", cups: "Cups", kitchen: "Kitchen measure" },
    copy: "Copy result",
    copied: "Copied",
    copyFail: "Select the result text and copy it",
    print: "Print",
    chartTitle: "Grams per spoon",
    chartHead: ["Ingredient", "1 tbsp", "1 tsp"],
    onlyTitle: "By the spoon",
    onlyNote: "Kosher salt brands differ: a tablespoon of Diamond Crystal is 8 g and Morton is 16 g — twice as much.",
    compareTitle: "US and metric spoons",
    compareHead: ["Ingredient", "US tbsp", "Metric tbsp"],
    compareNote: "A metric tablespoon (15 mL) holds about 1.4% more than a US tablespoon (14.8 mL).",
    cupTitle: "Spoons and cups",
    cupHead: ["Cup", "tbsp", "tsp", "mL"],
    howtoTitle: "How to use",
    steps: [
      "Pick an Ingredient, then type an Amount like 2 tbsp or 15 g, or tap 1 tbsp, 1 tsp, or 15 g.",
      "If you typed only a number, tap tbsp, tsp, or g.",
      "Read the Result, then Copy result or Print.",
    ],
    exampleTitle: "Example",
    before: "Before",
    after: "After",
    faqTitle: "Questions",
    sourcesTitle: "Where the numbers come from",
    gapTitle: "What this does not cover",
  },
  "zh-cn": {
    privacy: "你输入的内容只留在这个浏览器里，不会发送出去。",
    limits: "须大于 0。最多 100,000 克、16,000 汤匙或 48,000 茶匙。",
    lede: "选一种食材，就能在汤匙、茶匙和克之间换算。",
    quickLead: "1 美制汤匙约 14.8 毫升，等于 3 茶匙；克数要看食材。",
    amount: "数量",
    unitsLegend: "单位",
    tbsp: "汤匙",
    tsp: "茶匙",
    g: "克",
    ml: "毫升",
    oz: "盎司",
    cup: "杯",
    stick: "条",
    units: [["tbsp", "汤匙"], ["tsp", "茶匙"], ["g", "克"]],
    chips: [
      ["1 汤匙", "tbsp", "1 汤匙"],
      ["2 汤匙", "tbsp", "2 汤匙"],
      ["1 茶匙", "tsp", "1 茶匙"],
      ["1/2 茶匙", "tsp", "1/2 茶匙"],
      ["15 克", "g", "15 克"],
      ["100 克", "g", "100 克"],
    ],
    opening: "1 汤匙",
    spoonLegend: "汤匙",
    spoons: { us: "美制汤匙（14.8 毫升）", metric: "公制汤匙（15 毫升）" },
    group: "按匙计",
    usingTyped: "按你输入的{name}计算。",
    kosher: "粗盐要看牌子：Diamond Crystal 一汤匙 8 克，Morton 一汤匙 16 克，是两倍。请在食材里选一种。",
    nocup: "{name}没有杯的数据。请改用汤匙、茶匙或克。",
    tiny: "不到 1/8 茶匙，请用秤。",
    result: "结果",
    rows: { otherTbsp: "汤匙", otherTsp: "茶匙", ml: "毫升", oz: "盎司", cups: "杯", kitchen: "厨房量法" },
    copy: "复制结果",
    copied: "已复制",
    copyFail: "请选中结果文字再复制",
    print: "打印",
    chartTitle: "一匙多少克",
    chartHead: ["食材", "1 汤匙", "1 茶匙"],
    onlyTitle: "按匙计",
    onlyNote: "粗盐牌子差很多：Diamond Crystal 一汤匙 8 克，Morton 一汤匙 16 克，是两倍。",
    compareTitle: "美制汤匙和公制汤匙",
    compareHead: ["食材", "美制汤匙", "公制汤匙"],
    compareNote: "公制汤匙是 15 毫升，美制汤匙约 14.8 毫升，大约多 1.4%。",
    cupTitle: "汤匙和杯",
    cupHead: ["杯", "汤匙", "茶匙", "毫升"],
    howtoTitle: "怎么用",
    steps: [
      "先选食材，再在数量里输入 2 汤匙或 15 克，或点 1 汤匙、1 茶匙、15 克。",
      "如果只输入数字，再点汤匙、茶匙或克。",
      "看结果，然后复制结果或打印。",
    ],
    exampleTitle: "例子",
    before: "换算前",
    after: "换算后",
    faqTitle: "常见问题",
    sourcesTitle: "这些数字从哪来",
    gapTitle: "这里不算哪些",
  },
  "zh-tw": {
    privacy: "你輸入的內容只留在這個瀏覽器，不會送出去。",
    limits: "須大於 0。最多 100,000 克、16,000 湯匙或 48,000 茶匙。",
    lede: "選一種食材，就能在湯匙、茶匙和克之間換算。",
    quickLead: "1 美制湯匙約 14.8 毫升，等於 3 茶匙；克數要看食材。",
    amount: "數量",
    unitsLegend: "單位",
    tbsp: "湯匙",
    tsp: "茶匙",
    g: "克",
    ml: "毫升",
    oz: "盎司",
    cup: "杯",
    stick: "條",
    units: [["tbsp", "湯匙"], ["tsp", "茶匙"], ["g", "克"]],
    chips: [
      ["1 湯匙", "tbsp", "1 湯匙"],
      ["2 湯匙", "tbsp", "2 湯匙"],
      ["1 茶匙", "tsp", "1 茶匙"],
      ["1/2 茶匙", "tsp", "1/2 茶匙"],
      ["15 克", "g", "15 克"],
      ["100 克", "g", "100 克"],
    ],
    opening: "1 湯匙",
    spoonLegend: "湯匙",
    spoons: { us: "美制湯匙（14.8 毫升）", metric: "公制湯匙（15 毫升）" },
    group: "按匙計",
    usingTyped: "按你輸入的{name}計算。",
    kosher: "粗鹽要看牌子：Diamond Crystal 一湯匙 8 克，Morton 一湯匙 16 克，是兩倍。請在食材裡選一種。",
    nocup: "{name}沒有杯的數據。請改用湯匙、茶匙或克。",
    tiny: "不到 1/8 茶匙，請用秤。",
    result: "結果",
    rows: { otherTbsp: "湯匙", otherTsp: "茶匙", ml: "毫升", oz: "盎司", cups: "杯", kitchen: "廚房量法" },
    copy: "複製結果",
    copied: "已複製",
    copyFail: "請選中結果文字再複製",
    print: "列印",
    chartTitle: "一匙多少克",
    chartHead: ["食材", "1 湯匙", "1 茶匙"],
    onlyTitle: "按匙計",
    onlyNote: "粗鹽牌子差很多：Diamond Crystal 一湯匙 8 克，Morton 一湯匙 16 克，是兩倍。",
    compareTitle: "美制湯匙和公制湯匙",
    compareHead: ["食材", "美制湯匙", "公制湯匙"],
    compareNote: "公制湯匙是 15 毫升，美制湯匙約 14.8 毫升，大約多 1.4%。",
    cupTitle: "湯匙和杯",
    cupHead: ["杯", "湯匙", "茶匙", "毫升"],
    howtoTitle: "怎麼用",
    steps: [
      "先選食材，再在數量輸入 2 湯匙或 15 克，或點 1 湯匙、1 茶匙、15 克。",
      "如果只打數字，再點湯匙、茶匙或克。",
      "看結果，然後複製結果或列印。",
    ],
    exampleTitle: "例子",
    before: "換算前",
    after: "換算後",
    faqTitle: "常見問題",
    sourcesTitle: "這些數字從哪來",
    gapTitle: "這裡不算哪些",
  },
};

export function quickLines(lang) {
  const copy = spoonsCopy[lang];
  const row = (id, label) =>
    lang === "en"
      ? `${label}: 1 tbsp = ${quickNumber(id, "tbsp")} g · 1 tsp = ${quickNumber(id, "tsp")} g`
      : `${label}：1 ${copy.tbsp} = ${quickNumber(id, "tbsp")} ${copy.g} · 1 ${copy.tsp} = ${quickNumber(id, "tsp")} ${copy.g}`;
  const labels = lang === "en"
    ? ["Sugar", "Flour", "Butter"]
    : lang === "zh-cn"
      ? ["细砂糖", "中筋面粉", "黄油"]
      : ["細砂糖", "中筋麵粉", "奶油"];
  return [copy.quickLead, row("sugar", labels[0]), row("ap", labels[1]), row("butter", labels[2])];
}

export function exampleRows(lang) {
  const copy = spoonsCopy[lang];
  const salt = formatGrams(tbspGrams("salt") / 3 * 1.5);
  const sugarTbsp = formatGrams(tbspGrams("sugar") * 2);
  return lang === "en"
    ? [[ "2 tbsp sugar", `${sugarTbsp} g` ], [ "1 1/2 tsp salt", `${salt} g` ], [ "15 g sugar", "1.2 tbsp (1 tbsp + 0.6 tsp)" ]]
    : lang === "zh-cn"
      ? [[ "2 汤匙细砂糖", `${sugarTbsp} 克` ], [ "1 1/2 茶匙食盐", `${salt} 克` ], [ "15 克细砂糖", "1.2 汤匙（1 汤匙 + 0.6 茶匙）" ]]
      : [[ "2 湯匙細砂糖", `${sugarTbsp} 克` ], [ "1 1/2 茶匙食鹽", `${salt} 克` ], [ "15 克細砂糖", "1.2 湯匙（1 湯匙 + 0.6 茶匙）" ]];
}

export function faqEntries(lang) {
  const sugar = formatGrams(tbspGrams("sugar"));
  const flour = formatGrams(tbspGrams("ap"));
  const butter = formatGrams(tbspGrams("butter"));
  const water = formatGrams(tbspGrams("water"));
  const powder = formatGrams(tbspGrams("powdered"));
  if (lang === "zh-cn") {
    return [
      ["一汤匙是多少克？", `要看食材。1 美制汤匙大约是水 ${water} 克、细砂糖 ${sugar} 克、中筋面粉 ${flour} 克、黄油 ${butter} 克。`],
      ["一汤匙等于几茶匙？", "3 茶匙。"],
      ["为什么粗盐差这么多？", "Diamond Crystal 一汤匙 8 克，Morton 一汤匙 16 克。用哪种就选哪种。"],
      ["公制汤匙和美制汤匙一样吗？", "公制汤匙是 15 毫升，美制汤匙约 14.8 毫升，大约多 1.4%。"],
      ["为什么糖粉这里是 7.5 克，美国农业部写成 8.0 克？", `这里把 120 克一杯除以 16，是 ${powder} 克。美国农业部的一汤匙条目是 8.0 克。在意的时候请用秤。黄油换算页把同一份 14.175 克收成整数 14 克。`],
    ];
  }
  if (lang === "zh-tw") {
    return [
      ["一湯匙是多少克？", `要看食材。1 美制湯匙大約是水 ${water} 克、細砂糖 ${sugar} 克、中筋麵粉 ${flour} 克、奶油 ${butter} 克。`],
      ["一湯匙等於幾茶匙？", "3 茶匙。"],
      ["為什麼粗鹽差這麼多？", "Diamond Crystal 一湯匙 8 克，Morton 一湯匙 16 克。用哪一種就選哪一種。"],
      ["公制湯匙和美制湯匙一樣嗎？", "公制湯匙是 15 毫升，美制湯匙約 14.8 毫升，大約多 1.4%。"],
      ["為什麼糖粉這裡是 7.5 克，美國農業部寫成 8.0 克？", `這裡把 120 克一杯除以 16，是 ${powder} 克。美國農業部的一湯匙條目是 8.0 克。在意的時候請用秤。奶油換算頁把同一份 14.175 克收成整數 14 克。`],
    ];
  }
  return [
    ["How many grams is a tablespoon?", `It depends on the ingredient. One US tablespoon is about ${water} g of water, ${sugar} g of granulated sugar, ${flour} g of all-purpose flour, and ${butter} g of butter.`],
    ["How many teaspoons are in a tablespoon?", "3."],
    ["Why is kosher salt so different?", "Diamond Crystal is 8 g per tablespoon and Morton is 16 g, twice as much. Pick the brand you have."],
    ["Is a metric tablespoon the same as a US one?", "A metric tablespoon is 15 mL. A US tablespoon is about 14.8 mL, so the metric spoon holds about 1.4% more."],
    ["Why does powdered sugar show 7.5 g when USDA lists 8.0 g?", `This page divides the 120 g cup by 16, which is ${powder} g. USDA's tablespoon entry is 8.0 g. Weigh when it matters. The butter page rounds that same 14.175 g tablespoon to 14 g.`],
  ];
}

export function sourceParagraphs(lang) {
  const tbspMl = roundTo(US_TBSP_ML, 1).toFixed(1);
  if (lang === "zh-cn") {
    return [
      `杯重来自这个网站已有的食材数据。1 美制杯 = 16 汤匙 = 48 茶匙 = 236.5882365 毫升，所以 1 美制汤匙约 ${tbspMl} 毫升。公制汤匙是 15 毫升，茶匙是 5 毫升。`,
      `${USDA_CREDIT}。按匙计的 7 种食材来自 King Arthur Baking 食材重量表，公制是按体积换算来的。黄油 1 汤匙是 4 盎司一条的 1/8，14.175 克。`,
      "这里按平匙计算。细砂糖 1 茶匙算出来是 4.17 克，美国农业部写成 4.2 克，四舍五入后一样。糖粉这里是 7.5 克，美国农业部的一汤匙条目是 8.0 克。",
    ];
  }
  if (lang === "zh-tw") {
    return [
      `杯重來自這個網站已有的食材數據。1 美制杯 = 16 湯匙 = 48 茶匙 = 236.5882365 毫升，所以 1 美制湯匙約 ${tbspMl} 毫升。公制湯匙是 15 毫升，茶匙是 5 毫升。`,
      `${USDA_CREDIT}。按匙計的 7 種食材來自 King Arthur Baking 食材重量表，公制是按體積換算來的。奶油 1 湯匙是 4 盎司一條的 1/8，14.175 克。`,
      "這裡按平匙計算。細砂糖 1 茶匙算出來是 4.17 克，美國農業部寫成 4.2 克，四捨五入後一樣。糖粉這裡是 7.5 克，美國農業部的一湯匙條目是 8.0 克。",
    ];
  }
  return [
    `Cup weights come from this site's ingredient data. 1 US cup = 16 tbsp = 48 tsp = 236.5882365 mL, so 1 US tablespoon is about ${tbspMl} mL. A metric tablespoon is 15 mL and a metric teaspoon is 5 mL.`,
    `${USDA_CREDIT}. The 7 by-the-spoon figures come from the King Arthur Baking Ingredient Weight Chart, and the metric values are derived by volume. One tablespoon of butter is 1/8 of a 4 oz stick, 14.175 g.`,
    "We assume level spoons. Granulated sugar works out to 4.17 g per teaspoon; USDA lists 4.2 g, which matches once it is rounded. Powdered sugar here is 7.5 g; USDA's tablespoon entry is 8.0 g.",
  ];
}

export function gapParagraphs(lang) {
  if (lang === "zh-cn") {
    return [
      "这里不算堆满的匙，也不算压实的匙。红糖例外，它本来就是压实的。没有澳大利亚 20 毫升的大匙。",
      "没列出的盐、酵母和膨松剂不算，例如干酵母或海盐。这是厨房估算，秤最准。",
    ];
  }
  if (lang === "zh-tw") {
    return [
      "這裡不算堆滿的匙，也不算壓實的匙。紅糖例外，它本來就是壓實的。沒有澳洲 20 毫升的大匙。",
      "沒列出的鹽、酵母和膨鬆劑不算，例如乾酵母或海鹽。這是廚房估算，秤最準。",
    ];
  }
  return [
    "This page does not cover heaping spoons, or packed spoons, except brown sugar, which is packed as listed. It does not include the 20 mL Australian tablespoon.",
    "Salts, yeasts, and leaveners that are not listed are not covered, for example active dry yeast or sea salt. This is a kitchen estimate. A scale is most accurate.",
  ];
}

export function tableBundle() {
  return {
    grams: gramsPerSpoonRows(),
    only: spoonOnlyRows("us"),
    compare: usMetricRows(),
    cups: cupSpoonRows(),
  };
}

export function percentMore() {
  return oneDecimal(((15 / US_TBSP_ML) - 1) * 100);
}
