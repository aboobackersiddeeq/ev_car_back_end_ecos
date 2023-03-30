const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, trim: true },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      trim: true,
      minlength: [6],
    },
    phone: {
      type: Number,
      trim: true,
    },
    image: {
      type: String,
    },
    testDriveBooking: [
      {
        type: Object,
      },
    ],
    Booking: {
      type: String,
    },
    Provider: {
      type: String,
    },

    isBanned: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);
const usermodel = mongoose.model("user", userSchema);
module.exports = usermodel;
