const mongoose = require("mongoose");
const Joi = require("joi");

const SecurityQuestionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
    },
    answer: {
      type: String,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const SecurityQuestion = mongoose.model(
  "SecurityQuestion",
  SecurityQuestionSchema
);

function validateSecurityQuestion(securityQuestion) {
  const schema = Joi.object({
    question: Joi.string().required(),
    answer: Joi.string().required(),
    user_id: Joi.string().required(),
  });
  return schema.validate(securityQuestion);
}

module.exports.SecurityQuestion = SecurityQuestion;
module.exports.validateSecurityQuestion = validateSecurityQuestion;
