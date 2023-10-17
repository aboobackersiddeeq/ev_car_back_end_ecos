require("dotenv").config();
const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const cors = require("cors");
const logger = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const multer = require("multer");
const bcrypt = require("bcrypt");
const userRouter = require("./routers/user-router");
const adminRouter = require("./routers/admin-router");
const dealerRouter = require("./routers/dealer-router");
const mapRouter = require("./routers/map-router");
const groupRouter = require("./routers/group-router");
const initializeSocket = require("./utils/socket");
initializeSocket(server)

// const fileStorage = multer.diskStorage({
//   // Destination to store image
//   destination: "public/images",
//   filename: (req, file, cb) => {
//     cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
//     // file.fieldname is name of the field (image)
//     // path.extname get the uploaded file extension
//   },
// });
// const fileFilter = (req, file, cb) => {
//   if (
//     file.mimetype === "image/png" ||
//     file.mimetype === "image/jpg" ||
//     file.mimetype === "image/jpeg" ||
//     file.mimetype === "image/webp"
//   ) {
//     // upload only png,jpeg,webp and jpg  format

//     cb(null, true);
//   } else {
//     cb(null, false);
//   }
// };
app.set("public", `${__dirname}/public`);
mongoose.set("strictQuery", true);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: "1100kb" }));
mongoose.connect(process.env.DATABASE_URL).then(() => {
  console.log("connected successfully");
});
// app.use(
//   multer({ storage: fileStorage, fileFilter }).fields([
//     { name: "img" },
//     { name: "images", maxCount: 5 },
//   ])
// );

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(logger("dev"));
app.use(cookieParser());
app.use(express.static(__dirname + "/public"));
app.use("/", userRouter);
app.use("/admin", adminRouter);
app.use("/dealer", dealerRouter);
app.use("/map", mapRouter);
app.use("/group", groupRouter);

server.listen( process.env.PORT||3001, () => {
  console.log("server started on port 3001");
});

module.exports = app;
