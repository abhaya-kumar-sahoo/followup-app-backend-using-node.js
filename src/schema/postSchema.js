const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "",
    },
    project_id: {
      type: String,
    },
    description: {
      type: String,
      default: "",
    },
    date: String,
    postedBy: {
      type: ObjectId,
      ref: "Registration",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PostList", PostSchema);
