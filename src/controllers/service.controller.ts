import { Request, Response } from "express";
import { ServiceModel } from "../models/service.model";
import { CustomerModel } from "../models/customer.model";

import { ObjectId } from "mongoose";

const getServices = async (req: Request, res: Response) => {
  const services = await ServiceModel.find().populate({ path: "createdBy", select: "name" }).populate({ path: "customerId", select: "externalContractId name lastName middleName" });
  res.json(services);
};

const getService = (req: Request, res: Response) => {
  const { id } = req.params;
  ServiceModel.findById(id)
    .populate({ path: "createdBy", select: "name" })
    .populate("customerId")
    .populate({
      path: "charges",
      select: "name amount",
    })
    .then((rs) => {
      if (!rs) return res.status(404).json({ error: "Service not found" });
      res.json(rs);
    })
    .catch((e) => {
      res.status(403).json(e);
    });
};

const createService = (req: Request, res: Response) => {
  const { customerId, meterNumber, serviceType, number, street, neighborhood, city, state } = req.body;
  const createdBy = req.uid;
  if (!meterNumber || !customerId) {
    return res.status(403).json({ error: 11001, message: "customerId or meterId are not empty" });
  }

  const service = new ServiceModel({ customerId, meterNumber, serviceType, number, street, neighborhood, city, state, createdBy });
  service
    .save()
    .then((rs) => {
      CustomerModel.findByIdAndUpdate(
        { _id: customerId },
        { $push: { services: rs._id } }, // Añade el ID del servicio al array de servicios de Customer
        { new: true } // Devuelve el documento de Customer actualizado
      )
        .populate("services") // Incluye los detalles de los servicios en el documento de Customer
        .then((customer) => {
          res.status(201).json(customer);
        });
    })
    .catch((e) => {
      if (e.code == 11000) {
        return res.status(403).json({ error: 11000, message: "Water meter id duplicated" });
      }
      res.status(403).json(e);
    });
};

const updateService = (req: Request, res: Response) => {
  const { id } = req.params;
  const { customerId, meterNumber, status, serviceType, charges } = req.body;

  ServiceModel.findByIdAndUpdate({ _id: id }, { customerId, meterNumber, status, serviceType, charges }, { new: true })
    .then((rs) => {
      if (!rs) return res.status(404).json({ error: "Service not found" });
      res.status(201).json({ updated: true, service: rs });
    })
    .catch((e) => {
      res.status(403).json(e);
    });
};

const disableService = (req: Request, res: Response) => {
  const { id } = req.params;
  ServiceModel.findByIdAndUpdate({ _id: id }, { status: 0 })
    .then((rs) => {
      res.status(201).json({ disabled: true });
    })
    .catch((e) => {
      res.status(403).json(e);
    });
};

export { getServices, getService, createService, updateService, disableService };
