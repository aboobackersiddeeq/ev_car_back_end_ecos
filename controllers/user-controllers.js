const User = require("../model/user-schema");
const testDrive = require("../model/testDriveSchema");

module.exports = {
  usersignup: async (req, res) => {
    try {
      console.log(req.body);
      const { username, email, password } = req.body;
      const user = await User.findOne({ email: email });
      if (user) {
        res.json({
          status: "failed",
          message: "Email already exist login now",
        });
      } else {
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password.trim(), salt);
        await usermodel.create({
          username,
          email,
          password: hashPassword,
        });
        res.json({ status: "success", message: "signup success" });
      }
    } catch (error) {
      res.json({ status: "failed", message: error.message });
    }
  },
  userlogin: async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });

    if (user) {
      const userId = user._id;
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        const token = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
          expiresIn: 300,
        }); //1h = 60 * 60
        res.json({
          auth: true,
          token: token,
          result: user,
          status: "success",
          message: "signin success",
        });
      }
    } else {
      res.json({
        auth: false,
        status: "failed",
        message: "No user please register",
      });
    }
  },
  isUserAuth: async (req, res) => {
    try {
      console.log(req.userId, "nan userid isuserAuth");
      let userDetails = await User.findById(req.userId);
      userDetails.auth = true;
      res.json({
        username: userDetails.username,
        email: userDetails.email,
        auth: true,
        image: userDetails.image || null,
      });
    } catch (e) {}
  },
  userEdit: async (req, res) => {
    try {
      const { ...obj } = req.body;
      const userId = req.userId;
      await User.findOneAndUpdate(userId, obj);
      const userDetails = await User.findOne({ _id: userId });
      const result = {
        username: userDetails.username,
        email: userDetails.email,
        auth: true,
        image: userDetails.image,
      };
      res.json({ result: result, status: "success" });
    } catch (error) {
      res.json({ status: "failed", message: error.message });
    }
  },
  // save testDriveBooking of user
  testDriveBooking: async (req, res) => {
    try {
      const { ...obj } = req.body.formData;
      const { name, email, phone, city, state, model, dealership, checked } =
        obj;
      const exist = await testDrive.findOne({ email: email });
      if (exist) {
        res.json({
          status: "failed",
          message: "You already test drive booked ",
        });
      } else {
        await testDrive
          .create({
            name,
            email,
            phone,
            city,
            state,
            model,
            dealership,
            checked,
          })
          .then((result) => {
            console.log(result);
            res.json({ status: "success", result: result });
          });
      }
    } catch (error) {
      res.json({ status: "failed", message: error.message });
    }
  },
};
