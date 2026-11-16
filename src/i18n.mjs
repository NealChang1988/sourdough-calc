export const LANGS = ["en", "zh-cn", "zh-tw"];

export const HTML_LANG = {
  en: "en",
  "zh-cn": "zh-CN",
  "zh-tw": "zh-TW",
};

export const HREFLANG = {
  en: "en",
  "zh-cn": "zh-CN",
  "zh-tw": "zh-TW",
};

export const OG_LOCALE = {
  en: "en_US",
  "zh-cn": "zh_CN",
  "zh-tw": "zh_TW",
};

export const FAMILIES = ["sourdough", "yeast", "flat", "rolls", "pizza"];

const en = {
  siteName: "Dough calculator",
  skip: "Skip to the calculator",
  langLabel: "Language",
  crumbLabel: "Breadcrumb",
  footerNav: "More pages",
  footer: "Ratios for home baking.",
  modeLabel: "How to scale",
  modeFlour: "From flour weight",
  modeBalls: "From dough balls",
  flour: "Flour",
  hydration: "Hydration",
  starter: "Starter",
  salt: "Salt",
  yeast: "Yeast",
  yeastHint: "Optional. Use 0 when the dough has no added yeast.",
  balls: "Dough balls",
  perBall: "Grams per ball",
  water: "Water",
  total: "Total dough",
  grams: "g",
  result: "Recipe",
  effective: "Effective hydration",
  convention:
    "Percentages are of the flour you weigh out, and effective hydration also counts the flour and water inside a starter that is itself 100% hydration.",
  copy: "Copy recipe",
  copied: "Copied",
  copyFail: "Select the recipe text and copy it",
  print: "Print",
  related: "Related calculators",
  featured: "Common doughs",
  error:
    "Enter a flour weight above zero, or a ball count and grams per ball above zero. Percentages cannot be negative.",
  categories: {
    hydration: "Sourdough hydration",
    pizza: "Pizza dough",
    bread: "Bread dough",
    starter: "Starter percentage",
    salt: "Salt percentage",
  },
  families: {
    sourdough: "Sourdough",
    yeast: "Yeasted bread",
    flat: "Flatbreads",
    rolls: "Rolls and buns",
    pizza: "Pizza dough",
  },
  home: {
    title: "Sourdough and Baker's Percentage Calculator",
    h1: "Baker's Percentage Calculator",
    description:
      "Turn baker's percentages into grams for sourdough, pizza dough, and bread. Enter flour, or start from dough balls.",
    intro: [
      "Flour is 100%. Water, starter, salt, and yeast are percentages of that flour. Type a flour weight, or switch to dough balls and the calculator solves the flour from the total weight you want.",
      "A usual country sourdough is 75% hydration, 20% starter, and 2% salt. The numbers below start there. Pizza dough is often a little drier, with yeast instead of starter.",
    ],
  },
  hubs: {
    hydration: {
      slug: "sourdough-hydration",
      title: "Sourdough Hydration Calculators",
      h1: "Sourdough Hydration Calculators",
      description:
        "Sourdough calculators from 60% to 90% hydration, each scaled from 500 g of flour with 20% starter and 2% salt.",
      intro:
        "Hydration is water weight divided by the flour you weigh out. Lower doughs knead smooth and slice evenly. Higher doughs need folds and often a pan. Pick a percentage and the calculator opens with that water level.",
    },
    pizza: {
      slug: "pizza-dough",
      title: "Pizza Dough Calculators",
      h1: "Pizza Dough Calculators",
      description:
        "Pizza dough calculators for Neapolitan, New York, pan, Sicilian, thin crust, sourdough, same-day, and cold-fermented dough, by ball count.",
      intro:
        "Each page scales one pizza style to a number of dough balls. The ball weight changes with the style, from a small Neapolitan pie to a larger New York round or a pan portion. Yeast is included. Sourdough pizza uses starter instead.",
    },
    bread: {
      slug: "bread-dough",
      title: "Bread Baker's Percentages",
      h1: "Bread Baker's Percentages",
      description:
        "Baker's percentages for focaccia, ciabatta, baguette, bagel, sandwich loaf, rolls, and sourdough, in grams.",
      intro:
        "These are lean dough ratios for common breads. Flour, water, starter, salt, and yeast are calculated. Butter, egg, milk, and oil are mentioned only when a bread traditionally adds them, and those extras are not in the gram total.",
    },
    starter: {
      slug: "starter-percentage",
      title: "Sourdough Starter Percentage",
      h1: "Sourdough Starter Percentage",
      description:
        "Compare 10% to 40% sourdough starter on 500 g of flour at 75% hydration and 2% salt.",
      intro:
        "Starter percentage is levain weight divided by the flour you weigh out. Less starter means a longer bulk proof. More starter makes a faster dough. The hydration and salt stay fixed here so you can see the starter change on its own.",
    },
    salt: {
      slug: "salt-percentage",
      title: "Salt Percentage for Dough",
      h1: "Salt Percentage for Dough",
      description:
        "Salt from 1.5% to 3% of flour weight, on a 70% hydration sourdough with 20% starter.",
      intro:
        "Salt is a percentage of the flour you weigh out. Around 2% is usual for country bread. Less salt speeds fermentation. More salt tightens the dough and slows it, which is common in some pizza doughs.",
    },
  },
  notFoundTitle: "Page not found",
  notFoundBody: "That page is not on this site. Open the calculator in your language.",
};

const zhCn = {
  siteName: "面团计算器",
  skip: "跳到计算器",
  langLabel: "语言",
  crumbLabel: "当前位置",
  footerNav: "更多页面",
  footer: "家庭烘焙用的比例。",
  modeLabel: "怎么算",
  modeFlour: "按面粉重量",
  modeBalls: "按面团球",
  flour: "面粉",
  hydration: "水合",
  starter: "酸种",
  salt: "盐",
  yeast: "酵母",
  yeastHint: "可选。不加酵母就填 0。",
  balls: "面团球数",
  perBall: "每球克数",
  water: "水",
  total: "面团总重",
  grams: "克",
  result: "配方",
  effective: "有效水合",
  convention:
    "百分比以你称出的面粉为基准，有效水合则把本身为 100% 水合的酸种里的面粉和水也算进去。",
  copy: "复制配方",
  copied: "已复制",
  copyFail: "请选中配方文字再复制",
  print: "打印",
  related: "相关计算",
  featured: "常用面团",
  error: "面粉重量要大于 0。如果按面团球计算，球数和每球克数也要大于 0。百分比不能为负。",
  categories: {
    hydration: "酸种水合",
    pizza: "披萨面团",
    bread: "面包面团",
    starter: "酸种比例",
    salt: "盐的比例",
  },
  families: {
    sourdough: "酸种",
    yeast: "酵母面包",
    flat: "平烤饼",
    rolls: "餐包",
    pizza: "披萨面团",
  },
  home: {
    title: "酸种与烘焙百分比计算器",
    h1: "烘焙百分比计算器",
    description: "把烘焙百分比换成克数，用来算酸种、披萨面团和面包。可以输入面粉重量，也可以从面团球反推。",
    intro: [
      "面粉是 100%。水、酸种、盐和酵母都是相对这份面粉的百分比。输入面粉重量，或改成按面团球计算，计算器会反推出面粉。",
      "常见的乡村酸种是水合 75%、酸种 20%、盐 2%。下面的数字就是从这个例子开始的。披萨面团通常更干一些，用酵母而不是酸种。",
    ],
  },
  hubs: {
    hydration: {
      slug: "suanzhong-shuihe",
      title: "酸种水合计算器",
      h1: "酸种水合计算器",
      description: "水合从 60% 到 90% 的酸种计算器，都以 500 克面粉、20% 酸种、2% 盐为起点。",
      intro: "水合是水的重量除以你称出的面粉。水合低的面团好揉、切片整齐。水合高的面团要折叠，也常常需要烤模。选一个百分比，计算器会带上对应的水量。",
    },
    pizza: {
      slug: "pisa-fenlei",
      title: "披萨面团计算器",
      h1: "披萨面团计算器",
      description: "那不勒斯、纽约风、盘烤、西西里、薄皮、酸种、当日和冷藏发酵披萨面团，按球数计算。",
      intro: "每个页面把一种披萨面团缩放到指定的球数。每球重量随风格变化，从较小的那不勒斯饼到较大的纽约风圆饼或一份盘烤面团。配方含酵母。酸种披萨用酸种，不加酵母。",
    },
    bread: {
      slug: "mianbao-baifenbi",
      title: "面包烘焙百分比",
      h1: "面包烘焙百分比",
      description: "佛卡夏、恰巴塔、法棍、贝果、吐司和酸种的烘焙百分比，直接换成克数。",
      intro: "这里是常见面包的瘦面团比例，计算面粉、水、酸种、盐和酵母。黄油、鸡蛋、牛奶和油只在传统做法需要时提到，而且不计入克数合计。",
    },
    starter: {
      slug: "suanzhong-bili",
      title: "酸种比例计算",
      h1: "酸种比例计算",
      description: "在 500 克面粉、水合 75%、盐 2% 的条件下，比较 10% 到 40% 的酸种。",
      intro: "酸种比例是酸种重量除以你称出的面粉。酸种少，基本发酵更久。酸种多，面团更快。这里固定水合和盐，方便只看酸种的变化。",
    },
    salt: {
      slug: "yan-bili",
      title: "面团盐的比例",
      h1: "面团盐的比例",
      description: "盐从面粉重量的 1.5% 到 3%，面团为水合 70%、酸种 20% 的酸种面团。",
      intro: "盐是你称出的面粉的百分比。乡村面包常见大约 2%。盐少，发酵更快。盐多，面团更紧、更慢，一些披萨会用到这个范围。",
    },
  },
  notFoundTitle: "找不到页面",
  notFoundBody: "这个地址没有对应页面。请打开你的语言版本。",
};

const zhTw = {
  siteName: "麵團計算器",
  skip: "跳到計算器",
  langLabel: "語言",
  crumbLabel: "目前位置",
  footerNav: "更多頁面",
  footer: "家庭烘焙用的比例。",
  modeLabel: "怎麼算",
  modeFlour: "按麵粉重量",
  modeBalls: "按麵團球",
  flour: "麵粉",
  hydration: "水合",
  starter: "酸種",
  salt: "鹽",
  yeast: "酵母",
  yeastHint: "可選。不加酵母就填 0。",
  balls: "麵團球數",
  perBall: "每球克數",
  water: "水",
  total: "麵團總重",
  grams: "克",
  result: "配方",
  effective: "有效水合",
  convention:
    "百分比以你秤出的麵粉為基準，有效水合則把本身為 100% 水合的酸種裡的麵粉和水也算進去。",
  copy: "複製配方",
  copied: "已複製",
  copyFail: "請選中配方文字再複製",
  print: "列印",
  related: "相關計算",
  featured: "常用麵團",
  error: "麵粉重量要大於 0。如果按麵團球計算，球數和每球克數也要大於 0。百分比不能為負。",
  categories: {
    hydration: "酸種水合",
    pizza: "披薩麵團",
    bread: "麵包麵團",
    starter: "酸種比例",
    salt: "鹽的比例",
  },
  families: {
    sourdough: "酸種",
    yeast: "酵母麵包",
    flat: "平烤餅",
    rolls: "餐包",
    pizza: "披薩麵團",
  },
  home: {
    title: "酸種與烘焙百分比計算",
    h1: "烘焙百分比計算",
    description: "把烘焙百分比換成克數，用來算酸種、披薩麵團和麵包。可以輸入麵粉重量，也可以從麵團球反推。",
    intro: [
      "麵粉是 100%。水、酸種、鹽和酵母都是相對這份麵粉的百分比。輸入麵粉重量，或改成按麵團球計算，計算器會反推出麵粉。",
      "常見的鄉村酸種是水合 75%、酸種 20%、鹽 2%。下面的數字就是從這個例子開始的。披薩麵團通常更乾一些，用酵母而不是酸種。",
    ],
  },
  hubs: {
    hydration: {
      slug: "suan-zhong-han-shuai",
      title: "酸種水合計算",
      h1: "酸種水合計算",
      description: "水合從 60% 到 90% 的酸種計算，都以 500 克麵粉、20% 酸種、2% 鹽為起點。",
      intro: "水合是水的重量除以你秤出的麵粉。水合低的麵團好揉、切片整齊。水合高的麵團要摺疊，也常常需要烤模。選一個百分比，計算器會帶上對應的水量。",
    },
    pizza: {
      slug: "pisa-fenlei",
      title: "披薩麵團計算",
      h1: "披薩麵團計算",
      description: "那不勒斯、紐約風、盤烤、西西里、薄皮、酸種、當日和冷藏發酵披薩麵團，按球數計算。",
      intro: "每個頁面把一種披薩麵團縮放到指定的球數。每球重量隨風格變化，從較小的那不勒斯餅到較大的紐約風圓餅或一份盤烤麵團。配方含酵母。酸種披薩用酸種，不加酵母。",
    },
    bread: {
      slug: "mianbao-baifenbi",
      title: "麵包烘焙百分比",
      h1: "麵包烘焙百分比",
      description: "佛卡夏、恰巴塔、法國長棍、貝果、吐司和酸種的烘焙百分比，直接換成克數。",
      intro: "這裡是常見麵包的瘦麵團比例，計算麵粉、水、酸種、鹽和酵母。奶油、雞蛋、牛奶和油只在傳統做法需要時提到，而且不計入克數合計。",
    },
    starter: {
      slug: "suan-zhong-bili",
      title: "酸種比例計算",
      h1: "酸種比例計算",
      description: "在 500 克麵粉、水合 75%、鹽 2% 的條件下，比較 10% 到 40% 的酸種。",
      intro: "酸種比例是酸種重量除以你秤出的麵粉。酸種少，基本發酵更久。酸種多，麵團更快。這裡固定水合和鹽，方便只看酸種的變化。",
    },
    salt: {
      slug: "yan-bili",
      title: "麵團鹽的比例",
      h1: "麵團鹽的比例",
      description: "鹽從麵粉重量的 1.5% 到 3%，麵團為水合 70%、酸種 20% 的酸種麵團。",
      intro: "鹽是你秤出的麵粉的百分比。鄉村麵包常見大約 2%。鹽少，發酵更快。鹽多，麵團更緊、更慢，一些披薩會用到這個範圍。",
    },
  },
  notFoundTitle: "找不到頁面",
  notFoundBody: "這個網址沒有對應頁面。請打開你的語言版本。",
};

export const ui = {
  en,
  "zh-cn": zhCn,
  "zh-tw": zhTw,
};
