const Product = require("../model/product-schema");

module.exports = {
  // For admin
  addPostProducts: async (req, res) => {
    try {
      const image = req.files.img;
      let product = "";
      if (product) {
        res.json("This Product is already entered");
      } else if (!image) {
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
      res.json({ status: "failed", message: error.message });
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
};
