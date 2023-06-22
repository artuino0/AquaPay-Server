import mongoose from "mongoose";

const databaseConn = async () => {
  const MONGO_URI = process.env.MONGO_DB || "";
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Database connected");
  } catch (error) {
    console.log(error);
    throw new Error("Error to connect database");
  }
};

export default databaseConn;
