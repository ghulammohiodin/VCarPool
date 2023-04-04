const mongoose = require("mongoose");
const vehicleSchema = new mongoose.Schema({
  seat: {
    type: Number,
  },
  car: {
    type: String,
  },
  luggage: {
    type: String,
  },
  driverName: {
    type: String,
  },
  driverId: {
    type: mongoose.Types.ObjectId,
    default: new mongoose.Types.ObjectId(),
  },
  driverPhone: {
    type: Number,
  },
});

const Vehicle = mongoose.model("Vehicle", vehicleSchema);
module.exports.Vehicle = Vehicle;
