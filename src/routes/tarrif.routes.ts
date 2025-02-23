import { Router } from "express";
import {
  createTarrifCicle,
  getTariffs,
  updateTariffs,
  activateTariff,
} from "../controllers/tariff.controller";
import validateJWT from "../middlewares/jwt.middleware";

const tariffRouter = Router();

tariffRouter.get("/", validateJWT, getTariffs);
tariffRouter.post("/", validateJWT, createTarrifCicle);
tariffRouter.put("/:cycleId", validateJWT, updateTariffs);
tariffRouter.patch("/:id/activate", validateJWT, activateTariff);

export default tariffRouter;
