const express = require("express");
const adminController = require("../controllers/admin-controllers");
const adminAuth = require("../middlewares/Authentication");
const router = express.Router();

router.post("/", adminController.adminLogin);
router.get("/isAdminAuth", adminAuth.adminJwt, adminController.adminAuth);
// prduct details
router.post("/add-product", adminAuth.adminJwt, adminController.addProduct);
router.post("/get-product", adminController.getProduct);
router.post(
  "/delete-product",
  adminAuth.adminJwt,
  adminController.deleteProduct
);
router.post("/add-post", adminController.addPostProducts);
router.post("/edit-product", adminAuth.adminJwt, adminController.editProduct);
// test drive details
router.get("/test-drive", adminController.getTestDrive);
// deler details
router.post("/add-dealer", adminAuth.adminJwt, adminController.addDealer);
router.get("/get-dealers", adminAuth.adminJwt, adminController.getDealer);
router.post("/delete-dealer", adminAuth.adminJwt, adminController.deleteDealer);
router.post("/edit-dealer", adminAuth.adminJwt, adminController.editDealer);
router.post("/block-dealer", adminAuth.adminJwt, adminController.block_dealer);
// booking details
router.get("/get-bookings", adminAuth.adminJwt, adminController.getBooking);
// user details
router.get("/get-users", adminAuth.adminJwt, adminController.getUsers);
router.post("/block-user", adminAuth.adminJwt, adminController.block_user);
//  admin dashborad
router.get("/get-dashboard", adminAuth.adminJwt, adminController.dashboard);
router.get("/get-chart", adminAuth.adminJwt, adminController.chart1);

module.exports = router;
