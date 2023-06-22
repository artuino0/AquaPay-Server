import { Request, Response } from "express";
import { PaymentModel } from "../models/payment.model";

const getPayments = async (req: Request, res: Response) => {
  const payments = await PaymentModel.find().populate({ path: "createdBy", select: "name" }).populate({ path: "customerId", select: "name" }).populate({ path: "receiptId", select: "receiptNumber" });
  res.json(payments);
};

const getPayment = async (req: Request, res: Response) => {
  const { id } = req.params;
  const payment = await PaymentModel.findById(id)
    .populate({ path: "createdBy", select: "name" })
    .populate({ path: "customerId", select: "name" })
    .populate({ path: "receiptId", select: "receiptNumber" })
    .then((rs) => {
      if (!rs) return res.status(404).json({ error: "Payment not found" });
      res.json(rs);
    })
    .catch((e) => {
      res.status(403).json(e);
    });
};

const createPayment = async (req: Request, res: Response) => {
  const { customerId, receiptId, amount, paymentType } = req.body;
  const createdBy = req.uid;

  try {
    const payment = new PaymentModel({ customerId, receiptId, amount, paymentType, createdBy });
    const savedPayment = await payment.save();

    res.status(201).json(savedPayment);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updatePayment = (req: Request, res: Response) => {
  const { id } = req.params;
  const { customerId, receiptId, amount, paymentType } = req.body;

  PaymentModel.findByIdAndUpdate({ _id: id }, { customerId, receiptId, amount, paymentType }, { new: true })
    .then((rs) => {
      if (!rs) return res.status(404).json({ error: "Payment not found" });
      res.status(201).json({ updated: true, payment: rs });
    })
    .catch((e) => {
      res.status(403).json(e);
    });
};

const deletePayment = (req: Request, res: Response) => {
  const { id } = req.params;
  PaymentModel.findByIdAndDelete(id)
    .then((rs) => {
      if (!rs) return res.status(404).json({ error: "Payment not found" });
      res.status(201).json({ deleted: true });
    })
    .catch((e) => {
      res.status(403).json(e);
    });
};

export { getPayments, getPayment, createPayment, updatePayment, deletePayment };
