import { Request, Response } from "express";
import { RecordModel } from "../models/record.model";
import { ServiceModel } from "../models/service.model";
import { getActivePeriod } from "./period.controller";

const getRecords = async (req: Request, res: Response) => {
  const records = await RecordModel.find()
    .populate({
      path: "createdBy",
      select: "name",
      populate: { path: "periodId" },
    })
    .populate("serviceId");
  res.json(records);
};

const getRecordsByService = async (req: Request, res: Response) => {
  const { serviceId } = req.params;
  let id = serviceId;
  ServiceModel.findById(id)
    .populate({ path: "records", populate: { path: "periodId" } })
    .populate({ path: "customerId" })
    .then((rs) => {
      if (!rs) return res.status(404).json({ error: "Service not found" });
      res.json(rs);
    })
    .catch((e) => {
      res.status(403).json(e);
    });
};

const getRecord = async (req: Request, res: Response) => {
  const { id } = req.params;
  RecordModel.findById(id)
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
  const { serviceId, periodId, currentRecord } = req.body;

  const createdBy = req.uid;

  //getActivePeriod

  let period = await getActivePeriod();

  const newRecord = new RecordModel({
    serviceId,
    createdBy,
    periodId: period!._id,
    currentRecord,
  });

  newRecord
    .save()
    .then((savedRecord) => {
      return ServiceModel.findByIdAndUpdate(serviceId, {
        $push: { records: savedRecord._id },
      });
    })
    .then(() => {
      return res.status(201).json({ message: "Record created" });
    })
    .catch((error) => {
      console.error(error);
      res.status(403).json(error);
    });
};

const updateRecord = (req: Request, res: Response) => {
  const { id } = req.params;
  const { serviceId, previousReading, currentReading } = req.body;

  RecordModel.findByIdAndUpdate(
    { _id: id },
    {
      serviceId,
      previousReading,
      currentReading,
      consumption: currentReading - previousReading,
    },
    { new: true }
  )
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

const getLatestRecord = async (req: Request, res: Response) => {
  const { serviceId, periodId } = req.params;

  try {
    const record = await RecordModel.findOne({ serviceId, periodId })
      .sort({ createdAt: -1 })
      .populate({ path: "createdBy", select: "name" })
      .exec();

    if (!record) {
      return res.status(404).json({ error: "Record not found" });
    }

    res.json(record);
  } catch (error: any) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export {
  getRecords,
  getRecord,
  getRecordsByService,
  createRecord,
  updateRecord,
  disableRecord,
  getLatestRecord,
};
