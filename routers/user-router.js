const express = require("express");
const userController = require("../controllers/user-controllers");
const router = express.Router();

router.post("/login", userController.userlogin);
router.post("/test-drive", userController.testDriveBooking);
router.post("/booking", userController.Booking);
router.post("/update-booking", userController.updateBooking);
router.get("/get-dealer", userController.getDealer);

module.exports = router;
