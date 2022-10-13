const express = require("express");
const auth = require("../../middleware/authenticate");
const AddProjectSchema = require("../../schema/projectSchema");
const router = express.Router();

router.post("/my_projects", auth, async (req, res) => {
  const data = await AddProjectSchema.find({ postedBy: req.user._id }).populate(
    "postedBy",
    "_id name"
  );
  if (data) {
    return res.send({ msg: "Success", data, error: false });
  }
  return res.send({ msg: "Something went wrong", data: [], error: true });
});

const MyProjects = router;
module.exports = MyProjects;
