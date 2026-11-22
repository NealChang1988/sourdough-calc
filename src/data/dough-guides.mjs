import { COUNTRY_PHOTO, countryMethod } from "./country-method.mjs";

const tail = {
  en: "These times assume you only change the flour amount and keep the percentages the same. Still judge the dough by how it looks and feels.",
  "zh-cn": "下面的时间按只改面粉的量、百分比不变来估。发酵还是看面团的样子和手感。",
  "zh-tw": "下面的時間按只改麵粉的量、百分比不變來估。發酵還是看麵團的樣子和手感。",
};

function credit(name) {
  return {
    en: { creditBefore: `Photo by ${name} on `, creditLink: "Pexels" },
    "zh-cn": { creditBefore: `摄影：${name}，来自 `, creditLink: "Pexels" },
    "zh-tw": { creditBefore: `攝影：${name}，來自 `, creditLink: "Pexels" },
  };
}

function guide(photo, blocks) {
  const out = { photo };
  for (const lang of ["en", "zh-cn", "zh-tw"]) {
    out[lang] = { ...blocks[lang], ...credit(photo.photographer)[lang] };
  }
  return out;
}

export const doughGuides = {
  "bread-country-sourdough": {
    photo: COUNTRY_PHOTO,
    en: countryMethod.en,
    "zh-cn": countryMethod["zh-cn"],
    "zh-tw": countryMethod["zh-tw"],
  },
  "pizza-neapolitan": guide(
    {
      src: "/assets/neapolitan-pizza.webp",
      width: 1200,
      height: 676,
      pageUrl: "https://www.pexels.com/photo/pizza-with-green-leaf-vegetable-on-wooden-surface-10802332/",
      photographer: "Anna Guerrero",
    },
    {
      en: {
        heading: "Detailed method",
        lead: `The calculator opens at 4 balls of 250 g, with 65% hydration, 2.8% salt, and 0.2% yeast. That little yeast is there for a long, cold rise, not a fast afternoon dough. ${tail.en}`,
        alt: "A finished Neapolitan pizza with a charred, puffy rim, tomato, and basil on a wooden board.",
        steps: [
          { title: "Mix", body: "Stir the flour, water, and yeast until no dry flour remains, then work in the salt. At the opening recipe the dough is soft but not soupy. Aim for about 24°C (75°F)." },
          { title: "Rest", body: "Cover the bowl and leave it for 20 minutes. The 65% dough smooths out and stops tearing when you fold it." },
          { title: "Bulk", body: "Keep it covered at about 24°C (75°F) for 1 hour. Give it one stretch-and-fold halfway through. It should look a little puffier, not doubled. With only 0.2% yeast, most of the rise happens later in the cold." },
          { title: "Ball", body: "Divide the dough into the number of balls on the calculator. The page opens at 4 balls of 250 g. Tighten each one so the skin is smooth, then set them in a covered tray with a little space between them." },
          { title: "Cold ferment", body: "Refrigerate the balls at about 4°C (39°F) for 16 to 24 hours. They should spread slightly and smell mildly yeasty, not sharp." },
          { title: "Warm and stretch", body: "Take the balls out 60 to 90 minutes before baking. Stretch each one by hand on a floured peel: leave a thick rim and a thin center. A rolling pin presses the rim flat." },
          { title: "Bake", body: "Heat a stone or steel at 250°C (480°F), or as hot as the oven will go, for 45 minutes. Slide the pizza on and bake 6 to 8 minutes, until the rim is spotted and the center is set. A very hot oven around 430°C (800°F) needs only 60 to 90 seconds." },
          { title: "Rest", body: "Set the pizza on a rack for 2 minutes before you cut it, so the center stops flowing." },
        ],
      },
      "zh-cn": {
        heading: "详细做法",
        lead: `计算器打开时是 4 个面团球、每球 250 克，水合 65%，盐 2.8%，酵母 0.2%。酵母这么少，是为了长时间冷藏，不是为了当天下午就烤。${tail["zh-cn"]}`,
        alt: "烤好的那不勒斯披萨，边缘焦香蓬松，铺着番茄和罗勒，放在木板上。",
        steps: [
          { title: "搅拌", body: "把面粉、水和酵母拌到没有干粉，再把盐揉进去。按页面上的初始配方，面团柔软但不稀。面团温度大约 24°C。" },
          { title: "松弛", body: "盖上，静置 20 分钟。65% 水合的面团会变得比较顺，折叠时不容易扯破。" },
          { title: "基本发酵", body: "盖着，放在大约 24°C，1 小时。中途做一轮拉伸折叠。只要略微发起来，不必发到两倍。酵母只有 0.2%，大部分发酵要留到冷藏里。" },
          { title: "分球", body: "按计算器上的球数分割。页面打开时是 4 球、每球 250 克。每个都收成表面光滑的圆球，盖好，球和球之间留一点空隙。" },
          { title: "冷藏", body: "放进大约 4°C 的冰箱，16 到 24 小时。面团球会稍微摊开，气味温和，不要发到刺鼻。" },
          { title: "回温并拉开", body: "烤前 60 到 90 分钟取出。在撒了粉的板上用手拉开：边缘留厚，中间拉薄。擀面杖会把厚边压没。" },
          { title: "烘烤", body: "烤石或烤钢以 250°C 预热 45 分钟，烤箱能到更高就用更高的温度。披萨放上去烤 6 到 8 分钟，边缘出现焦斑、中心定住即可。如果烤箱能到大约 430°C，60 到 90 秒就够。" },
          { title: "静置", body: "放到架子上 2 分钟再切，中心才不会淌开。" },
        ],
      },
      "zh-tw": {
        heading: "詳細做法",
        lead: `計算器打開時是 4 個麵團球、每球 250 克，水合 65%，鹽 2．8%，酵母 0．2%。酵母這麼少，是為了長時間冷藏，不是為了當天下午就烤。${tail["zh-tw"]}`,
        alt: "烤好的那不勒斯披薩，邊緣焦香蓬鬆，鋪著番茄和羅勒，放在木板上。",
        steps: [
          { title: "攪拌", body: "把麵粉、水和酵母拌到沒有乾粉，再把鹽揉進去。按頁面上的初始配方，麵團柔軟但不稀。麵團溫度大約 24°C。" },
          { title: "鬆弛", body: "蓋上，靜置 20 分鐘。65% 水合的麵團會變得比較順，摺疊時不容易扯破。" },
          { title: "基本發酵", body: "蓋著，放在大約 24°C，1 小時。中途做一輪拉伸摺疊。只要略微發起來，不必發到兩倍。酵母只有 0．2%，大部分發酵要留到冷藏裡。" },
          { title: "分球", body: "按計算器上的球數分割。頁面打開時是 4 球、每球 250 克。每個都收成表面光滑的圓球，蓋好，球和球之間留一點空隙。" },
          { title: "冷藏", body: "放進大約 4°C 的冰箱，16 到 24 小時。麵團球會稍微攤開，氣味溫和，不要發到刺鼻。" },
          { title: "回溫並拉開", body: "烤前 60 到 90 分鐘取出。在撒了粉的板上用手拉開：邊緣留厚，中間拉薄。擀麵杖會把厚邊壓沒。" },
          { title: "烘烤", body: "烤石或烤鋼以 250°C 預熱 45 分鐘，烤箱能到更高就用更高的溫度。披薩放上去烤 6 到 8 分鐘，邊緣出現焦斑、中心定住即可。如果烤箱能到大約 430°C，60 到 90 秒就夠。" },
          { title: "靜置", body: "放到架上 2 分鐘再切，中心才不會淌開。" },
        ],
      },
    },
  ),
  "bread-bagel": guide(
    {
      src: "/assets/bagel.webp",
      width: 1200,
      height: 1801,
      pageUrl: "https://www.pexels.com/photo/close-up-shot-of-buns-and-bagels-6937426/",
      photographer: "Anna Tarazevich",
    },
    {
      en: {
        heading: "Detailed method",
        lead: `The calculator opens at 500 g flour, 52% hydration, 2% salt, and 1% yeast. The dough is supposed to feel stiff. A spoon of malt or baking soda in the boil, if you use one, is extra and is not in the gram total. ${tail.en}`,
        alt: "Sesame bagels, one of them sliced, on a wooden board.",
        steps: [
          { title: "Mix", body: "Stir the flour, water, salt, and yeast into a stiff mass. At 52% hydration it will not feel like a soft loaf. Aim for about 24°C (75°F)." },
          { title: "Knead", body: "Knead for 8 to 10 minutes, until the dough is smooth and springs back when you press it. Stop before it tears." },
          { title: "Bulk", body: "Cover it and leave it at about 24°C (75°F) for 60 to 90 minutes. With 1% yeast it should grow by about half, not balloon." },
          { title: "Divide and shape", body: "Divide the dough into equal pieces, about 100 g for a small ring. Roll each piece into a rope, overlap the ends, and roll the seam shut. If the rope snaps back, rest it 10 minutes and try again." },
          { title: "Proof", body: "Cover the rings for 20 to 40 minutes, until they look slightly puffy. A test ring dropped into a bowl of water should float. If it sinks, give them a little longer." },
          { title: "Boil", body: "Bring a wide pot of water to a steady simmer, about 95°C (200°F). Boil the rings for 30 to 45 seconds on each side, then lift them out and let the water drip off." },
          { title: "Bake", body: "Bake at 220°C (425°F) for 16 to 20 minutes, until the crust is deep golden and firm." },
          { title: "Cool", body: "Set them on a rack for at least 20 minutes before you slice. A hot bagel smears." },
        ],
      },
      "zh-cn": {
        heading: "详细做法",
        lead: `计算器打开时是面粉 500 克，水合 52%，盐 2%，酵母 1%。这个面团本来就该偏硬。煮的时候如果加一点麦芽或小苏打，那些不在合计克数里。${tail["zh-cn"]}`,
        alt: "芝麻贝果，其中一个已经切开，放在木板上。",
        steps: [
          { title: "搅拌", body: "把面粉、水、盐和酵母拌成结实的一团。52% 水合摸起来不像柔软的面包。面团温度大约 24°C。" },
          { title: "揉", body: "揉 8 到 10 分钟，直到表面光滑，按下去会回弹。开始扯裂就停。" },
          { title: "基本发酵", body: "盖上，放在大约 24°C，60 到 90 分钟。酵母有 1%，大约胀起一半即可，不要发成气球。" },
          { title: "分割整形", body: "分成大小相近的剂子，小环大约 100 克一个。搓成条，两端叠上，把接缝压住。如果条缩回去，松弛 10 分钟再搓。" },
          { title: "最后发酵", body: "盖着发 20 到 40 分钟，只要略微蓬松。拿一个放进一碗水里，浮起来就可以煮。沉下去就再等一会儿。" },
          { title: "水煮", body: "宽锅里的水保持小沸，大约 95°C。每面煮 30 到 45 秒，捞出沥水。" },
          { title: "烘烤", body: "以 220°C 烤 16 到 20 分钟，直到表皮深金黄并且定住。" },
          { title: "放凉", body: "放到架子上至少 20 分钟再切。太热的贝果一切就糊。" },
        ],
      },
      "zh-tw": {
        heading: "詳細做法",
        lead: `計算器打開時是麵粉 500 克，水合 52%，鹽 2%，酵母 1%。這個麵團本來就該偏硬。煮的時候如果加一點麥芽或小蘇打，那些不在合計克數裡。${tail["zh-tw"]}`,
        alt: "芝麻貝果，其中一個已經切開，放在木板上。",
        steps: [
          { title: "攪拌", body: "把麵粉、水、鹽和酵母拌成結實的一團。52% 水合摸起來不像柔軟的麵包。麵團溫度大約 24°C。" },
          { title: "揉", body: "揉 8 到 10 分鐘，直到表面光滑，按下去會回彈。開始扯裂就停。" },
          { title: "基本發酵", body: "蓋上，放在大約 24°C，60 到 90 分鐘。酵母有 1%，大約脹起一半即可，不要發成氣球。" },
          { title: "分割整形", body: "分成大小相近的劑子，小環大約 100 克一個。搓成條，兩端疊上，把接縫壓住。如果條縮回去，鬆弛 10 分鐘再搓。" },
          { title: "最後發酵", body: "蓋著發 20 到 40 分鐘，只要略微蓬鬆。拿一個放進一碗水裡，浮起來就可以煮。沉下去就再等一會兒。" },
          { title: "水煮", body: "寬鍋裡的水保持小滾，大約 95°C。每面煮 30 到 45 秒，撈出瀝水。" },
          { title: "烘烤", body: "以 220°C 烤 16 到 20 分鐘，直到表皮深金黃並且定住。" },
          { title: "放涼", body: "放到架上至少 20 分鐘再切。太熱的貝果一切就糊。" },
        ],
      },
    },
  ),
  "bread-pain-de-mie": guide(
    {
      src: "/assets/pain-de-mie.webp",
      width: 1200,
      height: 801,
      pageUrl: "https://www.pexels.com/photo/close-up-photo-of-sliced-loaf-8811604/",
      photographer: "Cats Coming",
    },
    {
      en: {
        heading: "Detailed method",
        lead: `The calculator opens at 500 g flour, 64% hydration, 1.8% salt, and 1% yeast. Milk or butter, if you add them, are extra and are not in the gram total. Use a straight-sided tin, with a lid if you have one. ${tail.en}`,
        alt: "A sliced white sandwich loaf with a soft crumb and a thin golden crust.",
        steps: [
          { title: "Mix", body: "Stir the flour, water, salt, and yeast, then knead for about 8 minutes until the dough is smooth. At 64% hydration it is soft and holds a ball. Aim for about 24°C (75°F)." },
          { title: "Bulk", body: "Cover the bowl at about 24°C (75°F) for 60 to 90 minutes. With 1% yeast it should nearly double. One gentle fold halfway through is enough." },
          { title: "Shape", body: "Press the dough into a rectangle, roll it into a log as wide as the tin, and pinch the seam. Place it seam-side down in a lightly oiled tin." },
          { title: "Proof", body: "Cover the tin at about 24°C (75°F) for 40 to 70 minutes. With a lid, stop when the dough is about 2 cm under the rim. Without a lid, stop when the dome just clears the rim." },
          { title: "Bake covered", body: "Heat the oven to 190°C (375°F). If you have a lid, bake covered for 20 minutes so the top stays flat and soft." },
          { title: "Finish", body: "Take the lid off and bake another 15 to 20 minutes, until the sides are golden. With no lid, bake the whole time uncovered, about 35 to 40 minutes." },
          { title: "Cool", body: "Turn the loaf out and cool it on a rack for at least 1 hour before you slice. A warm crumb tears." },
        ],
      },
      "zh-cn": {
        heading: "详细做法",
        lead: `计算器打开时是面粉 500 克，水合 64%，盐 1.8%，酵母 1%。如果另外加牛奶或黄油，那些重量不在合计里。用直角吐司模，有盖更好。${tail["zh-cn"]}`,
        alt: "切开的白吐司，内心柔软，表皮薄而金黄。",
        steps: [
          { title: "搅拌", body: "把面粉、水、盐和酵母拌匀，再揉大约 8 分钟，直到面团光滑。64% 水合柔软，但能成团。面团温度大约 24°C。" },
          { title: "基本发酵", body: "盖上，放在大约 24°C，60 到 90 分钟。酵母有 1%，差不多发到两倍。中途轻轻折一次就够。" },
          { title: "整形", body: "把面团压成片，卷成和模具一样宽的条，捏住接缝。缝朝下，放进薄薄抹了油的吐司模。" },
          { title: "最后发酵", body: "盖着，放在大约 24°C，40 到 70 分钟。有盖的话，发到离模沿大约 2 厘米就停。没有盖，鼓出模沿一点点就停。" },
          { title: "加盖烘烤", body: "烤箱 190°C。有盖就先盖着烤 20 分钟，顶面才会平、表皮才软。" },
          { title: "揭盖", body: "揭盖再烤 15 到 20 分钟，侧面呈金黄。没有盖就全程敞开，大约 35 到 40 分钟。" },
          { title: "放凉", body: "倒出来，放到架子上至少 1 小时再切。温的面包心容易撕烂。" },
        ],
      },
      "zh-tw": {
        heading: "詳細做法",
        lead: `計算器打開時是麵粉 500 克，水合 64%，鹽 1．8%，酵母 1%。如果另外加牛奶或奶油，那些重量不在合計裡。用直角吐司模，有蓋更好。${tail["zh-tw"]}`,
        alt: "切開的白吐司，心柔軟，表皮薄而金黃。",
        steps: [
          { title: "攪拌", body: "把麵粉、水、鹽和酵母拌勻，再揉大約 8 分鐘，直到麵團光滑。64% 水合柔軟，但能成團。麵團溫度大約 24°C。" },
          { title: "基本發酵", body: "蓋上，放在大約 24°C，60 到 90 分鐘。酵母有 1%，差不多發到兩倍。中途輕輕折一次就夠。" },
          { title: "整形", body: "把麵團壓成片，捲成和模具一樣寬的條，捏住接縫。縫朝下，放進薄薄抹了油的吐司模。" },
          { title: "最後發酵", body: "蓋著，放在大約 24°C，40 到 70 分鐘。有蓋的話，發到離模沿大約 2 公分就停。沒有蓋，鼓出模沿一點點就停。" },
          { title: "加蓋烘烤", body: "烤箱 190°C。有蓋就先蓋著烤 20 分鐘，頂面才會平、表皮才軟。" },
          { title: "打開蓋子", body: "打開蓋子再烤 15 到 20 分鐘，側面呈金黃。沒有蓋就全程敞開，大約 35 到 40 分鐘。" },
          { title: "放涼", body: "倒出來，放到架上至少 1 小時再切。溫的麵包心容易撕爛。" },
        ],
      },
    },
  ),
  "bread-baguette": guide(
    {
      src: "/assets/baguette.webp",
      width: 1200,
      height: 795,
      pageUrl: "https://www.pexels.com/photo/baguettes-on-wooden-chopping-board-6432074/",
      photographer: "Skylar Kang",
    },
    {
      en: {
        heading: "Detailed method",
        lead: `The calculator opens at 500 g flour, 66% hydration, 2% salt, and 0.8% yeast. The dough wants folds and steam, not a tight sandwich loaf. ${tail.en}`,
        alt: "Three flour-dusted baguettes with split scores on a round wooden board.",
        steps: [
          { title: "Mix", body: "Stir the flour, water, salt, and yeast until no dry flour remains. At 66% hydration the dough is soft and a bit sticky. Aim for about 24°C (75°F)." },
          { title: "Bulk with folds", body: "Cover it at about 24°C (75°F) for 2 to 2.5 hours. During the first 90 minutes, give it three stretch-and-folds, about 30 minutes apart. It is ready when it has grown by about half and looks bubbly." },
          { title: "Divide", body: "Tip it onto a lightly floured counter and cut three or four sticks. With 500 g of flour the dough is one batch of home-length baguettes, not one huge loaf." },
          { title: "Preshape", body: "Gently tighten each piece into a short log. Cover them and rest 20 to 30 minutes so they stop pulling back." },
          { title: "Shape", body: "Flatten each log, fold the long sides in, and roll it out to the length of your baking sheet or cloth. The seam goes down. A tight skin is what lets the scores open." },
          { title: "Proof", body: "Set them seam-side down in the folds of a floured cloth for 40 to 60 minutes at about 24°C (75°F), until a finger press springs back slowly." },
          { title: "Score and bake", body: "Heat the oven to 240°C (465°F) with a tray for steam. Make four or five diagonal cuts. Bake 12 minutes with steam, then uncover or vent, lower the oven to 220°C (425°F), and bake 12 to 15 minutes more, until the crust is deep brown and the cuts have opened." },
          { title: "Cool", body: "Cool on a rack for at least 30 minutes. The crust softens a little as it cools, and the center finishes setting." },
        ],
      },
      "zh-cn": {
        heading: "详细做法",
        lead: `计算器打开时是面粉 500 克，水合 66%，盐 2%，酵母 0.8%。这个面团靠折叠和蒸汽，不是做成紧实的吐司。${tail["zh-cn"]}`,
        alt: "三根撒了粉的法棍，划口已经裂开，放在圆木板上。",
        steps: [
          { title: "搅拌", body: "把面粉、水、盐和酵母拌到没有干粉。66% 水合柔软，略黏。面团温度大约 24°C。" },
          { title: "折叠发酵", body: "盖上，放在大约 24°C，2 到 2.5 小时。前 90 分钟做三轮拉伸折叠，大约每 30 分钟一轮。大约胀起一半、能看见气泡就可以。" },
          { title: "分割", body: "倒在薄薄撒了粉的台面上，切成 3 或 4 条。500 克面粉是一批家用长度的法棍，不是一根巨大的面包。" },
          { title: "预整形", body: "每条轻轻收成短粗的卷，盖上松弛 20 到 30 分钟，让它不再猛地缩回去。" },
          { title: "整形", body: "把短卷压扁，两边向中间折，再搓到烤盘或布的长度。缝朝下。表皮绷紧，划口才会张开。" },
          { title: "最后发酵", body: "缝朝下，放在撒了粉的布褶里，大约 24°C，40 到 60 分钟。手指按下去回弹变慢就可以划。" },
          { title: "划口烘烤", body: "烤箱 240°C，另放一个盘子准备蒸汽。斜着划 4 或 5 刀。带蒸汽烤 12 分钟，然后撤掉蒸汽，调到 220°C，再烤 12 到 15 分钟，直到表皮深褐、划口张开。" },
          { title: "放凉", body: "放到架子上至少 30 分钟。表皮会稍微回软，中心也才定住。" },
        ],
      },
      "zh-tw": {
        heading: "詳細做法",
        lead: `計算器打開時是麵粉 500 克，水合 66%，鹽 2%，酵母 0．8%。這個麵團靠摺疊和蒸汽，不是做成緊實的吐司。${tail["zh-tw"]}`,
        alt: "三根撒了粉的法國長棍，劃口已經裂開，放在圓木板上。",
        steps: [
          { title: "攪拌", body: "把麵粉、水、鹽和酵母拌到沒有乾粉。66% 水合柔軟，略黏。麵團溫度大約 24°C。" },
          { title: "摺疊發酵", body: "蓋上，放在大約 24°C，2 到 2．5 小時。前 90 分鐘做三輪拉伸摺疊，大約每 30 分鐘一輪。大約脹起一半、能看見氣泡就可以。" },
          { title: "分割", body: "倒在薄薄撒了粉的檯面上，切成 3 或 4 條。500 克麵粉是一批家用長度的長棍，不是一根巨大的麵包。" },
          { title: "預整形", body: "每條輕輕收成短粗的卷，蓋上鬆弛 20 到 30 分鐘，讓它不再猛地縮回去。" },
          { title: "整形", body: "把短卷壓扁，兩邊向中間折，再搓到烤盤或布的長度。縫朝下。表皮繃緊，劃口才會張開。" },
          { title: "最後發酵", body: "縫朝下，放在撒了粉的布褶裡，大約 24°C，40 到 60 分鐘。手指按下去回彈變慢就可以劃。" },
          { title: "劃口烘烤", body: "烤箱 240°C，另放一個盤子準備蒸汽。斜著劃 4 或 5 刀。帶蒸汽烤 12 分鐘，然後撤掉蒸汽，調到 220°C，再烤 12 到 15 分鐘，直到表皮深褐、劃口張開。" },
          { title: "放涼", body: "放到架上至少 30 分鐘。表皮會稍微回軟，中心也才定住。" },
        ],
      },
    },
  ),
  "bread-focaccia": guide(
    {
      src: "/assets/focaccia.webp",
      width: 1200,
      height: 800,
      pageUrl: "https://www.pexels.com/photo/focaccia-on-paper-in-overhead-view-18453899/",
      photographer: "Lucie Liz",
    },
    {
      en: {
        heading: "Detailed method",
        lead: `The calculator opens at 500 g flour, 78% hydration, 2.5% salt, and 0.5% yeast. Oil for the pan is extra and is not in the gram total. The dough should look like a flat sheet, not a tall loaf. ${tail.en}`,
        alt: "A dimpled focaccia with olives and herbs on parchment.",
        steps: [
          { title: "Mix", body: "Stir the flour, water, salt, and yeast until no dry flour remains. At 78% hydration it is sticky and slack. Aim for about 24°C (75°F)." },
          { title: "Folds", body: "Cover it at about 24°C (75°F) for 2 to 3 hours. Give it three stretch-and-folds in the first 90 minutes, about 30 minutes apart. It should turn bubbly and jiggle." },
          { title: "Pan", body: "Oil a rimmed sheet or a roasting pan generously. Tip the dough in. Do not drag it to the corners yet." },
          { title: "Stretch", body: "After 20 minutes, oil your fingers and ease the dough toward the corners. If it springs back, wait another 10 minutes and finish the stretch." },
          { title: "Proof", body: "Leave it in the pan, covered, for 45 to 75 minutes at about 24°C (75°F), until it is puffy and full of bubbles. The 0.5% yeast needs that time." },
          { title: "Dimple", body: "Oil your fingers again and press them straight down to the pan, all over the surface. The dimples should stay open. The 2.5% salt is already in the dough." },
          { title: "Bake", body: "Bake at 230°C (450°F) for 20 to 25 minutes, until the raised parts are deep gold and the bottom is crisp." },
          { title: "Cool", body: "Leave it in the pan for 10 minutes, then move it to a rack. Cut it while it is warm, after the steam has eased." },
        ],
      },
      "zh-cn": {
        heading: "详细做法",
        lead: `计算器打开时是面粉 500 克，水合 78%，盐 2.5%，酵母 0.5%。烤盘里的油是另外加的，不在合计克数里。它应该是一张饼，不是高面包。${tail["zh-cn"]}`,
        alt: "戳了坑的佛卡夏，上面有橄榄和香草，垫在烘焙纸上。",
        steps: [
          { title: "搅拌", body: "把面粉、水、盐和酵母拌到没有干粉。78% 水合又黏又软。面团温度大约 24°C。" },
          { title: "折叠", body: "盖上，放在大约 24°C，2 到 3 小时。前 90 分钟做三轮拉伸折叠，大约每 30 分钟一轮。面团要发到起泡、轻轻一晃会颤。" },
          { title: "入盘", body: "烤盘多抹油。把面团倒进去。先不要硬拉到四角。" },
          { title: "铺开", body: "20 分钟后，手指沾油，把面团慢慢推向四角。如果缩回去，再等 10 分钟铺完。" },
          { title: "盘中发酵", body: "盖着，放在大约 24°C，45 到 75 分钟，直到蓬松、满是气泡。酵母只有 0.5%，需要这段时间。" },
          { title: "戳坑", body: "手指再沾油，垂直戳到盘底，整个表面都戳到。坑要留得住。盐已经按 2.5% 在面团里。" },
          { title: "烘烤", body: "以 230°C 烤 20 到 25 分钟，鼓起的地方呈深金黄，底部发脆。" },
          { title: "放凉", body: "在盘里停 10 分钟，再移到架子上。蒸汽散掉后、还温热时切开。" },
        ],
      },
      "zh-tw": {
        heading: "詳細做法",
        lead: `計算器打開時是麵粉 500 克，水合 78%，鹽 2．5%，酵母 0．5%。烤盤裡的油是另外加的，不在合計克數裡。它應該是一張餅，不是高麵包。${tail["zh-tw"]}`,
        alt: "戳了坑的佛卡夏，上面有橄欖和香草，墊在烘焙紙上。",
        steps: [
          { title: "攪拌", body: "把麵粉、水、鹽和酵母拌到沒有乾粉。78% 水合又黏又軟。麵團溫度大約 24°C。" },
          { title: "摺疊", body: "蓋上，放在大約 24°C，2 到 3 小時。前 90 分鐘做三輪拉伸摺疊，大約每 30 分鐘一輪。麵團要發到起泡、輕輕一晃會顫。" },
          { title: "入盤", body: "烤盤多抹油。把麵團倒進去。先不要硬拉到四角。" },
          { title: "鋪開", body: "20 分鐘後，手指沾油，把麵團慢慢推向四角。如果縮回去，再等 10 分鐘鋪完。" },
          { title: "盤中發酵", body: "蓋著，放在大約 24°C，45 到 75 分鐘，直到蓬鬆、滿是氣泡。酵母只有 0．5%，需要這段時間。" },
          { title: "戳坑", body: "手指再沾油，垂直戳到盤底，整個表面都戳到。坑要留得住。鹽已經按 2．5% 在麵團裡。" },
          { title: "烘烤", body: "以 230°C 烤 20 到 25 分鐘，鼓起的地方呈深金黃，底部發脆。" },
          { title: "放涼", body: "在盤裡停 10 分鐘，再移到架上。蒸汽散掉後、還溫熱時切開。" },
        ],
      },
    },
  ),
};
