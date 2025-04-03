import express, { Application } from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import routerV1 from "../routes";
import databaseConn from "../database/mongo";
import paymentLinkRouter from "../routes/paymentlinks.routes";

dotenv.config();

class Server {
  app: Application;
  basePath: string = "/api/v1";
  PORT: string = process.env.PORT || "4000";

  constructor() {
    this.app = express();
    this.db();
    this.middlewares();
    this.routes();
  }

  async db() {
    await databaseConn();
  }

  middlewares() {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.static("public"));
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(morgan("dev"));
  }

  routes() {
    this.app.use("/redirect/paymentlink", paymentLinkRouter);
    this.app.use("/webhook/stripe", paymentLinkRouter);
    this.app.use(this.basePath, routerV1);
  }

  listen() {
    this.app.listen(this.PORT, () => {
      console.log(`Server running on port: ${this.PORT}`);
    });
  }
}

export default Server;
