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

  // users details
  getUsers: async (req, res) => {
    try {
      const users = await User.find({});
      users.reverse();
      res.json({ status: "success", result: users });
    } catch (error) {
      res.json({ status: "failed", message: error.message });
    }
  },
  deleteUsers: async (req, res) => {
    try {
      const id = req.body.id;
      await User.findByIdAndDelete(id);
      const users = await User.find({});

      res.json({ status: "success", result: users });
    } catch (error) {
      res.json({ status: "failed", message: error.message });
    }
  },
  editUsers: async (req, res) => {
    try {
      const id = req.body.editId;
      const name = req.body.username;
      const email = req.body.email;
      await User.findByIdAndUpdate(id, { username: name, email: email });
      const users = await User.find({});

      res.json({ status: "success", result: users });
    } catch (error) {
      res.json({ status: "failed", message: error.message });
    }
  },
  block_user: async (req, res) => {
    try {
      const id = req.body.id;
      const user = await User.findOne({ _id: id });
      if (user.isBanned === false) {
        await User.findByIdAndUpdate(id, { isBanned: true });
      } else {
        await User.findByIdAndUpdate(id, { isBanned: false });
      }
      const Details = await User.find({});
      Details.reverse();
      res.json({ status: "success", result: Details });
    } catch (error) {
      res.json({ status: "failed", message: error.message });
    }
  },
  addPostProducts: async (req, res) => {
    try {
      const image = req.files.img;
      let product = "";
      if (product) {
        res.json("This Product is already entered");
      } else if (!image) {
        res.json({ status: "filed", err: "image not found" });
        error = "";
      } else {
        let imageUrl = image[0].path;
        imageUrl = imageUrl.substring(6);
        //   multiple image
        const { images } = req.files;
        const arrimg = [];
        if (images) {
          images.forEach((el, i, arr) => {
            arrimg.push(arr[i].path.substring(6));
          });
        }
        res.json({ status: "success" });
      }
    } catch (err) {
      res.json({ status: "failed", message: error.message });
    }
  },
  deleteProduct: async (req, res) => {
    try {
      const id = req.body.id;
      await Product.deleteOne({ _id: id }).then(async () => {
        const productDetails = await Product.find({});
        productDetails.reverse();
        res.json({ status: "success", result: productDetails });
      });
    } catch (error) {
      res.json({ status: "failed", message: error.message });
    }
  },
  editProduct: async (req, res) => {
    try {
      const id = req.body.editId;
      await Product.findByIdAndUpdate(id, {
        productName: req.body.productName,
        price: req.body.price,
        bookingPrice: req.body.bookingPrice,
        color: req.body.color,
        description: req.body.description,
        image: req.body.img,
      }).then(async (data) => {
        const product = await Product.find({});
        product.reverse();
        res.json({ status: "success", result: product });
      });
    } catch (error) {
      res.json({ status: "failed", message: error.message });
    }
  },
  addProduct: async (req, res) => {
    try {
      const product = new Product({
        productName: req.body.productName,
        price: req.body.price,
        bookingPrice: req.body.bookingPrice,
        color: req.body.color,
        description: req.body.description,
        image: req.body.img,
      });
      await product.save().then(async (r) => {
        const productDetails = await Product.find({});
        productDetails.reverse();
        res.json({ status: "success", result: productDetails });
      });
    } catch (error) {
      res.json({ status: "failed", message: error.message });
    }
  },
  getProduct: async (req, res) => {
    try {
      const productDetails = await Product.find({});
      productDetails.reverse();
      res.json({ status: "success", result: productDetails });
    } catch (error) {
      res.json({ status: "failed", message: error.message });
    }
  },
  getTestDrive: async (req, res) => {
    try {
      const Details = await testDrive.find({});
      Details.reverse();
      res.json({ status: "success", result: Details });
    } catch (error) {
      res.json({ status: "failed", message: error.message });
    }
  },
  getBooking: async (req, res) => {
    try {
      const Details = await bookingSchema.find({});
      Details.reverse();
      res.json({ status: "success", result: Details });
    } catch (error) {
      res.json({ status: "failed", message: error.message });
    }
  },
  // dealres details
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
