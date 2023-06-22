import { Schema, model } from "mongoose";

const agreementSchema = new Schema({
  billId: {
    type: Schema.Types.ObjectId,
    ref: "Invoice",
    required: true,
  },
  discount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

export const AgreementModel = model("Agreement", agreementSchema);
