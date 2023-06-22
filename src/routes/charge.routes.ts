import { Router } from "express";
import { createCharge, deleteCharge, getCharge, getCharges, updateCharge } from "../controllers/charge.controller";
import validateJWT from "../middlewares/jwt.middleware";

const chargeRouter = Router();

chargeRouter.get("/", validateJWT, getCharges);
chargeRouter.get("/:id", validateJWT, getCharge);
chargeRouter.post("/", validateJWT, createCharge);
chargeRouter.put("/:id", validateJWT, updateCharge);
chargeRouter.delete("/:id", validateJWT, deleteCharge);

export default chargeRouter;
