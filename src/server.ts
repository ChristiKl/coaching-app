import express from "express";
import cors from "cors";
import echoRouter from "./echo";
import dayTypesRouter from "./routes/dayTypes";
import exercisesRouter from "./routes/exercises";
import { errorHandler } from "./middleware/errors";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Health check
app.get("/ping", (_req, res) => {
  res.json({ ok: true, message: "pong" });
});

// Use echo route
app.use("/echo", echoRouter);

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

app.use("/api/day-types", dayTypesRouter);

app.use("/api/exercises", exercisesRouter);

app.use(errorHandler);