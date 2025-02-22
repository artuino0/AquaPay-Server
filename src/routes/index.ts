import { Router } from "express";
import authRouter from "./auth.routes";
import bankAccountRouter from "./bankaccount.routes";
import baseRouter from "./base.routes";
import chargeRouter from "./charge.routes";
import customerRouter from "./customer.routes";
import paymentRouter from "./payment.routes";
import serviceRouter from "./service.routes";
import recordRouter from "./record.routes";
import userRouter from "./user.routes";
import tariffRouter from "./tarrif.routes";
import periodRouter from "./period.routes";
import settingsRouter from "./settings.routes";

const routes = Router();

routes.use("/", baseRouter);
routes.use("/auth", authRouter);
routes.use("/bank-accounts", bankAccountRouter);
routes.use("/charges", chargeRouter);
routes.use("/customers", customerRouter);
routes.use("/payments", paymentRouter);
routes.use("/services", serviceRouter);
routes.use("/records", recordRouter);
routes.use("/users", userRouter);
routes.use("/tariffs", tariffRouter);
routes.use("/records", periodRouter);
routes.use("/settings", settingsRouter);

export default routes;
