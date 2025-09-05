import { Router, Request, Response } from "express";
import { DayTypeCreateSchema, DayTypeUpdateSchema } from "../types/dayType";
import { validate } from "../middleware/validate";
import { AppError } from "../middleware/errors";
import { dayTypeRepo } from "../repo/dayTypes";

const router = Router();

router.get("/", async (_req: Request, res: Response) => {
  const rows = await dayTypeRepo.list();
  // map DB shape -> API shape (targets grouped)
  const data = rows.map(r => ({
    id: r.id,
    name: r.name,
    targets: { kcal: r.kcal, protein: r.protein, carbs: r.carbs, fat: r.fat },
    createdAt: r.createdAt.toISOString(),
  }));
  res.json({ data });
});

router.post("/", validate(DayTypeCreateSchema), async (req: Request, res: Response) => {
  const row = await dayTypeRepo.create(req.body);
  res.status(201).json({
    data: {
      id: row.id,
      name: row.name,
      targets: { kcal: row.kcal, protein: row.protein, carbs: row.carbs, fat: row.fat },
      createdAt: row.createdAt.toISOString(),
    },
  });
});

router.patch("/:id", validate(DayTypeUpdateSchema), async (req: Request, res: Response) => {
  try {
    const row = await dayTypeRepo.update(req.params.id, req.body);
    res.json({
      data: {
        id: row.id,
        name: row.name,
        targets: { kcal: row.kcal, protein: row.protein, carbs: row.carbs, fat: row.fat },
        createdAt: row.createdAt.toISOString(),
      },
    });
  } catch {
    throw new AppError("NotFound", "DayType not found", 404);
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const row = await dayTypeRepo.remove(req.params.id);
    res.json({
      data: {
        id: row.id,
        name: row.name,
        targets: { kcal: row.kcal, protein: row.protein, carbs: row.carbs, fat: row.fat },
        createdAt: row.createdAt.toISOString(),
      },
    });
  } catch {
    throw new AppError("NotFound", "DayType not found", 404);
  }
});

export default router;
