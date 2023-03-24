const express = require("express");
const adminController = require("../controllers/admin-controllers");
const adminAuth = require("../middlewares/Authentication");
const router = express.Router();

router.post("/", adminController.adminLogin);
router.get("/isAdminAuth", adminAuth.adminJwt, adminController.adminAuth);
router.post("/add-product", adminController.addProduct);
router.post("/get-product", adminController.getProduct);
router.post("/delete-product", adminController.deleteProduct);
router.post("/add-post", adminController.addPostProducts);
router.post("/edit-product", adminController.editProduct);
router.get("/test-drive", adminController.getTestDrive);
// deler details
router.post("/add-dealer", adminAuth.adminJwt, adminController.addDealer);
router.get("/get-dealers", adminAuth.adminJwt, adminController.getDealer);
router.post("/delete-dealer", adminAuth.adminJwt, adminController.deleteDealer);
router.post("/edit-dealer", adminAuth.adminJwt, adminController.editDealer);
router.post("/block-dealer", adminAuth.adminJwt, adminController.block_dealer);
//booking details
router.get("/get-bookings", adminAuth.adminJwt, adminController.getBooking);
module.exports = router;
