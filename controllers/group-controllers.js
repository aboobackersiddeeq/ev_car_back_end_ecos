const Group = require("../model/group-schema");
const Messages = require("../model/messege-schema");

module.exports = {
  newGroup: async (req, res) => {
    const exist = await Group.findOne({ groupName: req.body.roomName });

    if (exist) {
      res.json({ status: "failed", message: " group name already being used" });
    } else {
      const admin = {
        name: req.body.adminName,
        id: req.userId,
      };

      const newgroup = new Group({
        admin: admin,
        groupName: req.body.roomName,
        members: admin,
      });
      try {
        const newGroup = await newgroup.save();
        res.json({ result: newGroup, status: "success" });
      } catch (err) {
        res.json({ status: "failed", message: err.message });
      }
    }
  },
  getGroups: (req, res) => {
    Group.find({ "members.id": { $ne: req.body.id } })
      .sort({ messageUpdate: -1 })
      .then((groups) => res.json({ result: groups, status: "success" }))
      .catch((err) =>
        res.json({ status: "failed", message: "could not get groups", err })
      );
  },
  getGroupsOfUser: (req, res) => {
    Group.find({ "members.id": req.body.id })
      .sort({ messageUpdate: -1 })
      .then((groups) => res.json({ result: groups, status: "success" }))
      .catch((err) =>
        res.json({ status: "failed", message: "could not get groups", err })
      );
  },
  joinGroup: async (req, res) => {
    try {
      const member = {
        name: req.body.userName,
        id: req.body.userId,
      };
      const groups = await Group.findOneAndUpdate(
        { _id: req.body.groupId },
        {
          $push: {
            members: member,
          },
        }
      );
      await groups
        .save()
        .then(() =>{
            Group.find({ "members.id":  req.body.userId })
            .sort({ messageUpdate: -1 })
            .then((groups) => res.json({ result: groups, status: "success" }))})
        .catch((err) =>
          res.json({ status: "failed", message: "could not get groups", err })
        );
    } catch (err) {
      res.status(400).json({ error: "could not join group", err });
    }
  },
   messages : async (req, res) => {
    try {
        await Messages.find({ group: req.body.groupId })
            .then((groupMsg) => res.json({ result: groupMsg, status: "success" }))
            .catch((err) => res.json({ status: "failed", message: "could not get group messages", err }));
    } catch (err) {
        res.status(400).json({ status: "failed", message: "could not get group messages", err });
    }
}
};
