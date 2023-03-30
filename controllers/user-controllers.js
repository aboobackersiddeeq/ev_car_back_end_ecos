const User = require("../model/user-schema");
const testDrive = require("../model/test-drive-schema");
const bookingSchema = require("../model/booking-schema");
const Dealer = require("../model/dealer-schema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
module.exports = {
  usersignup: async (req, res) => {
    try {
      const { username, email, password, phone } = req.body;
      const user = await User.findOne({ email: email });
      if (user) {
        res.json({
          status: "failed",
          message: "Email already exist login now",
        });
      } else {
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password.trim(), salt);
        await User.create({
          username,
          email,
          password: hashPassword,
          phone,
        }).then((data) => {
          const userId = data._id;
          const token = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: 3000,
          }); //1h = 60 * 60
          res.json({
            auth: true,
            token: token,
            result: data,
            status: "success",
            message: "signin success",
          });
        });
      }
    } catch (error) {
      res.json({ status: "failed", message: error.message });
    }
  },
  userlogin: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email: email });

      if (user) {
        if (user.isBanned === false) {
          const userId = user._id;
          const isMatch = await bcrypt.compare(password, user.password);
          if (isMatch) {
            const token = jwt.sign(
              { userId },
              process.env.ACCESS_TOKEN_SECRET,
              {
                expiresIn: 3000,
              }
            ); //1h = 60 * 60
            res.json({
              auth: true,
              token: token,
              result: user,
              status: "success",
              message: "signin success",
            });
          }
        } else {
          res.json({
            auth: false,
            status: "failed",
            message: "Something went wrong ,Please contact us",
          });
        }
      } else {
        res.json({
          auth: false,
          status: "failed",
          message: "No user please register",
        });
      }
    } catch (error) {
      res.json({
        auth: false,
        status: "failed",
        message: error.message,
      });
    }
  },
  userloginWithGoogle: async (req, res) => {
    try {
      const { email, username, provider } = req.body;
      const user = await User.findOne({ email: email });

      if (user) {
        if (user.isBanned === false) {
          const userId = user._id;
          const token = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: 3000,
          }); //1h = 60 * 60
          res.json({
            auth: true,
            token: token,
            result: user,
            status: "success",
            message: "signin success",
          });
        } else {
          res.json({
            auth: false,
            status: "failed",
            message: "Something went wrong ,Please contact us",
          });
        }
      } else {
        await User.create({
          username,
          email,
          provider,
        }).then((data) => {
          const userId = data._id;
          const token = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: 3000,
          }); //1h = 60 * 60
          res.json({
            auth: true,
            token: token,
            result: data,
            status: "success",
            message: "signin success",
          });
        });
      }
    } catch (error) {
      res.json({
        auth: false,
        status: "failed",
        message: error.message,
      });
    }
  },
  isUserAuth: async (req, res) => {
    try {
      let userDetails = await User.findById(req.userId);
      if (userDetails) {
        res.json({
          username: userDetails.username,
          email: userDetails.email,
          auth: true,
          image: userDetails.image || null,
        });
      } else {
        res.json({
          message: "user not found",
        });
      }
    } catch (e) {
      res.json({ message: e.message });
    }
  },
  userEdit: async (req, res) => {
    try {
      const { ...obj } = req.body;
      const userId = req.userId;
      await User.findOneAndUpdate(userId, obj);
      const userDetails = await User.findOne({ _id: userId });
      const result = {
        username: userDetails.username,
        email: userDetails.email,
        auth: true,
        image: userDetails.image,
      };
      res.json({ result: result, status: "success" });
    } catch (error) {
      res.json({ status: "failed", message: error.message });
    }
  },
  // save testDriveBooking of user
  testDriveBooking: async (req, res) => {
    try {
      const { ...obj } = req.body.formData;
      const { name, email, phone, city, state, model, dealership, checked } =
        obj;
      const exist = await testDrive.findOne({ email: email });
      if (exist) {
        res.json({
          status: "failed",
          message: "You already test drive booked ",
        });
      } else {
        await testDrive
          .create({
            name,
            email,
            phone,
            city,
            state,
            model,
            dealership,
            checked,
          })
          .then((result) => {
            res.json({ status: "success", result: result });
          });
      }
    } catch (error) {
      res.json({ status: "failed", message: error.message });
    }
  },
  Booking: async (req, res) => {
    try {
      const { ...obj } = req.body.formData;
      const {
        names,
        lastName,
        address1,
        address2,
        pincode,
        email,
        phone,
        city,
        state,
        model,
        dealer,
        bookingPrice,
      } = obj;
      const exist = await bookingSchema.findOne({ email: email });
      if (exist) {
        const status = await bookingSchema.findOne({
          email: email,
          status: "Pending",
        });
        if (status) {
          res.json({
            status: "Pending",
            message:
              "You already  booked  ,Your transaction cannot be completed",
            orderId: status._id,
          });
        } else {
          res.json({
            status: "failed",
            message: "You already  booked ",
          });
        }
      } else {
        await bookingSchema
          .create({
            names,
            lastName,
            address1,
            address2,
            pincode,
            email,
            phone,
            city,
            state,
            model,
            dealer,
            bookingPrice,
          })
          .then((result) => {
            res.json({
              status: "success",
              result: result,
              orderId: result._id,
            });
          });
      }
    } catch (error) {
      res.json({ status: "failed", message: error.message });
    }
  },
  updateBooking: async (req, res) => {
    try {
      const id = req.body.params;
      bookingSchema
        .findByIdAndUpdate(id, { status: "Placed" })
        .then((result) => {
          res.json({ status: "success", result: result });
        });
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
};
