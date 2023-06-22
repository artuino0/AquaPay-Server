import { Router } from "express";
import { createRecord, disableRecord, getRecord, getRecords, updateRecord } from "../controllers/record.controller";
import validateJWT from "../middlewares/jwt.middleware";

const recordRouter = Router();

recordRouter.get("/", validateJWT, getRecords);
recordRouter.get("/:id", validateJWT, getRecord);
recordRouter.post("/", validateJWT, createRecord);
recordRouter.put("/:id", validateJWT, updateRecord);
recordRouter.delete("/:id", validateJWT, disableRecord);

export default recordRouter;
