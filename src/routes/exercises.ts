import { Router, Request, Response } from "express";
import { ExerciseSchema } from "../types/exercise";
import { validate } from "../middleware/validate";
import { AppError } from "../middleware/errors";
import { exerciseRepo } from "../repo/exercises"

const router = Router();

router.get("/", async (_req, res) => {
  const rows = await exerciseRepo.list();
  res.json({ data: rows });
});

router.post("/", validate(ExerciseSchema), async (req: Request, res: Response) => {
  const row = await exerciseRepo.create(req.body);
  res.status(201).json({ data: row });
});

router.patch("/:id", validate(ExerciseSchema.partial()), async (req: Request, res: Response) => {
  try {
    const row = await exerciseRepo.update(req.params.id, req.body);
    res.json({ data: row });
  } catch {
    throw new AppError("NotFound", "Exercise not found", 404);
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const row = await exerciseRepo.remove(req.params.id);
    res.json({ data: row });
  } catch {
    throw new AppError("NotFound", "Exercise not found", 404);
  }
});

export default router;
