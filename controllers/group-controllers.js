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
      .sort({ updatedAt: -1, messageUpdate: -1, createdAt: -1 })
      .then((groups) => res.json({ result: groups, status: "success" }))
      .catch((err) =>
        res.json({ status: "failed", message: "could not get groups", err })
      );
  },
  getGroupsOfUser: (req, res) => {
    Group.find({ "members.id": req.body.id })
      .sort({ updatedAt: -1, messageUpdate: -1, createdAt: -1 })
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
        .then(() => {
          Group.find({ "members.id": req.body.userId })
            .sort({ messageUpdate: -1 })
            .then((groups) => res.json({ result: groups, status: "success" }));
        })
        .catch((err) =>
          res.json({ status: "failed", message: "could not get groups", err })
        );
    } catch (err) {
      res.status(400).json({ error: "could not join group", err });
    }
  },
  messages: async (req, res) => {
    try {
      await Messages.find({ group: req.body.groupId })
        .then((groupMsg) => res.json({ result: groupMsg, status: "success" }))
        .catch((err) =>
          res.json({
            status: "failed",
            message: "could not get group messages",
            err,
          })
        );
    } catch (err) {
      res.status(400).json({
        status: "failed",
        message: "could not get group messages",
        err,
      });
    }
  },
  editGrpDp: async (req, res) => {
    try {
      Group.findOneAndUpdate(
        {
          _id: req.body.id,
        },
        {
          $set: {
            image: req.file.path,
          },
        }
      )
        .then((data) => res.json(data))
        .catch((err) => res.json({ error: "could not edit dp", err }));
    } catch (err) {
      res.status(500).json(err);
    }
  },

  editGrpName: async (req, res) => {
    try {
      Group.findOneAndUpdate(
        {
          _id: req.body.id,
        },
        {
          $set: {
            groupName: req.body.grpName,
          },
        }
      )
        .then((data) => res.json(data))
        .catch((err) => res.json({ error: "could not edit grp name", err }));
    } catch (err) {
      res.status(500).json(err);
    }
  },
  addPostImage: async (req, res) => {
    try {
      const id = req.body.id;
      const image = req.files.img;
      let imageUrl;
      if (image) {
        imageUrl = image[0].path;
        imageUrl = imageUrl.substring(6);
      }
      await Group.findByIdAndUpdate(id, {
        image: imageUrl,
        groupName: req.body.groupName,
      })
        .then(async () => {
          const Details = await Group.findOne({ _id: id });
          res.json({ status: "success", result: Details });
        })
        .catch((error) => {
          res.json({ status: "failed", message: error.message });
        });
    } catch (error) {
      res.json({ status: "failed", message: error.message });
    }
  },
};
