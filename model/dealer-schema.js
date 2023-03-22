const mongoose = require("mongoose");

const dealerSchema = new mongoose.Schema(
  {
    dealerName: { type: String, required: true, trim: true },
    
    state: {
      type: String,
      trim: true,
      required: true,
    },password: {
      type: String,
      trim: true,
      required: true,
      minlength: [6],
    },
    city: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      // unique: true,
    },phone: {
      required: true,
      minlength: [10],
      type: Number,
      trim: true,
    },
    image: {
      type: String,
    },
    isBanned: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const dealermodel = mongoose.model("dealer", dealerSchema);
module.exports = dealermodel;
