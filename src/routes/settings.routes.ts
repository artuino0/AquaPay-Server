import { Router } from "express";
import { getSettings, saveSettings, upload } from "../controllers/settings.controller";
import validateJWT from "../middlewares/jwt.middleware";

const settingsRouter = Router();

settingsRouter.get("/", validateJWT, getSettings);
settingsRouter.post("/", [validateJWT, upload.single("logo")], saveSettings);

export default settingsRouter;
