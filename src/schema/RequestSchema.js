const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const RequestUsersSchema = new mongoose.Schema({
  notification_data: Array,
});

module.exports = mongoose.model("Requests", RequestUsersSchema);
