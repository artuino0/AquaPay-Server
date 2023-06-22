import { Router } from "express";
import { getServices, getService, createService, updateService, disableService } from "../controllers/service.controller";
import validateJWT from "../middlewares/jwt.middleware";

const serviceRouter = Router();

serviceRouter.get("/", validateJWT, getServices);
serviceRouter.get("/:id", validateJWT, getService);
serviceRouter.post("/", validateJWT, createService);
serviceRouter.put("/:id", validateJWT, updateService);
serviceRouter.delete("/:id", validateJWT, disableService);

export default serviceRouter;
