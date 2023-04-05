const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: [
      true,
      "this username is already taken by other user, try different username",
    ],
    trim: true,
    minlength: 2,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is invalid");
      }
    },
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },

  isOnline: {
    type: Boolean,
    default: false,
  },
});

const user = mongoose.model("user", userSchema);

module.exports = user;
