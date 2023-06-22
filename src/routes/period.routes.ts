import { Router } from "express";
import validateJWT from "../middlewares/jwt.middleware";
import { getPeriods, getPeriod, createPeriod, updatePeriod, deletePeriod } from "../controllers/period.controller";

const periodRouter = Router();

periodRouter.get("/", getPeriods);
periodRouter.get("/:id", getPeriod);
periodRouter.post("/", validateJWT, createPeriod);
periodRouter.put("/:id", validateJWT, updatePeriod);
periodRouter.delete("/:id", deletePeriod);

export default periodRouter;
