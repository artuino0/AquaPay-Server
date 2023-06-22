import { Schema, model } from "mongoose";

const bankAccountSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  clabe: {
    type: String,
    required: true,
  },
  accountNumber: {
    type: String,
    required: true,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

bankAccountSchema.methods.toJSON = function () {
  const { __v, _id, ...bankAccount } = this.toObject();
  return { id: _id, ...bankAccount };
};

export const BankAccountModel = model("BankAccount", bankAccountSchema);
