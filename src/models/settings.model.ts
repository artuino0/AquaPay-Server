import { Schema, model } from "mongoose";

const settingsSchema = new Schema({
  companyName: {
    type: String,
    required: true,
  },
  address: { type: String, required: true },
  downtown: { type: String, required: true },
  postalCode: { type: String, required: true },
  city_state: { type: String, required: true },
  phone: { type: String, required: true },
  cellphone: { type: String, required: true },
  imagen: { type: String },
  captureDays: { type: [Number], default: [] },
});

settingsSchema.methods.toJSON = function () {
  const { __v, _id, ...settings } = this.toObject();
  return { ...settings };
};

export const SettingsModel = model("Settings", settingsSchema);
