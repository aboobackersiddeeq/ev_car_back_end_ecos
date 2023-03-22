const Admin = require("../model/adminSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../model/user-schema");
const Product = require("../model/productschema");
const testDrive = require("../model/testDriveSchema");
const Dealer = require("../model/dealer-schema");
module.exports = {
  adminLogin: async (req, res) => {
    try {
      console.log(req.body);
      const { email, password } = req.body;
      const admin = await Admin.findOne({ email: email });
      if (admin) {
        isMatch = await bcrypt.compare(password, admin.password);
        if (isMatch) {
          console.log();
          const token = jwt.sign(
            { adminId: admin._id },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "5d" }
          );
          const admindetails = {
            email: admin.email,
          };
          res.json({
            auth: true,
            token: token,
            result: admindetails,
            status: "success",
            message: "signin success",
          });
        } else {
          res.json({
            auth: false,
            status: "failed",
            message: "Admin password is incorrect",
          });
        }
      } else {
        res.json({
          adminauth: false,
          status: "failed",
          message: "No Admin found",
        });
      }
    } catch (error) {
      console.log(error);
    }
  },
  adminAuth: async (req, res) => {
    try {
      let admin = await Admin.findById(req.adminId);
      const admindetails = {
        email: admin.email,
      };
      res.json({
        auth: true,
        result: admindetails,
        status: "success",
        message: "signin success",
      });
    } catch (error) {
      res.json({ status: "failed", message: error.message });
    }
  },
  getUsers: async (req, res) => {
    try {
      const users = await User.find({});

      res.json({ status: "success", result: users });
    } catch (error) {
      res.json({ status: "failed", message: error.message });
    }
  },
  deleteUsers: async (req, res) => {
    try {
      const id = req.body.id;
      await User.findByIdAndDelete(id);
      const users = await User.find({});

      res.json({ status: "success", result: users });
    } catch (error) {
      res.json({ status: "failed", message: error.message });
    }
  },
  editUsers: async (req, res) => {
    try {
      const id = req.body.editId;
      const name = req.body.username;
      const email = req.body.email;
      await User.findByIdAndUpdate(id, { username: name, email: email });
      const users = await User.find({});

      res.json({ status: "success", result: users });
    } catch (error) {
      res.json({ status: "failed", message: error.message });
    }
  },
  addPostProducts: async (req, res) => {
    try {
      console.log(req.body);
      console.log(req.files.img);
      const image = req.files.img;
      let product = "";
      if (product) {
        res.json("This Product is already entered");
        console.log("This Product is already entered");
      } else if (!image) {
        console.log("image not found");
        res.json({ status: "filed", err: "image not found" });
        error = "";
      } else {
        let imageUrl = image[0].path;
        imageUrl = imageUrl.substring(6);
        //   multiple image
        const { images } = req.files;
        const arrimg = [];
        if (images) {
          images.forEach((el, i, arr) => {
            arrimg.push(arr[i].path.substring(6));
          });
        }
        res.json({ status: "success" });
      }
    } catch (err) {
      console.log(err);
    }
  },
  deleteProduct: async (req, res) => {
    try {
      const id = req.body.id;
      await Product.deleteOne({ _id: id }).then(async () => {
        const productDetails = await Product.find({});
        productDetails.reverse();
        res.json({ status: "success", result: productDetails });
      });
    } catch (error) {
      res.json({ status: "failed", message: error.message });
    }
  },
  editProduct: async (req, res) => {
    try {
      const id = req.body.editId;
      console.log(req.body);
      await Product.findByIdAndUpdate(id, {
        productName: req.body.productName,
        price: req.body.price,
        bookingPrice: req.body.bookingPrice,
        color: req.body.color,
        description: req.body.description,
        image: req.body.img,
      }).then(async (data) => {
        const product = await Product.find({});
        product.reverse();
        res.json({ status: "success", result: product });
      });
    } catch (error) {
      res.json({ status: "failed", message: error.message });
    }
  },
  addProduct: async (req, res) => {
    try {
      const product = new Product({
        productName: req.body.productName,
        price: req.body.price,
        bookingPrice: req.body.bookingPrice,
        color: req.body.color,
        description: req.body.description,
        image: req.body.img,
      });
      await product.save().then(async (r) => {
        const productDetails = await Product.find({});
        productDetails.reverse();
        res.json({ status: "success", result: productDetails });
      });
    } catch (error) {
      res.json({ status: "failed", message: error.message });
    }
  },
  getProduct: async (req, res) => {
    try {
      const productDetails = await Product.find({});
      productDetails.reverse();
      res.json({ status: "success", result: productDetails });
    } catch (error) {
      res.json({ status: "failed", message: error.message });
    }
  },
  getTestDrive: async (req, res) => {
    try {
      const Details = await testDrive.find({});
      Details.reverse();
      res.json({ status: "success", result: Details });
    } catch (error) {
      res.json({ status: "failed", message: error.message });
    }
  },
  // dealres details
  deleteDealer: async (req, res) => {
    try {
      const id = req.body.id;
      await Dealer.deleteOne({ _id: id }).then(async () => {
        const Details = await Dealer.find({});
        Details.reverse();
        res.json({ status: "success", result: Details });
      });
    } catch (error) {
      res.json({ status: "failed", message: error.message });
    }
  },
  editDealer: async (req, res) => {
    try {
      const { dealerName,phone, city, state, email } = req.body;
      const id = req.body.editId;
      await Dealer.findByIdAndUpdate(id, {
        dealerName,
        phone,
        city,
        state,
        email,
      }).then(async () => {
        const Details = await Dealer.find({});
        Details.reverse();
        res.json({ status: "success", result: Details });
      });
    } catch (error) {
      res.json({ status: "failed", message: error.message });
    }
  },
  addDealer: async (req, res) => {
    try {
      const { dealerName,phone, password, city, state, email } = req.body;
      const exist = await Dealer.findOne({ dealerName: dealerName });
      if (exist) {
        res.json({
          status: "failed",
          message: " already added this dealerName ",
        });
      } else {
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password.trim(), salt);
        await Dealer.create({
          dealerName,
          phone,
          password: hashPassword,
          city,
          state,
          email,
        }).then(async (result) => {
          console.log(result);
          const Details = await Dealer.find({});
          Details.reverse();
          res.json({ status: "success", result: Details });
        });
      }
    } catch (error) {
      console.log(error);
      res.json({ status: "failed", message: error.message });
    }
  },
  getDealer: async (req, res) => {
    try {
      console.log('hi');
      const Details = await Dealer.find({});
      Details.reverse();
      res.json({ status: "success", result: Details });
    } catch (error) {
      res.json({ status: "failed", message: error.message });
    }
  },
  block_dealer:async (req,res)=>{
    try {
      console.log(req.body);
      const id =req.body.id
      const dealer =await Dealer.findOne({_id:id})
      if(dealer.isBanned === false){
          console.log('false');  
        await Dealer.findByIdAndUpdate(id,{isBanned:true})
      }else{
        console.log(true);
        await Dealer.findByIdAndUpdate(id,{isBanned:false})
      }
        const Details = await Dealer.find({});
        Details.reverse()
        res.json({"status":"success",result:Details})
    } catch (error) {
        res.json({"status":"failed",message:error.message})
    }
  }
};
