import assert from "node:assert/strict";
import test from "node:test";
import {
  effectiveHydration,
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

test("parseInputs rejects empty flour and negative salt, and accepts a comma decimal", () => {
  assert.equal(parseInputs({ mode: "flour", flour: "", hydration: 75, starter: 20, salt: 2, yeast: 0 }).ok, false);
  assert.equal(
    parseInputs({ mode: "flour", flour: 500, hydration: 75, starter: 20, salt: -1, yeast: 0 }).ok,
    false,
  );
  const parsed = parseInputs({
    mode: "balls",
    balls: "4",
    gramsPerBall: "250",
    hydration: "65",
    starter: "0",
    salt: "3",
    yeast: "0,2",
  });
  assert.equal(parsed.ok, true);
  assert.equal(formatAmount(recipeFor(parsed.preset).flour), "594.5");
});
