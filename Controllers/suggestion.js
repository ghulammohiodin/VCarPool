const { Suggestion, validateSuggestion } = require("../Models/suggestion");
const Joi = require("joi");
const _ = require("underscore");

const addSuggestion = async (req, res) => {
  try {
    const { error } = await validateSuggestion(req.body);
    if (error) {
      return res.status(400).json({
        code: 400,
        message: error.details[0].message.replace(/"/g, ""),
      });
    }

    const suggestion = new Suggestion({
      ...req.body,
    });

    const savedSuggestion = await suggestion.save();

    return res.status(200).json({
      code: 200,
      message: "Suggestion added successfully",
      suggestion: savedSuggestion,
    });
  } catch (e) {
    return res.status(400).json({
      code: 400,
      message: e,
    });
  }
};

module.exports = {
  addSuggestion,
};
