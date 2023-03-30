const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    names: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },

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
    pincode: {
      type: Number,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    color: {
      type: String,
      trim: true,
    },
    model: {
      type: String,
      trim: true,
    },
    bookingPrice: {
      type: Number,
      trim: true,
    },
    address1: {
      type: String,
      trim: true,
    },
    address2: {
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
    dealer: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      trim: true,
      default: "Pending",
    },

    isBanned: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);
const Booking = mongoose.model("booking", bookingSchema);
module.exports = Booking;
