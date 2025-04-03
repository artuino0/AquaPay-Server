import { Schema, model } from "mongoose";

const serviceSchema = new Schema(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
    },
    meterNumber: {
      type: String,
    },
    status: {
      type: Boolean,
      default: true,
    },
    serviceType: {
      type: String,
      enum: ["domestic", "commercial", "mixed"],
      required: true,
    },
    street: {
      type: String,
      required: true,
    },
    number: {
      type: String,
      required: true,
    },
    neighborhood: {
      type: String,
      default: "Fracc. Villa de las flores",
    },
    city: {
      type: String,
      default: "Silao",
    },
    state: {
      type: String,
      default: "Guanajuato",
    },
    lastRead: {
      type: Number,
      default: 0,
    },
    previousDebt: {
      type: Number,
      default: 0,
    },
    charges: [
      {
        type: Schema.Types.ObjectId,
        ref: "Charge",
      },
    ],
    records: [
      {
        type: Schema.Types.ObjectId,
        ref: "Record",
      },
    ],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    migratedDebt: {
      type: Number,
    },
    migratedConsumption: {
      type: Number,
    },
  },
  { timestamps: true }
);

export const ServiceModel = model("Service", serviceSchema);
