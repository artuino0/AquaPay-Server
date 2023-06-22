import { Schema, model } from "mongoose";

const CustomerSchema = new Schema({
  externalContractId: {
    type: Number,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
  },
  middleName: {
    type: String,
  },
  services: [
    {
      type: Schema.Types.ObjectId,
      ref: "Service",
    },
  ],
  email: {
    type: String,
  },
  phoneNumber: {
    type: String,
  },
  active: {
    type: Boolean,
    default: true,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

CustomerSchema.methods.toJSON = function () {
  const { __v, _id, ...customer } = this.toObject();
  return { id: _id, ...customer };
};

export const CustomerModel = model("Customer", CustomerSchema);
