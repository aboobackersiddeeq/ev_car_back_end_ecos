const express = require("express");
const Controller = require("../controllers/group-controllers");
const Auth = require("../middlewares/authentication");
const {uploadImage} = require('../utils/cloudnery')

const router = express.Router();

router.post("/new-group", Auth.UserJwt, Controller.newGroup);
router.post("/get-group", Auth.UserJwt, Controller.getGroups);
router.post("/get-user-group", Auth.UserJwt, Controller.getGroupsOfUser);
router.post("/join-group", Auth.UserJwt, Controller.joinGroup);
router.post("/get-messages", Auth.UserJwt, Controller.messages);
router.post("/update-group", Auth.UserJwt,uploadImage, Controller.addPostImage);

module.exports = router;
