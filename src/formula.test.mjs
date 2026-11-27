import assert from "node:assert/strict";
import test from "node:test";
import {
  effectiveHydration,
  fillAmounts,
  formatAmount,
  gramsFromFlour,
  parseInputs,
  recipeFor,
  round1,
} from "./formula.mjs";

test("500 g flour at 75% hydration, 20% starter, and 2% salt", () => {
  const recipe = gramsFromFlour({ flour: 500, hydration: 75, starter: 20, salt: 2 });
  assert.equal(recipe.water, 375);
  assert.equal(recipe.starter, 100);
  assert.equal(recipe.salt, 10);
  assert.equal(recipe.yeast, 0);
  assert.equal(recipe.flour, 500);
  assert.equal(recipe.total, 985);
  assert.equal(recipe.water + recipe.starter + recipe.salt + recipe.flour, recipe.total);
  const ratio = (375 + 50) / (500 + 50);
  assert.equal(effectiveHydration(recipe), ratio * 100);
  assert.equal(round1(effectiveHydration(recipe)), 77.3);
  assert.equal(formatAmount(effectiveHydration(recipe)), "77.3");
});

test("4 balls of 250 g at 65% hydration, 0% starter, 3% salt, and 0.2% yeast", () => {
  const recipe = recipeFor({
    mode: "balls",
    balls: 4,
    gramsPerBall: 250,
    hydration: 65,
    starter: 0,
    salt: 3,
    yeast: 0.2,
  });
  assert.equal(formatAmount(recipe.flour), "594.5");
  assert.ok(Math.abs(recipe.water - recipe.flour * 0.65) < 1e-9);
  assert.equal(recipe.starter, 0);
  assert.ok(Math.abs(recipe.salt - recipe.flour * 0.03) < 1e-9);
  assert.ok(Math.abs(recipe.yeast - recipe.flour * 0.002) < 1e-9);
  assert.ok(Math.abs(recipe.total - 1000) < 1e-9);
  assert.equal(formatAmount(recipe.total), "1000");
});

test("effective hydration matches the stated hydration when starter is zero", () => {
  const recipe = gramsFromFlour({ flour: 400, hydration: 65, starter: 0, salt: 2.8, yeast: 0.2 });
  assert.equal(effectiveHydration(recipe), 65);
});

test("parseInputs rejects empty flour and negative salt", () => {
  const empty = parseInputs({ mode: "flour", flour: "", hydration: 75, starter: 20, salt: 2, yeast: 0 });
  assert.equal(empty.ok, false);
  assert.equal(empty.field, "flour");
  const negative = parseInputs({ mode: "flour", flour: 500, hydration: 75, starter: 20, salt: -1, yeast: 0 });
  assert.equal(negative.ok, false);
  assert.equal(negative.field, "salt");
  const parsed = parseInputs({
    mode: "balls",
    balls: "4",
    gramsPerBall: "250",
    hydration: "65",
    starter: "0",
    salt: "3",
    yeast: "0.2",
  });
  assert.equal(parsed.ok, true);
  assert.equal(formatAmount(recipeFor(parsed.preset).flour), "594.5");
});

test("parseInputs reads thousands separators, full-width digits, and a trailing unit", () => {
  const base = { mode: "flour", hydration: "75", starter: "20", salt: "2", yeast: "0" };
  assert.equal(parseInputs({ ...base, flour: "3,000" }).preset.flour, 3000);
  assert.equal(parseInputs({ ...base, flour: "１２００" }).preset.flour, 1200);
  assert.equal(parseInputs({ ...base, flour: "500g" }).preset.flour, 500);
  assert.equal(parseInputs({ ...base, flour: "500 g" }).preset.flour, 500);
  assert.equal(parseInputs({ ...base, flour: "1,500.5" }).preset.flour, 1500.5);
  const kilograms = parseInputs({ ...base, flour: "3kg" });
  assert.equal(kilograms.ok, false);
  assert.equal(kilograms.field, "flour");
  assert.equal(parseInputs({ ...base, flour: "500", hydration: "75%" }).preset.hydration, 75);
  assert.equal(parseInputs({ ...base, flour: "500 克" }).preset.flour, 500);
  assert.equal(parseInputs({ ...base, flour: "１．５" }).preset.flour, 1.5);
  assert.equal(parseInputs({ ...base, flour: "500", yeast: "0,2" }).ok, false);
});

test("method amounts follow the current flour, not a frozen batch", () => {
  const preset = { mode: "flour", flour: 500, hydration: 72, starter: 0, salt: 2, yeast: 0.25, balls: 1, gramsPerBall: 871.25 };
  const text = "{{flour}} g flour, {{water}} g water, {{yeast}} g yeast, {{total}} g, {{yeastPct}}% yeast, {{piece}} g each";
  const opened = fillAmounts(text, recipeFor(preset), preset);
  assert.equal(opened, "500 g flour, 360 g water, 1.3 g yeast, 871.3 g, 0.25% yeast, 871.25 g each");
  const doubled = { ...preset, flour: 1000 };
  const next = fillAmounts(text, recipeFor(doubled), doubled);
  assert.equal(next, "1000 g flour, 720 g water, 2.5 g yeast, 1742.5 g, 0.25% yeast, 1742.5 g each");
});
