import { Router, Request, Response } from "express";
import { randomUUID } from "crypto";
import { Exercise, ExerciseSchema } from "../types/exercise";
import { validate } from "../middleware/validate";
import { AppError } from "../middleware/errors";

const router = Router();
const exercises: Exercise[] = [];

// GET all
router.get("/", (_req, res) => {
  res.json({ data: exercises });
});

// POST create
router.post("/", validate(ExerciseSchema), (req: Request, res: Response) => {
  const body = req.body as Omit<Exercise, "id" | "createdAt">;
  const item: Exercise = { id: randomUUID(), createdAt: new Date().toISOString(), ...body };

  // const parsed = ExerciseSchema.safeParse(req.body);
  // if (!parsed.success) {
  //   return res.status(400).json({ error: "ValidationError", details: parsed.error.flatten() });
  // }

  // const item: Exercise = {
  //   id: randomUUID(),
  //   createdAt: new Date().toISOString(),
  //   ...parsed.data,
  // };

  exercises.push(item);
  res.status(201).json({ data: item });
});

// PATCH update
router.patch("/:id", validate(ExerciseSchema.partial()), (req: Request, res: Response) => {
  const idx = exercises.findIndex((e) => e.id === req.params.id);
  if (idx === -1) throw new AppError("NotFound", "Exercise not found", 404);
  exercises[idx] = { ...exercises[idx], ...req.body as Partial<Exercise> };

  // if (idx === -1) return res.status(404).json({ error: "NotFound" });

  // const parsed = ExerciseSchema.partial().safeParse(req.body);
  // if (!parsed.success) {
  //   return res.status(400).json({ error: "ValidationError", details: parsed.error.flatten() });
  // }

  // exercises[idx] = { ...exercises[idx], ...parsed.data };
  res.json({ data: exercises[idx] });
});

// DELETE
router.delete("/:id", (req: Request, res: Response) => {
  const idx = exercises.findIndex((e) => e.id === req.params.id);
  if (idx === -1) throw new AppError("NotFound", "Exercise not found", 404);

  const [deleted] = exercises.splice(idx, 1);
  res.json({ data: deleted });
});

export default router;
