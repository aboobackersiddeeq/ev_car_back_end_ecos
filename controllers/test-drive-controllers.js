const testDrive = require("../model/test-drive-schema");

module.exports = {
  //for user booking
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
            res.json({ status: "success", result: result });
          });
      }
    } catch (error) {
      res.json({ status: "failed", message: error.message });
    }
  },

  //For admin

  getTestDrive: async (req, res) => {
    try {
      const Details = await testDrive.find({});
      Details.reverse();
      res.json({ status: "success", result: Details });
    } catch (error) {
      res.json({ status: "failed", message: error.message });
    }
  },
  getTestDriveUser: async (req, res) => {
    const { email } = req.body;
    try {
      if (email) {
        const Details = await testDrive.find({ email: email });
        Details.reverse();
        res.json({ status: "success", result: Details });
      } else {
        res.json({ status: "failed", message: "Email not found" });
      }
    } catch (error) {
      res.json({ status: "failed", message: error.message });
    }
  },
  updateTestDriveStatus: async (req, res) => {
    try {
      const { id, status } = req.body;
      if (id && status) {
        testDrive.findByIdAndUpdate(id, { status: status }).then((result) => {
          res.json({ status: "success", result: result });
        });
      }else{
        res.json({ status: "failed", message: 'Id and status is not found' });
      }
    } catch (error) {
      res.json({ status: "failed", message: error.message });
    }
  },
};
