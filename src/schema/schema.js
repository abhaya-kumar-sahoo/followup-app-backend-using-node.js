const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    // required: true,
  },
  image: {
    // data: Buffer,
    // contentType: String,
    type: String,
    default: null,
  },
  password: {
    type: String,
    // required: true,
  },
  selected: {
    type: Boolean,
    default: false,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  created_date: {
    type: Object,
  },
  created_time: {
    type: Object,
  },
});

const User = mongoose.model("Registration", userSchema);

module.exports = User;
