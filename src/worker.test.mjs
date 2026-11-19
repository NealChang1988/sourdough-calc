import assert from "node:assert/strict";
import test from "node:test";
import worker, { CANONICAL_HOST, NOINDEX, PREVIEW_ROBOTS, canonicalUrl, requestHost } from "./worker.mjs";

const PRODUCTION = { ENFORCE_CANONICAL_HOST: "1" };
const PREVIEW = { NOINDEX: "1" };

function assetBinding(body = "<p>page</p>", status = 200) {
  const calls = [];
  return {
    calls,
    fetch(request) {
      calls.push(new URL(request.url).pathname);
      return Promise.resolve(
        new Response(body, {
          status,
          headers: { "content-type": "text/html; charset=utf-8" },
        }),
      );
    },
  };
}

function page(url, env, assets) {
  return worker.fetch(new Request(url), { ...env, ASSETS: assets });
}

test("request host ignores case and a trailing dot", () => {
  assert.equal(requestHost("https://DoughCalc.app/en/"), CANONICAL_HOST);
  assert.equal(requestHost("https://doughcalc.app./en/"), CANONICAL_HOST);
  assert.equal(requestHost("https://WWW.DOUGHCALC.APP/en/"), "www.doughcalc.app");
});

test("canonical url keeps the path and query and forces https", () => {
  assert.equal(
    canonicalUrl("http://www.doughcalc.app:8443/zh-cn/suanzhong-tusi/?b=2"),
    "https://doughcalc.app/zh-cn/suanzhong-tusi/?b=2",
  );
  assert.equal(
    canonicalUrl("https://sourdough-calc.nealchang1988.workers.dev/en/boule-bakers-percentage/?a=1"),
    "https://doughcalc.app/en/boule-bakers-percentage/?a=1",
  );
});

test("production redirects every non-canonical host and leaves the path alone", async () => {
  const cases = [
    [
      "https://sourdough-calc.nealchang1988.workers.dev/en/boule-bakers-percentage/?a=1",
      "https://doughcalc.app/en/boule-bakers-percentage/?a=1",
    ],
    [
      "https://WWW.DOUGHCALC.APP/zh-cn/suanzhong-tusi/?b=2",
      "https://doughcalc.app/zh-cn/suanzhong-tusi/?b=2",
    ],
    [
      "http://sourdough-calc-preview.nealchang1988.workers.dev/robots.txt",
      "https://doughcalc.app/robots.txt",
    ],
    ["https://example.com/en/?x=1", "https://doughcalc.app/en/?x=1"],
  ];
  for (const [from, location] of cases) {
    const assets = assetBinding();
    const response = await page(from, PRODUCTION, assets);
    assert.equal(response.status, 301, from);
    assert.equal(response.headers.get("location"), location, from);
    assert.equal(response.headers.get("x-robots-tag"), null, from);
    assert.equal(assets.calls.length, 0, from);
  }
});

test("production robots.txt stays the indexed asset file", async () => {
  const assets = assetBinding("User-agent: *\nAllow: /\n\nSitemap: https://doughcalc.app/sitemap.xml\n");
  const response = await page("https://doughcalc.app/robots.txt", PRODUCTION, assets);
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("x-robots-tag"), null);
  assert.match(await response.text(), /^Allow: \/$/m);
  assert.deepEqual(assets.calls, ["/robots.txt"]);
});

test("production serves the canonical host without a host redirect", async () => {
  const assets = assetBinding("country");
  const response = await page(
    "https://doughcalc.app/en/country-sourdough-bakers-percentage/?a=1",
    PRODUCTION,
    assets,
  );
  assert.equal(response.status, 200);
  assert.equal(await response.text(), "country");
  assert.equal(response.headers.get("x-robots-tag"), null);
  assert.deepEqual(assets.calls, ["/en/country-sourdough-bakers-percentage/"]);
});

test("production path redirects keep the canonical host and the query", async () => {
  const cases = [
    ["https://doughcalc.app/", 302, "https://doughcalc.app/en/"],
    [
      "https://doughcalc.app/en/boule-bakers-percentage/?a=1",
      301,
      "https://doughcalc.app/en/country-sourdough-bakers-percentage/?a=1",
    ],
    [
      "https://doughcalc.app/en/boule-bakers-percentage?a=1",
      301,
      "https://doughcalc.app/en/country-sourdough-bakers-percentage/?a=1",
    ],
    [
      "https://doughcalc.app/zh-cn/suanzhong-tusi/",
      301,
      "https://doughcalc.app/zh-cn/suanzhong-sanmingzhi/",
    ],
    [
      "https://doughcalc.app/zh-tw/yuanxing-suanzhong",
      301,
      "https://doughcalc.app/zh-tw/xiangcun-suanzhong/",
    ],
    [
      "https://doughcalc.app/en/sandwich-sourdough-bakers-percentage/",
      301,
      "https://doughcalc.app/en/sourdough-sandwich-loaf-bakers-percentage/",
    ],
    [
      "https://doughcalc.app/en/67-hydration-sourdough-calculator/",
      301,
      "https://doughcalc.app/en/65-hydration-sourdough-calculator/",
    ],
  ];
  for (const [from, status, location] of cases) {
    const assets = assetBinding();
    const response = await page(from, PRODUCTION, assets);
    assert.equal(response.status, status, from);
    assert.equal(response.headers.get("location"), location, from);
    assert.equal(response.headers.get("x-robots-tag"), null, from);
    assert.equal(assets.calls.length, 0, from);
  }
});

test("preview does not redirect hosts and marks every response noindex", async () => {
  const html = assetBinding("<p>preview</p>");
  const home = await page("https://sourdough-calc-preview.nealchang1988.workers.dev/en/", PREVIEW, html);
  assert.equal(home.status, 200);
  assert.equal(home.headers.get("x-robots-tag"), NOINDEX);
  assert.equal(await home.text(), "<p>preview</p>");

  const www = assetBinding();
  const onWww = await page("https://www.doughcalc.app/en/country-sourdough-bakers-percentage/", PREVIEW, www);
  assert.equal(onWww.status, 200);
  assert.equal(onWww.headers.get("x-robots-tag"), NOINDEX);
  assert.equal(www.calls.length, 1);

  const moved = await page(
    "https://sourdough-calc-preview.nealchang1988.workers.dev/en/sandwich-sourdough-bakers-percentage/?a=1",
    PREVIEW,
    assetBinding(),
  );
  assert.equal(moved.status, 301);
  assert.equal(
    moved.headers.get("location"),
    "https://sourdough-calc-preview.nealchang1988.workers.dev/en/sourdough-sandwich-loaf-bakers-percentage/?a=1",
  );
  assert.equal(moved.headers.get("x-robots-tag"), NOINDEX);

  const robotsAssets = assetBinding("User-agent: *\nAllow: /\n\nSitemap: https://doughcalc.app/sitemap.xml\n");
  const robots = await page(
    "https://sourdough-calc-preview.nealchang1988.workers.dev/robots.txt",
    PREVIEW,
    robotsAssets,
  );
  assert.equal(robots.status, 200);
  assert.equal(robots.headers.get("x-robots-tag"), NOINDEX);
  assert.match(robots.headers.get("content-type"), /^text\/plain/);
  assert.equal(await robots.text(), PREVIEW_ROBOTS);
  assert.match(PREVIEW_ROBOTS, /^Disallow: \/$/m);
  assert.doesNotMatch(PREVIEW_ROBOTS, /^Allow:/m);
  assert.doesNotMatch(PREVIEW_ROBOTS, /Sitemap:/);
  assert.equal(robotsAssets.calls.length, 0);
});

test("a worker without the production flag does not redirect hosts", async () => {
  const assets = assetBinding();
  const response = await page("https://www.doughcalc.app/en/", {}, assets);
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("x-robots-tag"), null);
  assert.equal(assets.calls.length, 1);
});
