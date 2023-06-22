import { Router } from "express";
import { createPayment, getPayment, getPayments, updatePayment, deletePayment } from "../controllers/payment.controller";
import validateJWT from "../middlewares/jwt.middleware";

const paymentRouter = Router();

paymentRouter.get("/", validateJWT, getPayments);
paymentRouter.get("/:id", validateJWT, getPayment);
paymentRouter.post("/", validateJWT, createPayment);
paymentRouter.put("/:id", validateJWT, updatePayment);
paymentRouter.delete("/:id", validateJWT, deletePayment);

export default paymentRouter;
