// prisma/seed.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // Seed DayTypes only if table is empty
  const dayTypeCount = await prisma.dayType.count();
  if (dayTypeCount === 0) {
    await prisma.dayType.createMany({
      data: [
        { name: "High Carb", kcal: 2600, protein: 180, carbs: 330, fat: 70 },
        { name: "Rest Low",  kcal: 2000, protein: 170, carbs: 150, fat: 60 },
      ],
    });
    console.log("Seeded DayTypes.");
  } else {
    console.log("DayTypes already present, skipping.");
  }

  // Seed Exercises only if table is empty
  const exerciseCount = await prisma.exercise.count();
  if (exerciseCount === 0) {
    await prisma.exercise.createMany({
      data: [
        {
          name: "Back Squat",
          primaryMuscles: ["quads", "glutes"],
          secondaryMuscles: ["hamstrings", "erectors"],
          equipment: ["barbell", "rack"],
          instructions: "Brace, sit between hips, keep mid-foot pressure.",
          mediaUrl: null,
          source: "local",
        },
        {
          name: "Romanian Deadlift",
          primaryMuscles: ["hamstrings", "glutes"],
          secondaryMuscles: ["erectors"],
          equipment: ["barbell"],
          instructions: "Hinge at hips, slight knee bend, keep bar close.",
          mediaUrl: null,
          source: "local",
        },
        {
          name: "Bulgarian Split Squat",
          primaryMuscles: ["quads", "glutes"],
          secondaryMuscles: ["adductors"],
          equipment: ["bench", "dumbbells"],
          instructions: "Rear foot elevated, vertical shin front leg.",
          mediaUrl: null,
          source: "local",
        },
      ],
    });
    console.log("Seeded Exercises.");
  } else {
    console.log("Exercises already present, skipping.");
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    return prisma.$disconnect().finally(() => process.exit(1));
  });
