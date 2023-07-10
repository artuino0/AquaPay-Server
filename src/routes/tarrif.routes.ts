import { Router } from "express";
import { createTarrifCicle, getTariffs, updateTariffs } from "../controllers/tariff.controller";
import validateJWT from "../middlewares/jwt.middleware";

const tariffRouter = Router();

tariffRouter.get("/", validateJWT, getTariffs);
tariffRouter.post("/", validateJWT, createTarrifCicle);
tariffRouter.put("/:cycleId", validateJWT, updateTariffs);

export default tariffRouter;
