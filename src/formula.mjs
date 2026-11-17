export function gramsFromFlour(input) {
  const flour = input.flour;
  const water = (flour * input.hydration) / 100;
  const starter = (flour * input.starter) / 100;
  const salt = (flour * input.salt) / 100;
  const yeast = (flour * (input.yeast ?? 0)) / 100;
  const total = flour + water + starter + salt + yeast;
  return { flour, water, starter, salt, yeast, total };
}

export function flourFromBalls(input) {
  const total = input.balls * input.gramsPerBall;
  const percentSum = input.hydration + input.starter + input.salt + (input.yeast ?? 0);
  const flour = total / (1 + percentSum / 100);
  return gramsFromFlour({ ...input, flour });
}

export function recipeFor(preset) {
  if (preset.mode === "balls") return flourFromBalls(preset);
  return gramsFromFlour(preset);
}

export function effectiveHydration(recipe) {
  const starterFlour = recipe.starter / 2;
  const starterWater = recipe.starter / 2;
  const flourAll = recipe.flour + starterFlour;
  const waterAll = recipe.water + starterWater;
  if (flourAll === 0) return 0;
  return (waterAll / flourAll) * 100;
}

export function round1(n) {
  return Math.round((n + Number.EPSILON) * 10) / 10;
}

export function formatAmount(n) {
  const rounded = round1(n);
  if (Number.isInteger(rounded)) return String(rounded);
  return rounded.toFixed(1);
}

function numberFrom(value) {
  if (typeof value === "number") return value;
  if (typeof value !== "string") return Number.NaN;
  const trimmed = value.trim().replace(",", ".");
  if (trimmed === "") return Number.NaN;
  return Number(trimmed);
}

export function parseInputs(raw) {
  const mode = raw.mode === "balls" ? "balls" : "flour";
  const hydration = numberFrom(raw.hydration);
  const starter = numberFrom(raw.starter);
  const salt = numberFrom(raw.salt);
  const yeast = numberFrom(raw.yeast);
  const flour = numberFrom(raw.flour);
  const balls = numberFrom(raw.balls);
  const gramsPerBall = numberFrom(raw.gramsPerBall);
  const percents = [hydration, starter, salt, yeast];
  if (!percents.every(Number.isFinite) || percents.some((n) => n < 0)) {
    return { ok: false };
  }
  if (mode === "flour") {
    if (!(flour > 0)) return { ok: false };
    return {
      ok: true,
      preset: { mode, flour, hydration, starter, salt, yeast, balls, gramsPerBall },
    };
  }
  if (!(balls > 0) || !(gramsPerBall > 0)) return { ok: false };
  return {
    ok: true,
    preset: { mode, flour, hydration, starter, salt, yeast, balls, gramsPerBall },
  };
}
