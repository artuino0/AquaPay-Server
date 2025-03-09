import { Router } from "express";
import validateJWT from "../middlewares/jwt.middleware";
import {
  getPeriods,
  getPeriod,
  createPeriod,
  updatePeriod,
  deletePeriod,
  getCurrentActivePeriod,
} from "../controllers/period.controller";

const periodRouter = Router();

periodRouter.get("/", validateJWT, getPeriods);
periodRouter.get("/active", validateJWT, getCurrentActivePeriod);
periodRouter.get("/:id", validateJWT, getPeriod);
periodRouter.post("/", validateJWT, createPeriod);
periodRouter.put("/:id", validateJWT, updatePeriod);
periodRouter.delete("/:id", validateJWT, deletePeriod);

export default periodRouter;
