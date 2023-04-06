const Admin = require("../model/admin-schema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../model/user-schema");
const Product = require("../model/product-schema");
const testDrive = require("../model/test-drive-schema");
const Dealer = require("../model/dealer-schema");
const bookingSchema = require("../model/booking-schema");
const _ = require("lodash");
module.exports = {
  adminLogin: async (req, res) => {
    try {
      const { email, password } = req.body;
      const admin = await Admin.findOne({ email: email });
      if (admin) {
        isMatch = await bcrypt.compare(password, admin.password);
        if (isMatch) {
          const token = jwt.sign(
            { adminId: admin._id },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "5d" }
          );
          const admindetails = {
            email: admin.email,
          };
          res.json({
            auth: true,
            token: token,
            result: admindetails,
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
          adminauth: false,
          status: "failed",
          message: "No Admin found",
        });
      }
    } catch (error) {
      res.json({ status: "failed", message: error.message });
    }
  },
  adminAuth: async (req, res) => {
    try {
      let admin = await Admin.findById(req.adminId);
      const admindetails = {
        email: admin.email,
      };
      res.json({
        auth: true,
        result: admindetails,
        status: "success",
        message: "signin success",
      });
    } catch (error) {
      res.json({ status: "failed", message: error.message });
    }
  },
  // dashboard

  dashboard: async (req, res) => {
    try {
      const totalBooking = (await bookingSchema.find()).length;
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set time to midnight

      const todayBookingCount = await bookingSchema.find({
        createdAt: { $gte: today },
      });
      const todayTestDriveCount = await testDrive.find({
        createdAt: { $gte: today },
      });

      const revenue = await bookingSchema.aggregate([
        {
          $match: {
            status: { $eq: "Placed" },
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

  // dealres details

  chart1: async (req, res) => {
    try {
      const booking = await bookingSchema.aggregate([
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
              day: { $dayOfMonth: "$createdAt" },
            },
            booking: { $sum: 1 },
          },
        },
        { $sort: { createdAt: -1 } },
      ]);
      const testDriveBooking = await testDrive.aggregate([
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
              day: { $dayOfMonth: "$createdAt" },
            },
            testDrive: { $sum: 1 },
          },
        },
        { $sort: { createdAt: -1 } },
      ]);
      const mergedObject = _.merge(booking, testDriveBooking);
      const data = mergedObject.map((el) => {
        const newOne = el;
        // eslint-disable-next-line no-underscore-dangle
        newOne._id = Object.values(newOne._id).join("-");
        return newOne;
      });

      const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      const revenue = await bookingSchema.aggregate([
        {
          $match: {
            status: { $eq: "Placed" },
          },
        },

        {
          $group: {
            _id: {
              month: { $month: "$createdAt" },
            },
            total: { $sum: "$bookingPrice" },
            // count: { $sum: 1 },
          },
        },
        { $sort: { createdAt: -1 } },
      ]);
      const sales = revenue.map((el) => {
        const newOne = el;
        // eslint-disable-next-line no-underscore-dangle
        newOne._id = months[newOne._id.month - 1];
        return newOne;
      });

      res.json({ status: "success", result: data, revenue: sales });
    } catch (error) {
      res.json({ status: "failed", message: error.message });
    }
  },
};
