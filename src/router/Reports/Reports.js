const express = require("express");
const auth = require("../../middleware/authenticate");
const router = express.Router();
const AddProjectSchema = require("../../schema/projectSchema");
const PostSchema = require("../../schema/postSchema");
router.post("/project_dates", auth, async (req, res) => {
  const { project_id } = req.body;

  const data = await PostSchema.find({ project_id })
    .select({
      "project_comments.created_date": 1,
    })
    .distinct("project_comments.created_date");
  // .select({
  //   created_date: 1,
  // })

  return res.send({ msg: "Successful", data, error: false });
});

router.post("/project_details", auth, async (req, res) => {
  const { date } = req.body;
  const data = await AddProjectSchema.find({
    postedBy: req.user._id,
    created_date: {
      $eq: date,
    },
  });
  return res.send({ msg: "Successful", data });
});

const Reports = router;
module.exports = Reports;
