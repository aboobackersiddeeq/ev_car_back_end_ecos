const express = require("express");
const controller = require("../controllers/dealer-controllers");
const authentication = require("../middlewares/authentication");
const router = express.Router();

router.post("/", controller.dealerLogin);
router.get("/isDealerAuth", authentication.dealerJwt, controller.dealerAuth);

module.exports = router;
