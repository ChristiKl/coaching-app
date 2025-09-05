import { Router, Request, Response } from "express";

const router = Router();

// POST /echo → sends back whatever JSON body you pass
router.post("/", (req: Request, res: Response) => {
  res.json({ received: req.body });
});

export default router;
