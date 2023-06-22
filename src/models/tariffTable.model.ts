import mongoose, { Schema, Types, model } from "mongoose";

const tariffTableSchema = new Schema(
  {
    year: {
      type: Number,
      required: true,
      unique: true,
    },
    tariffs: [
      {
        consumption: {
          type: Number,
          required: true,
        },
        domestic: {
          type: Types.Decimal128,
          required: true,
        },
        commercial: {
          type: Types.Decimal128,
          required: true,
        },
        mixed: {
          type: Types.Decimal128,
          required: true,
        },
      },
    ],
    createdBy: {
      type: Schema.Types.ObjectId,
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
