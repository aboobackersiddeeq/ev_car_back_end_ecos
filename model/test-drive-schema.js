const mongoose = require("mongoose");

const testDrive = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: Number,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    model: {
      type: String,
      trim: true,
    },
    dealership: {
      type: String,
      trim: true,
    },
    checked: {
      type: Boolean,
      trim: true,
    },
    status: {
      type: String,
      lowercase: true,
      trim: true,
    },
    isBanned: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);
const TestDrive = mongoose.model("testDrive", testDrive);
module.exports = TestDrive;
