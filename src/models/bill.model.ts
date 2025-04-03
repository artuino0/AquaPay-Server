import { Schema, model } from "mongoose";

const BillSchema = new Schema(
  {
    serviceId: {
      type: Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    periodId: {
      type: Schema.Types.ObjectId,
      ref: "Period",
      required: true,
    },
    previousReading: {
      type: Number,
      required: true,
    },
    currentReading: {
      type: Number,
      required: true,
    },
    consumption: {
      type: Number,
      required: true,
    },
    tariffId: {
      type: Schema.Types.ObjectId,
      ref: "TariffTable",
    },
    // Montos
    previousDebt: {
      type: Number,
      default: 0,
    },
    payment: {
      type: Number,
      default: 0,
    },
    consumptionAmount: {
      type: Number,
      required: true,
    },
    baseRate: {
      type: Number,
      required: true,
    },
    surcharges: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    // Cargos aplicados
    charges: [
      {
        chargeId: {
          type: Schema.Types.ObjectId,
          ref: "Charge",
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        amount: {
          type: Number,
          required: true,
        },
      },
    ],
    payments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Payment",
      },
    ],
    dueDate: {
      type: Date,
      required: true,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    contractNumber: {
      type: String,
      required: true,
    },
    meterNumber: {
      type: String,
    },
    hasMeter: {
      type: Boolean,
      default: true,
    },
    serviceType: {
      type: String,
      enum: ["domestic", "commercial", "mixed"],
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

BillSchema.index({ periodId: 1, serviceId: 1 }, { unique: true });

BillSchema.methods.toJSON = function () {
  const { __v, _id, ...bill } = this.toObject();
  return { id: _id, ...bill };
};

export const BillModel = model("Bill", BillSchema);
