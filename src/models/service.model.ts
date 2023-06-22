import { Schema, model } from "mongoose";

const serviceSchema = new Schema({
  customerId: {
    type: Schema.Types.ObjectId,
    ref: "Customer",
  },
  meterNumber: {
    type: String,
    unique: true,
    require: true,
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
  charges: [
    {
      type: Schema.Types.ObjectId,
      ref: "Charge",
    },
  ],
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

export const ServiceModel = model("Service", serviceSchema);
