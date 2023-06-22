import { Router } from "express";
import { getBase } from "../controllers/base.controller";

const baseRouter = Router();

baseRouter.get("/", getBase);

export default baseRouter;
