const express = require("express");
const userController = require("../controllers/user-controllers");
const bookingController = require("../controllers/booking-controllers");
const testDriveController = require("../controllers/test-drive-controllers");
const otpController = require("../controllers/otp-controllers");
const userAuth = require("../middlewares/authentication");
const router = express.Router();
//user Details
router.post("/login", userController.userlogin);
router.post("/login-with-google", userController.userloginWithGoogle);
router.post("/signup", userController.usersignup);
router.get("/is-user-auth", userAuth.UserJwt, userController.isUserAuth);
// OTP 
router.post("/otp", otpController.sendOtp);
router.post("/verify",otpController.verifyOtp);
//test Drive
router.post("/test-drive", testDriveController.testDriveBooking);
//booking
router.post("/booking", bookingController.Booking);
router.post("/update-booking", bookingController.updateBooking);
router.get("/get-dealer", bookingController.getDealer);

module.exports = router;
