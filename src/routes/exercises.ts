import { Router, Request, Response } from "express";
import { randomUUID } from "crypto";
import { Exercise, ExerciseSchema } from "../types/exercise";

const router = Router();
const exercises: Exercise[] = [];

// GET all
router.get("/", (_req, res) => {
  res.json({ data: exercises });
});

// POST create
router.post("/", (req: Request, res: Response) => {
  const parsed = ExerciseSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "ValidationError", details: parsed.error.flatten() });
  }

  const item: Exercise = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    ...parsed.data,
  };

  exercises.push(item);
  res.status(201).json({ data: item });
});

// PATCH update
router.patch("/:id", (req: Request, res: Response) => {
  const idx = exercises.findIndex((e) => e.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "NotFound" });

  const parsed = ExerciseSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "ValidationError", details: parsed.error.flatten() });
  }

  exercises[idx] = { ...exercises[idx], ...parsed.data };
  res.json({ data: exercises[idx] });
});

// DELETE
router.delete("/:id", (req: Request, res: Response) => {
  const idx = exercises.findIndex((e) => e.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "NotFound" });

  const [deleted] = exercises.splice(idx, 1);
  res.json({ data: deleted });
});

export default router;
