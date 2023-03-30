const express = require("express");
const userController = require("../controllers/user-controllers");
const userAuth = require("../middlewares/Authentication");
const router = express.Router();

router.post("/login", userController.userlogin);
router.post("/login-with-google", userController.userloginWithGoogle);
router.post("/signup", userController.usersignup);
router.get("/is-user-auth", userAuth.UserJwt, userController.isUserAuth);
router.post("/test-drive", userController.testDriveBooking);
router.post("/booking", userController.Booking);
router.post("/update-booking", userController.updateBooking);
router.get("/get-dealer", userController.getDealer);

module.exports = router;
