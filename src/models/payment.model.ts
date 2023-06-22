import { Schema, model } from "mongoose";

const paymentSchema = new Schema({
  customerId: {
    type: Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  receiptId: {
    type: Schema.Types.ObjectId,
    ref: "Receipt",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  /* Transferencia, Deposito, Referencia(OXXO), Efectivo */
  paymentType: {
    type: String,
    enum: ["T", "D", "R", "E"],
    required: true,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

export const PaymentModel = model("Payment", paymentSchema);
