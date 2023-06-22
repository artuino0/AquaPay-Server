import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { UserModel } from "../models/user.model";

const getUsers = async (req: Request, res: Response) => {
  const users = await UserModel.find().populate({ path: "createdBy", select: "name" });
  res.json(users);
};

const getUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await UserModel.findById(id)
    .populate({ path: "createdBy", select: "name" })
    .then((rs) => {
      if (!rs) return res.status(404).json({ error: "User not found" });
      res.json(user);
    })
    .catch((e) => {
      res.status(403).json(e);
    });
};

const createUser = (req: Request, res: Response) => {
  const { name, email, password, phone, temporaryPass } = req.body;

  console.log(req.body);

  let uid = req.uid;

  if (!password) return res.status(403).json({ field: "password", error: "Password is required" });

  let salt = bcrypt.genSaltSync(10);
  let hashPassword = bcrypt.hashSync(password, salt);

  const user = new UserModel({ name, email, password: hashPassword, createdBy: uid, phone, temporaryPass });
  user
    .save()
    .then((rs) => {
      res.status(201).json(rs);
    })
    .catch((e) => {
      res.status(403).json(e);
      console.log(e.message);
    });
};

const updateUser = (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email, phone } = req.body;

  UserModel.findByIdAndUpdate({ _id: id }, { name, email, phone }, { new: true })
    .then((rs) => {
      if (!rs) return res.status(404).json({ error: "User not found" });
      res.status(201).json({ updated: true, usuario: rs });
    })
    .catch((e) => {
      res.status(403).json(e);
    });
};

const disableUser = (req: Request, res: Response) => {
  const { id } = req.params;
  UserModel.findByIdAndUpdate({ _id: id }, { active: false })
    .then((rs) => {
      res.status(201).json({ disabled: true });
    })
    .catch((e) => {
      res.status(403).json(e);
    });
};

export { getUsers, getUser, createUser, updateUser, disableUser };
