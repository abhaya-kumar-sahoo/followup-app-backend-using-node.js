const express = require("express");
const auth = require("../../middleware/authenticate");
const AddProjectSchema = require("../../schema/projectSchema");
const router = express.Router();

router.post("/my_projects", auth, async (req, res) => {
  const data = await AddProjectSchema.find({ postedBy: req.user._id }).populate(
    "postedBy",
    "_id name"
  );

  return res.send({ msg: "Success", data });
});

const MyProjects = router;
module.exports = MyProjects;

//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MzQyNDljOGFjMTgzZWMyMGIxZjM4N2YiLCJpYXQiOjE2NjUyODg2NTR9.wFFkE-HT1YddDsIj443-VbSNWSFq3zOQ-66bEVd2fKo
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MzQxODU0YmE1OTVkYWY4OGQ4Y2YyNWMiLCJpYXQiOjE2NjUyODc5ODh9.G3CL7q4VgmtUUE6616oE4fVi-fb_5uQWFlvm-VO-QDs
