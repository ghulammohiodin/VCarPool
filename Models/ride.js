const mongoose = require("mongoose");
const Joi = require("joi");
const rideSchema = new mongoose.Schema(
  {
    cityTo: {
      type: String,
    },
    cityFrom: {
      type: String,
    },
    date: {
      type: Date,
    },
    price: {
      type: Number,
    },
    autoApprove: {
      type: Boolean,
    },
    smoking: {
      type: Boolean,
      default: false,
    },
    comment: {
      type: String,
    },
    bookedSeat: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
    },
  },
  {
    timestamps: true,
  }
);

// validate the ride details

const validateRide = async (ride) => {
  const schema = Joi.object({
    cityTo: Joi.string().required(),
    cityFrom: Joi.string().required(),
    price: Joi.number().integer().required(),
    date: Joi.date().required(),
    seat: Joi.number().integer().required(),
    car: Joi.string().required(),
    luggage: Joi.string().required(),
    driverName: Joi.string().required(),
    driverPhone: Joi.number().integer().required(),
    userId: Joi.string().required(),
    autoApprove: Joi.boolean(),
    smoking: Joi.boolean(),
    comment: Joi.string(),
  });
  return schema.validate(ride);
};

const get_ride_validation = async (ride) => {
  const schema = Joi.object({
    cityTo: Joi.string().required(),
    cityFrom: Joi.string().required(),
  });
  return schema.validate(ride);
};
const Ride = mongoose.model("Ride", rideSchema);
module.exports.Ride = Ride;
module.exports.validateRide = validateRide;
module.exports.get_ride_validation = get_ride_validation;
