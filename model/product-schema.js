const mongoose = require("mongoose");

const productschema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    price: {
      type: Number,
      required: true,
    },
    bookingPrice: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
    },
    description: {
      type: String,
    },
    color: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);
const productmodel = mongoose.model("product", productschema);
module.exports = productmodel;
