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
    general: {
      type: Boolean,
      default: false
    },
    applyWOMeter: {
      type: Boolean,
      default: false 
    },
    special: {
      type: Boolean,
      default: false
    },
  },
  { timestamps: true }
);

chargeSchema.pre('save', function(next) {
  if (this.special && (this.general || this.applyWOMeter)) {
    next(new Error('Special charges cannot be general or apply to services without meter'));
  }
  next();
});

chargeSchema.methods.toJSON = function () {
  const { __v, _id, ...charge } = this.toObject();
  return { id: _id, ...charge };
};

export const ChargeModel = model("Charge", chargeSchema);
