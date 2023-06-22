import { Request, Response } from "express";
import { RecordModel } from "../models/record.model";
import { ServiceModel } from "../models/service.model";

const getRecords = async (req: Request, res: Response) => {
  const records = await RecordModel.find().populate({ path: "createdBy", select: "name" }).populate("serviceId");
  res.json(records);
};

const getRecord = async (req: Request, res: Response) => {
  const { id } = req.params;
  const record = await RecordModel.findById(id)
    .populate({ path: "createdBy", select: "name" })
    .populate("serviceId")
    .then((rs) => {
      if (!rs) return res.status(404).json({ error: "Record not found" });
      res.json(rs);
    })
    .catch((e) => {
      res.status(403).json(e);
    });
};

const createRecord = async (req: Request, res: Response) => {
  const { serviceId, previousReading, currentReading } = req.body;
  const createdBy = req.uid;

  try {
    const service = await ServiceModel.findById(serviceId);
    if (!service) return res.status(404).json({ error: "Service not found" });

    const consumption = currentReading - previousReading;

    const record = new RecordModel({ serviceId, createdBy, previousReading, currentReading, consumption });
    const savedRecord = await record.save();

    res.status(201).json(savedRecord);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateRecord = (req: Request, res: Response) => {
  const { id } = req.params;
  const { serviceId, previousReading, currentReading } = req.body;

  RecordModel.findByIdAndUpdate({ _id: id }, { serviceId, previousReading, currentReading, consumption: currentReading - previousReading }, { new: true })
    .then((rs) => {
      if (!rs) return res.status(404).json({ error: "Record not found" });
      res.status(201).json({ updated: true, record: rs });
    })
    .catch((e) => {
      res.status(403).json(e);
    });
};

const disableRecord = (req: Request, res: Response) => {
  const { id } = req.params;
  RecordModel.findByIdAndUpdate({ _id: id }, { status: 0 })
    .then((rs) => {
      res.status(201).json({ disabled: true });
    })
    .catch((e) => {
      res.status(403).json(e);
    });
};

export { getRecords, getRecord, createRecord, updateRecord, disableRecord };
