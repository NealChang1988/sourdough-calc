import { staticRedirects } from "./catalog.mjs";

export const CANONICAL_HOST = "doughcalc.app";
export const NOINDEX = "noindex";

export const PREVIEW_ROBOTS = `User-agent: *
Disallow: /
`;

const REDIRECTS = new Map();
for (const rule of staticRedirects()) {
  if (REDIRECTS.has(rule.from)) throw new Error(`duplicate static redirect ${rule.from}`);
  REDIRECTS.set(rule.from, rule);
}

export function requestHost(requestUrl) {
  return new URL(requestUrl).hostname.toLowerCase().replace(/\.$/, "");
}

export function canonicalUrl(requestUrl) {
  const url = new URL(requestUrl);
  url.protocol = "https:";
  url.hostname = CANONICAL_HOST;
  url.port = "";
  return url.href;
}

function sameHostUrl(requestUrl, pathname) {
  const url = new URL(requestUrl);
  url.pathname = pathname;
  return url.href;
}

function enforcesCanonicalHost(env) {
  return env?.ENFORCE_CANONICAL_HOST === "1";
}

function isPreview(env) {
  return env?.NOINDEX === "1";
}

function withNoindex(response) {
  const headers = new Headers(response.headers);
  headers.set("X-Robots-Tag", NOINDEX);
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (enforcesCanonicalHost(env) && requestHost(request.url) !== CANONICAL_HOST) {
      return new Response(null, {
        status: 301,
        headers: { Location: canonicalUrl(request.url) },
      });
    }

    const redirect = REDIRECTS.get(url.pathname);
    if (redirect) {
      const response = new Response(null, {
        status: redirect.status,
        headers: { Location: sameHostUrl(request.url, redirect.to) },
      });
      return isPreview(env) ? withNoindex(response) : response;
    }

    if (isPreview(env) && url.pathname === "/robots.txt") {
      return new Response(PREVIEW_ROBOTS, {
        status: 200,
        headers: {
          "content-type": "text/plain; charset=utf-8",
          "X-Robots-Tag": NOINDEX,
        },
      });
    }

    const asset = await env.ASSETS.fetch(request);
    return isPreview(env) ? withNoindex(asset) : asset;
  },
};
