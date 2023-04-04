const mongoose = require("mongoose");
const Joi = require("joi");

const suggestionSchema = new mongoose.Schema(
  {
    suggestionId: {
      type: mongoose.Types.ObjectId,
      default: new mongoose.Types.ObjectId(),
    },
    title: {
      type: String,
    },
    message: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const validateSuggestion = async (suggestion) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    message: Joi.string().required(),
  });
  return schema.validate(suggestion);
};

const Suggestion = mongoose.model("Suggestion", suggestionSchema);

module.exports.Suggestion = Suggestion;
module.exports.validateSuggestion = validateSuggestion;
