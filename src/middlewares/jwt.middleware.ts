import { Request, Response, NextFunction } from "express";
import verifyToken from "../helpers/jwt.verifier";

declare global {
  namespace Express {
    export interface Request {
      uid: string;
    }
  }
}

const validateJWT = async (req: Request, res: Response, next: NextFunction) => {
  let token = req.headers.authorization;

  if (!token) return res.status(403).json({ error: "Token is required" });

  try {
    const decodedToken = await verifyToken(token);
    req.uid = decodedToken.uid;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Authorization token is not valid" });
  }
};

export default validateJWT;
