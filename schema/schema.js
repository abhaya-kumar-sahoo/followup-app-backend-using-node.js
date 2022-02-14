const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    number: {
      type: String,
      required: false,
    },
    requestId: {
      type: String,
      required: false,
    },
    img: {
      type: String,
    },
    name: {
      type: String,
    },

    dob: {
      type: Number,
    },
    gender: {
      type: String,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    activities: [
      {
        productId: Number,
        date: String,
        time: { hour: String, minutes: String },
        entry: String,
        like: String,
        imp: String,
      },
    ],
    active: {
      type: Boolean,
      default: true,
    },
    modifiedOn: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("Journey", userSchema);

module.exports = User;
