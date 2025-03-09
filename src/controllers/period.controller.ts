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

const getCurrentActivePeriod = async (req: Request, res: Response) => {
  try {
    const period = await getActivePeriod();
    res.status(200).json(period);
  } catch (error) {
    console.error("Error getting active period:", error);
    res.status(500).json({ message: "Error getting active period" });
  }
};

const createPeriod = async (req: Request, res: Response) => {
  try {
    let data = req.body;
    console.log(monthSelector(data.month));
    data.name = `${monthSelector(data.month).toUpperCase()} ${data.year}`;
    const createdBy = req.uid;

    await PeriodModel.updateMany({
      $set: {
        active: false,
      },
    });

    const period = new PeriodModel({ ...data, createdBy });
    period.save();

    res.status(200).json(period);
  } catch (error) {
    console.error("Error creating period:", error);
  }
};

const updatePeriod = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, year, month } = req.body;
  try {
    const period = await PeriodModel.findByIdAndUpdate(
      id,
      { name, year, month },
      { new: true }
    );
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

const getActivePeriod = () => {
  return PeriodModel.findOne({ active: true }).lean();
};

export {
  getPeriods,
  getPeriod,
  createPeriod,
  updatePeriod,
  deletePeriod,
  getActivePeriod,
  getCurrentActivePeriod,
};
