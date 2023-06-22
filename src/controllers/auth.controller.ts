import { Request, Response } from "express";
import { UserModel } from "../models/user.model";
import bcrypt from "bcrypt";
import signToken from "../helpers/jwt.sign";
import passGenerator from "../helpers/temporal.password";

const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  let user = await UserModel.findOne({ email });

  if (!user) return res.status(403).json({ error: "Verifique sus credenciales e intentelo nuevamente!" });
  if (!user.active) return res.status(403).json({ error: "User is disabled" });

  if (bcrypt.compareSync(password, user.password!)) {
    let token = await signToken(user.id!);
    res.status(200).json({ user, token });
  } else {
    res.status(403).json({ error: "Verifique sus credenciales e intentelo nuevamente!" });
  }
};

/* TODO tiempo activa contraseña temporal */
/* const tempPassword = (req: Request, res: Response) => {
  const { id } = req.params;
  const { hours } = req.body;

  let temporalPass = passGenerator();

  UserModel.findByIdAndUpdate({ _id: id }, { temporalPass }, { new: true })
    .then((rs) => {
      if (!rs) return res.status(404).json({ error: "User not found" });
      res.status(201).json({ updated: true, usuario: rs });
    })
    .catch((e) => {
      res.status(403).json(e);
    });
}; */

export { loginUser };
