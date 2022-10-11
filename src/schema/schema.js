const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required:true
    },

    password: {
      type: String,
      required:true
    }
  },
  { timestamps: true }
);

const User = mongoose.model("Registration", userSchema);

module.exports = User;
