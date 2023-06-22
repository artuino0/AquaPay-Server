import { Request, Response } from "express";
import { PeriodModel } from "../models/period.model";
import { monthSelector } from "../helpers/month.selector";

const getPeriods = async (req: Request, res: Response) => {
  PeriodModel.find()
    .populate({ path: "createdBy", select: "name" })
    .sort({ year: -1, month: -1 })
    .then((periods) => {
      res.status(200).json(periods);
    })
    .catch((e) => {
      console.error("Error getting periods:", e);
      res.status(500).json({ message: "Error getting periods" });
    });
};

const getPeriod = async (req: Request, res: Response) => {
  const { id } = req.params;
  PeriodModel.findById(id)
    .then((period) => {
      res.status(200).json(period);
    })
    .catch((e) => {
      console.error("Error getting period:", e);
      res.status(500).json({ message: "Error getting period" });
    });
};

const createPeriod = (req: Request, res: Response) => {
  const { year, month } = req.body;
  console.log(monthSelector(month));
  const name = `${monthSelector(month).toUpperCase()} ${year}`;
  const createdBy = req.uid;

  const period = new PeriodModel({ name, year, month, createdBy });
  period
    .save()
    .then(async (period) => {
      await PeriodModel.updateMany({ _id: { $ne: period.id } }, { active: false });
      res.status(201).json(period);
    })
    .catch((e) => {
      console.error("Error creating period:", e);
      res.status(500).json({ message: "Error creating period" });
    });
};

const updatePeriod = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, year, month } = req.body;
  try {
    const period = await PeriodModel.findByIdAndUpdate(id, { name, year, month }, { new: true });
    res.status(200).json(period);
  } catch (error) {
    console.error("Error updating period:", error);
    res.status(500).json({ message: "Error updating period" });
  }
};

const deletePeriod = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await PeriodModel.findByIdAndDelete(id);
    res.status(200).json({ message: "Period deleted" });
  } catch (error) {
    console.error("Error deleting period:", error);
    res.status(500).json({ message: "Error deleting period" });
  }
};

export { getPeriods, getPeriod, createPeriod, updatePeriod, deletePeriod };
