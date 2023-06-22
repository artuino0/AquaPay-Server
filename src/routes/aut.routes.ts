import { Router } from "express";
import { loginUser } from "../controllers/auth.controller";
import validateJWT from "../middlewares/jwt.middleware";

const autRouter = Router();

autRouter.post("/login", loginUser);
/* autRouter.put("/generate-password/:id", validateJWT, tempPassword); */

export default autRouter;
