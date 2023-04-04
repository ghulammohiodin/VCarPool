const mongoose = require("mongoose");
const Joi = require("joi");
const chatSchema = new mongoose.Schema(
  {
    username: {
      type: String,
    },
    message: {
      type: String,
    },
  },
  { timestamps: true }
);

const validate_chat = (chat) => {
  const schema = Joi.object({
    username: Joi.string().required(),
    message: Joi.string().required(),
  });
  return schema.validate(chat);
};

const Chat = mongoose.model("Chat", chatSchema);
module.exports.Chat = Chat;
module.exports.validate_chat = validate_chat;
