import { Request, Response } from "express";
import { readFileSync } from "fs";
import { compile } from "handlebars";
import { join } from "path";
import {
  PaymentLinkModel,
  PaymentLinkStatus,
} from "../models/paymentlink.model";

export const redirectToStripe = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const paymentLink = await PaymentLinkModel.findOne({ sequentialId: id });

    if (!paymentLink) {
      return res.status(404).json({ message: "Payment link not found" });
    }

    if (paymentLink.status === "paid") {
      return res.status(400).json({ message: "Payment already completed" });
    }

    if (paymentLink.status === "cancelled") {
      return res.status(400).json({ message: "Payment link cancelled" });
    }

    if (new Date() > new Date(paymentLink.expirationDate)) {
      paymentLink.status = PaymentLinkStatus.EXPIRED;
      await paymentLink.save();
      return res.status(400).json({ message: "Payment link expired" });
    }

    if (paymentLink.status === "sent") {
      paymentLink.status = PaymentLinkStatus.OPENED;
      await paymentLink.save();
    }

    res.redirect(paymentLink.stripeUrl);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const generatePaymentLink = async (req: Request, res: Response) => {
  try {
    const { billNumber } = req.body;
    const userId = req.uid;

    if (!billNumber) {
      return res.status(400).json({ message: "Bill number is required" });
    }

    /* const paymentLink =
      await PaymentLinkService.generatePaymentLinkByBillNumber(
        billNumber,
        userId
      ); */

    res.status(201).json({});
  } catch (error: any) {
    console.error(error);
    res.status(error.message.includes("no encontrada") ? 404 : 500).json({
      message: error.message || "Internal server error",
    });
  }
};

export const paymentLinkWebhook = async (req: Request, res: Response) => {
  try {
    const { status, reference } = req.query;

    if (status !== "success") {
      return res.status(400).json({ message: "Payment failed" });
    }

    const paymentLink = await PaymentLinkModel.findOne({
      sequentialId: reference,
    }).populate({
      path: "billId",
      populate: [
        { path: "customerId", select: "name" },
        { path: "serviceId", select: "name" },
      ],
    });

    if (!paymentLink) {
      return res.status(404).json({ message: "Payment link not found" });
    }

    paymentLink.status = PaymentLinkStatus.PAID;
    paymentLink.paymentDate = new Date();
    await paymentLink.save();

    const templatePath = join(
      __dirname,
      "..",
      "templates",
      "success-payment.template.html"
    );
    const template = readFileSync(templatePath, "utf-8");
    const compiledTemplate = compile(template);

    const templateData = {
      amount: paymentLink.amount.toFixed(2),
      paymentDate: new Date().toLocaleDateString("es-MX"),
      customerName: (paymentLink.billId as any).customerId.name,
      serviceName: (paymentLink.billId as any).serviceId.name,
      reference: paymentLink.sequentialId,
      billId: paymentLink.billId._id,
    };

    const html = compiledTemplate(templateData);
    res.setHeader("Content-Type", "text/html");
    res.send(html);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
