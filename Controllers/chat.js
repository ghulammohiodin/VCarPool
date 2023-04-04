const { Chat, validate_chat } = require("../Models/chat");

const addChat = async (req, res) => {
  try {
    const { error } = validate_chat(req.body);
    if (error) {
      res.status(400).json({
        code: 400,
        message: error.details[0].message.replace(/"/g, ""),
      });
    }

    var chat = new Chat({
      username: req.body.username,
      message: req.body.message,
    });

    chat = await chat.save();
    res.status(200).json({
      code: 200,
      message: "Chat added successfully",
      data: chat,
    });
  } catch (e) {
    res.status(400).json({
      code: 400,
      message: e,
    });
  }
};

const getChat = async (req, res) => {
  try {
    const chat = await Chat.find();
    res.status(200).json({
      code: 200,
      message: "Chat fetched successfully",
      data: chat,
    });
  } catch (e) {
    res.status(400).json({
      code: 400,
      message: e,
    });
  }
};

module.exports = {
  addChat,
  getChat,
};
