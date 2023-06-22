import { Router } from "express";
import { createCustomer, disableCustomer, getCustomer, getCustomers, updateCustomer } from "../controllers/customer.controller";
import validateJWT from "../middlewares/jwt.middleware";

const customerRouter = Router();

customerRouter.get("/", validateJWT, getCustomers);
customerRouter.get("/:id", validateJWT, getCustomer);
customerRouter.post("/", validateJWT, createCustomer);
customerRouter.put("/:id", validateJWT, updateCustomer);
customerRouter.delete("/:id", validateJWT, disableCustomer);

export default customerRouter;
