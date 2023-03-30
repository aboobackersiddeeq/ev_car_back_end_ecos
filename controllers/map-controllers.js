const MapSchema = require("../model/map-schema");

module.exports = {
  addMap: async (req, res) => {
    try {
      const { type, desc, title, lat, long, email, username } = req.body;
      const exist = await MapSchema.findOne({ title: title });
      if (!exist) {
        await MapSchema.create({
          type,
          desc,
          title,
          lat,
          long,
          location: {
            type: "Point",
            coordinates: [long, lat],
          },
          email,
          username,
        }).then(async () => {
          const Details = await MapSchema.find({});
          res.json({
            result: Details,
            status: "success",
            message: "success",
          });
        });
      } else {
        res.json({
          status: "failed",
          message: " already added this title  ",
        });
      }
    } catch (error) {
      res.json({ status: "failed", message: error.message });
    }
  },
  getMap: async (req, res) => {
    try {
      const Details = await MapSchema.find({});
      res.json({
        result: Details,
        status: "success",
        message: "success",
      });
    } catch (error) {
      res.json({ status: "failed", message: error.message });
    }
  },
  getPlaceNear: async (req, res) => {
    const { long, lat } = req.body;
    try {
      const Details = await MapSchema.find({
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [long, lat],
            },
            $maxDistance: 15000, // distance in meters
          },
        },
      });
      res.json({
        result: Details,
        status: "success",
        message: "success",
      });
      console.log(Details);
    } catch (error) {
      console.log(error);
      res.json({ status: "failed", message: error.message });
    }
  },
};
