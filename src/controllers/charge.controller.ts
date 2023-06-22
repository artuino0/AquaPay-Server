import { Request, Response } from "express";
import { ChargeModel } from "../models/charge.model";

const getCharges = async (req: Request, res: Response) => {
  const charges = await ChargeModel.find().populate({ path: "createdBy", select: "name" });
  res.json(charges);
};

const getCharge = async (req: Request, res: Response) => {
  const { id } = req.params;
  const charge = await ChargeModel.findById(id)
    .populate({ path: "createdBy", select: "name" })
    .then((rs) => {
      if (!rs) return res.status(404).json({ error: "Charge not found" });
      res.json(charge);
    })
    .catch((e) => {
      res.status(403).json(e);
    });
};

const createCharge = (req: Request, res: Response) => {
  const { name, amount } = req.body;

  let uid = req.uid;

  const charge = new ChargeModel({ name, amount, createdBy: uid });
  charge
    .save()
    .then((rs) => {
      res.status(201).json(rs);
    })
    .catch((e) => {
      res.status(403).json(e);
    });
};

const updateCharge = (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, amount } = req.body;

  ChargeModel.findByIdAndUpdate({ _id: id }, { name, amount }, { new: true })
    .then((rs) => {
      if (!rs) return res.status(404).json({ error: "Charge not found" });
      res.status(201).json(rs);
    })
    .catch((e) => {
      res.status(403).json(e);
    });
};

const deleteCharge = (req: Request, res: Response) => {
  const { id } = req.params;
  ChargeModel.findByIdAndDelete(id)
    .then(() => {
      res.status(201).json({ message: "Charge deleted successfully" });
    })
    .catch((e) => {
      res.status(403).json(e);
    });
};

export { getCharges, getCharge, createCharge, updateCharge, deleteCharge };
