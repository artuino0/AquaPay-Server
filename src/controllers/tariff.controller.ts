import e, { Request, Response } from "express";
import { TariffTableModel } from "../models/tariffTable.model";
import { Types } from "mongoose";

const getTariffs = (req: Request, res: Response) => {
  TariffTableModel.find()
    .populate({ path: "createdBy", select: "name" })
    .then((rs) => {
      res.status(200).json(rs);
    })
    .catch((err) => {
      res.status(500).json({ message: "Error checking if a tariff table exists", err });
      return;
    });
};

const createTarrifCicle = (req: Request, res: Response) => {
  const { year, maxConsuption } = req.body;
  console.log(maxConsuption);
  const createdBy = req.uid;
  const tariffs = [];

  if (!year || !maxConsuption) {
    res.status(400).json({ message: "Values {maxConsumtion - year} not provided" });
    return;
  }

  for (let i = 1; i < parseInt(maxConsuption) + 1; i++) {
    tariffs.push({
      consumption: i,
      domestic: 0,
      commercial: 0,
      mixed: 0,
    });
  }

  const newCicle = new TariffTableModel({ year, tariffs, createdBy });

  newCicle
    .save()
    .then((rs) => {
      res.status(201).json(rs);
    })
    .catch((err) => {
      res.status(500).json({ message: "Error checking if a tariff table exists", err });
      return;
    });
};

interface TariffUpdate {
  cycleId: string;
  newTariff: string;
  tariffId: string;
  typeTariff: string;
}

export const updateTariffs = async (req: Request, res: Response) => {
  const updates: TariffUpdate[] = req.body;
  const { cycleId } = req.params;
  try {
    let tariffTable = await TariffTableModel.findById(cycleId);

    if (!tariffTable) {
      return res.status(404).json({ message: "Tariff table not found" });
    }

    for (const update of updates) {
      let subdocumentIndex = 0;

      tariffTable.tariffs.forEach((tariff, i) => {
        if (tariff._id?.toString() == update.tariffId) {
          subdocumentIndex = i;
        }
      });

      if (update.typeTariff == "domestic") {
        tariffTable.tariffs[subdocumentIndex].domestic = new Types.Decimal128(update.newTariff);
      }
      if (update.typeTariff == "commercial") {
        tariffTable.tariffs[subdocumentIndex].commercial = new Types.Decimal128(update.newTariff);
      }
      if (update.typeTariff == "mixed") {
        tariffTable.tariffs[subdocumentIndex].mixed = new Types.Decimal128(update.newTariff);
      }
    }

    await tariffTable.save();
    return res.status(200).json({ message: "tariffs correctly updated" });
  } catch (e: any) {
    return res.status(400).json({ error: e.message });
  }
};

export { createTarrifCicle, getTariffs };
