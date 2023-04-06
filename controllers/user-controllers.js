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
            expiresIn: 3000000,
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
                expiresIn: 3000000,
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
            expiresIn: 3000000,
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
            expiresIn: 300000,
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
          result: userDetails,
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

  // users details for admin
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
};
