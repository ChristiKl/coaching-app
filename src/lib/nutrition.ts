export const KCAL_PER_G = {
  protein: 4,
  carbs: 4,
  fat: 9,
} as const;

/**
 * Convert total kcal + macro % to grams.
 * percents are 0–100 and should sum ~100 (we allow a small epsilon).
 */
export function gramsFromKcalAndPercents(
  totalKcal: number,
  perc: { protein: number; carbs: number; fat: number },
  opts?: { roundGrams?: boolean }
) {
  const sum = perc.protein + perc.carbs + perc.fat;
  if (totalKcal <= 0) throw new Error("totalKcal must be > 0");
  if (sum < 99.5 || sum > 100.5) {
    throw new Error(`Macro percentages must sum to ~100 (got ${sum}).`);
  }

  const gramsExact = {
    protein: (totalKcal * (perc.protein / 100)) / KCAL_PER_G.protein,
    carbs:   (totalKcal * (perc.carbs   / 100)) / KCAL_PER_G.carbs,
    fat:     (totalKcal * (perc.fat     / 100)) / KCAL_PER_G.fat,
  };

  const grams = opts?.roundGrams
    ? {
        protein: Math.round(gramsExact.protein),
        carbs:   Math.round(gramsExact.carbs),
        fat:     Math.round(gramsExact.fat),
      }
    : gramsExact;

  return {
    grams,
    // recompute kcal from (possibly rounded) grams so UI can show any drift
    kcalFromRounded: kcalFromGrams(grams).kcal,
  };
}

/**
 * Convert grams of P/C/F to total kcal and percents.
 */
export function kcalFromGrams(grams: { protein: number; carbs: number; fat: number }) {
  const kcal =
    grams.protein * KCAL_PER_G.protein +
    grams.carbs   * KCAL_PER_G.carbs +
    grams.fat     * KCAL_PER_G.fat;

  const proteinKcal = grams.protein * KCAL_PER_G.protein;
  const carbsKcal   = grams.carbs   * KCAL_PER_G.carbs;
  const fatKcal     = grams.fat     * KCAL_PER_G.fat;

  const total = proteinKcal + carbsKcal + fatKcal || 1; // avoid divide-by-zero
  const perc = {
    protein: (proteinKcal / total) * 100,
    carbs:   (carbsKcal   / total) * 100,
    fat:     (fatKcal     / total) * 100,
  };

  return {
    kcal,                 // exact float
    percExact: perc,      // exact percentages (floats)
    percRounded: {
      protein: Math.round(perc.protein),
      carbs:   Math.round(perc.carbs),
      fat:     Math.round(perc.fat),
    },
  };
}
