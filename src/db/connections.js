const mongoose = require("mongoose");
// const db= process.env.URI
var colors = require("colors");
const uri =
  "mongodb+srv://abhaya:p4Jqyxbu5Y2aTaNz@database.z6shd.mongodb.net/database?retryWrites=true&w=majority";

mongoose.connect(
  uri,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (!err) {
      console.log("MongoDB Connection Succeeded.".bgBlue.bold);
    } else {
      console.log("Error in DB connection : ".bgRed + err);
    }
  }
);
