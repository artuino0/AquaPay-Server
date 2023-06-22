import { Request, Response } from "express";
import { BankAccountModel } from "../models/bankaccount.model";

const getBankAccounts = async (req: Request, res: Response) => {
  const bankAccounts = await BankAccountModel.find().populate({ path: "createdBy", select: "name" });
  res.json(bankAccounts);
};

const getBankAccount = async (req: Request, res: Response) => {
  const { id } = req.params;
  BankAccountModel.findById(id)
    .populate({ path: "createdBy", select: "name" })
    .then((rs) => {
      if (!rs) return res.status(404).json({ error: "Bank account not found" });
      res.json(rs);
    })
    .catch((e) => {
      console.log(e);
      res.status(403).json(e);
    });
};

const createBankAccount = (req: Request, res: Response) => {
  const { name, clabe, accountNumber } = req.body;

  let uid = req.uid;

  const bankAccount = new BankAccountModel({ name, clabe, accountNumber, createdBy: uid });
  bankAccount
    .save()
    .then((rs) => {
      res.status(201).json(rs);
    })
    .catch((e) => {
      res.status(403).json(e);
    });
};

const updateBankAccount = (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, clabe, accountNumber } = req.body;

  BankAccountModel.findByIdAndUpdate({ _id: id }, { name, clabe, accountNumber }, { new: true })
    .then((rs) => {
      if (!rs) return res.status(404).json({ error: "Bank account not found" });
      res.status(201).json(rs);
    })
    .catch((e) => {
      res.status(403).json(e);
    });
};

const deleteBankAccount = (req: Request, res: Response) => {
  const { id } = req.params;
  BankAccountModel.findByIdAndDelete(id)
    .then(() => {
      res.status(201).json({ message: "Bank account deleted successfully" });
    })
    .catch((e) => {
      res.status(403).json(e);
    });
};

export { getBankAccounts, getBankAccount, createBankAccount, updateBankAccount, deleteBankAccount };
