const bookingSchema = require("../model/booking-schema");
const Dealer = require("../model/dealer-schema");
module.exports = {
  //for users
  Booking: async (req, res) => {
    try {
      const { ...obj } = req.body.formData;
      const {
        names,
        lastName,
        address1,
        address2,
        pincode,
        email,
        phone,
        city,
        state,
        model,
        dealer,
        bookingPrice,
      } = obj;
      const exist = await bookingSchema.findOne({ email: email });
      if (exist) {
        const status = await bookingSchema.findOne({
          email: email,
          status: "Pending",
        });
        if (status) {
          res.json({
            status: "Pending",
            message:
              "You already  booked  ,Your transaction cannot be completed",
            orderId: status._id,
          });
        } else {
          res.json({
            status: "failed",
            message: "You already  booked ",
          });
        }
      } else {
        await bookingSchema
          .create({
            names,
            lastName,
            address1,
            address2,
            pincode,
            email,
            phone,
            city,
            state,
            model,
            dealer,
            bookingPrice,
          })
          .then((result) => {
            res.json({
              status: "success",
              result: result,
              orderId: result._id,
            });
          });
      }
    } catch (error) {
      res.json({ status: "failed", message: error.message });
    }
  },
  updateBooking: async (req, res) => {
    try {
      const id = req.body.params;
      bookingSchema
        .findByIdAndUpdate(id, { status: "Placed" })
        .then((result) => {
          res.json({ status: "success", result: result });
        });
    } catch (error) {
      res.json({ status: "failed", message: error.message });
    }
  },
  getDealer: async (req, res) => {
    try {
      const Details = await Dealer.find({});
      Details.reverse();
      res.json({ status: "success", result: Details });
    } catch (error) {
      res.json({ status: "failed", message: error.message });
    }
  },
  // for admin
  getBooking: async (req, res) => {
    try {
      const Details = await bookingSchema.find({});
      Details.reverse();
      res.json({ status: "success", result: Details });
    } catch (error) {
      res.json({ status: "failed", message: error.message });
    }
  },
};
