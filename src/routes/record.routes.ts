import { Router } from "express";
import { createRecord, disableRecord, getLatestRecord, getRecord, getRecords, getRecordsByService, updateRecord } from "../controllers/record.controller";
import validateJWT from "../middlewares/jwt.middleware";

const recordRouter = Router();

recordRouter.get("/", validateJWT, getRecords);
recordRouter.get("/:id", validateJWT, getRecord);
recordRouter.get("/service/:serviceId", validateJWT, getRecordsByService);
recordRouter.post("/", validateJWT, createRecord);
recordRouter.put("/:id", validateJWT, updateRecord);
recordRouter.delete("/:id", validateJWT, disableRecord);

export default recordRouter;
