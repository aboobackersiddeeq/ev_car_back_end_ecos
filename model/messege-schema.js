const { upperCase } = require("lodash");
const mongoose = require("mongoose");

const ObjectId = mongoose.Schema.Types.ObjectId;

const MessageSchema = new mongoose.Schema(
  {
    name: {
      type: Object,
      required: true,
      trim: true,
    },

    text: {
      type: String,
      required: true,
    },

    group: {
      type: ObjectId,
      ref: "Group",
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

const Messages = mongoose.model("Message", MessageSchema);

module.exports = Messages;
