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
router.post("/new-password", userController.userPasswordUpdate);
// OTP 
router.post("/otp", otpController.sendOtp);
router.post("/forgot-password", otpController.forgotOtp);
router.post("/verify",otpController.verifyOtp);
router.post("/verify-and-signup",otpController.verifyOtpAndSignup);
router.post("/verify-and-forgot",otpController.verifyOtpAndForgotPassword);
//test Drive
router.post("/test-drive", testDriveController.testDriveBooking);
router.post("/get-test-drive-user", testDriveController.getTestDriveUser);
//booking
router.post("/booking", bookingController.Booking);
router.post("/update-booking", bookingController.updateBooking);
router.get("/get-dealer", bookingController.getDealer);
router.get("/get-booking-user", bookingController.getBookingUser);

module.exports = router;
