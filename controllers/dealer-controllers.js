const Dealer = require("../model/dealer-schema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = {
  dealerLogin: async (req, res) => {
    try {
      const { email, password } = req.body;
      const dealer = await Dealer.findOne({ email: email });
      if (dealer) {
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
        const dealerDetails = {
          email: dealer.email,
        };
        res.json({
          auth: true,
          result: dealerDetails,
          status: "success",
          message: "signin success",
        });
      }
    } catch (error) {
      res.json({ status: "failed", message: error.message });
    }
  },
};
