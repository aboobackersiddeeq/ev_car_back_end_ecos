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
};
