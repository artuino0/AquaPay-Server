import { Schema, model, Types } from "mongoose";

const tariffSchema = new Schema({
  consumption: {
    type: Number,
    required: true,
  },
  domestic: {
    type: Schema.Types.Decimal128,
    required: true,
  },
  commercial: {
    type: Schema.Types.Decimal128,
    required: true,
  },
  mixed: {
    type: Schema.Types.Decimal128,
    required: true,
  },
});

tariffSchema.pre("save", function (next) {
  if (!this._id) {
    this._id = new Types.ObjectId();
  }
  next();
});

const tariffTableSchema = new Schema(
  {
    year: {
      type: Number,
      required: true,
      unique: true,
    },
    tariffs: [tariffSchema],
    createdBy: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    active: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const TariffTableModel = model("TariffTable", tariffTableSchema);
