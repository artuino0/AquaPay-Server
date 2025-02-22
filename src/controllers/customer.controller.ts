import { Request, Response } from "express";
import { CustomerModel } from "../models/customer.model";

const getCustomers = async (req: Request, res: Response) => {
  const { page = 1, limit = 10, showDeleted = "false" } = req.query;
  try {
    const filter = showDeleted === "false" ? { active: true } : {};

    const customers = await CustomerModel.find(filter)
      .limit(Number(limit))
      .skip(Number(limit) * (Number(page) - 1))
      .populate({ path: "createdBy", select: "name" });

    const totalCustomers = await CustomerModel.countDocuments(filter);
    const totalPages = Math.ceil(totalCustomers / Number(limit));
    const totalNow = customers.length;

    const pagination = {
      total: totalCustomers,
      totalPages,
      totalNow,
    };

    res.json({
      data: customers,
      pagination,
    });
  } catch (e: any) {
    res.status(403).json({ error: e.message });
  }
};

const getCustomer = async (req: Request, res: Response) => {
  const { id } = req.params;
  const customer = await CustomerModel.findById(id)
    .populate({ path: "createdBy", select: "name" })
    .populate({
      path: "services",
      populate: { path: "createdBy", select: "name" },
    })
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
  const {
    externalContractId,
    name,
    lastName,
    middleName,
    street,
    number,
    neighborhood,
    city,
    state,
    phoneNumber,
    email,
  } = req.body;
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
  const { externalContractId, name, lastName, email, middleName, phoneNumber } =
    req.body;

  CustomerModel.findByIdAndUpdate(
    { _id: id },
    { externalContractId, name, lastName, email, middleName, phoneNumber },
    { new: true }
  )
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
  console.log(id);
  CustomerModel.findByIdAndUpdate({ _id: id }, { active: false })
    .then((rs) => {
      res.status(201).json({ disabled: true });
    })
    .catch((e) => {
      res.status(403).json(e);
    });
};

export {
  getCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  disableCustomer,
};
