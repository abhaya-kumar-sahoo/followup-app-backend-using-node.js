const express = require("express");
const auth = require("../../middleware/authenticate");
const router = express.Router();
const AddProjectSchema = require("../../schema/projectSchema");

router.post("/project_dates", auth, async (req, res) => {
  const data = await AddProjectSchema.find({ postedBy: req.user._id }).select({
    created_date: 1,
    created_time: 1,
  });

  return res.send({ msg: "Successful", data });
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
