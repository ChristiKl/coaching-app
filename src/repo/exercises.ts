import { prisma } from "../db/prisma";

export const exerciseRepo = {
  async list() {
    return prisma.exercise.findMany({ orderBy: { createdAt: "desc" } });
  },

  async create(input: {
    name: string;
    primaryMuscles: string[];
    secondaryMuscles?: string[];
    equipment?: string[];
    instructions?: string;
    mediaUrl?: string | null;
    source?: "local";
  }) {
    // Prisma will store arrays in JSON columns; JS arrays are fine to pass
    return prisma.exercise.create({
      data: {
        name: input.name,
        primaryMuscles: input.primaryMuscles,
        secondaryMuscles: input.secondaryMuscles ?? [],
        equipment: input.equipment ?? [],
        instructions: input.instructions,
        mediaUrl: input.mediaUrl ?? null,
        source: input.source ?? "local",
      },
    });
  },

  async update(id: string, partial: Partial<{
    name: string;
    primaryMuscles: string[];
    secondaryMuscles: string[];
    equipment: string[];
    instructions: string;
    mediaUrl: string | null;
    source: "local";
  }>) {
    return prisma.exercise.update({ where: { id }, data: partial as any });
  },

  async remove(id: string) {
    return prisma.exercise.delete({ where: { id } });
  },
};
