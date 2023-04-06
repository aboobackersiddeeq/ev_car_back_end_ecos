// Initialize express
require("dotenv").config();
const express = require("express");
const http =require('http')
const Server =require("socket.io").Server
const app = express();
const Messages =require("./model/messege-schema") 
const Group =require("./model/group-schema") 
const server = http.createServer(app)
const cors = require("cors");
const socketIO =new Server(server,{
  cors:{
    origin:"*"
  }
})
let users = [];

//Add this before the app.get() block
socketIO.on('connection', (socket) => {
    console.log(`⚡: ${socket.id} user just connected!`);

    //sends the message to all the users on the server
    socket.on('messages', async (data) => {
        socket.emit('messages', data);
        //Adds the new user to the list of users
        // users.push(data.name);
       
        //Sends the list of users to the client
        // socketIO.emit('newUserResponse', users);

        const saveMsg = new Messages({
            name: data.name,
            text: data.text,
            group: data.groupId
        });
        await saveMsg.save().then(async() => {
            await Group.findByIdAndUpdate(data.groupId, { messageUpdate: new Date() })
            console.log("🐱‍🏍:Message saved in db");
        }).catch((err) => {
            console.log(err);
        })
    });

    socket.on('typing', (data) => socket.broadcast.emit('typingResponse', data));

    socket.on('disconnect', () => {
        console.log('😪: A user disconnected');
        //Updates the list of users when a user disconnects from the server
        users = users.filter((user) => user.socketID !== socket.id);
        // console.log(users);
        //Sends the list of users to the client
        socketIO.emit('newUserResponse', users);
        socket.disconnect();
    });
});

// io.on("connection",(socket)=>{
//   console.log('we are connected');
// socket.on('chat', chat=>{
//   console.log(chat,'nancaht');
//   io.emit('chat' , chat)
// })

//   socket.on('disconnect', ()=> {
//     console.log('disconnected')
//   })
// })
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
const groupRouter = require("./routers/group-router")

const fileStorage = multer.diskStorage({
  // Destination to store image
  destination: "public/images",
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
    // file.fieldname is name of the field (image)
    // path.extname get the uploaded file extension
  },
});
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/webp"
  ) {
    // upload only png and jpg format

    cb(null, true);
  } else {
    cb(null, false);
  }
};
app.set("public", `${__dirname}/public`);
mongoose.set("strictQuery", true);
app.use(bodyParser.json({ limit: "3000kb" }));
mongoose.connect(process.env.DATABASE_URL).then(() => {
  console.log("connected successfully");
});
app.use(
  multer({ storage: fileStorage, fileFilter }).fields([
    { name: "img" },
    { name: "images", maxCount: 5 },
  ])
);

app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(logger("dev"));
app.use(cookieParser());

app.use("/", userRouter);
app.use("/admin", adminRouter);
app.use("/dealer", dealerRouter);
app.use("/map", mapRouter);
app.use("/group", groupRouter);

server.listen(3001, () => {
  console.log("server started on port 3001");
});

module.exports = app;
