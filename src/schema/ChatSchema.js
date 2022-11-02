const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const ChatSchema = new mongoose.Schema({
  project_id: String,
  chats: [
    {
      text: {
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
    },
  ],
});

module.exports = mongoose.model("ChatsList", ChatSchema);
