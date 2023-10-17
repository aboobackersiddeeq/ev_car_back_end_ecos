const express = require("express");
const controller = require("../controllers/dealer-controllers");
const authentication = require("../middlewares/authentication");
const {uploadImage} = require('../utils/cloudinary')
const router = express.Router();

router.post("/", controller.dealerLogin);
router.get("/isDealerAuth", authentication.dealerJwt, controller.dealerAuth);
router.get("/get-bookings", authentication.dealerJwt, controller.getBooking);
router.post("/update-dealer", authentication.dealerJwt,uploadImage,controller.addPostImage);
router.post("/otp",authentication.dealerJwt, controller.sendOtp);
router.post("/verify-otp",authentication.dealerJwt,controller.verifyOtp);
router.post("/old-password",authentication.dealerJwt,controller.verifyOldPassword);
router.post("/password-update",authentication.dealerJwt,controller.delearPasswordUpdate);
// dashboard deatils
router.get("/get-dashboard", authentication.dealerJwt, controller.dashboard);
module.exports = router;
 