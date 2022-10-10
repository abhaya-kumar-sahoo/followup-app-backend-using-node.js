const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const PostSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    date: String,
    postedBy: {
      type: ObjectId,
      ref: "Registration",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PostList", PostSchema);
