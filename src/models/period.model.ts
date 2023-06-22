import { Schema, model } from "mongoose";

const PeriodSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    month: {
      type: Number,
      required: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
    activePayments: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

PeriodSchema.index({ year: 1, month: 1 }, { unique: true });

PeriodSchema.methods.toJSON = function () {
  const { __v, _id, ...period } = this.toObject();
  return { id: _id, ...period };
};

export const PeriodModel = model("Period", PeriodSchema);
