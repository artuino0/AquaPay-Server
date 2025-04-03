import { Router } from "express";
import { BillController } from "../controllers/bill.controller";
import validateJWT from "../middlewares/jwt.middleware";

const billRouter = Router();
const billController = new BillController();

billRouter.post(
  "/generate/:serviceId",
  validateJWT,
  billController.generateBillForService
);
billRouter.get(
  "/list/:serviceId",
  validateJWT,
  billController.getBillsByService
);
billRouter.post(
  "/generate-all",
  validateJWT,
  billController.generateBillsForAllServices
);
billRouter.get("/download/:billId", validateJWT, billController.downloadPdf);

export default billRouter;
