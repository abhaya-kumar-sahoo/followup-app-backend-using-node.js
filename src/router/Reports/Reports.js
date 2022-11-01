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
    .distinct("project_comments.created_date")
    .sort();

  return res.send({ msg: "Successful", data, error: false });
});

router.post("/comments_by_date", auth, async (req, res) => {
  const { date, project_id } = req.body;
  const data = await PostSchema.aggregate([
    { $match: { $and: [{ project_id }] } },

    {
      $unwind: "$project_comments",
    },
    {
      $match: {
        $and: [
          { "project_comments.created_date.year": date.year },
          { "project_comments.created_date.month": date.month },
          { "project_comments.created_date.day": { $gte: date.day } },
          { "project_comments.created_date.day": { $lte: date.day + 31 } },
        ],
      },
    },
  ]).exec((err, result) => {
    if (err) {
      return res.send({ msg: err, data: [], error: true });
    }
    PostSchema.populate(
      result,
      { path: "postedBy", select: "name image" },
      (err, res1) => {
        return res.send({ msg: "Successful", data: res1, error: false });
      }
    );
  });
});

const Reports = router;
module.exports = Reports;
