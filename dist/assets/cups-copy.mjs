import { formatScoop, ingredientById, trimNumber } from "./cups.mjs";

export const KING_ARTHUR_URL = "https://www.kingarthurbaking.com/learn/ingredient-weight-chart";

export function fdcUrl(id) {
  return `https://fdc.nal.usda.gov/food-details/${id}/nutrients`;
}

const notesEn = {
  ap: "Spoon the flour into the cup and level it; a scooped cup is heavier.",
  bread: "Spoon and level this the same way as all-purpose flour.",
  whole: "Whole wheat sits lighter in the cup than white flour.",
  sugar: "Granulated sugar uses 200 g for one US cup.",
  brown: "This is packed brown sugar; unpacked brown sugar is much lighter.",
  powdered: "This is unsifted powdered sugar; sifted sugar is lighter.",
  butter: "A US stick of butter is 4 oz (113 g), 8 tbsp, or half a US cup.",
  cocoa: "Unsweetened cocoa powder is much lighter than flour.",
  oats: "These are old-fashioned rolled oats, not oat flour.",
  rice: "This is raw long-grain rice, not a 180 ml rice-cooker cup.",
  honey: "Honey is thick, so a cup weighs much more than a cup of water.",
  milk: "Whole milk is a little heavier than water.",
  water: "Water weighs 1 g per ml.",
  oil: "Vegetable oil is lighter than water.",
  olive: "Olive oil is a little lighter than most vegetable oil.",
  corn: "Cornstarch is slightly heavier per cup than flour.",
};

const notesCn = {
  ap: "面粉先抖松再舀进杯子刮平，直接挖会更重。",
  bread: "高筋面粉同样用松粉舀平的装法。",
  whole: "全麦面粉比白面粉更蓬松，一杯比较轻。",
  sugar: "细砂糖用 200 克当作 1 美制杯。",
  brown: "这是压实的红糖；没压实会轻很多。",
  powdered: "这是未过筛的糖粉；过筛后比较轻。",
  butter: "一条美制黄油是 4 盎司（113 克）、8 汤匙，也就是半个美制杯。",
  cocoa: "无糖可可粉比面粉轻很多。",
  oats: "这是传统燕麦片，不是燕麦粉。",
  rice: "这是生的长米，不是 180 毫升的电饭锅量米杯。",
  honey: "蜂蜜很稠，一杯比一杯水重很多。",
  milk: "全脂牛奶比水稍重。",
  water: "水是每毫升 1 克。",
  oil: "植物油比水轻。",
  olive: "橄榄油比多数植物油再轻一点。",
  corn: "玉米淀粉一杯比面粉稍重。",
};

const notesTw = {
  ap: "麵粉先鬆開再舀進杯子刮平，直接挖會更重。",
  bread: "高筋麵粉同樣用鬆粉舀平的裝法。",
  whole: "全麥麵粉比白麵粉更蓬鬆，一杯比較輕。",
  sugar: "細砂糖用 200 克當作 1 美制杯。",
  brown: "這是壓實的紅糖；沒壓實會輕很多。",
  powdered: "這是未過篩的糖粉；過篩後比較輕。",
  butter: "一條美制奶油是 4 盎司（113 克）、8 湯匙，也就是半個美制杯。",
  cocoa: "無糖可可粉比麵粉輕很多。",
  oats: "這是傳統燕麥片，不是燕麥粉。",
  rice: "這是生的長米，不是 180 毫升的電鍋量米杯。",
  honey: "蜂蜜很稠，一杯比一杯水重很多。",
  milk: "全脂鮮奶比水稍重。",
  water: "水是每毫升 1 克。",
  oil: "植物油比水輕。",
  olive: "橄欖油比多數植物油再輕一點。",
  corn: "玉米澱粉一杯比麵粉稍重。",
};

const namesEn = {
  ap: "All-purpose flour",
  bread: "Bread flour",
  whole: "Whole wheat flour",
  sugar: "Granulated sugar",
  brown: "Brown sugar (packed)",
  powdered: "Powdered sugar (unsifted)",
  butter: "Butter",
  milk: "Whole milk",
  honey: "Honey",
  water: "Water",
  oil: "Vegetable oil",
  olive: "Olive oil",
  cocoa: "Cocoa powder (unsweetened)",
  oats: "Rolled oats (old-fashioned)",
  rice: "White rice (long-grain, raw)",
  corn: "Cornstarch",
};

const namesCn = {
  ap: "中筋面粉",
  bread: "高筋面粉",
  whole: "全麦面粉",
  sugar: "细砂糖",
  brown: "红糖（压实）",
  powdered: "糖粉（未过筛）",
  butter: "黄油",
  milk: "全脂牛奶",
  honey: "蜂蜜",
  water: "水",
  oil: "植物油",
  olive: "橄榄油",
  cocoa: "无糖可可粉",
  oats: "传统燕麦片",
  rice: "生白米（长米）",
  corn: "玉米淀粉",
};

const namesTw = {
  ap: "中筋麵粉",
  bread: "高筋麵粉",
  whole: "全麥麵粉",
  sugar: "細砂糖",
  brown: "紅糖（壓實）",
  powdered: "糖粉（未過篩）",
  butter: "奶油",
  milk: "全脂鮮奶",
  honey: "蜂蜜",
  water: "水",
  oil: "植物油",
  olive: "橄欖油",
  cocoa: "無糖可可粉",
  oats: "傳統燕麥片",
  rice: "生白米（長米）",
  corn: "玉米澱粉",
};

export const cupsCopy = {
  en: {
    limits: "Numbers stay in this browser: above 0, at most 100,000 g or 1,000 cups.",
    directionLegend: "Direction",
    gramsToCups: "Grams → Cups",
    cupsToGrams: "Cups → Grams",
    swap: "Swap direction",
    standardLegend: "Cup standard",
    systems: { us: "US cup", metric: "Metric cup", uk: "UK cup" },
    systemAdj: { us: "US", metric: "metric", uk: "UK" },
    standardHint:
      "A US cup is 236.59 ml. A metric cup is 250 ml, about 5.7% more, and is the cup used in Taiwan, Australia, and Canada. A UK cup is 284.13 ml, for old British recipes.",
    ingredientLegend: "Ingredient",
    amount: "Amount",
    quick: [
      ["ap", "Flour"],
      ["sugar", "Sugar"],
      ["brown", "Brown sugar"],
      ["butter", "Butter"],
      ["water", "Water"],
      ["honey", "Honey"],
    ],
    gramQuick: ["50g", "100g", "150g", "200g", "250g"],
    gramValues: ["50", "100", "150", "200", "250"],
    cupQuick: ["1/4", "1/3", "1/2", "3/4", "1", "1 1/2"],
    groups: {
      flour: "Flours",
      sugar: "Sugars",
      fat: "Fats and dairy",
      liquid: "Liquids",
      dry: "Other dry ingredients",
    },
    names: namesEn,
    notes: notesEn,
    result: "Result",
    copy: "Copy result",
    copied: "Copied",
    copyFail: "Select the result text and copy it",
    print: "Print",
    formatError: "Enter a number greater than 0, or a common fraction, for example 250 or 1 1/2.",
    limitError: "Enter a number greater than 0 and at most {max}, for example {example}.",
    detectedIngredient: "Detected {name}.",
    detectedDirection: {
      grams: "Detected grams, so this uses Grams → Cups.",
      cups: "Detected cups, so this uses Cups → Grams.",
    },
    detectedSystem: "Detected {system}.",
    unknown: "No listed density for {text}. Pick the closest ingredient from the menu, for example Flour.",
    readAs: 'I read this as {value} — I didn\'t recognize "{text}".',
    readAsBare: "I read this as {value}.",
    stickError: "A stick is a butter measure. Pick butter, or enter cups, grams, or tablespoons.",
    unitName: {
      g: "g",
      kg: "kg",
      oz: "oz",
      cup: "cup",
      cups: "cups",
      tbsp: "tbsp",
      tsp: "tsp",
      ml: "ml",
      stick: "stick",
      sticks: "sticks",
      lb: "lb",
    },
    units: { one: "cup", many: "cups", tbsp: "tbsp", tsp: "tsp" },
    cupWord: "cups",
    gramWord: "g",
    suffix: { cups: "cups", tbsp: "tbsp", tsp: "tsp", ml: "ml", g: "g", oz: "oz", stick: "stick" },
    rows: {
      cups: "Cups (decimal)",
      tbsp: "Tablespoons (tbsp)",
      tsp: "Teaspoons (tsp)",
      ml: "Milliliters (ml)",
      grams: "Grams (g)",
      oz: "Ounces (weight oz)",
      sticks: "Butter sticks",
    },
    nearest: "Nearest mark: {mark} (error {diff}).",
    far: "That mark is too far off. Use the practical scoop.",
    under: "Less than 1/8 cup. Use the tablespoons and teaspoons below.",
    scoop: "Practical scoop: {scoop}",
    using: "Using {weight} g per {system} ({ml} ml) for {name}. {note}",
    copyApprox: "approx. {mark}, or {scoop}",
    copyUnder: "< 1/8 cup, or {scoop}",
    chartTitle: "Common cup weights",
    chartHead: ["Ingredient", "1/4 cup", "1/3 cup", "1/2 cup", "1 cup"],
    howtoTitle: "How to use",
    steps: [
      "Choose an Ingredient, or tap Flour, Sugar, Brown sugar, Butter, Water, or Honey.",
      "Choose Grams → Cups or Cups → Grams, then US cup, Metric cup, or UK cup, and type the Amount.",
      "Read the Result, then Copy result or Print.",
    ],
    exampleTitle: "Example",
    before: "Before",
    after: "After",
    exampleRows: [
      ["250g flour", "2.08 US cups (2 cups + 1 tbsp + 1 tsp)"],
      ["1 1/2 cups flour", "180 g"],
    ],
    faqTitle: "Questions",
    faq: [
      [
        "Why pick an ingredient?",
        "A full cup of water, flour, and sugar do not weigh the same, so the converter needs the ingredient before it can turn weight into cups.",
      ],
      [
        "Which cup is this using?",
        "A US cup is 236.59 ml. A metric cup, common in Taiwan, Australia, and Canada, is 250 ml, about 5.7% larger. A UK cup is 284.13 ml and is only for old British recipes; modern UK recipes usually list grams, and Australian or New Zealand recipes should use the metric cup. A 240 ml cup used on some US package labels differs by about 1.4%, so there is no separate button for it. Some Australian recipes use a 20 ml tablespoon; metric tablespoons here are 15 ml. A rice-cooker cup of 180 ml is not a baking cup.",
      ],
      [
        "What is baker's percentage?",
        "Bakers write flour as 100%, then write water, salt, and yeast as a percentage of that flour. After the baker's percentage calculator gives grams, convert them to cups here.",
      ],
      [
        "Why can the same cup of flour weigh more?",
        "Spoon flour into the cup and level it. Scooping packs it heavier. Brown sugar here is packed, and powdered sugar is unsifted.",
      ],
    ],
    usda: "USDA FoodData Central",
    king: "King Arthur Baking ingredient weight chart",
  },
  "zh-cn": {
    limits: "数字留在这个浏览器里，克数大于 0 到 100,000，杯数大于 0 到 1,000。",
    directionLegend: "方向",
    gramsToCups: "克 → 杯",
    cupsToGrams: "杯 → 克",
    swap: "交换方向",
    standardLegend: "杯制",
    systems: { us: "美制杯", metric: "公制杯", uk: "英制杯" },
    systemAdj: { us: "美制", metric: "公制", uk: "英制" },
    standardHint:
      "美制杯是美国食谱的 1 杯，236.59 毫升。公制杯是台湾、澳洲和加拿大常见的 250 毫升，大约多 5.7%。英制杯是 284.13 毫升，只供对照英国老食谱。",
    ingredientLegend: "食材",
    amount: "数量",
    quick: [
      ["ap", "面粉"],
      ["sugar", "细砂糖"],
      ["brown", "红糖"],
      ["butter", "黄油"],
      ["water", "水"],
      ["honey", "蜂蜜"],
    ],
    gramQuick: ["50克", "100克", "150克", "200克", "250克"],
    gramValues: ["50", "100", "150", "200", "250"],
    cupQuick: ["1/4", "1/3", "1/2", "3/4", "1", "1 1/2"],
    groups: { flour: "面粉", sugar: "糖", fat: "油脂和乳品", liquid: "液体", dry: "其他干料" },
    names: namesCn,
    notes: notesCn,
    result: "结果",
    copy: "复制结果",
    copied: "已复制",
    copyFail: "请选中结果文字再复制",
    print: "打印",
    formatError: "请输入大于 0 的数字或常见分数（例如 250 或 1 1/2）。",
    limitError: "请输入大于 0、且不超过 {max} 的数字，例如 {example}。",
    detectedIngredient: "从文字辨认出{name}。",
    detectedDirection: { grams: "辨认出克，所以改用克 → 杯。", cups: "辨认出杯，所以改用杯 → 克。" },
    detectedSystem: "辨认出{system}。",
    unknown: "清单没有「{text}」这种食材。请从菜单挑选最接近的食材，例如面粉。",
    readAs: "我按 {value} 计算——看不懂“{text}”。",
    readAsBare: "我按 {value} 计算。",
    stickError: "“条”是黄油专用的单位。请选黄油，或改用杯、克、汤匙。",
    unitName: {
      g: "克",
      kg: "千克",
      oz: "盎司",
      cup: "杯",
      cups: "杯",
      tbsp: "汤匙",
      tsp: "茶匙",
      ml: "毫升",
      stick: "条",
      sticks: "条",
      lb: "磅",
    },
    units: { one: "杯", many: "杯", tbsp: "汤匙", tsp: "茶匙" },
    cupWord: "杯",
    gramWord: "克",
    suffix: { cups: "杯", tbsp: "汤匙", tsp: "茶匙", ml: "毫升", g: "克", oz: "盎司", stick: "条" },
    rows: {
      cups: "杯（小数）",
      tbsp: "汤匙",
      tsp: "茶匙",
      ml: "毫升",
      grams: "克",
      oz: "盎司（重量，不是液量）",
      sticks: "黄油条",
    },
    nearest: "最接近的刻度：{mark}（误差 {diff}）。",
    far: "这个刻度差太远，请用实用勺取。",
    under: "不到 1/8 杯，请改用下面的汤匙和茶匙。",
    scoop: "实用勺取：{scoop}",
    using: "按{name}每{system} {weight} 克（{ml} 毫升）计算。{note}",
    copyApprox: "约 {mark}，或 {scoop}",
    copyUnder: "不到 1/8 杯，或 {scoop}",
    chartTitle: "常用食材的杯重",
    chartHead: ["食材", "1/4 杯", "1/3 杯", "1/2 杯", "1 杯"],
    howtoTitle: "怎么用",
    steps: [
      "选择食材，或点面粉、细砂糖、红糖、黄油、水、蜂蜜。",
      "选择克 → 杯或杯 → 克，再选美制杯、公制杯或英制杯，并输入数量。",
      "看结果，然后复制结果或打印。",
    ],
    exampleTitle: "例子",
    before: "换算前",
    after: "换算后",
    exampleRows: [
      ["250克面粉", "2.08 美制杯（2 杯 + 1 汤匙 + 1 茶匙）"],
      ["1 1/2 杯面粉", "180 克"],
    ],
    faqTitle: "常见问题",
    faq: [
      ["为什么要先选食材？", "同样满 1 杯，水、面粉和糖的重量都不一样，所以一定要先选食材才能算。"],
      [
        "美制杯和公制杯有什么差别？",
        "美制杯是美国食谱的 1 杯，236.59 毫升。公制杯是台湾、澳洲和加拿大常见的 250 毫升，大约多 5.7%。英制杯是 284.13 毫升，只供对照英国老食谱；现在的英国食谱多半直接写克，澳新食谱请用公制杯。有些美国包装上的 240 毫升杯大约差 1.4%，这里不另设按钮。澳洲有些食谱的大匙是 20 毫升，本工具的公制大匙用 15 毫升。电饭锅量米杯是 180 毫升，不是烘焙量杯。",
      ],
      [
        "什么是烘焙百分比？",
        "烘焙百分比是面包师傅把面粉当 100%，水、盐和酵母都用占面粉重量的百分比来写。算好克数后，可以拿到这里换成量杯。",
      ],
      ["为什么同样一杯面粉重量会不同？", "面粉先抖松再舀平。直接挖会更重。这里的红糖是压实的，糖粉是未过筛的。"],
    ],
    usda: "美国农业部 FoodData Central",
    king: "King Arthur Baking 食材重量表",
  },
  "zh-tw": {
    limits: "數字留在這個瀏覽器裡，克數大於 0 到 100,000，杯數大於 0 到 1,000。",
    directionLegend: "方向",
    gramsToCups: "克 → 杯",
    cupsToGrams: "杯 → 克",
    swap: "交換方向",
    standardLegend: "杯制",
    systems: { us: "美制杯", metric: "公制杯", uk: "英制杯" },
    systemAdj: { us: "美制", metric: "公制", uk: "英制" },
    standardHint:
      "美制杯：美國食譜的 1 杯是 236.59 毫升，台灣、澳洲與加拿大常見的公制量杯則是 250 毫升，相差約 5.7%。英制杯是 284.13 毫升，只供對照英國老食譜。",
    ingredientLegend: "食材",
    amount: "數量",
    quick: [
      ["ap", "麵粉"],
      ["sugar", "細砂糖"],
      ["brown", "紅糖"],
      ["butter", "奶油"],
      ["water", "水"],
      ["honey", "蜂蜜"],
    ],
    gramQuick: ["50克", "100克", "150克", "200克", "250克"],
    gramValues: ["50", "100", "150", "200", "250"],
    cupQuick: ["1/4", "1/3", "1/2", "3/4", "1", "1 1/2"],
    groups: { flour: "麵粉", sugar: "糖", fat: "油脂和乳品", liquid: "液體", dry: "其他乾料" },
    names: namesTw,
    notes: notesTw,
    result: "結果",
    copy: "複製結果",
    copied: "已複製",
    copyFail: "請選中結果文字再複製",
    print: "列印",
    formatError: "請輸入大於 0 的數字或常見分數（例如 250 或 1 1/2）。",
    limitError: "請輸入大於 0、且不超過 {max} 的數字，例如 {example}。",
    detectedIngredient: "從文字辨認出{name}。",
    detectedDirection: { grams: "辨認出克，所以改用克 → 杯。", cups: "辨認出杯，所以改用杯 → 克。" },
    detectedSystem: "辨認出{system}。",
    unknown: "清單沒有「{text}」這種食材。請從選單挑選最接近的食材，例如麵粉。",
    readAs: "我當成 {value} 計算——看不懂「{text}」。",
    readAsBare: "我當成 {value} 計算。",
    stickError: "「條」是奶油專用的單位。請選奶油，或改用杯、克、湯匙。",
    unitName: {
      g: "克",
      kg: "千克",
      oz: "盎司",
      cup: "杯",
      cups: "杯",
      tbsp: "湯匙",
      tsp: "茶匙",
      ml: "毫升",
      stick: "條",
      sticks: "條",
      lb: "磅",
    },
    units: { one: "杯", many: "杯", tbsp: "湯匙", tsp: "茶匙" },
    cupWord: "杯",
    gramWord: "克",
    suffix: { cups: "杯", tbsp: "湯匙", tsp: "茶匙", ml: "毫升", g: "克", oz: "盎司", stick: "條" },
    rows: {
      cups: "杯（小數）",
      tbsp: "湯匙",
      tsp: "茶匙",
      ml: "毫升",
      grams: "克",
      oz: "盎司（重量，不是液量）",
      sticks: "奶油條",
    },
    nearest: "最接近的刻度：{mark}（誤差 {diff}）。",
    far: "這個刻度差太遠，請用湯匙／茶匙量法。",
    under: "不到 1/8 杯，請改用下面的湯匙和茶匙。",
    scoop: "湯匙／茶匙量法：{scoop}",
    using: "按{name}每{system} {weight} 克（{ml} 毫升）計算。{note}",
    copyApprox: "約 {mark}，或 {scoop}",
    copyUnder: "不到 1/8 杯，或 {scoop}",
    chartTitle: "常用食材的杯重",
    chartHead: ["食材", "1/4 杯", "1/3 杯", "1/2 杯", "1 杯"],
    howtoTitle: "怎麼用",
    steps: [
      "選擇食材，或點麵粉、細砂糖、紅糖、奶油、水、蜂蜜。",
      "選擇克 → 杯或杯 → 克，再選美制杯、公制杯或英制杯，並輸入數量。",
      "看結果，然後複製結果或列印。",
    ],
    exampleTitle: "例子",
    before: "換算前",
    after: "換算後",
    exampleRows: [
      ["250克麵粉", "2.08 美制杯（2 杯 + 1 湯匙 + 1 茶匙）"],
      ["1 1/2 杯麵粉", "180 克"],
    ],
    faqTitle: "常見問題",
    faq: [
      [
        "為什麼要先選食材？",
        "同樣滿 1 杯，水、麵粉和糖的重量都不一樣，所以一定要先選食材才能算。",
      ],
      [
        "美制杯和公制杯差在哪？",
        "美制杯是美國食譜的 1 杯，236.59 毫升。公制杯是台灣、澳洲與加拿大常見的 250 毫升，相差約 5.7%。英制杯是 284.13 毫升，只供對照英國老食譜；現在的英國食譜多半直接寫克，澳紐食譜請用公制杯。有些美國包裝上的 240 毫升杯大約差 1.4%，這裡不另設按鈕。澳洲有些食譜的大匙是 20 毫升，這個工具的公制大匙用 15 毫升。電鍋量米杯是 180 毫升，不是烘焙量杯。",
      ],
      [
        "烘焙百分比是什麼？",
        "烘焙百分比：麵包師傅把麵粉當 100%，水、鹽和酵母都用占麵粉重量的百分比來寫，算好克數後就可以拿來這裡換成量杯。",
      ],
      ["為什麼同樣一杯麵粉重量會不同？", "麵粉先鬆開再舀平。直接挖會更重。這裡的紅糖是壓實的，糖粉是未過篩的。"],
    ],
    usda: "美國農業部 FoodData Central",
    king: "King Arthur Baking 食材重量表",
  },
};

function cupPhrase(label, copy) {
  if (label === "1") return `1 ${copy.units.one}`;
  if (label.includes(" ")) return `${label} ${copy.units.many}`;
  if (/^\d+$/.test(label)) return `${label} ${copy.units.many}`;
  return `${label} ${copy.units.one}`;
}

export function present(result, lang) {
  const copy = cupsCopy[lang];
  const name = copy.names[result.ingredient];
  const scoop = formatScoop(result.scoopParts, copy.units);
  const far = !result.nearest.under && Math.abs(result.nearest.pct) >= 5;
  const mark = result.nearest.under ? "" : cupPhrase(result.nearest.label, copy);
  const frac = result.nearest.under
    ? copy.under
    : copy.nearest.replace("{mark}", mark).replace("{diff}", result.nearest.diff);
  const approx = result.nearest.under
    ? copy.copyUnder.replace("{scoop}", scoop)
    : copy.copyApprox.replace("{mark}", mark).replace("{scoop}", scoop);
  const gramsBit = lang === "en" ? `${result.gramsLabel} g` : `${result.gramsLabel} ${copy.gramWord}`;
  const cupsBit = lang === "en" ? `${result.cupsText} ${copy.systemAdj[result.system]} cups` : `${result.cupsText} ${copy.systemAdj[result.system]}杯`;
  const copyText =
    lang === "en"
      ? `${gramsBit} ${name} = ${cupsBit} (${approx}) · ${result.tbspText} tbsp · ${result.mlText} ml · ${result.ozText} oz`
      : `${gramsBit} ${name} = ${cupsBit}（${approx}） · ${result.tbspText} ${copy.suffix.tbsp} · ${result.mlText} ${copy.suffix.ml} · ${result.ozText} ${copy.suffix.oz}`;
  const gramsFirst = result.hero === "grams" || (result.hero !== "cups" && result.direction !== "grams");
  return {
    main: gramsFirst ? `${result.gramsLabel} ${copy.gramWord}` : `${result.cupsText} ${copy.cupWord}`,
    frac,
    warn: far ? copy.far : "",
    scoop: scoop ? copy.scoop.replace("{scoop}", scoop) : "",
    cups: `${result.cupsText} ${copy.suffix.cups}`,
    tbsp: `${result.tbspText} ${copy.suffix.tbsp}`,
    tsp: `${result.tspText} ${copy.suffix.tsp}`,
    ml: `${result.mlText} ${copy.suffix.ml}`,
    grams: `${result.gramsLabel} ${copy.suffix.g}`,
    oz: `${result.ozText} ${copy.suffix.oz}`,
    sticks: result.sticksText ? `${result.sticksText} ${copy.suffix.stick}` : "",
    showSticks: result.ingredient === "butter",
    under: result.nearest.under,
    convention: copy.using
      .replace("{weight}", result.cupWeightText)
      .replace("{system}", copy.systems[result.system])
      .replace("{ml}", result.cupMlText)
      .replace("{name}", name)
      .replace("{note}", copy.notes[result.ingredient]),
    copyText,
    fdc: ingredientById(result.ingredient).fdc,
  };
}

export function readAsValue(parsed, lang, mode = "grams") {
  const copy = cupsCopy[lang];
  const n = trimNumber(parsed.count ?? parsed.value);
  const unit = parsed.unit;
  if (!unit) return mode === "cups" ? `${n} ${copy.cupWord}` : `${n} ${copy.gramWord}`;
  if (unit === "stick") return `${n} ${Number(n) > 1 ? copy.unitName.sticks : copy.unitName.stick}`;
  if (unit === "cup") return `${n} ${Number(n) === 1 ? copy.unitName.cup : copy.unitName.cups}`;
  return `${n} ${copy.unitName[unit] || unit}`;
}

export function detectionNote(parsed, lang, options = {}) {
  if (!parsed?.ok) return "";
  const copy = cupsCopy[lang];
  const mode = options.mode || "grams";
  const bits = [];
  if (parsed.ingredientDetected) bits.push(copy.detectedIngredient.replace("{name}", copy.names[parsed.ingredient]));
  if (parsed.unrecognized) {
    bits.push(copy.readAs.replace("{value}", readAsValue(parsed, lang, mode)).replace("{text}", parsed.unrecognized));
  } else if (parsed.unknown && !options.pageIngredient) {
    bits.push(copy.unknown.replace("{text}", parsed.unknown));
  } else if (parsed.unknown && options.pageIngredient) {
    bits.push(copy.readAs.replace("{value}", readAsValue(parsed, lang, mode)).replace("{text}", parsed.unknown));
  } else if (parsed.assumed) {
    bits.push(copy.readAsBare.replace("{value}", readAsValue(parsed, lang, mode)));
  }
  if (parsed.directionDetected && !options.skipDirection) bits.push(copy.detectedDirection[parsed.direction]);
  if (parsed.system) bits.push(copy.detectedSystem.replace("{system}", copy.systems[parsed.system]));
  return bits.join(" ");
}

function limitMax(limit, unit, lang) {
  if (!unit) return String(limit);
  const copy = cupsCopy[lang];
  const plural = Number(limit) === 1 ? unit : unit === "stick" ? "sticks" : unit === "cup" ? "cups" : unit;
  const name = copy.unitName[plural] || copy.unitName[unit] || unit;
  const num = Number(limit).toLocaleString("en-US");
  return `${num} ${name}`;
}

function limitExample(limit, unit) {
  if (unit === "stick" || unit === "tbsp" || unit === "tsp") return "2";
  if (!unit && Number(limit) > 1000) return "250";
  if (unit === "g" && Number(limit) > 1000) return "250";
  return "1.5";
}

export function errorText(reason, lang, limit, unit) {
  const copy = cupsCopy[lang];
  if (reason === "limit") {
    const max = limitMax(limit, unit, lang);
    const text = copy.limitError.replace("{max}", max).replace("{example}", limitExample(limit, unit));
    return unit && lang !== "en" ? text.replace(`${max} 的`, `${max}的`) : text;
  }
  return copy.formatError;
}
