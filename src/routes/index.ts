import { Router } from "express";
import authRouter from "./auth.routes";
import bankAccountRouter from "./bankaccount.routes";
import baseRouter from "./base.routes";
import billRouter from "./bill.routes";
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
routes.use("/bills", billRouter);
routes.use("/charges", chargeRouter);
routes.use("/customers", customerRouter);
routes.use("/payments", paymentRouter);
routes.use("/periods", periodRouter);
routes.use("/records", recordRouter);
routes.use("/services", serviceRouter);
routes.use("/settings", settingsRouter);
routes.use("/tariffs", tariffRouter);
routes.use("/users", userRouter);

export default routes;
