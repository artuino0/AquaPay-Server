import { Request, Response } from "express";
import { ChargeModel } from "../models/charge.model";

const getCharges = async (req: Request, res: Response) => {
  try {
    const filters = req.query;
    const page = parseInt(filters.page as string) || 1;
    const limit = parseInt(filters.limit as string) || 10;
    const skip = (page - 1) * limit;
    let $and: any[] = [];

    if (filters.keyword) {
      const keyword = new RegExp(filters.keyword as string, "i");
      $and.push({
        $or: [{ name: { $regex: keyword } }, { amount: { $regex: keyword } }],
      });
    }

    const query = $and.length > 0 ? { $and } : {};

    const [total, charges] = await Promise.all([
      ChargeModel.countDocuments(query),
      ChargeModel.find(query)
        .skip(skip)
        .limit(limit)
        .populate({ path: "createdBy", select: "name" }),
    ]);

    const totalPages = Math.ceil(total / limit);
    const pagination = {
      total,
      totalPages,
      totalNow: charges.length,
    };

    res.json({
      pagination,
      data: charges,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
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
  const data = req.body;

  let uid = req.uid;

  const charge = new ChargeModel({ ...data, createdBy: uid });
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
  const data = req.body;

  ChargeModel.findByIdAndUpdate({ _id: id }, { ...data }, { new: true })
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
