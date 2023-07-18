const User = require("../model/user-schema");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
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
let sendEmailOTP = (email, otpEmail, username) => {
  console.log(otpEmail, email, username);
  let name = "";
  if (username) {
    const capitalizeFirstLetter = (str) =>
      `${str.charAt(0).toUpperCase()}${str.slice(1)}`;
    name = capitalizeFirstLetter(username);
  }
  const htmlContent = `
  <h3>Hi ${name},</h3>
  <p>A sign in attempt requires further verification. To complete the sign in, 
  enter the verification code.</p>
  <p>Your verification code is</p>
  <h1>${otpEmail}</h1>
  <br>
  <p>Thanks,</p>
  <p>The Ecos Team</p>
`;
  const mailOptions = {
    to: email,
    from: nodeUser,
    subject: "Otp for registration is: ",
    html: htmlContent,
  };
  return mailer.sendMail(mailOptions);
};

let sendEmailOTPForForgot = (email, otpEmail, username) => {
  const capitalizeFirstLetter = (str) =>
    `${str.charAt(0).toUpperCase()}${str.slice(1)}`;
  const name = capitalizeFirstLetter(username);
  const htmlContent = `
  <h3>Hi ${name},</h3>
  <p>We received a request to reset your Ecos password.
  Enter the following password reset code:</p>
  <h1>${otpEmail}</h1>
  <br>
  <p>Thanks,</p>
  <p>The Ecos Team</p>
`;
  const mailOptions = {
    to: email,
    from: nodeUser,
    subject: " Your Ecos account recovery code: ",
    html: htmlContent,
  };
  return mailer.sendMail(mailOptions);
};
module.exports = {
  sendOtp: async (req, res) => {
    try {
      const email = req.body.email;
      const name = req.body.username;
      const userExist = await User.findOne({ email: email });
      if (email && !userExist) {
        const otpEmail = Math.floor(1000 + Math.random() * 9000);
        otp = otpEmail;
        sendEmailOTP(email, otpEmail, name)
          .then((info) => {
            console.log(`Message sent: ${info.messageId}`);
            console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
            res.json({
              message: `Otp is send to ${email}`,
              status: "success",
            });
          })
          .catch((error) => {
            console.log(error);
            res.json({
              error: error,
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
        message: `Something went wrong `,
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
  verifyOtpAndForgotPassword: async (req, res) => {
    try {
      if (otp == req.body.otp) {
        const email = req.body.email;
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password.trim(), salt);
        await User.updateOne(
          { email: email },
          {
            password: hashPassword,
          }
        )
          .then(async () => {
            const Details = await User.findOne({ email: email });
            res.json({
              status: "success",
              message: "Password changed successfully",
              result: Details,
              verificationStatus: "success",
            });
          })
          .catch((error) => {
            res.json({ status: "failed", message: error.message });
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
      const userExist = await User.findOne({ email: email });
      if (email && userExist) {
        const otpEmail = Math.floor(1000 + Math.random() * 9000);
        otp = otpEmail;
        sendEmailOTPForForgot(email, otpEmail, userExist.username)
          .then((info) => {
            console.log(`Message sent: ${info.messageId}`);
            console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
            res.json({
              message: `Otp is send to ${email}`,
              status: "success",
            });
          })
          .catch((error) => {
            console.log(error);
            res.json({
              error: error,
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
  },
  verifyOtpAndSignup: async (req, res) => {
    try {
      if (otp == req.body.otp) {
        const { username, email, password, phone } = req.body;
        const user = await User.findOne({ email: email });
        if (user) {
          res.json({
            status: "failed",
            message: "Email already exist,login now",
          });
        } else {
          const salt = await bcrypt.genSalt(10);
          const hashPassword = await bcrypt.hash(password.trim(), salt);
          await User.create({
            username,
            email,
            password: hashPassword,
            phone,
          })
            .then((data) => {
              const userId = data._id;
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
                result: data,
                status: "success",
                message: "signin success",
                verificationStatus: "success",
              });
            })
            .catch((error) => {
              res
                .status(500)
                .send({ message: "Verification failed", status: "failed" });
            });
        }
      } else {
        res.json({ message: "Verification failed", status: "failed" });
      }
    } catch (error) {
      res
        .status(500)
        .send({ message: "Verification failed", status: "failed" });
    }
  },
};
