import { Request, Response } from "express";
import { TariffTableModel } from "../models/tariffTable.model";

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

const updateTarrif = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { tariffs } = req.body;

  TariffTableModel.findOneAndUpdate({ _id: id }, { tariffs: tariffs }, { new: true })
    .then((rs) => {
      res.status(200).json(rs);
    })
    .catch((e) => {
      console.error("Error al actualizar las tarifas:", e);
      res.status(500).json({ error: "Error al actualizar las tarifas" });
    });
};

export { createTarrifCicle, getTariffs };
