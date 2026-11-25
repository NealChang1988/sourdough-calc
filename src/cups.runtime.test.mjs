import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import * as cups from "./cups.mjs";
import * as cupsCopy from "./cups-copy.mjs";

function node(spec) {
  const listeners = {};
  const el = {
    id: spec.id || "",
    name: spec.name || "",
    value: spec.value ?? "",
    checked: !!spec.checked,
    hidden: false,
    textContent: spec.text || "",
    dataset: spec.dataset || {},
    children: spec.children || [],
    classList: { add() {}, remove() {}, toggle() {} },
    addEventListener(type, fn) {
      (listeners[type] ||= []).push(fn);
    },
    dispatchEvent(event) {
      for (const fn of listeners[event.type] || []) fn(event);
    },
    querySelector(sel) {
      return queryAll(el, sel)[0] || null;
    },
    querySelectorAll(sel) {
      return queryAll(el, sel);
    },
  };
  return el;
}

function matches(el, sel) {
  if (sel.endsWith(":checked")) return matches(el, sel.slice(0, -":checked".length)) && el.checked;
  if (sel.startsWith("#")) return el.id === sel.slice(1);
  if (sel === "[name=amount]") return el.name === "amount";
  if (sel === "[name=ingredient]") return el.name === "ingredient";
  if (sel === "[data-quick=grams]") return el.dataset.quick === "grams";
  if (sel === "[data-quick=cups]") return el.dataset.quick === "cups";
  if (sel === ".chart td[data-ing]") return el.dataset.ing != null;
  if (sel === "[data-ingredient]") return el.dataset.ingredient != null;
  if (sel === "[data-amount]") return el.dataset.amount != null;
  const direction = sel.match(/^input\[name=direction]\[value="(grams|cups)"]$/);
  if (direction) return el.name === "direction" && el.value === direction[1];
  const system = sel.match(/^input\[name=system]\[value="(us|metric|uk)"]$/);
  if (system) return el.name === "system" && el.value === system[1];
  if (sel === "input[name=direction]") return el.name === "direction";
  if (sel === "input[name=system]") return el.name === "system";
  return false;
}

function queryAll(root, sel) {
  const found = [];
  const walk = (el) => {
    for (const child of el.children || []) {
      if (matches(child, sel)) found.push(child);
      walk(child);
    }
  };
  walk(root);
  return found;
}

test("cups.js imports every helper it calls and paste cleans the amount", async () => {
  const source = await readFile(new URL("./cups.js", import.meta.url), "utf8");
  const exported = new Set([...Object.keys(cups), ...Object.keys(cupsCopy)]);
  const imported = new Set();
  for (const match of source.matchAll(/import\s*\{([^}]+)\}/g)) {
    for (const part of match[1].split(",")) {
      const name = part.trim().split(/\s+as\s+/).pop();
      if (name) imported.add(name);
    }
  }
  const missing = [...exported].filter((name) => new RegExp(`\\b${name}\\s*\\(`).test(source) && !imported.has(name));
  assert.deepEqual(missing, []);

  const amount = node({ name: "amount", value: "250" });
  const ingredient = node({ name: "ingredient", value: "ap" });
  const grams = node({ name: "direction", value: "grams", checked: true });
  const cupsMode = node({ name: "direction", value: "cups" });
  const us = node({ name: "system", value: "us", checked: true });
  const metric = node({ name: "system", value: "metric" });
  const uk = node({ name: "system", value: "uk" });
  const out = (id) => node({ id, text: id === "out-main" ? "2.08 cups" : "" });
  const outs = Object.fromEntries(
    ["out-main", "out-frac", "out-warn", "out-scoop", "out-cups", "out-tbsp", "out-tsp", "out-ml", "out-grams", "out-oz", "out-sticks"].map(
      (id) => [id, out(id)],
    ),
  );
  const doc = node({
    children: [
      node({
        id: "calc",
        children: [amount, ingredient, grams, cupsMode, us, metric, uk, node({ dataset: { quick: "grams" } }), node({ dataset: { quick: "cups" } })],
      }),
      node({ id: "form-error" }),
      node({ id: "detected" }),
      node({ id: "copy", text: "Copy result" }),
      node({ id: "recipe-text" }),
      node({ id: "out-warn" }),
      node({ id: "row-sticks" }),
      node({ id: "row-tbsp" }),
      node({ id: "row-tsp" }),
      node({ id: "convention" }),
      node({ id: "fdc", dataset: { label: "USDA" } }),
      node({ id: "swap" }),
      node({ id: "print" }),
      ...Object.values(outs),
    ],
  });
  doc.documentElement = { lang: "en" };
  globalThis.document = doc;

  await import("./cups.js");
  amount.value = "100g butter";
  amount.dispatchEvent({ type: "input", inputType: "insertFromPaste", data: "100g butter" });
  assert.equal(amount.value, "100");
  assert.equal(ingredient.value, "butter");
  assert.equal(outs["out-main"].textContent, "0.44 cups");
});
