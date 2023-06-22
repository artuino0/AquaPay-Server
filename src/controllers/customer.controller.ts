import { Request, Response } from "express";
import { CustomerModel } from "../models/customer.model";

const getCustomers = async (req: Request, res: Response) => {
  const customers = await CustomerModel.find().populate({ path: "createdBy", select: "name" });
  res.json(customers);
};

const getCustomer = async (req: Request, res: Response) => {
  const { id } = req.params;
  const customer = await CustomerModel.findById(id)
    .populate({ path: "createdBy", select: "name" })
    .populate({ path: "services", populate: { path: "createdBy", select: "name" } })
    .sort({ "services.street": 1, "services.number": 1 })
    .then((rs) => {
      if (!rs) return res.status(404).json({ error: "Customer not found" });
      res.json(rs);
    })
    .catch((e) => {
      res.status(403).json(e);
    });
};

const createCustomer = async (req: Request, res: Response) => {
  const { externalContractId, name, lastName, middleName, street, number, neighborhood, city, state, phoneNumber, email } = req.body;
  const createdBy = req.uid;

  try {
    const customer = new CustomerModel({
      externalContractId,
      name,
      lastName,
      middleName,
      email,
      phoneNumber,
      createdBy,
    });
    const savedCustomer = await customer.save();
    res.status(201).json(savedCustomer);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateCustomer = (req: Request, res: Response) => {
  const { id } = req.params;
  const { externalContractId, name, lastName, email, middleName, phoneNumber } = req.body;

  CustomerModel.findByIdAndUpdate({ _id: id }, { externalContractId, name, lastName, email, middleName, phoneNumber }, { new: true })
    .then((rs) => {
      if (!rs) return res.status(404).json({ error: "Customer not found" });
      res.status(201).json({ updated: true, customer: rs });
    })
    .catch((e) => {
      res.status(403).json(e);
    });
};

const disableCustomer = (req: Request, res: Response) => {
  const { id } = req.params;
  CustomerModel.findByIdAndUpdate({ _id: id }, { active: false })
    .then((rs) => {
      res.status(201).json({ disabled: true });
    })
    .catch((e) => {
      res.status(403).json(e);
    });
};

export { getCustomers, getCustomer, createCustomer, updateCustomer, disableCustomer };
