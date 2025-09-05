import { gramsFromKcalAndPercents, kcalFromGrams } from "./lib/nutrition";

console.log("Test 1: kcal + % → grams");
const res1 = gramsFromKcalAndPercents(2600, { protein: 30, carbs: 50, fat: 20 }, { roundGrams: true });
console.log(res1);

console.log("Test 2: grams → kcal + %");
const res2 = kcalFromGrams({ protein: 180, carbs: 330, fat: 70 });
console.log(res2);