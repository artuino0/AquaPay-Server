import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { UserModel } from "../models/user.model";

const getUsers = async (req: Request, res: Response) => {
  const { page = 1, limit = 10, showDeleted = "false" } = req.query;
  try {
    const filter = showDeleted === "false" ? { active: true } : {};

    const users = await UserModel.find(filter)
      .limit(Number(limit))
      .skip(Number(limit) * (Number(page) - 1))
      .populate({ path: "createdBy", select: "name" })
      .sort({ createdAt: -1 });

    const totalUsers = await UserModel.countDocuments(filter);
    const totalPages = Math.ceil(totalUsers / Number(limit));
    const totalNow = users.length;

    const pagination = {
      total: totalUsers,
      totalPages,
      totalNow,
    };

    res.json({
      data: users,
      pagination,
    });
  } catch (e: any) {
    res.status(403).json({ error: e.message });
  }
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

  if (!password)
    return res
      .status(403)
      .json({ field: "password", error: "Password is required" });

  let salt = bcrypt.genSaltSync(10);
  let hashPassword = bcrypt.hashSync(password, salt);

  const user = new UserModel({
    name,
    email,
    password: hashPassword,
    createdBy: uid,
    phone,
    temporaryPass,
  });
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

  UserModel.findByIdAndUpdate(
    { _id: id },
    { name, email, phone },
    { new: true }
  )
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
  UserModel.findByIdAndUpdate(id, { active: false }, { new: true })
    .then((rs) => {
      res.status(201).json({ disabled: true });
    })
    .catch((e) => {
      res.status(403).json(e);
    });
};

export { getUsers, getUser, createUser, updateUser, disableUser };
