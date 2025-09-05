import { Router, Request, Response } from "express";
import { randomUUID } from "crypto";
import { DayType, DayTypeCreateSchema, DayTypeUpdateSchema } from "../types/dayType";

const router = Router();

// In-memory store (resets when server restarts)
const dayTypes: DayType[] = [];

/**
 * GET /api/day-types
 * List all day types
 */
router.get("/", (_req: Request, res: Response) => {
  res.json({ data: dayTypes });
});

/**
 * POST /api/day-types
 * Create a new day type (validate input)
 */
router.post("/", (req: Request, res: Response) => {
  const parsed = DayTypeCreateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ error: "ValidationError", details: parsed.error.flatten() });
  }

  const item: DayType = {
    id: randomUUID(),
    name: parsed.data.name,
    targets: parsed.data.targets,
    createdAt: new Date().toISOString(),
  };

  dayTypes.push(item);
  res.status(201).json({ data: item });
});

/**
 * PATCH /api/day-types/:id
 * Partially update a day type (validate partial payload)
 */
router.patch("/:id", (req: Request, res: Response) => {
  const idx = dayTypes.findIndex((dt) => dt.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "NotFound" });

  const parsed = DayTypeUpdateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ error: "ValidationError", details: parsed.error.flatten() });
  }

  const current = dayTypes[idx];
  const mergedTargets = parsed.data.targets
    ? { ...current.targets, ...parsed.data.targets }
    : current.targets;

  const updated: DayType = {
    ...current,
    ...parsed.data,
    targets: mergedTargets,
  };

  dayTypes[idx] = updated;
  res.json({ data: updated });
});

/**
 * DELETE /api/day-types/:id
 * Remove a day type
 */
router.delete("/:id", (req: Request, res: Response) => {
  const idx = dayTypes.findIndex((dt) => dt.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "NotFound" });

  const [deleted] = dayTypes.splice(idx, 1);
  res.json({ data: deleted });
});

export default router;
