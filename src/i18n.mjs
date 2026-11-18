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
  feedback: "Feedback",
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
  error: "Enter a number only, for example 3000, without units",
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
        "Sourdough calculators at 65%, 70%, 75%, and 80% hydration. Each starts from 500 g of flour with 20% starter and 2% salt, and the hydration field stays editable.",
      intro:
        "Hydration is water weight divided by the flour you weigh out. At 65% the dough is soft and shapes into an even sandwich loaf. At 70% and 75% it slumps and opens into a country crumb if you fold it early. At 80% it is wet, closer to ciabatta, and strength comes from folds rather than kneading. Open a percentage, then change the hydration field if you want a different dough.",
    },
    pizza: {
      slug: "pizza-dough",
      title: "Pizza Dough Calculators",
      h1: "Pizza Dough Calculators",
      description:
        "Pizza dough calculators for Neapolitan, New York, pan, Sicilian, thin crust, sourdough, same-day, and cold-fermented dough. Set the number of balls on each page.",
      intro:
        "Each style has its own hydration, salt, and yeast, and sourdough pizza uses starter instead of yeast. Ball weight starts at the size that style usually uses, from a small Neapolitan pie to a larger New York round or a pan portion. Change the ball count and the grams per ball on the page. The calculator solves the flour from that total.",
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
        "Set the starter from about 10% to 40% of flour weight. Less starter means a longer bulk proof. More starter makes a faster dough.",
      intro:
        "Starter percentage is the levain weight divided by the flour you weigh out. Around 10%, keep the dough covered and judge the bulk proof by volume, because it takes a long time. Around 20% is a common same-day loaf when the starter is active and the kitchen is warm. Toward 30% or 40%, fold early and shape once the dough is airy, or it can overproof on a warm counter. Hydration starts at 75% and salt at 2% on 500 g of flour. Change the starter field to see the grams.",
    },
    salt: {
      slug: "salt-percentage",
      title: "Salt Percentage for Dough",
      h1: "Salt Percentage for Dough",
      description:
        "Salt from about 1.5% to 3% of flour weight. Less salt lets the dough rise faster. More salt tightens it and slows fermentation, which some pizza doughs use.",
      intro:
        "Salt is a percentage of the flour you weigh out. Around 2% seasons a country loaf and slows fermentation a little. At 1.5% the dough rises faster and the crumb tastes milder. At 2.5% to 3% the dough feels tighter in the hand. That range is ordinary for some pizzas and high for most breads, so give it extra proof time until it is airy. This page starts at 500 g of flour, 70% hydration, and 20% starter. Edit the salt field to change the grams.",
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
  feedback: "意见反馈",
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
  error: "请只填数字，例如 3000，不要加单位",
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
      description: "水合 65%、70%、75% 和 80% 的酸种计算器。都以 500 克面粉、20% 酸种、2% 盐为起点，水合一栏可以再改。",
      intro: "水合是水的重量除以你称出的面粉。65% 柔软，适合整成切片整齐的吐司。70% 和 75% 会略微塌，前期折叠后容易做出乡村面包那种敞开的组织。80% 很湿，更接近恰巴塔，筋力靠折叠，不靠在台面上揉。先选一个百分比，想要别的软硬再改水合。",
    },
    pizza: {
      slug: "pisa-fenlei",
      title: "披萨面团计算器",
      h1: "披萨面团计算器",
      description: "那不勒斯、纽约风、盘烤、西西里、薄皮、酸种、当日和冷藏发酵披萨面团各有一个计算器。球数在页面上改。",
      intro: "每种风格有自己的水合、盐和酵母。酸种披萨用酸种，不加酵母。每球重量从这种饼常用的大小开始，小的那不勒斯、大一些的纽约风圆饼，或一份盘烤。球数和每球克数都可以改，计算器会按总重量反推面粉。",
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
      description: "酸种可以从面粉重量的大约 10% 调到 40%。酸种少，基本发酵更久。酸种多，面团更快。",
      intro: "酸种比例是酸种重量除以你称出的面粉。大约 10% 时，面团要盖好，用体积判断基本发酵，因为时间会很长。大约 20% 是常见的当天出炉用量，酸种活跃、厨房暖和时往往来得及整形。到了 30% 或 40%，早点折叠，面团一蓬松就整形，放在暖和的台面上太久容易发过。这份计算从 500 克面粉、水合 75%、盐 2% 开始。改酸种那一栏，就能看到克数。",
    },
    salt: {
      slug: "yan-bili",
      title: "面团盐的比例",
      h1: "面团盐的比例",
      description: "盐可以从面粉重量的大约 1.5% 调到 3%。盐少，发酵更快。盐多，面团更紧、发酵更慢，一些披萨会用到这个范围。",
      intro: "盐是你称出的面粉的百分比。大约 2% 能给乡村面包调味，也会让发酵稍微变慢。1.5% 时发酵更快，面包心味道更淡。到了 2.5% 或 3%，手上会感到面团更紧。这个范围对一些披萨很普通，对多数面包偏高，要多给一点时间，发到蓬松再烤。本页从 500 克面粉、水合 70%、酸种 20% 开始。改盐的百分比，就能看到克数。",
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
  feedback: "意見回饋",
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
  error: "請只填數字，例如 3000，不要加單位",
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
      description: "水合 65%、70%、75% 和 80% 的酸種計算。都以 500 克麵粉、20% 酸種、2% 鹽為起點，水合一欄可以再改。",
      intro: "水合是水的重量除以你秤出的麵粉。65% 柔軟，適合整成切片整齊的吐司。70% 和 75% 會略微塌，前期摺疊後容易做出鄉村麵包那種敞開的組織。80% 很濕，更接近恰巴塔，筋力靠摺疊，不靠在檯面上揉。先選一個百分比，想要別的軟硬再改水合。",
    },
    pizza: {
      slug: "pisa-fenlei",
      title: "披薩麵團計算",
      h1: "披薩麵團計算",
      description: "那不勒斯、紐約風、盤烤、西西里、薄皮、酸種、當日和冷藏發酵披薩麵團各有一個計算器。球數在頁面上改。",
      intro: "每種風格有自己的水合、鹽和酵母。酸種披薩用酸種，不加酵母。每球重量從這種餅常用的大小開始，小的那不勒斯、大一些的紐約風圓餅，或一份盤烤。球數和每球克數都可以改，計算器會按總重量反推麵粉。",
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
      description: "酸種可以從麵粉重量的大約 10% 調到 40%。酸種少，基本發酵更久。酸種多，麵團更快。",
      intro: "酸種比例是酸種重量除以你秤出的麵粉。大約 10% 時，麵團要蓋好，用體積判斷基本發酵，因為時間會很長。大約 20% 是常見的當天出爐用量，酸種活躍、廚房暖和時往往來得及整形。到了 30% 或 40%，早點摺疊，麵團一蓬鬆就整形，放在暖和的檯面上太久容易發過。這份計算從 500 克麵粉、水合 75%、鹽 2% 開始。改酸種那一欄，就能看到克數。",
    },
    salt: {
      slug: "yan-bili",
      title: "麵團鹽的比例",
      h1: "麵團鹽的比例",
      description: "鹽可以從麵粉重量的大約 1.5% 調到 3%。鹽少，發酵更快。鹽多，麵團更緊、發酵更慢，一些披薩會用到這個範圍。",
      intro: "鹽是你秤出的麵粉的百分比。大約 2% 能給鄉村麵包調味，也會讓發酵稍微變慢。1.5% 時發酵更快，麵包心味道更淡。到了 2.5% 或 3%，手上會感到麵團更緊。這個範圍對一些披薩很普通，對多數麵包偏高，要多給一點時間，發到蓬鬆再烤。本頁從 500 克麵粉、水合 70%、酸種 20% 開始。改鹽的百分比，就能看到克數。",
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
