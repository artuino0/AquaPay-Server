import { Request, Response } from "express";

const getBase = (req: Request, res: Response) => {
  res.status(200).json({
    apiVersion: "1.0.0",
    basePath: "/api/v1",
    developedBy: "Arturo Muñoz",
  });
};

export { getBase };
