# Dough calculator

The site turns baker's percentages into grams for sourdough, pizza dough, and bread. Pages are in English, Simplified Chinese, and Traditional Chinese.

## Upload the site

Upload the `dist` folder as static files. The folder already contains the built site, so you can upload it without running a build when the address inside it is the one you want.

The root page sends visitors to the English calculator.

## Change the site address

The address lives in one place. Open `site.config.mjs` and edit `SITE_URL`.

1. Open `site.config.mjs`.
2. Replace `https://sourdough-calc.example.com` with your address. Do not put a slash at the end.
3. Run `node build.mjs`.
4. Upload the new `dist` folder.

`node build.mjs` rewrites the sitemap, `robots.txt`, and the language links that use your address.

If you cannot run that command, search `dist` for `https://sourdough-calc.example.com` and replace it with your address in every file.

## Check the calculator

Run `node --test`.

A passing run checks two recipes. 500 g of flour at 75% hydration, 20% starter, and 2% salt makes 375 g of water, 100 g of starter, 10 g of salt, and 985 g of dough. The effective hydration is 77.3%. Four dough balls of 250 g at 65% hydration, 0% starter, 3% salt, and 0.2% yeast use 594.5 g of flour.
