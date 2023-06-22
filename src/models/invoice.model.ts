import { Schema, model } from "mongoose";

const InvoiceSchema = new Schema({
  customer: {
    type: Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  records: [
    {
      type: Schema.Types.ObjectId,
      ref: "Record",
      required: true,
    },
  ],
  billingCycle: {
    type: Schema.Types.ObjectId,
    ref: "BillingCycle",
    required: true,
  },
  previousBalance: {
    type: Number,
    required: true,
  },
  charges: [
    {
      type: Schema.Types.ObjectId,
      ref: "Charge",
      required: true,
    },
  ],
  agreement: {
    type: Schema.Types.ObjectId,
    ref: "Agreement",
  },
  subtotal: {
    type: Number,
    required: true,
  },
  isActive: {
    type: Boolean,
    required: true,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

export const InvoiceModel = model("Invoice", InvoiceSchema);
