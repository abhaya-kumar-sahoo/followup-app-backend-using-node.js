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
        type: Object,
      },
      created_time: {
        type: Object,
      },
      isCompleted: {
        type: Boolean,
        default: false,
      },
    },
  ],
  project_id: {
    type: String,
  },
  created_date: {
    type: Object,
  },
  created_time: {
    type: Object,
  },
  postedBy: {
    type: ObjectId,
    ref: "Registration",
  },
});

module.exports = mongoose.model("PostList", PostSchema);
