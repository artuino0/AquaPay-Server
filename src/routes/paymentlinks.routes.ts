import { Router } from "express";
import {
  redirectToStripe,
  paymentLinkWebhook,
} from "../controllers/paymentlink.controller";

const paymentLinkRouter = Router();

paymentLinkRouter.get("/", paymentLinkWebhook);
paymentLinkRouter.get("/:id", redirectToStripe);

export default paymentLinkRouter;
