import { LogModel } from "../models/log.model";

interface ILog {
  level: string;
  message: string;
  metadata: any;
  createdBy: string;
}

export const saveLogToDatabase = async (myLog: ILog): Promise<void> => {
  try {
    const log = new LogModel({
      ...myLog,
    });
    await log.save();
    console.log("Log saved to database");
  } catch (error) {
    console.error("Error saving log to database:", error);
    throw error;
  }
};
