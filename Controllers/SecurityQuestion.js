const {
  SecurityQuestion,
  validateSecurityQuestion,
} = require("../Models/SecurityQuestion");

const add_security_question = async (req, res) => {
  try {
    const { error } = validateSecurityQuestion(req.body);
    if (error) {
      return res.status(400).json({
        code: 400,
        message: error.details[0].message.replace(/"/g, ""),
      });
    }

    const security_question = new SecurityQuestion({
      ...req.body,
    });

    const savedSecurityQuestion = await security_question.save();

    return res.status(200).json({
      code: 200,
      message: "Security Question added successfully",
      security_question: savedSecurityQuestion,
    });
  } catch (error) {
    return res.status(400).json({
      code: 400,
      message: error,
    });
  }
};

const list_security_question = async (req, res) => {
  try {
    const security_question = await SecurityQuestion.find();
    return res.status(200).json({
      code: 200,
      message: "Security Question list",
      security_question,
    });
  } catch (error) {
    return res.status(400).json({
      code: 400,
      message: error,
    });
  }
};

const get_security_question = async (req, res) => {
  try {
    const security_question = await SecurityQuestion.findById(req.params.id);

    return res.status(200).json({
      code: 200,
      message: "Security Question",
      security_question,
    });
  } catch (error) {
    return res.status(400).json({
      code: 400,
      message: error,
    });
  }
};

module.exports = {
  add_security_question,
  list_security_question,
  get_security_question,
};
