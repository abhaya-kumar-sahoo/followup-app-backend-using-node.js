const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const today = new Date();
var date = parseInt(
  new Date().toJSON().slice(0, 10).replace("-", "").replace("-", "")
);
var time = parseInt(
  `${today.getHours()}${today.getMinutes()}${today.getSeconds()}`
);
const PostSchema = new mongoose.Schema({
  project_comments: [
    {
      title: {
        type: String,
        default: "",
      },
      description: {
        type: String,
        default: "",
      },
      created_date: {
        type: Number,
        default: date,
      },
      created_time: {
        type: Number,
        date: time,
      },
    },
  ],
  project_id: {
    type: String,
  },
  created_date: {
    type: Number,
    default: date,
  },
  created_time: {
    type: Number,
    date: time,
  },
  postedBy: {
    type: ObjectId,
    ref: "Registration",
  },
});

module.exports = mongoose.model("PostList", PostSchema);
