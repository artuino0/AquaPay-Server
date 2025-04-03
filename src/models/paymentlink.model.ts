import { Schema, model } from "mongoose";
import { CounterModel } from "./counter.model";

export enum PaymentLinkStatus {
  SENT = "sent",
  OPENED = "opened",
  PAID = "paid",
  EXPIRED = "expired",
  CANCELLED = "cancelled",
}

const PaymentLinkSchema = new Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    stripeUrl: {
      type: String,
      required: true,
    },
    stripeId: {
      type: String,
      required: true,
    },
    sequentialId: {
      type: Number,
      required: true,
    },
    paymentDate: {
      type: Date,
    },
    billId: {
      type: Schema.Types.ObjectId,
      ref: "Bill",
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(PaymentLinkStatus),
      default: PaymentLinkStatus.SENT,
    },
    expirationDate: {
      type: Date,
      required: true,
      default: () => {
        const date = new Date();
        date.setDate(date.getDate() + 2);
        return date;
      },
    },
  },
  {
    timestamps: true,
  }
);

PaymentLinkSchema.pre("save", async function (next) {
  if (this.isNew) {
    try {
      const counter = await CounterModel.findByIdAndUpdate(
        { _id: "reservationId" },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      this.sequentialId = counter.seq;
      next();
    } catch (error) {
      next(error as Error);
    }
  } else {
    next();
  }
});

export const PaymentLinkModel = model("PaymentLink", PaymentLinkSchema);
