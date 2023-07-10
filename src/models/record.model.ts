import { Schema, model } from "mongoose";

const recordSchema = new Schema(
  {
    serviceId: {
      type: Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    createdBy: {
      type: String,
      required: true,
    },
    periodId: {
      type: Schema.Types.ObjectId,
      ref: "Period",
      required: true,
    },
    currentRecord: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

recordSchema.index({ periodId: 1, serviceId: 1 }, { unique: true });

export const RecordModel = model("Record", recordSchema);
