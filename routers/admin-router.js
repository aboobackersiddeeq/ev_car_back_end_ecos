const express = require("express");
const adminController = require("../controllers/admin-controllers");
const productController = require("../controllers/product-controllers");
const dealerController = require("../controllers/dealer-controllers");
const userController = require("../controllers/user-controllers");
const bookingController = require("../controllers/booking-controllers");
const testDriveController = require("../controllers/test-drive-controllers");
const adminAuth = require("../middlewares/Authentication");
const router = express.Router();

router.post("/", adminController.adminLogin);
router.get("/isAdminAuth", adminAuth.adminJwt, adminController.adminAuth);
// prduct details
router.post("/add-product", adminAuth.adminJwt, productController.addProduct);
router.post("/get-product", productController.getProduct);
router.post(
  "/delete-product",
  adminAuth.adminJwt,
  productController.deleteProduct
);
router.post("/add-post", productController.addPostProducts);
router.post("/edit-product", adminAuth.adminJwt, productController.editProduct);
// test drive details
router.get("/test-drive", testDriveController.getTestDrive);
// deler details
router.post("/add-dealer", adminAuth.adminJwt, dealerController.addDealer);
router.get("/get-dealers", adminAuth.adminJwt, dealerController.getDealer);
router.post(
  "/delete-dealer",
  adminAuth.adminJwt,
  dealerController.deleteDealer
);
router.post("/edit-dealer", adminAuth.adminJwt, dealerController.editDealer);
router.post("/block-dealer", adminAuth.adminJwt, dealerController.block_dealer);
// booking details
router.get("/get-bookings", adminAuth.adminJwt, bookingController.getBooking);
// user details
router.get("/get-users", adminAuth.adminJwt, userController.getUsers);
router.post("/block-user", adminAuth.adminJwt, userController.block_user);
//  admin dashborad
router.get("/get-dashboard", adminAuth.adminJwt, adminController.dashboard);
router.get("/get-chart", adminAuth.adminJwt, adminController.chart1);

module.exports = router;
