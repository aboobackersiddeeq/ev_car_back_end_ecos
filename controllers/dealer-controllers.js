const Dealer = require("../model/dealer-schema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const bookingSchema = require("../model/booking-schema");
const testDrive = require("../model/test-drive-schema");
module.exports = {
  dealerLogin: async (req, res) => {
    try {
      const { email, password } = req.body;
      const dealer = await Dealer.findOne({ email: email });
      if (dealer) {
        if (dealer.isBanned === false) {
          isMatch = await bcrypt.compare(password, dealer.password);
          if (isMatch) {
            const token = jwt.sign(
              { dealerId: dealer._id },
              process.env.ACCESS_TOKEN_SECRET,
              { expiresIn: "5d" }
            );
            const dealerDetails = {
              email: dealer.email,
            };
            res.json({
              auth: true,
              token: token,
              result: dealerDetails,
              status: "success",
              message: "signin success",
            });
          } else {
            res.json({
              auth: false,
              status: "failed",
              message: "Admin password is incorrect",
            });
          }
        } else {
          res.json({
            status: "failed",
            auth: false,
            message: "Somthing went wrong , Please Contact us",
          });
        }
      } else {
        res.json({
          adminauth: false,
          status: "failed",
          message: "No Dealer found",
        });
      }
    } catch (error) {
      res.json({ status: "failed", message: error.message });
    }
  },
  dealerAuth: async (req, res) => {
    try {
      let dealer = await Dealer.findById(req.dealerId);
      if (dealer) {
        if (dealer.isBanned === false) {
          const dealerDetails = {
            email: dealer.email,
          };
          res.json({
            auth: true,
            result: dealerDetails,
            status: "success",
            message: "signin success",
          });
        } else {
          res.json({
            status: "failed",
            auth: false,
            message: "Somthing went wrong , Please Contact us",
          });
        }
      }
    } catch (error) {
      res.json({ status: "failed", message: error.message, auth: false });
    }
  },
  getBooking: async (req, res) => {
    try {
      const Details = await bookingSchema.find({ dealer: req.dealerId });
      Details.reverse();
      res.json({ status: "success", result: Details });
    } catch (error) {
      res.json({ status: "failed", message: error.message });
    }
  },
  dashboard: async (req, res) => {
    try {
      const totalBooking = (await bookingSchema.find({ dealer: req.dealerId }))
        .length;
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set time to midnight

      const todayBookingCount = await bookingSchema.find(
        {
          createdAt: { $gte: today },
        },
        { dealer: req.dealerId }
      );
      const todayTestDriveCount = await testDrive.find({
        createdAt: { $gte: today },
      });

      const revenue = await bookingSchema.aggregate([
        {
          $match: {
            $and: [
              { status: { $eq: "Placed" }, dealer: { $eq: req.dealerId } },
            ],
          },
        },
        {
          $group: {
            _id: {},

            total: { $sum: "$bookingPrice" },
            count: { $sum: 1 },
          },
        },
      ]);
      res.json({
        auth: true,
        revenue: revenue[0].total,
        totalBooking: totalBooking,
        todayBookingCount: todayBookingCount.length,
        todayTestDriveCount: todayTestDriveCount.length,
        status: "success",
        message: "signin success",
      });
    } catch (error) {
      res.json({ status: "failed", message: error.message });
    }
  },

  // For admin

  deleteDealer: async (req, res) => {
    try {
      const id = req.body.id;
      await Dealer.deleteOne({ _id: id }).then(async () => {
        const Details = await Dealer.find({});
        Details.reverse();
        res.json({ status: "success", result: Details });
      });
    } catch (error) {
      res.json({ status: "failed", message: error.message });
    }
  },
  editDealer: async (req, res) => {
    try {
      const { dealerName, phone, city, state, email } = req.body;
      const id = req.body.editId;
      await Dealer.findByIdAndUpdate(id, {
        dealerName,
        phone,
        city,
        state,
        email,
      }).then(async () => {
        const Details = await Dealer.find({});
        Details.reverse();
        res.json({ status: "success", result: Details });
      });
    } catch (error) {
      res.json({ status: "failed", message: error.message });
    }
  },
  addDealer: async (req, res) => {
    try {
      const { dealerName, phone, password, city, state, email } = req.body;
      const exist = await Dealer.findOne({ dealerName: dealerName });
      if (exist) {
        res.json({
          status: "failed",
          message: " already added this dealerName ",
        });
      } else {
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password.trim(), salt);
        await Dealer.create({
          dealerName,
          phone,
          password: hashPassword,
          city,
          state,
          email,
        }).then(async (result) => {
          const Details = await Dealer.find({});
          Details.reverse();
          res.json({ status: "success", result: Details });
        });
      }
    } catch (error) {
      res.json({ status: "failed", message: error.message });
    }
  },
  getDealer: async (req, res) => {
    try {
      const Details = await Dealer.find({});
      Details.reverse();
      res.json({ status: "success", result: Details });
    } catch (error) {
      res.json({ status: "failed", message: error.message });
    }
  },
  block_dealer: async (req, res) => {
    try {
      const id = req.body.id;
      const dealer = await Dealer.findOne({ _id: id });
      if (dealer.isBanned === false) {
        await Dealer.findByIdAndUpdate(id, { isBanned: true });
      } else {
        await Dealer.findByIdAndUpdate(id, { isBanned: false });
      }
      const Details = await Dealer.find({});
      Details.reverse();
      res.json({ status: "success", result: Details });
    } catch (error) {
      res.json({ status: "failed", message: error.message });
    }
  },
};
