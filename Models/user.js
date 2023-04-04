const mongoose = require("mongoose");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
    },
    phone: {
      type: Number,
    },
    DOB: {
      type: Date,
    },
    password: {
      type: String,
    },

    profile_image: {
      type: String,
    },

    refrel_code: {
      type: Number,
    },

    is_refrel_code_used: {
      type: Boolean,
      default: false,
    },

    refrel_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    refred_user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    secuirty_questions_for_password_reset: [
      {
        question: {
          type: String,
        },
        answer: {
          type: String,
        },
      },
    ],

    id_card_number: {
      type: String,
      default: "",
    },

    car_name: {
      type: String,
      default: "",
    },

    car_model: {
      type: String,
      default: "",
    },

    company_name: {
      type: String,
      default: "",
    },
    reference: {
      type: String,
      default: "",
    },
  },

  { timestamps: true }
);

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, email: this.email },
    process.env.JWT_SECRET_KEY
  );
  return token;
};

// before saving the user to the database, hash the password

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// generate a refrel code for the user when the user is created for the first time of 4 digits

userSchema.pre("save", async function (next) {
  var user = this;
  if (!user.isNew) return next();
  var refrel_code = Math.floor(1000 + Math.random() * 9000);
  user.refrel_code = refrel_code;
  next();
});

// compare the password entered by the user to the hashed password stored in the database

userSchema.methods.comparePassword = async function (enteredPassword) {
  const is_valid = await bcrypt.compare(enteredPassword, this.password);
  return is_valid;
};

// validate the user input

const validateUser = (user) => {
  const schema = Joi.object({
    firstName: Joi.string().insensitive().required(),
    lastName: Joi.string().insensitive().required(),
    email: Joi.string().email().insensitive().required(),
    phone: Joi.number().integer().required(),
    DOB: Joi.date().required(),
    password: Joi.required(),
    secuirty_questions_for_password_reset: Joi.array().items(
      Joi.object({
        question: Joi.string().required(),
        answer: Joi.string().required(),
      })
    ),
    refrel_code: Joi.number().integer(),
  });

  return schema.validate(user);
};

const validate_login = async (user) => {
  const schema = Joi.object({
    email: Joi.string().email().insensitive().required(),
    password: Joi.required(),
  });

  return schema.validate(user);
};

const validate_forget_password = async (user) => {
  const schema = Joi.object({
    email: Joi.string().email().insensitive().required(),
    secuirty_questions_for_password_reset: Joi.array().items(
      Joi.object({
        question: Joi.string().required(),
        answer: Joi.string().required(),
      })
    ),
    password: Joi.required(),
  });

  return schema.validate(user);
};

const validate_update_profile = async (user) => {
  const schema = Joi.object({
    firstName: Joi.string().insensitive().required(),
    lastName: Joi.string().insensitive().required(),
    phone: Joi.number().integer().required(),
    DOB: Joi.date().required(),
    id_card_number: Joi.string().required(),
    car_name: Joi.string().required(),
    car_model: Joi.string().required(),
    company_name: Joi.string().required(),
    reference: Joi.string().allow("", null),
  });

  return schema.validate(user);
};

const validate_change_password = async (user) => {
  const schema = Joi.object({
    old_password: Joi.required(),
    password: Joi.required(),
  });

  return schema.validate(user);
};

const User = mongoose.model("User", userSchema);

module.exports.User = User;
module.exports.validateUser = validateUser;
module.exports.validate_login = validate_login;
module.exports.validate_forget_password = validate_forget_password;
module.exports.validate_update_profile = validate_update_profile;
module.exports.validate_change_password = validate_change_password;
