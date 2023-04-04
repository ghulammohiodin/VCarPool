const mongoose = require("mongoose");

// Connect to the database

const database_connecttion_function = async (mongodb_url) => {
  try {
    await mongoose.connect(mongodb_url);
    console.log("Database Connected Successfully");
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  database_connecttion_function,
};
