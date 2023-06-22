import { Schema, model } from "mongoose";

const recordSchema = new Schema(
  {
    serviceId: {
      type: String,
      required: true,
    },
    createdBy: {
      type: String,
      required: true,
    },
    billingCycle: {
      type: Schema.Types.ObjectId,
      ref: "BillingCycle",
      required: true,
    },
    previousRecord: {
      type: Number,
      required: true,
    },
    currentRecord: {
      type: Number,
      required: true,
    },
    consumption: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export const RecordModel = model("Record", recordSchema);
