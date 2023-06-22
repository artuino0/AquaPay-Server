import { Router } from "express";
import { createTarrifCicle, getTariffs } from "../controllers/tariff.controller";
import validateJWT from "../middlewares/jwt.middleware";

const tariffRouter = Router();

tariffRouter.get("/", validateJWT, getTariffs);
tariffRouter.post("/", validateJWT, createTarrifCicle);

export default tariffRouter;
