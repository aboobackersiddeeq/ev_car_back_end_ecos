const mongoose = require("mongoose");

const ObjectId = mongoose.Schema.Types.ObjectId;

const GroupSchema = new mongoose.Schema(
  {
    admin: [
      {
        type: Object,
        required: true,
      },
    ],

    groupName: {
      type: String,
      required: true,
    },

    members: [
      {
        type: Object,
      },
    ],
    events: {
      type: [ObjectId],
      ref: "Posts",
    },
    rides: {
      type: [ObjectId],
      ref: "Posts",
    },
    image: {
      type: String,
    },
    messageUpdate: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Group = mongoose.model("Group", GroupSchema);

module.exports = Group;
