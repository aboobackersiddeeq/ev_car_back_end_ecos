// Initialize express
require("dotenv").config();
const express=require('express')
const app =express();
const logger=require('morgan')
const cors=require('cors')
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const multer = require('multer')
const bcrypt = require('bcrypt')
 
const userRouter=require('./routers/user-router')
const adminRouter=require('./routers/admin-router')
const dealerRouter=require('./routers/dealer-router')
 
const fileStorage = multer.diskStorage({
  // Destination to store image
  destination: 'public/images',
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
    // file.fieldname is name of the field (image)
    // path.extname get the uploaded file extension
  },
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg'  || file.mimetype === 'image/webp') {
    // upload only png and jpg format

    cb(null, true);
  } else {
    cb(null, false);
  }
};
app.set('public', `${__dirname}/public`);
mongoose.set("strictQuery", true);
app.use(bodyParser.json({ limit: "3000kb" }));
mongoose.connect(process.env.DATABASE_URL).then(()=>{
    console.log('connected successfully');
})
app.use(multer({ storage: fileStorage, fileFilter }).fields([{ name: 'img' }, { name: 'images', maxCount: 5 }]));

app.use(
    cors({
      origin: ["http://localhost:3000"],
      methods: ["GET", "POST"],
      credentials: true,
    })
  );
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(logger('dev'))
app.use(cookieParser());
 

app.use('/',userRouter)
app.use('/admin',adminRouter)
app.use('/dealer',dealerRouter)


 

app.listen(3001,()=>{
    console.log('server started on port 3001');
})

module.exports =app;