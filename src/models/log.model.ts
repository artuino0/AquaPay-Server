import { Schema, model } from "mongoose";

const logSchema = new Schema({
  level: {
    type: String,
    required: true,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
    required: true,
  },
  metadata: {
    type: Object,
    required: false,
  },
});

export const LogModel = model("Log", logSchema);
