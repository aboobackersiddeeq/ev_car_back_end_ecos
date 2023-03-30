const mongoose = require("mongoose");

const mapSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      min: 3,
      max: 60,
    },
    desc: {
      type: String,
      required: true,
      min: 3,
    },
    type: {
      type: String,
      required: true,
    },
    location: {
      type: { type: String },
      coordinates: [],
    },
    long: {
      type: Number,
      required: true,
    },
    lat: {
      type: Number,
      required: true,
    },

    isBanned: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);
mapSchema.index({ location: "2dsphere" });
const Pin = mongoose.model("map", mapSchema);
module.exports = Pin;
