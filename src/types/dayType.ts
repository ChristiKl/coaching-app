import { z } from "zod";

// Incoming payload when creating a Day Type
export const DayTypeCreateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  targets: z.object({
    kcal: z.number().int().positive(),
    protein: z.number().nonnegative(),
    carbs: z.number().nonnegative(),
    fat: z.number().nonnegative(),
  }),
});

// nested targets fields are optional too
export const DayTypeUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  targets: z
    .object({
      kcal: z.number().int().positive().optional(),
      protein: z.number().nonnegative().optional(),
      carbs: z.number().nonnegative().optional(),
      fat: z.number().nonnegative().optional(),
    })
    .optional(),
});

// What we actually store/return from the API
export type DayType = {
  id: string; // generated server-side
  name: string;
  targets: { kcal: number; protein: number; carbs: number; fat: number };
  createdAt: string; // ISO timestamp
};
