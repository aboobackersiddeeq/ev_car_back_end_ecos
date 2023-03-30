const express = require("express");
const controller = require("../controllers/dealer-controllers");
const authentication = require("../middlewares/authentication");
const router = express.Router();

router.post("/", controller.dealerLogin);
router.get("/isDealerAuth", authentication.dealerJwt, controller.dealerAuth);
router.get("/get-bookings", authentication.dealerJwt, controller.getBooking);
// dashboard deatils
router.get("/get-dashboard", authentication.dealerJwt, controller.dashboard);
module.exports = router;
