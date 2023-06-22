import { Schema, model } from "mongoose";

const chargeSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

chargeSchema.methods.toJSON = function () {
  const { __v, _id, ...charge } = this.toObject();
  return { id: _id, ...charge };
};

export const ChargeModel = model("Charge", chargeSchema);
