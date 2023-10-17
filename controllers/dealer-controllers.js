const Dealer = require("../model/dealer-schema");
const bcrypt = require("bcrypt");
const nodemailer =require("nodemailer")
const jwt = require("jsonwebtoken");
const bookingSchema = require("../model/booking-schema");
const testDrive = require("../model/test-drive-schema");
const { isMatch } = require("lodash");
const cloudinaryImageDelete = require("../utils/delete-cloudnary");
const nodeUser = process.env.nodeMailer_User;
const nodePass = process.env.SMTP_key_value;
const port = process.env.SMTP_PORT;
const host = process.env.host;
let otp = null;
const mailer = nodemailer.createTransport({
  host: host,
  port: port,
  auth: {
    user: nodeUser,
    pass: nodePass,
  },
});
let sendEmailOTP = (email, otpEmail) => {
  console.log(otpEmail, email);

  const mailOptions = {
    to: email,
    from: nodeUser,
    subject: "Otp for registration is: ",
    html:
      "<h3>OTP for email verification is </h3>" +
      "<h1 style='font-weight:bold;'>" +
      otpEmail +
      "</h1>", // html body
  };
  return mailer.sendMail(mailOptions); 
};

module.exports = {
  dealerLogin: async (req, res) => {
    try {
      const { email, password } = req.body;
      const dealer = await Dealer.findOne({ email: email });
      if (dealer) {
        if (dealer.isBanned === false) {
          const isMatch = await bcrypt.compare(password, dealer.password);
          if (isMatch) {
            const token = jwt.sign(
              { dealerId: dealer._id },
              process.env.ACCESS_TOKEN_SECRET,
              { expiresIn: "5d" }
            );
            res.json({
              auth: true,
              token: token,
              result: dealer,
              status: "success",
              message: "signin success",
            });
          } else {
            res.json({
              auth: false,
              status: "failed",
              message: "password is incorrect",
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
          res.json({
            auth: true,
            result: dealer,
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
  addPostImage: async (req, res) => {
    try {
      const id = req.body.id;
      // const image = req.files.img;
      // let imageUrl;
      // if (image) {
      //   imageUrl = image[0].path;
      //   imageUrl = imageUrl.substring(6);
      // }
      const dealer = await Dealer.findById(id)
      if(req.file?.path && dealer.image){
        cloudinaryImageDelete(product.image);
      }
      await Dealer.findByIdAndUpdate(id, {
        image: req.file?.path,
        dealerName: req.body.dealerName,
      })
        .then(async () => {
          const Details = await Dealer.findOne({ _id: id });
          res.json({ status: "success", result: Details });
        })
        .catch((error) => {
          res.json({ status: "failed", message: error.message });
        });
    } catch (error) {
      res.json({ status: "failed", message: error.message });
    }
  },
  sendOtp: async (req, res) => {
    try {
      const email = req.body.email;
      if (email) {
        const otpEmail = Math.floor(1000 + Math.random() * 9000);
        otp = otpEmail;
        sendEmailOTP(email, otpEmail)
          .then((info) => {
            console.log(`Message sent: ${info.messageId}`);
            console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
            res. json({
              message: `Otp is send to ${email}`,
              status :'success'
            });
          })
          .catch((error) => {
            console.log(error,
              'error message');
          });
      
      } else {
        return res
          .status(200)
          .send({ message: "user already exists", status :'failed' });
      }
   
    } catch (error) {
      console.log(error);
      res.json({ message: "error creating user", status :'failed'});
    }
  },
  verifyOtp: async (req, res) => {
    try {
      if(otp == req.body.otp){
        res.status(200).send({
          message: "Verified!",
          status :'success'
        });
      }else{
        res.json({ message: "Verification failed", status :'failed'});
      }
   
    } catch (error) { 
      res.status(500).send({message: "Verification failed", status :'failed'});
    }
  },
  delearPasswordUpdate: async (req, res) => {
    try {
      const id = req.body.id;
      const password =req.body.password
      const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password.trim(), salt);
      await Dealer.findByIdAndUpdate(id, {
        password :hashPassword
        
      })
        .then(async () => {
          const Details = await Dealer.findOne({ _id: id });
          res.json({status :'success', message: "Password changed successfully", result: Details });
        })
        .catch((error) => {
          res.json({ status: "failed", message: error.message });
        });
    } catch (error) {
      res.json({ status: "failed", message: error.message });
    }
  },
  verifyOldPassword: async (req, res) => {
    try {
 
      const { email, password } = req.body;
      const dealer = await Dealer.findOne({ email: email });
      const isMatch = await bcrypt.compare(password, dealer.password);
      if( isMatch){
        res.status(200).send({
          message: "Success ,Change your password",
          status :'success'
        });
      }else{
        res.json({ message: "Password incorrect", status :'failed'});
      }
   
    } catch (error) { 
      console.log(error,'error');
      res.status(500).send({message: "Verification failed", status :'failed'});
    }
  },
};
