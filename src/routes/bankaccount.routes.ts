import { Router } from "express";
import { createBankAccount, deleteBankAccount, getBankAccount, getBankAccounts, updateBankAccount } from "../controllers/bankaccount.controller";
import validateJWT from "../middlewares/jwt.middleware";

const bankAccountRouter = Router();

bankAccountRouter.get("/", validateJWT, getBankAccounts);
bankAccountRouter.get("/:id", validateJWT, getBankAccount);
bankAccountRouter.post("/", validateJWT, createBankAccount);
bankAccountRouter.put("/:id", validateJWT, updateBankAccount);
bankAccountRouter.delete("/:id", validateJWT, deleteBankAccount);

export default bankAccountRouter;
