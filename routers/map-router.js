const express = require("express");
const mapController = require("../controllers/map-controllers");
const router = express.Router();

router.post("/add-map", mapController.addMap);

router.get("/get-map", mapController.getMap);
router.post("/get-map-near", mapController.getPlaceNear);

module.exports = router;
