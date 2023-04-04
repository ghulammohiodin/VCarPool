var express = require("express");
var router = express.Router();
const { validateAuth } = require("../middleware/auth");
const {
  signup,
  login,
  get_user,
  forgot_password,
  UpdateUer,
  change_password,
  get_status,
} = require("../Controllers/user");
const {
  postRide,
  getRide,
  processRides,
  getOldBooking,
  getOldRides,
  getRoutes,
  getRideDetails,
  CencelBooking,
} = require("../Controllers/ride");
const { addSuggestion } = require("../Controllers/suggestion");
const { addChat, getChat } = require("../Controllers/chat");
// ***************** [User Routes] *****************  //
router.post("/signup", signup);
router.post("/login", login);
router.get("/get_user", validateAuth, get_user);
router.post("/forgotPassword", forgot_password);
router.post("/updateUser/:userId", UpdateUer);
router.post("/changePassword", validateAuth, change_password);
router.get("/getStatus", validateAuth, get_status);

//  ***************** [Ride Routes] *****************  //
router.post("/postRide", validateAuth, postRide);
router.post("/getRide", validateAuth, getRide);
router.post("/processRide", validateAuth, processRides);
router.post("/getOldBooking", getOldBooking);
router.post("/getOldRides", validateAuth, getOldRides);
router.get("/getRoutes", getRoutes);
router.post("/getRideDetails", getRideDetails);
router.post("/cencelBooking", CencelBooking);

//  ***************** [Suggestion Routes] *****************  //
router.post("/suggestion", addSuggestion);

//  ***************** [Chat Routes] *****************  //
router.post("/postChat", addChat);
router.get("/getChat", getChat);

module.exports = router;
