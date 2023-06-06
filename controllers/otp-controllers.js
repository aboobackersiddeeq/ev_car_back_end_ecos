const User = require("../model/user-schema");
const nodemailer =require("nodemailer")
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
  sendOtp: async (req, res) => {
    try {
      const email = req.body.email;
      const userExist = await User.findOne({email:email})
      if ( email&& !userExist) {
        const otpEmail = Math.floor(1000 + Math.random() * 9000);
        otp = otpEmail;
        sendEmailOTP(email, otpEmail)
          .then((info) => {
            // console.log(`Message sent: ${info.messageId}`);
            // console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
            res.json({
              message: `Otp is send to ${email}`,
              status: "success",
            });
          })
          .catch((error) => {
            console.log(error)
            res.json({
              error:error,
              message: `Email Authentication unsuccessful`,
              status: "failed",
            });
          });
      } else {
        res.json({
            message: `Email already exist`,
            status: "failed",
          });
      }
    } catch (error) {
        res.json({
            message: `Something went wrong`,
            status: "failed",
          });
    }
  },
  verifyOtp: async (req, res) => {
    try {
      if (otp == req.body.otp) {
        res.status(200).send({
          message: "Verified!",
          status: "success",
        });
      } else {
        res.json({ message: "Verification failed", status: "failed" });
      }
    } catch (error) {
      res
        .status(500)
        .send({ message: "Verification failed", status: "failed" });
    }
  },

  
  forgotOtp: async (req, res) => {
    try {
      const email = req.body.email;
      const userExist = await User.findOne({email:email})
      if ( email&& userExist) {
        const otpEmail = Math.floor(1000 + Math.random() * 9000);
        otp = otpEmail;
        sendEmailOTP(email, otpEmail)
          .then((info) => {
            // console.log(`Message sent: ${info.messageId}`);
            // console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
            res.json({
              message: `Otp is send to ${email}`,
              status: "success",
            });
          })
          .catch((error) => {
            console.log(error)
            res.json({
              error:error,
              message: `Email Authentication unsuccessful`,
              status: "failed",
            });
          });
      } else {
        res.json({
            message: `User not found`,
            status: "failed",
          });
      }
    } catch (error) {
        res.json({
            message: `Something went wrong`,
            status: "failed",
          });
    }
  }
  
  
  
};
