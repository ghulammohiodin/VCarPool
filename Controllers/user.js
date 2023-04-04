const {
  User,
  validateUser,
  validate_login,
  validate_forget_password,
  validate_update_profile,
  validate_change_password,
} = require("../Models/user");
const { Ride, validateRide, get_ride_validation } = require("../Models/ride");
const bcrypt = require("bcrypt");

const { COMMPARE_QUESTION_ANSWER } = require("../utils/utils");

// sign up a new user

const signup = async (req, res) => {
  try {
    const { error } = validateUser(req.body);
    if (error) {
      return res.status(400).json({
        code: 400,
        message: error.details[0].message.replace(/"/g, ""),
      });
    }

    //check if the user already exists

    var existing_user = await User.findOne({ email: req.body.email });
    if (existing_user) {
      return res.status(400).json({
        code: 400,
        message: "User already exists",
      });
    }

    // create a new user

    var user = new User({
      ...req.body,
    });

    // save the user to the database
    user = await user.save();

    if (
      body.refrel_code != null &&
      body.refrel_code != "" &&
      body.refrel_code != undefined
    ) {
      // find user by refrel code

      var refreal_uuser = await User.findOne({
        refrel_code: req.body.refrel_code,
      });

      if (refreal_uuser) {
        // add refreal code to the user

        user.is_refrel_code_used = true;
        user.refrel_id = refreal_uuser._id;
        // save the user to the database
        user = await user.save();
        // add refred user to the refreal user
        refreal_uuser.refred_user_id = user._id;
        // save the user to the database
        refreal_uuser = await refreal_uuser.save();
      }
    }

    var token = user.generateAuthToken();

    return res.status(200).json({
      code: 200,
      message: "User created successfully",
      user,
      token,
    });
  } catch (e) {
    return res.status(400).json({
      code: 400,
      message: e,
    });
  }
};

// login a user

const login = async (req, res) => {
  try {
    console.log(req.body);
    const { error } = await validate_login(req.body);
    if (error) {
      return res.status(400).json({
        code: 400,
        message: error.details[0].message.replace(/"/g, ""),
      });
    }

    // check if the user exists

    var existing_user = await User.findOne({ email: req.body.email });

    if (!existing_user) {
      return res.status(400).json({
        code: 400,
        message: "Invalid email or password",
      });
    }

    // compare the password entered by the user to the hashed password stored in the database

    const is_valid = await bcrypt.compare(
      req.body.password,
      existing_user.password
    );

    if (!is_valid) {
      return res.status(400).json({
        code: 400,
        message: "Invalid email or password",
      });
    }

    // generate a token for the user

    var token = existing_user.generateAuthToken();

    return res.status(200).json({
      code: 200,
      message: "User logged in successfully",
      user: existing_user,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      code: 400,
      message: error,
    });
  }
};

const get_user = async (req, res) => {
  try {
    var user = await User.findById(req.user._id).select("-password");
    return res.status(200).json({
      code: 200,
      message: "User Profile",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      code: 400,
      message: error,
    });
  }
};

// forgt password
const forgot_password = async (req, res) => {
  try {
    const { error } = await validate_forget_password(req.body);
    if (error) {
      return res.status(400).json({
        code: 400,
        message: error.details[0].message.replace(/"/g, ""),
      });
    }

    // check if the user exists

    var user_exist = await User.findOne({ email: req.body.email });

    if (!user_exist) {
      return res.status(400).json({
        code: 400,
        message: "Invalid email",
      });
    }

    // check if the question and answer match

    const is_valid = await COMMPARE_QUESTION_ANSWER(
      req.body.secuirty_questions_for_password_reset,
      user_exist.secuirty_questions_for_password_reset
    );

    if (!is_valid) {
      return res.status(400).json({
        code: 400,
        message: "Invalid question or answer",
      });
    }

    // update the password

    const salt = await bcrypt.genSalt(10);
    user_exist.password = await bcrypt.hash(req.body.password, salt);

    await user_exist.save();

    return res.status(200).json({
      code: 200,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      code: 400,
      message: error,
    });
  }
};

const UpdateUer = async (req, res) => {
  try {
    const { error } = await validate_update_profile(req.body);
    if (error) {
      return res.status(400).json({
        code: 400,
        message: error.details[0].message.replace(/"/g, ""),
      });
    }

    const { userId } = req.params;

    // find user by id

    var user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(400).json({
        code: 400,
        message: "User not found",
      });
    }

    // update user

    user = await User.findOneAndUpdate(
      {
        _id: userId,
      },
      req.body,
      { new: true }
    );

    return res.status(200).json({
      code: 200,
      message: "User updated successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      code: 400,
      message: error,
    });
  }
};

const change_password = async (req, res) => {
  try {
    const { error } = await validate_change_password(req.body);
    if (error) {
      return res.status(400).json({
        code: 400,
        message: error.details[0].message.replace(/"/g, ""),
      });
    }
    var user = await User.findById(req.user._id);

    // compare the password entered by the user to the hashed password stored in the database

    const is_valid = await bcrypt.compare(req.body.old_password, user.password);

    if (!is_valid) {
      return res.status(400).json({
        code: 400,
        message: "Invalid old password",
      });
    }

    // update the password

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);

    await user.save();

    return res.status(200).json({
      code: 200,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      code: 400,
      message: error,
    });
  }
};

const get_status = async (req, res) => {
  try {
    var user_count = await User.countDocuments();
    var ride_count = await Ride.countDocuments();

    return res.status(200).json({
      code: 200,
      message: "Status",
      user_count,
      ride_count,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      code: 400,
      message: error,
    });
  }
};

module.exports = {
  signup,
  login,
  get_user,
  forgot_password,
  UpdateUer,
  change_password,
  get_status,
};
