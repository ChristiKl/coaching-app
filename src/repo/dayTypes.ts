import { prisma } from "../db/prisma";

export const dayTypeRepo = {
  async list() {
    return prisma.dayType.findMany({ orderBy: { createdAt: "desc" } });
  },

  async create(input: { name: string; targets: { kcal: number; protein: number; carbs: number; fat: number } }) {
    const { name, targets } = input;
    return prisma.dayType.create({
      data: { name, kcal: targets.kcal, protein: targets.protein, carbs: targets.carbs, fat: targets.fat },
    });
  },

  async update(id: string, partial: { name?: string; targets?: Partial<{ kcal: number; protein: number; carbs: number; fat: number }> }) {
    const data: any = {};
    if (partial.name !== undefined) data.name = partial.name;
    if (partial.targets) {
      if (partial.targets.kcal !== undefined) data.kcal = partial.targets.kcal;
      if (partial.targets.protein !== undefined) data.protein = partial.targets.protein;
      if (partial.targets.carbs !== undefined) data.carbs = partial.targets.carbs;
      if (partial.targets.fat !== undefined) data.fat = partial.targets.fat;
    }
    return prisma.dayType.update({ where: { id }, data });
  },

  async remove(id: string) {
    return prisma.dayType.delete({ where: { id } });
  },
};
