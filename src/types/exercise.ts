import { z } from "zod";

export const ExerciseSchema = z.object({
  name: z.string().min(1, "Exercise name is required"),
  primaryMuscles: z.array(z.string()).min(1, "At least one primary muscle is required"),
  secondaryMuscles: z.array(z.string()).optional().default([]),
  equipment: z.array(z.string()).optional().default([]),
  instructions: z.string().optional().default(""),
  mediaUrl: z.string().url().optional(),
  source: z.enum(["local"]).default("local"),
});

export type ExerciseInput = z.infer<typeof ExerciseSchema>;

export type Exercise = ExerciseInput & {
  id: string;
  createdAt: string;
};
