import express, { Application } from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import { autRouter, bankAccountRouter, baseRouter, chargeRouter, customerRouter, periodRouter, recordRouter, serviceRouter, settingsRouter, tariffRouter, userRouter } from "../routes";
import databaseConn from "../database/mongo";

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
    this.app.use(this.basePath, baseRouter);
    this.app.use(`${this.basePath}/users`, userRouter);
    this.app.use(`${this.basePath}/auth`, autRouter);
    this.app.use(`${this.basePath}/bank-accounts`, bankAccountRouter);
    this.app.use(`${this.basePath}/charges`, chargeRouter);
    this.app.use(`${this.basePath}/customers`, customerRouter);
    this.app.use(`${this.basePath}/services`, serviceRouter);
    this.app.use(`${this.basePath}/tariffs`, tariffRouter);
    this.app.use(`${this.basePath}/periods`, periodRouter);
    this.app.use(`${this.basePath}/records`, recordRouter);
    this.app.use(`${this.basePath}/settings`, settingsRouter);
  }

  listen() {
    this.app.listen(this.PORT, () => {
      console.log(`Server running on port: ${this.PORT}`);
    });
  }
}

export default Server;
