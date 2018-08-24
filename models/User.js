const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    validate: {
      validator: value => {
        return validator.isEmail(value);
      },
      message: "{VALUE} is not a valid email address"
    }
  },
  password: {
    type: String
  }
});

module.exports = mongoose.model("users", userSchema);
