const { City } = require("country-state-city");
const { Ride, validateRide, get_ride_validation } = require("../Models/ride");
const { Vehicle } = require("../Models/vehicle");
const { User } = require("../Models/user");

const getRide = async (req, res) => {
  try {
    const { error } = get_ride_validation(req.body);
    if (error) {
      return res.status(400).json({
        code: 400,
        message: error.details[0].message.replace(/"/g, ""),
      });
    }

    const rides = await Ride.find({
      cityTo: req.body.cityTo,
      cityFrom: req.body.cityFrom,
    })
      .populate("vehicleId")
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      code: 200,
      message: "Rides fetched successfully",
      rides,
    });
  } catch (e) {
    return res.status(400).json({
      code: 400,
      message: e,
    });
  }
};

const processRides = async (req, res) => {
  try {
    if (req.body.status.toLowerCase() === "booked") {
      if (!("totalSeats" in req.body)) {
        res.status(403).send({ message: "totalSeats is required!" });
      }
    } else {
      req.body["totalSeats"] = 0;
    }
    const ride = await Ride.findOne({
      _id: req.body.rideId,
    });
    const vehicle = await Vehicle.findOne({
      _id: ride.vehicleId,
    });
    const user = await User.findOne({
      _id: req.body.userId,
    });
    if (user == null) {
      res.status(403).send({ message: "User doesn't exist!" });
    } else if (ride == null) {
      res.status(403).send({ message: "Ride doesn't exist!" });
    } else if (vehicle == null) {
      res.status(403).send({ message: "Vehicle doesn't exist!" });
    } else if (ride.vehicleId.toString() !== vehicle._id.toString()) {
      res
        .status(403)
        .send({ message: "This vehicle is not associated with this ride!" });
    } else if (ride.bookedSeat + req.body.totalSeats > vehicle.seat) {
      res
        .status(403)
        .send({ message: "Apologize, Ride don't have enough seats!" });
    } else {
      await Ride.updateOne(
        {
          _id: req.body.rideId,
        },
        {
          status: req.body.status.toLowerCase(),
          bookedSeat: ride.bookedSeat + req.body.totalSeats,
        }
      );
      res.status(200).json({
        code: 200,
        message: "Ride updated successfully",
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({
      code: 500,
      message: "Internal server error",
    });
  }
};

const postRide = async (req, res) => {
  try {
    console.log(req.body);
    const { error } = await validateRide(req.body);
    console.log(error);
    if (error) {
      return res.status(400).json({
        code: 400,
        message: error.details[0].message.replace(/"/g, ""),
      });
    }

    const vehicle = await addVehicle({
      seat: req.body.seat,
      car: req.body.car,
      luggage: req.body.luggage,
      driverName: req.body.driverName,
      driverPhone: req.body.driverPhone,
    });
    var ride = await Ride.create({
      cityTo: req.body.cityTo,
      cityFrom: req.body.cityFrom,
      price: req.body.price,
      date: req.body.date,
      userId: req.body.userId,
      vehicleId: vehicle._id,
      autoApprove: req.body.autoApprove,
      smoking: req.body.smoking,
      comment: req.body.comment,
    });

    res.status(200).json({
      code: 200,
      message: "Ride created successfully",
      data: ride,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      code: 500,
      message: "Internal server error",
    });
  }
};

const addVehicle = async (data) => {
  try {
    var vehicle = new Vehicle({
      seat: data.seat,
      car: data.car,
      luggage: data.luggage,
      driverName: data.driverName,
      driverPhone: data.driverPhone,
    });
    vehicle = await vehicle.save();
    return vehicle;
  } catch (e) {
    return e;
  }
};

const getOldBooking = async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.body.userId,
    });
    if (user == null) {
      res.status(403).json({
        code: 403,
        message: "User doesn't exist!",
      });
    } else {
      var rides = await Ride.find({
        userId: req.body.userId,
        status: "booked",
      });

      res.status(200).json({
        code: 200,
        message: "Rides fetched successfully",
        bookings: rides,
      });
    }
  } catch (e) {
    res.status(500).json({
      code: 500,
      message: "Internal server error",
    });
  }
};

const getRoutes = async (req, res) => {
  try {
    const cities = City.getCitiesOfCountry("PK");
    res.status(200).json({
      code: 200,
      message: "Cities fetched successfully",
      cities,
    });
  } catch (e) {
    res.status(500).json({
      code: 500,
      message: "Internal server error",
    });
  }
};

const getOldRides = async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.body.userId,
    });

    if (user == null) {
      res.status(403).json({
        code: 403,
        message: "User doesn't exist!",
      });
    }

    var rides = await Ride.find({
      userId: req.body.userId,
    });

    res.status(200).json({
      code: 200,
      message: "Rides fetched successfully",
      rides,
    });
  } catch (e) {
    res.status(500).json({
      code: 500,
      message: "Internal server error",
    });
  }
};

const getRideDetails = async (req, res) => {
  try {
    const ride = await Ride.findOne({
      _id: req.body.rideId,
    })
      .populate("vehicleId")
      .populate("userId");

    if (!ride) {
      res.status(403).json({
        code: 403,
        message: "Ride doesn't exist!",
      });
    }

    res.status(200).json({
      code: 200,
      message: "Ride fetched successfully",
      ride,
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: "Internal server error",
    });
  }
};

const CencelBooking = async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.body.userId,
    });
    if (user == null) {
      res.status(403).json({
        code: 403,
        message: "User doesn't exist!",
      });
    } else {
      // cancel booking

      var ride = await Ride.findOneAndUpdate(
        {
          userId: req.body.userId,
          _id: req.body.rideId,
        },
        {
          status: "canceled",
        }
      );

      res.status(200).json({
        code: 200,
        message: "Ride canceled successfully",
      });
    }
  } catch (e) {
    res.status(500).json({
      code: 500,
      message: "Internal server error",
    });
  }
};

module.exports = {
  postRide,
  getRide,
  processRides,
  getOldBooking,
  getOldRides,
  getRoutes,
  getRideDetails,
  CencelBooking,
};
