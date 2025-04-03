import { CounterModel } from "../models/counter.model";

export const getNextSequentialId = async (
  counterName: string
): Promise<number> => {
  const counter = await CounterModel.findByIdAndUpdate(
    counterName,
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return counter.seq;
};
