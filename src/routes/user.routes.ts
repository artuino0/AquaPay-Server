import { Router } from "express";
import {
  createUser,
  disableUser,
  getUser,
  getUsers,
  updateUser,
} from "../controllers/user.controller";
import validateJWT from "../middlewares/jwt.middleware";

const userRouter = Router();

userRouter.get("/", validateJWT, getUsers);
userRouter.get("/:id", validateJWT, getUser);
userRouter.post("/", createUser);
userRouter.put("/:id", validateJWT, updateUser);
userRouter.delete("/:id", validateJWT, disableUser);

export default userRouter;
