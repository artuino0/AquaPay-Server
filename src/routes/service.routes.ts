import { Router } from "express";
import { getServices, getService, createService, updateService, disableService, getRecordsByService } from "../controllers/service.controller";
import validateJWT from "../middlewares/jwt.middleware";

const serviceRouter = Router();

serviceRouter.get("/", validateJWT, getServices);
serviceRouter.get("/:id", validateJWT, getService);
serviceRouter.get("/records", validateJWT, getRecordsByService);
serviceRouter.post("/", validateJWT, createService);
serviceRouter.put("/:id", validateJWT, updateService);
serviceRouter.delete("/:id", validateJWT, disableService);

export default serviceRouter;
